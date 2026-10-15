/*
 * TELA: QUESTIONÁRIO DA PEGADA ECOLÓGICA.
 *
 * Mostra uma pergunta por vez (dados em data/Perguntas.ts). Cada opção tem um
 * "peso". No fim, é somado todos os pesos e enviado o total
 * para a tela de resultado, que interpreta esse número.
 *
 * O usuário pode voltar e mudar respostas: as escolhas anteriores ficam
 * guardadas e são exibidas de novo marcadas.
 *
 * Também é aberta pela tela "Pegada" quando o usuário quer refazer o teste.
 */
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { perguntas } from '../data/Perguntas';
import { RootStackParamList } from '../routes/routes.types';
import { colors, radius } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { PrimaryButton } from '../components/PrimaryButton';

type Props = NativeStackScreenProps<RootStackParamList, 'Questionario'>;

export default function Questionario({ navigation }: Props) {
  // Índice da pergunta que está sendo exibida no momento (começa em 0).
  const [indice, setIndice] = useState(0);

  // Pesos já confirmados, guardados na mesma posição da pergunta.
  const [respostas, setRespostas] = useState<number[]>([]);

  // Qual opção foi escolhida em cada pergunta (o índice dela, não o peso).
  // Precisamos disso separado dos pesos para conseguir remarcar visualmente
  // a alternativa certa quando o usuário volta para uma pergunta anterior.
  const [opcoesSelecionadas, setOpcoesSelecionadas] = useState<number[]>([]);

  // Opção marcada na tela agora. `null` = nada marcado ainda (botão Próxima fica desabilitado).
  const [opcaoSelecionada, setOpcaoSelecionada] = useState<number | null>(null);

  // Dados derivados: são recalculados a cada renderização a partir do estado,
  // por isso não precisam de useState próprio.
  const perguntaAtual = perguntas[indice];
  const ultimaPergunta = indice === perguntas.length - 1;

  /**
   * Confirma a resposta atual e avança, ou finaliza o questionário.
   */
  function avancar() {
    // Trava de segurança: sem opção marcada não há o que registrar.
    // (O botão já fica desabilitado nesse caso,proteção extra.)
    if (opcaoSelecionada === null) {
      return;
    }

    // Busca o objeto da opção escolhida para pegar o peso dela.
    const opcao = perguntaAtual.opcoes[opcaoSelecionada];

    if (!opcao) {
      return;
    }

    // Copiamos os arrays antes de alterar. Em React o estado nunca e modificado
    // diretamente (respostas[indice] = x seria errado): o React compara
    // referências e não perceberia a mudança.
    const respostasAtualizadas = [...respostas];
    const opcoesAtualizadas = [...opcoesSelecionadas];

    // Grava na posição da pergunta atual. Como usamos o índice como posição,
    // responder de novo a mesma pergunta simplesmente sobrescreve o valor
    // anterior — nunca duplica a pontuação.
    respostasAtualizadas[indice] = opcao.peso;
    opcoesAtualizadas[indice] = opcaoSelecionada;

    // CASO 1: ainda tem perguntas pela frente.
    if (indice < perguntas.length - 1) {
      setIndice(indice + 1);
      setRespostas(respostasAtualizadas);
      setOpcoesSelecionadas(opcoesAtualizadas);

      // Se o usuário já tinha respondido a próxima pergunta (voltou e avançou
      // de novo), reexibimos a escolha dele. Caso contrário, limpamos a seleção.
      setOpcaoSelecionada(opcoesAtualizadas[indice + 1] ?? null);
      return;
    }

    // CASO 2: era a última pergunta: calcula o total e vai para o Resultado.
    // reduce percorre o array somando todos os pesos em um único número.
    navigation.navigate('Resultado', {
      pontuacao: respostasAtualizadas.reduce((total, resposta) => total + resposta, 0),
    });
  }

  /**
   * Volta uma pergunta. Se já estiver na primeira, sai da tela.
   * Note que NÃO apagamos as respostas ao voltar: elas continuam guardadas
   * e são reaproveitadas quando o usuário avança novamente.
   */
  function voltar() {
    if (indice === 0) {
      navigation.goBack();
      return;
    }

    const indiceAnterior = indice - 1;
    setIndice(indiceAnterior);
    // Reexibe marcada a alternativa que o usuário tinha escolhido antes.
    setOpcaoSelecionada(opcoesSelecionadas[indiceAnterior] ?? null);
  }

  // Proteção contra o arquivo de perguntas estar vazio: sem isso a tela
  // quebraria ao tentar ler `perguntaAtual.opcoes` de algo indefinido.
  if (!perguntaAtual) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <Text style={styles.pergunta}>Nenhuma pergunta cadastrada.</Text>
        <PrimaryButton label="Voltar" onPress={() => navigation.goBack()} />
      </SafeAreaView>
    );
  }

  return (
    // SafeAreaView do react-native-safe-area-context: o do próprio React Native
    // só funciona no ios e não protege o Android. `edges` reserva o espaço da
    // barra de status/notch (top) e da barra de gestos (bottom).
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Topo: contador + barra de progresso, com respiro da barra de status */}
      <View style={styles.topo}>
        <Text style={styles.contador}>
          Pergunta {indice + 1} de {perguntas.length}
        </Text>
        <View style={styles.barraProgresso}>
          {/* Largura em porcentagem: pergunta 3 de 15 -> (3 / 15) * 100 = 20% */}
          <View
            style={[
              styles.progresso,
              { width: `${((indice + 1) / perguntas.length) * 100}%` },
            ]}
          />
        </View>
      </View>

      {/* Meio: pergunta + opções centralizadas na vertical. O flexGrow: 1 faz o
          conteúdo ocupar o espaço livre e o justifyContent: 'center' o centraliza.
          Em telas muito pequenas o ScrollView permite rolar em vez de cortar. */}
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
      >
        {/* Caixa da pergunta com altura fixa: assim as opções começam sempre
            na mesma posição, seja a pergunta curta ou longa.
            adjustsFontSizeToFit reduz a fonte (até 85%) se o texto não couber. */}
        <View style={styles.perguntaBox}>
          <Text style={styles.pergunta} numberOfLines={4} adjustsFontSizeToFit minimumFontScale={0.85}>
            {indice + 1}. {perguntaAtual.pergunta}
          </Text>
        </View>

        {/* Gera um botão para cada alternativa da pergunta atual. */}
        {perguntaAtual.opcoes.map((opcao, opcaoIndex) => {
          const selecionada = opcaoSelecionada === opcaoIndex;
          return (
            <TouchableOpacity
              key={opcao.texto}
              style={[styles.botaoOpcao, selecionada && styles.botaoSelecionado]}
              // Tocar apenas marca a opção. A resposta só é confirmada no "Próxima".
              onPress={() => setOpcaoSelecionada(opcaoIndex)}
              activeOpacity={0.85}
            >
              <Text
                style={[styles.textoOpcao, selecionada && styles.textoSelecionado]}
                numberOfLines={4}
                adjustsFontSizeToFit
                minimumFontScale={0.85}
              >
                {opcao.texto}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Rodapé fixo com os botões de navegação entre perguntas. */}
      <View style={styles.rodape}>
        <PrimaryButton
          label="Voltar"
          variant="outline"
          onPress={voltar}
          style={styles.botaoRodape}
        />
        <PrimaryButton
          // O texto do botão muda na última pergunta.
          label={ultimaPergunta ? 'Ver resultado' : 'Próxima'}
          onPress={avancar}
          // Impede avançar sem escolher uma alternativa.
          disabled={opcaoSelecionada === null}
          style={styles.botaoRodape}
        />
      </View>
    </SafeAreaView>
  );
}

// Alturas fixas: todos os balões de resposta têm exatamente o mesmo tamanho e
// a caixa da pergunta também, então nada "pula" de lugar entre as perguntas.
const ALTURA_PERGUNTA = 88;
const ALTURA_OPCAO = 84;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 20 },
  topo: { paddingTop: 16 },
  contador: {
    fontFamily: fonts.sansBold,
    fontSize: 14,
    fontWeight: '700',
    color: colors.mutedForeground,
    marginBottom: 10,
    textAlign: 'center',
  },
  barraProgresso: {
    height: 10,
    // overflow hidden faz a barra interna respeitar o canto arredondado.
    overflow: 'hidden',
    backgroundColor: colors.muted,
    borderRadius: radius.full,
  },
  progresso: {
    height: '100%',
    backgroundColor: colors.leaf,
    borderRadius: radius.full,
  },
  // flexGrow + justifyContent center = bloco centralizado verticalmente.
  conteudo: { flexGrow: 1, justifyContent: 'center', paddingVertical: 16 },
  perguntaBox: {
    height: ALTURA_PERGUNTA,
    justifyContent: 'center',
    marginBottom: 12,
  },
  pergunta: {
    fontFamily: fonts.display,
    fontSize: 19,
    fontWeight: '700',
    color: colors.cardForeground,
    lineHeight: 26,
    textAlign: 'center',
  },
  botaoOpcao: {
    height: ALTURA_OPCAO,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    marginVertical: 5,
    borderRadius: radius.lg,
    // Texto centralizado dentro do balão, em qualquer tamanho de resposta.
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Estilo aplicado por cima do normal quando a opção está marcada.
  botaoSelecionado: {
    borderColor: colors.leaf,
    backgroundColor: colors.accent,
  },
  textoOpcao: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    lineHeight: 18,
    color: colors.cardForeground,
    textAlign: 'center',
  },
  // Mesma fonte/peso do texto normal: só muda a cor, para o texto não
  // reflowar (ficar mais largo) e mudar de linhas ao selecionar.
  textoSelecionado: { color: colors.leafDeep },
  rodape: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 16,
  },
  // flex: 1 nos dois botões faz cada um ocupar metade da largura.
  botaoRodape: { flex: 1, marginTop: 0 },
});
