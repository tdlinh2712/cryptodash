import { coinList } from 'cryptocompare'
import React from 'react'
import styled from 'styled-components'
import {AppContext} from "../App/AppProvider"
import {SelectableTile} from '../Shared/Tile'
import CoinTile from './CoinTile'

export const CoinGridStyled = styled.div`
    display:grid; 
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    grid-gap: 15px;
    margin-top:40px;
    
`

const getLowerSectionCoins = (coinList,filterCoins) => {
    return (filterCoins && Object.keys(filterCoins).slice(0,20))|| Object.keys(coinList).slice(0,100);
}

const getCoinsToDisplay = (coinList, topSection, favourites, filterCoins) => {
    return topSection ? favourites : getLowerSectionCoins(coinList, filterCoins);
}

const CoinGrid = ({topSection}) => {
    return (
    <AppContext.Consumer>
        {({coinList, favourites, filterCoins}) => (
            <CoinGridStyled>
                {(getCoinsToDisplay(coinList, topSection, favourites, filterCoins)).map(coinKey => 
                <CoinTile topSection={topSection} coinKey={coinKey} key={coinKey}/>)}
            </CoinGridStyled>)}
    </AppContext.Consumer>)
}

export default CoinGrid;