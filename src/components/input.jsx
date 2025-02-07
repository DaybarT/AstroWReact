import React, { useState } from 'react';

export default function Input() {

    const [session, setSession] = useState(false);

    const fetchLogin = () => {
        setSession(true);
    };

    const cardStyle = {
        width: '300px',
        padding: '0.6rem',
        textAlign: 'center',
        background: '#2a2b38',
        borderRadius: "10px"
    };

    const fieldStyle = {
        marginTop: '.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '.5em',
        backgroundColor: '#1f2029',
        borderRadius: '4px',
        padding: '.5em 1em',
    };

    const inputIconStyle = {
        height: '1em',
        width: '1em',
        fill: '#ffeba7',
    };

    const inputFieldStyle = {
        background: 'none',
        border: 'none',
        outline: 'none',
        width: '100%',
        color: '#d3d3d3',
    };

    const titleStyle = {
        marginBottom: '1rem',
        fontSize: '1.0em',
        fontWeight: '500',
        color: '#f5f5f5',
    };

    const btnStyle = {
        margin: '1rem',
        border: 'none',
        borderRadius: '4px',
        fontWeight: 'bold',
        fontSize: '.8em',
        textTransform: 'uppercase',
        padding: '0.6em 1.2em',
        backgroundColor: '#ffeba7',
        color: '#5e6681',
        boxShadow: '0 8px 24px 0 rgb(255 235 167 / 20%)',
        transition: 'all .3s ease-in-out',
    };
    return (
        <div style={cardStyle}>
            <h4 style={titleStyle}>Log In</h4>
            <form>
                <div style={fieldStyle}>
                    
                    <input
                        autoComplete="off"
                        placeholder="Usuario"
                        style={inputFieldStyle}
                        name="user"
                        type='text'
                    />
                </div>
                <div style={fieldStyle}>
                    
                    <input
                        autoComplete="off"
                        placeholder="Contraseña"
                        style={inputFieldStyle}
                        name="password"
                        type="password"
                    />
                </div>
                <button style={btnStyle} type="submit">Login</button>
            </form>
        </div>
    );
}
