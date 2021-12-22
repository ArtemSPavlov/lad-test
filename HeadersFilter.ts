import {Transform, TransformCallback} from "stream";

export default class HeadersFilter extends Transform {
    _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback) {
        try {
            const parts: string[] = chunk.toString().split(new RegExp("\\r\\n", "g"));
            const bodyParts: string[] = parts.filter(part => HeadersFilter.lineFilter(part));
            callback(null, bodyParts.join("\\r\\n"));
        } catch (e) {
           callback(e as Error);
        }
    }

    private static lineFilter(paragraph: string): boolean {
        return !!paragraph
            && !paragraph.startsWith("-------------")
            && !paragraph.startsWith("Content-Disposition:")
            && !paragraph.startsWith("Content-Type:")
    }
}
