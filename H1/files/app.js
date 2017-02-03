var express = require('express');
var webshot = require('webshot');
var sharp = require('sharp');
var AWS = require('aws-sdk');
var fs = require('fs');
const uuidV1 = require('uuid/v1'); //?
var path = require('path');
var app = express()
var s3 = new AWS.S3(); // refer to https://aws.amazon.com/sdk-for-node-js/
var myBucket = 'cpp-cs499';
var fileNames = [];

// This is how your enable CORS for your web service
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function (req, res) {
	res.sendfile('index.html')
})



// prepare multiple versions for differnet phones + stuff
app.get('/screenshot', function (req, res) {
	var fileid = uuidV1(); 
	var filename = uuidV1() + '.jpeg';
	var filename2= uuidV1() + '-512.jpeg'; 
	var filename3 = uuidV1() + '-256.jpeg';  
	console.log("Getting screenshot for " + req.query.url);
	webshot(req.query.url, filename, function(err) {
		// scrnshot saved to google.png
		if (err) {
			console.log("screenshot failed", err);
			res.send('failed!');
		} else {
			// resize image
			console.log("screenshots are done");	
			sharp(filename)
				.resize(512, 384)
				.toFile(filename2, (err, info) => {
					if (err) {
						console.log("err: ", err);
					} else {
						console.log("resized to 512: ", info);
						uploadFileToS3(filename2);
					}
				});
				sharp(filename)
					.resize(256, 192)
					.toFile(filename3, (err, info) => {
						if (err) {
							console.log("err: ", err);
						} else {
							console.log("resized to 256: ", info);
							uploadFileToS3(filename3);
						}
					});
				uploadFileToS3(filename);
				res.send('OK!');
		}
	});
})

app.get('/list', function (req, res) {
	var params = {
		Bucket: myBucket
	};
	s3.listObjects(params, function(err, data) {
		fileNames = [];
		for(var i = 0; i < data.Contents.length; i++) {
			data.Contents[i].Url = 'https://s3-us-west-1.amazonaws.com/' + data.Name + '/' + data.Contents[i].Key;
			//fileNames[i] = data.Contents[i].Key;
		}
		res.send(data.Contents);
	});
})

app.get('/watch', function (req, res) {
	fs.watch(req.query.url, function (event, filename) {
		console.log('event is: ' + event);
		var uploadParams = {Bucket: myBucket, Key: '', Body: ''};
		if (filename) {
			console.log('filename is: ' + filename);
		} else {
			console.log('filename not provided');
		}
		if (event == 'change') {
			console.log(event);
			console.log(filename);
			var params = {
				Bucket: myBucket
			};
			s3.listObjects(params, function(err, data) {
				fileNames = [];
				var present = 0;
				for(var i = 0; i < data.Contents.length; i++) {
					//data.Contents[i].Url = 'https://s3-us-west-1.amazonaws.com/' + data.Name + '/' + data.Contents[i].Key;
					fileNames[i] = data.Contents[i].Key;
					if (fileNames[i] == filename) {
						console.log('file already there');
						present = 1;
						break;
					}
				}
				if (present == 0) {
					var fileStream = fs.createReadStream(filename);
					fileStream.on('error', function(err) {
						console.log('File error', err);
					});
					uploadParams.Body = fileStream;
					uploadParams.Key = path.basename(filename);
					s3.upload (uploadParams, function (err, data)  {
						if (err) {
							console.log("err: ", err);
						} if (data) {
							console.log("success upload!", data.Location);
						}
					});
				}
				if (present == 1) {
					fs.stat(filename, function(exists) {
						if (err == null) {
							console.log('file exists');
						} else if (err.code == 'ENOENT') {
							s3.deleteObject(params, function(err, data) {
								if (err) console.log(err, err.stack);
								else 	console.log("deleted");
							});
						} else {
							console.log('something bad happened');
						}
					});
				}
				console.log('file not there');
				//res.send(fileNames);
			});
		} else if (event == 'rename') {
			console.log(event);
			console.log(filename);
			var params = {
				Bucket: myBucket
			};
			s3.listObjects(params, function(err, data) {
				fileNames = [];
				var present = 0;
				for(var i = 0; i < data.Contents.length; i++) {
					//data.Contents[i].Url = 'https://s3-us-west-1.amazonaws.com/' + data.Name + '/' + data.Contents[i].Key;
					fileNames[i] = data.Contents[i].Key;
					if (fileNames[i] == filename) {
						console.log('file already there');
						present = 1;
						break;
					} 
				}
				if (present == 0) {
					var fileStream = fs.createReadStream(filename);
					fileStream.on('error', function(err) {
						console.log('File error', err);
					});
					uploadParams.Body = fileStream;
					uploadParams.Key = path.basename(filename);
					s3.upload (uploadParams, function (err, data)  {
						if (err) {
							console.log("err: ", err);
						} if (data) {
							console.log("success upload!", data.Location);
						}
					});
				}
				if (present == 1) {
					console.log("hey");
					var params = {
						Bucket: myBucket,
						Key: filename
					}
					fs.stat(filename, function(err, stat) {
						if (err == null) {
							console.log('file exists');
						} else if (err.code == 'ENOENT') {
							s3.deleteObject(params, function(err, data) {
								if (err) {
									console.log(err, err.stack);
								} else {
									console.log("deleted");
								}
							});
						} else {
							console.log('something bad happened');
						}
					});
				}
				console.log('file not there');
				//res.send(fileNames);
			});
		}
	});
});



function uploadFileToS3(imageFilePath) {
	fs.readFile(imageFilePath, function (err, data) {
		params = {Bucket: myBucket, Key: imageFilePath, Body: data, ACL: "public-read", ContentType: "image/png"};
	    s3.putObject(params, function(err, data) {
	        if (err) {
	        	console.log(err)
	        } else {
	            console.log("Successfully uploaded data to " + myBucket, data);
	            fs.unlink(imageFilePath);
	        }
	    });
	});
}

app.listen(3000, function () {
	console.log("app listening on port 3000")
	
})

