import axios from 'axios';
import React, { useEffect, useState }  from 'react';
import RestaurantList from '../components/RestaurantList';
import errorCode from '../constants/errorCode';
import styles from '../styles/test.module.css'

const AddRestaurant = () => {
    const [restaurantNameText, setRestaurantNameText] = useState("");
    const [Error, setError] = useState(null);
    const [restaurants, setRestaurants] = useState([]);

    const getRestaurants = async () => {
        try {
            console.log("gettin restaurants");
            let result = await axios.get(
                "/api/restaurant/all",
                { withCredentials: true }
            );
            
            result = result.data.result;
            console.log([...result]);
            setRestaurants([...result]);


        } catch (error) {
            console.log(error);
            setError("식당 목록을 불러오는데 실패했습니다.");
        }
    }

    const validate = () => {
        if(restaurantNameText === ""){
            return false;
        }
        return true;
    }

    const handleSubmit = async (event) => {
        if(!validate()){
            setError("이름을 입력해 주세요.");
            return;
        }
        try {
            let result = await axios.post(
                "api/restaurant",
                {
                    name: restaurantNameText,
                },
                { withCredentials: true }
            )
            console.log(result);
            if(result.status === 201){
                setRestaurantNameText("");
                setError("");
                getRestaurants();
                alert("입력을 성공했습니다.");
            }
        } catch (error) {
            let response = error.response;
            let err = error.response.data.error;
            if(response.status === 405){
                if(err.code === errorCode.MongoServerError){
                    setError("중복된 이름입니다. 다른 이름을 입력하세요.");
                }
            }else if(response.status === 400){
                if(err.code === errorCode.ValidationError){
                    setError("이름을 입력해 주세요.");
                }
            }else{
                setError("알 수 없는 에러가 발생했습니다.")
            }
        }
        
    }

    useEffect(()=>{
        getRestaurants();
    },[]);

    return(
        <div className={styles["frame"]}>
            <h1 className={styles["title-text"]}>매장 등록</h1>
            {Error? <p className={styles["error-text"]}>{Error}</p>:null}
            <input className={styles["name-input"]} spellCheck="false" type="text" placeholder="restaurant name" value={restaurantNameText} onChange={(e)=>setRestaurantNameText(e.target.value)}/>
            <button className={styles["submit-btn"]} onClick={handleSubmit}>매장 등록하기</button>
            {restaurants?<RestaurantList restaurants={restaurants}/>:null}
        </div>
    );
}

export default AddRestaurant;