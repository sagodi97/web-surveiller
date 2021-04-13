/*
 * Entry point file for the API
 *
 */

import http from "http";
import { StringDecoder } from "string_decoder";

const server = http.createServer((req, res) => {
  const { method, headers, url } = req;

  const reqUrl = new URL(url, `http://${req.headers.host}`);
  const requestedPath = reqUrl.pathname.replace(/^\/+|\/+$/g, "");
  const queryString = reqUrl.searchParams;

  const decoder = new StringDecoder("utf-8");
  let buffer = "";

  req.on("data", (data) => {
    buffer += decoder.write(data);
  });

  req.on("end", () => {
    decoder.end();

    //Route request
    const data = {
      requestedPath,
      method: method.toLowerCase(),
      queryString,
      headers,
      payload: buffer,
    };

    const routeController =
      router[requestedPath][data.method] ?? router.notFound;

    routeController(data, (httpCode, payload) => {
      httpCode = typeof httpCode === "number" ? httpCode : 200;
      payload = typeof payload === "object" ? payload : {};

      res.setHeader("Content-Type", "application/json");
      res.writeHead(httpCode);
      res.end(JSON.stringify(payload));
    });
  });
});

server.listen(3000, () => {
  console.log("Live on 3000 !");
});

const controllers = {
  sample: {},
};

controllers.sample.get = (data, cb) => {
  cb(200);
};
controllers.sample.post = (data, cb) => {
  cb(201);
};

controllers.notFound = (data, cb) => {
  cb(404);
};

const router = {
  sample: controllers.sample,
  notFound: controllers.notFound,
};
