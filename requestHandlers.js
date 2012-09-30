var fs = require('fs');

function writeSuccess(response, body) {
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write(body);
  response.end();
}

function index(response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Index page");
  response.end();
  console.log("Action index requested");
}

function about(response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("About us");
  response.end();
  console.log("Action about requested");
}

function auth(response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Auth form");
  response.end();
  console.log("Action auth requested");
}

function game(response) {
  console.log("Action game requested");
  fs.readFile('./public/index.html', function(err, html) {
    if (err) {
      throw err;
    }
    writeSuccess(response, html);
  });
}

exports.index = index;
exports.about = about;
exports.auth = auth;
exports.game = game;
