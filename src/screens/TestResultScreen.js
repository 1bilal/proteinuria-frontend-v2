import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const TestResultScreen = ({ route }) => {
  const { result } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.header}>Test Result Details</Text>
            <Text style={styles.label}>Result:</Text>
            <Text style={styles.value}>{result.result}</Text>

            <Text style={styles.label}>Entry Method:</Text>
            <Text style={styles.value}>{result.entry_method}</Text>

            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>
              {new Date(result.timestamp).toLocaleString()}
            </Text>

            {result.notes && (
              <>
                <Text style={styles.label}>Notes:</Text>
                <Text style={styles.value}>{result.notes}</Text>
              </>
            )}

            {result.image && (
              <>
                <Text style={styles.label}>Image:</Text>
                {/* You might want to display the image here, but it requires more complex handling */}
                <Text style={styles.value}>
                  Image available (not displayed)
                </Text>
              </>
            )}
          </Card.Content>
        </Card>
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
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  card: {
    elevation: 2,
    borderRadius: 10,
    padding: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default TestResultScreen;
