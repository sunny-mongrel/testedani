/**
 * TELA: MISSÕES (não aparece na barra inferior; aberta pela Home).
 *
 * Lista as missões filtradas por dificuldade (abas Fácil / Médio / Difícil).
 * Logo abaixo das abas há um botão separado, "Missões concluídas", que troca a
 * lista por todas as missões já concluídas (de qualquer dificuldade); tocar de
 * novo nele, ou em uma aba de dificuldade, volta à lista normal.
 * Tocar em uma missão abre um modal com os detalhes.
 * Marcar/desmarcar uma missão atualiza o estado global (AppContext), que
 * recalcula pontos e nível para o resto do app.
 *
 * Peças usadas: GradientHeader (topo), MissionCard (cada item da lista) e
 * MissionDetailModal (tela de detalhes + conclusão).
 */
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GradientHeader } from '../../components/GradientHeader';
import { MissionCard } from '../../components/MissionCard';
import { MissionDetailModal } from '../../components/MissionDetailModal';
import { colors, gradients, radius } from '../../theme/colors';
import { fonts } from '../../theme/fonts';
import {
  dificuldades,
  missoesPorDificuldade,
  todasMissoes,
  type Dificuldade,
  type Missao,
} from '../../data/Missoes';
import { useAppContext } from '../../context/AppContext';

export default function MissionsScreen() {
  // Aba de dificuldade selecionada. Começa em 'facil'.
  const [ativa, setAtiva] = useState<Dificuldade>('facil');

  // Quando `true`, a lista mostra as missões concluídas em vez das da aba.
  const [verConcluidas, setVerConcluidas] = useState(false);

  // Missão aberta no modal. `null` = modal fechado. Guardamos o objeto inteiro
  // (não só o id) para o modal já ter título, descrição e pontos em mãos.
  const [missaoSelecionada, setMissaoSelecionada] = useState<Missao | null>(null);

  // Vem do estado global: quais missões já foram concluídas, a função que
  // marca/desmarca (e que recalcula pontos e nível automaticamente) e os
  // pontos atuais (o modal usa para avisar se a missão fará subir de nível).
  const { missoesConcluidas, alternarMissao, pontosDeImpacto } = useAppContext();

  // Missões já concluídas, de qualquer dificuldade.
  const concluidas = todasMissoes.filter((m) => missoesConcluidas[m.id]);

  // No modo "concluídas" mostra a lista acima; senão pega só as da dificuldade
  // ativa (missoesPorDificuldade é um objeto indexado por dificuldade, o que
  // substitui um filter() na lista toda).
  const missoes = verConcluidas ? concluidas : missoesPorDificuldade[ativa];

  return (
    <SafeAreaView style={styles.flex} edges={['top']}>
      <GradientHeader
        title="Missões"
        subtitle="Escolha um desafio e ganhe pontos de impacto"
        colorsSet={gradients.header}
      />

      <View style={styles.abas}>
        {/* Abas Fácil / Médio / Difícil. Nenhuma fica destacada enquanto a
            lista de concluídas está aberta. */}
        {dificuldades.map((d) => {
          const isAtiva = !verConcluidas && ativa === d.id;
          return (
            <TouchableOpacity
              key={d.id}
              onPress={() => {
                setAtiva(d.id);
                setVerConcluidas(false);
              }}
              style={[styles.aba, isAtiva && styles.abaAtiva]}
              activeOpacity={0.85}
            >
              <Text style={[styles.abaTexto, isAtiva && styles.abaTextoAtivo]}>{d.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Botão separado das abas: alterna para a lista de missões concluídas e
          mostra quantas já foram feitas. */}
      <TouchableOpacity
        style={[styles.botaoConcluidas, verConcluidas && styles.botaoConcluidasAtivo]}
        onPress={() => setVerConcluidas(!verConcluidas)}
        activeOpacity={0.85}
      >
        <Ionicons
          name="checkmark-circle-outline"
          size={20}
          color={verConcluidas ? colors.white : colors.leafDeep}
        />
        <Text style={[styles.botaoConcluidasTexto, verConcluidas && styles.botaoConcluidasTextoAtivo]}>
          {verConcluidas ? 'Voltar às missões' : 'Missões concluídas'}
        </Text>
        <View style={[styles.contador, verConcluidas && styles.contadorAtivo]}>
          <Text style={[styles.contadorTexto, verConcluidas && styles.contadorTextoAtivo]}>
            {concluidas.length}
          </Text>
        </View>
      </TouchableOpacity>

      {/* FlatList (em vez de map dentro de um ScrollView) renderiza apenas os
          itens visíveis na tela, o que mantém a rolagem fluida em listas longas. */}
      <FlatList
        data={missoes}
        // keyExtractor dá a cada item uma identidade estável, para o React saber
        // reaproveitar componentes ao invés de recriar tudo quando a lista muda.
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        // Espaçador desenhado ENTRE os itens (não antes do primeiro nem depois do último).
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        // Mensagem exibida quando a lista está vazia (ex.: nenhuma missão
        // concluída ainda).
        ListEmptyComponent={
          <Text style={styles.vazio}>
            {verConcluidas
              ? 'Você ainda não concluiu nenhuma missão. Conclua uma para ela aparecer aqui!'
              : 'Nenhuma missão nesta categoria.'}
          </Text>
        }
        renderItem={({ item }) => (
          <MissionCard
            missao={item}
            // missoesConcluidas[id] é `true` ou `undefined`. O !! converte
            // para booleano de verdade, que é o que a prop espera.
            concluida={!!missoesConcluidas[item.id]}
            onPress={() => setMissaoSelecionada(item)}
          />
        )}
      />

      {/* O modal fica sempre montado no final da tela; ele mesmo decide se
          aparece ou não com base em `missao` ser null. */}
      <MissionDetailModal
        missao={missaoSelecionada}
        concluida={missaoSelecionada ? !!missoesConcluidas[missaoSelecionada.id] : false}
        pontosAtuais={pontosDeImpacto}
        onFechar={() => setMissaoSelecionada(null)}
        // Ao concluir/desfazer, avisamos o estado global. Os pontos vão junto
        // porque é o contexto que soma tudo para calcular nível e progresso.
        onAlternarConcluida={() => {
          if (missaoSelecionada) {
            alternarMissao(missaoSelecionada.id, missaoSelecionada.pontos);
          }
        }}
      />
    </SafeAreaView>
  );
}

// Estilos: cada chave vira um estilo usado no JSX acima (ex.: `style={styles.card}`).
// StyleSheet.create apenas valida e otimiza os objetos de estilo.
const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  abas: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: colors.muted,
    borderRadius: radius.full,
    padding: 4,
    marginHorizontal: 20,
    marginTop: 16,
  },
  aba: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: radius.full,
    alignItems: 'center',
  },
  abaAtiva: { backgroundColor: colors.leaf },
  abaTexto: {
    fontFamily: fonts.sansBold,
    fontSize: 13,
    fontWeight: '700',
    color: colors.mutedForeground,
  },
  abaTextoAtivo: { color: colors.white },
  // Botão "Missões concluídas": linha própria, abaixo das abas de dificuldade.
  botaoConcluidas: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.accent,
  },
  botaoConcluidasAtivo: { backgroundColor: colors.leaf, borderColor: colors.leaf },
  botaoConcluidasTexto: {
    flex: 1,
    fontFamily: fonts.sansBold,
    fontSize: 14,
    fontWeight: '700',
    color: colors.leafDeep,
  },
  botaoConcluidasTextoAtivo: { color: colors.white },
  // Bolinha com a quantidade de missões concluídas.
  contador: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    paddingHorizontal: 6,
    backgroundColor: colors.leaf,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contadorAtivo: { backgroundColor: colors.white },
  contadorTexto: { fontFamily: fonts.sansBold, fontSize: 12, fontWeight: '700', color: colors.white },
  contadorTextoAtivo: { color: colors.leafDeep },
  lista: { padding: 20, paddingBottom: 40 },
  vazio: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    color: colors.mutedForeground,
    textAlign: 'center',
    marginTop: 24,
    paddingHorizontal: 12,
  },
});
