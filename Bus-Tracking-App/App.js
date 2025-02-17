import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './Screens/HomeScreen'; 
import LoginScreen from './Screens/LoginScreen';
import RegisterScreen from './Screens/RegisterScreen'; // Corrected the import path

const Stack = createStackNavigator();

// AuthStack for authentication screens
const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>
);

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth">
        <Stack.Screen 
          name="Auth" 
          component={AuthStack} 
          options={{ headerShown: false }} // Hide AuthStack header
        />
        <Stack.Screen name="Home" component={HomeScreen} 
         options={{ headerShown: false }} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}