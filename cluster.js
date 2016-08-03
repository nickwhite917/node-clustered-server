var cluster = require('cluster');
var http = require('http');

var numWorkers = 2;

if(cluster.isMaster){
    for (var i = 0; i < numWorkers; i++){
        console.log("Master: about to fork a worker...");
        cluster.fork();
    }
    cluster.on('fork', function (worker) {
        console.log("Master: fork event (worker " + worker.id + ")");
    });
    cluster.on('online', function (worker) {
        console.log("Master: online event (worker " + worker.id + ")");
    });
    cluster.on('listening', function (worker) {
        console.log("Master: listening event (worker " + worker.id + ", pid "+worker.process.id +", " + worker.address +", "+worker.port +")");
    });
    cluster.on('exit', function (worker) {
        console.log("Master: exit event (worker " + worker.id + ")");
    });
} else {
    console.log("Worker: worker #" + cluster.worker.id + " ready!");
    var count = 0;

    http.createServer(function(req,res){
        res.writeHead(200);
        count++;
        console.log("Worker #: "+cluster.worker.id + "incremented count to " + count);
        res.end("Hello from worker #: " + cluster.worker.id);
    }).listen(process.env.PORT || 5500, process.env.IP);

    console.log(process.env.PORT || 5500);
}