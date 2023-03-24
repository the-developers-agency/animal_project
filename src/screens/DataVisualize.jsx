import React, {useContext, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native';
import {Button, Flex, Spinner} from 'native-base';
import LinearChartComponent from '../components/Chart/LinearChartComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LanguageContext} from '../Contexts/LanguageContexts';

const DataVisualize = ({navigation}) => {
  const [data, setData] = useState();

  const {language} = useContext(LanguageContext);

  useEffect(() => {
    AsyncStorage.getItem('sliderVal').then(res => {
      if (res) {
        setData(JSON.parse(res));
      }
    });
  }, []);

  return (
    <SafeAreaView>
      <Flex mt="40px" alignItems="center">
        <LinearChartComponent language={language} />
      </Flex>
      <Button mt="40px" mx="16px" onPress={() => navigation.goBack()}>
        Geri Dön
      </Button>
    </SafeAreaView>
  );
};

export default DataVisualize;
