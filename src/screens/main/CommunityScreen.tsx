/**
 * TELA: COMUNIDADE (aba "Comunidade").
 *
 * A funcionalidade ainda não existe. Para não deixar a tela vazia, desenhamos
 * uma "prévia" falsa (esqueleto de posts com opacidade reduzida) e, por cima,
 * um aviso pedindo login. Não há lógica real aqui — é uma tela de demonstração.
 */
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { GradientHeader } from '../../components/GradientHeader';
import { colors, gradients, radius } from '../../theme/colors';
import { fonts } from '../../theme/fonts';
import type { MainTabParamList } from '../../routes/routes.types';

// Tipo do objeto `navigation` desta tela: navegação entre as abas.
type Nav = BottomTabNavigationProp<MainTabParamList>;

export default function CommunityScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.flex} edges={['top']}>
      <GradientHeader
        title="Comunidade"
        subtitle="Conecte-se com outros ecoaras"
        colorsSet={gradients.header}
      />

      <View style={styles.conteudo}>
        {/* Camada de FUNDO: posts falsos, só decorativos.
            pointerEvents="none" faz os toques atravessarem este bloco
            e chegarem ao botão que está por cima. */}
        <View style={styles.fundoDesfocado} pointerEvents="none">
          {/* O array [0,1,2] existe só para repetir o bloco falso três vezes. */}
          {[0, 1, 2].map((i) => (
            <View key={i} style={styles.linhaFalsa}>
              <View style={styles.avatarFalso} />
              <View style={styles.textosFalsos}>
                <View style={styles.linhaTextoFalsaLarga} />
                <View style={styles.linhaTextoFalsaEstreita} />
              </View>
            </View>
          ))}
        </View>

        {/* Camada da FRENTE: aviso de login, posicionado sobre o fundo. */}
        <View style={styles.overlay}>
          <View style={styles.cadeadoCirculo}>
            <Ionicons name="lock-closed-outline" size={28} color={colors.leafDeep} />
          </View>
          <Text style={styles.titulo}>Faça login para interagir com a comunidade</Text>
          <Text style={styles.paragrafo}>
            Compartilhe conquistas, participe de desafios em grupo e inspire outras pessoas.
          </Text>
          <TouchableOpacity
            style={styles.botao}
            activeOpacity={0.85}
            // O login de verdade ainda não existe: por enquanto o botão apenas
            // leva o usuário para a aba de Ajustes.
            onPress={() => navigation.navigate('Ajustes')}
          >
            <Ionicons name="people-outline" size={18} color={colors.white} />
            <Text style={styles.botaoTexto}>Login / Cadastrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// Estilos: cada chave vira um estilo usado no JSX acima (ex.: `style={styles.card}`).
// StyleSheet.create apenas valida e otimiza os objetos de estilo.
const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  conteudo: { flex: 1 },
  fundoDesfocado: { paddingHorizontal: 20, paddingTop: 16, gap: 12, opacity: 0.35 },
  linhaFalsa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: 16,
  },
  avatarFalso: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.muted },
  textosFalsos: { flex: 1, gap: 8 },
  linhaTextoFalsaLarga: { height: 10, width: '70%', borderRadius: 5, backgroundColor: colors.muted },
  linhaTextoFalsaEstreita: { height: 10, width: '45%', borderRadius: 5, backgroundColor: colors.muted },
  overlay: {
    // position absolute + os quatro lados em 0 fazem este bloco ocupar toda a
    // área do pai, ficando sobreposto ao conteúdo falso do fundo.
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  cadeadoCirculo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    fontFamily: fonts.display,
    fontSize: 19,
    fontWeight: '700',
    color: colors.cardForeground,
    textAlign: 'center',
    marginTop: 16,
  },
  paragrafo: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    color: colors.mutedForeground,
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 280,
  },
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.leaf,
    borderRadius: radius.full,
    paddingHorizontal: 24,
    paddingVertical: 13,
    marginTop: 20,
  },
  botaoTexto: {
    fontFamily: fonts.sansBold,
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
});
