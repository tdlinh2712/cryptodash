import React from 'react'
import styled from 'styled-components'
import {AppContext} from "../App/AppProvider"
import {SelectableTile} from '../Shared/Tile'
import CoinTile from './CoinTile'

export const CoinGridStyled = styled.div`
    display:grid; 
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 15px;
    margin-top:40px;
    
`

const getCointToDisplay = (coinList, topSection, favourites) => {
    return topSection ? favourites : Object.keys(coinList).slice(0,100);
}

const CoinGrid = ({topSection}) => {
    return <AppContext.Consumer>
        {({coinList, favourites}) => (
            <CoinGridStyled>
                {(getCointToDisplay(coinList, topSection, favourites) || []).map(coinKey => 
                <CoinTile topSection={topSection} coinKey={coinKey} key={coinKey}/>)}
            </CoinGridStyled>)}
    </AppContext.Consumer>
}

export default CoinGrid;