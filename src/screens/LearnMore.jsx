import {Box, Button, Text, VStack} from 'native-base';
import React, {useContext} from 'react';
import {Alert, Linking, SafeAreaView} from 'react-native';
import BLOG_LINKS from '../constants/blogLinks';
import {LanguageContext} from '../Contexts/LanguageContexts';

const LearnMore = ({navigation}) => {
  const {language} = useContext(LanguageContext);

  const handleOpenLink = async url => {
    const canOpen = await Linking.canOpenURL(url);

    if (canOpen) {
      Linking.openURL(url);
    } else {
      Alert.alert('Could not open this URL');
    }
  };

  return (
    <SafeAreaView flex={1}>
      <VStack flex={1} px="16px" space="10px" mt="40px">
        {BLOG_LINKS.map((item, idx) => (
          <Box key={idx}>
            <Text>
              {idx + 1}. {item.text}
            </Text>
          </Box>
        ))}
        <Button mt="40px" mx="16px" onPress={() => navigation.goBack()}>
          Geri Dön
        </Button>
      </VStack>
    </SafeAreaView>
  );
};

export default LearnMore;
