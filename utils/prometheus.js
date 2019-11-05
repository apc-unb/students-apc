var Register = require('prom-client').register;  
var Counter = require('prom-client').Counter;  
var Histogram = require('prom-client').Histogram;  
var Summary = require('prom-client').Summary;  
var ResponseTime = require('response-time');  
var Logger = require('./logger');


/**
 * A Prometheus counter that counts the invocations with different paths
 * e.g. /foo and /bar will be counted as 2 different paths
 */
module.exports.pathsTaken = pathsTaken = new Counter({  
    name: 'pathsTaken',
    help: 'Paths taken in the app',
    labelNames: ['path']
});

module.exports.classesAccessed = classesAccessed = new Counter({
    name: 'classesAccessed',
    help: 'Classes accessed in the app (from static classes)',
    labelNames: ['aulas']
});
/**
 * A Prometheus summary to record the HTTP method, path, response code and response time
 */
module.exports.responses = responses = new Summary({  
    name: 'responses',
    help: 'Response time in millis',
    labelNames: ['method', 'path', 'status']
});

/**
 * This funtion will start the collection of metrics and should be called from within in the main js file
 */
module.exports.startCollection = function () {  
    Logger.log(Logger.LOG_INFO, `Starting the collection of metrics, the metrics are available on /metrics`);
    require('prom-client').collectDefaultMetrics();
};

/**
 * This function increments the counters that are executed on the request side of an invocation
 * Currently it increments the counters for numOfPaths and pathsTaken
 */
module.exports.requestCounters = function (req, res, next) {
    if (req.path != '/metrics') {
        pathsTaken.inc({ path: req.path });
        if(req.path.startsWith("/aulas/aulas") && req.path.endsWith(".html")){
            classesAccessed.inc({ aulas: req.path });
        }
    }
    next();
}

/**
 * This function increments the counters that are executed on the response side of an invocation
 * Currently it updates the responses summary
 */
module.exports.responseCounters = ResponseTime(function (req, res, time) {  
    if(req.url != '/metrics') {
        responses.labels(req.method, req.url, res.statusCode).observe(time);
    }
})

/**
 * In order to have Prometheus get the data from this app a specific URL is registered
 */
module.exports.injectMetricsRoute = function (App) {  
    App.get('/metrics', (req, res) => {
        res.set('Content-Type', Register.contentType);
        res.end(Register.metrics());
    });
};