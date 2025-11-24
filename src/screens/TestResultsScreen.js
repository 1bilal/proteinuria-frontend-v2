import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { ActivityIndicator, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getTestResults } from '../services/testService';
import ResultCard from '../components/ResultCard';
import HealthChart from '../components/HealthChart';
import { LoadingContext, SnackbarContext } from '../context/GlobalContext';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const TestResultsScreen = () => {
  const [testResults, setTestResults] = useState([]);
  const [error, setError] = useState(null);
  const { setIsLoading } = useContext(LoadingContext);
  const { showSnackbar } = useContext(SnackbarContext);

  useEffect(() => {
    const fetchTestResults = async () => {
      setIsLoading(true);
      try {
        const data = await getTestResults();

        const results = Array.isArray(data)
          ? data
          : Array.isArray(data.results)
            ? data.results
            : [];

        setTestResults(results);
      } catch (err) {
        console.error('Error fetching test results:', err);
        setError('Failed to load test results.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestResults();
  }, []);

  const generatePDF = async () => {
    if (testResults.length === 0) {
      showSnackbar('No results to export.');
      return;
    }

    setIsLoading(true);
    try {
      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: 'Helvetica', sans-serif; padding: 20px; }
              h1 { color: #004D40; text-align: center; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #004D40; color: white; }
              tr:nth-child(even) { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <h1>Proteinuria Test Results</h1>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
            <table>
              <tr>
                <th>Date</th>
                <th>Result</th>
                <th>Method</th>
                <th>Notes</th>
              </tr>
              ${testResults
          .map(
            (item) => `
                <tr>
                  <td>${new Date(item.timestamp).toLocaleDateString()}</td>
                  <td>${item.result}</td>
                  <td>${item.entry_method}</td>
                  <td>${item.notes || '-'}</td>
                </tr>
              `
          )
          .join('')}
            </table>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate or share PDF.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Test Results</Text>
          <Button mode="contained" onPress={generatePDF} icon="file-export" compact>
            Export PDF
          </Button>
        </View>

        {testResults.length > 0 && <HealthChart results={testResults} />}

        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : testResults.length === 0 ? (
          <Text>No test results yet.</Text>
        ) : (
          <FlatList
            data={testResults}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <ResultCard result={item} />}
            contentContainerStyle={styles.listContent}
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default TestResultsScreen;
