import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
} from 'react-native';
import AppNavigation from './src/Navigation/AppNavigation';
import { apiCall } from './src/Api/openAI';


function App(): React.JSX.Element {
  return (
    <AppNavigation />

  );
}

const styles = StyleSheet.create({
});

export default App;
