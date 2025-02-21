// src/pages/api/getStock.js
export const prerender = false;
import fs from "fs";
import path from "path";
import csvParser from "csv-parser";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
// const { HypeBoost, Laced } = require("../scrappers/Scrappers");

const dbPath = path.resolve(process.cwd(), "public/data/dbShoes.csv");

export async function GET() {
  try {
    const shoes = [];
    // Autenticación con Google
    const auth = new JWT({
      email: import.meta.env.CLIENT_EMAIL,
      key: import.meta.env.PRIVATE_KEY,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    // Conectar con la hoja de cálculo
    const doc = new GoogleSpreadsheet(import.meta.env.SHEET_ID, auth);

    // Cargar información de la hoja
    await doc.loadInfo();

    // Obtener la hoja llamada "INSTOCK"
    const sheet = doc.sheetsByTitle["INSTOCK"];
    if (!sheet) throw new Error("No se encontró la hoja INSTOCK");

    // Leer las filas desde A2 hasta D100
    const rows = await sheet.getRows({ limit: 99 });

    for (const row of rows) {
      const SKU = row._rawData[0];
      const model = row._rawData[1];
      const size = row._rawData[2];
      const price = row._rawData[3];

      // Buscar si el zapato ya existe en el array `shoes`
      let existingShoe = shoes.find((shoe) => shoe.SKU === SKU);

      if (existingShoe) {
        // Si ya existe, solo añadimos la nueva talla y precio
        existingShoe.size_prices.push({ size, price });
      } else {
        // Si no existe, creamos un nuevo zapato
        let newShoe = {
          SKU,
          model,
          size_prices: [{ size, price }],
        };

        // Buscar en la base de datos si hay más datos (imagen, modelo, etc.)
        const ifExist = await findDataExist(SKU);
        if (ifExist) {
          newShoe.img = ifExist.img;
          newShoe.model = ifExist.model;
        }

        shoes.push(newShoe);
      }
    }

    return new Response(JSON.stringify(shoes), { status: 200 });
  } catch (error) {
    console.error("Error al acceder a Google Sheets:", error);
  }
}

async function findDataExist(newData) {
  try {
    // Usamos una Promise para envolver la lectura del archivo CSV
    const fileData = await new Promise((resolve, reject) => {
      const results = [];
      let headers = [];

      // Leer el archivo CSV, asegurándose de que las cabeceras se usen correctamente
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

    // Verificar si hay datos en el archivo
    if (fileData.length === 0) {
      console.log("No se encontraron datos en el archivo.");
      return null; // Si el archivo está vacío, retornamos null
    }

    // Asegurarnos de hacer un trim() de los valores de SKU para evitar errores por espacios adicionales
    const existingItem = fileData.find(
      (item) =>
        item.SKU && item.SKU.trim().toUpperCase() === newData.toUpperCase()
    );

    // Devolvemos el objeto si lo encontramos, o false si no
    return existingItem || false;
  } catch (error) {
    console.error("Error al leer o procesar el archivo:", error);
    return null; // Si ocurre algún error, devolvemos null
  }
}

export async function addData(newData) {
  const results = [];
  let headers = []; // Para almacenar los encabezados manualmente

  // Verificar si el archivo CSV existe
  if (!fs.existsSync(dbPath)) {
    // Si no existe, creamos un archivo vacío con las cabeceras
    const header = ["SKU", "model", "img"]; // Aquí añadimos las columnas
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
    return false; // Si el SKU ya existe, no lo añadimos
  }

  // Si el SKU no existe, añadir el nuevo producto
  results.push({
    SKU: newData.SKU,
    model: newData.model,
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
    if (item.SKU && item.model && item.img) {
      // Asegurarse de que los campos no estén vacíos
      csvStream.write(item);
    }
  });

  csvStream.end(); // Finalizamos la escritura
}
