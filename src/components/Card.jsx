import React, { useState, useEffect } from "react";

export default function Card({productData}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Verificamos si estamos en el cliente antes de acceder a window.innerWidth
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile(); // Ejecutar una vez al montar
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);



  const divStyle = {
    fontSize: isMobile ? "10px" : "",
    width: isMobile ? "150px" : "300px", // Más pequeña en móviles
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
    width: isMobile ? "150px" : "300px", // Imagen más pequeña en móviles
    borderRadius: "10px",
    margin: "0", // Eliminar espacio adicional alrededor de la imagen
  };

  const textStyle = {
    margin: "5px 0", // Añadir un pequeño espacio entre los textos
    padding: "0", // Eliminar padding adicional
    color: "white",
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
           <p style={textStyle}>
            {product.SKU ? product.SKU : "SKU not found"}
          </p>

          <p style={textStyle}>
            {product.model ? product.model : "Model not found"}
          </p>

          {/* <p style={textStyle} className="card_size">
            {product.sizes
              ? product.sizes
                  .split("|")
                  .map((size) => `${size}`)
                  .join(", ")
              : "Size Not Found"}
          </p> */}

          {product.size_prices ? (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                padding: "1px",
              }}
            >
              {product.size_prices.map((sizePrice, index) => (
                <div
                  key={index}
                  style={{
                    border: "1px solid white",
                    padding: "3px",
                    fontSize: "14px",
                    borderRadius: "5px",
                  }}
                >
                  <p
                    style={{
                      margin: "0",
                      padding: "0px 0",
                      fontSize: isMobile ? "10px" : "",
                    }}
                  >
                    {sizePrice.size ? sizePrice.size : "Size not found"}
                  </p>
                  <p
                    style={{
                      margin: "0",
                      padding: "0px 0",
                      fontSize: isMobile ? "10px" : "",
                    }}
                  >
                    {sizePrice.price
                      ? sizePrice.price + "€"
                      : "Price not found"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>Size Not Found</p>
          )}
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
