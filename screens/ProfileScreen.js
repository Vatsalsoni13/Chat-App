import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  AsyncStorage,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import {TextInput} from 'react-native-paper';
import User from '../User';
import * as firebase from 'firebase';
export default class ProfileScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Profile',
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      name: User.name,
      imageSource: User.image ? {uri: User.image} : require('../src/userD.png'),

      upload: false,
    };
  }

  handleChange = key => val => {
    this.setState({[key]: val});
  };

  changeName = async () => {
    if (this.state.name.length < 3) {
      Alert.alert('Error', 'Invalid name');
    } else if (User.name !== this.state.name) {
      User.name = this.state.name;
      this.updateUser();
    }
    this.forceUpdate();
  };

  // logOut = async () => {
  //   await AsyncStorage.clear();
  //   this.props.navigation.navigate('Auth');
  // };

  signOutUser = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
    // firebase
    //   .auth()
    //   .signOut()
    //   .then(() => console.log('Signed Out'))

    //   .catch(() => alert('Error'));
  };

  componentDidMount() {
    this.updateUser();
  }

  changeImage = () => {
    const options = {
      quality: 0.7,
      allowsEditing: true,
      mediaType: 'photo',
      nodata: true,
      storageOptions: {
        skipBackup: true,
        waitUntilSaved: true,
        path: 'images',
        cameraRoll: true,
      },
    };
    ImagePicker.showImagePicker(options, response => {
      if (response.error) {
        console.log(error);
      } else if (!response.didCancel) {
        this.setState(
          {
            upload: true,
            imageSource: {uri: response.uri},
          },
          this.uploadFile,
        );
      }
    });
  };

  updateUser = () => {
    firebase
      .database()
      .ref('users')
      .child(User.phone)
      .set(User);

    Alert.alert('Success', 'Saved successfully!');
  };

  updateUserImage = imageUrl => {
    User.image = imageUrl;
    this.updateUser();
    this.setState({upload: false, imageSource: {uri: imageUrl}});

    User.image = this.state.imageSource;
    AsyncStorage.setItem(
      'userImage',
      JSON.stringify(this.state.imageSource),
      err => {
        if (err) {
          console.log('an error');
          throw err;
        }
        console.log('success');
      },
    ).catch(err => {
      console.log('error is: ' + err);
    });
    console.log(User.image);
  };

  uploadFile = async () => {
    const file = await this.uriToBlob(this.state.imageSource.uri);
    firebase
      .storage()
      .ref(`profile_pictures/${User.phone}.png`)
      .put(file)
      .then(snapshot => snapshot.ref.getDownloadURL())
      .then(url => this.updateUserImage(url))
      .catch(error => {
        this.setState({
          upload: false,
          imageSource: require('../src/userD.png'),
        });
        Alert.alert('Error', 'Error in uploading image!');
        console.log(error);
      });
  };

  uriToBlob = uri => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function() {
        reject(new Error('Error while uploading Image!'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => this.changeImage()}>
          {this.state.upload ? (
            <ActivityIndicator size="large" />
          ) : (
            <Image
              style={{
                borderRadius: 100,
                width: 100,
                height: 100,
                resizeMode: 'cover',
                marginBottom: 10,
              }}
              source={this.state.imageSource}
            />
          )}
        </TouchableOpacity>
        <Text style={{fontSize: 20}}>{User.phone}</Text>
        <Text style={{fontSize: 20}}>{User.name}</Text>
        <TextInput
          label="Change Name"
          mode="flat"
          style={styles.input}
          value={this.state.name}
          onChangeText={this.handleChange('name')}
        />
        <TouchableOpacity
          onPress={() => {
            this.changeName();
          }}>
          <Text style={styles.btnText}>Change Name</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.signOutUser();
          }}>
          <Text style={styles.btnText}>LogOut</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderColor: '#CCC',
    borderWidth: 1,
    width: '80%',
    marginHorizontal: 5,
    borderRadius: 10,
    //marginBottom: 4,
  },
  btnText: {
    color: 'darkblue',
    fontSize: 25,
    marginTop: 20,
  },
});
