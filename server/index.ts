import http from "http";
import next from "next";
import { initSocket } from "./socket";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = http.createServer((req, res) => {
    handle(req, res);
  });

  initSocket(server);

  server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
});
