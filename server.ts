import http, {IncomingMessage, ServerResponse} from "http";

import {port} from "./config";
import SizeConvertor from "./SizeConvertor";
import Speller from "./Speller";

const sizeConvertor = (): SizeConvertor => new SizeConvertor();
const speller = (): Speller => new Speller();

const server = http.createServer((req: IncomingMessage, res: ServerResponse): void => {
    function errorHandler (e: Error): void {
        console.log(e);
        res.statusCode = 500;
        res.end("Internal server error");
    }

    req
        .pipe(sizeConvertor())
        .on("error", errorHandler)
        .pipe(speller())
        .on("error", errorHandler)
        .pipe(res)
        .on("error", errorHandler)
});

server.listen(port, () => console.log(`Server start at port ${port}`));
