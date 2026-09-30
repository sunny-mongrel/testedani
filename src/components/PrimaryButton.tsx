/*
 * COMPONENTE: PrimaryButton (botão padrão do app).
 * Botão reutilizado em praticamente todas as telas, com três aparências:
 * - 'primary'   -> fundo verde sólido (ação principal)
 * - 'outline'   -> só contorno verde (ação alternativa, ex.: "voltar")
 * - 'secondary' -> fundo verde bem claro (apouio)
 * Aceita qualquer propriedade de um TouchableOpacity (onPress, disabled...)
 */
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { colors, radius } from '../theme/colors';
import { fonts } from '../theme/fonts';

// Herda as propriedades padrão do TouchableOpacity do React Native
// (o símbolo & junta os tipos) e acrescenta as adicionias
type Props = TouchableOpacityProps & {
  label: string; // Texto a ser exibido dentro do botão
  variant?: 'primary' | 'outline' | 'secondary'; // Estilo visual (padrão: 'primary')
  style?: StyleProp<ViewStyle>; // Permite passar estilos adicionais de fora (ex.: margens)
};

export function PrimaryButton({ label, variant = 'primary', style, ...rest }: Props) {
  // Monta o estilo do container: base + variante escolhida + estilo externo.
  // `cond && estilo` vira `false` quando a condição não vale, e o React
  // Native ignora valores falsos em listas de estilo
  const buttonStyle = [
    styles.button,
    variant === 'primary' && styles.primaryButton,
    variant === 'outline' && styles.outlineButton,
    variant === 'secondary' && styles.secondaryButton,
    style,
  ];

  // Define o estilo do texto baseado na variante escolhida
  const textStyle = [
    styles.label,
    variant === 'primary' && styles.primaryLabel,
    variant === 'outline' && styles.outlineLabel,
    variant === 'secondary' && styles.secondaryLabel,
  ];

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={buttonStyle}
      {...rest} // Repassa propriedades como 'onPress', 'disabled', etc.
    >
      <Text style={textStyle}>{label}</Text>
    </TouchableOpacity>
  );
}

// Estilos: cada chave vira um estilo usado no JSX acima
// StyleSheet.create apenas valida e otimiza os objetos de estilo.
const styles = StyleSheet.create({
  // Estilo base aplicado a todos os botões
  button: {
    height: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  // Variação Principal (fundo verde sólido)
  primaryButton: {
    backgroundColor: colors.leaf,
  },
  // Variação Contorno (fundo transparente com borda)
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.leaf,
  },
  // Variação Secundária (fundo com tom suave/destaque)
  secondaryButton: {
    backgroundColor: colors.accent,
  },
  // Estilo base do texto
  label: {
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
  },
  // Cores do texto para cada variação
  primaryLabel: {
    color: colors.white,
  },
  outlineLabel: {
    color: colors.leafDeep,
  },
  secondaryLabel: {
    color: colors.leafDeep,
  },
});