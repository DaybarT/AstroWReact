import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import csvParser from "csv-parser";
import { format } from "fast-csv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "../../data/dbShoes.csv");

// Función para agregar datos al archivo CSV

export async function POST({ newData }) {
  const results = [];
  let headers = []; // Para almacenar los encabezados manualmente

  // Verificar si el archivo CSV existe
  if (!fs.existsSync(dbPath)) {
    // Si no existe, creamos un archivo vacío con las cabeceras
    const header = ["SKU", "Title", "img"]; // Aquí añadimos las columnas
    const writeStream = fs.createWriteStream(dbPath);
    format([header], { headers: false }).pipe(writeStream);
    console.log("Archivo creado con cabeceras.");
  }

  // Leer el archivo CSV y convertirlo en un array de objetos
  const data = await new Promise((resolve, reject) => {
    fs.createReadStream(dbPath)
      .pipe(csvParser({ headers: false, skipEmptyLines: true })) // Deshabilitamos los encabezados automáticos
      .on("data", (row) => {
        // Si es la primera fila, asignamos los encabezados manualmente
        if (headers.length === 0) {
          headers = Object.values(row); // Convertimos el objeto en un array de valores
        } else {
          // Para las filas siguientes, mapeamos los valores a los encabezados
          const rowObj = {};

          // Usamos Object.entries() para recorrer las claves y asignar los valores correctamente
          Object.entries(row).forEach(([index, value]) => {
            const header = headers[index];
            rowObj[header] = value; // Asignamos el valor a la clave del encabezado
          });

          if (rowObj.SKU && rowObj.SKU.trim() !== "SKU") {
            results.push(rowObj); // Añadimos cada fila válida al array de resultados
          }
        }
      })
      .on("end", () => {
        resolve(results); // Resolvemos la promesa con los resultados del CSV
      })
      .on("error", (err) => {
        reject("Error al leer el archivo CSV: " + err); // Rechazamos si hay un error
      });
  });

  // Verificar si el SKU ya existe en los datos leídos
  const existingItem = data.find((item) => item.SKU === newData.SKU);

  if (existingItem) {
    console.log(`El SKU ${newData.SKU} ya existe. No se añadirá.`);
    return; // Si el SKU ya existe, no lo añadimos
  }

  // Si el SKU no existe, añadir el nuevo producto
  results.push({
    SKU: newData.SKU,
    Title: newData.Title,
    img: newData.img,
  });

  console.log(`Nuevo SKU agregado: ${newData.SKU}`);

  // Escribir los datos actualizados de vuelta al archivo CSV
  const writeStream = fs.createWriteStream(dbPath);
  const csvStream = format({ headers: true });

  // Empezamos a escribir los datos al archivo
  csvStream.pipe(writeStream);

  // Escribir todas las filas (incluyendo la nueva si es necesario)
  results.forEach((item) => {
    if (item.SKU && item.Title && item.img) {
      // Asegurarse de que los campos no estén vacíos
      csvStream.write(item);
    }
  });

  csvStream.end(); // Finalizamos la escritura
}
