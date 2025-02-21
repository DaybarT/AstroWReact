import React, { useState, useEffect } from "react";

export default function Card({ ENV, productData, edit, del, setProductData }) {
 
  const divStyle = {
    width: isMobile ? "150px" : "200px", // Más pequeña en móviles
    borderRadius: "5px",
    backgroundColor: "#090b11", // Manteniendo la opacidad
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "5px", // Reducir el padding para acercar los elementos al borde
  };

  const card_img = {
    width: isMobile ? "120px" : "200px", // Imagen más pequeña en móviles
    borderRadius: "10px",
    margin: "0", // Eliminar espacio adicional alrededor de la imagen
  };

  const textStyle = {
    margin: "5px 0", // Añadir un pequeño espacio entre los textos
    padding: "0", // Eliminar padding adicional
    color: "white",
  };

  const buttonStyle = {
    backgroundColor: "#101625",
    borderRadius: "5px",
    color: "white",
    borderColor: "black",
    cursor: "pointer",
  };

  const removeSize = async (sku_d, size_d) => {
    try {
      const response = await fetch(ENV.BASE_URL + ENV.removeStockSize, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          SKU: sku_d,
          sizes: [Number(size_d)],
        }),
      });

      const result = await response.json();

      if (result.success) {
        setProductData((prevData) =>
          prevData.map((product) =>
            product.SKU === sku_d
              ? {
                  ...product,
                  sizes: product.sizes
                    .split("|")
                    .filter((size) => size !== size_d)
                    .join("|"),
                }
              : product
          )
        );
      }
    } catch (error) {
      // console.error("Error al eliminar talla:", error);
      console.log(error);
    }
  };

  return (
    <>
      {productData.map((product, index) => (
        <div key={index} style={divStyle}>
          <img
            src={product.img}
            style={card_img}
            alt={product.img ? product.title : "Image Not Found"}
          />
          <p style={{ textStyle }}>
            {product.SKU ? product.SKU : "SKU Not Found"}
          </p>
          <p style={textStyle}>
            {product.title ? product.title : "Title Not Found"}
          </p>

          {/* <p style={textStyle} className="card_size">
            {product.sizes
              ? product.sizes
                  .split("|")
                  .map((size) => `${size}`)
                  .join(", ")
              : "Size Not Found"}
          </p> */}

          {del ? (
            product.sizes ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {product.sizes.split("|").map((size, index) => (
                  <button
                    style={buttonStyle}
                    key={index}
                    onClick={() => removeSize(product.SKU, size)} // Acción al hacer clic
                  >
                    {size}
                  </button>
                ))}
              </div>
            ) : (
              <p>Size Not Found</p>
            )
          ) : (
            <p style={textStyle}>
              {product.sizes
                ? product.sizes
                    .split("|")
                    .map((size) => `${size}`)
                    .join(", ")
                : "Size Not Found"}
            </p>
          )}

          <p style={textStyle}>
            {product.price ? product.price + " €" : "Price Not Found"}
          </p>
        </div>
      ))}
    </>
  );
}

// {productSizes
//   ? productSizes.map((size, index) => (
//       /* <button
//         key={index}
//          onClick={() => removeSize(sku, size)}
//       > */
//         <p style={textStyle} className="card_size">
//           {size} EU
//         </p>

//       /* </button> */

//     ))
//   : "Size Not Found"}
{
  /* {product.sizes ? (
            product.sizes.split("|").map((size, idx) => (
              <p key={idx} style={textStyle} className="card_size">
                {size} EU
              </p>
            ))
          ) : (
            <p style={textStyle}>Size Not Found</p>
          )} */
}
