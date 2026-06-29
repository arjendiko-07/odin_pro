import {useEffect, useState}from "react";
import ProductCard from "../components/ProductCard";

function Shop({addToCart}){
    const [products, setProducts] = useState([]);

    useEffect(()=>{
        fetch("https://fakestoreapi.com/products").then((res)=>res.json()).then((data)=>setProducts(data));
    }, []);

    return(
        <div>
            <h1>Shop</h1>

            {products.map((product)=>(
                <ProductCard key={product.id} products={product} addToCart={addToCart} />
            ))}
        </div>
    );
}

export default Shop;