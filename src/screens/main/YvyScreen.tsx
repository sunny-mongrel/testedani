/**
 * TELA: MASCOTE YVY (aba "Yvy").
 *
 * Yvy é a ararinha-azul mascote do app. Por enquanto esta é uma tela estática
 * de "em breve": não tem estado nem lógica, apenas conteúdo. A ideia futura
 * (descrita no texto da tela) é conversar com a Yvy e cuidar dela conforme o
 * usuário sobe de nível.
 */
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GradientHeader } from '../../components/GradientHeader';
import { colors, gradients, radius } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

export default function YvyScreen() {
  return (
    <SafeAreaView style={styles.flex} edges={['top']}>
      <GradientHeader title="Yvy" subtitle="Sua ararinha-azul companheira" colorsSet={gradients.blue} />

      <View style={styles.conteudo}>
        {/* Imagem local: `require` embute o arquivo da pasta assets/ no app.
            accessibilityLabel é lido por leitores de tela (acessibilidade). */}
        <View style={styles.imagemWrapper}>
          <Image
            source={require('../../../assets/yvy-mascot.png')}
            accessibilityLabel="Yvy, a ararinha-azul, acenando"
            style={styles.imagem}
            resizeMode="cover"
          />
        </View>

        <View style={styles.badge}>
          <Ionicons name="sparkles-outline" size={16} color={colors.leafDeep} />
          <Text style={styles.badgeTexto}>Em breve</Text>
        </View>

        <Text style={styles.titulo}>O Yvy está ganhando vida!</Text>
        <Text style={styles.paragrafo}>
          Aqui você vai conversar com o Yvy, receber dicas ambientais personalizadas e cuidar do
          seu mascote conforme evolui de nível.
        </Text>
      </View>
    </SafeAreaView>
  );
}

// Estilos: cada chave vira um estilo usado no JSX acima (ex.: `style={styles.card}`).
// StyleSheet.create apenas valida e otimiza os objetos de estilo.
const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  conteudo: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  imagemWrapper: {
    width: 200,
    height: 200,
    // borderRadius igual a metade do lado transforma o quadrado em círculo.
    borderRadius: 100,
    borderWidth: 4,
    borderColor: colors.accent,
    // overflow hidden recorta a imagem no formato circular do container.
    overflow: 'hidden',
  },
  imagem: { width: '100%', height: '100%' },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.accent,
    borderRadius: radius.full,
    paddingHorizontal: 16,
    paddingVertical: 7,
    marginTop: 16,
  },
  badgeTexto: {
    fontFamily: fonts.sansBold,
    fontSize: 13,
    fontWeight: '700',
    color: colors.leafDeep,
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
    lineHeight: 21,
    color: colors.mutedForeground,
    textAlign: 'center',
    marginTop: 8,
  },
});
