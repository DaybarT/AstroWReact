/* export const prerender = false;
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import csvParser from 'csv-parser';
import { format } from 'fast-csv';

const dbPath = import.meta.env.dbShoes;
const stockPath = import.meta.env.stock;

export async function POST({ newData }) {
  const results = [];
  let headers = [];
  
  if (!fs.existsSync(stockPath)) {
    const header = ['SKU', 'Title', 'img', 'sizes','price'];
    fs.writeFileSync(stockPath, `${header.join(',')}\n`);
    console.log("Archivo creado con cabeceras.");
    return;
  }

  const data = await new Promise((resolve, reject) => {
    const parsedData = [];
    fs.createReadStream(stockPath)
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
            rowObj.sizes = rowObj.sizes ? rowObj.sizes.split('|').map(Number) : [];
            parsedData.push(rowObj);
          }
        }
      })
      .on('end', () => resolve(parsedData))
      .on('error', (err) => reject("Error al leer el archivo CSV: " + err));
  });

  const existingItem = data.find((item) => item.SKU === newData.SKU);

  if (existingItem) {
    const existingSizes = existingItem.sizes || [];
    const newSizes = newData.sizes || [];
    const updatedSizes = Array.from(new Set([...existingSizes, ...newSizes])).sort((a, b) => a - b);
    existingItem.sizes = updatedSizes;
    console.log(`Actualizado SKU ${newData.SKU} con nuevas tallas: ${updatedSizes.join(', ')}`);
  } else {
    results.push({
      SKU: newData.SKU,
      Title: newData.Title,
      img: newData.img,
      sizes: newData.sizes.sort((a, b) => a - b),
      price: newData.price
    });
    console.log(`Nuevo SKU agregado: ${newData.SKU}`);
  }

  const writeStream = fs.createWriteStream(stockPath);
  const csvStream = format({ headers: true });

  csvStream.pipe(writeStream);
  [...data, ...results].forEach((item) => {
    csvStream.write({ ...item, sizes: item.sizes.join('|') });
  });

  csvStream.end();
}
 */