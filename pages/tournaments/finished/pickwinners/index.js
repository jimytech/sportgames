import React, { Component } from 'react';
import Layout from '../../../../components/Layout';
import { Grid, Table, Form, Input, Message, Button} from 'semantic-ui-react';
import TournamentPoH from '../../../../ethereum/tournament';
import web3 from '../../../../ethereum/web3';
import Web3 from 'web3';
import { Router } from '../../../../routes';

class IndexPickWinner extends Component {

    state = {
        first: '',
        second: '',
        third: '',
        errorMessage: '',
        loading: false,
      };  

      onSubmit = async (event) => {

        event.preventDefault();
        this.setState({ loading: true, errorMessage: "" });
      
        try{
            //const accounts = await web3.eth.getAccounts();
            //const tournament = await TournamentPoH (this.props.addressTourn);
            await this.props.tournament.methods
                .payWinnersBurner (this.state.first, this.state.second, this.state.third)
                .send({
                    from: this.props.accounts[0]
                }); 
            Router.pushRoute(`/tournaments/finished/winners/${this.props.addressTourn}`);
        }catch(err){
            this.setState({ errorMessage: err.message });
        }
        this.setState({ loading: false });
    };

    static async getInitialProps(props){

        const tournament = await TournamentPoH (props.query.address);
        const summary = await tournament.methods.getSummary().call();
        const accounts = await web3.eth.getAccounts();  
        let listGamers = [];
        let disabled = true;

        if (summary[0]==accounts[0])
            disabled = false;

        await tournament.getPastEvents('storedPlatformUser', {
            filter: {},
            fromBlock: '0',
            toBlock: 'latest'
          }).then(function(events){
              for(var k in events){
                 listGamers.push({"key": k, "user": events[k].returnValues["addedPlatformUser"],"address": events[k].returnValues["sender"]});
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
          disabled,
          accounts,
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

        const {Header, Row, HeaderCell, Body} = Table;
        let fee = Web3.utils.fromWei(this.props.registrationFees, "ether");
        let mount = Web3.utils.fromWei(String(this.props.registrationFees*this.props.gamersCount), "ether");
      return (
        <Layout>
            <h3>Pick Winners: {this.props.nameTournament}</h3>
            <h4>Manager:{this.props.manager}</h4>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={5}>
                        <div className="ui card">
                            <div className="content">
                                <div className="header">Summary</div>
                            </div>
                            <div className="content">
                                <div className="ui small feed">
                                        <div className="content">
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
                        </div> 
                    </Grid.Column>
                    <Grid.Column width={7}>                           
                        <h3>Winners</h3>
                        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                            <Form.Field>
                                <label>First Place</label>
                                <Input 
                                    value = {this.state.first}
                                    onChange = {event => 
                                        this.setState({first: event.target.value})}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Second Place</label>
                                <Input 
                                    value = {this.state.second}
                                    onChange = {event => 
                                        this.setState({second: event.target.value})}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Third Place</label>
                                <Input 
                                    value = {this.state.third}
                                    onChange = {event => 
                                        this.setState({third: event.target.value})}
                                />
                            </Form.Field>
                            <Message error header="Oops!" content={this.state.errorMessage} />            
                            <Button disabled={this.props.disabled} loading={this.state.loading} primary>Pay</Button>
                            <Message header="Only manager!" content="Tournament in progress" />
                        </Form>
                    </Grid.Column>
                </Grid.Row>
                <h3>Gamers</h3>                
                <Grid.Row>
                    <Grid.Column width={9}>
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

  export default IndexPickWinner;