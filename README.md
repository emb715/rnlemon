# rn-lemon

This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

## Getting Started

#### Install dependencies
```bash
# using npm
npm install; npm run install:bundle-pod
```


#### Android setup 
Update `sdk.dir` in `android/local.properties` to point to android sdk

Update `org.gradle.java.home=` in `android/gradle.properties` to point to java sdk 

#### Create env file for api key
> Follow the example from .env.example

Add an api key from https://coinmarketcap.com/
if there isn't one present it will use the test api key


## Start Application

```bash
# using npm
npm start

# on Android
npm run android

# on iOS
npm run ios
```

----


### Libraries
- Axios
- [React Query](https://tanstack.com/query/latest)
- [Zustand](https://zustand-demo.pmnd.rs/) 
- [React Navigation](https://reactnavigation.org/docs/getting-started/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)
- [React Native Google SignIn](https://react-native-google-signin.github.io/)
- [React Native SVG](https://github.com/software-mansion/react-native-svg)
- [React Native Async Storage](https://react-native-async-storage.github.io/async-storage/)
- [React Native dotenv](https://github.com/goatandsheep/react-native-dotenv)
- [FlashList](https://shopify.github.io/flash-list/#install)

### Dev
- Testing Library React Native
