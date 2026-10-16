import type { NavigatorScreenParams } from '@react-navigation/native';

/*
 * TIPOS DAS ROTAS
 * Cada chave é o nome de uma tela e o valor descreve os parâmetros que ela
 * recebe. `undefined` significa "essa tela não recebe parâmetro".
 * Isso dá autocomplete e evita erros como navegar para uma tela inexistente
 * ou esquecer de enviar um parâmetro obrigatório.
 *
 * Ao criar uma tela nova: primeiro adicione o nome aqui e deppois registra em
 * stack.routes.tsx (pilha) ou navigation/MainTabs.tsx (abas).
 */

/** Telas da pilha principal (fluxo inicial + entrada no app). */
export type RootStackParamList = {
  Onboarding: undefined;
  Questionario: undefined;
  // Resultado exige a pontuação calculada no questionário.
  Resultado: {
    pontuacao: number;
  };
  // MainApp é o conjunto de abas inteiro (veja MainTabParamList).
  MainApp: undefined;
  // Tela de cadastro (nome, e-mail e senha), aberta por Ajustes e pelo botão
  // de perfil da Home. Fica na pilha, por cima das abas (sem barra inferior).
  Cadastro: undefined;
};

/** Rotas acessíveis pelo menu lateral da área principal. */
export type MainDrawerParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  Educacional: undefined;
  SobreNos: undefined;
};

/** Rotas internas das abas; Missoes e Pegada não aparecem na barra inferior. */
export type MainTabParamList = {
  Home: undefined;
  Missoes: undefined;
  Pegada: undefined;
  Yvy: undefined;
  Comunidade: undefined;
  Ajustes: undefined;
};
