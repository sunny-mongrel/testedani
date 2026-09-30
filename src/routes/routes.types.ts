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
};

/** Nomes das seis abas da parte principal do app (nenhuma recebe parâmetro). */
export type MainTabParamList = {
  Home: undefined;
  Missoes: undefined;
  Pegada: undefined;
  Yvy: undefined;
  Comunidade: undefined;
  Ajustes: undefined;
};
