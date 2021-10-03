import React, { useEffect, useState } from 'react';
import AppLoading from 'expo-app-loading';
import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, TouchableOpacity, Dimensions, Linking, ScrollView } from 'react-native';
import { useFonts, Rubik_700Bold, Rubik_400Regular } from '@expo-google-fonts/rubik';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MapView from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { TemperatureCard, SunshineCard, AirQualityCard, CloudCard } from './components/Card';

import styles from './styles';

const Stack = createNativeStackNavigator();

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

function Home() {
  return (
    <View style={styles.app}>
      <ScrollView style={styles.layout}>
        <TemperatureCard />
        <SunshineCard />
        <AirQualityCard />
        <CloudCard />
      </ScrollView>
    </View>
  );
}

function Options({ resetLocation }) {
  return (
    <View style={styles.app}>
      <View style={styles.layout}>
        <TouchableOpacity onPress={() => resetLocation()}>
          <Text allowFontScaling={false} style={styles.buttonText}>Change location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function HomeTitle() {
  const [heading, setHeading] = useState('Welcome back');

  useEffect(() => {
    let hours = new Date().getHours();

    if (hours >= 5 && hours <= 12) {
      setHeading('Good morning');
    } else if (hours >= 13 && hours <= 17) {
      setHeading('Good afternoon');
    }
  }, []);

  const navigation = useNavigation();

  return (
    <View style={styles.heading}>
      <StatusBar style="light" />
      <Text allowFontScaling={false} style={styles.headingText}>{heading}</Text>
      <TouchableOpacity style={styles.nasaSpaceAppsButton} onPress={() => Linking.openURL('https://2021.spaceappschallenge.org/challenges/statements/you-are-my-sunshine/teams/team-giorgio/project')}>
        <Image source={require('./assets/nasa.png')} style={styles.nasaSpaceApps} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionsButton} onPress={() => navigation.navigate('Options')}>
        <Image source={require('./assets/options.png')} style={styles.options} />
      </TouchableOpacity>
    </View>
  )
}

function Title({ heading }) {
  return (
    <View style={styles.heading}>
      <StatusBar style="light" />
      <Text allowFontScaling={false} style={styles.headingText}>{heading}</Text>
    </View>
  )
}

function Map({ setIsLocationSet }) {
  const [region, setRegion] = useState({
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  const [isLocationSet, setLocationSet] = useState(false);

  useEffect(() => {
    let mounted = true;

    if (!isLocationSet) {
      AsyncStorage.getItem('@location').then(location => {
        if (mounted) {
          setLocationSet(true);
          if (location != null)
            setRegion(JSON.parse(location));
        }
      });
    }

    return () => mounted = false;
  });

  return (
    <View style={styles.app}>
      <MapView rotationEnabled={false} region={region} onRegionChangeComplete={setRegion} style={{ height: '100%' }} />
      <View style={styles.latlng}>
        <Text allowFontScaling={false} style={styles.centeredText}>
          Enter a coordinate:{"\n"}
          {region.latitude.toPrecision(7)}, {region.longitude.toPrecision(7)}
        </Text>
      </View>
      <TouchableOpacity style={styles.confirmLatlng} onPress={async () => {
        await AsyncStorage.setItem('@location', JSON.stringify(region));
        setIsLocationSet(true);
      }}>
        <Image source={require('./assets/tick_icon.png')} style={styles.confirmLatlngImage} />
      </TouchableOpacity>
    </View>
  )
}

export default function App() {
  let [fontsLoaded] = useFonts({
    Rubik_700Bold,
    Rubik_400Regular
  });

  const [isLocationSet, setLocationSet] = useState(false);

  useEffect(() => {
    if (!isLocationSet) {
      AsyncStorage.getItem('@location').then(location => {
        if (location != null)
          setLocationSet(true);
      });
    }
  });

  // TODO: Retrieve data from POWER before displaying the app, don't forget to cache the data (hourly?)
  // Currently re-retrieves data every time.
  // Example for POWER API routes: https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M,T2M_MAX,T2M_MIN&community=RE&longitude=30.7018&latitude=36.9061&start=20210923&end=20210929&format=JSON

  return !fontsLoaded ? <AppLoading /> : (
    !isLocationSet ? <Map setIsLocationSet={setLocationSet} /> : (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Home} options={{ headerStyle: { backgroundColor: '#101320' }, headerTitle: props => <HomeTitle {...props} /> }} />
          <Stack.Screen name="Options" options={{ headerStyle: { backgroundColor: '#121421' }, headerBackImageSource: require('./assets/back_arrow.png'), headerTitle: props => <Title heading="Options" {...props} /> }}>
            {props => <Options {...props} resetLocation={() => {
              AsyncStorage.removeItem('@location').then(() => setLocationSet(false));
            }} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    )
  )
}
