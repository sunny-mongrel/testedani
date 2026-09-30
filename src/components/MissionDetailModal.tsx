/*
 * COMPONENTE: MissionDetailModal (tela de detalhes de uma missão).
 * Tela cheia que sobe de baixo quando o usuário toca em uma missão na lista.
 * Mostra título, frase, pontos e a descrição dividida em seções ("Como fazer",
 * "Por que fazer", "Impactos"). O botão fixo no rodapé conclui a missão.
 * Quem controla a abertura é a tela de Missões: enquanto a prop `missao` for
 * `null` o modal fica fechado; ao receber uma missão, ele abre.
 * FLUXO DE CONCLUSÃO (em 2 etapas, para o usuário confirmar):
 * 1. "Concluir missão": concluir(): abre o pop-up de parabéns, mas ainda
 *      nao altera nenhum dado.
 * 2. "Continuar" no pop-up: confirmar(): só agora chama
 *      onAlternarConcluida(), que marca a missão e soma os pontos no
 *      estado global (AppContext).
 */
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { colors, gradients, radius } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { PrimaryButton } from './PrimaryButton';
import { MissionSuccessModal } from './MissionSuccessModal';
import { calcularNivel, type Missao } from '../data/Missoes';

type Props = {
  missao: Missao | null; // Missão aberta ou 'null' se fechado
  concluida: boolean; // Se a missão já foi concluída (muda ícone e botão)
  pontosAtuais: number; // Pontos de impacto do usuário (para avisar se vai subir de nível)
  onFechar: () => void; // Chamado ao fechar a tela sem concluir
  onAlternarConcluida: () => void; // Chamado para marcar/desmarcar a missão no estado global
};

// Ícone de cada seção do texto (a descrição vem como "Título: texto").
// Se aparecer uma seção com título desconhecido, usa-se 'leaf-outline'.
const ICONES_SECAO: Record<string, keyof typeof Ionicons.glyphMap> = {
  'Como fazer': 'construct-outline',
  'Por que fazer': 'bulb-outline',
  Impactos: 'earth-outline',
};

/**
 * Quebra a descrição em seções.
 * O texto vem de data/Missoes.ts no formato:
 *   "Como fazer: ;Por que fazer: ;Impactos: ..."
 * Cada bloco (separado por linha em branco) vira { titulo, texto }. Se o bloco
 * não tiver o padrão "Título: ", ele vira um texto sem título.
 */
function separarSecoes(descricao: string) {
  return descricao.split('\n\n').map((bloco) => {
    // Posição do primeiro ": " (separador entre título e texto); -1 se não existir.
    const i = bloco.indexOf(': ');
    return i === -1
      ? { titulo: '', texto: bloco }
      : { titulo: bloco.slice(0, i), texto: bloco.slice(i + 2) };
  });
}

export function MissionDetailModal({
  missao,
  concluida,
  pontosAtuais,
  onFechar,
  onAlternarConcluida,
}: Props) {
  const [sucessoVisivel, setSucessoVisivel] = useState(false);
  // Guarda o que o pop-up mostra, para o texto não mudar durante a animação de saída.
  const [sucesso, setSucesso] = useState<{ pontos: number; novoNivel: number | null }>({
    pontos: 0,
    novoNivel: null,
  });

  // Fecha o pop-up (se estiver aberto) e a tela inteira.
  function fechar() {
    setSucessoVisivel(false);
    onFechar();
  }

  // Etapa 1: usuário tocou em "Concluir missão". Ainda não salva nada; só
  // descobre se esses pontos fazem o usuário subir de nível e mostra o pop-up.
  function concluir() {
    if (!missao) return;
    const antes = calcularNivel(pontosAtuais);
    const depois = calcularNivel(pontosAtuais + missao.pontos);
    setSucesso({ pontos: missao.pontos, novoNivel: depois > antes ? depois : null });
    setSucessoVisivel(true); // pop-up imediato
  }

  // Etapa 2: usuário tocou em "Continuar" no pop-up. Agora sim as informações sao salvas
  function confirmar() {
    if (!sucessoVisivel) return; // evita duplo toque somar duas vezes
    setSucessoVisivel(false);
    onAlternarConcluida(); // agora sim: marca como concluída e soma os pontos
  }

  // Botão voltar do Android: com o pop-up aberto, confirma; se não, fecha a tela
  function aoVoltar() {
    if (sucessoVisivel) confirmar();
    else fechar();
  }

  return (
    // `!!missao` converte o objeto (ou null) em true/false: aberto só se tiver missão.
    // animationType="slide": a tela sobe de baixo. statusBarTranslucent deixa o
    // degradê ir até o topo no Android, por baixo da barra de status.
    <Modal
      visible={!!missao}
      animationType="slide"
      statusBarTranslucent
      onRequestClose={aoVoltar}
    >
      {/* Dentro de um Modal (janela nativa separada) o SafeAreaProvider precisa
          ser repetido para as áreas seguras funcionarem, principalmente no Android. */}
      <SafeAreaProvider>
        <View style={styles.tela}>
          {/* Só desenha o conteúdo quando há missão; assim evitamos acessar
              campos de um valor null enquanto o modal está fechando. */}
          {missao ? (
            <>
              {/* Topo verde: fecha, ícone, título, frase e pontos, tudo centralizado */}
              <LinearGradient
                colors={gradients.hero as unknown as [string, string, ...string[]]}
                style={styles.hero}
              >
                <SafeAreaView edges={['top']}>
                  <View style={styles.linhaFechar}>
                    {/* hitSlop aumenta a área de toque do "X" além do tamanho visível. */}
                    <Pressable onPress={fechar} hitSlop={12} style={styles.botaoFechar}>
                      <Ionicons name="close" size={22} color={colors.white} />
                    </Pressable>
                  </View>

                  <View style={styles.heroCentro}>
                    <View style={styles.iconeCirculo}>
                      <Ionicons
                        name={
                          concluida
                            ? 'checkmark'
                            : (missao.icone as keyof typeof Ionicons.glyphMap)
                        }
                        size={40}
                        color={colors.white}
                        style={styles.icone}
                      />
                    </View>
                    <Text style={styles.titulo}>{missao.titulo}</Text>
                    <Text style={styles.frase}>{missao.frase}</Text>
                    <View style={styles.pontosBadge}>
                      <Text style={styles.pontosTexto}>+{missao.pontos} pontos de impacto</Text>
                    </View>
                  </View>
                </SafeAreaView>
              </LinearGradient>

              {/* Meio: seções organizadas, centralizadas na vertical quando sobra espaço */}
              <ScrollView
                style={styles.flex}
                contentContainerStyle={styles.corpo}
                showsVerticalScrollIndicator={false}
              >
                {separarSecoes(missao.descricao).map((secao) => (
                  <View key={secao.titulo || secao.texto} style={styles.secao}>
                    {secao.titulo ? (
                      <View style={styles.secaoTitulo}>
                        <Ionicons
                          name={ICONES_SECAO[secao.titulo] ?? 'leaf-outline'}
                          size={18}
                          color={colors.leafDeep}
                        />
                        <Text style={styles.secaoTituloTexto}>{secao.titulo}</Text>
                      </View>
                    ) : null}
                    <Text style={styles.secaoTexto}>{secao.texto}</Text>
                  </View>
                ))}
              </ScrollView>

              {/* Rodapé fixo, respeitando a barra de gestos.
                  Missão pendente: "Concluir missão" (abre o pop-up de parabéns).
                  Missão concluída: "Marcar como não concluída" (desfaz na hora,
                  sem pop-up, chamando direto o estado global). */}
              <SafeAreaView edges={['bottom']} style={styles.rodape}>
                <PrimaryButton
                  label={concluida ? 'Marcar como não concluída' : 'Concluir missão'}
                  variant={concluida ? 'outline' : 'primary'}
                  onPress={concluida ? onAlternarConcluida : concluir}
                />
              </SafeAreaView>
            </>
          ) : null}

          {/* Pop-up de parabéns: fica dentro deste modal (e não em um segundo
              <Modal>) dois modais nativos empilhados dão problema no ios. */}
          <MissionSuccessModal
            visible={sucessoVisivel}
            pontos={sucesso.pontos}
            novoNivel={sucesso.novoNivel}
            onConfirmar={confirmar}
          />
        </View>
      </SafeAreaProvider>
    </Modal>
  );
}

// Estilos: cada chave vira um estilo usado no JSX acima
// StyleSheet.create apenas valida e otimiza os objetos de estilo.
const styles = StyleSheet.create({
  flex: { flex: 1 },
  tela: { flex: 1, backgroundColor: colors.background },
  hero: {
    paddingBottom: 28,
    borderBottomLeftRadius: radius.xxxl,
    borderBottomRightRadius: radius.xxxl,
  },
  linhaFechar: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 20, paddingTop: 8 },
  botaoFechar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCentro: { alignItems: 'center', paddingHorizontal: 28, marginTop: 4 },
  iconeCirculo: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Mesmo ajuste da Home: caixa do tamanho do ícone para centralizar de verdade.
  icone: { width: 40, height: 40, lineHeight: 40, textAlign: 'center', includeFontPadding: false },
  titulo: {
    fontFamily: fonts.display,
    fontSize: 24,
    fontWeight: '800',
    color: colors.white,
    textAlign: 'center',
    marginTop: 14,
  },
  frase: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 15,
    lineHeight: 21,
    color: 'rgba(255,255,255,0.92)',
    textAlign: 'center',
    marginTop: 6,
  },
  pontosBadge: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: radius.full,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 14,
  },
  pontosTexto: {
    fontFamily: fonts.sansBold,
    fontSize: 13,
    fontWeight: '700',
    color: colors.white,
  },
  corpo: { flexGrow: 1, justifyContent: 'center', padding: 20, gap: 12 },
  secao: {
    backgroundColor: colors.accent,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  secaoTitulo: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  secaoTituloTexto: {
    fontFamily: fonts.display,
    fontSize: 16,
    fontWeight: '700',
    color: colors.leafDeep,
  },
  secaoTexto: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    color: colors.cardForeground,
  },
  rodape: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 12, backgroundColor: colors.background },
});
