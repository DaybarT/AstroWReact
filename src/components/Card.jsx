import { removeStockSize } from "../functions/files";

export default function Card({ sku, title, img, sizes, price }) {
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

  const handleRemoveSize = async (sku, size) => {
    try {
      console.log("Intentando eliminar talla:", size);
      await removeStockSize({ SKU: sku, sizes: [size] });
      console.log("Talla eliminada:", size);
    } catch (error) {
      console.error("Error al eliminar talla", error);
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
      <p style={textStyle} className="card_size">
        {sizes
          ? sizes.split("|").map((size, index) => (
              <button
                key={index}
                onClick={() => handleRemoveSize({"SKU": sku, "sizes":[size]})} // Llamada a la función al hacer clic
              >
                {size} EU
              </button>
            ))
          : "Size Not Found"}
      </p>
      <p style={textStyle} className="card_price">
        {price ? price + " €" : "Price Not Found"}
      </p>
    </div>
  );
}
