/*
 * TELA: RESULTADO DO QUESTIONÁRIO.
 *
 * Recebe a pontuação calculada em Questionario, mostra a nota e um
 * diagnóstico (quantas "Terras" seriam necessárias) e salva o resultado no
 * estado global (AppContext) para a Home e a aba Pegada exibirem depois.
 * O botão final leva o usuário para as abas do app (MainApp).
 */
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../routes/routes.types';
import { colors, gradients, radius } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAppContext } from '../context/AppContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Resultado'>;

/**
 * Trecho de texto do diagnóstico. `destaque: true` deixa o trecho em negrito e
 * maior, como nas frases de impacto do material de referência.
 * O diagnóstico é uma lista de trechos para que só parte da frase fique em destaque.
 */
type Trecho = { t: string; destaque?: boolean };

/**
 * TRADUZ A PONTUAÇÃO EM UM DIAGNÓSTICO.
 *
 * A pontuação vem da soma dos pesos das respostas do questionário: quanto maior
 * o número, pior o impacto ambiental dos hábitos do usuário.
 *
 * Cada faixa devolve:
 *  - texto: título curto (também salvo no estado global e exibido na Home);
 *  - faixa: rótulo da faixa de pontos;
 *  - terras: quantas "Terras" seriam necessárias (1 a 4), exibidas como planetas;
 *  - trechos: texto completo do diagnóstico, com as partes em destaque.
 *
 * As faixas são verificadas em ordem crescente. Como cada `if` que dá certo
 * já retorna, basta testar o limite de cima.
 * Faixas: até 23 / 24 a 44 / 45 a 66 / 67 ou mais.
 */
function getClassificacao(pontuacao: number): {
  texto: string;
  faixa: string;
  terras: number;
  trechos: Trecho[];
} {
  if (pontuacao <= 23) {
    return {
      texto: 'Parabéns! Seu estilo de vida é sustentável.',
      faixa: 'até 23',
      terras: 1,
      trechos: [
        { t: 'Se a sua pegada ecológica ficou nesta faixa, ' },
        { t: 'parabéns!', destaque: true },
        {
          t: ' Seu estilo de vida leva em conta a saúde do planeta! Você sabe equilibrar o uso dos recursos com sabedoria. Que tal mobilizar mais pessoas e partilhar sua experiência? Você pode ajudar outras pessoas a encontrar um padrão mais justo e sustentável também!',
        },
      ],
    };
  }

  if (pontuacao <= 44) {
    return {
      texto: 'Você pode melhorar alguns hábitos.',
      faixa: 'de 24 a 44',
      terras: 2,
      trechos: [
        { t: 'Sua pegada está um pouco acima da capacidade do planeta. ' },
        { t: 'Vale a pena reavaliar algumas opções', destaque: true },
        {
          t: ' do seu cotidiano. Algumas mudanças e ajustes podem levá-lo a um estilo de vida mais sustentável, que traga menos impactos à Natureza. Se você se juntar a outras pessoas pode ser mais fácil!',
        },
      ],
    };
  }

  if (pontuacao <= 66) {
    return {
      texto: 'Seu estilo está impactando o planeta.',
      faixa: 'de 45 a 66',
      terras: 3,
      trechos: [
        { t: 'Se todos no planeta tivessem um estilo de vida como o seu, ' },
        { t: 'seriam necessárias três Terras.', destaque: true },
        { t: ' ' },
        { t: 'Neste ritmo o planeta não vai agüentar!', destaque: true },
        {
          t: ' Que tal fazer uma reavaliação dos seus hábitos cotidianos hoje mesmo? Dê uma olhada nas sugestões de como diminuir sua pegada e mobilizar mais pessoas!',
        },
      ],
    };
  }

  // Última faixa: qualquer valor acima de 66 (de 67 a 88).
  return {
    texto: 'Alerta total! Mudanças urgentes necessárias.',
    faixa: 'de 67 a 88',
    terras: 4,
    trechos: [
      { t: 'Alerta total!', destaque: true },
      { t: ' Sua pegada está entre os padrões mais insustentáveis do mundo! ' },
      { t: 'É URGENTE reavaliar seu jeito de viver.', destaque: true },
      {
        t: ' Seu padrão de consumo e hábitos de vida estão causando danos à vida na Terra e ameaçando o futuro. Mas não desanime, nunca é tarde para começar a mudar. Veja as sugestões de como diminuir a pegada na próxima sessão! Junte-se a outras pessoas!',
      },
    ],
  };
}

export default function Resultado({ route, navigation }: Props) {
  // A pontuação chega como parâmetro de navegação, enviado pela tela Questionario.
  const { pontuacao } = route.params;
  const { definirResultado } = useAppContext();

  // Converte o número em texto explicativo.
  const classificacao = getClassificacao(pontuacao);

  // Salva o resultado no estado global assim que a tela abre, para que a aba
  // "Pegada" e a Home consigam exibir esses dados depois.
  // Isso fica dentro de useEffect (e não solto no corpo do componente) porque
  // alterar estado durante a renderização causaria um loop infinito de re-render.
  // O array [pontuacao] no final faz o efeito rodar só quando a pontuação muda.
  useEffect(() => {
    definirResultado({ pontuacao, classificacao: classificacao.texto });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pontuacao]);

  return (
    <LinearGradient colors={gradients.hero as unknown as [string, string, ...string[]]} style={styles.flex}>
      <SafeAreaView style={styles.flex} edges={['top', 'bottom']}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.conteudo}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.rotulo}>Sua pontuação</Text>
          <View style={styles.pontuacaoCirculo}>
            <Text style={styles.pontuacaoNumero}>{pontuacao}</Text>
          </View>

          <View style={styles.cartao}>
            {/* Faixa de pontos + um planeta para cada "Terra" necessária.
                Array.from({ length: n }) cria uma lista de n itens só para
                repetir o ícone n vezes. */}
            <View style={styles.faixaLinha}>
              <Text style={styles.faixa}>{classificacao.faixa}</Text>
              <View style={styles.terras}>
                {Array.from({ length: classificacao.terras }).map((_, i) => (
                  <Ionicons key={i} name="earth" size={26} color={colors.macaw} />
                ))}
              </View>
            </View>

            {/* Um <Text> dentro de outro <Text> permite estilizar só um trecho
                da frase (os trechos marcados com `destaque`). */}
            <Text style={styles.detalhe}>
              {classificacao.trechos.map((trecho, i) => (
                <Text key={i} style={trecho.destaque ? styles.destaque : undefined}>
                  {trecho.t}
                </Text>
              ))}
            </Text>
          </View>
        </ScrollView>

        <View style={styles.rodape}>
          <PrimaryButton
            label="Ir para o aplicativo"
            // reset (em vez de navigate) apaga o histórico de navegação e deixa
            // apenas a tela MainApp na pilha. Assim o usuário não consegue voltar
            // para o onboarding/questionário com o botão de voltar do celular.
            onPress={() =>
              navigation.reset({ index: 0, routes: [{ name: 'MainApp' }] })
            }
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

// Estilos: cada chave vira um estilo usado no JSX acima
// StyleSheet.create apenas valida e otimiza os objetos de estilo.
const styles = StyleSheet.create({
  flex: { flex: 1 },
  conteudo: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  rotulo: {
    fontFamily: fonts.sansBold,
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  pontuacaoCirculo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  pontuacaoNumero: {
    fontFamily: fonts.displayExtraBold,
    fontSize: 44,
    fontWeight: '800',
    color: colors.white,
  },
  cartao: {
    backgroundColor: colors.background,
    borderRadius: radius.xxl,
    padding: 22,
    width: '100%',
  },
  faixaLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  faixa: {
    fontFamily: fonts.displayExtraBold,
    fontSize: 18,
    fontWeight: '800',
    color: colors.leafDeep,
  },
  terras: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 4, maxWidth: 120 },
  detalhe: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 23,
    fontStyle: 'italic',
    color: colors.cardForeground,
  },
  // Frases de impacto: negrito, maior e em verde escuro.
  destaque: {
    fontFamily: fonts.displayExtraBold,
    fontSize: 17,
    fontWeight: '800',
    fontStyle: 'normal',
    color: colors.leafDeep,
  },
  rodape: { paddingHorizontal: 24, paddingBottom: 20 },
});
