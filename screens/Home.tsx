/* eslint-disable */
import {View, Text} from 'react-native';
import {useState, useEffect} from 'react';
import axios from "axios";

function HomeScreen() {
  const [userId, setUserId] = useState(1);
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Home Screen</Text>
    </View>
  );
}

export default HomeScreen;
