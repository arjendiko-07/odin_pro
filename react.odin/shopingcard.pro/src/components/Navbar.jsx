import{Link}from "react-router-dom";

function Navbar({totalItems}){
    return(
        <nav>
            <Link to="/">Home</Link> | {" "}
            <Link to="/shop">Shop</Link> | {" "}
            <Link to="/cart">Cart({totalItems})</Link>
        </nav>
    );
}

export default Navbar;