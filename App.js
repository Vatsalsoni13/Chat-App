import React from 'react';
import {Image} from 'react-native';
//import 'babel-polyfill';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import * as firebase from 'firebase';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import AuthLoadingScreen from './screens/AuthLoading';
import ChatScreen from './screens/ChatScreen';
import ProfileScreen from './screens/ProfileScreen';


const AppStack = createStackNavigator({
  Home: HomeScreen,
  Chat: ChatScreen,
  Profile: ProfileScreen,
});

const AuthStack = createStackNavigator({
  Login: LoginScreen,
});

const TabNavigator = createBottomTabNavigator(
  {
    Chat: AppStack,
    Profile: ProfileScreen,
  },
  {
    defaultNavigationOptions: ({navigation}) => ({
      tabBarIcon: ({focused, horizontal, tintColor}) => {
        const {routeName} = navigation.state;
        let imageName = require('./src/chat.png');
        let iconName;
        if (routeName === 'Profile') {
          imageName = require('./src/settings.png');
        }

        // You can return any component that you like here!
        return (
          <Image
            source={imageName}
            style={{width: 25, resizeMode: 'contain', tintColor}}
          />
        );
      },
    }),
    tabBarOptions: {
      activeTintColor: 'purple',
      inactiveTintColor: 'gray',
    },
  },
);

var firebaseConfig = {
  //ADD   your firebaseConfigs here
};
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
AppStack.navigationOptions = ({navigation}) => {
  let tabBarVisible = navigation.state.index === 0;

  return {tabBarVisible};
};
export default createAppContainer(
  createSwitchNavigator({
    AuthLoading: AuthLoadingScreen,
    App: TabNavigator,
    Auth: AuthStack,
  }),
  {
    initialRouteName: 'AuthLoading',
  },
);

// const TabNavigator = createBottomTabNavigator(
//   {
//     Chats: MainNavigator,
//     Profile: ProfileScreen,
//   },
//   {
//     defaultNavigationOptions: ({navigation}) => ({
//       tabBarIcon: ({focused, horizontal, tintColor}) => {
//         const {routeName} = navigation.state;
//         let imageName = require('./src/chat.png');
//         let iconName;
//         if (routeName === 'Profile') {
//           imageName = require('./src/settings.png');
//         }

//         // You can return any component that you like here!
//         return (
//           <Image
//             source={imageName}
//             style={{width: 25, resizeMode: 'contain', tintColor}}
//           />
//         );
//       },
//     }),
//     tabBarOptions: {
//       activeTintColor: 'purple',
//       inactiveTintColor: 'gray',
//     },
//   },
// );

// // const App = createAppContainer(TabNavigator);
