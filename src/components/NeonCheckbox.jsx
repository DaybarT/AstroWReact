import React, { useState } from 'react';
import Login from './Login';

export default function NeonCheckbox({ENV,setData,data}) {
    
    // console.log("HOLA");
    // Función para cambiar el estado
    const tryLogin = () => {
        setData(true);
    };

    // Estilos
    const wrapperStyle = {
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        cursor: 'pointer',
        padding: '10px',
    };

    const inputStyle = {
        position: 'absolute',
        opacity: 0,
        cursor: 'pointer',
        height: '0',
        width: '0',
    };

    const checkmarkStyle = {
        position: 'relative',
        width: '25px',
        height: '25px',
        border: '2px solid rgba(0, 255, 136, 0.7)',
        borderRadius: '8px',
        transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(0, 0, 0, 0.2)',
        boxShadow: '0 0 15px rgba(0, 255, 136, 0.3)',
        overflow: 'hidden',
    };

    const svgStyle = {
        width: '0',
        height: '0',
        color: '#1a1a1a',
        zIndex: 1,
        transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        filter: 'drop-shadow(0 0 2px rgba(0, 0, 0, 0.5))',
    };

    const labelStyle = {
        marginLeft: '15px',
        fontFamily: '"Segoe UI", sans-serif',
        color: '#00ff88',
        fontSize: '18px',
        textShadow: '0 0 10px rgba(0, 255, 136, 0.3)',
        opacity: 0.9,
        transition: 'all 0.3s',
    };


    return (
        <div>
            {/* Mostrar solo el checkbox si 'data' es false */}
            {!data && (
                <label style={wrapperStyle}>
                    <input
                        type="checkbox"
                        style={inputStyle}
                        checked={data}
                        onChange={(e) => {
                            console.log('onChange event triggered');
                            tryLogin(e.target.checked); // Cambiar el estado cuando el checkbox es marcado
                        }}
                    />
                    <div style={checkmarkStyle}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={svgStyle}>
                            <path
                                d="M20 6L9 17L4 12"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></path>
                        </svg>
                    </div>
                    <span style={labelStyle}>LOG IN FOR EDIT LIST</span>
                </label>
            )}
        </div>
    );
};