import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Text, Card, useTheme } from 'react-native-paper';

const HealthChart = ({ results }) => {
    const theme = useTheme();
    const screenWidth = Dimensions.get('window').width;

    // 1. Process Data
    // Sort by date ascending
    const sortedResults = [...results].sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );

    // Take last 5 results for readability
    const recentResults = sortedResults.slice(-5);

    if (recentResults.length < 2) {
        return null; // Not enough data to show a chart
    }

    // Map levels to numeric values
    const mapLevelToValue = (level) => {
        const lower = level?.toLowerCase() || '';
        if (lower.includes('negative')) return 0;
        if (lower.includes('trace')) return 1;
        if (lower.includes('+1')) return 2;
        if (lower.includes('+2')) return 3;
        if (lower.includes('+3')) return 4;
        return 0;
    };

    const dataPoints = recentResults.map((r) => mapLevelToValue(r.result));
    const labels = recentResults.map((r) => {
        const date = new Date(r.timestamp);
        return `${date.getMonth() + 1}/${date.getDate()}`;
    });

    const chartData = {
        labels: labels,
        datasets: [
            {
                data: dataPoints,
                color: (opacity = 1) => theme.colors.primary, // optional
                strokeWidth: 2, // optional
            },
        ],
        legend: ['Protein Level'], // optional
    };

    const chartConfig = {
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        decimalPlaces: 0, // optional, defaults to 2dp
        color: (opacity = 1) => theme.colors.primary,
        labelColor: (opacity = 1) => theme.colors.onSurface,
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: theme.colors.primary,
        },
        propsForBackgroundLines: {
            strokeDasharray: '', // solid lines
            stroke: theme.colors.surfaceVariant,
        },
    };

    return (
        <Card style={styles.card} mode="elevated">
            <Card.Content>
                <Text variant="titleMedium" style={styles.title}>
                    Health Trend
                </Text>
                <LineChart
                    data={chartData}
                    width={screenWidth - 64} // Card padding adjustment
                    height={220}
                    chartConfig={chartConfig}
                    bezier
                    style={styles.chart}
                    fromZero
                    yAxisInterval={1}
                    formatYLabel={(y) => {
                        if (y == 0) return 'Neg';
                        if (y == 1) return 'Trace';
                        if (y == 2) return '+1';
                        if (y == 3) return '+2';
                        if (y == 4) return '+3';
                        return '';
                    }}
                />
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: 24,
        backgroundColor: '#FFFFFF',
    },
    title: {
        marginBottom: 16,
        fontWeight: 'bold',
        color: '#004D40',
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
});

export default HealthChart;
