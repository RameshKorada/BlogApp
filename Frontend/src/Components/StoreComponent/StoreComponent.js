
import { configureStore } from "@reduxjs/toolkit";

// store, reducer, action , dispatcher




const initialization={
    isClicked:false,
    profileImage:""
}

const reducer=(state=initialization, action)=>{

    console.log(action.isClicked,"action")
    if (action.type==="ProfileImage"){
        return {...state, profileImage:action.value}
    }else{
        return {...state, isClicked:action.isClicked}

    }

}

// const reducer2=(sta)

export const stateValue=()=>{

}
export const store=configureStore({reducer:reducer})


