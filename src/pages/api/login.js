// export const prerender = false;
// import fs from "fs";
// import path from "path";
// import csvParser from "csv-parser";
// import { GoogleSpreadsheet } from "google-spreadsheet";
// import { JWT } from "google-auth-library";

// export async function POST({ request }) {

//   const cred = await request.json();

//   const auth = new JWT({
//         email: import.meta.env.CLIENT_EMAIL,
//         key: import.meta.env.PRIVATE_KEY,
//         scopes: ["https://www.googleapis.com/auth/spreadsheets"],
//       });

//       const doc = new GoogleSpreadsheet(import.meta.env.SHEET_ID, auth);

//       // Cargar información de la hoja
//       await doc.loadInfo();
  
//       // Obtener la hoja llamada "INSTOCK"
//       const sheet = doc.sheetsByTitle["DATA"];
//       if (!sheet) throw new Error("No se encontró la hoja INSTOCK");

//       await sheet.loadCells("O24:O25");

//       // Obtener valores de las celdas
//       const cellO24 = sheet.getCell(23, 14).value; // Fila 24, Columna O (Índice base 0)
//       const cellO25 = sheet.getCell(24, 14).value; // Fila 25, Columna O (Índice base 0)

//       if (cred.user === cellO24 && cred.password === cellO25){
//         return new Response(JSON.stringify({ status: true }),);
//       }else{
//         return new Response(JSON.stringify({ status: false }),);
//       }

// }

// export default async function login() {
//   const filePath = path.resolve("../../../data/user.csv");

//   const data = [];

//   return new Promise((resolve, reject) => {
//     fs.createReadStream(filePath)
//       .pipe(csvParser())
//       .on("data", (row) => {
//         data.push(row);
//       })
//       .on("end", () => {
//         resolve(new Response(JSON.stringify(data), { status: 200 }));
//       })
//       .on("error", (err) => {
//         reject(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
//       });
//   });
// }

// login().then(response => response.text().then(console.log)).catch(console.error);

/* function hashSHA256(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

const pass = "";
console.log(hashSHA256(pass)); */
