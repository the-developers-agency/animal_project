import React, {useState} from 'react';
import {NativeBaseProvider} from 'native-base';
import {NavigationContainer} from '@react-navigation/native';
import RootStack from './src/navigation/RootStack';
import {LanguageContext} from './src/Contexts/LanguageContexts';

const App = () => {
  const [language, setLanguage] = useState('eng');

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
