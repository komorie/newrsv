import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import {ENABLED, BOLD, NORMAL, SMALL, BIG, VERYBIG, MARGIN} from '../font/constants';
import NetInfo from '@react-native-community/netinfo';

const Profile = ({navigation}) => {
  const [userInfo, setUserInfo] = useState(null);
  const [reserveInfo, setReserveInfo] = useState(null);
  const [pressed, setPressed] = useState(false);

  useEffect(()=> {
    AsyncStorage.getItem('user', (error, result) => {
      const tempInfo = JSON.parse(result);
      setUserInfo(tempInfo);
    });
    AsyncStorage.getItem('reserved', (error, result) => {
      const tempInfo = JSON.parse(result);
      setReserveInfo(tempInfo);
    });
    const unsubscribe = NetInfo.addEventListener((state) => {
      if(pressed && (state.isConnected === false)){
        Alert.alert("인터넷 연결이 없습니다. 인터넷을 연결한 후 다시 시도해주세요.", "", [{onPress: () => {setPressed(false), navigation.navigate('홈')}}]);
      }
    });
    return unsubscribe;
  },[pressed]);
  

  return(
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topBarText}>내정보</Text>
      </View>
      <View style={styles.profile}>
        <View style={styles.textView}>
          <View style={styles.profileItems}> 
            <Text style={styles.title}>회원명</Text>
            <Text style={styles.RoadText}>{userInfo?.name}</Text>
          </View>
          <View style={styles.profileItems}> 
            <Text style={styles.title}>전화번호</Text>
            <Text style={styles.RoadText}>{userInfo?.phoneNumber}</Text>
          </View>
          <View style={styles.profileItems}> 
            <Text style={styles.title}>가입 지점</Text>
            <Text style={styles.RoadText}>{userInfo?.branchName}</Text>
          </View>
        </View>
      </View>
      <View style={styles.bottomView}/>
    </View>
  )
}


export default Profile;

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
    fontSize: BIG,
    fontWeight:'bold'
  },
  profile: {
    flex: 0.82,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    margin: MARGIN,
    elevation:5,
  },
  profileItems: {
    flex:0.22
  },
  textView: {
    flex: 0.85
  },
  title: {
    paddingLeft: MARGIN,
    paddingTop: MARGIN,
    paddingBottom: 3,
    fontSize: BIG,
    color: BOLD,
    fontWeight: 'bold'
  },
  RoadText: {
    paddingLeft: MARGIN,
    fontSize: NORMAL,
  },
  bottomView: {
    flex: 0.06, 
    justifyContent:"center", 
    alignItems:"flex-end"
  },
  logOutButtonText: {
    color: BOLD, 
    fontSize: SMALL, 
    fontWeight: 'bold', 
    marginRight: VERYBIG
  }
});