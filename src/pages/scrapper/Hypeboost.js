import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import axios from "axios";

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
  const { data } = await axios.get(url);
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

    console.log(productData);
    return productData;
  }
}
hypeboost_cheerio("HQ3073-100");
