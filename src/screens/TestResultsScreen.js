import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getTestResults } from '../services/testService';
import ResultCard from '../components/ResultCard';
import { LoadingContext } from '../../App';

const TestResultsScreen = () => {
  const [testResults, setTestResults] = useState([]);
  const [error, setError] = useState(null);
  const { setIsLoading } = useContext(LoadingContext);

  useEffect(() => {
    const fetchTestResults = async () => {
      setIsLoading(true);
      try {
        const data = await getTestResults();

        console.log('✅ Final test results:', JSON.stringify(data, null, 2));

        const results = Array.isArray(data)
          ? data
          : Array.isArray(data.results)
          ? data.results
          : [];

        setTestResults(results);
      } catch (err) {
        console.error('❌ Error fetching test results:', err);
        setError('Failed to load test results.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestResults();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>Test Results</Text>

        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : testResults.length === 0 ? (
          <Text>No test results yet.</Text>
        ) : (
          <FlatList
            data={testResults}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <ResultCard result={item} />}
          />
        )}
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
  error: {
    color: 'red',
    fontSize: 16,
  },
});

export default TestResultsScreen;
