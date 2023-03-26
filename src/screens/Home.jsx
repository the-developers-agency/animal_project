import React, {useContext, useEffect, useState} from 'react';
import {Alert, Linking, SafeAreaView, View} from 'react-native';
import {Box, Button, Heading, HStack, Slider, Text} from 'native-base';
import {useIsFocused} from '@react-navigation/native';
import {LanguageContext} from '../Contexts/LanguageContexts';
import Database from '../utils/db.js';

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
      await Database.updateData(sliderValue);
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
        const uniqueUsers = await Database.getPast7DayUsers();
        setTotalUsers(uniqueUsers);
      } catch (err) {
        console.log('ERROR:: ', err);
      }
    })();
  }, [isDataSubmitted]);

  return (
    <SafeAreaView flex={1}>
      <Box px="16px" flex={1}>
        <View style={{width: '70%', alignSelf: 'center'}}>
          <Heading mt="40px" textAlign="center">
            İstanbul Depreme Hazırlık Uygulaması
          </Heading>
        </View>
        <Text fontSize="16px" mt="40px" style={{textAlign: 'center'}}>
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
            Geçtiğimiz 7 günde {totalUsers} kullanıcı veri girdi.
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
