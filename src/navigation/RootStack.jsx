import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../screens/Home';
import DataVisualize from '../screens/DataVisualize';
import LearnMore from '../screens/LearnMore';

const Stack = createNativeStackNavigator();

const RootStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="DataVisualize" component={DataVisualize} />
      <Stack.Screen name="LearnMore" component={LearnMore} />
    </Stack.Navigator>
  );
};

export default RootStack;
