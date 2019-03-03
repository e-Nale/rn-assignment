import React, { Component } from 'react';
import { StyleSheet,
         View,
         AsyncStorage,
         BackHandler,
         ToastAndroid } from 'react-native';
import Mapbox from '@mapbox/react-native-mapbox-gl';

Mapbox.setAccessToken('pk.eyJ1IjoiZS1uYWxlIiwiYSI6ImNqc2pnNWgxOTI0ZmEzeW54YmZtYWM2YWwifQ.m5hptX8j228AQfnPKX47yw');

export default class Map extends Component<Props> {

  static navigationOptions = {
    title: 'Map',
    headerLeft: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      lat: props.navigation.state.params.latitude,
      long: props.navigation.state.params.longitude,
      name: props.navigation.state.params.name,
      email: props.navigation.state.params.email,
    }
  }  

  /**
   * Get data stored in AsyncStorage
   * Handling Android hardware back button
   * */
  componentDidMount() {
    this.retrieveData();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton() {
        ToastAndroid.show('Back button is pressed', ToastAndroid.SHORT);
        return true;
  }

  retrieveData = async () => {
    try {
      let user = await AsyncStorage.getItem('user');
      let parsed = JSON.parse(user);
      this.setState({
        lat: parsed.latitude,
        long: parsed.longitude,
        name: parsed.name,
        email: parsed.email,
      })
    } catch(error) {
      console.log(error)
    }
  }

  renderAnnotations () {
    var coords = [this.state.long, this.state.lat];
    var info = this.state.name + '\n' + this.state.email;
    return (      
      <Mapbox.PointAnnotation
       
        key='pointAnnotation'
        id='pointAnnotation'
        coordinate={coords}>

        <View style={styles.annotationContainer}>
          <View style={styles.annotationFill} />
        </View>
        <Mapbox.Callout 
          style={styles.mapCallout}
          title={info} />
      </Mapbox.PointAnnotation>      
    )
  }
  render() {
    var coords = [this.state.long, this.state.lat];    
    return (
      <View style={styles.container}>
        <Mapbox.MapView
            styleURL={Mapbox.StyleURL.Street}
            zoomLevel={13}
            showUserLocation
            centerCoordinate={coords}
            style={styles.container}>          
            {this.renderAnnotations()}
        </Mapbox.MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapCallout: {
    flex: 1,
  },
});