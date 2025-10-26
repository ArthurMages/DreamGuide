import { useNavigation } from '@react-navigation/native';
import React, { useRef } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView } from 'react-native';

interface ScrollAwareScreenProps {
  children: React.ReactNode;
  style?: any;
  contentContainerStyle?: any;
}

/**
 * Composant ScrollView qui masque/affiche automatiquement le header
 * en fonction de la direction du scroll
 */
export function ScrollAwareScreen({ children, style, contentContainerStyle }: ScrollAwareScreenProps) {
  const navigation = useNavigation();
  const lastScrollY = useRef(0);
  const isHeaderHidden = useRef(false);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const scrollDirection = currentScrollY > lastScrollY.current ? 'down' : 'up';

    // Ne rien faire si pas de mouvement significatif
    if (Math.abs(currentScrollY - lastScrollY.current) < 5) {
      return;
    }

    // Masquer le header si scroll vers le bas et position > 50
    if (scrollDirection === 'down' && currentScrollY > 50) {
      if (!isHeaderHidden.current) {
        navigation.setOptions({
          headerShown: false,
        });
        isHeaderHidden.current = true;
      }
    } 
    // Afficher le header uniquement si scroll vers le haut avec mouvement significatif
    else if (scrollDirection === 'up' && currentScrollY < 50) {
      if (isHeaderHidden.current) {
        navigation.setOptions({
          headerShown: true,
        });
        isHeaderHidden.current = false;
      }
    }

    lastScrollY.current = currentScrollY;
  };

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