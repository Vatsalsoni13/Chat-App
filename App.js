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

// const MainNavigator = createStackNavigator(
//   {
//     Home: {screen: HomeScreen},
//     Login: {screen: LoginScreen},
//     Auth: {screen: AuthLoadingScreen},
//     Chat: {screen: ChatScreen},
//     Profile: {screen: ProfileScreen},
//     Add: {screen: AddScreen},
//     Phone: {screen: PhoneAuthScreen},
//   },
//   {
//     defaultNavigationOptions: {
//       //headerTintColor: '#fff',
//       // headerStyle: {
//       //   backgroundColor: '#B83227',
//       // },
//       // headerTitleStyle: {
//       //   color: '#fff',
//       // },
//     },
//     initialRouteName: 'Auth',
//   },
// );

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
  apiKey: 'AIzaSyBwKqiZ6hQ-XyFwHed1wu_69oged2y70os',
  authDomain: 'chat-c1574.firebaseapp.com',
  databaseURL: 'https://chat-c1574.firebaseio.com',
  projectId: 'chat-c1574',
  storageBucket: 'chat-c1574.appspot.com',
  messagingSenderId: '758648869822',
  appId: '1:758648869822:web:aea17a148074b1d6335fef',
  measurementId: 'G-W7SDTM4R25',
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
