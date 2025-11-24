import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const TestResultScreen = ({ route }) => {
  const { result } = route.params;

  const getResultColor = (res) => {
    const lower = res?.toLowerCase() || '';
    if (lower.includes('negative')) return '#4CAF50'; // Green
    if (lower.includes('trace')) return '#FFC107'; // Amber
    return '#E53935'; // Red
  };

  const resultColor = getResultColor(result.result);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.resultHeader}>
          <View style={[styles.resultBadge, { backgroundColor: resultColor }]}>
            <Text variant="headlineMedium" style={styles.resultText}>
              {result.result || 'Unknown'}
            </Text>
          </View>
          <Text variant="titleMedium" style={styles.resultLabel}>
            Protein Level
          </Text>
        </View>

        <Card style={styles.detailsCard} mode="elevated">
          <Card.Content>
            <View style={styles.detailRow}>
              <Text variant="bodyMedium" style={styles.detailLabel}>Date</Text>
              <Text variant="bodyMedium" style={styles.detailValue}>
                {new Date(result.timestamp).toLocaleString()}
              </Text>
            </View>
            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text variant="bodyMedium" style={styles.detailLabel}>Method</Text>
              <Text variant="bodyMedium" style={styles.detailValue}>
                {result.entry_method === 'auto' ? 'Camera Analysis' : 'Manual Entry'}
              </Text>
            </View>

            {result.notes && (
              <>
                <View style={styles.divider} />
                <View style={styles.detailRow}>
                  <Text variant="bodyMedium" style={styles.detailLabel}>Notes</Text>
                  <Text variant="bodyMedium" style={styles.detailValue}>{result.notes}</Text>
                </View>
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
    backgroundColor: '#F5F7FA',
  },
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  resultBadge: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  resultText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resultLabel: {
    color: '#444746',
  },
  detailsCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  detailLabel: {
    color: '#747775',
  },
  detailValue: {
    fontWeight: 'bold',
    color: '#1A1C1E',
    maxWidth: '60%',
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E3E3',
  },
});

export default TestResultScreen;
