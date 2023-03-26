import React, {useContext, useEffect, useState} from 'react';
import {Alert, Linking, SafeAreaView} from 'react-native';
import {Box, Button, Heading, HStack, Slider, Text} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import {LanguageContext} from '../Contexts/LanguageContexts';
import firestore from '@react-native-firebase/firestore';


const Home = ({navigation}) => {
  const [sliderValue, setSliderValue] = useState();
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [totalUsers, setTotalUsers] = useState();

  const {language, setLanguage} = useContext(LanguageContext);

  const isFocused = useIsFocused();

  // const handleSubmit = async () => {
  //   try {
  //     const obj = {
  //       sliderValue,
  //       createdAt: new Date(),
  //       day: moment(new Date()).format('dddd'),
  //     };

  //     const resSliderVal = await AsyncStorage.getItem('sliderVal');

  //     if (resSliderVal) {
  //       await AsyncStorage.setItem(
  //         'sliderVal',
  //         JSON.stringify([...JSON.parse(resSliderVal), obj]),
  //       );
  //     } else {
  //       await AsyncStorage.setItem('sliderVal', JSON.stringify([obj]));
  //     }

  //     setIsDataSubmitted(true);
  //   } catch (err) {
  //     console.log('ERROR:: ', err);
  //     Alert.alert('Could not submit the data');
  //   }
  // };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const recordsCollection = firestore().collection('Records');
      const today = moment().format('YYYY-MM-DD');
      const recordDoc = await recordsCollection.doc(today).get();
      const recordObj = {
        value: 0,
        count: 0,
      };
      if (recordDoc.data()?.value) {
        const {value, count} = recordDoc.data();
        recordObj.count = count;
        recordObj.value = value;
      }
      recordObj.value += sliderValue;
      recordObj.count += 1;
      recordObj.updateAt = new Date();
      await recordsCollection.doc(today).set(recordObj);
      const usersCollection = firestore().collection('Users');
      // update user doc with updatedAt
      const user = await AsyncStorage.getItem('user');
      const userId = JSON.parse(user).id;
      await usersCollection.doc(userId).update({updatedAt: new Date()});
      setIsDataSubmitted(true);
    } catch (err) {
      console.log('ERROR:: ', err);
      Alert.alert('Could not submit the data', 'Please try again later');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isFocused) {
      setIsDataSubmitted(false);
    }
  }, [isFocused]);

  useEffect(() => {
    (async () => {
      try {
        const recordsCollection = firestore().collection('Users');
        // updatedAt is greater than 7 days
        const querySnapshot = await recordsCollection
          .where('updatedAt', '>=', moment().subtract(7, 'days').toDate())
          .get();
        console.log("querySnapshot", querySnapshot.size);
        setTotalUsers(querySnapshot.size);
      } catch (err) {
        console.log('ERROR:: ', err);
      }
    })();
  }, [isDataSubmitted]);

  return (
    <SafeAreaView flex={1}>
      <Box px="16px" flex={1}>
        <Heading mt="40px" textAlign="center">
          İstanbul Depreme Hazırlık Uygulaması
        </Heading>
        <Text fontSize="16px" mt="40px">
          Son hafta içinde evcil hayvanlarınızın, çiftlik hayvanlarınızın veya
          doğanın davranışlarını nasıl değerlendirirsiniz?
        </Text>
        <Box mt="40px">
          <HStack
            w="full"
            alignItems="center"
            justifyContent="space-between"
            mx="auto">
            <Text fontSize="15px">Tamamen normal</Text>
            <Text fontSize="15px">Son derece anormal</Text>
          </HStack>
          <Slider
            maxW="300"
            mx="auto"
            w="3/4"
            defaultValue={0}
            minValue={0}
            maxValue={100}
            step={10}
            onChangeEnd={val => setSliderValue(Math.floor(val))}
            accessibilityLabel="Pet Slider">
            <Slider.Track>
              <Slider.FilledTrack />
            </Slider.Track>
            <Slider.Thumb />
          </Slider>
        </Box>
        <Button mt="40px" onPress={handleSubmit} isLoading={isLoading}>
          Gönder
        </Button>
        {totalUsers !== 0 && (
          <Text textAlign="center" mt="10">
            {totalUsers} user(s) have entered the data in past 7 days
          </Text>
        )}
        {isDataSubmitted && (
          <Text
            mt="40px"
            fontSize="15px"
            textAlign="center"
            color="gray.500"
            underline
            onPress={() => navigation.navigate('DataVisualize')}>
            Grafik al
          </Text>
        )}
        <HStack
          alignItems="center"
          justifyContent="space-between"
          mt="auto"
          mb="15px">
          <Text underline onPress={() => navigation.navigate('LearnMore')}>
            Bilgi
          </Text>
          <Text
            underline
            onPress={() =>
              Linking.openURL(
                'https://join.slack.com/t/stanbuldeprem-hcv9010/shared_invite/zt-1rbuc6nvq-H4Z_ELq5IpB0Wf8it3Wwcw',
              )
            }>
            Bize katılın
          </Text>
        </HStack>
      </Box>
    </SafeAreaView>
  );
};

export default Home;
