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
            confirmFavourites: this.confirmFavourites,
            setCurrentFavourite: this.setCurrentFavourite,
            setFilterCoins: this.setFilterCoins
        }
    }

    componentDidMount = () => {
        this.fetchCoins();
        this.fetchPrices();
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
        let currentFavourite = this.state.favourites[0];
        this.setState({
            firstVisit: false,
            page: 'dashboard',
            currentFavourite
        }, () => {
            this.fetchPrices();
        });
        localStorage.setItem('cryptoDash', JSON.stringify({
            favourites: this.state.favourites,
            currentFavourite
        }));
    };

    fetchPrices = async () => {
        if(this.state.firstVisit) return;
        let prices = await this.prices();
        this.setState({prices});
    }
    prices = async () => {
        let returnData = [];
        for(let i =0; i< this.state.favourites.length;i++) {
            try {
                let priceData = await cc.priceFull(this.state.favourites[i], 'USD');
                returnData.push(priceData);
            } catch(e) {
                console.warn('Fetch price error: ', e);
            }
        }
        return returnData;
    }

    setCurrentFavourite = sym => {
        this.setState({
            currentFavourite: sym
        });
        localStorage.setItem('cryptoDash', JSON.stringify({
            ...JSON.parse(localStorage.getItem('cryptoDash')),
            currentFavourite: sym
        }))
    }

    savedSettings() {
        let cryptoDashData = JSON.parse(localStorage.getItem('cryptoDash'));
        if(!cryptoDashData) {
            return {page: 'settings', firstVisit: true}
        }
        let {favourites, currentFavourite} = cryptoDashData;
        return {favourites, currentFavourite};
        
    }
    setPage = page => this.setState({page});

    setFilterCoins = (filterCoins) => this.setState({filterCoins});

    render() {
        return (
            <AppContext.Provider value={this.state}>
                {this.props.children}
            </AppContext.Provider>
        )
    }
}