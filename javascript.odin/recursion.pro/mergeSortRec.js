function mergesort(arr){
    if(arr.length <= 1){
        return arr;
    }

    const middle = Math.floor(arr.length/2);

    const lHalf = arr.slice(0, middle);
    const rHalf = arr.slice(middle);

    const lSort = mergesort(lHalf);
    const rSort = mergesort(rHalf);

    return merge(lSort, rSort);
}

    function merge(left, right){
        let sorted=[];
        let i=0;
        let j=0;

        while(i<left.length && j<right.length){
            if(left[i]<right[j]){
                sorted.push(left[i]);
                i++;
            }else{
                sorted.push(right[j]);
                j++;
            }
        }

    return sorted
        .concat(left.slice(i))
        .concat(right.slice(j));
    }
    
