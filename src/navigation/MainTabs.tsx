/*
 * NAVEGAÇÃO POR ABAS (parte principal do app, após o questionário).
 *
 * Diferente da pilha (routes/stack.routes.tsx), aqui as telas coexistem e o
 * usuário alterna livremente entre elas pela barra inferior.
 * A barra é desenhada por CustomTabBar.tsx.
 */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CustomTabBar } from './CustomTabBar';
import HomeScreen from '../screens/main/HomeScreen';
import MissionsScreen from '../screens/main/MissionsScreen';
import FootprintScreen from '../screens/main/FootprintScreen';
import YvyScreen from '../screens/main/YvyScreen';
import CommunityScreen from '../screens/main/CommunityScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import type { MainTabParamList } from '../routes/routes.types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      // Substitui a barra padrão pela do app. O React Navigation passa em
      // `props` o estado das abas, e repassamos tudo com o spread {...props}.
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      {/* A ordem aqui define a ordem dos botões na barra inferior. */}
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Missoes" component={MissionsScreen} />
      <Tab.Screen name="Pegada" component={FootprintScreen} />
      <Tab.Screen name="Yvy" component={YvyScreen} />
      <Tab.Screen name="Comunidade" component={CommunityScreen} />
      <Tab.Screen name="Ajustes" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
