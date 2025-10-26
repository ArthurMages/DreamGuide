import { useAppTheme } from '../hooks/useAppTheme';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Card as PaperCard } from 'react-native-paper';

type ThemedCardProps = React.ComponentProps<typeof PaperCard>;

export function ThemedCard(props: ThemedCardProps) {
    const theme = useAppTheme();

    return (
        <PaperCard
            {...props}
            mode="elevated"
            style={[
                styles.card,
                {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                },
                props.style,
            ]}
            elevation={1}
        >
            {props.children}
        </PaperCard>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 16,
        borderRadius: 12,
        borderWidth: 1,
    },
});