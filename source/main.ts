import { Transaction } from "./transaction/index";
import { Step } from "./transaction/validator";

const scenario: Step[] = [
  {
      // callback for main execution
      call: async (store: object) => {
        throw new Error("Error from index 1");
      },
      index: 1,
      meta: {
          description: "This action is responsible for reading the most popular customers",
          title: "Read popular customers",
      },
      // callback for rollback
      restore: async () => {
          console.log("Restore from index 1");
      },
      silent: true,
  },
  {
      // callback for main execution
      call: async (store: object) => {
          console.log("");
        },
      index: 2,
      meta: {
          description: "This action is responsible for reading the most popular customers",
          title: "Read popular customers",
      },
      // callback for rollback
      restore: async () => {
          console.log("Restore from index 2");
      },
  },
  {
      // callback for main execution
      call: async (store: object) => {
        throw new Error("Error from index 3");
      },
      index: 3,
      meta: {
          description: "This action is responsible for reading the most popular customers",
          title: "Read popular customers",
      },
      // callback for rollback
  },
];

const transaction = new Transaction();

(async () => {
  try {
    await transaction.dispatch(scenario);
    const store = transaction.store; // {} | null
    const logs = transaction.logs; // []
    console.log(store);
    console.log(logs);
  } catch (err) {
          // Send email about broken transaction
          console.log(err.message);
  }
})();
