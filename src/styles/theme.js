import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#00897B', // Teal 600
        onPrimary: '#FFFFFF',
        primaryContainer: '#B2DFDB', // Teal 100
        onPrimaryContainer: '#004D40', // Teal 900
        secondary: '#26A69A', // Teal 400
        onSecondary: '#FFFFFF',
        secondaryContainer: '#E0F2F1', // Teal 50
        onSecondaryContainer: '#00695C', // Teal 800
        tertiary: '#4DB6AC', // Teal 300
        onTertiary: '#FFFFFF',
        tertiaryContainer: '#B2DFDB',
        onTertiaryContainer: '#004D40',
        background: '#F5F7FA', // Light Blue-Grey
        onBackground: '#1A1C1E',
        surface: '#FFFFFF',
        onSurface: '#1A1C1E',
        surfaceVariant: '#E0E3E3',
        onSurfaceVariant: '#444746',
        outline: '#747775',
        error: '#E53935', // Red 600
        onError: '#FFFFFF',
        errorContainer: '#FFDAD6',
        onErrorContainer: '#410002',
        elevation: {
            level0: 'transparent',
            level1: '#F5F7FA',
            level2: '#E8EBED',
            level3: '#E0E3E3',
            level4: '#DCE0E0',
            level5: '#D8DCDC',
        },
    },
    roundness: 12, // More rounded corners for a modern look
};
