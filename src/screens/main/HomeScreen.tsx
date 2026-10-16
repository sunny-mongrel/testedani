/**
 * TELA: HOME (aba "Início").
 *
 * Primeira aba do app. Mostra:
 *  - um topo em degradê com saudação e um ícone de folha, além do botão de
 *    perfil (canto superior direito), que abre a tela de Cadastro;
 *  - o cartão "Missão diária": uma missão sorteada a cada abertura do app
 *    (leva à tela Missões);
 *  - uma grade com atalhos (Missões e Pegada ecológica, que não aparecem na
 *    barra inferior) e o anel de nível do usuário, com o texto
 *    "X / Y XP" (XP já juntado no nível / XP necessário para subir).
 *
 * A tela NÃO rola: tudo cabe na altura do aparelho. O topo em degradê ocupa
 * o espaço que sobra (e o círculo do mascote encolhe em telas baixas); o
 * restante tem altura natural.
 * Nível, XP e a missão diária vêm do estado global (AppContext); esta tela só exibe.
 */
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, gradients, radius } from '../../theme/colors';
import { fonts } from '../../theme/fonts';
import { LevelRing } from '../../components/LevelRing';
import { ActionTile } from '../../components/ActionTile';
import { useAppContext } from '../../context/AppContext';
import type { MainTabParamList, RootStackParamList } from '../../routes/routes.types';

// Tipo do objeto `navigation` desta tela: navegação entre as abas, combinada
// com a da pilha principal (necessária para abrir a tela Cadastro).
type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

export default function HomeScreen() {
  // useNavigation em vez de receber `navigation` por prop: como esta tela é
  // renderizada pelo navegador de abas, é mais simples pegar pelo hook.
  const navigation = useNavigation<Nav>();

  // Dados do estado global: nível, progresso e XP alimentam o anel;
  // `missaoDoDia` é a missão sorteada ao abrir o app; `missoesConcluidas`
  // permite marcar o cartão quando essa missão já foi feita.
  const { nivel, progressoNivel, xpNoNivel, xpNecessario, missaoDoDia, missoesConcluidas } =
    useAppContext();

  // Altura da tela: usada para o círculo do mascote encolher em aparelhos
  // baixos (entre 90 e 150 px), garantindo que tudo caiba sem rolar.
  const { height: alturaTela } = useWindowDimensions();
  const tamanhoMascote = Math.max(90, Math.min(150, Math.round(alturaTela * 0.17)));
  const tamanhoFolha = Math.round(tamanhoMascote * 0.48);

  // Texto sob o anel: "35 / 45 XP". No nível máximo não há próximo nível.
  const textoXp = xpNecessario > 0 ? `${xpNoNivel} / ${xpNecessario} XP` : 'Nível máximo';
  const missaoConcluida = !!missoesConcluidas[missaoDoDia.id];

  return (
    <View style={styles.flex}>
      {/* flex: 1 faz o degradê ocupar toda a altura que sobra acima do corpo. */}
      <LinearGradient colors={gradients.hero as unknown as [string, string, ...string[]]} style={styles.hero}>
        <SafeAreaView edges={['top']} style={styles.heroConteudo}>
          {/* O menu abre o Drawer; o botão de perfil abre a tela de Cadastro. */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.headerButton}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Abrir menu"
              onPress={() => navigation.getParent()?.dispatch(DrawerActions.openDrawer())}
            >
              <Ionicons name="menu-outline" size={20} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerButton}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Cadastro')}
              accessibilityLabel="Abrir cadastro"
            >
              <Ionicons name="person-circle-outline" size={20} color={colors.white} />
            </TouchableOpacity>
          </View>

          <Text style={styles.titulo}>Bem-vindo(a) ao Ecoara!</Text>

          {/* O círculo fica no espaço que sobra e tem tamanho proporcional à tela. */}
          <View style={styles.mascoteArea}>
            <View
              style={[
                styles.mascoteCirculo,
                { width: tamanhoMascote, height: tamanhoMascote, borderRadius: tamanhoMascote / 2 },
              ]}
            >
              {/* Caixa quadrada do tamanho exato do ícone, com lineHeight igual
                  à altura e sem padding extra de fonte: é isso que deixa a folha
                  no centro exato do círculo (o glifo tem espaço vertical extra). */}
              <Ionicons
                name="leaf"
                size={tamanhoFolha}
                color={colors.white}
                style={[
                  styles.folha,
                  { width: tamanhoFolha, height: tamanhoFolha, lineHeight: tamanhoFolha },
                ]}
              />
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <View style={styles.corpo}>
        {/* Cartão "Missão diária": ao tocar, abre a tela Missões. */}
        <TouchableOpacity
          style={styles.missaoDiaria}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Missoes')}
        >
          <View style={styles.missaoTexto}>
            <Text style={styles.missaoTitulo}>Missão diária</Text>
            {/* Missão sorteada ao abrir o app (veja sortearMissao em
                data/Missoes.ts). Mostra nome e pontos; se já foi feita,
                ganha um "✓". O texto aparece inteiro (sem cortar). */}
            <Text style={styles.missaoNome}>
              {missaoConcluida ? '✓ ' : ''}
              {missaoDoDia.titulo} · +{missaoDoDia.pontos} pts
            </Text>
            <Text style={styles.missaoDescricao}>{missaoDoDia.frase}</Text>
          </View>
          <View style={styles.missaoSeta}>
            <Ionicons name="chevron-forward" size={20} color={colors.white} />
          </View>
        </TouchableOpacity>

        {/* Grade de 3 colunas: atalho Missões | anel de nível | atalho Pegada. */}
        <View style={styles.grid}>
          <ActionTile
            label="Missões"
            icon="clipboard-outline"
            onPress={() => navigation.navigate('Missoes')}
          />
          <TouchableOpacity
            style={styles.gridCentro}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Missoes')}
          >
            {/* O anel só exibe: quem calcula nível e XP é o AppContext.
                O texto abaixo mostra quanto XP já foi juntado e quanto o
                nível exige para subir (ex.: "35 / 45 XP"). */}
            <LevelRing level={nivel} progress={progressoNivel} label={textoXp} />
          </TouchableOpacity>
          <ActionTile
            label="Pegada ecológica"
            icon="footsteps-outline"
            onPress={() => navigation.navigate('Pegada')}
          />
        </View>
      </View>
    </View>
  );
}

// Estilos: cada chave vira um estilo usado no JSX acima (ex.: `style={styles.card}`).
// StyleSheet.create apenas valida e otimiza os objetos de estilo.
const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  // flex: 1: o degradê ocupa o espaço que sobra, empurrando o corpo para baixo.
  hero: { flex: 1, paddingBottom: 28 },
  heroConteudo: { flex: 1 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    fontFamily: fonts.display,
    fontSize: 22,
    fontWeight: '800',
    color: colors.white,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  // flex: 1 centraliza o círculo no espaço livre do topo (tamanho definido no JSX).
  mascoteArea: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  mascoteCirculo: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Largura, altura e lineHeight da folha são definidos no JSX (acompanham o círculo).
  folha: {
    textAlign: 'center',
    includeFontPadding: false,
  },
  corpo: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xxxl,
    borderTopRightRadius: radius.xxxl,
    // marginTop negativa puxa o bloco branco para cima, sobrepondo o degradê.
    // É isso que cria o efeito de "folha arredondada por cima do cabeçalho".
    marginTop: -20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  missaoDiaria: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: 'rgba(46,204,113,0.35)',
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: 16,
  },
  missaoTexto: { flex: 1 },
  missaoTitulo: {
    fontFamily: fonts.display,
    fontSize: 15,
    fontWeight: '700',
    color: colors.leafDeep,
  },
  missaoNome: {
    fontFamily: fonts.sansBold,
    fontSize: 14,
    fontWeight: '700',
    color: colors.cardForeground,
    marginTop: 4,
  },
  missaoDescricao: {
    fontFamily: fonts.sans,
    fontSize: 13,
    lineHeight: 18,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  missaoSeta: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.leaf,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    // 3 colunas de largura igual (flex: 1 em cada filho) e centralizadas
    // na vertical em relação umas às outras.
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
  },
  gridCentro: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
