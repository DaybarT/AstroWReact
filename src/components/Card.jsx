import React, { useState } from 'react';

export default function Card({ENV ,sku, title, img, sizes, price }) {

  const [productSizes, setProductSizes] = useState(sizes.split("|")); // Estado local para manejar las tallas

  const divStyle = {
    width: "200px",
    borderRadius: "5px",
    backgroundColor: "rgba(244, 207, 144, 0.8)", // Manteniendo la opacidad
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "5px", // Reducir el padding para acercar los elementos al borde
  };

  const card_img = {
    width: "200px",
    borderRadius: "10px",
    margin: "0", // Eliminar espacio adicional alrededor de la imagen
  };

  const textStyle = {
    margin: "5px 0", // Añadir un pequeño espacio entre los textos
    padding: "0", // Eliminar padding adicional
  };

  const removeSize = async (sku, size) => {
    try {
      const response = await fetch(ENV.SERVER+ENV.removeStockSize, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          SKU: sku,
          sizes: [Number(size)], 
        }),
      });
  
      const result = await response.json();
      if (result.success){
        setProductSizes((prevSizes) => prevSizes.filter((item) => item !== size));
        console.log(`Talla ${size} eliminada del SKU ${sku}:`, result);
      }
      
    } catch (error) {
      // console.error("Error al eliminar talla:", error);
      console.log(error);
    }
  };

  return (
    <div style={divStyle}>
      <img src={img} style={card_img} alt={img ? img : title} />
      <p style={textStyle} className="card_sku">
        {sku ? sku : "SKU Not Found"}
      </p>
      <p style={textStyle} className="card_title">
        {title ? title : "Title Not Found"}
      </p>

      {productSizes
        ? productSizes.map((size, index) => (
            /* <button
              key={index}
               onClick={() => removeSize(sku, size)}
            > */
              <p style={textStyle} className="card_size">
                {size} EU
              </p>

            /* </button> */

          ))
        : "Size Not Found"}

      <p style={textStyle} className="card_price">
        {price ? price + " €" : "Price Not Found"}
      </p>
    </div>
  );
}
