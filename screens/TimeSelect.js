import React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { dbService } from '../fbase';
import {ENABLED, DISABLED, BOLD, BIG, NORMAL, VERYBIG, MARGIN, SMALL} from '../font/constants';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-community/async-storage';
import Modal from "react-native-modal";
import { vw } from 'react-native-viewport-units';

const timeSelect = ({route, navigation}) => {
  const [selected, setSelected] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(true);
  const [selectedTime, setSelectedTime] = useState(null);
  const [count, setCount] = useState(1);
  const [rNumbers, setRNumbers] = useState({});
  const [userInfo, setUserInfo] = useState({});
  const [reserveInfo, setReserveInfo] = useState({reserves: []});
  const allTimes = [
    ["10:00", "10:30"],
    ["11:00", "11:30"],
    ["12:00", "12:30"],
    ["13:00", "13:30"],
    ["14:00", "14:30"],
    ["15:00", "15:30"],
    ["16:00", "16:30"],
    ["17:00", "17:30"],
    ["18:00", "18:30"],
    ["19:00", "19:30"],
    ["20:00", "20:30"],
    ["21:00", "21:30"],
    ["22:00", "22:30"],
    ["23:00", "23:30"]
  ]
  const selectedDay = route.params.selectedDay;

  useEffect(()=>{
    const unsubscribe = NetInfo.addEventListener((state) => {
      if(state.isConnected === false){
        Alert.alert("인터넷 연결이 없습니다. 인터넷을 연결한 후 다시 시도해주세요.", "", [{onPress: () => {navigation.navigate('Tabs')}}]);
      }
      else{
        AsyncStorage.getItem('user',(error, result) => {
          const tempInfo = JSON.parse(result);
          setUserInfo(tempInfo);
          dbService.ref(`/rNumber/${tempInfo.branchName}/${selectedDay}`).once('value').then(async (snapshot) => {
            let tempMark = {};
            await snapshot.forEach((snap) => {
              tempMark[snap.key] = snap.val();
            })
            setRNumbers(tempMark);
          });
        });
        AsyncStorage.getItem('reserved', (error, result) => {
          const tempInfo = JSON.parse(result);
          if (tempInfo !== null){
            setReserveInfo(tempInfo);
          }
        });
      }
    });
    return unsubscribe;
  },[]);

  return(
    <View style={styles.container}>
      <Modal
        isVisible={modalVisible}
        style={{flex: 1}}
      >
        {modalLoading ? <View style={styles.modal}>
          <View style={styles.modalHead}>
            <Text style={styles.modalText}>{`${selectedDay} 일 ${selectedTime} 에 몇 명 예약하시겠습니까?`}</Text>
          </View>
          <View style={styles.modalMiddle}>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={()=>{
                if(count > 1) {
                  setCount(count-1);
                }
              }}
            >
              <Text style={styles.modalButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.modalButtonText}>{count}</Text>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={()=>{
                  setCount(count+1);
              }}
            >
              <Text style={styles.modalButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalBottom}>
            <TouchableOpacity 
              style={styles.bottomButton}
              onPress={()=>{
                setModalVisible(false);
                setCount(1);
              }}
            >
              <Text style={styles.bottomText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.bottomButton}
              onPress={()=>{     
                setModalLoading(false);          
                setCount(1);
                dbService.ref(`/rUsers/${userInfo.branchName}/${selectedDay}/${selectedTime}/${userInfo
                .name}-${userInfo.phoneNumber}`).set({
                  name: userInfo.name,
                  phoneNumber: userInfo.phoneNumber,
                  count: count
                }).then(() => {
                  dbService.ref(`/rNumber/${userInfo.branchName}/${selectedDay}/${selectedTime}`)
                  .transaction((snapshot) => {
                    return snapshot + count;
                  }, (error, commited) => {
                      if(error || !commited){
                        setModalVisible(false);
                        Alert.alert("오류가 발생했습니다. 다시 시도해 주세요.", "", [{text: "확인",
                          onPress: () => {navigation.navigate("Tabs");}
                        }]);
                      }
                      else {
                        setModalVisible(false);
                        AsyncStorage.setItem('reserved', JSON.stringify({reserves: [{
                          'reservedDate': selectedDay,
                          'reservedTime': selectedTime,
                          'count': count
                        }, ...reserveInfo.reserves]}));
                        Alert.alert("예약에 성공했습니다.", "", [{text: "확인",
                          onPress: () => {navigation.reset({
                            index:0,
                            routes: [{name: 'Tabs'}],
                          })}
                        }]);
                      }
                  });
                }).catch((error) => {
                  setModalVisible(false);
                  Alert.alert("등록된 회원이 아니거나 이미 같은 시간대에 예약하셨습니다.", "", [{text: "확인",
                    onPress: () => {navigation.navigate("Tabs");}
                  }]);
                });
              }}
            >
              <Text style={styles.bottomText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View> : <View/>}
      </Modal>
      <View style={[styles.topBar]}>
        <Text style={styles.topBarText}>시간대 선택</Text>
      </View>
      <View style={styles.times}>
        <ScrollView style={styles.times}>
          {allTimes.map( (data) => {
            return (
              <View style={styles.timeLine}>
                {data.map( (nestData) => {
                  return (
                    <TouchableOpacity 
                      style={[styles.timeItems, {backgroundColor: selectedTime === nestData ? BOLD : 'white'}]}
                      onPress={()=>{
                        setSelected(true);
                        setSelectedTime(nestData);
                      }}
                      activeOpacity={1}
                    >
                      <Text style={[styles.timeText, {color: selectedTime === nestData ? 'white' : BOLD}]}>{nestData}</Text>
                      <Text style={[styles.peopleText, {color: selectedTime === nestData ? 'white' : 'gray'}]}>
                        {rNumbers[nestData] === undefined ? 0 : rNumbers[nestData]}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            )
          })}
        </ScrollView>
      </View>
      <TouchableOpacity  
        style={[styles.selectButton, {backgroundColor: !selected ? DISABLED : ENABLED}]}
        disabled={!selected}
        onPress={()=>{
          setModalLoading(true); 
          setModalVisible(true);
        }}
      >
        <Text style={styles.selectButtonText}>선택하기</Text>
      </TouchableOpacity>
    </View>
  )
}

export default timeSelect;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0'
  },
  modal: {
    flex: 0.5,
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
    padding: MARGIN*1.5
  },
  modalHead:{
    flex: 0.3
  },
  modalText:{
    color: 'black',
    fontSize: VERYBIG
  },
  modalMiddle:{
    flex: 0.5,
    flexDirection:'row',
    justifyContent:'center',
    alignItems: 'center',
    paddingBottom: MARGIN
  },
  modalBottom:{
    flex: 0.2,
    flexDirection:'row',
    justifyContent: 'flex-end',
    alignItems:'center'
  },
  bottomButton: {
    flex: 0.5,
    alignItems:'center',
    justifyContent: 'center'
  },
  bottomText: {
    fontSize: SMALL,
    fontWeight: 'bold',
    color: BOLD,
    alignItems:'center'
  },
  modalButton: {
    flex: 0.3,
    alignItems:'center'
  },
  modalButtonText: {
    color: BOLD,
    fontSize: BIG*3
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
  times: {
    flex: 0.77,
    marginVertical: 5,
    marginHorizontal: 5,
    backgroundColor: '#F0F0F0'
  },
  timeLine: {
    flex: 0.5,
    marginHorizontal: 5,
    marginVertical: 10,
    flexDirection: "row",
    backgroundColor: "#F0F0F0"
  },
  timeItems: {
    backgroundColor: '#FFFFFF',
    flexDirection: "row",
    flex: 0.5,
    padding: MARGIN,
    borderRadius: 5,
    borderColor: BOLD,
    marginHorizontal: 10,
    elevation: 3
  },
  timeText: {
    color: BOLD,
    fontSize:  BIG,
    fontWeight:'bold',
    flex: 0.8,
    textAlign:"center"
  },
  peopleText: {
    color: BOLD,
    fontSize:  BIG,
    fontWeight:'bold',
    flex: 0.2,
    textAlign:"right"
  },
  selectButton: {
    flex: 0.14,
    justifyContent:'center',
    alignItems:'center'
  },
  selectButtonText:{
    color: 'white',
    fontSize: VERYBIG,
    fontWeight:'bold'
  }
});