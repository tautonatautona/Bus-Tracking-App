// DrawerNavigator.js
import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DriverHomeScreen from './screens/DriverHomeScreen';
import SettingsScreen from './screens/SettingsScreen';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Dashboard" component={DriverHomeScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}