var queueService = require('./queueService')
// store job priorities in this json
// allot higher priority to the html job
var _jobPriorities = {
    'html': 100,
    'pdf': 10
};

/**
 * Gets the appropriate task object given a job type and job id
 * @param type either 'html' or 'pdf'
 * @param jobId the unique identifier for the job
 * @returns object containing different information about the specific task
 */
var getTask = function (type, jobId) {
    console.log("type=", type);
    switch (type) {
        case 'html':
            // return task with 10 seconds timeout for html tasks
            return _theTask(jobId, type, 10 * 1000, _jobPriorities.html);
            break;
        case 'pdf':
            // return task with 100 seconds timeout for pdf tasks
            return _theTask(jobId, type, 100 * 1000, _jobPriorities.pdf);
            break;
        default:
            return null;
    }
};


/**
 * private function to return the task object
 * @param jobId the unique identifier for the task
 * @param jobType either 'html' or 'pdf'
 * @param duration time in milliseconds for mock timeouts
 * @param priority
 * @returns {{priority: *, jobId: *, jobType: *, taskFunction: taskFunction}} the object describing the job
 * @private
 */
var _theTask = function (jobId, jobType, duration, priority) {
    return {
        priority: priority,
        jobId: jobId,
        jobType: jobType,
        taskFunction: function (callback) {
            var self = this;
            setTimeout(function () {
                callback(self.jobId, self.jobType);
            }, duration);
        }
    };
};


module.exports = {
    getTask: getTask
};