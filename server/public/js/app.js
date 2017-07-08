var app = angular.module('myApp', ['angular-growl']);
app.controller('myCtrl', ['$scope', 'socket', 'growl', function ($scope, socket, growl) {
    $scope.jobs = [];
    $scope.idCountHtml = 0;
    $scope.idCountPdf = 0;
    $scope.pdfTask = function () {
        $scope.idCountPdf++;
        socket.emit('processRequest', {jobId: $scope.idCountPdf, jobType: 'pdf'})
    };

    $scope.htmlTask = function () {
        $scope.idCountHtml++;
        socket.emit('processRequest', {jobId: $scope.idCountHtml, jobType: 'html'})
    };

    socket.on('init', function (data) {
        console.log("socket init!");
    });
    socket.on('enqueued', function (data) {
        console.log("enqueued: ", JSON.stringify(data));
        $scope.jobs.push({
            name: data.jobType + " " + (data.jobId),
            createdAt: new Date().toUTCString(),
            type: data.jobType,
            status: 'inQueue',
            jobId: $scope.idCountPdf
        });
        // show notification for 10 seconds
        growl.info('Job ' + data.jobType + " " + data.jobId + " enqueued successfully", {
            title: "Enqueued",
            ttl: 10000,
            onlyUniqueMessages: false
        })
    });
    socket.on('processing', function (data) {
        console.log("processing", JSON.stringify(data));
        var jobId = data.jobId;
        var jobType = data.jobType;
        var jobName = jobType + " " + jobId;
        var jobs = $scope.jobs;
        for (var i = 0; i < jobs.length; i++) {
            var curJob = jobs[i];
            var curJobName = curJob.name;
            if (curJobName == jobName) {
                $scope.jobs[i].status = "Processing";
                // show notification for 10 seconds
                growl.warning('Job ' + data.jobType + " " + data.jobId + " processing now", {
                    title: "Processing",
                    ttl: 10000,
                    onlyUniqueMessages: false
                });
                return;
            }
        }
    });
    socket.on('processed', function (data) {
        console.log("processed: ", JSON.stringify(data));
        var jobId = data.jobId;
        var jobType = data.jobType;
        var jobName = jobType + " " + jobId;
        var jobs = $scope.jobs;
        for (var i = 0; i < jobs.length; i++) {
            var curJob = jobs[i];
            var curJobName = curJob.name;
            if (curJobName == jobName) {
                $scope.jobs[i].status = "Processed";
                // show notification for 10 seconds
                growl.success('Job ' + data.jobType + " " + data.jobId + " processed successfully", {
                    title: "Processed",
                    ttl: 10000,
                    onlyUniqueMessages: false
                });
                return;
            }
        }
    });
}]);