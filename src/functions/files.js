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
    // Verificar si el archivo existe, si no, lo creamos vacío
    if (!fs.existsSync(stockPath)) {
      fs.writeFileSync(stockPath, JSON.stringify([])); // Escribir un JSON vacío
      return;
    }
  
    try {
      // Leer el archivo JSON
      const fileData = await fs.promises.readFile(stockPath, "utf8");
  
      let jsonData = [];
  
      if (fileData.trim() !== "") {
        jsonData = JSON.parse(fileData); // Convertir el archivo JSON a un array
      }
  
      // Buscar el SKU existente
      const existingItem = jsonData.find(item => item.SKU === newData.SKU);
  
      if (existingItem) {
        // Si ya existe, agregar la nueva talla al campo de tallas
        const existingSizes = existingItem.sizes || []; // Obtener las tallas registradas (si las hay)
        const newSizes = Array.isArray(newData.sizes) ? newData.sizes : newData.sizes.split(","); // Asegurarse de que sizes sea un array
  
        // Agregar las nuevas tallas solo si no están ya registradas
        newSizes.forEach(size => {
          if (!existingSizes.includes(size)) {
            existingItem.sizes = [...existingSizes, size]; // Concatenar tallas
          }
        });


        existingItem.sizes = existingItem.sizes
        .map(Number)  // Convertir las tallas a números
        .sort((a, b) => a - b)  // Ordenar numéricamente
        .map(String);  // Volver a convertir las tallas a cadenas

        console.log(`Las tallas para SKU ${newData.SKU} se han actualizado: ${existingItem.sizes}`);
      } else {
        // Si el SKU no existe, agregarlo como nuevo objeto
        jsonData.push(newData);
        console.log(`Nuevo SKU agregado: ${newData.SKU}`);
      }
  
      // Escribir los datos modificados de vuelta al archivo
      await fs.promises.writeFile(stockPath, JSON.stringify(jsonData, null, 2));
      console.log(`Datos agregados correctamente a ${stockPath}: SKU ${newData.SKU}`);
      
    } catch (err) {
      console.error("Error al leer o escribir el archivo:", err);
    }
}

export async function removeStock(sku) {
  if (!fs.existsSync(stockPath)) {
    console.log("El archivo no existe.");
    return;
  }

  fs.readFile(stockPath, "utf8", (err, fileData) => {
    if (err) {
      console.error("Error al leer el archivo:", err);
      return;
    }

    let jsonData = [];

    if (fileData.trim() !== "") {
      try {
        jsonData = JSON.parse(fileData); // Convertir JSON a array
      } catch (error) {
        console.error("Error al parsear JSON:", error);
        return; // Detenemos la ejecución si el JSON está corrupto
      }
    }

    // Buscar el objeto con el SKU que queremos eliminar
    const indexToRemove = jsonData.findIndex(item => item.SKU === sku);

    if (indexToRemove === -1) {
      console.log(`El SKU ${sku} no se encontró en la base de datos.`);
      return; // Si el SKU no existe, no hacemos nada
    }

    // Eliminar el objeto con el SKU encontrado
    jsonData.splice(indexToRemove, 1);

    fs.writeFile(stockPath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        console.error("Error al guardar el archivo después de eliminar:", err);
      } else {
        console.log(`El SKU ${sku} ha sido eliminado correctamente.`);
      }
    });
  });
}
