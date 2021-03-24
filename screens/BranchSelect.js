import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, StatusBar} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { vh } from 'react-native-viewport-units';
import { dbService } from '../fbase';
import {ENABLED, DISABLED, BOLD, NORMAL, BIG, VERYBIG, MARGIN} from '../font/constants';


const BranchSelect = ({route, navigation}) => {
  const [selected, setSelected] = useState(false);
  const [sName, setSName] = useState(null);
  const [sAddress, setSAddress] = useState(null);
  const [sPhoneNumber, setSPhoneNumber] = useState(null);
  const allBranches = [
    {
      name: '시화정왕점',
      address: '경기도 시흥시 정왕대로 64, 206호',
      phoneNumber: '010-4763-0418'
    },{
      name: '영등포1호점',
      address: '서울시 영등포구 도신로127, 2층',
      phoneNumber: '02-832-3788'
    },{
      name: '광산사거리점',
      address: '서울시 강북구 노해로 94, 2층',
      phoneNumber: '010-3675-2421'
    }
  ]

  const itemStyle = (style, state) => {
    return [style, state ? { backgroundColor: DISABLED } : { backgroundColor: BOLD }]
  }

  const buttonStyle = (style, state) => {
    return [style, state ? { backgroundColor: DISABLED } : { backgroundColor: ENABLED }]
  }
  const branchClicked = (name, address, phoneNumber) => {
    setSelected(true);
    setSName(name);
    setSAddress(address);
    setSPhoneNumber(phoneNumber);
  }

  const signInClicked = async () => {
    await AsyncStorage.setItem('user',JSON.stringify({
      'name': route.params.name, 
      'phoneNumber': route.params.phoneNumber,
      'branchName': sName,
      'branchAddress': sAddress,
      'branchPhoneNumber': sPhoneNumber
    }));
    navigation.reset({
      index:0,
      routes: [{name: 'Tabs'}],
    });
  }

  return (
    <View style={styles.container}>
      <View style={[styles.topBar]}>
        <Text style={styles.topBarText}>지점 선택</Text>
      </View>
      <View style={styles.branches}>
        <ScrollView style={styles.branches}>
          {allBranches.map(data => {
            return (
              <TouchableOpacity 
                style={[styles.branchItems, {backgroundColor: sName === data.name ? BOLD : 'white'}]}
                onPress={() => branchClicked(data.name, data.address, data.phoneNumber)}
                activeOpacity={1}
              >
                <Text style={[styles.itemsTitle, {color: sName === data.name ? 'white' : BOLD}]}>{data.name}</Text>
                <Text style={[styles.itemsText, {color: sName === data.name ? 'white' : BOLD}]}>{data.address}</Text>
                <Text style={[styles.itemsText, {color: sName === data.name ? 'white' : BOLD}]}>{data.phoneNumber}</Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>
      <TouchableOpacity  
        style={buttonStyle(styles.selectButton, !selected)}
        disabled={!selected}
        onPress={()=>{
          Alert.alert(`${sName}을 선택하시겠습니까?`,'',[{
              text: '아니오'
            },{
              text: '네',
              onPress: signInClicked
            }
          ]);
        }}
      >
        <Text style={styles.selectButtonText}>선택하기</Text>
      </TouchableOpacity>
    </View>
  )
}

export default BranchSelect;

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
  branches: {
    flex: 0.77,
    paddingTop: vh,
    backgroundColor: '#F0F0F0'
  },
  branchItems: {
    backgroundColor: '#FFFFFF',
    padding: MARGIN,
    paddingBottom: MARGIN*2.5,
    borderRadius: 10,
    borderColor: BOLD,
    marginVertical: MARGIN*0.7,
    marginHorizontal: MARGIN*1.5,
    elevation: 5
  },
  itemsTitle: {
    fontSize: BIG,
    fontWeight:'bold',
    paddingBottom: vh*1,
  },
  itemsText: {
    fontSize: NORMAL,
    color: 'gray',
    paddingBottom: vh*0.5
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