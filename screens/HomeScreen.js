import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import PTRView from 'react-native-pull-to-refresh';
import Icon from 'react-native-vector-icons/Entypo';
import {TouchableOpacity} from 'react-native-gesture-handler';
import User from '../User';
// import database from '@react-native-firebase/database';
import firebase from 'firebase';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      users: [],
      dbRef: firebase.database().ref('users'),
    };
  }

  UNSAFE_componentWillMount() {
    this.fetch();
  }

  fetch = () => {
    //console.log(User.image);
    this.state.dbRef.on('child_added', val => {
      let person = val.val();

      person.phone = val.key;

      // self = this;

      // let dbRef = firebase
      //   .database()
      //   .ref('messages/' + User.phone)
      //   .child('/added/');
      // dbRef.on('child_added', val => {
      //   let person = val.val();

      //   person.phone = val.key;
      // for (person.phone in Ref) {
      //   person.imageUrl = firebase
      //     .database()
      //     .ref('users/' + person.phone)
      //     .child('/imageUrl/')
      //     .on('value');
      // }

      //console.log(person);

      //console.log(val.key);

      if (person.phone === User.phone) {
        User.name = person.name;
        User.image = person.image ? person.image : null;
      } else {
        this.setState(prevState => {
          return {
            users: [...prevState.users, person],
          };
        });
        //self.setState({users: contactResult});
        //console.log(this.state.users);
      }
    });
  };

  // UNSAFE_componentWillMount() {
  //   this.state.dbRef.off();
  // }

  render() {
    if (this.state.users !== '') {
      return (
        <SafeAreaView style={styles.container}>
          <FlatList
            data={this.state.users}
            renderItem={({item}) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('Chat', item);
                  }}
                  style={{
                    flexDirection: 'row',
                    padding: 13,
                    borderBottomColor: '#CCC',
                    borderBottomWidth: 1,
                    alignItems: 'center',
                  }}>
                  <Image
                    source={
                      item.image
                        ? {uri: item.image}
                        : require('../src/userD.png')
                    }
                    style={{
                      width: 40,
                      height: 40,
                      resizeMode: 'cover',
                      borderRadius: 32,
                    }}
                  />
                  <Text style={{fontSize: 20, marginLeft: 5}}>
                    {item.name}

                    {/* {console.log('Item', item.name)} */}
                  </Text>
                </TouchableOpacity>
              );
            }}
            keyExtractor={item => item.phone}
            ListHeaderComponent={() => (
              <Text
                style={{
                  fontSize: 30,
                  marginVertical: 10,
                  marginLeft: 10,
                  fontWeight: 'bold',
                }}>
                Chats
              </Text>
            )}
          />

          {/* <Icon
            style={styles.floatButton}
            name="plus"
            color="black"
            size={60}
            onPress={() => this.props.navigation.navigate('Add')}
          /> */}
        </SafeAreaView>
      );
    } else {
      return (
        <View
          style={{flex: 1, alignContent: 'center', justifyContent: 'center'}}>
          <Icon
            style={{alignSelf: 'center'}}
            name="plus"
            size={35}
            onPress={() => this.props.navigation.navigate('Add')}
          />
          <Text style={{textAlign: 'center'}}>No Contacts please Add</Text>

          {/* <Text>hi</Text> */}
          <Icon
            style={styles.floatButton}
            name="plus"
            color="black"
            size={60}
            onPress={() => this.props.navigation.navigate('Add')}
          />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center',
  },
  floatButton: {
    borderWidth: 30,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    position: 'absolute',
    bottom: 20,
    right: 20,
    height: 60,

    borderRadius: 100,
  },
});
