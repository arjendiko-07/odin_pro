function knightMoves(start, end){
    const moves=[
        [1, 2], [2, 1], [-1, 2], [-2, 1],
        [1, -2], [2, -1], [-1, -2], [-2, -1]
    ];

    function isValid(x, y){
        return x>=0 && x<8 && y>=0 && y<8;
    }

    const queue = [[start, [start]]];
    const visited = new Set();
    visited.add(start.toString());

    while(queue.length > 0){
        const [[x, y], path]=queue.shift();

        if(x===end[0] && y===end[1]){
            console.log(`You made it in ${path.length-1}moves! Here's your path:`);
            path.forEach(p=>console.log(p));
            return path;
        }

        for(const[dx, dy]of moves){
            const newX=x+dx;
            const newY=y+dy;

            const key = `${newX}, ${newY}`;

            if(isValid(newX, newY) && !visited.has(key)){
                visited.add(key);
                queue.push([[newX, newY], [...path, [newX, newY]]]);
            }
        }
    }
}

knightMoves([0, 0], [3, 3]);
knightMoves([3, 3], [4, 3]);
knightMoves([0, 0], [7, 7]);
