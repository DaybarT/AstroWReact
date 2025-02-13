// src/pages/api/getStock.js

import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';

export async function GET() {
  const filePath = path.resolve("./data/stock.csv");

  if (!fs.existsSync(filePath)) {
    return new Response(JSON.stringify({ error: "Archivo de stock no encontrado" }), { status: 404 });
  }

  const data = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
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
