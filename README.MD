# Node-RED - Flow Report

Make [NodeRED](https://node-red.org) flows easier to read and easier to compare versions in Version Control tools like git

<table border='solid 1px'><tr><td>
    <img src='https://github.com/Scaletronic/node-red-flow-reporter/raw/main/docs/flow-report-sample-02.png' />
</td><td></table>

The Node-RED Flow Report is using the [Node-RED Flow Parser](https://github.com/node-red/flow-parser)


## Quick start 

### Run anywhere 

Just use npx to run it without installing it anywhere

    npx node-red-flow-reporter projects\project\flow.json

The `projects\project\flow.json` is your flow file.

### Run in your NodeRED project

To add the node-red-flow-reporter to an existing project, run this. 

    npm i node-red-flow-reporter

To use the NodeRed Flow Reporter run the following 

    node-red-flow-file-reporter <fileName>

`fileName` is a path to your flow.json file

### Using Git
You can also checkout the repository, if you want to contribute or see the TypeScript code before it is transpiled to JavaScript. 

    git clone https://github.com/scaletronic/node-red-flow-reporter/
    cd node-red-flow-reporter/
    npm run ts-cli -- "examples\02-nr-ex-common-complete\01 - Handle completion of node execution.json"

And then the Flow Reporter will create

    examples\02-nr-ex-common-complete\01 - Handle completion of node execution.json.md




