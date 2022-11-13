import web3 from './web3';
import PoHGames from './build/PoHGames.json';
 
const instance = new web3.eth.Contract(
  PoHGames.abi,
  "0x92F5727a5E958637BD1B122BC74B1f0b617D95B7"
);
 
export default instance;