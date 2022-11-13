import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import games from '../../../ethereum/games';
import Layout from '../../../components/Layout';
import { Link } from '../../../routes';

//TournamentPoH es una función 
import TournamentPoH from '../../../ethereum/tournament';

class TournamentFinish extends Component{
    static async getInitialProps(){
        const tournaments = await games.methods.getDeployedTournaments().call();

        let nameTournament = [];
        let tournamentsFinished = [];
        let regisCloses = [];
        let finishTournaments = [];
        let j = 0;
        for (let i = 0; i<tournaments.length; i++)
        {
            const tournament = await TournamentPoH(tournaments[i]);
            const finishTournament = await tournament.methods.getTournamentFinished().call();

            let regisClose = await tournament.methods.getRegistrationClose().call();
           
            if (finishTournament || regisClose){
                regisCloses[j] = regisClose;
                finishTournaments[j] = finishTournament;
                nameTournament[j] = await tournament.methods.getTournamentName().call();
                tournamentsFinished[j] = tournaments[i];
                j++;
            }    
        }
        
        return { 
            tournamentsFinished, 
            nameTournament,
            regisCloses,
            finishTournaments
         };
    }

    renderTournaments(){

        let route;
        const items = this.props.tournamentsFinished.map((address, i) => {
            if (!this.props.finishTournaments[i]){
                route = "pickwinners";
            }    
            else{
                route = "winners";
            }

            return {
                header: this.props.nameTournament[i],
                description: (
                    <Link route={`/tournaments/finished/${route}/${address}`}>
                        <a>View tournament finished and winners</a>
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
                <div>
                    <h3>Finished Tournaments</h3>
                    {this.renderTournaments()}
                </div>
            </Layout>
        );    
    }
}

export default TournamentFinish;