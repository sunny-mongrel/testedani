/*
 * COMPONENTE: MissionSuccessModal (pop-up de "Missão concluída!").
 * Cartão central com animação, mostrando os pontos ganhos e, se for o caso, o
 * novo nível alcançado. É aberto pelo MissionDetailModal, e o botão
 * "Continuar" é o que confirma a conclusão da missão.
 * Não é um <Modal> nativo: é uma camada (overlay) desenhada por cima da tela
 * que o usa, porque dois Modals nativos empilhados dão problema no iOS. Quem
 * usa este componente precisa colocá-lo dentro de uma View que ocupe a tela toda.
 */
import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { PrimaryButton } from './PrimaryButton';

type Props = {
  visible: boolean; // Controla a exibição do pop-up
  pontos: number; // Pontos recebidos, exibidos no feedback
  novoNivel?: number | null; // Preenchido quando a missão faz o usuário subir de nível
  onConfirmar: () => void; // Chamado ao tocar em "Continuar"
};

export function MissionSuccessModal({ visible, pontos, novoNivel, onConfirmar }: Props) {
  const [montado, setMontado] = useState(visible);

  // Valor animado de 0 (escondido) a 1 (totalmente visível). Guardado em useRef
  // para não ser recriado a cada renderização. Alimenta a opacidade e a escala.
  const progresso = useRef(new Animated.Value(visible ? 1 : 0)).current;

  // Animação de entrada e saída 
  // useNativeDriver roda a animação no lado nativo, deixando mais fluido
  useEffect(() => {
    if (visible) {
      setMontado(true);
      Animated.spring(progresso, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
        tension: 90,
      }).start();
    } else {
      Animated.timing(progresso, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(({ finished }) => {
        // Só desmonta quando a animação de saída terminou (não foi interrompida).
        if (finished) setMontado(false);
      });
    }
  }, [visible, progresso]);

  // Nada é desenhado enquanto o pop-up não estiver montado.
  if (!montado) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity: progresso }]}>
      {/* Modal central com efeito de escala. O overlay bloqueia toques na tela
          de trás; o pop-up só fecha pelo botão "Continuar". */}
      <Animated.View
        style={[
          styles.cartao,
          {
            transform: [
              {
                // interpolate converte 0..1 em 0.85..1: o cartão "cresce"
                // suavemente de 85% até o tamanho normal ao aparecer.
                scale: progresso.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.85, 1],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.iconeCirculo}>
          <Ionicons name="checkmark-circle" size={56} color={colors.leaf} />
        </View>

        <Text style={styles.titulo}>Missão concluída! 🎉</Text>
        <Text style={styles.subtitulo}>
          Você recebeu +{pontos} pontos de impacto por essa ação.
        </Text>

        {/* Faixa extra, só quando a missão fez o usuário subir de nível. */}
        {novoNivel ? (
          <View style={styles.nivelBadge}>
            <Text style={styles.nivelTexto}>🌱 Você subiu para o nível {novoNivel}!</Text>
          </View>
        ) : null}

        <PrimaryButton label="Continuar" onPress={onConfirmar} style={styles.botao} />
      </Animated.View>
    </Animated.View>
  );
}

// Estilos: cada chave vira um estilo usado no JSX acima
// StyleSheet.create apenas valida e otimiza os objetos de estilo.
const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(20,67,42,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    zIndex: 10,
    elevation: 10,
  },
  cartao: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: colors.background,
    borderRadius: radius.xxl,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
    alignItems: 'center',
  },
  iconeCirculo: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  titulo: {
    fontFamily: fonts.display,
    fontSize: 20,
    fontWeight: '800',
    color: colors.cardForeground,
    textAlign: 'center',
  },
  subtitulo: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    color: colors.mutedForeground,
    textAlign: 'center',
    marginTop: 8,
  },
  nivelBadge: {
    backgroundColor: 'rgba(46,204,113,0.15)',
    borderRadius: radius.full,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginTop: 14,
  },
  nivelTexto: {
    fontFamily: fonts.sansBold,
    fontSize: 13,
    fontWeight: '700',
    color: colors.leafDeep,
  },
  botao: { marginTop: 20, alignSelf: 'stretch' },
});
