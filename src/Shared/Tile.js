import styled from 'styled-components'
import {subtleBoxShadow, greenBoxShadow, redBoxShadow, lightBlueBackground} from './Styles'

export const Tile = styled.div`
    ${subtleBoxShadow}
    ${lightBlueBackground}
    padding: 10px;
`
export const SelectableTile = styled(Tile)`
    &:hover {
        cursor: pointer;
        ${greenBoxShadow}
    }
`

export const DeletableTile = styled(Tile)`
    &:hover {
        cursor: pointer;
        ${redBoxShadow}
    }
`

export const DisabledTile = styled(Tile)`
    pointer-event: none;
    opacity: 0.4;
`