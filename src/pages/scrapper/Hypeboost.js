import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import axios from "axios";
import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';
import { format } from "fast-csv";

const dbPath = "../../../public/data/dbShoes.csv";

// export default async function hypeboost_puppeter(sku) {
//   // Lanza el navegador en modo headless (sin interfaz gráfica)
//   const browser = await puppeteer.launch();

//   // Abre una nueva página en el navegador
//   const page = await browser.newPage();

//   // Navega a la URL proporcionada
//   const url = "https://hypeboost.com/es/search/shop?keyword=" + sku.trim();
//   await page.goto(url, { waitUntil: "domcontentloaded" });

//   const spanText = await page.$eval(".grey", (span) => span.innerText);
//   console.log(spanText);

//   if (sku.trim() == spanText) {
//     const imgSrc = await page.$eval(".image img", (img) =>
//       img.getAttribute("src")
//     );
//     console.log(imgSrc);

//     const strongText = await page.$eval(
//       ".info strong",
//       (strong) => strong.innerText
//     );
//     console.log(strongText);

//     const data = {
//       SKU: spanText,
//       Title: strongText,
//       img: imgSrc,
//     };
//   }
//   // Cierra el navegador
//   await browser.close();

//   return data;
// }

//de momento no hace falta, sin funcionamiento
// const sizes = await page.$eval(".sizes", (div) => div.innerText);
//saca las tallas y los precios
//para hacer funcionar esto, hay que hacer que llegue a la pagina del producto.

export default async function hypeboost_cheerio(sku) {
  const url = "https://hypeboost.com/es/search/shop?keyword=" + sku.trim();
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
  };

  const { data } = await axios.get(url, { headers });
  const $ = cheerio.load(data);

  const spanText = $("span.grey").text();

  // Verificar si el SKU coincide con el texto
  if (sku.trim() === spanText) {
    const imgSrc = $("img").attr("src");
    const strongText = $("strong").text();

    // Crear el objeto con los datos que quieres devolver
    const productData = {
      SKU: spanText,
      Title: strongText,
      img: imgSrc,
    };

    /* console.log(productData);  */
    return productData;
  }
}
const dataShoe = hypeboost_cheerio("1201A906-001");
/* addDbShoe(dataShoe); */

/* Cheerio es infinitamente mas rapido que Puppeter, 
solo es usable para paginas web que no necesiten javascript para cargarse las tallas y los precios

Puppeter es util para cargar una web en la cual es neceserio que cargue el javascript para recuperar datos,
por ejemplo, Stockx. (no esta probado) */

export async function addDbShoe(newData){
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

