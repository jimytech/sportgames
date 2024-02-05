import web3 from './web3';
import UPTAGames from './build/UPTAGames.json';
 
const instance = new web3.eth.Contract(
  UPTAGames.abi,
  "0xa9a8F3D10D98A62c262369E6B9FCE3A498A8A563"
);
 
export default instance;