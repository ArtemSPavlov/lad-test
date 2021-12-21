import http from 'http';

import {port} from "./config";

const server = http.createServer((req, res) => {
    res.end('Hello!!');
})

server.listen(port, () => console.log(`Server start at port ${port}`));
