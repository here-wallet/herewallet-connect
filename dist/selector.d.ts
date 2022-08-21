export declare class Task<T> {
    promise: Promise<T>;
    resolve: (v: T) => void;
    reject: () => void;
    constructor();
}
export declare const selector: () => Promise<"here" | "near">;
