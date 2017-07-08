'use strict';
const taskService = require('./taskService.js');
var _PriorityQueue = require('priorityqueuejs');
var queue;
var isProcessing=false;

/**
 * Initializes a new empty priority queue with a comparator that compares the priorities
 */
var initQueue = function initQueue() {
    queue = new _PriorityQueue(function (a, b) {
        return a.priority - b.priority;
    });
};

/**
 * Creates and enqueus a job of given type
 * @param jobType either 'html' or 'pdf'
 * @param jobId unique identifier to identify the job
 * @param doneCallback callback to be invoked on job completion
 */
var enqueueJob = function enqueueJob(jobType, jobId, doneCallback) {
    var theTask = taskService.getTask(jobType, jobId);
    queue.enq(theTask);
};

/**
 * Removes the topmost element from the queue.
 * @returns the topmost element or null if queue is empty
 */

var dequeue = function dequeue() {
    if (queue.size() > 0) {
        return queue.deq();
    } else return null;
};

/**
 * Starts the processing task for the queue recursively
 * @param callback the recursive function to be invoked on task completion
 */
var startProcessingQueue = function startProcessingQueue(callback) {
    dequeue().taskFunction(callback);
};

/**
 * gets the number of elements in queue
 * @returns {number} the size of the queue or 0 if empty
 */
var getQueueSize = function getQueueSize() {
    if (!!queue) {
        return queue.size();
    } else {
        return 0;
    }
};

module.exports = {
    initQueue: initQueue,
    enqueueJob: enqueueJob,
    dequeue: dequeue,
    getQueueSize: getQueueSize,
    startProcessingQueue: startProcessingQueue,
    isProcessing: isProcessing
};
