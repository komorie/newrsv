import React, { useState } from 'react';
import { Image, StatusBar } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import Stack from './navigation/Stack';



export default function App() {
  return (
    <>
      <StatusBar barStyle='dark-content' backgroundColor='white'/>
      <NavigationContainer>
        <Stack/>
      </NavigationContainer>
    </>)
}

// const cacheImages = (images) => images.map(image => {
//   if(typeof image === "string"){
//     return Image.prefetch(image);
//   }
//   else {
//     return Asset.fromModule(image).downloadAsync();
//   }
// })

// const cacheFonts = fonts => fonts.map(font=>Font.loadAsync(font));

  // const [isReady, setIsReady] = useState(false);
  // const loadAssets = async () => {
  //   const images = cacheImages([
  //     require("./assets/favicon.png"),
  //     require("./image/내비게이션.png"),
  //     require("./image/로고글자.png"),
  //     require("./image/메인.png")
  //   ]);
  //   const fonts = cacheFonts([Ionicons.font]);
  //   return Promise.all([...images, ...fonts]);
  // };
  // const onFinish = () => setIsReady(true);

  // const [init, setInit] = useState(false);
  // const [userObj, setuserObj] = useState(null);
  // useEffect(()=> {
  //   setInit(true);
  //   authService.onAuthStateChanged((user) => {
  //     if (user) {
  //       setIsLoggedIn(true);
  //       setuserObj(user);
  //     }
  //     else {
  //       setIsLoggedIn(false);
  //     }
  //     setInit(true);
  //   });
  // }, []);