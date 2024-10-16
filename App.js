import { ActivityIndicator, Text, View } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { Suspense, useEffect, useState } from 'react';
import { SQLiteProvider } from 'expo-sqlite';
import Home from './screen/Home';
import Ardoise from './screen/Ardoise';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

//screen import outside of the tab
import ArdoiseDataPage from './screen/ArdoiseDataPage';

 
const Tab = createBottomTabNavigator();

const loadDatabase = async () => {
  const dbName = "app.db";
  const dbAsset = require("./assets/app.db");
  const dbUri = Asset.fromModule(dbAsset).uri;
  const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

   

  try {
    const fileInfo = await FileSystem.getInfoAsync(dbFilePath);
    console.log(`File info: ${JSON.stringify(fileInfo)}`);

    if (!fileInfo.exists || fileInfo.size === 0) {
      console.log('File does not exist or is empty. Downloading...');
      await FileSystem.makeDirectoryAsync(
        `${FileSystem.documentDirectory}SQLite`,
        { intermediates: true }
      );
      await FileSystem.downloadAsync(dbUri, dbFilePath);
      console.log('Database file downloaded.');
    } else {
      console.log('Database file already exists.');
    }
  } catch (error) {
    console.error('Error loading database:', error);
  }
};

 

export default function App() {
  const [dbLoaded, setDbLoaded] = useState(false);

  useEffect(() => {
    loadDatabase()
      .then(() => setDbLoaded(true))
      .catch((e) => console.error(e));
  }, []);

  if (!dbLoaded)
    return (
      <View style={{ flex: 1 }}>
        <ActivityIndicator size={"large"} />
        <Text>Loading Database...</Text>
      </View>
    );
  return (
    <NavigationContainer>
      <Suspense
        fallback={
          <View style={{ flex: 1 }}>
            <ActivityIndicator size={"large"} />
            <Text>Loading Database...</Text>
          </View>
        }
      >
        <SQLiteProvider databaseName="app.db" useSuspense>
           
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarButton: route.name === 'ArdoiseData' ? () => null : undefined,
            headerShown: false

          })}
          >
            <Tab.Screen name="Home" component={Home} />
            {
              /**
               * 
               *         <Tab.Screen name="Ardoise" component={Ardoise} />
                        <Tab.Screen name="Statisque" component={Ardoise} />
               */
            }
            <Tab.Screen 
              name="ArdoiseData" 
  
              component={ArdoiseDataPage} 
            />
           </Tab.Navigator>
        </SQLiteProvider>
      </Suspense>
    </NavigationContainer>
  );
}


