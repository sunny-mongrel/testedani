/*
 * TELA: CADASTRO (criar login).
 *
 * Formulário com nome, e-mail e senha. É aberta por dois caminhos: o cartão
 * "Criar perfil / Login" da aba Ajustes e o botão de perfil (canto superior
 * direito) da Home. Por ficar na pilha (stack.routes.tsx) e não nas abas, abre
 * em tela cheia, sem a barra inferior, e o botão de voltar no topo retorna
 * para a tela anterior.
 *
 * ATENÇÃO: a tela é apenas visual. Os campos são validados (nome preenchido,
 * e-mail com formato válido e senha com pelo menos 6 caracteres), mas nada é
 * enviado nem salvo: ainda não existe servidor nem banco de dados de usuários.
 *
 * O componente auxiliar Campo fica no fim deste arquivo porque só esta tela o usa.
 */
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../routes/routes.types';
import { colors, gradients, radius } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { PrimaryButton } from '../components/PrimaryButton';

type Props = NativeStackScreenProps<RootStackParamList, 'Cadastro'>;

// Verificação simples de e-mail: texto, "@", texto, ponto, texto (sem espaços).
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TAMANHO_MINIMO_SENHA = 6;

export default function Cadastro({ navigation }: Props) {
  // Valores digitados em cada campo.
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // Controla se a senha aparece em texto puro (ícone de olho).
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // Só mostramos os erros depois da primeira tentativa de cadastrar, para o
  // formulário não aparecer todo vermelho antes de o usuário digitar.
  const [tentou, setTentou] = useState(false);

  // Mensagens de erro calculadas a cada renderização a partir dos valores
  // (string vazia = campo válido).
  const erroNome = nome.trim().length < 2 ? 'Informe seu nome.' : '';
  const erroEmail = REGEX_EMAIL.test(email.trim()) ? '' : 'Informe um e-mail válido.';
  const erroSenha =
    senha.length < TAMANHO_MINIMO_SENHA
      ? `A senha precisa ter pelo menos ${TAMANHO_MINIMO_SENHA} caracteres.`
      : '';

  function cadastrar() {
    setTentou(true);
    // Se algum campo tem erro, para por aqui e deixa as mensagens visíveis.
    if (erroNome || erroEmail || erroSenha) return;

    // Ainda sem servidor: só confirmamos e voltamos para a tela anterior.
    Alert.alert('Cadastro realizado!', `Bem-vindo(a) ao Ecoara, ${nome.trim()}.`, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  }

  return (
    <LinearGradient colors={gradients.hero as unknown as [string, string, ...string[]]} style={styles.flex}>
      <SafeAreaView style={styles.flex} edges={['top', 'bottom']}>
        {/* KeyboardAvoidingView sobe o conteúdo quando o teclado abre, para o
            campo digitado não ficar escondido atrás dele (no iOS usa-se padding). */}
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Botão de voltar no topo. */}
            <TouchableOpacity
              style={styles.botaoVoltar}
              activeOpacity={0.8}
              onPress={() => navigation.goBack()}
              accessibilityLabel="Voltar"
            >
              <Ionicons name="chevron-back" size={22} color={colors.white} />
            </TouchableOpacity>

            <Text style={styles.titulo}>Criar cadastro</Text>
            <Text style={styles.subtitulo}>Salve seu progresso e conquistas</Text>

            <View style={styles.cartao}>
              <Campo
                icon="person-outline"
                label="Nome"
                placeholder="Seu nome"
                value={nome}
                onChangeText={setNome}
                autoCapitalize="words"
                erro={tentou ? erroNome : ''}
              />
              <Campo
                icon="mail-outline"
                label="E-mail"
                placeholder="voce@exemplo.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                erro={tentou ? erroEmail : ''}
              />
              <Campo
                icon="lock-closed-outline"
                label="Senha"
                placeholder="Mínimo de 6 caracteres"
                value={senha}
                onChangeText={setSenha}
                // Esconde os caracteres, a menos que o olho esteja ativado.
                secureTextEntry={!mostrarSenha}
                autoCapitalize="none"
                autoCorrect={false}
                erro={tentou ? erroSenha : ''}
                // Ícone de olho à direita do campo para mostrar/ocultar a senha.
                acao={{
                  icon: mostrarSenha ? 'eye-off-outline' : 'eye-outline',
                  aoPressionar: () => setMostrarSenha(!mostrarSenha),
                }}
              />

              <PrimaryButton label="CADASTRAR" onPress={cadastrar} style={styles.botao} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// ---------------------------------------------------------------------------
// Componente auxiliar, declarado neste arquivo por ser usado só aqui.
// ---------------------------------------------------------------------------

type CampoProps = {
  icon: keyof typeof Ionicons.glyphMap; // Ícone à esquerda
  label: string; // Rótulo acima do campo
  placeholder: string;
  value: string;
  onChangeText: (texto: string) => void;
  keyboardType?: 'default' | 'email-address';
  autoCapitalize?: 'none' | 'words';
  autoCorrect?: boolean;
  secureTextEntry?: boolean;
  erro?: string; // Mensagem de erro (vazia = sem erro)
  // Botão opcional à direita do campo (usado no olho da senha).
  acao?: { icon: keyof typeof Ionicons.glyphMap; aoPressionar: () => void };
};

/** Campo de texto com rótulo, ícone, botão opcional à direita e mensagem de erro. */
function Campo({ icon, label, erro, acao, ...inputProps }: CampoProps) {
  return (
    <View style={styles.campo}>
      <Text style={styles.campoLabel}>{label}</Text>
      {/* A borda fica vermelha quando há erro. */}
      <View style={[styles.campoCaixa, !!erro && styles.campoCaixaErro]}>
        <Ionicons name={icon} size={18} color={colors.leafDeep} />
        <TextInput
          style={styles.campoInput}
          placeholderTextColor={colors.mutedForeground}
          {...inputProps}
        />
        {acao ? (
          <TouchableOpacity onPress={acao.aoPressionar} hitSlop={8}>
            <Ionicons name={acao.icon} size={20} color={colors.mutedForeground} />
          </TouchableOpacity>
        ) : null}
      </View>
      {erro ? <Text style={styles.campoErro}>{erro}</Text> : null}
    </View>
  );
}

// Estilos: cada chave vira um estilo usado no JSX acima (ex.: `style={styles.card}`).
// StyleSheet.create apenas valida e otimiza os objetos de estilo.
const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 24 },
  botaoVoltar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  titulo: {
    fontFamily: fonts.display,
    fontSize: 26,
    fontWeight: '800',
    color: colors.white,
    textAlign: 'center',
    marginTop: 8,
  },
  subtitulo: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginTop: 4,
  },
  cartao: {
    marginTop: 24,
    backgroundColor: colors.background,
    borderRadius: radius.xxl,
    padding: 20,
  },
  campo: { marginBottom: 14 },
  campoLabel: {
    fontFamily: fonts.sansBold,
    fontSize: 13,
    fontWeight: '700',
    color: colors.leafDeep,
    marginBottom: 6,
    marginLeft: 4,
  },
  campoCaixa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 52,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.accent,
  },
  campoCaixaErro: { borderColor: colors.destructive },
  campoInput: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.cardForeground,
  },
  campoErro: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.destructive,
    marginTop: 4,
    marginLeft: 4,
  },
  botao: { marginTop: 6 },
});
