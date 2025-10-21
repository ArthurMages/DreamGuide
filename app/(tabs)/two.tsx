import DreamList from '@/components/DreamList';
import { ThemedScreen } from '@/components/ThemedScreen';
import { StyleSheet } from 'react-native';

export default function TabTwoScreen() {
  return (
    <ThemedScreen>
      <DreamList />
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    paddingBottom: 0,
  },
});