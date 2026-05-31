import Node from "./node.js";

export default class LinkedList{
    constructor(){
        this.headNode=null;
    }

    append(value){
        const newNode=new Node(value);

        if(this.headNode===null){
            this.headNode=newNode;
            return;
        }

        let current = this.headNode;
        while(current.nextNode){
            current=current.nextNode;
        }

        current.nextNode=newNode;

    }

    prepend(value){
        const newNode=new Node(value);
        newNode.nextNode=this.headNode;
        this.headNode=newNode;
    }

    size(){
        let count=0;
        let current=this.headNode;
        while(current){
            count++;
            current=current.nextNode;
        }

        return count;
    }

    head(){
        return this.headNode ? this.headNode.value : undefined;
    }

    tail(){
        if(this.headNode===null) return undefined;

        let current=this.headNode;
        while(current.nextNode){
            current=current.nextNode;
        }

        return current.value;
    }

    at(index){
        if(index<0)return undefined;

        let current=this.headNode;
        let i=0;

        while(current){
            if(i===index)return current.value;
            current=current.nextNode;
            i++;
        }
        return undefined;
    }

    pop(){
        if(this.headNode===null)return undefined;

        const value = this.headNode.value;
        this.headNode=this.headNode.nextNode;

        return value;

    }

    contains(value){
        let current=this.headNode;

        while(current){
            if(current.value===value)return true;
            current=current.nextNode;
        }

        return false;
    }

    findIndex(value){
        let current=this.headNode;
        let i=0;

        while(current){
            if(current.value===value)return i;
            current=current.nextNode;
            i++;
        }
        return -1;
    }

    toString(){
        let current=this.headNode;
        let result="";

        while(current){
            result += `(${current.value})->`;
            current = current.nextNode;
        }

        return result + "null";
    }
    
    insertAt(index, ...values){
        if(index<0 || index >this.size()){
            throw new RangeError("Index out of bonds");
        }

        if(index===0){
            values.reverse().forEach(v=>this.prepend(v));
            return;
        }

        let current=this.headNode;
        let i=0;

        while(i<index-1){
            current=current.nextNode;
            i++;
        }

        values.forEach(v=>{
            const newNode=new Node(v);
            newNode.nextNode=current.nextNode;
            current.nextNode=newNode;
            current=newNode;
        });
    }

    removeAt(index){
        if(index<0 || index >= this.size()){
            throw new RangeError("Index out of bounds");
        }

        if(index===0){
            return this.pop();
        }

        let current =this.headNode;
        let i=0;

        while(i<index-1){
            current=current.nextNode;
            i++;
        }
        const removed =current.nextNode;
        current.nextNode=removed.nextNode;

        return removed.value;
    }
}