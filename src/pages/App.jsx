import NeonCheckbox from "../components/NeonCheckbox";
import React, { useState } from "react";
import Card from "../components/Card";
import Login from "../components/Login";
import Navbar from "../components/Navbar";
import Adder from "../components/Adder";
import Editor from "../components/Editor";

export default function App({ ENV, stock }) {
  const [data, setData] = useState(false);
  const [session, setSession] = useState(false);

  const [edit, setEdit] = useState(false);
  const [add, setAdd] = useState(false);
  const [del, setDel] = useState(false);

  const [productData, setProductData] = useState(stock);

  return (
    <div className="container">
      <div className="div-login" style={{ marginBottom: "50px" }}>
        {session ? (
          <Navbar
            setSession={setSession}
            setData={setData}
            setEdit={setEdit}
            setAdd={setAdd}
            setDel={setDel}
          />
        ) : data ? (
          <Login ENV={ENV} setSession={setSession} setData={setData} />
        ) : (
          <NeonCheckbox setData={setData} data={data} />
        )}
      </div>
      <div className="div-father">
        {del ? (
          <Card
            setDel={setDel}
            del={del}
            productData={productData}
            setProductData={setProductData}
            ENV={ENV}
          />
        ) : edit ? (
          <Editor ENV={ENV} setEdit={setEdit} />
        ) : (
          <Card productData={productData} setProductData={setProductData} />
        )}
      </div>
    </div>
  );
}
