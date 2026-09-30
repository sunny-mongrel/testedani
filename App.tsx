/**
 * COMPONENTE RAIZ DO APLICATIVO (Ecoara).
 *
 * O Ecoara é um app educativo gamificado de sustentabilidade: o usuário descobre sua
 * pegada ecológica por um questionário, cumpre missões do dia a dia, ganha
 * pontos de impacto e sobe de nível.
 *
 * MAPA DO PROJETO (pasta src/):
 *   routes/      -> quais telas existem e como navegar entre elas (pilha)
 *   navigation/  -> as abas da parte principal do app (barra inferior)
 *   screens/     -> as telas: Onboarding, Questionario, Resultado e as
 *                   seis abas em screens/main/
 *   components/  -> peças de interface reutilizáveis (botão, cartão, anel...)
 *   context/     -> estado global (pontos, nível, missões concluídas)
 *   data/        -> conteúdo fixo: as perguntas e as missões
 *   theme/       -> cores, raios de borda, degradês e fontes
 *
 * FLUXO DO USUÁRIO:
 *   Onboarding -> Questionario -> Resultado -> MainApp (abas)
 *
 * Este arquivo monta tudo que precisa envolver todas as
 * telas. A ordem dos provedores importa, porque cada um
 * disponibiliza informações para os componentes que estão dentro dele.
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';
import StackRoutes from './src/routes/stack.routes';
import { AppProvider } from './src/context/AppContext';
import { useEcoaraFonts } from './src/theme/fonts';
import { colors } from './src/theme/colors';

export default function App() {
  // Carrega as fontes do Google (Nunito e Baloo 2) de forma assíncrona.
  // Retorna false enquanto os arquivos ainda estão sendo baixados/lidos.
  const fontsLoaded = useEcoaraFonts();

  // Enquanto as fontes não carregam, exibimos apenas uma tela em branco.
  // Isso evita o "flash" de texto com a fonte errada (o sistema renderizaria
  // com a fonte padrão e depois trocaria, causando um piscar errado).
  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  return (
    // 1) GestureHandlerRootView: necessário para gestos (deslizar, arrastar).
    //    Exigência da biblioteca react-native-gesture-handler, que a navegação usa.
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* 2) SafeAreaProvider: calcula as áreas seguras da tela (notch, barra
          de status, barra de gestos). Sem ele, o hook useSafeAreaInsets e o
          componente SafeAreaView não funcionam. */}
      <SafeAreaProvider>
        {/* 3) AppProvider: nosso estado global (resultado do questionário,
            missões concluídas, pontos e nível). Precisa envolver a navegação
            para que qualquer tela consiga ler e alterar esses dados. */}
        <AppProvider>
          {/* 4) NavigationContainer: gerencia o histórico de navegação. */}
          <NavigationContainer>
            {/* 5) StackRoutes: define quais telas existem e qual é a inicial. */}
            <StackRoutes />
          </NavigationContainer>
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
