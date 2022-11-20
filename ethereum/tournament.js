import web3 from './web3';
import TournamentUPTA from './build/TournamentUPTA.json';

const tournament = (address) => {
  return new web3.eth.Contract(TournamentUPTA.abi, address);
};
export default tournament;
