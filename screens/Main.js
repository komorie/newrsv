import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, StatusBar, Linking} from 'react-native';
import {ENABLED, BOLD, BIG, SMALL, NORMAL, VERYBIG, VERYSMALL, MARGIN} from '../font/constants';


const Main = ({navigation}) => {

  const [userInfo, setUserInfo] = useState({});
  const image = {
    "시화정왕점": require("../image/시화정왕점.jpg"),
    "영등포1호점": require("../image/영등포1호점.jpg"),
    "광산사거리점": require("../image/메인.png"),
  }
console.log(userInfo)
  useEffect(()=> {
    AsyncStorage.getItem('user', (error, result) => {
      const tempU = JSON.parse(result);    
      setUserInfo(tempU);
    });
    // AsyncStorage.getItem('reserved',  (error, result) => {
    //   const tempR = JSON.parse(result);   
    //   if( tempR !== null) {
    //     const tempMoment = moment(tempR.reservedDate + " " + tempR.reservedTime, 'YYYY-MM-DD hh:mm');
    //     if(tempMoment.isBefore(moment())){
    //       console.log('fdsds');
    //       AsyncStorage.removeItem('reserved');
    //     }
    //   } 
    // });
  },[]);
  
  return(
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topBarText}>{userInfo.branchName}</Text>
      </View>
      <View style={styles.RoadView}>
        <Image source={image[userInfo.branchName]} style={styles.image}></Image>
        <View style={styles.TextView}>
          <Text style={styles.title}>주소</Text>
          <Text style={styles.RoadText}>{userInfo.branchAddress}</Text>
          <Text style={styles.title}>문의전화</Text>
          <Text style={styles.RoadText}>{userInfo.branchPhoneNumber}</Text>
        </View>
        <View style={{flex: 0.2, flexDirection:"row", borderRadius: 5}}>
          <TouchableOpacity 
            style={[styles.button, {borderRightWidth:0.25, borderBottomLeftRadius: 10, borderRightColor:BOLD}]}
            onPress={()=>{
              Linking.openURL(`tel:${userInfo.branchPhoneNumber}`);
            }}
          >
            <Text style={styles.buttonText}>전화하기</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, {borderLeftWidth:0.25, borderBottomRightRadius: 10, borderRightColor:BOLD}]}
            onPress={()=>{
                navigation.navigate("예약하기");
            }}
          >
            <Text style={styles.buttonText}>예약하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default Main;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F0F0'
    },
    topBar: {
        flex: 0.09,
        backgroundColor: ENABLED,
        justifyContent:'center',
        alignItems:'center'
      },
    topBarText: {
        color: 'white',
        fontSize: NORMAL,
        fontWeight:'bold'
    },
    RoadView: {
        flex: 0.91,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        margin: MARGIN,
        elevation:5,
    },
    image: {
        flex: 0.5,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        width:"100%",
        height:"100%",
        resizeMode:"stretch"
    },
    TextView: {
        flex: 0.5,
    },
    title: {
        paddingHorizontal: MARGIN,
        paddingTop: MARGIN,
        paddingBottom: 3,
        fontSize: BIG,
        color: BOLD,
        fontWeight: 'bold'
    },
    RoadText: {
        paddingHorizontal: MARGIN,
        fontSize: NORMAL
    },
    button: {
        flex: 0.5,
        backgroundColor: ENABLED,
        justifyContent:'center',
        alignItems:'center',
    },
    buttonText: {
        fontSize: VERYBIG,
        fontWeight:'bold',
        color: 'white'
    }
});