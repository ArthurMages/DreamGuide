import { useNavigation } from '@react-navigation/native';
import React, { useRef } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView } from 'react-native';

interface ScrollAwareScreenProps {
  children: React.ReactNode;
  style?: Record<string, any>;
  contentContainerStyle?: Record<string, any>;
}

/**
 * Composant ScrollView qui masque/affiche automatiquement le header
 * en fonction de la direction du scroll
 */
export function ScrollAwareScreen({ children, style, contentContainerStyle }: ScrollAwareScreenProps) {
  const navigation = useNavigation();
  const lastScrollY = useRef(0);
  const isHeaderHidden = useRef(false);

  const handleScroll = React.useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    try {
      const currentScrollY = event.nativeEvent.contentOffset.y;
      const scrollDirection = currentScrollY > lastScrollY.current ? 'down' : 'up';

      if (Math.abs(currentScrollY - lastScrollY.current) < 5) {
        return;
      }

      if (scrollDirection === 'down' && currentScrollY > 50 && !isHeaderHidden.current) {
        navigation.setOptions({ headerShown: false });
        isHeaderHidden.current = true;
      } else if (scrollDirection === 'up' && currentScrollY < 50 && isHeaderHidden.current) {
        navigation.setOptions({ headerShown: true });
        isHeaderHidden.current = false;
      }

      lastScrollY.current = currentScrollY;
    } catch (error) {
      console.error('Scroll handling failed:', error);
    }
  }, [navigation]);

  return (
    <ScrollView
      style={style}
      contentContainerStyle={contentContainerStyle}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={true}
    >
      {children}
    </ScrollView>
  );
}