import React, { Component } from 'react';
import Layout from '../../../components/Layout';
import { Grid, Table} from 'semantic-ui-react';
import TournamentPoH from '../../../ethereum/tournament';
import Web3 from 'web3';
import web3 from '../../../ethereum/web3';

class RegisteredIndex extends Component {

    static async getInitialProps(props){

        let listGamers = [];
        let gamer= {};
        const tournament = await TournamentPoH (props.query.address);

        const accounts = await web3.eth.getAccounts();  
        const summary = await tournament.methods.getSummary().call();

        await tournament.getPastEvents('storedPlatformUser', {
            filter: {},
            fromBlock: 0,
            toBlock: 'latest'
          }).then(function(events){
              for(var k in events){
                  listGamers.push({"key": k, "user": events[k].returnValues["addedPlatformUser"],"address": events[k].returnValues["sender"]});
                  if (accounts[0] == events[k].returnValues["sender"])
                  {
                    gamer = {user: events[k].returnValues["addedPlatformUser"], address:events[k].returnValues["sender"]};
                  }  
              }              
          });

    
        return{
          manager: summary[0],
          registrationFees: summary[1],
          nameTournament: summary[2],
          date: summary[3],
          hour: summary[4],
          platform: summary[5],
          gamersCount: summary[6],
          tournamentFinished: summary[7],
          addressTourn: props.query.address,
          gamer,
          listGamers
        };
    }

    renderRows (){
        return this.props.listGamers.map(item => {
            return(
                <Table.Row key={item.key}>
                    <Table.Cell>{item.user}</Table.Cell>
                    <Table.Cell>{item.address}</Table.Cell>
                </Table.Row>
            );
        });        
      }

    render() {
      let fee = Web3.utils.fromWei(this.props.registrationFees, "ether");
      let mount = Web3.utils.fromWei(String(this.props.registrationFees*this.props.gamersCount), "ether");
      return (
        <Layout>
            <h3>Successful Registration in {this.props.nameTournament}</h3>
            
            <Grid>
                <Grid.Row>
                    <Grid.Column width={5}>
                        <div className="ui fluid card"> 
                            <div className="content">
                                <div className="header">Summary</div>
                            </div>                        
                            <div className='content'>
                                <div className="event" style={{overflowWrap: 'break-word'}}>
                                    <div className="event">
                                        <div className="content">
                                            <div className="summary">
                                                <i className="check icon"></i>
                                                Congratulations: {this.props.gamer.address}, you have successfully registered (by paying the {fee} ether 
                                                entry fee) for the tournament to be held on {this.props.date}, 
                                                at {this.props.hour} GMT-3. On the {this.props.platform} platform, your user name is {this.props.gamer.user} .  
                                                So far {this.props.gamersCount} people have registered 
                                                to participate, and the amount of {mount} ether  
                                                has been collected.
                                            </div>
                                        </div>
                                    </div>
                                    <div className="extra content">
                                        The manager of the tournament is <a>{this.props.manager}</a>
                                    </div>
                                </div>
                            </div>
                        </div>                                          
                    </Grid.Column>
                    <Grid.Column width={5}>
                            <div className="ui card">
                                <div className="content">
                                    <div className="header">Tournament Rules</div>
                                </div>
                                <div className="content">
                                    <div className="ui small feed">
                                        <div className="event">
                                            <div className="content">
                                                <div className="summary">
                                                    The rules of play in the tournament are governed by the rules of 
                                                    the {this.props.platform} platform, both for the games between individuals, the pairing 
                                                    of the tournament and the determination of positions.  In case of ties in 
                                                    the first positions (which are entitled to prizes) the tournament 
                                                    manager will hold an additional game between the two concerned, the winner 
                                                    will be awarded the respective prize. In case of a tie, another game will 
                                                    be played until a winner is found. In the case of a tie between more than 2 
                                                    people, the manager will organize a mini tournament to determine the final 
                                                    positions.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> 
                    </Grid.Column>                
                    <Grid.Column width={5}>
                            <div className="ui card">
                                <div className="content">
                                    <div className="header">Awards</div>
                                </div>
                                <div className="content">
                                    <h4 className="ui sub header"></h4>
                                    <div className="ui small feed">
                                        <div className="event">
                                            <div className="content">
                                                <div className="summary">
                                                    Tournament prizes will be awarded according to the following proportion of 
                                                    the proceeds: first place (25%), second place (15%) and third place (10%). 
                                                    The remaining 50% will go to fund the PoH community and will be sent to 
                                                    ubiBurner.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>    
                            </div> 
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={10}>
                        <Table>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>User Name Platform</Table.HeaderCell>
                                        <Table.HeaderCell>Gamer Address</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>{this.renderRows()}</Table.Body>
                        </Table>   
                    </Grid.Column>
                </Grid.Row>
            </Grid>         
        </Layout>
      );
    }
  }

  export default RegisteredIndex;