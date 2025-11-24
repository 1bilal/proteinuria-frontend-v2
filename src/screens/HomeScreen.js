import React, { useState, useContext, useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Button, Text, Card, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import ResultCard from '../components/ResultCard';
import { getTestResults } from '../services/testService';
import { LoadingContext, SnackbarContext } from '../context/GlobalContext';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = ({ navigation }) => {
  const { user, logout } = useAuth(); // Get user and logout from context
  const theme = useTheme();
  const [testResults, setTestResults] = useState([]);
  const { isLoading, setIsLoading } = useContext(LoadingContext);



  useFocusEffect(
    useCallback(() => {
      const fetchTestResults = async () => {
        // Only show loading on first load or manual refresh, 
        // but for now we keep it simple as per original logic
        setIsLoading(true);
        try {
          const resultsData = await getTestResults();
          setTestResults(resultsData);
        } catch (error) {
          console.error('Error fetching test results:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchTestResults();
    }, [])
  );

  const handleLogout = async () => {
    await logout();
    // No need for navigation.replace(), AppNavigator handles it.
  };

  const onRefresh = useCallback(() => {
    // Refresh logic could go here
  }, []);

  // Fallback state: Token exists but user data failed to load
  if (!user && !isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, styles.centerContent]}>
          <Text variant="headlineMedium" style={styles.headerText}>
            Connection Issue
          </Text>
          <Text variant="bodyMedium" style={{ textAlign: 'center', marginBottom: 20 }}>
            We couldn't load your profile. Please check your internet connection.
          </Text>
          <Button mode="contained" onPress={() => navigation.replace('Login')} style={{ marginBottom: 10 }}>
            Go to Login
          </Button>
          <Button mode="outlined" onPress={logout}>
            Logout
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text variant="headlineMedium" style={styles.headerText}>
            Hello, {user?.first_name}
          </Text>
          <Text variant="bodyLarge" style={styles.subHeaderText}>
            Ready to check your health?
          </Text>
        </View>

        <View style={styles.actionContainer}>
          <Card
            style={styles.actionCard}
            onPress={() => navigation.navigate('NewTest')}
            mode="elevated">
            <Card.Content style={styles.actionContent}>
              <Text variant="titleLarge" style={styles.actionTitle}>
                New Test
              </Text>
              <Text variant="bodyMedium">Use Camera</Text>
            </Card.Content>
          </Card>

          <Card
            style={styles.actionCard}
            onPress={() => navigation.navigate('SubmitResult')}
            mode="elevated">
            <Card.Content style={styles.actionContent}>
              <Text variant="titleLarge" style={styles.actionTitle}>
                Manual Entry
              </Text>
              <Text variant="bodyMedium">Enter Data</Text>
            </Card.Content>
          </Card>
        </View>

        <View style={styles.sectionHeader}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Recent Results
          </Text>
          <Button mode="text" onPress={() => navigation.navigate('TestResults')}>
            See All
          </Button>
        </View>

        {testResults.length === 0 ? (
          <View style={styles.emptyState}>
            <Text variant="bodyLarge">No test results yet.</Text>
          </View>
        ) : (
          <FlatList
            data={testResults.slice(0, 3)} // Show only top 3 on home
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <ResultCard result={item} />}
            contentContainerStyle={styles.listContent}
          />
        )}

        <View style={styles.footer}>
          <Button mode="outlined" onPress={() => navigation.navigate('Profile')}>
            Profile
          </Button>
          <Button mode="text" onPress={handleLogout} textColor={theme.colors.error}>
            Logout
          </Button>
        </View>
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
    padding: 20,
  },
  headerContainer: {
    marginBottom: 24,
  },
  headerText: {
    fontWeight: 'bold',
    color: '#004D40',
  },
  subHeaderText: {
    color: '#00695C',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
  },
  actionContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  actionTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#00897B',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#444746',
  },
  emptyState: {
    alignItems: 'center',
    marginVertical: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  footer: {
    marginTop: 'auto',
    gap: 10,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
