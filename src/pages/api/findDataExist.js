export const prerender = false;
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import csvParser from 'csv-parser';
import { format } from 'fast-csv';

const dbPath = import.meta.env.dbShoes;
const stockPath = import.meta.env.stock;


// Función para buscar un SKU en el CSV
export async function POST({ newData }) {
  try {
    // Usamos una Promise para envolver la lectura del archivo CSV
    const fileData = await new Promise((resolve, reject) => {
      const results = [];
      let headers = [];

      // Leer el archivo CSV, asegurándose de que las cabeceras se usen correctamente
      fs.createReadStream(dbPath)
        .pipe(csvParser({ headers: false, skipEmptyLines: true })) // Deshabilitamos los encabezados automáticos
        .on('data', (row) => {
          // Si es la primera fila, asignamos los encabezados manualmente
          if (headers.length === 0) {
            headers = Object.values(row);  // Convertimos el objeto en un array de valores
          } else {
            // Para las filas siguientes, mapeamos los valores a los encabezados
            const rowObj = {};

            // Usamos Object.entries() para recorrer las claves y asignar los valores correctamente
            Object.entries(row).forEach(([index, value]) => {
              const header = headers[index];
              rowObj[header] = value; // Asignamos el valor a la clave del encabezado
            });

            if (rowObj.SKU && rowObj.SKU.trim() !== 'SKU') {
              results.push(rowObj); // Añadimos cada fila válida al array de resultados
            }
          }
        })
        .on('end', () => {
          resolve(results); // Resolvemos la promesa con los resultados del CSV
        })
        .on('error', (err) => {
          reject("Error al leer el archivo CSV: " + err); // Rechazamos si hay un error
        });
    });

    // Verificar si hay datos en el archivo
    if (fileData.length === 0) {
      console.log('No se encontraron datos en el archivo.');
      return null;  // Si el archivo está vacío, retornamos null
    }

    // Asegurarnos de hacer un trim() de los valores de SKU para evitar errores por espacios adicionales
    const existingItem = fileData.find((item) => item.SKU && item.SKU.trim().toUpperCase() === sku.toUpperCase());

    // Devolvemos el objeto si lo encontramos, o false si no
    return existingItem || false;
  } catch (error) {
    console.error("Error al leer o procesar el archivo:", error);
    return null; // Si ocurre algún error, devolvemos null
  }
}