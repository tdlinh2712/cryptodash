import React from 'react'
import {cryptoCompareKey} from '../config'
import _ from 'lodash'
import moment from 'moment';

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
        this.fetchHistorical();
    }

    fetchHistorical = async () => {
        if(this.state.firstVisit) return;
        let results = await this.historical();
        //rebuld data for highcharts
        let historical = [
            {
                name: this.state.currentFavourite,
                data: results.map((ticker, index) => [
                    moment().subtract({months: TIME_UNITS - index}).valueOf(),
                    ticker.USD
                ])
            }
        ];
        this.setState({historical});
    }

    historical = () => {
        //get historical data
        let promises = [];
        for(let units = TIME_UNITS; units > 0; units--) {
            promises.push(
                cc.priceHistorical(
                    this.state.currentFavourite, 
                    ['USD'],
                    moment().subtract({months: units}).toDate()
                )
            )
        }
        //get all data after fetching
        return Promise.all(promises);
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
            currentFavourite,
            prices:null,
            historical:null
        }, () => {
            this.fetchPrices();
            this.fetchHistorical();
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
            currentFavourite: sym,
            historical:null
        }, this.fetchHistorical);
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