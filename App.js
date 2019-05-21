/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Modal,
  PermissionsAndroid,
  CameraRoll,
  ProgressBarAndroid,
} from 'react-native';
import ViewPager from '@react-native-community/viewpager';
import Slider from '@react-native-community/slider';

async function requestCameraPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Cool Photo App Camera Permission',
        message:
          'Cool Photo App needs access to your camera ' +
          'so you can take awesome pictures.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the camera');
    } else {
      console.log('Camera permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}

async function requestGalleryPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Cool Gallery Permission',
        message:
          'Cool Photo App needs access to your Gallery ' +
          'so you can view awesome pictures.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can view Gallery');
    } else {
      console.log('Gallery permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}

export default class App extends Component {
  constructor(props) {
    super(props);
    let { width, height } = Dimensions.get('window');
    this.state = {
      loading: false,
      width: width,
      height: height,
      modalVisible: false,
      photos: [],
    };
  }

  onPressButton = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false });
    }, 2000);
  };

  setModalVisible = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
  };

  useCamera = () => requestCameraPermission();

  viewGallery = async () => {
    await requestGalleryPermission();
    const isPermitted = PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
    );
    if (isPermitted) {
      CameraRoll.getPhotos({
        first: 20,
        assetType: 'Photos',
      })
        .then(r => {
          this.setState({ photos: r.edges });
        })
        .catch(err => {
          //Error Loading Images
        });
    }
  };

  render() {
    const { loading, width, height, modalVisible, photos } = this.state;
    const load = loading ? (
      <ActivityIndicator size="large" color="#0000ff" />
    ) : (
      <Button onPress={this.onPressButton} title="Clique !" color="#841584" />
    );

    return (
      <ViewPager style={styles.viewPager} initialPage={0}>
        <View style={styles.container} key="1">
          <ScrollView>
            <Image
              style={{ width: width, height: height }}
              source={{
                uri:
                  'https://images.unsplash.com/photo-1556741576-1d17b478d761?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1868&q=80',
              }}
            />
          </ScrollView>
        </View>
        <View style={styles.container} key="2">
          {load}
          <ProgressBarAndroid
            styleAttr="Horizontal"
            indeterminate={false}
            progress={0.5}
          />
          <Slider
            style={{ width: 200, height: 40 }}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#000000"
          />
        </View>
        <View style={styles.container} key="3">
          <Button
            onPress={this.setModalVisible}
            title="Affiche la modale !"
            color="#846564"
          />
          <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}
          >
            <View>
              <Text>Hello World!</Text>
              <Button
                onPress={this.setModalVisible}
                title="Fermer la modale !"
                color="#846564"
              />
            </View>
          </Modal>
        </View>
        <View style={styles.container} key="4">
          <Button
            onPress={this.useCamera}
            title="Use Camera !"
            color="#846564"
          />
        </View>
        <View style={styles.container} key="5">
          <Button
            onPress={this.viewGallery}
            title="Voir la galerie !"
            color="#846564"
          />

          <ScrollView>
            {photos.map((p, i) => {
              return (
                <Image
                  key={i}
                  style={{
                    width: 300,
                    height: 100,
                  }}
                  source={{ uri: p.node.image.uri }}
                />
              );
            })}
          </ScrollView>
        </View>
      </ViewPager>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  viewPager: {
    flex: 1,
  },
});
