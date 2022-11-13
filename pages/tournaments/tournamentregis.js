import React, { Component } from 'react';
import { Form, Card, Grid, Button, Message, Input, Table } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import TournamentPoH from '../../ethereum/tournament';
import Web3 from 'web3';
import web3 from '../../ethereum/web3';
import { Router, Link } from '../../routes';


class TournamentRegis extends Component {

  state = {
    userName: '',
    errorMessage: '',
    loading: false,
    errorMessage2: '',
    loading2: false,
  };  
  

  onCloseTournament = async (event) => {
    event.preventDefault();
    this.setState({ loading2: true, errorMessage2: "" });
  
    try{
        await this.props.tournament.methods
            .setRegistrationClose()
            .send({
                from: this.props.accounts[0]
            });
        Router.pushRoute('/tournaments/finished/tournamentsfinish');
    }catch(err){
        this.setState({ errorMessage2: err.message });
    }
    this.setState({ loading2: false });
  };



onSubmit = async (event) => {

  event.preventDefault();
  this.setState({ loading: true, errorMessage: "" });

  try{
      await this.props.tournament.methods
          .registration (this.state.userName, this.props.registrationFees)
          .send({
              from: this.props.accounts[0]
          });   
      Router.pushRoute(`/tournaments/registered/${this.props.addressTourn}`);
  }catch(err){
      this.setState({ errorMessage: err.message });
  }
  this.setState({ loading: false });
};

  static async getInitialProps(props){

    let disabled = true;
    let listRegisUser = [];
    let listRegisGamers = [];
    let listGamers= [];

    const tournament = await TournamentPoH (props.query.address);
    const summary = await tournament.methods.getSummary().call();
    const accounts = await web3.eth.requestAccounts();     
    const regis = await tournament.methods.getGamers(accounts[0]).call();
    const status = (regis)?"You are registered":"You are not registered";

    if (summary[0]==accounts[0])
      disabled = false;

      await tournament.getPastEvents('storedPlatformUser', {
        filter: {},
        fromBlock: 0,
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
      disabled,
      regis,
      status,
      listRegisUser,
      listRegisGamers,
      accounts,
      listGamers,
      tournament
    };
  }

  listRegistered(){
    this.props.tournament.getPastEvents('storedPlatformUser', {
      filter: {},
      fromBlock: '0',
      toBlock: 'latest'
    }).then(function(events){
        for(var k in events){
    
            console.log(events[k].returnValues["addedPlatformUser"] + ' ' + events[k].returnValues["sender"]);
            setListRegistered(events[k].returnValues["addedPlatformUser"], events[k].returnValues["sender"]);
        }
    });
  }

  setListRegistered(_addedPlatformUser, _senderGamers){
      this.props.listRegisUser.push(_addedPlatformUser);
      this.props.listRegisGamers.push(_senderGamers);
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

  renderCards(){

    const {
      manager,
      registrationFees,
      nameTournament,
      date,
      hour,
      platform,
      gamersCount,
      tournamentFinished
    } = this.props;

    let regisFeesEther = Web3.utils.fromWei(registrationFees, "ether");
    const items = [
      {
        header: nameTournament,
        meta: "Tournament name",
        description: "A tournament to compete, win and contribute to humanity",
        key: 0
      },
      {
        header: manager,
        meta: "Address of manager",
        description: "The manager who created the tournament and will make the payments to the winners and execute the 50% contribution to the PoH community.",
        style: {overflowWrap: 'break-word'},
        key: 1
      },
      {
        header: regisFeesEther,
        meta: "The fee (in ether) of the registration",
        description: "The amount to be paid to register for the tournament",
        key: 2
      },
      {
        header: date,
        meta: "Tournament date",
        key: 3
      },
      {
        header: hour,
        meta: "Tournament time, GMT-3",
        key: 4
      },
      {
        header: platform,
        meta: "Platform to develop the Tournament",
        key: 5
      },
      {
        header: gamersCount,
        meta: "Number of players registered for the Tournament",
        key: 6
      },
      {
        header: regisFeesEther*gamersCount,
        meta: "Funds collected to be distributed",
        key: 7
      },
      {
        header: "Tournament Rules",
        description:"The rules of play in the tournament are governed by the rules of the platform, both for the games between individuals, the pairing of the tournament and the determination of positions.  In case of ties in the first positions (which are entitled to prizes) the tournament manager will hold an additional game between the two concerned, the winner will be awarded the respective prize. In case of a tie, another game will be played until a winner is found. In the case of a tie between more than 2 people, the manager will organize a mini tournament to determine the final positions.",
        key: 8
      },
      {
        header: "Prizes",
        description: "Tournament prizes will be awarded according to the following proportion of the proceeds: first place (25%), second place (15%) and third place (10%). The remaining 50% will go to fund the PoH community and will be sent to ubiBurner.",
        key: 9
      }

    ];

    return <Card.Group items={items} />;
  }

  render(){
    return(
      <Layout>
        <h3>
          Tournament Registration
          <Link route={`/tournaments/${this.props.addressTourn}/#listGamers`}>
            <a> (View Rules and List of Gamers)</a>
          </Link>  
        
        </h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={11}>
              {this.renderCards()}
            </Grid.Column>
            <a id="rules"></a>
            <Grid.Column width={5}>
              <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                      <Form.Field>
                          <label>User Name Platform</label>
                          <Input 
                              value = {this.state.userName}                   
                              onChange = {event => 
                                  this.setState({userName: event.target.value})}
                          />
                      </Form.Field>
                      <Message error header="Oops!" content={this.state.errorMessage} />            
                      <Button disabled={!this.props.tournamentFinished && this.props.regis} loading={this.state.loading} primary>Register</Button>

              </Form>
              <Card>
                <Card.Content>
                  <Card.Header>Status of your tournament registration</Card.Header>
                  <Card.Description>
                    {this.props.status}
                  </Card.Description>
                </Card.Content>
              </Card>
              <h3>--------------------</h3>
              <Form onSubmit={this.onCloseTournament} error={!!this.state.errorMessage2}>
                  <Message error header="Oops!" content={this.state.errorMessage2} />
                  <Button disabled={this.props.disabled} loading={this.state.loading2} primary>Close Registration</Button>
              </Form>           
              <Message header="Only manager!" content="Close Tournament Registration" />               
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={10}>
              <h3>Gamers</h3>
              <a id="listGamers"></a>
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

export default TournamentRegis;