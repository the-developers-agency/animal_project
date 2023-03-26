import React, {useEffect, useState} from 'react';
import {NativeBaseProvider} from 'native-base';
import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import {doc, setDoc} from 'firebase/firestore';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import RootStack from './src/navigation/RootStack';
import {LanguageContext} from './src/Contexts/LanguageContexts';
import {db} from './src/utils/firebase';
import firestore from '@react-native-firebase/firestore';

const App = () => {
  const [language, setLanguage] = useState('eng');

  useEffect(() => {
    (async () => {
      // firebase.initializeApp();
      try {
        const userExist = await AsyncStorage.getItem('user');
        if (!userExist) {
          console.log("User doesn't exist");
          const id = uuidv4();
          await AsyncStorage.setItem('user', JSON.stringify({id}));
          const usersCollection = firestore().collection('Users');
          await usersCollection.doc(id).set({
            id,
          });
        } else {
          console.log("User does exist");
        }

      } catch (err) {
        console.log('ERROR:: ', err);
      }
    })();
  }, []);

  return (
    <NavigationContainer>
      <NativeBaseProvider>
        <LanguageContext.Provider value={{language, setLanguage}}>
          <RootStack />
        </LanguageContext.Provider>
      </NativeBaseProvider>
    </NavigationContainer>
  );
};

export default App;
