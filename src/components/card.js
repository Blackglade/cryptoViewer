import React, { useState } from 'react';
import styled from '@emotion/styled'

import Sparkline from './sparkline'

const StyledCard = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 45px;
    margin-bottom: 4px;
    padding: 4px 10px;
    background: ${props => props.clicked ? 'rgb(38, 53, 67)' : 'rgb(18, 29, 39)'};
    cursor: pointer;

    img { 
        width: 1.5rem; 
        margin-right: 8px;
    }

    &:hover {
        background: rgb(38, 53, 67);
    }
`

const StyledCurrency = styled.div`
    display: flex;
    align-items: center;
    flex-direction: row;
    width: 135px;
`

const StyledVolume = styled.div`
    display: flex;
    align-items: flex-end;
    flex-direction: column;
    width: 120px;
    text-align: right;
`

const StyledPrice = styled.div`
    display: flex;
    align-items: flex-end;
    flex-direction: column;
    width: 95px;
`
// Average every 12 hours for larger graph.
const groupCount = (arr = []) => {
    const res = [];
    for (let i = 0; i < arr.length;) {
       res.push(arr[i]);
       i += 12;
    }
    return res
 }

export default function Card({name, symbol, supply, image, price, change, sparkline}){
    const [toggle, setToggle] = useState(false);
    return(
        <section style={{position: 'relative'}}>
            <StyledCard onClick={() => setToggle(!toggle)} clicked={toggle}>
                <StyledCurrency>
                    <img src={image} alt={name} />
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <span className="productText">{symbol.toUpperCase()}-USD</span>
                        <span className="nameText">{name}</span>
                    </div>
                </StyledCurrency>
                <div style={{width: '60px', height: '20px'}}>
                    <Sparkline width='60px' height='20px' data={sparkline} up={change > 0} interactive={false} />
                </div>
                <StyledVolume>
                    <span className="productText" style={{fontWeight: 'normal', textTransform: 'inherit', whiteSpace: 'nowrap'}}>{Math.round(supply) + ' '}{symbol.toUpperCase()}</span>
                    <span className="nameText" style={{fontSize: '11px', color: 'rgba(138, 147, 159, 0.4)'}}>Total Supply</span>
                </StyledVolume>
                <StyledPrice>
                    <span className="productText" style={{fontWeight: 'normal', textTransform: 'inherit', whiteSpace: 'nowrap'}}>${price}</span>
                    <span className="nameText" style={{fontSize: '11px', color: change > 0 ? 'rgb(46, 174, 52)' : 'rgb(249, 103, 45)', whiteSpace: 'nowrap', textTransform: 'inherit'}}>{change > 0 && '+'}{change}%</span>
                </StyledPrice>
                
            </StyledCard>
            {toggle && <Sparkline width='485px' height='175px' data={groupCount(sparkline)} up={change > 0} interactive={true} />}
        </section>
    )
}