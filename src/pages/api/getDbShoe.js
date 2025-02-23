export const prerender = false;
import fs from "fs";
import csvParser from "csv-parser";
import path from "path";
import { fileURLToPath } from "url";

// const dbPath = import.meta.env.dbShoes;
const dbPath = path.join(process.cwd(), 'src', 'data', 'dbShoes.csv');

export async function GET() {
  if (!fs.existsSync(dbPath)) {
    console.log("Error: Archivo de stock no encontrado");
    return new Response(JSON.stringify({ error: "Archivo de stock no encontrado" }), { status: 404 });
  }

  const data = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(dbPath)
      .pipe(csvParser())
      .on("data", (row) => {
        data.push(row);
      })
      .on("end", () => {
        resolve(new Response(JSON.stringify(data), { status: 200 }));
      })
      .on("error", (err) => {
        console.log("Error al leer el archivo:", err.message);
        reject(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
      });
  });
}