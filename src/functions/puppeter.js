import puppeteer from "puppeteer";

export default async function scrapeInfo(sku) {
  // Lanza el navegador en modo headless (sin interfaz gráfica)
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
/* scrapeInfo('HQ3073-100'); */

//de momento no hace falta, sin funcionamiento
/* async function scrapeInfo(sku){ */

// Lanza el navegador en modo headless (sin interfaz gráfica)
/* const browser = await puppeteer.launch(); */

// Abre una nueva página en el navegador
/* const page = await browser.newPage(); */

// Navega a la URL proporcionada
/* const url = "https://hypeboost.com/es/search/shop?keyword="+sku;
  await page.goto(url, { waitUntil: "domcontentloaded" }); */

/* const sizes = await page.$eval('.sizes', div => div.innerText); */
//saca las tallas y los precios, por el momento no hace falta
//para hacer funcionar esto, hay que hacer que llegue a la pagina del producto.

/* const imgSrc = await page.$eval('.item img', img => img.getAttribute('src'));
  console.log(imgSrc); */

// Cierra el navegador
/*   await browser.close()
} */
