const path = require('path');
const fs = require('fs');
const solc = require('solc');

const inboxPath = path.resolve(__dirname, 'contracts', 'Inbox.sol');
const source = fs.readFileSync(inboxPath, 'utf-8');

const input = JSON.stringify({
  language: 'Solidity',
  sources: {
    'Inbox.sol': {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*'],
      },
    },
  },
});

const compilerOutput = JSON.parse(solc.compile(input));
if (compilerOutput.errors) {
  console.error('*** Compilation Errors *** ');
  compilerOutput.errors.forEach(e => {
    console.error(e.formattedMessage);
  });
  process.exit(1);
}
console.log(compilerOutput);

module.exports = compilerOutput
  .contracts['Inbox.sol']
  .Inbox;
