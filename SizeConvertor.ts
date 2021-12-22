import {Transform, TransformCallback} from "stream";
import {Buffer} from "buffer";

import {maxLetters} from "./config";

export default class SizeConvertor extends Transform {
    private tail: Buffer = Buffer.alloc(0);

    _transform(chunk: Buffer, encoding: BufferEncoding, callback: TransformCallback): void {
        try {
            const chunkWithTail: Buffer = Buffer.concat([this.tail, chunk]);
            const words: string[] = chunkWithTail.toString().split(" ");

            const lastWord: string | undefined = words.pop();
            this.tail = Buffer.from(lastWord || "", "utf-8");

            const dividedChunks: string[] = words.reduce(SizeConvertor.reducer, []);
            dividedChunks.forEach(text => this.push(text + " ", "utf-8"));
            callback();
        } catch (e) {
            callback(e as Error);
        }
    }

    private static reducer(acc: string[] = [], word: string): string[] {
        const lastChunkIndex: number = acc.length - 1;
        if (!acc.length || acc[lastChunkIndex].length + word.length + 1 > maxLetters) acc.push(word);
        else acc[lastChunkIndex] += (" " + word);
        return acc;
    }

    _flush(callback: TransformCallback): void {
        callback(null, this.tail);
    }
}
