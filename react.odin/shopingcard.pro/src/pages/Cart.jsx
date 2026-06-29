function Cart({cart, updateQuantity}){
    return(
        <div>
            <h1>YourCart</h1>

            {cart.length===0 && (
                <p>Cart is empty</p>
            )}

            {cart.map((item)=>(
                <div key={item.id}>
                    <h3>{item.title}</h3>

                    <p>Quantity: {item.quantity}</p>

                    <button onClick={()=>updateQuantity(item.id, -1)}>-</button>

                    <button onClick={()=>updateQuantity(item.id, 1)}>+</button>
                </div>
            ))}
        </div>
    );
}

export default Cart;