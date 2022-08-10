const path = require('path'),
  solc = require('solc'),
  fs = require('fs-extra');


const buildPath = path.resolve(__dirname, 'build'),
  contractsPath = path.resolve(__dirname, 'contracts');

const clean = function () {
  fs.removeSync(buildPath);
};

const build = function () {
  const contractFileName = 'Campaign.sol',
    contractPath = path.resolve(contractsPath, contractFileName),
    source = fs.readFileSync(contractPath, 'utf8');

  const compilerIn = {
    language: 'Solidity',
    sources: {
      [contractFileName]: {
        content: source,
      },
    },
    settings: {
      outputSelection: {
        "*": {
          "*": ["*"],
        },
      },
    },
  };
  const compilerOut = JSON.parse(
    solc.compile(JSON.stringify(compilerIn))
  );

  fs.ensureDirSync(buildPath);

  const contracts = compilerOut.contracts[contractFileName];
  for (let contract in contracts) {
    fs.outputJSONSync(
      path.resolve(buildPath, `${contract}.json`),
      contracts[contract],
      { spaces: 2 }
    );
  }
};

const main = function () {
  clean();
  build();
};

main();
