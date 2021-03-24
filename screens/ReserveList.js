import React from 'react';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { dbService } from '../fbase';
import {ENABLED, DISABLED, BOLD, BIG, VERYBIG, MARGIN} from '../font/constants';
import AsyncStorage from '@react-native-community/async-storage';
import Modal from "react-native-modal";
import NetInfo from '@react-native-community/netinfo';

const ReserveList = ({route, navigation}) => {

  const [selected, setSelected] = useState(false);
  const [sDate, setSDate] = useState(null);
  const [sTime, setSTime] = useState(null);
  const [sCount, setSCount] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [reserveInfo, setReserveInfo] = useState([]);

  const listClicked = (date, time, count) => {
    setSelected(true);
    setSDate(date);
    setSTime(time);
    setSCount(count);
  }

  useEffect(()=> {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if(state.isConnected === false){
        Alert.alert("인터넷 연결이 없습니다. 인터넷을 연결한 후 다시 시도해주세요.", "", [{text: '확인', onPress: () => {
          navigation.reset({index:0, routes: [{name: 'Tabs'}]})
        }}]);
      }
    });
    AsyncStorage.getItem('user', (error, result) => {
      const tempInfo = JSON.parse(result);
      setUserInfo(tempInfo);
    });
    AsyncStorage.getItem('reserved', (error, result) => {
      const tempInfo = JSON.parse(result);
      if(tempInfo !== null) {
        let newreserves = [];
        tempInfo.reserves.map((data) =>{
          const tempMoment = moment(data.reservedDate + " " + data.reservedTime, 'YYYY-MM-DD hh:mm');
          if(tempMoment.isAfter(moment().add(-1,'months').format('YYYY-MM-DD'))){
            newreserves.push(data);
          }
        });
        AsyncStorage.setItem('reserved', JSON.stringify({reserves: newreserves}));
        setReserveInfo(newreserves);
      }
    });
    return unsubscribe;
  }, []);

  return(
    <View style={styles.container}>
      <Modal
        isVisible={modalVisible}
        style={{flex: 1}}
      />
      <View style={styles.topBar}>
        <Text style={styles.topBarText}>예약 내역</Text>
      </View>
      <ScrollView style={styles.lists}>
        {
          reserveInfo.map( (data) => {
            const tempMoment = moment(data.reservedDate + " 00:00", 'YYYY-MM-DD hh:mm');
            return (
              <TouchableOpacity 
                style={[styles.listItems, {backgroundColor: (sDate === data.reservedDate && sTime === data.reservedTime) ? BOLD : 'white'}]}
                disabled={tempMoment.isBefore(moment())}
                onPress={() => listClicked(data.reservedDate, data.reservedTime, data.count)}
                activeOpacity={1}
              >
                <Text style={[styles.listText, {color: (sDate === data.reservedDate && sTime === data.reservedTime)? 'white' : BOLD}]}>
                  {data.reservedDate}  |  {data.reservedTime}  |  {data.count}명
                </Text>
              </TouchableOpacity>
            )
          })
        }
      </ScrollView>
      <TouchableOpacity
        style={[styles.selectButton, {backgroundColor: !selected ? DISABLED : ENABLED}]}
        disabled={!selected}
        onPress={() => {
          Alert.alert("정말로 취소하시겠습니까?","",[{text: "아니오"}, {text: "네", onPress: () => {
            setModalVisible(true);
            dbService.ref(`/rUsers/${userInfo.branchName}/${sDate}/${sTime}/${userInfo.name}-${userInfo.phoneNumber}`)
            .remove().then(() => {
              dbService.ref(`/rNumber/${userInfo.branchName}/${sDate}/${sTime}`).transaction((snapshot) => { 
                if((snapshot - sCount) === 0){   
                  return null;
                }
                else {
                  return (snapshot - sCount);
                }
              }, (error, commited) => {
                if(error || !commited){
                  setModalVisible(false);
                  Alert.alert("오류가 발생했습니다. 다시 시도해 주세요.", "", [{text: "확인",
                    onPress: () => {navigation.navigate("Tabs");}
                  }]);
                }
                else {
                  const itemToFind = reserveInfo.find((item) => (item.reservedDate === sDate && item.reservedTime === sTime));
                  const idx = reserveInfo.indexOf(itemToFind);
                  reserveInfo.splice(idx, 1);
                  AsyncStorage.setItem('reserved', JSON.stringify({reserves: reserveInfo}));
                  setModalVisible(false);
                  Alert.alert("취소에 성공했습니다.", "", [{text: "확인",
                    onPress: () => {
                      navigation.reset({
                        index:0,
                        routes: [{name: 'Tabs'}],
                    })}
                  }]);
                }
              }); 
            }).catch((error) => {
              setModalVisible(false);
              Alert.alert("등록된 회원이 아닙니다. 지점에 문의해주세요.", "", [{text: "확인",
                onPress: () => {navigation.navigate("Tabs");}
              }]);
            });
          }}]);
        }}
      >
        <Text style={styles.selectButtonText}>예약취소</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ReserveList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0'
  },
  topBar: {
    flex: 0.115,
    backgroundColor: ENABLED,
    justifyContent:'center',
    alignItems:'center'
  },
  topBarText: {
    color: 'white',
    fontSize: BIG,
    fontWeight:'bold'
  },
  lists: {
    flex: 0.725,
    marginHorizontal: 5,
    marginVertical: MARGIN,
    backgroundColor: '#F0F0F0'
  },
  listItems: {
    backgroundColor: '#FFFFFF',
    padding: MARGIN*1.2,
    justifyContent: 'center',
    borderRadius: 10,
    borderColor: BOLD,
    marginBottom: MARGIN,
    marginHorizontal: MARGIN,
    elevation: 3
  },
  listText: {
    color: BOLD,
    fontWeight: 'bold',
    fontSize: BIG
  },
  selectButton: {
    flex: 0.18,
    justifyContent:'center',
    alignItems:'center'
  },
  selectButtonText:{
    color: 'white',
    fontSize: VERYBIG,
    fontWeight:'bold'
  }
});