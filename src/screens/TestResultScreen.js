import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import BASE_URL from '../services/api';

const TestResultsScreen = ({ navigation }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        if (!token) {
          navigation.replace('Login');
          return;
        }

        const response = await axios.get(`${BASE_URL}test-results/`, {
          headers: { Authorization: `Token ${token}` },
        });

        setResults(response.data);
      } catch (error) {
        console.error('Error fetching test results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.resultText}>Result: {item.result}</Text>
      <Text style={styles.metaText}>Entry: {item.entry_method}</Text>
      <Text style={styles.metaText}>Date: {new Date(item.created_at).toLocaleString()}</Text>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  }

  return (
    <View style={styles.container}>
      {results.length === 0 ? (
        <Text style={styles.noDataText}>No test results found.</Text>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
        <View style={{ marginVertical: 8 }} />
        <Button title="New Test (Camera)" onPress={() => navigation.navigate("NewTest")} />
        <View style={{ marginVertical: 8 }} />
        <Button title="Submit Test Result (Manual)" onPress={() => navigation.navigate("SubmitResult")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  card: {
    padding: 15,
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  resultText: { fontSize: 18, fontWeight: 'bold' },
  metaText: { fontSize: 14, color: '#555', marginTop: 4 },
  noDataText: { fontSize: 16, textAlign: 'center', marginTop: 50, color: '#666' },
});

export default TestResultsScreen;
