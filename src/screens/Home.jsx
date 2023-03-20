import React, {useContext, useEffect, useState} from 'react';
import {Alert, SafeAreaView} from 'react-native';
import {Box, Button, Heading, HStack, Slider, Text} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import {LanguageContext} from '../Contexts/LanguageContexts';

const Home = ({navigation}) => {
  const [sliderValue, setSliderValue] = useState();
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const {language, setLanguage} = useContext(LanguageContext);

  const isFocused = useIsFocused();

  const handleSubmit = async () => {
    try {
      const obj = {
        sliderValue,
        createdAt: new Date(),
        day: moment(new Date()).format('dddd'),
      };

      const resSliderVal = await AsyncStorage.getItem('sliderVal');

      if (resSliderVal) {
        await AsyncStorage.setItem(
          'sliderVal',
          JSON.stringify([...JSON.parse(resSliderVal), obj]),
        );
      } else {
        await AsyncStorage.setItem('sliderVal', JSON.stringify([obj]));
      }

      setIsDataSubmitted(true);
    } catch (err) {
      console.log('ERROR:: ', err);
      Alert.alert('Could not submit the data');
    }
  };

  useEffect(() => {
    // AsyncStorage.getItem('sliderVal').then(
    //   res => res && setIsDataSubmitted(true),
    // );
    if (isFocused) {
      setIsDataSubmitted(false);
    }
  }, [isFocused]);

  return (
    <SafeAreaView flex={1}>
      <Box px="16px" flex={1}>
        <Heading mt="40px" textAlign="center">
          {language === 'eng'
            ? 'Hey There! 👋'
            : 'İstanbul Depreme Hazırlık Uygulaması'}
        </Heading>
        <Text fontSize="16px" mt="40px">
          {language === 'eng'
            ? "How would you rate the animal's behaviour right now?"
            : 'Son hafta içinde evcil hayvanlarınızın, çiftlik hayvanlarınızın veya doğanın davranışlarını nasıl değerlendirirsiniz?'}
        </Text>
        <Box mt="40px">
          <HStack
            w="full"
            alignItems="center"
            justifyContent="space-between"
            mx="auto">
            <Text fontSize="15px">
              {language === 'eng' ? 'Normal' : 'Tamamen normal'}
            </Text>
            <Text fontSize="15px">
              {language === 'eng' ? 'Erratic' : 'Son derece anormal'}
            </Text>
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
        <Button mt="40px" onPress={handleSubmit}>
          {language === 'eng' ? 'Submit' : 'Gönder'}
        </Button>
        {isDataSubmitted && (
          <Text
            mt="40px"
            fontSize="15px"
            textAlign="center"
            color="gray.500"
            underline
            onPress={() => navigation.navigate('DataVisualize')}>
            {language === 'eng' ? 'Go to graph' : 'Grafik al'}
          </Text>
        )}
        <HStack
          alignItems="center"
          justifyContent="space-between"
          mt="auto"
          mb="15px">
          <Text
            color={language === 'eng' ? 'black' : 'gray.500'}
            onPress={() => setLanguage('eng')}>
            English
          </Text>
          <Text underline onPress={() => navigation.navigate('LearnMore')}>
            {language === 'eng' ? 'Information' : 'Bilgi'}
          </Text>
          <Text
            color={language === 'tur' ? 'black' : 'gray.500'}
            onPress={() => setLanguage('tur')}>
            Turkish
          </Text>
        </HStack>
      </Box>
    </SafeAreaView>
  );
};

export default Home;
