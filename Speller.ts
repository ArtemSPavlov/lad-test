import https from "https";
import {IncomingMessage} from "http";
import {Transform, TransformCallback} from "stream";
import {Buffer} from "buffer";

import {spellerPath} from "./config";
import {SpellerError} from "./SpellerError";

export default class Speller extends Transform {
    _transform(chunk: Buffer, encoding: BufferEncoding, callback: TransformCallback): void {
        try {
            https.get(spellerPath + chunk.toString(), async (res: IncomingMessage): Promise<void> => {
                const buffers: Buffer[] = [];
                for await (const chunk of res) buffers.push(chunk);
                const buffer: Buffer = Buffer.concat(buffers);
                const errors: SpellerError[] = JSON.parse(buffer.toString()) as SpellerError[];
                const result: string = errors.length
                    ? Speller.fixText(chunk.toString(), errors)
                    : chunk.toString();
                callback(null, result);
            });
        } catch (e) {
            console.log(e);
        }
    }

    private static fixText (text: string, errors: SpellerError[]): string {
        const words: string[] = text.split(" ");
        errors.forEach(error => {
                const index: number = words.indexOf(error.word);
                const correctedWord: string = error.s[0];
                if (index !== -1 && correctedWord) words[index] = correctedWord;
            }
        )
        return words.join(" ");
    }
}
