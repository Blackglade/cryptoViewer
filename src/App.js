import React from 'react';
import { useInfiniteQuery } from 'react-query'
import useIntersectionObserver from './hooks/useIntersectionObserver'

import Card from './components/card'

export default function App(){

    const { isSuccess, data, fetchNextPage } = useInfiniteQuery('cards', async ({pageParam = 1}) => {
        const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&sparkline=true&page=' + pageParam);
        return res.json();
    }, {
        getNextPageParam: (lastPage, pages) => pages.length + 1,
        refetchInterval: 15000,
    })

    const loader = React.useRef()

    useIntersectionObserver({
        target: loader,
        onIntersect: fetchNextPage,
    })

    return(
        <div style={{margin: '1rem'}}>
            <h1>USD Markets 📈📉🔥🚀</h1>
            <div style={{display: 'flex', flexDirection: 'column', width: '500px', overflowY: 'auto', height: '600px'}}>
                {isSuccess && data.pages.map((group, i) => 
                <React.Fragment key={i}>
                    {group.map((coin) => 
                        <Card key={coin.id} name={coin.name} symbol={coin.symbol} image={coin.image} price={coin.current_price} change={Math.round(coin.price_change_percentage_24h * 100) / 100} sparkline={coin.sparkline_in_7d.price} supply={coin.circulating_supply} />
                    )}
                </React.Fragment>
                )}
                <div ref={loader} className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
            </div>
        </div>
    )
}