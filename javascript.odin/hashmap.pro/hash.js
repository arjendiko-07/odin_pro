class HashMap {
    constructor() {
        this.capacity = 16;
        this.loadFactor = 0.75;
        this.buckets = new Array(this.capacity);
    }

    hash(key) {
        let hashCode = 0;
        const primeNumber = 31;

        for (let i = 0; i < key.length; i++) {
            hashCode = (primeNumber * hashCode + key.charCodeAt(i)) % this.capacity;
        }

        return hashCode;
    }

    _checkIndex(index) {
        if (index < 0 || index >= this.buckets.length) {
            throw new Error("Trying to access index out of bounds");
        }
    }

    set(key, value) {
        const index = this.hash(key);
        this._checkIndex(index);

        if (this.buckets[index] === undefined) {
            this.buckets[index] = [];
        }

        const bucket = this.buckets[index];

        for (let pair of bucket) {
            if (pair[0] === key) {
                pair[1] = value;
                return;
            }
        }

        bucket.push([key, value]);

        if (this.length() / this.capacity > this.loadFactor) {
            this.resize();
        }
    }

    get(key) {
        const index = this.hash(key);
        this._checkIndex(index);

        const bucket = this.buckets[index];
        if (bucket === undefined) return null;

        for (let pair of bucket) {
            if (pair[0] === key) {
                return pair[1];
            }
        }

        return null;
    }

    has(key) {
        const index = this.hash(key);
        this._checkIndex(index);

        const bucket = this.buckets[index];
        if (bucket === undefined) return false;

        for (let pair of bucket) {
            if (pair[0] === key) {
                return true;
            }
        }

        return false;
    }

    remove(key) {
        const index = this.hash(key);
        this._checkIndex(index);

        const bucket = this.buckets[index];
        if (bucket === undefined) return false;

        for (let i = 0; i < bucket.length; i++) {
            if (bucket[i][0] === key) {
                bucket.splice(i, 1);
                return true;
            }
        }

        return false;
    }

    length() {
        let count = 0;

        for (let bucket of this.buckets) {
            if (bucket) {
                count += bucket.length;
            }
        }

        return count;
    }

    clear() {
        this.buckets = new Array(this.capacity);
    }

    keys() {
        const result = [];

        for (let bucket of this.buckets) {
            if (!bucket) continue;

            for (let pair of bucket) {
                result.push(pair[0]);
            }
        }

        return result;
    }

    values() {
        const result = [];

        for (let bucket of this.buckets) {
            if (!bucket) continue;

            for (let pair of bucket) {
                result.push(pair[1]);
            }
        }

        return result;
    }

    entries() {
        const result = [];

        for (let bucket of this.buckets) {
            if (!bucket) continue;

            for (let pair of bucket) {
                result.push(pair);
            }
        }

        return result;
    }

    resize() {
        const oldEntries = this.entries();

        this.capacity *= 2;
        this.buckets = new Array(this.capacity);

        for (const [key, value] of oldEntries) {
            this.set(key, value);
        }
    }
}

module.exports = HashMap;