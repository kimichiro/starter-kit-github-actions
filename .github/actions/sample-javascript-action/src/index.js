const core = require('@actions/core');
const github = require('@actions/github');

try {
    const required = core.getInput('required');
    const optional = core.getInput('optional');

    const result = `(${required}) (${optional})!`;
    console.log(`result=[${result}]`);

    core.setOutput("result", result);

    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);
} catch (error) {
    core.setFailed(error.message);
}
