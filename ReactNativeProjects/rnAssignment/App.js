import React, {Component} from 'react';
import { Platform,
         StyleSheet, 
         Text,
         View} from 'react-native';

import { createStackNavigator, createAppContainer  } from 'react-navigation';

import Home from './src/Register'
import MapSc from './src/MapScreen'

const AppNavigator = createStackNavigator({
  Home: {
    screen: Home,
  },
  Map: {
    screen: MapSc,
  } 
})
export default createAppContainer(AppNavigator);