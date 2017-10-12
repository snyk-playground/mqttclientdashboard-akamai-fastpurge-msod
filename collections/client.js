

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/mqtt';
var currentClientsCount = 0;



module.exports = {
  purgeClientsCollections: function(){
    MongoClient.connect(url, function(err,db) {
      if(err){
        console.log('error');
      } else {
        console.log("Connected correctly to server");


      }

    });
  },
  updateClients : function(newClient = false, clientId){

      MongoClient.connect(url, function(err,db) {
        if(err){
          console.log('connection to mongo error');
        } else {
          if(newClient){
            db.collection('clientsConnected').insertOne({'clientId':clientId}, function(err, result){
              if(err){
                console.error('Error inserting new client id into collection');
                console.error(err);
              } else {
                currentClientsCount++;
                db.close();
              }
            });
          } else {
            db.collection('clientsConnected').deleteOne({'clientId':clientId}, function(err, result){
              if(err){
                console.error('Error delete client id from collection');
                console.error(err);
              } else {
                currentClientsCount--;
                db.close();
              }
            });
          }
        }
      });



  },
  getClientsCount : function(){
    return currentClientsCount;
  },

};
