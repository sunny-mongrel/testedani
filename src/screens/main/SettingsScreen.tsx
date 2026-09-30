/**
 * TELA: CONFIGURAÇÕES (aba "Ajustes").
 *
 * ATENÇÃO: a tela é apenas visual. Os interruptores mudam de posição, mas
 * nada é salvo nem aplicado — não há modo escuro nem notificações
 * implementados, e os botões de "Login", "Editar cadastro", "Privacidade",
 * "Idioma" e "Termos" ainda não têm ação.
 *
 * Os componentes auxiliares (Secao, LinhaLink, LinhaToggle) ficam no fim deste
 * arquivo porque só esta tela os usa.
 */
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GradientHeader } from '../../components/GradientHeader';
import { colors, gradients, radius } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

export default function SettingsScreen() {
  // Estado local dos dois interruptores. Como só existe aqui (e não no
  // AppContext), o valor volta ao padrão sempre que o app é reaberto.
  const [notificacoes, setNotificacoes] = useState(true);
  const [modoEscuro, setModoEscuro] = useState(false);

  return (
    <SafeAreaView style={styles.flex} edges={['top']}>
      <GradientHeader
        title="Configurações"
        subtitle="Gerencie seu perfil e preferências"
        colorsSet={gradients.header}
      />

      <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
        {/* Cartão de destaque para criar perfil/login (sem ação por enquanto). */}
        <TouchableOpacity style={styles.cartaoLogin} activeOpacity={0.9}>
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
          <LinhaLink icon="shield-checkmark-outline" label="Privacidade e segurança" />
        </Secao>

        <Secao titulo="Preferências do app">
          {/* `valor` e `aoAlterar` ligam o interruptor ao estado desta tela. */}
          <LinhaToggle
            icon="notifications-outline"
            label="Notificações"
            valor={notificacoes}
            aoAlterar={setNotificacoes}
          />
          <LinhaToggle
            icon="moon-outline"
            label="Modo escuro"
            valor={modoEscuro}
            aoAlterar={setModoEscuro}
          />
          <LinhaLink icon="globe-outline" label="Idioma" traseira="Português" />
        </Secao>

        <Secao titulo="Sobre">
          <LinhaLink icon="document-text-outline" label="Termos e políticas" />
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

/** Linha clicável com ícone, rótulo e seta. `traseira` é um texto opcional
 *  alinhado à direita (ex.: o idioma atual). Ainda sem ação ao tocar. */
function LinhaLink({
  icon,
  label,
  traseira,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  traseira?: string;
}) {
  return (
    <TouchableOpacity style={styles.linha} activeOpacity={0.8}>
      <View style={styles.linhaIcone}>
        <Ionicons name={icon} size={18} color={colors.leafDeep} />
      </View>
      <Text style={styles.linhaLabel}>{label}</Text>
      {traseira ? <Text style={styles.linhaTraseira}>{traseira}</Text> : null}
      <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
    </TouchableOpacity>
  );
}

/**
 * Linha com interruptor. Como não usamos o componente Switch nativo, o
 * interruptor é montado à mão: uma trilha (switchBase) com uma bolinha dentro.
 * Isso permite usar as cores do app em Android e iOS igualmente.
 */
function LinhaToggle({
  icon,
  label,
  valor,
  aoAlterar,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  valor: boolean;
  aoAlterar: (v: boolean) => void;
}) {
  return (
    <View style={styles.linha}>
      <View style={styles.linhaIcone}>
        <Ionicons name={icon} size={18} color={colors.leafDeep} />
      </View>
      <Text style={styles.linhaLabel}>{label}</Text>
      <TouchableOpacity
        // Inverte o valor atual e devolve para quem controla o estado.
        // O componente em si não guarda nada (padrão "componente controlado").
        onPress={() => aoAlterar(!valor)}
        style={[styles.switchBase, valor && styles.switchAtivo]}
        activeOpacity={0.85}
      >
        <View style={[styles.switchBolinha, valor && styles.switchBolinhaAtiva]} />
      </TouchableOpacity>
    </View>
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
  linhaTraseira: { fontFamily: fonts.sans, fontSize: 13, color: colors.mutedForeground },
  switchBase: {
    width: 46,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.muted,
    padding: 2,
    justifyContent: 'center',
  },
  switchAtivo: { backgroundColor: colors.leaf },
  switchBolinha: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.white,
  },
  // Ligado: a bolinha desliza 20px para a direita.
  switchBolinhaAtiva: { transform: [{ translateX: 20 }] },
  versao: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.mutedForeground,
    textAlign: 'center',
    marginTop: 24,
  },
});
