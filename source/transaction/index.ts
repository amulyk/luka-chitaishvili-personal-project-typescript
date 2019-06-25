import { validations } from "./validator";

 export class Transaction {
    logs: validations.log[];
    store: object;

    constructor() {
        this.store = {};
        this.logs = [];
     }
    verifyItems(scenario : validations.Scenario[]) {
        let lastItem = scenario[scenario.length - 1];

        if (lastItem.hasOwnProperty('restore')) {
            throw new Error('last step in scenario does not need restore function')
        }

        for (let step of scenario) {
            if (step.index < 0) {
                throw new Error(`index: ${step.index} --- invalid step index in scenario`)
            }
        }
    }

    async dispatch(scenario : validations.Scenario[]) {
        scenario.sort((first, second) => {
            return first.index > second.index ? 1 : -1;
        });
        this.verifyItems(scenario);

        let numSteps = 0;
        for (let step of scenario) {
            let silent = false;
            if (step.hasOwnProperty('silent')) {
                silent = step.silent;
            }
            let storeBefore = {...this.store};
            let log : validations.log = {
                    index: step.index,
                    meta: { 
                        title: step.meta.title,
                        description: step.meta.description
                    },
                    storeBefore : {},
                    storeAfter : {},
                    error: null
                };

            try {
                await step.call(this.store);
                log.storeBefore = storeBefore;
                log.storeAfter = {...this.store};
            } catch (err) {
                log.error = { 
                        name: err.name,
                        message: err.message,
                        stack: err.stack, 
                };
                
                if (!silent) {
                    this.logs.push(log);
                    this.store = null;

                    for (let i = numSteps; i > 0; i--) {
                        if (typeof scenario[i-1].restore === 'function') {
                            try {
                                await scenario[i-1].restore();
                            } catch(err) {
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
}
