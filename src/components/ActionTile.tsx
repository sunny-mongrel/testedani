/*
  COMPONENTE: ActionTile (atalho em bloco).
  Botão com um ícone em cima e um rótulo embaixo, usado para ações
  rápidas. Aparece na grade da tela Home ("Missões" e "Pegada ecológica").
  Não guarda estado: quem usa ele decide o que acontece no onPress.
 */
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme/colors';
import { fonts } from '../theme/fonts';

type Props = {
  label: string; // Texto descritivo exibido abaixo do ícone
  icon: keyof typeof Ionicons.glyphMap; // Nome do ícone (restrito aos ícones válidos do Ionicons)
  onPress: () => void; // Função de click/ação do botão
};

export function ActionTile({ label, icon, onPress }: Props) {
  return (
    // Elemento clicável com feedback visual de opacidade reduzida ao toque
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.wrapper}>
      {/* Container visual do ícone com borda e fundo estilizados */}
      <View style={styles.iconBox}>
        <Ionicons name={icon} size={26} color={colors.leafDeep} />
      </View>
      {/* Rótulo de texto do botão */}
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

// Estilos: cada chave vira um estilo usado no JSX acima
// StyleSheet.create apenas valida e otimiza os objetos de estilo.
const styles = StyleSheet.create({
  wrapper: { 
    flex: 1, 
    alignItems: 'center', 
    gap: 8 
  },
  iconBox: {
    width: '100%',
    height: 72,
    borderRadius: radius.xl,
    borderWidth: 2,
    borderColor: 'rgba(46,204,113,0.3)',
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: fonts.sansBold,
    fontSize: 12,
    fontWeight: '700',
    color: colors.cardForeground,
    textAlign: 'center',
  },
});