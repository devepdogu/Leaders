import React from 'react'
import { BsFillTriangleFill, BsFillSquareFill } from 'react-icons/bs';


function user({ item }) {


    return (
        <div className={`row_item  item-${item.daysRank.today}`}>
            <div>{item.country}</div>
            <div>{item.username}</div>
            <div>{item.daysRank.today}</div>
            <div className='money_td'><span>{item.weekMoney}</span></div>
            <div className={item.daysRank.yesterday == null || item.daysRank.diff === 0 ? 'yellow' : (item.daysRank.diff > 0 ? 'green' : 'red')}>
                {item.daysRank.yesterday == null || item.daysRank.diff === 0 ? <BsFillSquareFill className="squareStable"></BsFillSquareFill> : (item.daysRank.diff > 0 ? <BsFillTriangleFill ></BsFillTriangleFill> : <BsFillTriangleFill className='downToTriangle'></BsFillTriangleFill>)}
                <span className='daysRankDiff'>{item.daysRank.diff}</span>
            </div>

        </div>
    )
}



export default user;
