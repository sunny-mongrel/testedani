/**
 * TELA: MISSÕES (aba "Missões").
 *
 * Lista as missões filtradas por dificuldade (abas Fácil / Médio / Difícil) e,
 * na quarta aba "Concluídas", todas as missões já concluídas (de qualquer
 * dificuldade). Tocar em uma missão abre um modal com os detalhes.
 * Marcar/desmarcar uma missão atualiza o estado global (AppContext), que
 * recalcula pontos e nível para o resto do app.
 *
 * Peças usadas: GradientHeader (topo), MissionCard (cada item da lista) e
 * MissionDetailModal (tela de detalhes + conclusão).
 */
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

// Abas da tela: as 3 dificuldades mais a aba extra "Concluídas".
type Aba = Dificuldade | 'concluidas';
const abas: { id: Aba; label: string }[] = [...dificuldades, { id: 'concluidas', label: 'Concluídas' }];

export default function MissionsScreen() {
  // Aba selecionada. Começa em 'facil'.
  const [ativa, setAtiva] = useState<Aba>('facil');

  // Missão aberta no modal. `null` = modal fechado. Guardamos o objeto inteiro
  // (não só o id) para o modal já ter título, descrição e pontos em mãos.
  const [missaoSelecionada, setMissaoSelecionada] = useState<Missao | null>(null);

  // Vem do estado global: quais missões já foram concluídas, a função que
  // marca/desmarca (e que recalcula pontos e nível automaticamente) e os
  // pontos atuais (o modal usa para avisar se a missão fará subir de nível).
  const { missoesConcluidas, alternarMissao, pontosDeImpacto } = useAppContext();

  // Na aba "Concluídas" filtra todas as missões pelas que já foram feitas;
  // nas demais pega só as da dificuldade ativa (missoesPorDificuldade é um
  // objeto indexado por dificuldade, o que substitui um filter() na lista toda).
  const missoes =
    ativa === 'concluidas'
      ? todasMissoes.filter((m) => missoesConcluidas[m.id])
      : missoesPorDificuldade[ativa];

  return (
    <SafeAreaView style={styles.flex} edges={['top']}>
      <GradientHeader
        title="Missões"
        subtitle="Escolha um desafio e ganhe pontos de impacto"
        colorsSet={gradients.header}
      />

      <View style={styles.abas}>
        {/* Abas Fácil / Médio / Difícil / Concluídas */}
        {abas.map((d) => {
          const isAtiva = ativa === d.id;
          return (
            <TouchableOpacity
              key={d.id}
              onPress={() => setAtiva(d.id)}
              style={[styles.aba, isAtiva && styles.abaAtiva]}
              activeOpacity={0.85}
            >
              {/* numberOfLines + adjustsFontSizeToFit: o texto encolhe um pouco
                  em vez de quebrar, para as 4 abas caberem lado a lado. */}
              <Text
                style={[styles.abaTexto, isAtiva && styles.abaTextoAtivo]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {d.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

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
            {ativa === 'concluidas'
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
    gap: 4,
    backgroundColor: colors.muted,
    borderRadius: radius.full,
    padding: 4,
    marginHorizontal: 20,
    marginTop: 16,
  },
  aba: {
    flex: 1,
    paddingVertical: 9,
    paddingHorizontal: 2,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  abaAtiva: { backgroundColor: colors.leaf },
  abaTexto: {
    fontFamily: fonts.sansBold,
    fontSize: 12,
    fontWeight: '700',
    color: colors.mutedForeground,
  },
  abaTextoAtivo: { color: colors.white },
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
