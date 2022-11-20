import web3 from './web3';
import UPTAGames from './build/UPTAGames.json';
 
const instance = new web3.eth.Contract(
  UPTAGames.abi,
  "0x067FDa3AFDD1Fc824B1c5C8CF03f1Ba93Bfe9924"
);
 
export default instance;