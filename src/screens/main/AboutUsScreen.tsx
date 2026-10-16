import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientHeader } from '../../components/GradientHeader';
import { colors, gradients, radius } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

export default function AboutUsScreen() {
  return (
    <SafeAreaView style={styles.flex} edges={['top']}>
      <GradientHeader title="Sobre nós" subtitle="Informações em preparação" colorsSet={gradients.header} />
      <View style={styles.content}>
        <Text style={styles.message}>Esta página está preparada para receber as informações institucionais.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { margin: 20, padding: 22, borderRadius: radius.xl, backgroundColor: colors.card },
  message: { color: colors.cardForeground, fontFamily: fonts.sans, fontSize: 15, lineHeight: 22 },
});
