import { Inngest } from 'inngest';

export const inngest = new Inngest({ id: 'debug-deer' });

const helloWorld = inngest.createFunction(
  { id: 'hello-world' }, // 1st arg: function config
  { event: 'test/hello.world' }, // 2nd arg: trigger (NOT inside triggers:[])
  async ({ event, step }) => {
    // 3rd arg: handler
    await step.sleep('wait-a-second', '1s');
    return {
      message: `Hello ${event.data.email}`,
    };
  }
);

export const functions = [helloWorld];
