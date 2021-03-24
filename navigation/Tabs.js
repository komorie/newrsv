import React from "react";
import { createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import Main from "../screens/Main";
import Profile from "../screens/Profile";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DaySelect from "../screens/DaySelect";
import {DISABLED, BOLD} from '../font/constants';
import ReserveList from "../screens/ReserveList";


const Tabs = createMaterialBottomTabNavigator();

export default ({route}) => (
    <Tabs.Navigator
        activeColor={BOLD}
        inactiveColor={DISABLED}
        barStyle={{
            backgroundColor: '#FFFFFF',
            borderTopColor: BOLD,
            borderTopWidth: 0.8
        }}
    >
        <Tabs.Screen 
            name="홈" 
            component={Main}
            options={{
                tabBarLabel: '홈',
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="home" color={color} size={26} />
                ),
            }}
        />
        <Tabs.Screen 
            name="예약하기" 
            component={DaySelect}
            options={{
                tabBarLabel: '예약하기',
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="calendar" color={color} size={26} />
                ),
            }}
        />
        <Tabs.Screen 
            name="ReserveList" 
            component={ReserveList}
            options={{
                tabBarLabel: '예약내역',
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="archive" color={color} size={26} />
                ),
            }}
        />
        <Tabs.Screen 
            name="프로필" 
            component={Profile}
            options={{
                tabBarLabel: '내정보',
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="account" color={color} size={26} />
                ),
            }}
        />

    </Tabs.Navigator>
)