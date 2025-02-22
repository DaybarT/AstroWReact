// export const prerender = false;

// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";
// import csvParser from "csv-parser";
// import { format } from "fast-csv";

// const dbPath = import.meta.env.dbShoes;
// const stockPath = import.meta.env.stock;

// export async function POST({ request }) {
//   try {
//     const newData = await request.json();
//     let headers = [];

//     if (!fs.existsSync(stockPath)) {
//       console.log("El archivo no existe. No hay stock para modificar.");
//       return new Response(
//         JSON.stringify({
//           success: false,
//           message: "Archivo de stock no encontrado",
//         }),
//         { status: 404 }
//       );
//     }

//     const data = await new Promise((resolve, reject) => {
//       const parsedData = [];
//       fs.createReadStream(stockPath)
//         .pipe(csvParser({ headers: false, skipEmptyLines: true }))
//         .on("data", (row) => {
//           if (headers.length === 0) {
//             headers = Object.values(row);
//           } else {
//             const rowObj = {};
//             Object.entries(row).forEach(([index, value]) => {
//               rowObj[headers[index]] = value;
//             });

//             if (rowObj.SKU && rowObj.SKU.trim() !== "SKU") {
//               rowObj.sizes = rowObj.sizes
//                 ? rowObj.sizes.split("|").map(Number)
//                 : [];
//               parsedData.push(rowObj);
//             }
//           }
//         })
//         .on("end", () => resolve(parsedData))
//         .on("error", (err) => reject("Error al leer el archivo CSV: " + err));
//     });

//     const existingItem = data.find((item) => item.SKU === newData.SKU);

//     if (existingItem) {
//       const existingSizes = existingItem.sizes || [];
//       const sizesToRemove = newData.sizes || [];

//       // Filtrar las tallas que se deben eliminar
//       const updatedSizes = existingSizes.filter(
//         (size) => !sizesToRemove.includes(size)
//       );

//       // Si se han eliminado tallas, devolvemos `true`, sino `false`

//       if (updatedSizes.length == 0 || updatedSizes == ""){
//         console.log("no hay stock");
//         //aqui mete que elimine el stock directamente
//       }
//       if (updatedSizes.length === existingSizes.length) {
//         console.log(
//           `No se eliminaron tallas para SKU ${newData.SKU}, ya que no coincidían.`
//         );
//         return new Response(
//           JSON.stringify({
//             success: false,
//             message: "No se eliminaron tallas",
//           }),
//           { status: 400 }
//         );
//       } else {
//         console.log(
//           `Tallas ${sizesToRemove.join(", ")} eliminadas del SKU ${
//             newData.SKU
//           }.`
//         );
//         existingItem.sizes = updatedSizes;

//         // Escribir los datos actualizados de vuelta al archivo CSV
//         const writeStream = fs.createWriteStream(stockPath);
//         const csvStream = format({ headers: true });

//         csvStream.pipe(writeStream);
//         data.forEach((item) => {
//           csvStream.write({ ...item, sizes: item.sizes.join("|") });
//         });

//         csvStream.end();

//         // Devolver `true` indicando que la eliminación fue exitosa
//         return new Response(
//           JSON.stringify({
//             success: true,
//             message: "Talla(s) eliminada(s) exitosamente",
//           }),
//           { status: 200 }
//         );
//       }
//     } else {
//       console.log(`El SKU ${newData.SKU} no existe en el stock.`);
//       return new Response(
//         JSON.stringify({ success: false, message: "SKU no encontrado" }),
//         { status: 404 }
//       );
//     }
//   } catch (error) {
//     console.error("Error inesperado:", error);
//     return new Response(
//       JSON.stringify({
//         success: false,
//         message: `Error inesperado: ${error.message}`,
//       }),
//       { status: 500 }
//     );
//   }
// }
