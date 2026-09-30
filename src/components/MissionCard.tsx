/*
 COMPONENTE: MissionCard (cartão de uma missão na lista).
 Linha compacta usada na tela de Missões: ícone, título, frase curta e a
 pontuação (+10, +15...). Quando a missão está concluída, o ícone vira um
 "check" e as cores mudam. Ao tocar, a tela abre o modal com os detalhes.
 */
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme/colors';
import { fonts } from '../theme/fonts';
import type { Missao } from '../data/Missoes';

type Props = {
  missao: Missao; // Objeto com os dados da missão (data/Missoes.ts)
  concluida: boolean; // Indica se a missão foi finalizada
  onPress: () => void; // Ação disparada ao clicar no card
};

export function MissionCard({ missao, concluida, onPress }: Props) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.card}>
      {/* Caixa do ícone: alterna a cor e o ícone de acordo com o estado de conclusão.
          O `as keyof typeof Ionicons.glyphMap` só informa ao TypeScript que
          o texto guardado em `missao.icone` é um nome de ícone válido. */}
      <View style={[styles.iconBox, concluida && styles.iconBoxDone]}>
        <Ionicons
          name={concluida ? 'checkmark' : (missao.icone as keyof typeof Ionicons.glyphMap)}
          size={22}
          color={concluida ? colors.white : colors.leafDeep}
        />
      </View>

      {/* Título e frase explicativa da missão. numberOfLines corta o texto e add
          "..." se passar do limite de linhas, mantendo os cartões do mesmo tamanho. */}
      <View style={styles.textArea}>
        <Text style={styles.title} numberOfLines={1}>
          {missao.titulo}
        </Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {missao.frase}
        </Text>
      </View>

      {/* Badge com a pontuação atribuída */}
      <View style={[styles.pointsBadge, concluida && styles.pointsBadgeDone]}>
        <Text style={[styles.pointsText, concluida && styles.pointsTextDone]}>
          +{missao.pontos}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// Estilos: cada chave vira um estilo usado no JSX acima
// StyleSheet.create apenas valida e otimiza os objetos de estilo.
const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 16,
    gap: 14,
    marginBottom: 10,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxDone: { backgroundColor: colors.leaf },
  textArea: { flex: 1 },
  title: {
    fontFamily: fonts.sansBold,
    fontSize: 15,
    fontWeight: '700',
    color: colors.cardForeground,
  },
  subtitle: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  pointsBadge: {
    backgroundColor: 'rgba(46,204,113,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
  },
  pointsBadgeDone: { backgroundColor: colors.accent },
  pointsText: {
    fontFamily: fonts.sansBold,
    fontSize: 12,
    fontWeight: '700',
    color: colors.leafDeep,
  },
  pointsTextDone: { color: colors.leafDeep },
});