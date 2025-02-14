import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import csvParser from 'csv-parser';
import { format } from 'fast-csv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* const dbPath = import.meta.env.dbShoes;
const stockPath = import.meta.env.stock; */


import bcrypt from 'bcryptjs';

// Para encriptar la contraseña
const saltRounds = 10;
const password = '';
bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('Contraseña encriptada:', hash);

  // Para verificar la contraseña
  bcrypt.compare(password, hash, (err, result) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Las contraseñas coinciden:', result);
  });
});

/* Contraseña encriptada: $2a$10$jP7efqByDqIQgyJdgXS0QuOlB/3r2771lTL7K7z5flA2sg06bT8Tm
Las contraseñas coinciden: true */


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
