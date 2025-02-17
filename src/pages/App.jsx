import NeonCheckbox from "../components/NeonCheckbox";
import React, { useState } from 'react';
import Card from "../components/Card";

export default function App({ENV,productData}) {
    

    return(
        <div className="container">
            <div className="div-login" style={{marginBottom:'50px'}}>
            <NeonCheckbox ENV={ENV} client:load />
            {/* <Searcher/> */}
            </div>
            <br />
            <div className="div-father">
            <Card client:load productData={productData} ENV={ENV} />
            </div>
        </div>
    );
}