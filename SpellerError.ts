export type SpellerError = {
    code: number,
    pos: number,
    row: number,
    col: number,
    len: number,
    word: string,
    s: string[]
}
