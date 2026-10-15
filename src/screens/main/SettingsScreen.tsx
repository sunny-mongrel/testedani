/**
 * TELA: CONFIGURAÇÕES (aba "Ajustes").
 *
 * Tem o cartão "Criar perfil / Login", que abre a tela de Cadastro, e a seção
 * "Conta" com "Editar cadastro".
 *
 * ATENÇÃO: o botão "Editar cadastro" ainda não tem ação. Foram removidos desta
 * tela os itens de notificações, modo escuro, idioma, privacidade e segurança
 * e termos e políticas.
 *
 * Os componentes auxiliares (Secao, LinhaLink) ficam no fim deste arquivo
 * porque só esta tela os usa.
 */
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GradientHeader } from '../../components/GradientHeader';
import { colors, gradients, radius } from '../../theme/colors';
import { fonts } from '../../theme/fonts';
import type { RootStackParamList } from '../../routes/routes.types';

export default function SettingsScreen() {
  // Cadastro está na pilha principal (RootStackParamList), por isso o tipo da
  // navegação é o da pilha. O navigate sobe até a pilha a partir da aba.
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={styles.flex} edges={['top']}>
      <GradientHeader
        title="Configurações"
        subtitle="Gerencie seu perfil"
        colorsSet={gradients.header}
      />

      <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
        {/* Cartão de destaque para criar perfil/login: abre a tela de Cadastro. */}
        <TouchableOpacity
          style={styles.cartaoLogin}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Cadastro')}
        >
          <View style={styles.iconeLogin}>
            <Ionicons name="person-add-outline" size={22} color={colors.white} />
          </View>
          <View style={styles.textoLogin}>
            <Text style={styles.loginTitulo}>Criar perfil / Login</Text>
            <Text style={styles.loginSubtitulo}>Salve seu progresso e conquistas</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.white} />
        </TouchableOpacity>

        <Secao titulo="Conta">
          <LinhaLink icon="create-outline" label="Editar cadastro" />
        </Secao>

        <Text style={styles.versao}>Ecoara · versão 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Componentes auxiliares, declarados neste arquivo por serem usados só aqui.
// ---------------------------------------------------------------------------

/** Agrupa linhas sob um título, dentro de um cartão com borda. */
function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <View style={styles.secao}>
      <Text style={styles.secaoTitulo}>{titulo}</Text>
      <View style={styles.secaoCorpo}>{children}</View>
    </View>
  );
}

/** Linha clicável com ícone, rótulo e seta. Ainda sem ação ao tocar. */
function LinhaLink({
  icon,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  return (
    <TouchableOpacity style={styles.linha} activeOpacity={0.8}>
      <View style={styles.linhaIcone}>
        <Ionicons name={icon} size={18} color={colors.leafDeep} />
      </View>
      <Text style={styles.linhaLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
    </TouchableOpacity>
  );
}

// Estilos: cada chave vira um estilo usado no JSX acima (ex.: `style={styles.card}`).
// StyleSheet.create apenas valida e otimiza os objetos de estilo.
const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  conteudo: { padding: 20, paddingBottom: 40 },
  cartaoLogin: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: radius.xl,
    padding: 16,
    backgroundColor: colors.leafDeep,
  },
  iconeLogin: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoLogin: { flex: 1 },
  loginTitulo: { fontFamily: fonts.display, fontSize: 15, fontWeight: '700', color: colors.white },
  loginSubtitulo: { fontFamily: fonts.sans, fontSize: 13, color: 'rgba(255,255,255,0.9)', marginTop: 2 },
  secao: { marginTop: 24 },
  secaoTitulo: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    color: colors.mutedForeground,
    marginBottom: 8,
    marginLeft: 4,
  },
  secaoCorpo: {
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    overflow: 'hidden',
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  linhaIcone: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linhaLabel: {
    flex: 1,
    fontFamily: fonts.sansBold,
    fontSize: 14,
    fontWeight: '600',
    color: colors.cardForeground,
  },
  versao: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.mutedForeground,
    textAlign: 'center',
    marginTop: 24,
  },
});
