function knightMoves(start, end){
    const moves=[
        [1, 2], [2, 1], [-1, 2], [-2, 1],
        [1, -2], [2, -1], [-1, -2], [-2, -1]
    ];//the 8 posssible moves for a knight

    function isValid(x, y){
        return x>=0 && x<8 && y>=0 && y<8;
    }//checks if you are inside the chessboard

    const queue = [[start, [start]]];//this tracks current position and full path taken to get there
    const visited = new Set();
    visited.add(start.toString());//these prevents visiting the same squares

    while(queue.length > 0){//we keep exploring until no more moves exist
        const [[x, y], path]=queue.shift();//takes next position

        if(x===end[0] && y===end[1]){//if we reached the goal
            console.log(`You made it in ${path.length-1}moves! Here's your path:`);//prints how many moves it took
            path.forEach(p=>console.log(p));//print the path step by step
            return path;//return result
        }

        for(const[dx, dy]of moves){//we try all 8 directions
            const newX=x+dx;
            const newY=y+dy;

            const key = `${newX}, ${newY}`;

            if(isValid(newX, newY) && !visited.has(key)){
                visited.add(key);
                queue.push([[newX, newY], [...path, [newX, newY]]]);//add new state to queue
            }
        }
    }
}

knightMoves([0, 0], [3, 3]);
knightMoves([3, 3], [4, 3]);
knightMoves([0, 0], [7, 7]);
