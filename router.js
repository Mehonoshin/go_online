function route(handle, pathname, response) {
  console.log("route is " + pathname);
  if (typeof handle[pathname] === 'function') {
    handle[pathname](response);
  } else {
    response.writeHead(404, {"Content-Type": "text/plain"});
    response.write("404 Not found");
    response.end();
    console.log("!!! route not found");
  }
}

exports.route = route;
