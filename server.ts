import http, {IncomingMessage, RequestListener, ServerResponse} from "http";

import {port} from "./config";
import SizeConvertor from "./SizeConvertor";
import Speller from "./Speller";
import HeadersFilter from "./HeadersFilter";

const router = (path: string, method: string): RequestListener | undefined => {
    if (path === "/" && method === "POST") {
       return (req: IncomingMessage, res: ServerResponse): void => {
            function errorHandler (e: Error): void {
                console.log(e);
                res.statusCode = 500;
                res.end("Internal server error");
            }

           const headersFilter: HeadersFilter = new HeadersFilter();
           const sizeConvertor: SizeConvertor = new SizeConvertor();
           const speller: Speller = new Speller();

            req
                .pipe(headersFilter)
                .on("error", errorHandler)
                .pipe(sizeConvertor)
                .on("error", errorHandler)
                .pipe(speller)
                .on("error", errorHandler)
                .pipe(res)
                .on("error", errorHandler)
        }
    }
}

const server = http.createServer((req: IncomingMessage, res: ServerResponse): void => {
    try {
        const {url,method,headers} = req;
        const parsedUrl: URL = new URL(url || "", `http://${headers.host}`);

        const controller: RequestListener | undefined = router(parsedUrl.pathname, method || "GET");

        if (!controller) {
            res.statusCode = 404;
            res.end("Not found");
        } else {
            controller(req, res);
        }
    } catch (e) {
        console.log(e);
        res.statusCode = 500;
        res.end("Internal server error");
    }
});

server.listen(port, () => console.log(`Server start at port ${port}`));
