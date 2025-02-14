// src/pages/api/getStock.js
export const prerender = false;
import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';

const stockPath = import.meta.env.stock;

export async function GET() {

  if (!fs.existsSync(stockPath)) {
    return new Response(JSON.stringify({ error: "Archivo de stock no encontrado" }), { status: 404 });
  }

  const data = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(stockPath)
      .pipe(csvParser())
      .on("data", (row) => {
        data.push(row);
      })
      .on("end", () => {
        resolve(new Response(JSON.stringify(data), { status: 200 }));
      })
      .on("error", (err) => {
        reject(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
      });
  });
}
