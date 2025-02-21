import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import axios from "axios";
import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';
import { format } from "fast-csv";
import js_beautify from "js-beautify";

const dbPath = "../../../public/data/dbShoes.csv";

/* Cheerio es infinitamente mas rapido que Puppeter, 
solo es usable para paginas web que no necesiten javascript para cargarse las tallas y los precios

Puppeter es util para cargar una web en la cual es neceserio que cargue el javascript para recuperar datos,
por ejemplo, Stockx. (no esta probado) */

class HypeBoost {

  async cheerio(sku) {
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

      console.log(productData); 
      return productData;
    }
  }

  async puppeteer(sku) {
    const browser = await puppeteer.launch();

    // Abre una nueva página en el navegador
    const page = await browser.newPage();

    // Navega a la URL proporcionada
    const url = "https://hypeboost.com/es/search/shop?keyword=" + sku.trim();
    await page.goto(url, { waitUntil: "domcontentloaded" });

    const spanText = await page.$eval(".grey", (span) => span.innerText);
    console.log(spanText);

    if (sku.trim() == spanText) {
      const imgSrc = await page.$eval(".image img", (img) =>
        img.getAttribute("src")
      );
      console.log(imgSrc);

      const strongText = await page.$eval(
        ".info strong",
        (strong) => strong.innerText
      );
      console.log(strongText);

      const data = {
        SKU: spanText,
        Title: strongText,
        img: imgSrc,
      };
    }
    // Cierra el navegador
    await browser.close();

    return data;
  }
}

class Laced {
  async puppeteer(sku) {
    const browser = await puppeteer.launch();

    // Abre una nueva página en el navegador
    const page = await browser.newPage();

    // Navega a la URL proporcionada
    const url = "https://www.laced.com/search?query=%" + sku.trim();
    await page.goto(url, { waitUntil: "domcontentloaded" });

    await page.waitForSelector('[aria-label="ProductCard"]');


    const model = await page.$eval('[aria-label="ProductCard"] img', img => img.alt);
    const imgSrc = await page.$eval('[aria-label="ProductCard"] img', img => img.src);

    await browser.close();

    console.log(model);
    console.log(imgSrc);

  }
  async cheerio(sku) {
    const url = "https://www.laced.com/search?query=%" + sku.trim();
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
    };

    const { data } = await axios.get(url, { headers });
    const $ = cheerio.load(data);

    const datos = $('article[aria-label=ProductCard]').html(); //esto es un div, que dentro estan los datos que intento recoger abajo

    const contenido = cheerio.load(datos);

    const imagen = contenido("img").attr("src");
    console.log(imagen);
    const model = contenido("img").attr("alt");
    console.log(model);
  }
}

// (async () => {
//   const laced = new Laced();
//   await laced.puppeteer("HV6674-067");
// })();

(async () => {
  const hypeBoost = new HypeBoost();
  await hypeBoost.cheerio("HV6674-067");
})();

//https://sneakers123.com/es/sneaker/?q=FZ1151%20100

class Sneakers123 {
  async puppeteer(sku) {
    const browser = await puppeteer.launch();

    // Abre una nueva página en el navegador
    const page = await browser.newPage();

    // Navega a la URL proporcionada
    const url = "https://sneakers123.com/es/sneaker/?q=" + sku.trim();
    await page.goto(url, { waitUntil: "domcontentloaded" });


    const allImgSrcs = await page.$$eval('[data-v-08f21fb8][data-v-4068e002] img', imgs => imgs.map(img => img.src));
    const allText = await page.$$eval('[data-v-08f21fb8][data-v-4068e002] span', spans => spans.map(span => span.textContent.trim()));


    // const allImgSrcs = await section.$$eval('img', imgs => imgs.map(img => img.src));
    // console.log("Todas las imágenes:", allImgSrcs);


    await browser.close();

    console.log(allImgSrcs);
    console.log(allText);

  }
  // async cheerio(sku) {
  //   const url = "https://www.laced.com/search?query=%" + sku.trim();
  //   const headers = {
  //     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
  //   };

  //   const { data } = await axios.get(url, { headers });
  //   const $ = cheerio.load(data);

  //   const datos = $('article[aria-label=ProductCard]').html(); //esto es un div, que dentro estan los datos que intento recoger abajo

  //   const contenido = cheerio.load(datos);

  //   const imagen = contenido("img").attr("src");
  //   console.log(imagen);
  //   const model = contenido("img").attr("alt");
  //   console.log(model);
  // }
}
// (async () => {
//   const snkrs123 = new Sneakers123();
//   await snkrs123.puppeteer("HV6674-067");
// })();

module.exports = { HypeBoost, Laced };

