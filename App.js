import React from 'react';
import {View, Text} from 'react-native';
import HomeScreen from './Screen/HomeScreen';
import BillCreate from './Screen/BillCreate';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            initialRouteName="Home"
            options={{headerShown: false}}
            name="Home"
            component={HomeScreen}
          />
          <Stack.Screen name="Bill" component={BillCreate} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default App;
