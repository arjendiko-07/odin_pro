class Node {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

class Tree {
    constructor(array) {
        this.root = this.builtTree(array);
    }

    builtTree(array) {
        const sorted = [...new Set(array)].sort((a, b) => a - b);

        const built = (arr, start, end) => {
            if (start > end) return null;

            const mid = Math.floor((start + end) / 2);
            const node = new Node(arr[mid]);

            node.left = built(arr, start, mid - 1);
            node.right = built(arr, mid + 1, end);

            return node;
        };

        return built(sorted, 0, sorted.length - 1);
    }

    includes(value, node = this.root) {
        if (node === null) return false;

        if (value === node.data) return true;

        if (value < node.data) return this.includes(value, node.left);
        else return this.includes(value, node.right);
    }

    insert(value, node = this.root) {
        if (this.root === null) {
            this.root = new Node(value);
            return;
        }

        if (value === node.data) return;

        if (value < node.data) {
            if (node.left) this.insert(value, node.left);
            else node.left = new Node(value);
        } else {
            if (node.right) this.insert(value, node.right);
            else node.right = new Node(value);
        }
    }

    deleteIteam(value, node = this.root) {
        if (node === null) return null;

        if (value < node.data) {
            node.left = this.deleteIteam(value, node.left);
        } else if (value > node.data) {
            node.right = this.deleteIteam(value, node.right);
        } else {
            if (node.left === null) return node.right;
            if (node.right === null) return node.left;

            let successor = node.right;
            while (successor.left) {
                successor = successor.left;
            }

            node.data = successor.data;
            node.right = this.deleteIteam(successor.data, node.right);
        }

        return node;
    }

    levelOrderForEach(callback) {
        if (typeof callback !== "function")
            throw new Error("Callback is required");

        const queue = [this.root];

        while (queue.length) {
            const node = queue.shift();

            callback(node.data);

            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
    }

    inOrderForEach(callback, node = this.root) {
        if (typeof callback !== "function")
            throw new Error("Callback is required");
        if (node === null) return;

        this.inOrderForEach(callback, node.left);
        callback(node.data);
        this.inOrderForEach(callback, node.right);
    }

    preOrderForEach(callback, node = this.root) {
        if (typeof callback !== "function")
            throw new Error("Callback is required");
        if (node === null) return;

        callback(node.data);
        this.preOrderForEach(callback, node.left);
        this.preOrderForEach(callback, node.right);
    }

    postOrderForEach(callback, node = this.root) {
        if (typeof callback !== "function")
            throw new Error("callback is required");
        if (node === null) return;

        this.postOrderForEach(callback, node.left);
        this.postOrderForEach(callback, node.right);
        callback(node.data);
    }

    height(value) {
        const findNode = (node) => {
            if (node === null) return null;

            if (node.data === value) return node;

            return value < node.data
                ? findNode(node.left)
                : findNode(node.right);
        };

        const target = findNode(this.root);
        if (target === null) return undefined;

        const getHeight = (node) => {
            if (node === null) return -1;
            return 1 + Math.max(getHeight(node.left), getHeight(node.right));
        };

        return getHeight(target);
    }

    depth(value) {
        let node = this.root;
        let depth = 0;

        while (node) {
            if (value === node.data) return depth;

            node = value < node.data ? node.left : node.right;
            depth++;
        }

        return undefined;
    }

    isBalanced(node = this.root) {
        const check = (n) => {
            if (n === null) return 0;

            const left = check(n.left);
            const right = check(n.right);

            if (left === -1 || right === -1) return -1;
            if (Math.abs(left - right) > 1) return -1;

            return 1 + Math.max(left, right);
        };

        return check(node) !== -1;
    }

    rebalance() {
        const values = [];

        this.levelOrderForEach((val) => values.push(val));

        this.root = this.builtTree(values);
    }
}

// -------------------- DRIVER --------------------

const randomArray = () =>
    Array.from({ length: 10 }, () => Math.floor(Math.random() * 100));

const prettyPrint = (node, prefix = "", isLeft = true) => {
    if (node === null) return;

    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
};

const tree = new Tree(randomArray());

console.log("Initial tree:");
prettyPrint(tree.root);

console.log("Is balanced?", tree.isBalanced());

// traversals
console.log("\nLevel order:");
tree.levelOrderForEach((v) => console.log(v));

console.log("\nPre order:");
tree.preOrderForEach((v) => console.log(v));

console.log("\nPost order:");
tree.postOrderForEach((v) => console.log(v));

console.log("\nIn order:");
tree.inOrderForEach((v) => console.log(v));

// unbalance tree
tree.insert(150);
tree.insert(200);
tree.insert(300);

console.log("\nAfter inserting big numbers:");
console.log("Is balanced?", tree.isBalanced());

prettyPrint(tree.root);

// rebalance
tree.rebalance();

console.log("\nAfter rebalance:");
console.log("Is balanced?", tree.isBalanced());

prettyPrint(tree.root);