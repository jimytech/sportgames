const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');

fs.removeSync(buildPath);

const uptagames = path.resolve(__dirname,'contracts', 'UPTAGames.sol');
const source = fs.readFileSync(uptagames, 'utf-8');

fs.ensureDirSync(buildPath);

const input = {
    language: "Solidity",
    sources: {
      "UPTAGames.sol": {
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
   
  const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
    "UPTAGames.sol"
  ];
   
  fs.ensureDirSync(buildPath);
   
  for (let contract in output) 
  {
        fs.outputJsonSync(
        path.resolve(buildPath, contract.replace(":", "") + ".json"),
        output[contract]
        );
  }

