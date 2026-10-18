/*
 * TELA: ONBOARDING (boas-vindas, yvy, a primeira tela do app).
 *
 * Apresenta o Ecoara e explica o que é a pegada ecológica, com a mascote,
 * e leva o usuário ao questionário pelo botão "COMEÇAR".
 * Não tem estado nem lógica, só conteúdo e navegação.
 *
 * A tela NÃO rola: tudo cabe na altura do aparelho. O planeta e a mascote
 * têm tamanho proporcional à altura da tela, e a mascote fica ao lado do
 * planeta (e não embaixo do balão) para economizar espaço vertical.
 */
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../routes/routes.types';
import { colors, gradients, radius } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAppContext } from '../context/AppContext';

// Tipo das props que o React Navigation entrega a esta tela (`navigation` e
// `route`), já conferido com a lista de rotas de routes.types.ts.
type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

export default function Onboarding({ navigation }: Props) {
  // Quem já está logada não precisa do atalho "Já tenho conta".
  const { usuario } = useAppContext();

  // Altura da tela: planeta e mascote encolhem em aparelhos baixos (planeta
  // entre 84 e 150 px; mascote com 85% do tamanho do planeta), garantindo
  // que tudo caiba sem rolar.
  const { height: alturaTela } = useWindowDimensions();
  const tamanhoTerra = Math.max(84, Math.min(150, Math.round(alturaTela * 0.15)));
  const tamanhoMascote = Math.round(tamanhoTerra * 0.85);

  return (
    // O `as unknown as [...]` é so um ajuste de tipagem: o LinearGradient
    // exige uma tupla com pelo menos duas cores, e nosso array vem marcado
    // como somente-leitura (as const). Não muda nada em tempo de execução.
    <LinearGradient colors={gradients.hero as unknown as [string, string, ...string[]]} style={styles.flex}>
      <SafeAreaView style={styles.flex} edges={['top', 'bottom']}>
        {/* View comum (sem ScrollView): o conteúdo ocupa a tela inteira. */}
        <View style={styles.conteudo}>
          <Text style={styles.marca}>Ecoara</Text>
          <Text style={styles.titulo}>Sua jornada rumo a um planeta mais sustentável</Text>

          {/* Área de destaque: planeta, mascote e balão de fala. flex: 1 faz
              esta área ocupar o espaço que sobra entre o título e o cartão. */}
          <View style={styles.heroArea}>
            {/* Linha do planeta: o planeta fica no centro e a mascote é
                posicionada (position: absolute) ao lado dele, na direita,
                com a base alinhada à base do planeta. */}
            <View style={styles.terraLinha}>
              <View
                style={[
                  styles.terraCirculo,
                  { width: tamanhoTerra, height: tamanhoTerra, borderRadius: tamanhoTerra / 2 },
                ]}
              >
                <Ionicons name="earth" size={Math.round(tamanhoTerra * 0.55)} color={colors.white} />
              </View>

              {/* Imagem da mascote, recortada em círculo pelo estilo do wrapper.
                  accessibilityLabel é lido por leitores de tela */}
              <View
                style={[
                  styles.mascoteWrapper,
                  { width: tamanhoMascote, height: tamanhoMascote, borderRadius: tamanhoMascote / 2 },
                ]}
              >
                <Image
                  source={require('../../assets/yvy-mascot.png')}
                  accessibilityLabel="Yvy, a ararinha-azul mascote do Ecoara, acenando"
                  style={styles.mascoteImagem}
                  resizeMode="cover"
                />
              </View>
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

            {/* Quem já tem conta entra por aqui e recupera a pontuação salva,
                sem refazer o questionário. */}
            {!usuario && (
              <TouchableOpacity
                style={styles.jaTenhoConta}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('Cadastro', { origem: 'onboarding' })}
              >
                <Text style={styles.jaTenhoContaTexto}>Já tenho conta? Entrar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

// Estilos: cada chave vira um estilo usado no JSX acima 
// StyleSheet.create apenas valida e otimiza os objetos de estilo.
const styles = StyleSheet.create({
  flex: { flex: 1 },
  conteudo: { flex: 1, paddingBottom: 12 },
  marca: {
    fontFamily: fonts.displayExtraBold,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginTop: 8,
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
  // flex: 1 + justifyContent: 'center' centraliza o planeta e o balão no
  // espaço livre entre o título e o cartão.
  heroArea: {
    flex: 1,
    marginTop: 8,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Linha que ocupa toda a largura; a mascote é absoluta em relação a ela.
  terraLinha: { alignSelf: 'stretch', alignItems: 'center' },
  // Largura, altura e raio do planeta são definidos no JSX (proporcionais à tela).
  terraCirculo: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balao: {
    // marginTop positivo deixa espaço para o rabicho (que aponta para a mascote).
    marginTop: 14,
    alignSelf: 'center',
    maxWidth: '100%',
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: 12,
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
  // posicionado meio para fora da caixa (em cima, apontando para a mascote),
  // formando a pontinha triangular.
  balaoRabicho: {
    position: 'absolute',
    top: -9,
    right: 40,
    width: 18,
    height: 18,
    backgroundColor: colors.white,
    transform: [{ rotate: '45deg' }],
  },
  // Posição: colada na direita e na base da linha do planeta; o tamanho é
  // definido no JSX.
  mascoteWrapper: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.6)',
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  mascoteImagem: { width: '100%', height: '100%' },
  cartao: {
    marginTop: 8,
    marginHorizontal: 20,
    backgroundColor: colors.background,
    borderRadius: radius.xxl,
    padding: 18,
  },
  cartaoTitulo: {
    fontFamily: fonts.display,
    fontSize: 18,
    fontWeight: '700',
    color: colors.leafDeep,
    marginBottom: 8,
  },
  paragrafo: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    color: colors.cardForeground,
    marginBottom: 8,
  },
  botao: { marginTop: 6 },
  jaTenhoConta: { marginTop: 8, alignItems: 'center', paddingVertical: 4 },
  jaTenhoContaTexto: { fontFamily: fonts.sansBold, fontSize: 14, fontWeight: '700', color: colors.leafDeep },
});
