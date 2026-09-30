/*
 * TELA: ONBOARDING (boas-vindas, yvy, a primeira tela do app).
 *
 * Apresenta o Ecoara e explica o que é a pegada ecológica, com a mascote,
 * e leva o usuário ao questionário pelo botão "COMEÇAR".
 * Não tem estado nem lógica, só conteúdo e navegação.
 */
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../routes/routes.types';
import { colors, gradients, radius } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { PrimaryButton } from '../components/PrimaryButton';

// Tipo das props que o React Navigation entrega a esta tela (`navigation` e
// `route`), já conferido com a lista de rotas de routes.types.ts.
type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

export default function Onboarding({ navigation }: Props) {
  return (
    // O `as unknown as [...]` é so um ajuste de tipagem: o LinearGradient
    // exige uma tupla com pelo menos duas cores, e nosso array vem marcado
    // como somente-leitura (as const). Não muda nada em tempo de execução.
    <LinearGradient colors={gradients.hero as unknown as [string, string, ...string[]]} style={styles.flex}>
      <SafeAreaView style={styles.flex} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.marca}>Ecoara</Text>
          <Text style={styles.titulo}>Sua jornada rumo a um planeta mais sustentável</Text>

          {/* Área de destaque: planeta, balão de fala e mascote sobrepostos. */}
          <View style={styles.heroArea}>
            <View style={styles.terraCirculo}>
              <Ionicons name="earth" size={92} color={colors.white} />
            </View>

            {/* Balão de fala da Yvy explicando o que é a pegada ecológica. */}
            <View style={styles.balao}>
              <Text style={styles.balaoTitulo}>Olá! Descubra sua Pegada Ecológica</Text>
              <Text style={styles.balaoTexto}>
                A pegada ecológica mede o quanto os seus hábitos de consumo, alimentação,
                transporte e energia pesam sobre os recursos do planeta. Quanto menor a pegada,
                menor o impacto ambiental da sua rotina.
              </Text>
              <View style={styles.balaoRabicho} />
            </View>

            {/* Imagem da mascote, recortada em círculo pelo estilo do wrapper.
                accessibilityLabel é lido por leitores de tela */}
            <View style={styles.mascoteWrapper}>
              <Image
                source={require('../../assets/yvy-mascot.png')}
                accessibilityLabel="Yvy, a ararinha-azul mascote do Ecoara, acenando"
                style={styles.mascoteImagem}
                resizeMode="cover"
              />
            </View>
          </View>

          <View style={styles.cartao}>
            <Text style={styles.cartaoTitulo}>O Ecoara é o seu companheiro na jornada sustentável</Text>
            <Text style={styles.paragrafo}>
              Aqui você acompanha sua pegada ecológica, cumpre missões do dia a dia e evolui de
              nível junto com a Yvy, nossa ararinha-azul mascote.
            </Text>
            <Text style={styles.paragrafo}>
              Antes de começar, vamos fazer um rápido questionário para entender seus hábitos
              atuais e te mostrar por onde começar.
            </Text>

            <PrimaryButton
              label="COMEÇAR"
              // Navigate (e não reset) para o usuário conseguir voltar.
              onPress={() => navigation.navigate('Questionario')}
              style={styles.botao}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// Estilos: cada chave vira um estilo usado no JSX acima 
// StyleSheet.create apenas valida e otimiza os objetos de estilo.
const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flexGrow: 1, paddingBottom: 24 },
  marca: {
    fontFamily: fonts.displayExtraBold,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginTop: 16,
  },
  titulo: {
    fontFamily: fonts.display,
    fontSize: 22,
    fontWeight: '800',
    color: colors.white,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 28,
    lineHeight: 28,
  },
  heroArea: {
    marginTop: 28,
    marginBottom: 8,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  terraCirculo: {
    width: 168,
    height: 168,
    borderRadius: 84,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balao: {
    alignSelf: 'flex-start',
    marginTop: -18,
    marginLeft: 4,
    maxWidth: '86%',
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  balaoTitulo: {
    fontFamily: fonts.display,
    fontSize: 15,
    fontWeight: '700',
    color: colors.leafDeep,
    marginBottom: 6,
  },
  balaoTexto: {
    fontFamily: fonts.sans,
    fontSize: 13,
    lineHeight: 19,
    color: colors.cardForeground,
  },
  // "Rabicho" do balão de fala: um quadrado branco girado 45 graus e
  // posicionado meio para fora da caixa, formando a pontinha triangular.
  balaoRabicho: {
    position: 'absolute',
    bottom: -9,
    right: 36,
    width: 18,
    height: 18,
    backgroundColor: colors.white,
    transform: [{ rotate: '45deg' }],
  },
  mascoteWrapper: {
    alignSelf: 'flex-end',
    marginTop: -12,
    marginRight: 12,
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.6)',
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  mascoteImagem: { width: '100%', height: '100%' },
  cartao: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: colors.background,
    borderRadius: radius.xxl,
    padding: 24,
  },
  cartaoTitulo: {
    fontFamily: fonts.display,
    fontSize: 18,
    fontWeight: '700',
    color: colors.leafDeep,
    marginBottom: 12,
  },
  paragrafo: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    color: colors.cardForeground,
    marginBottom: 12,
  },
  botao: { marginTop: 12 },
});
