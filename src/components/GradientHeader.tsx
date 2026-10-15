/*
  COMPONENTE: GradientHeader (cabeçalho com degradê).
  Faixa colorida no topo das telas principais (Missões, Pegada, Yvy, Comunidade
  e Ajustes), com título, subtítulo opcional e um ícone opcional.
  Como o cabeçalho padrão do React Navigation está desligado (headerShown:
  false), cada tela usa este componente para manter o mesmo visual.
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

type Props = {
  title: string; // Título principal do cabeçalho
  subtitle?: string; // Subtítulo opcional
  colorsSet?: readonly [string, string] | readonly [string, string, string]; // Cores do degradê (use `gradients` de theme/colors)
  icon?: keyof typeof Ionicons.glyphMap; // Ícone opcional do Ionicons
};

export function GradientHeader({ title, subtitle, colorsSet, icon }: Props) {
  // Define a paleta de cores do degradê (usa o padrão do tema caso nenhuma seja informada)
  const gradientColors = colorsSet ?? ([colors.primary, colors.leafDeep] as const);

  return (
    // O `as unknown as [...]` é só um ajuste de tipagem: o LinearGradient exige
    // uma tupla com pelo menos duas cores e o array vem como somente
    // leitura. Não muda nada em tempo de execução.
    <LinearGradient
      colors={gradientColors as unknown as [string, string, ...string[]]}
      start={{ x: 0, y: 0 }} // Início do degradê (topo)
      end={{ x: 0, y: 1 }}   // Fim do degradê (base)
      style={styles.container}
    >
      {/* Exibe o ícone apenas se a prop 'icon' for passada */}
      {icon ? (
        <View style={styles.iconBadge}>
          <Ionicons name={icon} size={24} color={colors.white} />
        </View>
      ) : null}
      
      <Text style={styles.title}>{title}</Text>
      
      {/* Exibe o subtítulo apenas se for fornecido */}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </LinearGradient>
  );
}

// Estilos: cada chave vira um estilo usado no JSX acima
// StyleSheet.create apenas valida e otimiza os objetos de estilo.
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
    alignItems: 'center',
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 24,
    fontWeight: '800',
    color: colors.white,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
    textAlign: 'center',
  },
});