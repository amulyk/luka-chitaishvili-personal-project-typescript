import { Log, Step } from "./validator";

export class Transaction {
    public logs: Log[];
    public store: object | null;

    constructor() {
        this.logs = [];
        this.store = {};
     }

    public async dispatch(scenario: Step[]) {
        scenario.sort((first, second) => {
            return first.index > second.index ? 1 : -1;
        });
        this.verifyItems(scenario);

        let numSteps = 0;
        for (const step of scenario) {
            let silent: boolean | undefined = false;
            if (step.hasOwnProperty("silent")) {
                silent = step.silent;
            }
            const storeBefore = {...this.store};
            const log: Log = {
                    error: null,
                    index: step.index,
                    meta: {
                        description: step.meta.description,
                        title: step.meta.title,
                    },
                    storeAfter : {},
                    storeBefore : {},
                };

            try {
                await step.call(this.store);
                log.storeBefore = storeBefore;
                log.storeAfter = {...this.store};
            } catch (err) {
                log.error = {
                        message: err.message,
                        name: err.name,
                        stack: err.stack,
                };

                if (!silent) {
                    this.logs.push(log);
                    this.store = null;

                    for (let i = numSteps; i > 0; i--) {
                        if (scenario[i - 1].hasOwnProperty("restore")) {
                            try {
                                const s = scenario[i - 1];
                                if (s.restore) {
                                    await s.restore();
                                }
                            } catch (err) {
                                throw err;
                            }
                        }
                    }
                    break;
                }
            }
            this.logs.push(log);
            numSteps++;
        }
    }

    private verifyItems(scenario: Step[]) {
        const lastItem = scenario[scenario.length - 1];

        if (lastItem.hasOwnProperty("restore")) {
            throw new Error("last step in scenario does not need restore function");
        }

        for (const step of scenario) {
            if (step.index < 0) {
                throw new Error(`index: ${step.index} --- invalid step index in scenario`);
            }
        }
    }
}
