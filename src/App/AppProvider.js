import React from 'react'
import {cryptoCompareKey} from '../config'
import _ from 'lodash'

const cc = require('cryptocompare')
cc.setApiKey(cryptoCompareKey);
const MAX_FAVOURITES = 10;
const TIME_UNITS = 10;

export const AppContext = React.createContext();

export class AppProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page:'dashboard',
            favourites: ['BTC', 'ETH', 'XMR', 'DOGE'],
            ...this.savedSettings(),
            addCoin: this.addCoin,
            removeCoin: this.removeCoin,
            isInFavourites: this.isInFavourites,
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

    isInFavourites = key => _.includes(this.state.favourites, key);

    addCoin = key => {
        let favourites = [...this.state.favourites];
        if(favourites.length < MAX_FAVOURITES) {
            favourites.push(key);
            this.setState({favourites});
        }
    }

    removeCoin = key => {
        let favourites = [...this.state.favourites];
        this.setState({favourites: _.pull(favourites, key)})
    }

    confirmFavourites = () => {
        this.setState({
            firstVisit: false,
            page: 'dashboard'
        });
        localStorage.setItem('cryptoDash', JSON.stringify({
            favourites: this.state.favourites
        }));
    }
    savedSettings() {
        let cryptoDashData = JSON.parse(localStorage.getItem('cryptoDash'));
        if(!cryptoDashData) {
            return {page: 'settings', firstVisit: true}
        }
        let {favourites} = cryptoDashData;
        return {favourites};
        
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