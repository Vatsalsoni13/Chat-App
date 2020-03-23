import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {TextInput} from 'react-native-paper';
// import database from '@react-native-firebase/database';
import * as firebase from 'firebase';
import User from '../User';

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      name: '',
    };
  }
  handleChange = key => val => {
    this.setState({[key]: val});
  };

  submitForm = async () => {
    if (this.state.phone.length < 10) {
      Alert.alert('Error', 'Wrong phone number!');
    } else if (this.state.name.length < 3) {
      Alert.alert('Error', 'Name is too short');
    } else {
      await AsyncStorage.setItem('userPhone', this.state.phone);
      await AsyncStorage.setItem('userName', this.state.name);
      User.phone = this.state.phone;
      User.name = this.state.name;
      console.log(User.name);

      firebase
        .database()
        .ref('users/' + User.phone)
        .update({name: this.state.name, phone: this.state.phone});
      //.set({name: this.state.name, phone: this.state.phone});
      this.props.navigation.navigate('Home');
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          label="Phone Number"
          style={styles.input}
          mode="outlined"
          value={this.state.phone}
          keyboardType="decimal-pad"
          onChangeText={this.handleChange('phone')}
        />
        <TextInput
          label="Name"
          style={styles.input}
          mode="outlined"
          value={this.state.name}
          onChangeText={this.handleChange('name')}
        />
        <TouchableOpacity onPress={this.submitForm}>
          <Text style={styles.btnText}>Enter</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    padding: 7,

    width: '90%',
  },
  btnText: {
    color: 'darkblue',
    fontSize: 25,
    marginTop: 20,
  },
});

// import React from 'react';
// import PhoneAuthScreen from './PhoneAuth';

// function LoginScreen() {
//   return <PhoneAuthScreen />;
// }

// export default LoginScreen;
