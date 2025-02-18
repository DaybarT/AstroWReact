import React from "react";

export default function Editor({ ENV, productData, setProductData }) {
  const card_img = {
    width: "200px",
    borderRadius: "10px",
    margin: "0",
  };

  const tableStyle = {
    color: "white",
    width: "100%",
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
  };

  const handleChange = (index, field, value) => {
    const updatedProducts = [...productData];
    updatedProducts[index][field] = value;
    setProductData(updatedProducts);
  };
  
  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th>IMAGE</th>
          <th>SKU</th>
          <th>MODEL</th>
          <th>SIZES</th>
          <th>PRICE</th>
        </tr>
      </thead>
      <tbody>
        {productData.map((product, index) => (
          <tr key={index}>
            <td>
              <img
                style={card_img}
                src={product.img}
                alt={product.img ? product.title : "Image Not Found"}
              />
            </td>
            <td>
              <input
                readOnly
                disabled
                value={product.SKU ? product.SKU : "SKU Not Found"}
                style={{ ...inputStyle, width: "40%" }}
              />
            </td>
            <td>
              <textarea
              onChange={(e) => handleChange(index, "title", e.target.value)}
                value={product.title ? product.title : "Title Not Found"}
                style={{ ...inputStyle, width: "80%", height: "50px", resize: "none" }}
              />
            </td>
            <td>
              <input
              onChange={(e) => handleChange(index, "sizes", e.target.value)}
                style={{ ...inputStyle, width: "30%" }}
                value={product.sizes ? product.sizes : "Sizes Not Found"}
              />
            </td>
            <td>
              <input
              onChange={(e) => handleChange(index, "price", e.target.value)}
                value={product.price ? product.price : "Price Not Found"}
                style={{ ...inputStyle, width: "30%" }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
