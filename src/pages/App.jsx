import React, { useState } from "react";
import Card from "../components/Card";
import Icons from "../components/Icons";

export default function App({ ENV, stock }) {
  const [productData, setProductData] = useState(stock);

  return (
    <div className="container">
      <div className="div-login" style={{ marginBottom: "50px" }}>
        <div style={{ display: "flex" }}>
          <Icons icon={"Discord"} />
          <Icons icon={"Instagram"} />
        </div>
      </div>
      <br />
      <div className="div-father">
        <Card productData={productData} setProductData={setProductData} />
      </div>
    </div>
  );
}
