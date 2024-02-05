import React, { Component} from 'react';
import Layout from '../../components/Layout';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import games from '../../ethereum/games';
import web3 from '../../ethereum/web3';
import Web3 from 'web3';
import { Router } from '../../routes';

class TournamentNew extends Component {
    state = {
        tournamentName: '',
        platform: '',
        date: '',
        hour: '',
        registrationFee: '',
        errorMessage: '',
        loading: false,
    };

    onSubmit = async (event) => {
        event.preventDefault();
        this.setState({ loading: true, errorMessage: "" });

        try{
            const accounts = await web3.eth.getAccounts();
            await games.methods
                .createTournament (this.state.tournamentName, this.state.date, this.state.hour, this.state.platform, Web3.utils.toWei(this.state.registrationFee, "ether"))
                .send({
                    from: accounts[0]
                });
            Router.pushRoute('/');
        }catch(err){
            this.setState({ errorMessage: err.message });
        }
        this.setState({ loading: false });
    };

    render(){
        return (
            <Layout>
                <h3>Create a Tournament!</h3>

                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Tournament Name</label>
                        <Input 
                            value = {this.state.tournamentName}
                            onChange = {event => 
                                this.setState({tournamentName: event.target.value})}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Platform to Play</label>
                        <Input
                            value = {this.state.platform}
                            onChange = {event => 
                                this.setState({platform: event.target.value})}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Tournament date</label>
                        <Input 
                            value = {this.state.date}
                            onChange = {event => 
                                this.setState({date: event.target.value})}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Tournament time</label>
                        <Input 
                            label="GMT-3" 
                            labelPosition="right" 
                            value = {this.state.hour}
                            onChange = {event => 
                                this.setState({hour: event.target.value})}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Registration fee</label>
                        <Input 
                            label="ETH" 
                            labelPosition="right"
                            value = {this.state.registrationFee}
                            onChange = {event => 
                                this.setState({registrationFee: event.target.value})}
                        />
                    </Form.Field>
                    <Message error header="Oops!" content={this.state.errorMessage} />            
                    <Button loading={this.state.loading} primary>Create</Button>
                </Form>
            </Layout>
        );
    }
}

export default TournamentNew;