function fib(n){
    if(n<=1) return n;

    return fib(n-1)+fib(n-2);
}

function fibs(num){
    let arr=[];

    for(let i=0; i<num; i++){
        arr.push(fib(i));
    }
    return arr;
}