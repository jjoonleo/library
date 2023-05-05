import axios from 'axios';
import { useParams } from "react-router-dom";
import React, { useEffect, useState }  from 'react';
import RestaurantList from '../components/RestaurantList';
import errorCode from '../constants/errorCode';
import FoodList from '../components/FoodList';

const AddFood = () => {
    const {restaurant} = useParams();
    let spicyOptions = ["불닭 이상", "신라면 이상", "매운 맛이 존재", "매운맛이 없음"];
    let temperatureOptions = ["뜨거움", "보통", "차가움"];
    let countryOptions = ["한식", "양식", "중식", "일식", "동남아시아", "기타"];
    let ingreOptions = ["밥", "면", "빵", "떡", "육류"];
    let sweetOptions = ["달지 않다", "달다"];
    let saltyOptions = ["짜지 않다", "짜다"];
    let greasyOptions = ["기름지지 않다", "기름지다"];
    let calOptions = ["높다", "낮다"];


    let food = {};
    food["togo"] = false;
    food["store"] = false;
    food["delivery"] = false;
    const [foods, setFoods] = useState([]);

    const getFoods = async () => {
        try {
            console.log(`gettin foods ${restaurant}`);
            let result = await axios.get(
                `/api/food?restaurant=${restaurant}`,
                { withCredentials: true }
            );
            
            result = result.data.result;
            console.log([...result]);
            setFoods([...result]);


        } catch (error) {
            console.log(error);
            alert("음식 목록을 불러오는데 실패했습니다.");
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        if(e.target.name.value === ""){
            alert("음식 이름을 입력하세요.");
            return;
        }
        for(let i = 0; i < radioDataList.length; i++){
            food[radioDataList[i][1]] = Number(e.target[radioDataList[i][1]].value);
        }
        food.name = e.target.name.value;
        food.restaurant = restaurant;

        console.log(food);
        try {
            let result = await axios.post(
                `/api/food`,
                food,
                { withCredentials: true }
            )
            console.log(result);
            if(result.status === 201){
                getFoods();
                alert("입력을 성공했습니다.");
            }
        } catch (error) {
            let response = error.response;
            let err = error.response.data.error;
            if(response.status === 405){
                if(err.code === errorCode.MongoServerError){
                    alert("중복된 이름입니다. 다른 이름을 입력하세요.");
                }
            }else if(response.status === 400){
                if(err.code === errorCode.ValidationError){
                    alert("이름을 입력해 주세요.");
                }
            }else{
                alert("알 수 없는 에러가 발생했습니다.")
            }
        }
        
    }

    useEffect(()=>{
        getFoods();
    },[]);

    // return(
    //     <div className="App">
    //         {Error? <p>{Error}</p>:null}
    //         <input type="text" placeholder="restaurant name" value={restaurantNameText} onChange={(e)=>setRestaurantNameText(e.target.value)}/>
    //         <button onClick={handleSubmit}>submit</button>
    //         {restaurants?<RestaurantList restaurants={restaurants}/>:null}
    //     </div>
    // );

    const radios = (title, name, choices)=>{

        const options=[];
        options.push(<input type="radio" id={`${name}Choice0`} name={name} value={0} defaultChecked/>);
        options.push(<label htmlFor="contactChoice1">{choices[0]}</label>);
        for(let i = 1; i < choices.length; i++){
            options.push(<input type="radio" id={`${name}Choice${i}`} name={name} value={i} />);
            options.push(<label htmlFor="contactChoice1">{choices[i]}</label>);
        }

        return(
            <fieldset>
                <legend>{title}</legend>
                {options}
            </fieldset>
        );
    }

    let radioDataList = 
    [["맵기","spicy", spicyOptions],
    ["온도","temperature", temperatureOptions],
    ["나라", "country", countryOptions],
    ["주재료", "main_ingredient", ingreOptions],
    ["단맛", "isSweet", sweetOptions],
    ["짠맛", "isSalty", saltyOptions],
    ["기름진맛", "isGreasy", greasyOptions],
    ["칼로리 900보다", "cal", calOptions]];

    return(
        <div className="App">
            <form onSubmit={(e)=>handleSubmit(e)}>
                <label htmlFor="">음식 이름:</label>
                <input type="text" name="name" placeholder='음식 이름을 입력하세요'/>
                
                {(()=>{
                    const options=[];
                    for(let i = 0; i < radioDataList.length; i++){
                        options.push(radios(radioDataList[i][0], radioDataList[i][1], radioDataList[i][2]));
                    }
                    return options;
                })()}

                <fieldset>
                    <legend>가능한거 모두 선택</legend>

                    <div>
                        <input type="checkbox" id="togo" name="togo" onChange={(event)=>{food.togo = event.currentTarget.checked;}}/>
                        <label htmlFor="scales">포장</label>
                    </div>

                    <div>
                        <input type="checkbox" id="delivery" name="delivery" onChange={(event)=>{food.delivery = event.currentTarget.checked;}}/>
                        <label htmlFor="horns">배달</label>
                    </div>

                    <div>
                        <input type="checkbox" id="store" name="store" onChange={(event)=>{food.store = event.currentTarget.checked;}}/>
                        <label htmlFor="horns">매장</label>
                    </div>
                </fieldset>
                <input type="submit" value="추가하기"/>
            </form>
            {foods?<FoodList foods={foods}/>:null}
        </div>
    );
}

export default AddFood;