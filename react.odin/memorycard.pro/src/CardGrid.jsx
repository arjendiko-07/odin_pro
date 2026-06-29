import Card from "./Card";

function CardGrid({cards, onCardClick}){
    return(
        <div className="grid">
            {cards.map((card)=>(
                <Card key={card.id} ghibli={card} onClick={onCardClick}/>
            ))}
        </div>
    );
}

export default CardGrid;