var express = require('express')
var http = require('http')
var app = express()

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function (req, res) {
	res.send(JSON.stringify({ random_number: Math.random() }));
})

app.listen(3000, function () {
	console.log("app listenin")
})
