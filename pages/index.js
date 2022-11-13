import React, { Component } from 'react';
import { Card, Button, Grid } from 'semantic-ui-react';
import games from '../ethereum/games';
import Layout from '../components/Layout';
import { Link } from '../routes';
import TournamentPoH from '../ethereum/tournament';

class TournamentIndex extends Component{
    static async getInitialProps(){
        const tournaments = await games.methods.getDeployedTournaments().call();

        let nameTournament = [];
        let tournamentsOpen = [];
        let j = 0;

        for (let i = 0; i<tournaments.length; i++)
        {
            const tournament = await TournamentPoH(tournaments[i]);
            const summary = await tournament.methods.getSummary().call();          
            const regisClose = await tournament.methods.getRegistrationClose().call();

            if (!summary[7] && !regisClose){
                nameTournament[j] = summary[2];
                tournamentsOpen[j] = tournaments[i];
                j++;
            }    
        }
        return { tournamentsOpen, nameTournament };
    }

    renderTournaments(){
        let i = 0;
        const items = this.props.tournamentsOpen.map(address => {
            return {
                header: this.props.nameTournament[i++],
                description: (
                    <Link route={`/tournaments/${address}`}>
                        <a>View and register for the tournament</a>
                    </Link>
                ),
                fluid: true
            };    
        });

        return <Card.Group items={items} />;
    }

    render(){
        return(
            <Layout>
                 <h3>Open Tournaments</h3>
                 <h4 style={{ color: 'red' }}>(Requires Open Metamask in Goerli Test Network)</h4>
                 <h4>Tournaments to compete, win and contribute to humanity</h4>
                <Grid>
                    <Grid.Column width={12}>
                        <div>                          
                            {this.renderTournaments()}
                        </div>
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <div>
                            <Grid.Row>
                                <Link route='/tournaments/new'>
                                    <a>
                                        <Button
                                            content = "Create Tournament"
                                            icon = "add circle"
                                            primary
                                        />
                                    </a>
                                </Link>
                            </Grid.Row> 
                            <Grid.Row>
                                <div>
                                    ________________________________
                                </div>
                            </Grid.Row>   
                            <Grid.Row>
                                <Link route='/tournaments/finished/tournamentsfinish'>
                                    <a>
                                        <Button
                                            content = "Finished Tournaments"
                                            primary
                                        />
                                    </a>
                                </Link>
                            </Grid.Row>
                        </div>    
                    </Grid.Column>    
                </Grid>
            </Layout>
        );    
    }
}

export default TournamentIndex;