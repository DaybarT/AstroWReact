import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import csvParser from 'csv-parser';
import { format } from 'fast-csv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "../../data/dbShoes.csv");
const stockPath = path.join(__dirname, "../../data/stock.csv");

// Función para agregar datos al archivo CSV
export async function addData(newData) {
  const results = [];
  let headers = []; // Para almacenar los encabezados manualmente

  // Verificar si el archivo CSV existe
  if (!fs.existsSync(dbPath)) {
    // Si no existe, creamos un archivo vacío con las cabeceras
    const header = ['SKU', 'Title', 'img']; // Aquí añadimos las columnas
    const writeStream = fs.createWriteStream(dbPath);
    format([header], { headers: false }).pipe(writeStream);
    console.log("Archivo creado con cabeceras.");
    return;
  }

  // Leer el archivo CSV y convertirlo en un array de objetos
  const data = await new Promise((resolve, reject) => {
    fs.createReadStream(dbPath)
      .pipe(csvParser({ headers: false, skipEmptyLines: true }))  // Deshabilitamos los encabezados automáticos
      .on('data', (row) => {
        // Si es la primera fila, asignamos los encabezados manualmente
        if (headers.length === 0) {
          headers = Object.values(row);  // Convertimos el objeto en un array de valores
        } else {
          // Para las filas siguientes, mapeamos los valores a los encabezados
          const rowObj = {};

          // Usamos Object.entries() para recorrer las claves y asignar los valores correctamente
          Object.entries(row).forEach(([index, value]) => {
            const header = headers[index];
            rowObj[header] = value; // Asignamos el valor a la clave del encabezado
          });

          if (rowObj.SKU && rowObj.SKU.trim() !== 'SKU') {
            results.push(rowObj); // Añadimos cada fila válida al array de resultados
          }
        }
      })
      .on('end', () => {
        resolve(results); // Resolvemos la promesa con los resultados del CSV
      })
      .on('error', (err) => {
        reject("Error al leer el archivo CSV: " + err); // Rechazamos si hay un error
      });
  });

  // Verificar si el SKU ya existe en los datos leídos
  const existingItem = data.find((item) => item.SKU === newData.SKU);

  if (existingItem) {
    console.log(`El SKU ${newData.SKU} ya existe. No se añadirá.`);
    return; // Si el SKU ya existe, no lo añadimos
  }

  // Si el SKU no existe, añadir el nuevo producto
  results.push({
    SKU: newData.SKU,
    Title: newData.Title,
    img: newData.img
  });

  console.log(`Nuevo SKU agregado: ${newData.SKU}`);

  // Escribir los datos actualizados de vuelta al archivo CSV
  const writeStream = fs.createWriteStream(dbPath);
  const csvStream = format({ headers: true });

  // Empezamos a escribir los datos al archivo
  csvStream.pipe(writeStream);

  // Escribir todas las filas (incluyendo la nueva si es necesario)
  results.forEach((item) => {
    if (item.SKU && item.Title && item.img) {  // Asegurarse de que los campos no estén vacíos
      csvStream.write(item);
    }
  });

  csvStream.end();  // Finalizamos la escritura
}

// Ejemplo de uso:
/* const newData = {
  SKU: "HQ3073-101",
  Title: "Nike Air Max",
  img: "https://example.com/image.jpg"
};

addData(newData); */


// Función para buscar un SKU en el CSV
export async function findDataExist(sku) {
  try {
    // Usamos una Promise para envolver la lectura del archivo CSV
    const fileData = await new Promise((resolve, reject) => {
      const results = [];
      let headers = [];

      // Leer el archivo CSV, asegurándose de que las cabeceras se usen correctamente
      fs.createReadStream(dbPath)
        .pipe(csvParser({ headers: false, skipEmptyLines: true })) // Deshabilitamos los encabezados automáticos
        .on('data', (row) => {
          // Si es la primera fila, asignamos los encabezados manualmente
          if (headers.length === 0) {
            headers = Object.values(row);  // Convertimos el objeto en un array de valores
          } else {
            // Para las filas siguientes, mapeamos los valores a los encabezados
            const rowObj = {};

            // Usamos Object.entries() para recorrer las claves y asignar los valores correctamente
            Object.entries(row).forEach(([index, value]) => {
              const header = headers[index];
              rowObj[header] = value; // Asignamos el valor a la clave del encabezado
            });

            if (rowObj.SKU && rowObj.SKU.trim() !== 'SKU') {
              results.push(rowObj); // Añadimos cada fila válida al array de resultados
            }
          }
        })
        .on('end', () => {
          resolve(results); // Resolvemos la promesa con los resultados del CSV
        })
        .on('error', (err) => {
          reject("Error al leer el archivo CSV: " + err); // Rechazamos si hay un error
        });
    });

    // Verificar si hay datos en el archivo
    if (fileData.length === 0) {
      console.log('No se encontraron datos en el archivo.');
      return null;  // Si el archivo está vacío, retornamos null
    }

    // Asegurarnos de hacer un trim() de los valores de SKU para evitar errores por espacios adicionales
    const existingItem = fileData.find((item) => item.SKU && item.SKU.trim().toUpperCase() === sku.toUpperCase());

    // Devolvemos el objeto si lo encontramos, o false si no
    return existingItem || false;
  } catch (error) {
    console.error("Error al leer o procesar el archivo:", error);
    return null; // Si ocurre algún error, devolvemos null
  }
}


// Ejemplo de uso:
/* const skuToSearch = "HQ3073-100";
(async () => {
  const result = await findDataExist(skuToSearch);
  console.log(result);  // Imprime el objeto encontrado o null si no existe
})(); */



//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export async function addStock(newData) {
  const results = [];
  let headers = [];
  
  if (!fs.existsSync(stockPath)) {
    const header = ['SKU', 'Title', 'img', 'sizes'];
    fs.writeFileSync(stockPath, `${header.join(',')}\n`);
    console.log("Archivo creado con cabeceras.");
    return;
  }

  const data = await new Promise((resolve, reject) => {
    const parsedData = [];
    fs.createReadStream(stockPath)
      .pipe(csvParser({ headers: false, skipEmptyLines: true }))
      .on('data', (row) => {
        if (headers.length === 0) {
          headers = Object.values(row);
        } else {
          const rowObj = {};
          Object.entries(row).forEach(([index, value]) => {
            rowObj[headers[index]] = value;
          });

          if (rowObj.SKU && rowObj.SKU.trim() !== 'SKU') {
            rowObj.sizes = rowObj.sizes ? rowObj.sizes.split('|').map(Number) : [];
            parsedData.push(rowObj);
          }
        }
      })
      .on('end', () => resolve(parsedData))
      .on('error', (err) => reject("Error al leer el archivo CSV: " + err));
  });

  const existingItem = data.find((item) => item.SKU === newData.SKU);

  if (existingItem) {
    const existingSizes = existingItem.sizes || [];
    const newSizes = newData.sizes || [];
    const updatedSizes = Array.from(new Set([...existingSizes, ...newSizes])).sort((a, b) => a - b);
    existingItem.sizes = updatedSizes;
    console.log(`Actualizado SKU ${newData.SKU} con nuevas tallas: ${updatedSizes.join(', ')}`);
  } else {
    results.push({
      SKU: newData.SKU,
      Title: newData.Title,
      img: newData.img,
      sizes: newData.sizes.sort((a, b) => a - b)
    });
    console.log(`Nuevo SKU agregado: ${newData.SKU}`);
  }

  const writeStream = fs.createWriteStream(stockPath);
  const csvStream = format({ headers: true });

  csvStream.pipe(writeStream);
  [...data, ...results].forEach((item) => {
    csvStream.write({ ...item, sizes: item.sizes.join('|') });
  });

  csvStream.end();
}

/* addStock({
  SKU: "HQ3073-101",
  Title: "Nike Air Max",
  img: "https://example.com/image.jpg",
  sizes: [44]
}); */

export async function removeStock(SKU) {
  if (!fs.existsSync(stockPath)) {
    console.log("El archivo no existe. No hay stock para eliminar.");
    return;
  }

  const data = await new Promise((resolve, reject) => {
    const parsedData = [];
    let headers = [];

    fs.createReadStream(stockPath)
      .pipe(csvParser({ headers: false, skipEmptyLines: true }))
      .on('data', (row) => {
        if (headers.length === 0) {
          headers = Object.values(row);
        } else {
          const rowObj = {};
          Object.entries(row).forEach(([index, value]) => {
            rowObj[headers[index]] = value;
          });

          if (rowObj.SKU && rowObj.SKU.trim() !== 'SKU') {
            parsedData.push(rowObj);
          }
        }
      })
      .on('end', () => resolve(parsedData))
      .on('error', (err) => reject("Error al leer el archivo CSV: " + err));
  });

  const filteredData = data.filter(item => item.SKU !== SKU);

  if (filteredData.length === data.length) {
    console.log(`El SKU ${SKU} no se encontró en el stock.`);
    return;
  }

  console.log(`El SKU ${SKU} ha sido eliminado del stock.`);

  // Escribir los datos actualizados de vuelta al archivo CSV
  const writeStream = fs.createWriteStream(stockPath);
  const csvStream = format({ headers: true });

  csvStream.pipe(writeStream);
  filteredData.forEach(item => {
    csvStream.write(item);
  });

  csvStream.end();
}
/* removeStock("HQ3073-101"); */

export async function removeStockSize(newData) {
  const results = [];
  let headers = [];

  if (!fs.existsSync(stockPath)) {
    console.log("El archivo no existe. No hay stock para modificar.");
    return;
  }

  const data = await new Promise((resolve, reject) => {
    const parsedData = [];
    fs.createReadStream(stockPath)
      .pipe(csvParser({ headers: false, skipEmptyLines: true }))
      .on('data', (row) => {
        if (headers.length === 0) {
          headers = Object.values(row);
        } else {
          const rowObj = {};
          Object.entries(row).forEach(([index, value]) => {
            rowObj[headers[index]] = value;
          });

          if (rowObj.SKU && rowObj.SKU.trim() !== 'SKU') {
            rowObj.sizes = rowObj.sizes ? rowObj.sizes.split('|').map(Number) : [];
            parsedData.push(rowObj);
          }
        }
      })
      .on('end', () => resolve(parsedData))
      .on('error', (err) => reject("Error al leer el archivo CSV: " + err));
  });

  const existingItem = data.find((item) => item.SKU === newData.SKU);

  if (existingItem) {
    const existingSizes = existingItem.sizes || [];
    const sizesToRemove = newData.sizes || [];

    // Filtrar las tallas que se deben eliminar
    const updatedSizes = existingSizes.filter(size => !sizesToRemove.includes(size));

    if (updatedSizes.length === existingSizes.length) {
      console.log(`No se eliminaron tallas para SKU ${newData.SKU}, ya que no coincidían.`);
    } else {
      console.log(`Tallas ${sizesToRemove.join(', ')} eliminadas del SKU ${newData.SKU}.`);
    }

    existingItem.sizes = updatedSizes;
  } else {
    console.log(`El SKU ${newData.SKU} no existe en el stock.`);
  }

  // Escribir los datos actualizados de vuelta al archivo CSV
  const writeStream = fs.createWriteStream(stockPath);
  const csvStream = format({ headers: true });

  csvStream.pipe(writeStream);
  data.forEach((item) => {
    csvStream.write({ ...item, sizes: item.sizes.join('|') });
  });

  csvStream.end();
}