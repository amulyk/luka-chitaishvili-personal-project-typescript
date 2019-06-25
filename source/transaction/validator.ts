export namespace validations {
    export interface Scenario {
        index: number;
        meta: { 
            title: string;
            description: string 
        };
        call: (store: object) => any;
        restore?: () => any;
        silent?: boolean;
    }
    
    export interface log {
        index: number;
        meta: {
            title: string;
            description: string;
        },
        storeBefore: object,
        storeAfter: object,
        error: object | null,
    }    
}
