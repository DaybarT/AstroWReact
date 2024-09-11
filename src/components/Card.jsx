export default function Card({children}) {
    const divStyle = {
      width : '200px',
      height : '200px',
      borderRadius : '15px',
      backgroundColor : '#3498db',
      color : 'white',
      fontSize : '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    };
  
    /* return (
      <div style={divStyle}>
        {children}
      </div>
    ); */

    return (
        <div style={divStyle}>
          {children}
        </div>
      );
      
}
