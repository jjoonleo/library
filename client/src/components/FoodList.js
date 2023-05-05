import React from 'react';
import { useNavigate } from 'react-router-dom';

const FoodList = ({foods}) => {
    const length = foods.length;

    return(
        <div>
            {(()=>{
                const options=[];
                for(let i = 0; i < length; i++){
                    console.log(i);
                    options.push(<div>{foods[i].name}</div>);
                }
                return options;
            })()}
        </div>
    );
}

export default FoodList;