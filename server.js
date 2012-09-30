var http = require("http");
var url = require("url");

function start(route, handle) {

  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    if (pathname != "/favicon.ico") {
      console.log("");
      console.log("Incoming request: " + pathname);
      route(handle, pathname, response);
    }
    //console.log(request)
  }

  console.log("Starting server...");
  http.createServer(onRequest).listen(8888);
  console.log("...server started!");

}

exports.start = start;

