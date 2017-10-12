
const express = require('express');
const app = express();
var path    = require("path");
var bodyParser = require('body-parser');

var mosca = require('mosca');
var mongo = require('./collections/client');
var akamai = require('./akamai/edgegrid');

var ascoltatore = {
  //using ascoltatore
  type: 'mongo',
  url: 'mongodb://localhost:27017/mqtt',
  pubsubCollection: 'ascoltatori',
  mongo: {}
};

var settings = {
  port: 1883,
  backend: ascoltatore,
  // persistence: {
  //   factory: mosca.persistence.Mongo,
  //   url: 'mongodb://localhost:27017/mqtt'
  // }

};

var moscaServer = new mosca.Server(settings);

var videoMetadata = "No transcoded video files yet";
// The hostname CNAMED to Akamai to be fast purging on (needs a config in front)
var akamaizedHostname = "myhostname.com";
var metadataTimeout;
//support parsing of application/json type post data
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send("Number of MQTT clients connected = " + mongo.getClientsCount());
})

app.get('/akamai/sureroute-test-object.html', function (req,res){
  res.sendFile(path.join(__dirname + '/sureroute-test-object.html'));
})

app.post('/akamai/video', function(req, res) {
    videoMetadata = req.body;
    console.log(req.body);
    res.send('200 OK');
});

app.post('/akamai/videolib', function(req, res) {
    videoMetadata = req.body;
    console.log(req.body);

    metadataTimeout = setTimeout(() => {videoMetadata = "No transcoded video files yet"}, 300000);


    res.send('200 OK');
});

app.get('/akamai/video', function(req, res) {
    res.send(videoMetadata);
});

app.listen(8000, function () {
  console.log('app listening on port 8000!')
})

// Put a friendly message on the terminal
//console.log("Server running at http://127.0.0.1:8000/");

moscaServer.on('clientConnected', function(client) {
    console.log('client connected', client.id);
    mongo.updateClients(true, client.id);
    akamai.invalidate(akamaizedHostname, ['/']);
});

moscaServer.on('clientDisconnected', function(client) {
    console.log('client closed', client.id);
    mongo.updateClients(false, client.id);
    akamai.invalidate(akamaizedHostname, ['/']);
});

// fired when a message is received
moscaServer.on('published', function(packet, client) {
  console.log('Published', packet.payload);
});

moscaServer.on('ready', setup);

// fired when the mqtt server is ready
function setup() {
  akamai.edgeGridInit();
  mongo.purgeClientsCollections();
  console.log('Mosca server is up and running');

}
