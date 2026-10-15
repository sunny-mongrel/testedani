/**
 * TELA: PEGADA ECOLÓGICA (não aparece na barra inferior; aberta pela Home).
 *
 * Mostra o último resultado do questionário (pontuação e classificação) ou,
 * se o usuário ainda não respondeu, um convite para fazê-lo. Nos dois casos
 * há um botão que abre o Questionario.
 * O resultado vem do estado global (AppContext), gravado pela tela Resultado.
 */
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GradientHeader } from '../../components/GradientHeader';
import { PrimaryButton } from '../../components/PrimaryButton';
import { colors, gradients, radius } from '../../theme/colors';
import { fonts } from '../../theme/fonts';
import { useAppContext } from '../../context/AppContext';
import type { MainTabParamList, RootStackParamList } from '../../routes/routes.types';

// CompositeNavigationProp combina DOIS navegadores. Esta tela vive nas abas,
// mas precisa navegar para 'Questionario', que está na pilha externa. Sem essa
// combinação, o TypeScript reclamaria que 'Questionario' não existe nas abas.
type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

export default function FootprintScreen() {
  const navigation = useNavigation<Nav>();
  // `resultado` é null enquanto o questionário não for respondido.
  const { resultado } = useAppContext();

  return (
    <SafeAreaView style={styles.flex} edges={['top']}>
      <GradientHeader title="Pegada ecológica" icon="footsteps-outline" colorsSet={gradients.blue} />

      <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
        {/* Renderização condicional: dois cartões diferentes conforme o
            usuário já ter ou não uma pontuação registrada. */}
        {resultado ? (
          <View style={styles.cartao}>
            <Text style={styles.rotulo}>Sua última pontuação</Text>
            <Text style={styles.pontuacao}>{resultado.pontuacao}</Text>
            <Text style={styles.classificacao}>{resultado.classificacao}</Text>

            <PrimaryButton
              label="Refazer o questionário"
              variant="secondary"
              onPress={() => navigation.navigate('Questionario')}
              style={styles.botao}
            />
          </View>
        ) : (
          <View style={styles.cartao}>
            <Text style={styles.rotulo}>Você ainda não calculou sua pegada</Text>
            <Text style={styles.textoVazio}>
              Responda ao questionário inicial para descobrir o impacto ambiental dos seus
              hábitos atuais.
            </Text>
            <PrimaryButton
              label="Fazer o questionário"
              onPress={() => navigation.navigate('Questionario')}
              style={styles.botao}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Estilos: cada chave vira um estilo usado no JSX acima (ex.: `style={styles.card}`).
// StyleSheet.create apenas valida e otimiza os objetos de estilo.
const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  conteudo: { padding: 20 },
  cartao: {
    backgroundColor: colors.card,
    borderRadius: radius.xxl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 24,
    alignItems: 'center',
  },
  rotulo: {
    fontFamily: fonts.sansBold,
    fontSize: 13,
    fontWeight: '700',
    color: colors.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  pontuacao: {
    fontFamily: fonts.displayExtraBold,
    fontSize: 44,
    fontWeight: '800',
    color: colors.macaw,
    marginTop: 8,
  },
  classificacao: {
    fontFamily: fonts.display,
    fontSize: 17,
    fontWeight: '700',
    color: colors.cardForeground,
    textAlign: 'center',
    marginTop: 8,
  },
  textoVazio: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    color: colors.cardForeground,
    textAlign: 'center',
    marginTop: 10,
  },
  botao: { marginTop: 20, alignSelf: 'stretch' },
});
