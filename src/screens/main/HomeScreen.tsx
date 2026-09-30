/**
 * TELA: HOME (aba "Início").
 *
 * Primeira aba do app. Mostra:
 *  - um topo em degradê com saudação e um ícone de folha;
 *  - o cartão "Missão diária" (leva à aba Missões);
 *  - uma grade com atalhos e o anel de nível/progresso do usuário.
 *
 * Nível e progresso vêm do estado global (AppContext); esta tela só exibe.
 */
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { colors, gradients, radius } from '../../theme/colors';
import { fonts } from '../../theme/fonts';
import { LevelRing } from '../../components/LevelRing';
import { ActionTile } from '../../components/ActionTile';
import { useAppContext } from '../../context/AppContext';
import type { MainTabParamList } from '../../routes/routes.types';

// Tipo do objeto `navigation` desta tela: navegação entre as abas.
type Nav = BottomTabNavigationProp<MainTabParamList>;

export default function HomeScreen() {
  // useNavigation em vez de receber `navigation` por prop: como esta tela é
  // renderizada pelo navegador de abas, é mais simples pegar pelo hook.
  const navigation = useNavigation<Nav>();

  // Dados do estado global: nível e progresso alimentam o anel; `resultado`
  // define qual texto aparece no cartão de missão diária.
  const { nivel, progressoNivel, resultado } = useAppContext();

  return (
    <View style={styles.flex}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={gradients.hero as unknown as [string, string, ...string[]]} style={styles.hero}>
          <SafeAreaView edges={['top']}>
            {/* Botões do topo (menu e perfil). Ainda são apenas visuais: não
                têm onPress, então tocar neles não faz nada por enquanto. */}
            <View style={styles.headerRow}>
              <TouchableOpacity style={styles.headerButton} activeOpacity={0.8}>
                <Ionicons name="menu-outline" size={20} color={colors.white} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton} activeOpacity={0.8}>
                <Ionicons name="person-circle-outline" size={20} color={colors.white} />
              </TouchableOpacity>
            </View>

            <Text style={styles.titulo}>Bem-vindo(a) ao Ecoara!</Text>

            <View style={styles.mascoteArea}>
              <View style={styles.mascoteCirculo}>
                {/* Caixa quadrada do tamanho exato do ícone, com lineHeight igual
                    à altura e sem padding extra de fonte: é isso que deixa a folha
                    no centro exato do círculo (o glifo tem espaço vertical extra). */}
                <Ionicons
                  name="leaf"
                  size={72}
                  color={colors.white}
                  style={styles.folha}
                />
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <View style={styles.corpo}>
          {/* Cartão "Missão diária": ao tocar, abre a aba Missões. */}
          <TouchableOpacity
            style={styles.missaoDiaria}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Missoes')}
          >
            <View style={styles.missaoTexto}>
              <Text style={styles.missaoTitulo}>Missão diária</Text>
              {/* Se o usuário já fez o questionário, mostramos a classificação
                  dele; senão, um texto genérico de incentivo. O texto é fixo:
                  a Home ainda não sorteia uma missão de verdade (veja
                  obterMissaoDoDia em data/Missoes.ts, hoje sem uso). */}
              <Text style={styles.missaoDescricao} numberOfLines={2}>
                {resultado
                  ? `Sua pegada ecológica foi classificada como: "${resultado.classificacao}". Explore as missões para melhorar seu impacto.`
                  : 'Siga o Sustentável: um dos primeiros passos para a mudança é a informação. Comece seguindo perfis voltados ao meio ambiente.'}
              </Text>
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
              {/* O anel só exibe: quem calcula nível e progresso é o AppContext. */}
              <LevelRing level={nivel} progress={progressoNivel} label="Seu progresso" />
            </TouchableOpacity>
            <ActionTile
              label="Pegada ecológica"
              icon="footsteps-outline"
              onPress={() => navigation.navigate('Pegada')}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// Estilos: cada chave vira um estilo usado no JSX acima (ex.: `style={styles.card}`).
// StyleSheet.create apenas valida e otimiza os objetos de estilo.
const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  hero: { paddingBottom: 28 },
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
  mascoteArea: { alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  mascoteCirculo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  folha: {
    width: 72,
    height: 72,
    lineHeight: 72,
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
    paddingBottom: 32,
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
  missaoDescricao: {
    fontFamily: fonts.sans,
    fontSize: 13,
    lineHeight: 18,
    color: colors.mutedForeground,
    marginTop: 4,
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
    marginTop: 20,
  },
  gridCentro: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
