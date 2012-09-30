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

exports.index = index;
exports.about = about;
