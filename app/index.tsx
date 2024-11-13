import { Redirect } from "expo-router";
import { View, Text } from 'react-native';


const StartPage = ()=>{
    return <Redirect href={'/home'}/>
}

export default StartPage