function Card({ghibli, onClick}){
    return(
        <div className="card" onClick={()=>onClick(ghibli.id)}>
            <img src={ghibli.image} alt={ghibli.name}/>

            <h3>{ghibli.name}</h3>

        </div>
    );
}

export default Card;