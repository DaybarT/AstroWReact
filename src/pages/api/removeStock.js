export const prerender = false;
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import csvParser from 'csv-parser';
import { format } from 'fast-csv';

const dbPath = import.meta.env.dbShoes;

export async function POST({ newData }) {
  if (!fs.existsSync(dbPath)) {
    console.log("El archivo no existe. No hay stock para eliminar.");
    return;
  }

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

  const filteredData = data.filter(item => item.SKU !== SKU);

  if (filteredData.length === data.length) {
    console.log(`El SKU ${SKU} no se encontró en el stock.`);
    return;
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
}