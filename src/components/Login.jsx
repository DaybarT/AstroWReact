import React, { useState } from 'react';

export default function Login({ENV}) {

    const [session, setSession] = useState(false);
    const [user, setUser] = useState('');  
    const [password, setPassword] = useState('');  

    const fetchLogin = async (e) => {
        e.preventDefault();
            try {
              const response = await fetch(ENV.SERVER+ENV.login, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user: user,
                    password: password, 
                }),
              });

              const result = await response.json();
              
              if (result.success){
                setSession(true);
              }
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
            } catch (error) {
              // console.error("Error al eliminar talla:", error);
              console.log(error);
            }
        
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
        <>
          {session ? (
            <button>Botón adicional</button> // Se muestra si session es false
          ) : (
            <div style={cardStyle}>
              <h4 style={titleStyle}>Log In</h4>
              <form onSubmit={fetchLogin}>
                <div style={fieldStyle}>
                  <input
                    autoComplete="off"
                    placeholder="Usuario"
                    style={inputFieldStyle}
                    name="user"
                    type="text"
                    onChange={(e) => setUser(e.target.value)}
                  />
                </div>
                <div style={fieldStyle}>
                  <input
                    autoComplete="off"
                    placeholder="Contraseña"
                    style={inputFieldStyle}
                    name="password"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button style={btnStyle} type="submit">
                  Login
                </button>
              </form>
            </div>
          )}
        </>
      );      
}