import http, {IncomingMessage, ServerResponse} from "http";

import {port} from "./config";
import SizeConvertor from "./SizeConvertor";
import Speller from "./Speller";

const sizeConvertor = (): SizeConvertor => new SizeConvertor();
const speller = (): Speller => new Speller();

const server = http.createServer((req: IncomingMessage, res: ServerResponse): void => {
    req
        .pipe(sizeConvertor())
        .pipe(speller())
        .pipe(res)
});

server.listen(port, () => console.log(`Server start at port ${port}`));
