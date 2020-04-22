const express = require('express');
const app = express();
const port = process.env.PORT || 8000;

var https = require('https');
var fs = require('fs');

var qs = require('querystring');

if (!process.env.CLIENT_ID) {
  console.error('CLIENT_ID not set.');
}

if (!process.env.CLIENT_SECRET) {
  console.error('CLIENT_SECRET not set.');
}

app.get("/refresh", (request, response) => {
  var options = {
    'method': 'POST',
    'hostname': 'api.sandbox.paypal.com',
    'path': '/v1/oauth2/token',
    'headers': {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64')
    }
  };
  
  var req = https.request(options, function (res) {
    var chunks = [];
  
    res.on("data", function (chunk) {
      chunks.push(chunk);
    });
  
    res.on("end", function (chunk) {
      var body = Buffer.concat(chunks);
      console.log(JSON.parse(body.toString()));
      response.json(JSON.parse(body.toString()));
    });
  
    res.on("error", function (error) {
      console.error(error);
    });
  });
  
  var postData = qs.stringify({
    'grant_type': 'client_credentials'
  });
  
  req.write(postData);
  
  req.end();
});

app.listen(port, () =>
  console.log(`Example app listening on ${port}!`)
);