const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');

fs.removeSync(buildPath);

const pohgames = path.resolve(__dirname,'contracts', 'PoHGames.sol');
const source = fs.readFileSync(pohgames, 'utf-8');

fs.ensureDirSync(buildPath);

const input = {
    language: "Solidity",
    sources: {
      "PoHGames.sol": {
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
    "PoHGames.sol"
  ];
   
  fs.ensureDirSync(buildPath);
   
  for (let contract in output) 
  {
        fs.outputJsonSync(
        path.resolve(buildPath, contract.replace(":", "") + ".json"),
        output[contract]
        );
  }

