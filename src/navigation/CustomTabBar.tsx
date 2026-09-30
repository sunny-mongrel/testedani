/*
 * BARRA DE ABAS PERSONALIZADA (menu inferior).
 * O React Navigation desenharia uma barra padrão, mas foi substituido por
 * esta para controlar cores, formato do ícone ativo e rótulos em português.
 * A barra recebe `state` (qual aba está ativa e quais existem) e `navigation`.
 * É conectada às abas em MainTabs.tsx, pela propriedade `tabBar`.
 *
 * Para adicionar uma aba nova: cadastre a rota em MainTabs.tsx e inclua o
 * ícone em ICONS e o rótulo em LABELS abaixo.
 */
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radius } from '../theme/colors';
import { fonts } from '../theme/fonts';

// Mapeia o nome da rota para o ícone. `lib` indica de qual pacote de ícones
// ele vem, já que "bird" só existe no MaterialCommunityIcons.
const ICONS: Record<
  string,
  { lib: 'ion' | 'mci'; name: string }
> = {
  Home: { lib: 'ion', name: 'home-outline' },
  Missoes: { lib: 'ion', name: 'planet-outline' },
  Pegada: { lib: 'ion', name: 'footsteps-outline' },
  Yvy: { lib: 'mci', name: 'bird' },
  Comunidade: { lib: 'ion', name: 'people-outline' },
  Ajustes: { lib: 'ion', name: 'settings-outline' },
};

// Rótulos em português. As rotas têm nomes técnicos ("Home", "Missoes") e
// aqui traduzimos para o texto que aparece na tela.
const LABELS: Record<string, string> = {
  Home: 'Início',
  Missoes: 'Missões',
  Pegada: 'Pegada',
  Yvy: 'Yvy',
  Comunidade: 'Comunidade',
  Ajustes: 'Ajustes',
};

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  // Espaço ocupado por elementos do sistema. Usamos para a barra não ficar escondida atrás deles.
  const insets = useSafeAreaInsets();

  return (
    // Math.max(insets.bottom, 6) garante um respiro mínimo de 6px mesmo em
    // aparelhos sem barra de gestos (onde insets.bottom seria 0).
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 6) }]}>
      {/* Percorre as rotas cadastradas em MainTabs e desenha um botão para cada. */}
      {state.routes.map((route, index) => {
        // state.index guarda a posição da aba ativa. Comparando com o índice
        // desta aba descobrimos se ela é a selecionada.
        const isActive = state.index === index;

        // O ?? é um fallback: se alguém adicionar uma aba nova e esquecer de
        // cadastrar aqui, é mostrado um ícone/rótulo genérico em vez de quebrar.
        const icon = ICONS[route.name] ?? { lib: 'ion', name: 'ellipse-outline' };
        const label = LABELS[route.name] ?? route.name;

        function onPress() {
          // Emite o evento 'tabPress'. 
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          // Só navega se não estiver já nesta aba e se ninguém cancelou o evento.
          if (!isActive && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        }

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            activeOpacity={0.7}
            style={styles.item}
          >
            {/* Quando ativo, um círculo verde claro aparece atrás do ícone. */}
            <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}>
              {/* Escolhe o componente de ícone conforme a biblioteca indicada
                  no mapa ICONS. O `as keyof typeof ...` serve apenas para o
                  ts aceitar a string como um nome de ícone válido. */}
              {icon.lib === 'ion' ? (
                <Ionicons
                  name={icon.name as keyof typeof Ionicons.glyphMap}
                  size={22}
                  color={isActive ? colors.leafDeep : colors.mutedForeground}
                />
              ) : (
                <MaterialCommunityIcons
                  name={icon.name as keyof typeof MaterialCommunityIcons.glyphMap}
                  size={22}
                  color={isActive ? colors.leafDeep : colors.mutedForeground}
                />
              )}
            </View>
            <Text style={[styles.label, isActive && styles.labelActive]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// Estilos: cada chave vira um estilo usado no JSX acima 
// StyleSheet.create apenas valida e otimiza os objetos de estilo.
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: 'rgba(255,255,255,0.97)',
    paddingTop: 8,
    paddingHorizontal: 4,
  },
  item: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: 4 },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: { backgroundColor: 'rgba(46,204,113,0.15)' },
  label: {
    fontFamily: fonts.sansBold,
    fontSize: 10,
    fontWeight: '700',
    color: colors.mutedForeground,
  },
  labelActive: { color: colors.leafDeep },
});
