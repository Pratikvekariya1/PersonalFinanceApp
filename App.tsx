/**
 * Create the entry point for the application
 */
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { store, persistor } from './src/store';
import { Text, ActivityIndicator, View } from 'react-native';
import DashboardScreen from './src/screens/Dashboard/DashboardScreen';
import TransactionsScreen from './src/screens/Transactions/TransactionsScreen';
import AddTransactionScreen from './src/screens/AddTransaction/AddTransactionScreen';

const Tab = createBottomTabNavigator();

const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color="#007AFF" />
    <Text>Loading...</Text>
  </View>
);

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName: string;

                switch (route.name) {
                  case 'Dashboard':
                    iconName = 'dashboard';
                    break;
                  case 'Transactions':
                    iconName = 'list';
                    break;
                  case 'Add':
                    iconName = 'add-circle';
                    break;
                  default:
                    iconName = 'circle';
                }

                return <Icon name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#007AFF',
              tabBarInactiveTintColor: 'gray',
              headerShown: false,
            })}
          >
            <Tab.Screen name="Dashboard" component={DashboardScreen} />
            <Tab.Screen name="Transactions" component={TransactionsScreen} />
            <Tab.Screen name="Add" component={AddTransactionScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

export default App;
