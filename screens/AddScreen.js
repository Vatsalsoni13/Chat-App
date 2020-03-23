import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
// import database from '@react-native-firebase/database';
import User from '../User';
import * as firebase from 'firebase';
import {TextInput, Button} from 'react-native-paper';
export default class AddScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newUser: '',
      newName: '',
    };
  }

  addUser = async () => {
    self = this;
    if (this.state.newName !== '' && this.state.newUser !== '') {
      const snapshot = firebase
        .database()
        .ref('users/' + this.state.newUser)
        .on('value', function(snapshot) {
          // console.log(snapshot.exists());
          if (snapshot.exists()) {
            firebase
              .database()
              .ref('messages/' + User.phone + '/added/')
              .child(self.state.newUser)

              .set({name: self.state.newName});
            self.props.navigation.navigate('Home');
          } else {
            console.log(self.state.newName);

            Alert.alert('Not On Chat');
          }
        });
    } else {
      Alert.alert('Fields are empty!');
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          label="Phone No."
          mode="outlined"
          style={styles.input}
          value={this.state.newUser}
          keyboardType="decimal-pad"
          onChangeText={newUser => this.setState({newUser})}
        />
        <TextInput
          label="Name"
          mode="outlined"
          style={styles.input}
          value={this.state.newName}
          keyboardType="default"
          onChangeText={newName => this.setState({newName})}
        />

        {/* <TouchableOpacity onPress={() => this.addUser()}>
          <Text>Add</Text>
        </TouchableOpacity> */}
        <Button
          style={{width: '30%', marginLeft: 5, marginTop: 10}}
          icon="plus"
          mode="contained"
          onPress={() => this.addUser()}>
          Add
        </Button>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  input: {
    // borderColor: '#CCC',
    // borderWidth: 1,
    width: '80%',
    marginHorizontal: 5,
    borderRadius: 10,
    marginBottom: 4,
    marginVertical: 10,
  },
});
