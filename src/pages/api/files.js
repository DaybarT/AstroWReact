import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import csvParser from 'csv-parser';
import { format } from 'fast-csv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "../../data/dbShoes.csv");
const stockPath = path.join(__dirname, "../../data/stock.csv");



// Ejemplo de uso:
/* const newData = {
  SKU: "HQ3073-101",
  Title: "Nike Air Max",
  img: "https://example.com/image.jpg"
};

addData(newData); */


// Ejemplo de uso:
/* const skuToSearch = "HQ3073-100";
(async () => {
  const result = await findDataExist(skuToSearch);
  console.log(result);  // Imprime el objeto encontrado o null si no existe
})(); */



//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//  addStock({
//   SKU: "HQ3073-103",
//   Title: "Nike Air Max",
//   img: "https://example.com/image.jpg",
//   sizes: [44,45,41,42]
// }); 


// removeStock("HQ3073-100"); 

// removeStockSize({
//   SKU: 'HQ3073-103',
//   sizes: [45] 
// })
//   .then(() => {
//     console.log('Proceso completado con éxito.');
//   })
//   .catch((error) => {
//     console.error('Error al procesar el archivo:', error);
//   });
