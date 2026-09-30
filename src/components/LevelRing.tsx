/*
  COMPONENTE: LevelRing (anel de nível).
  Círculo que mostra o nível do usuário no centro e uma barra circular de
  progresso em volta (quanto falta para o próximo nível). É usado na Home.
  O componente só exibe quem calcula nível e progresso é o AppContext.
  Como funciona o desenho: são dois círculos SVG sobrepostos. O de fundo é
  o "trilho"; o de cima usa `strokeDasharray` para desenhar só uma parte
  da circunferência, proporcional ao progresso.
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

type Props = {
  level: number; // Número do nível atual
  progress: number; // Progresso relativo (entre 0.0 e 1.0)
  size?: number; // Tamanho do diâmetro em pixels 
  strokeWidth?: number; // Espessura da linha do anel 
  label?: string; // Legenda opcional abaixo do anel
};

export function LevelRing({ level, progress, size = 96, strokeWidth = 9, label }: Props) {
  // Cálculo do raio descontando a metade da espessura para não cortar as bordas
  const radius = (size - strokeWidth) / 2;

  // Comprimento total da circunferência (2*pi*r)
  const circumference = 2 * Math.PI * radius;

  // Garante que o progresso fique estritamente no intervalo entre 0 e 1
  const clamped = Math.max(0, Math.min(1, progress));

  // Comprimento do traço visível proporcional ao progresso
  const dash = clamped * circumference;

  return (
    <View style={styles.wrapper}>
      <View style={{ width: size, height: size }}>
        {/* Giramos -90deg para que o preenchimento comece no topo (12h) e não à direita (3h) */}
        <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
          {/* Círculo de fundo */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colors.muted}
            strokeWidth={strokeWidth}
          />
          {/* Círculo superior (barra de progresso verde).
              strokeDasharray recebe "traço espaço": desenha `dash` pixels de
              linha e deixa o resto da circunferência sem preencher. */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colors.leaf}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
          />
        </Svg>
        
        {/* Overlay centralizado contendo os textos internos do nível */}
        <View style={StyleSheet.absoluteFill}>
          <View style={styles.center}>
            <Text style={styles.level}>{level}</Text>
            <Text style={styles.levelLabel}>Nível</Text>
          </View>
        </View>
      </View>
      {label ? <Text style={styles.caption}>{label}</Text> : null}
    </View>
  );
}

// Estilos: cada chave vira um estilo usado no JSX acima
// StyleSheet.create apenas valida e otimiza os objetos de estilo.
const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', gap: 8 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  level: {
    fontFamily: fonts.display,
    fontSize: 24,
    fontWeight: '800',
    color: colors.leafDeep,
    lineHeight: 26,
  },
  levelLabel: {
    fontFamily: fonts.sansBold,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: colors.mutedForeground,
  },
  caption: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13,
    fontWeight: '600',
    color: colors.cardForeground,
  },
});