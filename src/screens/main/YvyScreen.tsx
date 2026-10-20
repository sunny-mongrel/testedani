/**
 * TELA: MASCOTE YVY (aba "Yvy").
 *
 * Yvy é a ararinha-azul mascote do app. Por enquanto esta é uma tela estática
 * de "em breve": não tem estado nem lógica, apenas conteúdo. A ideia futura
 * (descrita no texto da tela) é conversar com a Yvy e cuidar dela conforme o
 * usuário sobe de nível.
 */
import React, { useRef, useState } from 'react';
import { Image, PanResponder, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AccessoryArt } from '../../components/AccessoryArt';
import { GradientHeader } from '../../components/GradientHeader';
import { acessorios, categoriasAcessorios, type CategoriaAcessorio } from '../../data/Acessorios';
import { useAppContext, type PosicaoAcessorio } from '../../context/AppContext';
import { colors, gradients, radius } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

export default function YvyScreen() {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<'Todos' | CategoriaAcessorio>('Todos');
  const [tamanhoAvatar, setTamanhoAvatar] = useState({ width: 0, height: 0 });
  const [idAcessorioSelecionado, setIdAcessorioSelecionado] = useState<string | null>(null);
  const [arrastandoAcessorio, setArrastandoAcessorio] = useState(false);
  const {
    acessoriosEquipados,
    alternarAcessorio,
    limparAcessorios,
    posicoesAcessorios,
    definirPosicaoAcessorio,
    redefinirPosicoesAcessorios,
    escalasAcessorios,
    definirEscalaAcessorio,
  } = useAppContext();
  const listaVisivel = categoriaSelecionada === 'Todos'
    ? acessorios
    : acessorios.filter((item) => item.categoria === categoriaSelecionada);
  const itensEquipados = acessorios.filter((item) => acessoriosEquipados[item.slot] === item.id);
  const acessorioSelecionado = itensEquipados.find((item) => item.id === idAcessorioSelecionado);
  const escalaSelecionada = acessorioSelecionado ? escalasAcessorios[acessorioSelecionado.id] ?? 1 : 1;

  function ajustarEscalaSelecionada(delta: number) {
    if (!acessorioSelecionado) return;

    const novaEscala = Math.max(0.6, Math.min(2.2, Math.round((escalaSelecionada + delta) * 10) / 10));
    definirEscalaAcessorio(acessorioSelecionado.id, novaEscala);

    if (tamanhoAvatar.width === 0 || tamanhoAvatar.height === 0) return;
    const posicao = posicoesAcessorios[acessorioSelecionado.id] ?? {
      x: acessorioSelecionado.x,
      y: acessorioSelecionado.y,
    };
    const margemX = (32 * novaEscala / tamanhoAvatar.width) * 100;
    const margemY = (32 * novaEscala / tamanhoAvatar.height) * 100;
    definirPosicaoAcessorio(acessorioSelecionado.id, {
      x: Math.max(margemX, Math.min(100 - margemX, posicao.x)),
      y: Math.max(margemY, Math.min(100 - margemY, posicao.y)),
    });
  }

  return (
    <SafeAreaView style={styles.flex} edges={['top']}>
      <GradientHeader title="Yvy" subtitle="Sua ararinha-azul companheira" colorsSet={gradients.blue} />

      <ScrollView
        scrollEnabled={!arrastandoAcessorio}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        <View style={styles.previewCabecalho}>
          <View>
            <Text style={styles.secaoTitulo}>Visual da Yvy</Text>
            <Text style={styles.secaoSubtitulo}>
              {itensEquipados.length === 0 ? 'Pronta para ganhar estilo' : `${itensEquipados.length} ${itensEquipados.length === 1 ? 'acessório equipado' : 'acessórios equipados'}`}
            </Text>
          </View>
          <View style={styles.acoesPreview}>
            {Object.keys(posicoesAcessorios).length > 0 && (
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Restaurar posições iniciais"
                onPress={redefinirPosicoesAcessorios}
                style={styles.limparBotao}
              >
                <Ionicons name="locate-outline" size={16} color={colors.macawDeep} />
                <Text style={styles.limparTexto}>Posições</Text>
              </TouchableOpacity>
            )}
            {itensEquipados.length > 0 && (
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Remover todos os acessórios"
                onPress={limparAcessorios}
                style={styles.limparBotao}
              >
                <Ionicons name="refresh-outline" size={16} color={colors.macawDeep} />
                <Text style={styles.limparTexto}>Limpar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {acessorioSelecionado && (
          <View style={styles.controleTamanho}>
            <View style={styles.controleTextoArea}>
              <Text style={styles.controleNome} numberOfLines={1}>{acessorioSelecionado.nome}</Text>
              <Text style={styles.controleLegenda}>Tamanho</Text>
            </View>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={`Diminuir ${acessorioSelecionado.nome}`}
              accessibilityState={{ disabled: escalaSelecionada <= 0.6 }}
              disabled={escalaSelecionada <= 0.6}
              onPress={() => ajustarEscalaSelecionada(-0.1)}
              style={[styles.controleEscalaBotao, escalaSelecionada <= 0.6 && styles.controleDesativado]}
            >
              <Ionicons name="remove" size={19} color={colors.macawDeep} />
            </TouchableOpacity>
            <Text style={styles.controleEscalaValor}>{Math.round(escalaSelecionada * 100)}%</Text>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={`Aumentar ${acessorioSelecionado.nome}`}
              accessibilityState={{ disabled: escalaSelecionada >= 2.2 }}
              disabled={escalaSelecionada >= 2.2}
              onPress={() => ajustarEscalaSelecionada(0.1)}
              style={[styles.controleEscalaBotao, escalaSelecionada >= 2.2 && styles.controleDesativado]}
            >
              <Ionicons name="add" size={19} color={colors.macawDeep} />
            </TouchableOpacity>
          </View>
        )}

        <View
          style={styles.avatarStage}
          onLayout={({ nativeEvent }) => setTamanhoAvatar({
            width: nativeEvent.layout.width,
            height: nativeEvent.layout.height,
          })}
        >
          <Image
            source={require('../../../assets/yvy-mascot.png')}
            accessibilityLabel="Yvy, a ararinha-azul"
            resizeMode="contain"
            style={styles.avatar}
          />
          {itensEquipados.map((item) => (
            <AcessorioArrastavel
              key={item.id}
              id={item.id}
              nome={item.nome}
              camada={item.camada}
              posicao={posicoesAcessorios[item.id] ?? { x: item.x, y: item.y }}
              escala={escalasAcessorios[item.id] ?? 1}
              larguraAvatar={tamanhoAvatar.width}
              alturaAvatar={tamanhoAvatar.height}
              aoMover={definirPosicaoAcessorio}
              aoSelecionar={setIdAcessorioSelecionado}
              aoArrastar={setArrastandoAcessorio}
            />
          ))}
        </View>

        <View style={styles.sacolaCabecalho}>
          <View style={styles.sacolaIcone}>
            <Ionicons name="bag-handle-outline" size={20} color={colors.macawDeep} />
          </View>
          <View style={styles.sacolaTextoArea}>
            <Text style={styles.secaoTitulo}>Sacola de acessórios</Text>
            <Text style={styles.secaoSubtitulo}>{acessorios.length} itens na coleção</Text>
          </View>
          <View style={styles.contador}>
            <Text style={styles.contadorTexto}>{itensEquipados.length}</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtros}>
          {categoriasAcessorios.map((categoria) => {
            const selecionada = categoriaSelecionada === categoria;
            return (
              <TouchableOpacity
                key={categoria}
                accessibilityRole="button"
                accessibilityState={{ selected: selecionada }}
                onPress={() => setCategoriaSelecionada(categoria)}
                style={[styles.filtro, selecionada && styles.filtroSelecionado]}
              >
                <Text style={[styles.filtroTexto, selecionada && styles.filtroTextoSelecionado]}>{categoria}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.grade}>
          {listaVisivel.map((item) => {
            const equipado = acessoriosEquipados[item.slot] === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                accessibilityRole="button"
                accessibilityLabel={`${equipado ? 'Remover' : 'Equipar'} ${item.nome}`}
                accessibilityState={{ selected: equipado }}
                activeOpacity={0.78}
                onPress={() => alternarAcessorio(item.id, item.slot)}
                style={[styles.item, equipado && styles.itemEquipado]}
              >
                <View style={styles.itemTopo}>
                  <View style={[styles.itemPreview, equipado && styles.itemPreviewEquipado]}>
                    <AccessoryArt id={item.id} size={60} />
                  </View>
                  <View style={[styles.selecao, equipado && styles.selecaoAtiva]}>
                    <Ionicons name={equipado ? 'checkmark' : 'add'} size={15} color={equipado ? colors.white : colors.mutedForeground} />
                  </View>
                </View>
                <Text style={styles.itemNome} numberOfLines={1}>{item.nome}</Text>
                <Text style={[styles.itemEstado, equipado && styles.itemEstadoEquipado]}>
                  {equipado ? 'Equipado' : item.categoria}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type AcessorioArrastavelProps = {
  id: string;
  nome: string;
  camada: number;
  posicao: PosicaoAcessorio;
  escala: number;
  larguraAvatar: number;
  alturaAvatar: number;
  aoMover: (id: string, posicao: PosicaoAcessorio) => void;
  aoSelecionar: (id: string) => void;
  aoArrastar: (arrastando: boolean) => void;
};

function AcessorioArrastavel({
  id,
  nome,
  camada,
  posicao,
  escala,
  larguraAvatar,
  alturaAvatar,
  aoMover,
  aoSelecionar,
  aoArrastar,
}: AcessorioArrastavelProps) {
  const propriedadesAtuais = useRef({ id, posicao, escala, larguraAvatar, alturaAvatar, aoMover, aoSelecionar, aoArrastar });
  propriedadesAtuais.current = { id, posicao, escala, larguraAvatar, alturaAvatar, aoMover, aoSelecionar, aoArrastar };
  const origemDoArraste = useRef(posicao);
  const panResponder = useRef<ReturnType<typeof PanResponder.create> | null>(null);

  if (!panResponder.current) {
    panResponder.current = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        const atual = propriedadesAtuais.current;
        atual.aoArrastar(true);
        atual.aoSelecionar(atual.id);
        const margemX = atual.larguraAvatar > 0 ? (32 * atual.escala / atual.larguraAvatar) * 100 : 0;
        const margemY = atual.alturaAvatar > 0 ? (32 * atual.escala / atual.alturaAvatar) * 100 : 0;
        origemDoArraste.current = {
          x: Math.max(margemX, Math.min(100 - margemX, atual.posicao.x)),
          y: Math.max(margemY, Math.min(100 - margemY, atual.posicao.y)),
        };
      },
      onPanResponderMove: (_, gesto) => {
        const atual = propriedadesAtuais.current;
        if (atual.larguraAvatar === 0 || atual.alturaAvatar === 0) return;

        const margemX = (32 * atual.escala / atual.larguraAvatar) * 100;
        const margemY = (32 * atual.escala / atual.alturaAvatar) * 100;
        const x = Math.max(margemX, Math.min(100 - margemX, origemDoArraste.current.x + (gesto.dx / atual.larguraAvatar) * 100));
        const y = Math.max(margemY, Math.min(100 - margemY, origemDoArraste.current.y + (gesto.dy / atual.alturaAvatar) * 100));
        atual.aoMover(atual.id, { x, y });
      },
      onPanResponderRelease: () => propriedadesAtuais.current.aoArrastar(false),
      onPanResponderTerminate: () => propriedadesAtuais.current.aoArrastar(false),
    });
  }

  return (
    <View
      {...panResponder.current.panHandlers}
      accessibilityRole="button"
      accessibilityLabel={`Acessório ${nome}, movível`}
      style={[
        styles.acessorioSobreposto,
        {
          width: 64 * escala,
          height: 64 * escala,
          marginLeft: -32 * escala,
          marginTop: -32 * escala,
          left: `${posicao.x}%`,
          top: `${posicao.y}%`,
          zIndex: camada,
        },
      ]}
    >
      <AccessoryArt id={id} size={64 * escala} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  conteudo: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 32 },
  previewCabecalho: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  acoesPreview: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  secaoTitulo: { fontFamily: fonts.display, fontSize: 19, fontWeight: '700', color: colors.cardForeground },
  secaoSubtitulo: { fontFamily: fonts.sans, fontSize: 13, color: colors.mutedForeground, marginTop: 1 },
  limparBotao: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 8, paddingLeft: 10 },
  limparTexto: { fontFamily: fonts.sansBold, fontSize: 13, color: colors.macawDeep },
  avatarStage: {
    width: '100%',
    maxWidth: 360,
    aspectRatio: 0.9,
    alignSelf: 'center',
    backgroundColor: '#eff8fc',
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: { width: '100%', height: '76%' },
  acessorioSobreposto: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controleTamanho: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10 },
  controleTextoArea: { flex: 1 },
  controleNome: { fontFamily: fonts.sansBold, fontSize: 13, color: colors.cardForeground },
  controleLegenda: { fontFamily: fonts.sans, fontSize: 11, color: colors.mutedForeground, marginTop: 1 },
  controleEscalaBotao: { width: 34, height: 34, borderWidth: 1, borderColor: colors.border, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white },
  controleDesativado: { opacity: 0.4 },
  controleEscalaValor: { minWidth: 42, textAlign: 'center', fontFamily: fonts.sansBold, fontSize: 13, color: colors.cardForeground },
  sacolaCabecalho: { flexDirection: 'row', alignItems: 'center', marginTop: 24, marginBottom: 13 },
  sacolaIcone: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#e7f4fb', alignItems: 'center', justifyContent: 'center' },
  sacolaTextoArea: { flex: 1, marginLeft: 10 },
  contador: { minWidth: 30, height: 30, borderRadius: 15, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  contadorTexto: { fontFamily: fonts.sansBold, color: colors.leafDeep, fontSize: 13 },
  filtros: { gap: 8, paddingBottom: 14 },
  filtro: { minHeight: 34, borderWidth: 1, borderColor: colors.border, borderRadius: radius.full, paddingHorizontal: 13, justifyContent: 'center', backgroundColor: colors.white },
  filtroSelecionado: { backgroundColor: colors.macawDeep, borderColor: colors.macawDeep },
  filtroTexto: { fontFamily: fonts.sansSemiBold, fontSize: 12, color: colors.mutedForeground },
  filtroTextoSelecionado: { color: colors.white },
  grade: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10 },
  item: { width: '48.5%', minHeight: 126, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 11, backgroundColor: colors.white },
  itemEquipado: { borderColor: colors.macaw, backgroundColor: '#f4faff' },
  itemTopo: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  itemPreview: { width: 68, height: 68, borderRadius: 15, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  itemPreviewEquipado: { backgroundColor: '#e1f1fa' },
  selecao: { width: 25, height: 25, borderRadius: 13, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  selecaoAtiva: { backgroundColor: colors.macaw, borderColor: colors.macaw },
  itemNome: { fontFamily: fonts.sansBold, fontSize: 13, color: colors.cardForeground, marginTop: 7 },
  itemEstado: { fontFamily: fonts.sans, fontSize: 11, color: colors.mutedForeground, marginTop: 1 },
  itemEstadoEquipado: { color: colors.macawDeep, fontFamily: fonts.sansBold },
});
