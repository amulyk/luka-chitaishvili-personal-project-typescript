export interface Step {
    index: number;
    meta: {
        title: string;
        description: string;
    };
    call: (store: object | null) => void;
    restore?: () => void;
    silent?: boolean;
}
interface Error {
    message: string;
    name: string;
    stack: string;
}
export interface Log {
    index: number;
    meta: {
        title: string;
        description: string;
    };
    storeBefore: object;
    storeAfter: object;
    error: Error | null;
}
