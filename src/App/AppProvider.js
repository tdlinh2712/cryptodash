import React from 'react'
import {cryptoCompareKey} from '../config'

const cc = require('cryptocompare')
cc.setApiKey(cryptoCompareKey);

const TIME_UNITS = 10;

export const AppContext = React.createContext();

export class AppProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page:'dashboard',
            favourites: ['BTC', 'ETH', 'XMR', 'DOGE'],
            ...this.savedSettings(),
            setPage:this.setPage,
            confirmFavourites: this.confirmFavourites
        }
    }

    

    componentDidMount = () => {
        this.fetchCoins();
      //  this.fetchHistorical();
    }

    fetchHistorical = async () => {
        if(this.state.firstVisit) return;
        let result = await this.historical();
    }


    fetchCoins = async () => {
        let coinList = (await cc.coinList()).Data;
        this.setState({coinList});
    }

    confirmFavourites = () => {
        this.setState({
            firstVisit: false,
            page: 'dashboard'
        });
        localStorage.setItem('cryptoDash', JSON.stringify({
            test:'hello'
        }));
    }
    savedSettings() {
        let cryptoDashData = JSON.parse(localStorage.getItem('cryptoDash'));
        if(!cryptoDashData) {
            return {page: 'settings', firstVisit: true}
        }
        return {};
        
    }
    setPage = page => this.setState({page});

    render() {
        return (
            <AppContext.Provider value={this.state}>
                {this.props.children}
            </AppContext.Provider>
        )
    }
}