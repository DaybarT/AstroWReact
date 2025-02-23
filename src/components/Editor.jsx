import React, { useState, useEffect } from "react";
import Adder from "./Adder";

export default function Editor({ ENV, setEdit}) {
  const [csv, setCsv] = useState([]);
  const [message, setMessage] = useState([]);

  useEffect(() => {
    const fetchDb = async () => {
      try {
        const response = await fetch(ENV.BASE_URL + "/api/getDbShoe");
        const stock = await response.json();
        setCsv(stock);
      } catch (error) {
        console.error("Error al obtener el stock:", error);
      }
    };
    fetchDb();
  }, []);

  const card_img = {
    width: window.innerWidth <= 768 ? "100px" : "200px",
    borderRadius: "10px",
    margin: "0",
  };

  const tableStyle = {
    color: "white",
    width: window.innerWidth <= 768 ? "100%" : "80%",
    borderCollapse: "separate",
    borderSpacing: "5px",
    textAlign: "center",
  };

  const inputStyle = {
    background: "none",
    border: "none",
    outline: "none",
    padding: "10px 20px",
    fontSize: "16px",
    boxShadow: "inset 2px 5px 10px rgb(5, 5, 5)",
    color: "#fff",
    borderRadius: "5px",
    margin: "0",
    width: "100%",
    minWidth: "60px",
  };

  const textStyle = {
    margin: "5px 0", // Añadir un pequeño espacio entre los textos
    padding: "0", // Eliminar padding adicional
    color: "white",
  };

  const handleChange = (index, field, value) => {
    const updatedDb = [...csv];
    updatedDb[index][field] = value;
    setCsv(updatedDb);
  };

  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      const response = await fetch(ENV.BASE_URL + "/api/modifyCsv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          csv: csv,
        }),
      });

      const result = await response.json();

      if (result.status === true) {
        setEdit(false);
      }
    }
  };

  
  const isMobile = {
    display: window.innerWidth <= 768 ? "none" : "table-cell",
  };

  const removeData = async (sku_d) => {
    try {
      const response = await fetch(ENV.BASE_URL + "/api/removeData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          SKU: sku_d,
        }),
      });

      const result = await response.json();
      if (response.status) {
        setCsv((prevData) =>
          prevData.filter((product) => product.SKU !== sku_d)
        );
      } else {
        console.error(result.message); // Mostrar el mensaje de error si la eliminación no fue exitosa
      }
    } catch (error) {
      // console.error("Error al eliminar talla:", error);
      console.log(error);
    }
  };

  return (
    <>
      <Adder ENV={ENV} csv={csv} setCsv={setCsv}/>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={isMobile}>IMAGE</th>
            <th style={isMobile}>IMAGE URL</th>
            <th style={isMobile}>SKU</th>
            <th style={isMobile}>MODEL</th>
            <th style={isMobile}>DELETE ?</th>
          </tr>
        </thead>
        <tbody>
          {csv.map((data, index) => (
            <tr key={index}>
              <td>
                <img
                  style={card_img}
                  src={data.img}
                  alt={data.img ? data.title : "Image Not Found"}
                />
              </td>
              <td>
                <input
                  style={{ ...inputStyle, textAlign: "center" }}
                  value={data.img ? data.img : "Image Not Found"}
                  onChange={(e) => handleChange(index, "img", e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </td>
              <td style={isMobile}>
                <input
                  value={data.SKU ? data.SKU : "SKU Not Found"}
                  style={{ ...inputStyle, width: "30%", textAlign: "center" }}
                  onChange={(e) => handleChange(index, "SKU", e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </td>
              <td style={isMobile}>
                <textarea
                  value={data.model ? data.model : "Model Not Found"}
                  style={{
                    ...inputStyle,
                    width: "80%",
                    height: "50px",
                    resize: "none",
                  }}
                  onChange={(e) => handleChange(index, "model", e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </td>
              <td style={isMobile}>
              <button
                      style={{
                        ...textStyle,
                        backgroundColor: "red",
                        border: "none",
                        cursor: "pointer",
                        padding: "5px 10px",
                        borderRadius: "10px",
                      }}
                      onClick={() => removeData(data.SKU)}
                    >DELETE</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
