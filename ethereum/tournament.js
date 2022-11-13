import web3 from './web3';
import TournamentPoH from './build/TournamentPoH.json';

const tournament = (address) => {
  return new web3.eth.Contract(TournamentPoH.abi, address);
};
export default tournament;
