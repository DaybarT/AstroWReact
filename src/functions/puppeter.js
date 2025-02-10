import puppeteer from 'puppeteer';

async function scrapePage(url) {
  // Lanza el navegador en modo headless (sin interfaz gráfica)
  const browser = await puppeteer.launch();
  
  // Abre una nueva página en el navegador
  const page = await browser.newPage();

  // Navega a la URL proporcionada
  await page.goto(url, { waitUntil: "domcontentloaded" });

  // Extrae el título de la página
  const titulo = await page.title();
  console.log("Título de la página:", titulo);

  // Extrae todos los enlaces <a> de la página
  const enlaces = await page.$$eval("a", enlaces => enlaces.map(a => a.href));
  console.log("Enlaces encontrados:");
  enlaces.forEach(enlace => console.log(enlace));

  // Cierra el navegador
  await browser.close();
}

// Llama a la función con la URL que quieras raspar
scrapePage("https://example.com");
