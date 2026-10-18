/*
 * PILHA PRINCIPAL DE NAVEGAÇÃO.
 *
 * Fluxo: Onboarding -> Questionario -> Resultado -> MainApp (Drawer e abas).
 * Cadastro é aberta a partir das abas (Home e Ajustes) e entra por cima delas.
 * "Pilha" (stack) significa que cada tela nova entra por cima da anterior, e o
 * botão voltar desempilha. O tipo genérico <RootStackParamList> faz o
 * TypeScript conferir os nomes das telas e os parâmetros de cada uma.
 *
 * Este componente é renderizado em App.tsx, dentro do NavigationContainer.
 */
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Onboarding from '../screens/Onboarding';
import Questionario from '../screens/Questionario';
import Resultado from '../screens/Resultado';
import Cadastro from '../screens/Cadastro';
import MainDrawer from '../navigation/MainDrawer';
import { RootStackParamList } from './routes.types';
import { useAppContext } from '../context/AppContext';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackRoutes() {
  const { carregandoInicio, usuario, resultado } = useAppContext();

  // Enquanto o app confere se há login salvo e carrega a pontuação (SQLite),
  // mostramos um carregamento. Assim a tela inicial já nasce certa.
  if (carregandoInicio) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.leafDeep} />
      </View>
    );
  }

  // Tela inicial: com login e pontuação salva, vai direto para o app;
  // caso contrário, boas-vindas -> questionário. (Só vale na primeira vez que
  // o navegador aparece; depois disso o React Navigation ignora este valor.)
  const rotaInicial: keyof RootStackParamList = usuario && resultado ? 'MainApp' : 'Onboarding';

  return (
    // initialRouteName: primeira tela exibida ao abrir o app.
    // headerShown: false esconde o cabeçalho padrão do React Navigation,
    // já que cada tela desenha o próprio cabeçalho (GradientHeader).
    <Stack.Navigator initialRouteName={rotaInicial} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="Questionario" component={Questionario} />
      <Stack.Screen name="Resultado" component={Resultado} />
      {/* MainApp contém o Drawer, que inclui as abas e as páginas informativas. */}
      <Stack.Screen name="MainApp" component={MainDrawer} />
      {/* Cadastro fica na pilha (e não nas abas) para abrir em tela cheia,
          sem a barra inferior, e voltar com o botão de voltar. */}
      <Stack.Screen name="Cadastro" component={Cadastro} />
    </Stack.Navigator>
  );
}
