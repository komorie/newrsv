import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Image, View} from 'react-native';
import Login from "../screens/Login";
import BranchSelect from "../screens/BranchSelect";
import Tabs from "./Tabs";
import DaySelect from "../screens/DaySelect";
import TimeSelect from "../screens/TimeSelect";
import { MARGIN } from "../font/constants";
import { vw } from "react-native-viewport-units";

const Stack = createStackNavigator();

const mainStack = () => (
    <Stack.Navigator 
        screenOptions={{
            headerTitle: () => (
                <Image
                    style={{width:vw*39.4, height:vw*8.9}}
                    source={require('../image/내비게이션.png')}
                />
            ),
            headerTitleAlign: 'center'
        }}   
        headerMode="float"
    >
        <Stack.Screen 
            name="Login" 
            options={{headerShown:null}} 
            component={Login}
        />
        <Stack.Screen 
            name="BranchSelect" 
            component={BranchSelect}
        />
        <Stack.Screen name="Tabs" component={Tabs}/>
        <Stack.Screen name="TimeSelect" component={TimeSelect}/>
    </Stack.Navigator>
);

export default mainStack;