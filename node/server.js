var http = require("http");
var url = require("url");

function start(route) {

  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log("Incoming request: " + pathname);
    route(pathname);

    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Hello World");
    response.end();
    //console.log(request)
  }

  console.log("Starting server...");
  http.createServer(onRequest).listen(8888);
  console.log("...server started!");

}

exports.start = start;

