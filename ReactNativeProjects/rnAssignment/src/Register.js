import React, {Component} from 'react';
import {Platform, 
  StyleSheet, 
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  AsyncStorage} from 'react-native';

const BASE_URL = 'https://a6e6qa6e5f.execute-api.eu-west-3.amazonaws.com/dev/flappaccount';
const ACCESS_TOKEN = 'access_token';

type Props = {};
export default class Home extends React.Component<Props> {

  static navigationOptions = {
    title: 'Register',
  }

  constructor(props)
  {
    super(props);
    this.state = {
      isLoading: true,
      dataSource: null,
      id: '',
      name: '',
      validateName: true,
      email: '',
      validateEmail: true,
      isButtonDisabled: true,
      ready: false,
      location: null,   
      latitude: null,
      longitude: null,
      error: null,
    }
  }

  /** 
   * Save data to AsyncStorage
   */
  persistData() {
    let collection = {
      name: this.state.name,
      email: this.state.email,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
    }
    AsyncStorage.setItem('user', JSON.stringify(collection))
  }

  /**
   * Get data from AsyncStorage, and if user
   * exists navigate to Map screen 
   */
  retrieveData = async () => {
    try{
      let user = await AsyncStorage.getItem('user');
      let parsed = JSON.parse(user);
      if(parsed.name != null){
        this.props.navigation.navigate('Map', {
        latitude: parsed.latitude,
        longitude: parsed.longitude,
        name: parsed.name,
        email: parsed.email,  
        });
      }
    } catch(error) {
      console.log(error)
    }
  }

  /** 
   * Retrieve data from AsyncStorage, and if
   * lat, long are null get coordinates
   */
  componentDidMount() {
    this.retrieveData();
    if(this.state.latitude == null && this.state.longitude== null){
      this.findCoordinates();
    }
  }

  findCoordinates = async () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({     
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          isLoading: false,
        });
      },
      error => this.setState({error: error.message}),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };
  
  fetchData = () => {    
    return fetch(BASE_URL)
      .then ((response) => response.json())
      .then((responseJson) => {
        this.setState({
          dataSource: responseJson.Items,
        })       
      })      
      .catch((error) => {
        console.log(error)
      });
  }

  validateInput(text,field) {
    var regName = /^[a-zA-Z]+(\s[a-zA-Z]+)?$/
    var regMail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    
    switch(field) {
      case 'name':
        if (regName.test(text) && text.length >= 5 && text != '') {
          this.setState({validateName: true})
        } else {
          this.setState({validateName: false})
        }
        break;
      case 'email':
        if (regMail.test(text) && text != '') {
          this.setState({validateEmail: true})
        } else {
          this.setState({validateEmail: false})
        }
        break;
      default:
        return null;
    }
    this.setState({[field]: text});
    this.buttonValidation();
  }

  buttonValidation() {
    if(this.state.name != '' && this.state.email!= '') {
      this.state.validateName === true && this.state.validateEmail === true? this.setState({isButtonDisabled: false}):this.setState({isButtonDisabled: true})
    }
  }

  /**
   * POST data to url,
   * save data to AsyncStorage,
   * and navigate to MapScreen
   */
  onPress = () => {

    Keyboard.dismiss();

    let collection = {}
    /**
     * Should check first if random generated ID 
     * already exists in data returned from 
     * @fetchData function
     */
    var randomID = Math.floor(Math.random() * 1000 ) + 1;
    collection.id= '' + randomID,
    collection.name=this.state.name,
    collection.location=this.state.latitude + ', ' + this.state.longitude,
    collection.email=this.state.email

    var url = BASE_URL;
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(collection),
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .then(response => console.log('Success:', JSON.stringify(response)))
    .catch(error => console.error('Error:', error));

    this.persistData();
    this.props.navigation.navigate('Map', {
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      name: this.state.name,
      email: this.state.email,  
    });
  }

  render() {    
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
          <Text style={styles.welcome}>
          Getting coordinates...
          </Text>
        </View>
      )
    } else { 
    return (                     
      <View style={styles.container}>
        <Text style={styles.welcome}>
        Registration Form
        </Text>
        <TextInput
          placeholder="Your name, at least 5 characters"
          style={[styles.input, !this.state.validateName? styles.validateError:null]}
          onChangeText={(text) => this.validateInput(text,'name')}
        />
        <TextInput
          placeholder="E-mail"
          keyboardType="email-address"
          style={[styles.input, !this.state.validateEmail? styles.validateError:null]}
          onChangeText={(text) => this.validateInput(text,'email')}
        />
        <TouchableOpacity
          disabled={this.state.isButtonDisabled}
          style={[styles.btnDisabled, !this.state.isButtonDisabled? styles.btnEnabled:null]}
          onPress={this.onPress}>
          <Text>Submit</Text>
        </TouchableOpacity>
      </View>
    );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#F5FCFF',
    padding: 16,
    paddingTop: 64,
  },
  welcome: {
    fontSize: 22,
    paddingBottom:20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  btnDisabled: {
    backgroundColor: '#DDDDDD',
    height: 40, 
    padding: 8,   
    alignItems: 'center',
    borderRadius: 10,
    opacity: 0.3,
  },
  btnEnabled: {
    backgroundColor: '#91d1d8',
    height: 40, 
    padding: 8,   
    alignItems: 'center',
    borderRadius: 10,
    opacity: 1,
  },
  input: {
    paddingBottom: 20,
  },
  validateError: {
    borderWidth: 3,
    borderColor: 'red',
  }
});