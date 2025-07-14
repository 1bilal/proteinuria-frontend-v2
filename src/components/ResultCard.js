import React from 'react';
import { Card, Text } from 'react-native-paper';
import { StyleSheet } from 'react-native';

const ResultCard = ({ result }) => {
  if (!result || typeof result !== 'object') {
    console.warn('❗ Skipping invalid result:', result);
    return null;
  }

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.result}>{result.result ?? 'Unknown'}</Text>
        <Text style={styles.date}>
          {result.timestamp ? new Date(result.timestamp).toLocaleString() : ''}
        </Text>
        <Text style={styles.method}>Entry Method: {result.entry_method ?? 'N/A'}</Text>
        {result.notes ? (
          <Text style={styles.notes}>Notes: {result.notes}</Text>
        ) : null}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 2, // For Android shadow
  },
  result: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  date: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  method: {
    fontSize: 14,
    color: '#4b5563',
    marginTop: 8,
  },
  notes: {
    fontSize: 14,
    color: '#111827',
    marginTop: 8,
  },
});

export default ResultCard;