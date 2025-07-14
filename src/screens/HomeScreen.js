// screens/HomeScreen.js
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { logout } from '../services/authService';
import ResultCard from '../components/ResultCard';
import { getUser } from '../services/userService';
import { getTestResults } from '../services/testService';
import { LoadingContext } from '../../App';

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const { setIsLoading } = useContext(LoadingContext);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const userData = await getUser();
        const resultsData = await getTestResults();
        setUser(userData);
        setTestResults(resultsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
  await logout();
  navigation.replace('Login');
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>Welcome, {user?.first_name}!</Text>

        <Button mode="contained" onPress={() => navigation.navigate('NewTest')}>
          New Test (Camera)
        </Button>
        <View style={{ marginVertical: 8 }} />
        <Button
          mode="contained"
          onPress={() => navigation.navigate('SubmitResult')}>
          Submit Test Result (Manual)
        </Button>
        <View style={{ marginVertical: 8 }} />
        <Button
          mode="contained"
          onPress={() => navigation.navigate('TestResults')}>
          View Test Results
        </Button>
        <View style={{ marginVertical: 8 }} />

        <Text style={styles.subheader}>Your Test Results:</Text>
        {testResults.length === 0 ? (
          <Text>No test results yet.</Text>
        ) : (
          <FlatList
            data={testResults}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => <ResultCard result={item} />}
          />
        )}

        <View style={{ marginTop: 20 }} />
        <Button mode="outlined" onPress={() => navigation.navigate('Profile')}>
          Profile
        </Button>
        <View style={{ marginVertical: 8 }} />
        <Button mode="outlined" onPress={handleLogout} textColor="red">
          Logout
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subheader: {
    fontSize: 20,
    marginTop: 24,
    marginBottom: 8,
  },
});

export default HomeScreen;
