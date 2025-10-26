import { useAppTheme } from '../hooks/useAppTheme';
import React, { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

export function ThemedScreen({ children }: PropsWithChildren) {
    const theme = useAppTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});