import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";

function App() {
    const [cart, setCart] = useState([]);

    function addToCart(product, quantity) {
        const existingItem = cart.find((item) => item.id === product.id);

        if (existingItem) {
            setCart(
                cart.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item));
        } else {
            setCart([...cart, { ...product, quantity }]);
        }
    }

    function updateQuantity(id, amount) {
        setCart(
            cart.map((item) => item.id === id ? { ...item, quantity: item.quantity + amount }: item)
        .filter((item) => item.quantity > 0)
        );
    }

    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <>
            <Navbar totalItems={totalItems} />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop addToCart={addToCart} />} />
                <Route path="/cart" element={<Cart cart={cart} updateQuantity={updateQuantity} />} />
            </Routes>
        </>
    );
}

export default App;