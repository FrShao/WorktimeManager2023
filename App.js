import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { GluestackUIProvider, Text } from "@gluestack-ui/themed"
import { config } from "@gluestack-ui/config"
import { NfcStart } from "./lib/nfc"
import { useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"

import HomeScreen from "./screens/HomeScreen"
import WorkersScreen from "./screens/WorkersScreen"

const Tab = createBottomTabNavigator()

export default function App() {
  useEffect(()=>{
    NfcStart()
  }, [])
  return (
    <GluestackUIProvider config={config}>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Workers" component={WorkersScreen} tabBar/>
        </Tab.Navigator>
      </NavigationContainer>
    </GluestackUIProvider>
  );
}
