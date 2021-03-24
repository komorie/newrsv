import React, { useEffect, useState} from 'react';
import { StyleSheet, Text, TextInput, View, Image, TouchableOpacity } from 'react-native';
import { ENABLED, DISABLED, NORMAL, VERYBIG, MARGIN, SMALL } from '../font/constants';
import AsyncStorage from '@react-native-community/async-storage';
import { vh, vw } from 'react-native-viewport-units';
// import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';
// import {authService, firebaseInstance} from "../fbase";


const Login = ({navigation}) => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(()=> {
    AsyncStorage.getItem('user', (error, result) => {
      if(result !== null){
        navigation.reset({
          index:0,
          routes: [{name: 'Tabs'}],
        });
      }
    })
  });


  const buttonStyle = (style, state) => {
    return [style, state ? { backgroundColor: DISABLED } : { backgroundColor: ENABLED }]
  }

  const LogIn = () => {
    navigation.navigate("BranchSelect", {
      name: name.trim(),
      phoneNumber: phoneNumber.trim()
    });
    setName("");
    setPhoneNumber("");
  }
  


  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require("../image/메인.png")}></Image>
      <Image style={styles.logoText} source={require("../image/로고글자.png")}></Image>
      <View style={styles.textView}>
        {/* <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={firebaseConfig}
          attemptInvisibleVerification={attemptInvisibleVerification}
        /> */}
        <Text style={styles.textViewText}>이름</Text>
        <TextInput
          style={styles.textViewInput}
          value={name}
          onChangeText={(text) => setName(text)}
          placeholder="이름을 입력해주세요"
          autoCompleteType="off"
          autoCorrect={false}
        />
      </View>
      <View style={styles.textView}>
        <Text style={styles.textViewText}>전화번호</Text>
        <TextInput
          style={styles.textViewInput}
          value={phoneNumber}
          onChangeText={(text) => setPhoneNumber(text)}
          placeholder="'-' 없이 번호만 입력해주세요"
        />
      </View>
      <TouchableOpacity
        style={buttonStyle(styles.loginButton, !(name && phoneNumber))}
        disabled={!(name && phoneNumber)}
        onPress={LogIn}
      >
        <Text style={styles.loginText}>회원등록</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  logo: {
    width: vw*33,
    height: vw*33
  },
  logoText: {
    width: vw*39,
    height: vw*7,
    marginTop: vh*2,
    marginBottom: vh*13
  },
  textView: {
    borderColor: DISABLED,
    marginHorizontal: MARGIN,
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: MARGIN
  },
  textViewText: {
    color: "#6c6c6c",
    flex: 0.25,
    textAlignVertical: "center",
    fontSize: SMALL,
    paddingHorizontal: vw*2
  },
  textViewInput: {
    color: "#6c6c6c",
    flex: 0.75,
    fontSize: SMALL,
    paddingVertical: vw*2.1,
    textAlignVertical: "center"
  },
  loginButton: {
    flexDirection: 'row',
    padding: VERYBIG,
    marginTop: vh*10
  },
  loginText: {
    flex: 1,
    textAlign: "center",
    fontSize: VERYBIG,
    fontWeight: "bold",
    color: "white"
  }
});

export default Login;


  // const [verificationId, setVerificationId] = useState(null);
  // const firebaseConfig = firebaseInstance.apps.length ? firebaseInstance.app().options : undefined;
  // const recaptchaVerifier = useRef(null);
  // const attemptInvisibleVerification = false;

  // const Login = async () => {
  //   try {
  //     const credential = firebaseInstance.auth.PhoneAuthProvider.credential(
  //       verificationId,
  //       verifyNumber
  //     );
  //     await firebaseInstance.auth().signInWithCredential(credential);
  //     navigation.navigate("BranchSelect");
  //   }
  //   catch (error) {
  //     console.log(error);
  //     Alert.alert("오류가 발생했습니다.\n다시 시도해 주세요.");
  //   }
  // }

  // const verify = async () => {
  //   try{
  //     console.log("11");
  //     const phoneProvider = new firebaseInstance.auth.PhoneAuthProvider();
  //     const verificationId = await phoneProvider.verifyPhoneNumber(
  //       `+82 ${phoneNumber}`,
  //       recaptchaVerifier.current
  //     );
  //     console.log("11");
  //     setVerificationId(verificationId);
  //     Alert.alert("인증번호가 발송되었습니다.");        
  //     setVeriSend(true);
  //   } 
  //   catch (error) {
  //     console.log(error);
  //     Alert.alert("오류가 발생했습니다.\n다시 시도해 주세요.");      
  //   }
  // }

