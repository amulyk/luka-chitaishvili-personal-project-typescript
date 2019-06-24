
interface Scenario {
    index: number;
    meta: { 
        title: string;
        description: string 
    };
    call: (store: object) => any;
    restore?: () => any;
    silent?: boolean;
}

interface logs {
    
}
