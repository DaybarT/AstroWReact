import React, { useState } from "react";

export default function Adder({ ENV, csv, setCsv }) {
  const [skuToAdd, setSkuToAdd] = useState("");
  const [modelToAdd, setModelToAdd] = useState("");
  const [imgToAdd, setImgToAdd] = useState("");

  const addData = async () => {
    try {
      const response = await fetch(ENV.BASE_URL + "/api/addData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          SKU: skuToAdd.trim(),
          model: modelToAdd.trim(),
          img: imgToAdd.trim(),
        }),
      });

      const result = await response.json();
      if (response.status) {
        const newProduct = {
          SKU: skuToAdd.trim(),
          model: modelToAdd.trim(),
          img: imgToAdd.trim(),
        };

        setCsv((prevData) => [...prevData, newProduct]);

        document.getElementById("sku_form").value = "";
        document.getElementById("model_form").value = "";
        document.getElementById("src_form").value = "";
        
      } else {
        console.error(result.message); // Mostrar el mensaje de error si la eliminación no fue exitosa
      }
    } catch (error) {
      // console.error("Error al eliminar talla:", error);
      console.log(error);
    }
  };

  const searcherStyle = {
    margin: "10px",
    background: "none",
    border: "none",
    outline: "none",
    padding: "10px 20px",
    fontSize: "16px",
    boxShadow: "inset 2px 5px 10px rgb(5, 5, 5)",
    color: "#fff",
    borderRadius: "5px",
  };

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  };

  return (
    <div style={containerStyle}>
      <input
        placeholder="SKU"
        name="text"
        type="text"
        id="sku_form"
        style={{ ...searcherStyle, width: "10%" }}
        onChange={(e) => setSkuToAdd(e.target.value)}
      />
      <input
        placeholder="model"
        name="text"
        type="text"
        id="model_form"
        style={{ ...searcherStyle, width: "10%" }}
        onChange={(e) => setModelToAdd(e.target.value)}
      />
      <input
        placeholder="src de imagen"
        name="text"
        type="text"
        id="src_form"
        style={{ ...searcherStyle, width: "10%" }}
        onChange={(e) => setImgToAdd(e.target.value)}
      />
      <button
        onClick={() => addData()}
        style={{ ...searcherStyle, cursor: "pointer" }}
      >
        OK
      </button>
    </div>
  );
}
