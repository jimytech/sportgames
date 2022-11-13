import React, { Component } from 'react';
import Layout from '../../../../components/Layout';
import { Grid, Table, Card } from 'semantic-ui-react';
import TournamentPoH from '../../../../ethereum/tournament';
import web3 from '../../../../ethereum/web3';
import Web3 from 'web3';

class IndexWinner extends Component {

        async listRegistered(){
        const {tournament} = this.props;
        await tournament.getPastEvents('storedPlatformUser', {
          filter: {},
          fromBlock: '0',
          toBlock: 'latest'
        }).then(async function(events){
            for(var k in events){
                let a = await events[k].returnValues["addedPlatformUser"];
                let b =  await events[k].returnValues["sender"];
                this.setListRegistered(a, b);
                console.log(events[k].returnValues["addedPlatformUser"] + ' ' + events[k].returnValues["sender"]);
            }
            
        });
      }

      static setListRegistered(_addedPlatformUser, _senderGamers){
          //this.listGamers.push("user": _addedPlatformUser, "address": _senderGamers);
      }  

    static async getInitialProps(props){

        const tournament = await TournamentPoH (props.query.address);
        const summary = await tournament.methods.getSummary().call();

        let listGamers = [];
        let listWinners = [];

        await tournament.getPastEvents('storedPlatformUser', {
            filter: {},
            fromBlock: '0',
            toBlock: 'latest'
          }).then(function(events){
              for(var k in events){
                  listGamers.push({"key": k, "user": events[k].returnValues["addedPlatformUser"],"address": events[k].returnValues["sender"]});
              }              
          });
          
          await tournament.getPastEvents('storedPlayersWind', {
            filter: {},
            fromBlock: '0',
            toBlock: 'latest'
          }).then(function(events){
              for(var k in events){        
                  listWinners[0] = events[k].returnValues["first"];
                  listWinners[1] = events[k].returnValues["second"];
                  listWinners[2] = events[k].returnValues["third"];
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
          listGamers,
          listWinners,
          tournament
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
        let first25 = mount*25/100;
        let second15 = mount*15/100;
        let third10 = mount*10/100;
        let ubiBurner50 = mount*50/100;
  
      return (
        <Layout>
            <h3>Winners: {this.props.nameTournament}</h3>
            <h4>Manager: {this.props.manager}</h4>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={5}> 
                        <div className="ui card">
                            <div className="content">
                                <div className="header">Summary</div>
                            </div>
                                <div className="content">
                                    <div className="ui small feed">
                                        <div className="summary">
                                            The entry fee for this tournament was {fee} ether. The tournament took place 
                                            on {this.props.date}, at {this.props.hour} GMT-3. It was played on 
                                            the {this.props.platform} platform.  
                                            There were {this.props.gamersCount} people registered to participate, and the 
                                            amount of {mount} ether was raised.
                                        </div>                                   
                                    </div>
                                </div>  
                        </div>                            
                    </Grid.Column>
                    <Grid.Column width={5}>                           
                        <h3>Winners</h3>
                        <h4>First Place {this.props.listWinners[0]} {first25} ether</h4>
                        <h4>Second Place {this.props.listWinners[1]} {second15} ether</h4>
                        <h4>Third Place {this.props.listWinners[2]} {third10} ether</h4>
                        <h4>ubiBurner {ubiBurner50} ether</h4>
                    </Grid.Column>
                </Grid.Row>
                <h3>Gamers</h3>
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

  export default IndexWinner;