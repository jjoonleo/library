import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/test.module.css';

const RestaurantList = ({restaurants}) => {
    const length = restaurants.length;
    const navigate = useNavigate();
    const onClick = (restaurant) => {
        console.log(restaurant.name);
        navigate(`/addFood/${restaurant.name}`);
    }

    return(
        <div>
            {(()=>{
                const options=[];
                for(let i = 0; i < length; i++){
                    console.log(i);
                    options.push(<div className={styles["list-div"]}><button className={styles["list-btn"]} onClick={()=>{onClick(restaurants[i])}}>{restaurants[i].name}</button></div>);
                }
                return options;
            })()}
        </div>
    );
}

export default RestaurantList;