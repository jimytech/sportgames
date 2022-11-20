import React from 'react';
import { Grid, Menu, Image } from 'semantic-ui-react';
import { Link } from '../routes';


export default () => {
    return(
        <Grid celled>
            <Grid.Row>
                <Grid.Column width={3}>                    
                    <Image src='https://uptaragua.files.wordpress.com/2013/03/20130322-223528.jpg?w=600https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRK_fO4-kaoPee72mMyiTF9VKpiWYHFAzL18cXxwRJDrg&s' alt="logo"/>
                </Grid.Column>
                <Grid.Column width={13}>
                    <Menu style={{marginTop: '12px'}}>
                    <Link route='/'>
                            <a className="item">
                                UPT Aragua Games
                            </a>
                    </Link>

                    <Menu.Menu position="right">
                            <Link route='/'>
                                <a className="item">
                                    Tournaments
                                </a>
                            </Link>

                            <Link route='/'>
                                <a className="item">
                                    UPTAragua
                                </a>
                            </Link>                              
                    </Menu.Menu>
                    </Menu>
                </Grid.Column>
            </Grid.Row>    
        </Grid>    
    );
};