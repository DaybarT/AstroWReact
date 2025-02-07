export default function Card({ sku, img, title, size, price }) {
  const divStyle = {
    width: '200px',
    borderRadius: '5px',
    backgroundColor: "rgba(244, 207, 144, 0.8)",  // Manteniendo la opacidad
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '5px',  // Reducir el padding para acercar los elementos al borde
  };

  const card_img = {
    width: '200px',
    borderRadius: "10px",
    margin: '0',  // Eliminar espacio adicional alrededor de la imagen
  };

  const textStyle = {
    margin: '5px 0',  // Añadir un pequeño espacio entre los textos
    padding: '0',  // Eliminar padding adicional
  };

  return (
    <div style={divStyle}>
      <img
        src={img}
        style={card_img}
        alt={img ? img : title}
      />
      <p style={textStyle} className="card_sku">
        {sku ? sku : 'SKU Not Found'}
      </p>
      <p style={textStyle} className="card_title">
        {title ? title : 'Title Not Found'}
      </p>
      <p style={textStyle} className="card_size">
        {size ? size + ' EU' : 'Size Not Found'}
      </p>
      <p style={textStyle} className="card_price">
        {price ? price + ' €' : 'Price Not Found'}
      </p>
    </div>
  );
}
