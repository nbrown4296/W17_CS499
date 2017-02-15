var request = require('request');
var AWS = require('aws-sdk');

var express = require('express')
var app = express()

AWS.config.update({
  region: "us-west-2"
});

'use strict';

module.exports.hello = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};

module.exports.fetch = (event, context, callback) => {
  fetchWaitingtimes();
};

module.exports.queryBusRoute = (event, context, callback) => {  
  queryBusRoute(parseInt(event.pathParameters.id), callback);
};

module.exports.queryAllBusRoutes = (event, context, callback) => {
  queryAllBusRoutes(1772, callback);
};

var docClient = new AWS.DynamoDB.DocumentClient();
var table = "bus_routes";

function fetchWaitingtimes() {
  request('https://rqato4w151.execute-api.us-west-1.amazonaws.com/dev/info', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);        
      var items = JSON.parse(body);
      for(var i = 0; i < items.length; i++) {
        console.log(items[i].id, items[i].logo, items[i].lat, items[i].lng, items[i].route);
        putItem(items[i].id, items[i].logo, items[i].lat, items[i].lng, items[i].route);
      }
    }
  })
}

function putItem(id, logo, lat, lng, route) {
  var params = {
      TableName:table,
      Item:{
          "id": id,
          "timestamp": Date.now(),
          "logo": logo,
          "lat": lat,
          "lng": lng,
          "route": route
      }
  };

  console.log("Adding a new item...");
  docClient.put(params, function(err, data) {
      if (err) {
          console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
      } else {
          console.log("Added item:", JSON.stringify(data, null, 2));
      }
  });       
}

function queryBusRoute(id, callback) {
  var params = {
      TableName : table,
      KeyConditionExpression: "#key = :inputId",
      ExpressionAttributeNames:{
          "#key": "id"
      },
      ExpressionAttributeValues: {
          ":inputId": id
      }
  };

  docClient.query(params, function(err, data) {
    if (err) {
      console.error("Unable to query. Error:", JSON.stringify(err, null, 2));      
      if (callback) {
        const responseErr = {
          statusCode: 500,
          headers: {
            "Access-Control-Allow-Origin" : "*" // Required for CORS support to work
          },
          body: JSON.stringify({'err' : err}),
        };
        callback(null, responseErr);  
      }
    } else {
      data.Items.forEach(function(item) {
        console.log(item);
      });
      
      if (callback) {
        const responseOk = {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin" : "*" // Required for CORS support to work
          },
          body: JSON.stringify(data.Items),
        };
        callback(null, responseOk);  
      }
    }
  });
}

function queryAllBusRoutes(id, callback) {
  request('https://rqato4w151.execute-api.us-west-1.amazonaws.com/dev/info', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var items = JSON.parse(body);
      if (callback) {
        const responseOk = {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin" : "*" // Required for CORS support to work
          },
          body: JSON.stringify(items),
        };
        callback(null, responseOk);  
      }
    }
  })
//
}



