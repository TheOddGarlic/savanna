import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  app: {
    backgroundColor: '#101320',
    height: '100%'
  },

  layout: {
    paddingHorizontal: 16
  },

  heading: {
    backgroundColor: '#101320',
    width: '100%',
    position: 'relative',
    left: Platform.OS == 'ios' ? 8 : 0
  },

  headingText: {
    color: '#efefef',
    marginTop: 0,
    fontSize: 34,
    fontFamily: 'Rubik_700Bold'
  },

  optionsButton: {
    position: 'absolute',
    top: 4,
    right: 32
  },

  nasaSpaceAppsButton: {
    position: 'absolute',
    top: 0,
    right: Platform.OS == 'android' ? 74 : 64
  },

  nasaSpaceApps: {
    width: 40,
    height: 40
  },

  options: {
    width: 32,
    height: 32
  },

  card: {
    backgroundColor: '#101320',
    marginTop: 16,
    borderRadius: 15,
    width: '100%',
    height: 196
  },

  cardHeading: {
    fontFamily: 'Rubik_700Bold',
    fontSize: 52,
    color: '#efefef',
    position: 'relative',
    left: 12,
    top: 8
  },

  buttonText: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 24,
    color: '#efefef',
    position: 'relative',
    left: 12,
    top: 10
  },

  cardSubText: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 18,
    color: '#efefef',
    left: 12,
    top: 4
  },

  latlng: {
    width: '50%',
    alignItems: 'stretch',
    position: 'absolute',
    bottom: 40,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
    left: '25%'
  },

  confirmLatlng: {
    alignItems: 'stretch',
    position: 'absolute',
    top: 36,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    right: 16
  },

  confirmLatlngImage: {
    width: 64,
    height: 64
  },

  centeredText: { textAlign: 'center' }
});
