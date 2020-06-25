const MATCH_EVENT = 'match';
const MESSAGE_EVENT = 'message';

class Event {
    /**
     * @param {String} type Event type. Can be one of 'message' or 'match'
     * @param {Object} details Object containing details about the event
     * @param {Number} expire_time (Optional) Expiry time for this event. If not provided, 
     * event doesn't expire
     */
    constructor(type, details, expire_time) {
        this.type = type;
        this.time = (new Date()).getTime();
        this.details = details;
        this.expire_time = expire_time !== undefined ? expire_time : -1;
    }
    
    /**
     * returns true if this event is not valid anymore
     * @returns {Boolean} true if this event has expired
     */
    hasExpired() {
        return (new Date()).getTime() >= this.expire_time;
    }

}



class EventQueue {
    
    constructor(events){
        this.events = events === undefined ? [] : events;
    }
    
    isEmpty() {
        return this.events.length == 0;
    }

    enqueue(event) {
        this.events.push(event); 
    } 
    
    dequeue() {
        return this.isEmpty() ? "Queue empty" : this.events.shift();
    }

    dequeueAll() {
        const allEvents = this.events;
        this.events = [];
        return allEvents;
    }
    
}

module.exports.Event = Event;
module.exports.EventQueue = EventQueue;
module.exports.MATCH_EVENT = MATCH_EVENT;
module.exports.MESSAGE_EVENT = MESSAGE_EVENT;
