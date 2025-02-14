export const prerender = false;
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import csvParser from "csv-parser";
import { format } from "fast-csv";
import crypto from 'crypto';
const userPath = import.meta.env.auth;

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
            return resolve(new Response(JSON.stringify({ error: "Faltan datos" }), { status: 400 }));
          }

          const foundUser = users.find(u => 
            u.user === user && u.password === crypto.createHash('sha256').update(password).digest('hex')
          );

          if (foundUser) {
            resolve(new Response(JSON.stringify({ success: true, message: "Login exitoso" }), { status: 200 }));
          } else {
            resolve(new Response(JSON.stringify({ success: false, message: "Usuario o contraseña incorrectos" }), { status: 401 }));
          }
        } catch (err) {
          resolve(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
        }
      })
      .on("error", (err) => {
        reject(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
      });
  });
}



/* export default async function login() {
  const filePath = path.resolve("../../../data/user.csv");

  const data = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => {
        data.push(row);
      })
      .on("end", () => {
        resolve(new Response(JSON.stringify(data), { status: 200 }));
      })
      .on("error", (err) => {
        reject(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
      });
  });
}

login().then(response => response.text().then(console.log)).catch(console.error);
 */

/* function hashSHA256(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

const pass = "";
console.log(hashSHA256(pass)); */