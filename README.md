# rn-assignment

### Development Environment

- Windows
- Visual Studio Code
- Visual Studio Code Terminal
- Android Studio
- Built-in emulator in Android Studio
- Node package manager (NPM)
- Node.js
- Java Development Kit

### About the app

- When the app launches, it requests permissions to access fine location and gets the coordinates of the device.
- The first screen has two input fields for email/name, and a register button.
- When the user taps on the registration button, the app validates the inputs, POST them to given url, stores response locally in AsyncStorage and navigates to second screen.
- The second screen is a fullscreen map (used mapbox.com library) that shows a marker in the users location, and when clicked it displays his/hers name and email
- When the app is opened again, it checks AsyncStorage to see if the user has registered and navigates to the second screen

#### TODO's
- use Redux
- use SwitchNavigator
- testing 
