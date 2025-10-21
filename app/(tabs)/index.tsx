import DreamForm from '@/components/DreamForm';
import { View } from '@/components/Themed';
import { useAppTheme } from '@/hooks/useAppTheme';
import { StyleSheet } from 'react-native';

export default function TabOneScreen() {
  const theme = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <DreamForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});