import React, { useEffect, useState } from 'react';
import { Text, View, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from '../styles';
import { LineChart, Grid, YAxis, XAxis } from 'react-native-svg-charts';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export function TemperatureCard() {
  const [headline, setHeadline] = useState('Loading...');
  const [minmaxTemp, setMinmaxTemp] = useState('');
  const [feelsLike, setFeelsLike] = useState('');
  const [name, setName] = useState('');
  const [windSpeed, setWindSpeed] = useState('');
  const [humidity, setHumidity] = useState('');
  const [uvi, setUvi] = useState(0);

  const [isLocationSet, setLocationSet] = useState(false);
  const [location, setLocation] = useState({
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  let apiKey = 'd3df8a5b87216682157e954891011217';

  useEffect(() => {
    if (!isLocationSet) {
      AsyncStorage.getItem('@location').then(location => {
        if (location != null) {
          setLocationSet(true);
          setLocation(JSON.parse(location))
        }
      });
    }
  });

  useEffect(() => {
    if (isLocationSet) {
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${apiKey}&units=metric`)
        .then(res => res.json())
        .then(data => {
          setHeadline(`${~~data.main.temp} °C`);
          setMinmaxTemp(`${~~data.main.temp_max} / ${~~data.main.temp_min} °C`);
          setFeelsLike(`Feels ${~~data.main.feels_like} °C`);
          setName(data.name);
          setWindSpeed(`${data.wind.speed} m/s`);
          setHumidity(`${data.main.humidity}%`);
        });
      
      fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${location.latitude}&lon=${location.longitude}&appid=${apiKey}&units=metric`)
        .then(res => res.json())
        .then(data => {
          setUvi(data.current.uvi);
        });
    }
  }, [location]);

  return (
    <LinearGradient colors={['#8ED6B8', '#8ED1D6']} end={{ x: 1, y: 0.6 }} style={styles.card}>
      <Text allowFontScaling={false} style={styles.cardHeading}>
        {headline}
      </Text>
      <Text allowFontScaling={false} style={styles.cardSubText}>
        {minmaxTemp}
      </Text>
      <Text allowFontScaling={false} style={styles.cardSubText}>
        {feelsLike}
      </Text>
      <Text allowFontScaling={false} style={styles.cardSubText}>
        {name}
      </Text>
      <Image source={require('../assets/wind.png')} style={{ position: 'absolute', right: 12, top: 6, width: 24, height: 24 }} />
      <Text allowFontScaling={false} style={{ position: 'absolute', right: 38, top: 8, fontFamily: 'Rubik_400Regular', fontSize: 18, color: '#efefef' }}>
        {windSpeed}
      </Text>
      <Image source={require('../assets/humidity.png')} style={{ position: 'absolute', right: 14, top: 34, width: 18, height: 18 }} />
      <Text allowFontScaling={false} style={{ position: 'absolute', right: 38, top: 32, fontFamily: 'Rubik_400Regular', fontSize: 18, color: '#efefef' }}>
        {humidity}
      </Text>
      <Image source={require('../assets/uv.png')} style={{ position: 'absolute', right: 10, top: 54, width: 24, height: 24 }} />
      <Text allowFontScaling={false} style={{ position: 'absolute', right: 38, top: 56, fontFamily: 'Rubik_400Regular', fontSize: 18, color: '#efefef' }}>
        {uvi}
      </Text>
    </LinearGradient>
  )
}

export function SunshineCard() {
  const [data, setData] = useState([
    { value: 0, month: "..." }
  ]);

  const [isLocationSet, setLocationSet] = useState(false);
  const [location, setLocation] = useState({
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  useEffect(() => {
    if (!isLocationSet) {
      AsyncStorage.getItem('@location').then(location => {
        if (location != null) {
          setLocationSet(true);
          setLocation(JSON.parse(location))
        }
      });
    }
  });

  useEffect(() => {
    fetch(`https://power.larc.nasa.gov/api/temporal/monthly/point?parameters=ALLSKY_SFC_SW_DWN&community=RE&longitude=${location.longitude}&latitude=${location.latitude}&format=JSON&start=2020&end=2020`)
      .then(res => res.json())
      .then(data => {
        let sunshine = data?.properties?.parameter?.['ALLSKY_SFC_SW_DWN'];

        if (sunshine == null)
          return;

        let newData = [];

        Object.keys(sunshine).forEach((key, index) => {
          switch (index) {
            case 0:
              newData.push({ value: sunshine[key], month: 'Jan' });
              break;
            case 1:
              newData.push({ value: sunshine[key], month: 'Feb' });
              break;
            case 2:
              newData.push({ value: sunshine[key], month: 'Mar' });
              break;
            case 3:
              newData.push({ value: sunshine[key], month: 'Apr' });
              break;
            case 4:
              newData.push({ value: sunshine[key], month: 'May' });
              break;
            case 5:
              newData.push({ value: sunshine[key], month: 'Jun' });
              break;
            case 6:
              newData.push({ value: sunshine[key], month: 'Jul' });
              break;
            case 7:
              newData.push({ value: sunshine[key], month: 'Aug' });
              break;
            case 8:
              newData.push({ value: sunshine[key], month: 'Sep' });
              break;
            case 9:
              newData.push({ value: sunshine[key], month: 'Oct' });
              break;
            case 10:
              newData.push({ value: sunshine[key], month: 'Nov' });
              break;
            case 11:
              newData.push({ value: sunshine[key], month: 'Dec' });
              break;
            default:
              break;
          }
        });

        setData(newData);
      }).catch(console.log);
  })

  const verticalContentInset = { top: 25, bottom: 20 }

  return (
    <LinearGradient colors={['#f4a620', '#cc6a23']} end={{ x: 1, y: 0.6 }} style={styles.card}>
      <Text allowFontScaling={false} style={[styles.cardHeading, { position: 'absolute', fontSize: 20 }]}>Monthly Avg Sunshine - 2020</Text>
      <View style={{ flexDirection: 'row', marginLeft: 4, marginTop: 20 }}>
        <YAxis yAccessor={({item}) => item.value} style={{width: 20}} data={data} contentInset={verticalContentInset} svg={{ fontSize: 12, fill: '#efefef' }} />
        <View style={{ flex: 1, marginLeft: 5, marginRight: 18 }}>
          <LineChart style={{ height: 166 }} yAccessor={({item}) => item.value} data={data} svg={{ stroke: 'rgb(134, 65, 244)' }} contentInset={{ top: 25, bottom: 10 }}>
            <Grid />
          </LineChart>
          <XAxis style={{ marginHorizontal: -10, height: 10 }} data={data} formatLabel={(_, index) => data[index].month} contentInset={{ left: 10, right: 10 }} svg={{ fontSize: 10, fill: '#efefef' }} />
        </View>
      </View>
    </LinearGradient>
  )
}

export function AirQualityCard() {
  return (
    <LinearGradient colors={['#f729e1', '#f4d9d5']} end={{ x: 1.4, y: 1.8 }} style={styles.card}>
      <Text allowFontScaling={false} style={[styles.cardHeading, { fontSize: 42 }]}>Air Quality</Text>
      <Text allowFontScaling={false} style={styles.cardSubText}>
        Moderate
      </Text>
      <Text allowFontScaling={false} style={styles.cardSubText}>
        CO: 180 μg/m³
      </Text>
      <Text allowFontScaling={false} style={{ fontFamily: 'Rubik_400Regular', fontSize: 18, color: '#efefef', position: 'absolute', right: 14, top: 75 }}>
        NO: 40 μg/m³
      </Text>
      <Text allowFontScaling={false} style={styles.cardSubText}>
        NO₂: 26 μg/m³
      </Text>
      <Text allowFontScaling={false} style={{ fontFamily: 'Rubik_400Regular', fontSize: 18, color: '#efefef', position: 'absolute', right: 14, top: 97 }}>
        O₃: 79 μg/m³
      </Text>
      <Text allowFontScaling={false} style={styles.cardSubText}>
        SO₂: 114 μg/m³
      </Text>
      <Text allowFontScaling={false} style={{ fontFamily: 'Rubik_400Regular', fontSize: 18, color: '#efefef', position: 'absolute', right: 14, top: 119 }}>
        NH₃: 22 μg/m³
      </Text>
    </LinearGradient>
  )
}

export function CloudCard() {
  const data = [
    { value: 3.15, month: "Jan" },
    { value: 3.64, month: "Feb" },
    { value: 5.04, month: "Mar" },
    { value: 5.71, month: "Apr" },
    { value: 6.52, month: "May" },
    { value: 5.91, month: "Jun" },
    { value: 5.99, month: "Jul" },
    { value: 5.33, month: "Aug" },
    { value: 4.31, month: "Sep" },
    { value: 4.01, month: "Oct" },
    { value: 3.35, month: "Nov" },
    { value: 3.11, month: "Dec" }
  ];

  const verticalContentInset = { top: 25, bottom: 20 }

  return (
    <LinearGradient colors={['#050038', '#3D51D4']} end={{ x: 1.4, y: 1 }} style={styles.card}>
      <Text allowFontScaling={false} style={[styles.cardHeading, { position: 'absolute', fontSize: 20 }]}>Monthly Avg Cloud (%) - 2020</Text>
      <View style={{ flexDirection: 'row', marginLeft: 4, marginTop: 20 }}>
        <YAxis yAccessor={({item}) => item.value} style={{width: 20}} data={data} contentInset={verticalContentInset} svg={{ fontSize: 12, fill: '#efefef' }} />
        <View style={{ flex: 1, marginLeft: 5, marginRight: 18 }}>
          <LineChart style={{ height: 166 }} yAccessor={({item}) => item.value} data={data} svg={{ stroke: 'rgb(134, 65, 244)' }} contentInset={{ top: 25, bottom: 10 }}>
            <Grid />
          </LineChart>
          <XAxis style={{ marginHorizontal: -10, height: 10 }} data={data} formatLabel={(_, index) => data[index].month} contentInset={{ left: 10, right: 10 }} svg={{ fontSize: 10, fill: '#efefef' }} />
        </View>
      </View>
    </LinearGradient>
  )
}
