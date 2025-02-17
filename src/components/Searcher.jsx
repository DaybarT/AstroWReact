import React, { useState } from "react";

export default function Searcher() {

    const searcherStyle = {
        margin: "30px",
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
        justifyContent: "space-between",  
        width: "100%",           
    };

    return (
        <div style={containerStyle}>
            <input
                placeholder="SKU"
                name="text"
                type="text"
                style={{ ...searcherStyle, width: "30%" }} 
            />
            <input
                placeholder="Talla"
                name="text"
                type="text"
                style={{ ...searcherStyle, width: "30%" }} 
            />
            <input
                placeholder="Precio"
                name="text"
                type="text"
                style={{ ...searcherStyle, width: "30%" }} 
            />
            <input
                placeholder="Precio"
                name="text"
                type="submit"
                value="Add"
                style={{ ...searcherStyle, width: "30%" }} 
            />
        </div>
    );
}
