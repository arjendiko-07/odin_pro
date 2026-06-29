import { useState } from "react";

function ProductCard({ products, addToCart }) {
    const [quantity, setQuantity] = useState(1);

    function increase() {
        setQuantity(quantity + 1);
    }

    function decrease() {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    }

    return (
        <div className="card">
            <img src={products.image} alt={products.title} width="100" />
            <h3>{products.title}</h3>
            <p>${products.price}</p>
            <button onClick={decrease}>-</button>
            <input type="number" value={quantity} min="1" onChange={(e) => setQuantity(Number(e.target.value))} />
            <button onClick={increase}>+</button>
            <button onClick={() => addToCart(products, quantity)}>Add To Cart</button>
        </div>
    );
}

export default ProductCard;