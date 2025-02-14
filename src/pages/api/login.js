export const prerender = false;
import fs from "fs";
import path from "path";
import csvParser from "csv-parser";
const userPath = import.meta.env.auth;
import bcrypt from "bcryptjs";

export async function POST({ request }) {
  const filePath = path.resolve(userPath);
  const users = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => {
        users.push(row);
      })
      .on("end", async () => {
        try {
          const { user, password } = await request.json();

          if (!user || !password) {
            return resolve(
              new Response(JSON.stringify({ error: "Faltan datos" }), {
                status: 400,
              })
            );
          }

          const foundUser = users.find(
            (u) =>
              (u.user || "").trim().toLowerCase() ===
              user.trim().toLowerCase()
          );

          if (!foundUser) {
            return resolve(
              new Response(JSON.stringify({ error: "user no encontrado" }), {
                status: 404,
              })
            );
          }

          bcrypt.compare(password, foundUser.password, (err, result) => {
            if (err) {
              console.error("Error al verificar la contraseña:", err);
              return reject(
                new Response(JSON.stringify({ error: "Error interno" }), {
                  status: 500,
                })
              );
            }

            if (result) {
              console.log("Autenticación exitosa");
              resolve(
                new Response(
                  JSON.stringify({ success: "Inicio de sesión exitoso" }),
                  { status: 200 }
                )
              );
            } else {
              console.log("Contraseña incorrecta");
              resolve(
                new Response(
                  JSON.stringify({ error: "Contraseña incorrecta" }),
                  { status: 401 }
                )
              );
            }
          });
        } catch (err) {
          console.error("Error en el servidor:", err);
          resolve(
            new Response(JSON.stringify({ error: err.message }), {
              status: 500,
            })
          );
        }
      })
      .on("error", (err) => {
        console.error("Error leyendo el archivo:", err);
        reject(
          new Response(JSON.stringify({ error: err.message }), { status: 500 })
        );
      });
  });
}

// export default async function login() {
//   const filePath = path.resolve("../../../data/user.csv");

//   const data = [];

//   return new Promise((resolve, reject) => {
//     fs.createReadStream(filePath)
//       .pipe(csvParser())
//       .on("data", (row) => {
//         data.push(row);
//       })
//       .on("end", () => {
//         resolve(new Response(JSON.stringify(data), { status: 200 }));
//       })
//       .on("error", (err) => {
//         reject(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
//       });
//   });
// }

// login().then(response => response.text().then(console.log)).catch(console.error);

/* function hashSHA256(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

const pass = "";
console.log(hashSHA256(pass)); */
