
class Queue {

    constructor(onenqueue=null, ondequeue=null) {
        this.elements = [];
        this.onenqueue = onenqueue;
        this.ondequeue = ondequeue;
    }

    isEmpty() {
        return this.elements.length === 0;
    }

    enqueue(object) {
        this.elements.push(object);
        this.onenqueue();
    }

    dequeue() {
        const returnVal = !this.isEmpty() ? this.elements.shift() : null;
        this.ondequeue();
        return returnVal;
    }

}

class CallbackQueue extends Queue {

    constructor() {
        super();
        this.isFirst = true;
        this.onenqueue = function () {
            if (this.isFirst) this.dequeue();
        }
        this.ondequeue = function () {
            this.isFirst = false;
        }
    }

    /**
     * [{ func: , args: [] }, ]
     */
    enqueue(func, ...args){ 
        const request = {
            func,
            args
        };

        super.enqueue(request);
    }

    dequeue() {
        const functionRequest = super.dequeue();
        if (functionRequest !== null){
            const args = functionRequest.args;
            return functionRequest.func(...args, () => {
                if (this.isEmpty()) this.isFirst = true;
                else return this.dequeue();
            });
        }
    }


}

module.exports.Queue = Queue;
module.exports.CallbackQueue = CallbackQueue;
