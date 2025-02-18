import NeonCheckbox from "../components/NeonCheckbox";
import React, { useState } from "react";
import Card from "../components/Card";
import Login from "../components/Login";
import Navbar from "../components/Navbar";
import Searcher from "../components/Searcher";
import Editor from "../components/Editor";

export default function App({ ENV, stock }) {
  const [data, setData] = useState(false);
  const [session, setSession] = useState(false);

  const [edit, setEdit] = useState(false);
  const [add, setAdd] = useState(false);
  const [del, setDel] = useState(false);

  const [productData,setProductData] = useState(stock);
  
  const goChange = () => {
    console.log(productData);
  };

  return (
    <div className="container">
      <div className="div-login" style={{ marginBottom: "50px" }}>
        {session ? (
          <Navbar setSession={setSession} setData={setData} setEdit={setEdit} setAdd={setAdd} setDel={setDel}/>
        ) : data ? (
          <Login ENV={ENV} setSession={setSession} setData={setData} />
        ) : (
          <NeonCheckbox setData={setData} data={data} />
        )}
      </div>
      {add ? (<Searcher/>) : (<></>)}
      <br />
      {edit && (
        //tengo que meter aqui el boton de editar porque si lo meto en el contenedor que representa los productos, 
        //hay mucho espaciado
  <button onClick={() => {goChange();setEdit(false);setAdd(false);setDel(false);}} style={{ cursor:"pointer",margin: "1rem",border: "none",borderRadius: "4px",fontWeight: "bold",fontSize: ".8em",textTransform: "uppercase",padding: "0.6em 1.2em",backgroundColor: "#ffeba7",color: "#5e6681",boxShadow: "0 8px 24px 0 rgb(255 235 167 / 20%)",transition: "all .3s ease-in-out"}}>
    DONE
  </button>
)}
      <div className="div-father">
        {edit ? (<><Editor ENV={ENV} productData={productData} setProductData={setProductData} /></>) : (<><Card productData={productData} setProductData={setProductData} ENV={ENV} edit={edit} del={del}/></>)}
      </div>
    </div>
  );
}
