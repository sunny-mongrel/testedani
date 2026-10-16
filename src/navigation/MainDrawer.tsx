import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, type DrawerContentComponentProps } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import MainTabs from './MainTabs';
import EducationalScreen from '../screens/main/EducationalScreen';
import AboutUsScreen from '../screens/main/AboutUsScreen';
import type { MainDrawerParamList, MainTabParamList } from '../routes/routes.types';
import { colors, radius } from '../theme/colors';
import { fonts } from '../theme/fonts';

const Drawer = createDrawerNavigator<MainDrawerParamList>();

const tabItems: { label: string; route: keyof MainTabParamList; icon: keyof typeof Ionicons.glyphMap }[] = [
  { label: 'Início', route: 'Home', icon: 'home-outline' },
  { label: 'Missões', route: 'Missoes', icon: 'planet-outline' },
  { label: 'Pegada ecológica', route: 'Pegada', icon: 'footsteps-outline' },
  { label: 'Yvy', route: 'Yvy', icon: 'sparkles-outline' },
  { label: 'Comunidade', route: 'Comunidade', icon: 'people-outline' },
  { label: 'Ajustes', route: 'Ajustes', icon: 'settings-outline' },
];

export default function MainDrawer() {
  return (
    <Drawer.Navigator
      id="MainDrawer"
      initialRouteName="MainTabs"
      screenOptions={{
        headerShown: false,
        drawerPosition: 'left',
        drawerType: 'front',
        drawerStyle: styles.drawer,
        overlayColor: 'rgba(0,0,0,0.35)',
      }}
      drawerContent={(props) => <MainDrawerContent {...props} />}
    >
      <Drawer.Screen name="MainTabs" component={MainTabs} />
      <Drawer.Screen name="Educacional" component={EducationalScreen} />
      <Drawer.Screen name="SobreNos" component={AboutUsScreen} />
    </Drawer.Navigator>
  );
}

function MainDrawerContent({ navigation }: DrawerContentComponentProps) {
  function openTab(route: keyof MainTabParamList) {
    const state = navigation.getState();
    const drawerRoute = state.routes.find((item) => item.name === 'MainTabs');

    if (!drawerRoute) return;

    const event = navigation.emit({
      type: 'drawerItemPress',
      target: drawerRoute.key,
      canPreventDefault: true,
    });

    if (event.defaultPrevented) return;

    const isDrawerRouteFocused = state.routes[state.index]?.key === drawerRoute.key;
    navigation.navigate('MainTabs', { screen: route });

    // Se MainTabs já está selecionada no Drawer, a troca de aba não muda a
    // rota do Drawer; nesse caso, fechamos o menu explicitamente.
    if (isDrawerRouteFocused) navigation.closeDrawer();
  }

  function openPage(route: 'Educacional' | 'SobreNos') {
    const state = navigation.getState();
    const drawerRoute = state.routes.find((item) => item.name === route);

    if (!drawerRoute) return;

    const event = navigation.emit({
      type: 'drawerItemPress',
      target: drawerRoute.key,
      canPreventDefault: true,
    });

    if (event.defaultPrevented) return;

    const isDrawerRouteFocused = state.routes[state.index]?.key === drawerRoute.key;

    if (isDrawerRouteFocused) {
      navigation.closeDrawer();
    } else {
      // Ao focar outra rota do Drawer, o próprio navegador gerencia o fechamento.
      navigation.navigate(route);
    }
  }

  return (
    <DrawerContentScrollView contentContainerStyle={styles.content}>
      <View style={styles.brand}>
        <Text style={styles.brandTitle}>Ecoara</Text>
      </View>

      {tabItems.map((item) => (
        <TouchableOpacity
          key={item.route}
          accessibilityRole="button"
          onPress={() => openTab(item.route)}
          style={styles.item}
          activeOpacity={0.75}
        >
          <Ionicons name={item.icon} size={21} color={colors.leafDeep} />
          <Text style={styles.itemLabel}>{item.label}</Text>
        </TouchableOpacity>
      ))}

      <View style={styles.separator} />

      <TouchableOpacity
        accessibilityRole="button"
        onPress={() => openPage('Educacional')}
        style={styles.item}
        activeOpacity={0.75}
      >
        <Ionicons name="book-outline" size={21} color={colors.leafDeep} />
        <Text style={styles.itemLabel}>Educacional</Text>
      </TouchableOpacity>
      <TouchableOpacity
        accessibilityRole="button"
        onPress={() => openPage('SobreNos')}
        style={styles.item}
        activeOpacity={0.75}
      >
        <Ionicons name="information-circle-outline" size={21} color={colors.leafDeep} />
        <Text style={styles.itemLabel}>Sobre nós</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawer: { width: 300, backgroundColor: colors.background },
  content: { paddingHorizontal: 16, paddingTop: 18 },
  brand: {
    paddingHorizontal: 12,
    paddingBottom: 14,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  brandTitle: { color: colors.leafDeep, fontFamily: fonts.display, fontSize: 23, fontWeight: '800' },
  item: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 12,
    borderRadius: radius.md,
  },
  itemLabel: { color: colors.cardForeground, fontFamily: fonts.sansBold, fontSize: 14 },
  separator: { height: 1, backgroundColor: colors.border, marginVertical: 10 },
});
