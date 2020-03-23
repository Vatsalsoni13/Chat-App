import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Image,
} from 'react-native';

import User from '../User';

import * as firebase from 'firebase';

//import styles from '../constants/styles';

export default class ChatScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.getParam('name', null),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      textMessage: '',
      messageList: [],
      dbRef: firebase.database().ref('message'),
      person: {
        name: props.navigation.getParam('name'),
        phone: props.navigation.getParam('phone'),
      },
    };
    this.keyboardHeight = new Animated.Value(0);
    this.bottomPadding = new Animated.Value(60);
  }
  componentDidMount() {
    this.keyboardShowListener = Keyboard.addListener('keyboardDidShow', e =>
      this.keyboardEvent(e, true),
    );
    this.keyboardHideListener = Keyboard.addListener('keyboardDidHide', e =>
      this.keyboardEvent(e, false),
    );
    this.state.dbRef
      .child(User.phone)
      .child(this.state.person.phone)
      .on('child_added', value => {
        this.setState(prevState => {
          return {
            messageList: [...prevState.messageList, value.val()],
          };
        });
      });
  }
  handleChange = key => val => {
    this.setState({[key]: val});
  };

  UNSAFE_componentWillMount() {
    this.state.dbRef.off();
  }

  keyboardEvent = (event, isShow) => {
    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: event.duration,
        toValue: isShow ? 80 : 0,
      }),
      Animated.timing(this.bottomPadding, {
        duration: event.duration,
        toValue: isShow ? 120 : 60,
      }),
    ]).start();
  };
  convertTime = time => {
    let d = new Date(time);
    let c = new Date();
    let result = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':';
    result += (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    if (c.getDay() !== d.getDay()) {
      result = d.getDay() + ' ' + d.getMonth() + ' ' + result;
    }
    return result;
  };

  sendMessage = async () => {
    if (this.state.textMessage.length > 0) {
      let msgId = this.state.dbRef
        .child(User.phone)
        .child(this.state.person.phone)
        .push().key;
      let updates = {};
      let message = {
        message: this.state.textMessage,
        time: firebase.database.ServerValue.TIMESTAMP,
        from: User.phone,
      };
      updates[
        User.phone + '/' + this.state.person.phone + '/' + msgId
      ] = message;
      updates[
        +this.state.person.phone + '/' + User.phone + '/' + msgId
      ] = message;
      this.state.dbRef.update(updates);
      this.setState({textMessage: ''});
    }
  };
  renderRow = ({item}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          maxWidth: '60%',
          alignSelf: item.from === User.phone ? 'flex-end' : 'flex-start',
          backgroundColor: item.from === User.phone ? '#00897b' : '#7cb342',
          borderRadius: 10,
          marginBottom: 10,
        }}>
        <Text style={{color: '#FFF', padding: 7, fontSize: 16}}>
          {item.message}
        </Text>
        <Text style={{color: '#EEE', padding: 3, fontSize: 12}}>
          {this.convertTime(item.time)}
        </Text>
      </View>
    );
  };
  render() {
    const {height} = Dimensions.get('window');
    return (
      <KeyboardAvoidingView
        behavior="height"
        style={{flex: 1, backgroundColor: '#FFF'}}>
        <FlatList
          ref={ref => (this.flatList = ref)}
          onContentSizeChange={() =>
            this.flatList.scrollToEnd({animated: true})
          }
          onLayout={() => this.flatList.scrollToEnd({animated: true})}
          style={{padding: 10, paddingHorizontal: 10}}
          data={this.state.messageList}
          renderItem={this.renderRow}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={
            <Animated.View style={{height: this.bottomPadding}} />
          }
        />
        <Animated.View
          style={[styles.bottomBar, {bottom: this.keyboardHeight}]}>
          <TextInput
            style={styles.inputMessage}
            value={this.state.textMessage}
            placeholder="Type message..."
            onChangeText={this.handleChange('textMessage')}
          />
          <TouchableOpacity
            onPress={this.sendMessage}
            style={{
              alignItems: 'center',
              marginBottom: 10,
              marginLeft: 6,
              height: 45,
              width: 45,
              paddingTop: 10,
              paddingLeft: 5,
              backgroundColor: '#2196F3',
              borderRadius: 25,
              //position: 'absolute',
            }}>
            <Image
              source={require('../src/send.png')}
              style={{tintColor: 'white', resizeMode: 'contain', height: 25}}
            />
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    );
  }
}
const styles = StyleSheet.create({
  input: {
    borderColor: '#CCC',
    borderWidth: 1,
    width: '80%',
    marginHorizontal: 5,
    borderRadius: 100,
    padding: 10,
    marginBottom: 10,
    //marginBottom: 4,
  },
  inputMessage: {
    borderColor: '#CCC',
    borderWidth: 1,
    width: '83%',
    marginHorizontal: 5,
    borderRadius: 100,
    padding: 10,
    marginBottom: 5,
    //marginBottom: 4,
  },
  btnText: {
    color: 'darkblue',
    fontSize: 25,
    //marginTop: 6,
  },
  bottomBar: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    //alignItems: 'center',
    marginHorizontal: 5,

    padding: 5,
    //paddingTop: 10,
    position: 'relative',

    //elevation: 0,
    height: 65,
  },
});
