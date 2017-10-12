// Akamai EdgeGrid signing library
var EdgeGrid = require('edgegrid');
var path    = require("path");

// Optional command-line arguments
var debug = false;
var verbose = true;
var headers = {};

// The result data returned by the purge POST request
var purgePostResult;

// The path to the .edgerc file to use for authentication
// var edgercPath = path.join(os.homedir(), "/.edgerc");
var edgercPath = path.join(__dirname, "/.edgerc");

// The section of the .edgerc file to use for authentication
var sectionName = "ccu";

// Create a new instance of the EdgeGrid signing library
var edgeGridHandler;

module.exports = {
  edgeGridInit: function(){
    edgeGridHandler = new EdgeGrid({
       path: edgercPath,
       section: sectionName,
       debug: debug
   });
 },
 invalidate: function(hostname, objectArray){
   /**
 * Adds item to be invalidated.
 */

    purgeObj = {
        "hostname": hostname,
        "objects": objectArray
    };

    console.log("Adding data to queue: " + JSON.stringify(purgeObj));

    edgeGridHandler.auth({
        path: "/ccu/v3/invalidate/url",
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: purgeObj
    });

    edgeGridHandler.send(function(data, response) {

        data = JSON.parse(data);
        console.log("FastPurge Response: ", response.body);
    });
 }
}
