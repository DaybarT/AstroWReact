export default function Searcher() {

    const searcherStyle = {
        margin: "30px",
        background: "none",
        border: "none",
        outline: "none",
        maxWidth: "190px",
        padding: "10px 20px",
        fontSize: "16px",
        // borderRadius: "9999px",
        boxShadow: "inset 2px 5px 10px rgb(5, 5, 5)",
        color: "#fff"
    };

    return (
        <>
            <input
                placeholder="SKU"
                name="text"
                type="text"
                style={searcherStyle}
            />
            <input
                placeholder="Talla"
                name="text"
                type="text"
                style={searcherStyle}
            />
            <input
                placeholder="Precio"
                name="text"
                type="text"
                style={searcherStyle}
            />
        </>
    );
}
