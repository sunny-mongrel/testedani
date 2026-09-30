/*
 * TEMA VISUAL: cores, raios de borda e degradês.
 * COM BASE EM UM PROTOTIPO FEITO UTILIZANDO O VO.DEV E UX PILOT
 * 
 * para mudar uma cor do app inteiro, basta alterar este arquivo.
 * As telas importam assim: import { colors, radius, gradients } from '../theme/colors'
 */

// Paleta oficial do Ecoara v0 (components/ecoara/app/globals.css),
// convertida para uso em React Native.
// `as const` trava os valores como literais (ex.: '#27ae60' em vez de string
// genérica), o que melhora o autocomplete e impede alterações acidentais.
export const colors = {
  // Base: fundo das telas e cor padrão do texto (verde bem escuro).
  background: '#ffffff',
  foreground: '#14432a',

  // Cartões e caixas de conteúdo.
  card: '#ffffff',
  cardForeground: '#14432a',

  // Cores de marca: verde (principal) e azul (secundária, lembra a ararinha-azul).
  primary: '#27ae60',
  primaryForeground: '#ffffff',

  secondary: '#2980b9',
  secondaryForeground: '#ffffff',

  // Tons suaves para fundos de destaque, trilhos de barras e textos de apoio.
  muted: '#e4f4e9',
  mutedForeground: '#4f7a61',

  accent: '#eafaf0',
  accentForeground: '#166534',

  border: '#d3ecdb',

  // Variações de verde (leaf = folha) e azul (macaw = arara) usadas em
  // botões, ícones, degradês e destaques.
  leaf: '#2ecc71',
  leafDeep: '#1e8449',

  macaw: '#2980b9',
  macawDeep: '#1f6690',

  //nao utilizado ainda, para futuros erros
  destructive: '#e74c3c',

  // Branco e brancos translúcidos, usados sobre fundos coloridos (degradês).
  white: '#ffffff',
  overlay: 'rgba(255,255,255,0.2)',
  overlaySoft: 'rgba(255,255,255,0.9)',
} as const;

/**
 * Raios de borda padronizados. Usar `radius.xl` em vez de `22` mantém os
 * cantos consistentes em todo o app e facilita mudar o visual num lugar só.
 * `full: 999` é um truque comum para deixar o elemento totalmente arredondado
 * (pílula/círculo), independente do tamanho dele.
 */
export const radius = {
  sm: 10,
  md: 13,
  lg: 16,
  xl: 22,
  xxl: 29,
  xxxl: 35,
  full: 999,
} as const;

/**
 * Combinações de cores prontas para o componente LinearGradient.
 * A ordem das cores é a ordem em que elas aparecem no degradê.
 * hero = telas de destaque (Onboarding, Home, Resultado); header = cabeçalho
 * verde das abas; blue = cabeçalho azul (Pegada, Yvy); ctaGreen = ainda sem uso.
 */
export const gradients = {
  hero: [colors.leaf, colors.primary, colors.leafDeep] as const,
  header: [colors.primary, colors.leafDeep] as const,
  blue: [colors.macaw, colors.macawDeep] as const,
  ctaGreen: [colors.leaf, colors.leafDeep] as const,
};
