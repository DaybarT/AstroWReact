// export const prerender = false;
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";
// import csvParser from "csv-parser";
// import { format } from "fast-csv";

// // const dbPath = import.meta.env.dbShoes;
// const dbPath = path.join(process.cwd(), 'src', 'data', 'dbShoes.csv');

// export async function POST({request}) {
//     try {
//       const { csv: newDataArray } = await request.json();
  
//       if (!Array.isArray(newDataArray)) {
//         return new Response(JSON.stringify({ error: "El formato de datos es incorrecto" }), { status: 400 });
//       }
  
//       const headers = ["SKU", "model", "img"];
//       const writeStream = fs.createWriteStream(dbPath);
//       const csvStream = format({ headers: headers, writeHeaders: true });
  
//       csvStream.pipe(writeStream);
  
//       newDataArray.forEach((item) => {
//         csvStream.write({
//           SKU: item.SKU || "",
//           model: item.model || "",
//           img: item.img || ""
//         });
//       });
  
//       csvStream.end();
//       console.log("CSV actualizado con los nuevos datos.");
  
//       return new Response(JSON.stringify({ message: "Datos actualizados correctamente", status: true }), { status: 200 });
//     } catch (error) {
//       console.error("Error al actualizar el CSV:", error);
//       return new Response(JSON.stringify({ error: "Error al procesar la solicitud", status: false }), { status: 500 });
//     }
//   }
