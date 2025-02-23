export const prerender = false;
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import csvParser from 'csv-parser';
import { format } from 'fast-csv';

const dbPath = import.meta.env.dbShoes;

export async function POST({ request }) {
  // Verificar si el archivo existe
  if (!fs.existsSync(dbPath)) {
    console.log("El archivo no existe. No hay stock para eliminar.");
    return new Response(
      JSON.stringify({status: false, message: "El archivo no existe. No hay stock para eliminar." }), 
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Obtener el SKU desde el cuerpo de la solicitud
  const { SKU } = await request.json();

  // Verificar si se proporcionó un SKU
  if (!SKU) {
    console.log("No se proporcionó un SKU para eliminar.");
    return new Response(
      JSON.stringify({status: false, message: "No se proporcionó un SKU para eliminar." }), 
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Leer y procesar el archivo CSV
  const data = await new Promise((resolve, reject) => {
    const parsedData = [];
    let headers = [];

    fs.createReadStream(dbPath)
      .pipe(csvParser({ headers: false, skipEmptyLines: true }))
      .on('data', (row) => {
        if (headers.length === 0) {
          headers = Object.values(row);
        } else {
          const rowObj = {};
          Object.entries(row).forEach(([index, value]) => {
            rowObj[headers[index]] = value;
          });

          if (rowObj.SKU && rowObj.SKU.trim() !== 'SKU') {
            parsedData.push(rowObj);
          }
        }
      })
      .on('end', () => resolve(parsedData))
      .on('error', (err) => reject("Error al leer el archivo CSV: " + err));
  });

  // Filtrar los datos eliminando el SKU
  const filteredData = data.filter(item => item.SKU !== SKU);

  // Si no se encontró el SKU
  if (filteredData.length === data.length) {
    console.log(`El SKU ${SKU} no se encontró en el stock.`);
    return new Response(
      JSON.stringify({ status: false,message: `El SKU ${SKU} no se encontró en el stock.` }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    );
  }

  console.log(`El SKU ${SKU} ha sido eliminado del stock.`);

  // Escribir los datos actualizados de vuelta al archivo CSV
  const writeStream = fs.createWriteStream(dbPath);
  const csvStream = format({ headers: true });

  csvStream.pipe(writeStream);
  filteredData.forEach(item => {
    csvStream.write(item);
  });

  csvStream.end();

  // Responder con éxito
  return new Response(
    JSON.stringify({ status: true,message: `El SKU ${SKU} ha sido eliminado correctamente.` }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}