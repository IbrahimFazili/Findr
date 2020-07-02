
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

/**
 * Special Type of Queue to execute function calls that need to executed in
 * a synchronized fashion
 */
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
     * 
     * @param {function} func The function call to enqueue. This function must contain a callable as it's final argument
     *                        which must be called at the end of the function. Failing to do so would cause the queue to
     *                        get stuck
     * @param  {...any} args Arguments for the function in the required order
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
