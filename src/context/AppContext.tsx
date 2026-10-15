/*
 * ESTADO GLOBAL DO APLICATIVO (React Context).
 * O Context permite que qualquer tela leia e altere dados compartilhados sem
 * precisar passá-los de componente em componente (props). Estao aqui:
 * - o resultado do questionário de pegada ecológica;
 * - as missões concluídas e, a partir delas, os pontos de impacto (XP) e o nível;
 * - a "missão diária", sorteada uma vez a cada abertura do app.
 *
 * Como usar em uma tela:  const { nivel, pontosDeImpacto } = useAppContext();
 * obs: os dados ficam apenas na memória. Ao fechar o app, tudo é
 * perdido (não há salvamento em disco nem servidor ainda/sem bd).
 */
import React, { createContext, useContext, useMemo, useState } from 'react';
import { detalhesDoNivel, pontuacaoMaximaMissoes, sortearMissao, type Missao } from '../data/Missoes';

/**
 * Resultado do questionário de pegada ecológica.
 * É `null` até que o usuário responda pela primeira vez.
 * (Preenchido pela tela Resultado; lido pela Home e pela tela Pegada.)
 */
export type ResultadoQuestionario = {
  pontuacao: number;      // Soma dos pesos das respostas (maior = pior para o planeta)
  classificacao: string;  // Título do resultado
} | null;

/** Estrutura dos dados e funções que o contexto disponibiliza às telas. */
type AppContextValue = {
  resultado: ResultadoQuestionario;
  definirResultado: (r: ResultadoQuestionario) => void;

  /** Dicionário contendo os ids das missões concluídas { [id]: true } */
  missoesConcluidas: Record<string, boolean>;
  /** Alterna o estado de conclusão de uma missão (marca/desmarca) */
  alternarMissao: (id: string, pontos: number) => void;

  pontosDeImpacto: number;  // Soma total de pontos das missões concluídas
  nivel: number;            // Nível (1 a 20) calculado a partir da pontuação total
  progressoNivel: number;   // Percentual (0 a 1) para o próximo nível
  xpNoNivel: number;        // XP já juntado dentro do nível atual (o "X" de "X de Y")
  xpNecessario: number;     // XP que o nível atual exige para subir (o "Y"); 0 no nível máximo

  /** Missão sorteada ao abrir o app, exibida como "Missão diária" na Home */
  missaoDoDia: Missao;
};

// Criação do contexto. O valor inicial `undefined` permite detectar, em
// useAppContext, quando alguém tenta usá-lo fora do <AppProvider>.
const AppContext = createContext<AppContextValue | undefined>(undefined);

/**
 * Provedor do Contexto Global.
 * Envolve a navegação inteira em App.tsx; tudo que estiver dentro dele pode usar
 * o hook useAppContext().
 */
export function AppProvider({ children }: { children: React.ReactNode }) {
  // Estado para armazenar o resultado do teste de pegada ecológica
  const [resultado, setResultado] = useState<ResultadoQuestionario>(null);

  // Mapeamento id da missão: pontos da missão.
  // Uma missão é concluída somente se o id dela existir aqui.
  // Guardar os pontos junto com o id permite somar tudo sem consultar a lista
  // de missões de novo
  const [pontosPorMissao, setPontosPorMissao] = useState<Record<string, number>>({});

  // Deriva o mapa booleano de missões concluídas a partir de 'pontosPorMissao'.
  // useMemo evita recalcular a cada renderização: só refaz quando o estado muda.
  const missoesConcluidas = useMemo(() => {
    const mapa: Record<string, boolean> = {};
    Object.keys(pontosPorMissao).forEach((id) => {
      mapa[id] = true;
    });
    return mapa;
  }, [pontosPorMissao]);

  /**
   * Marca ou desmarca uma missão como concluída.
   * Ao marcar, os pontos passam a contar; ao desmarcar, são subtraídos.
   */
  function alternarMissao(id: string, pontos: number) {
    // A forma com função `(atual) => ...` garante que trabalhamos sobre o
    // estado mais recente, mesmo que duas atualizações aconteçam juntas.
    setPontosPorMissao((atual) => {
      // Copia o objeto: em React nunca se altera o estado diretamente.
      const proximo = { ...atual };

      if (proximo[id] !== undefined) {
        // Se já está salva, remove para desmarcar
        delete proximo[id];
      } else {
        // Se não estava salva, insere com a pontuação correspondente
        proximo[id] = pontos;
      }

      return proximo;
    });
  }

  // Calcula a soma total dos pontos de impacto do usuário
  const pontosDeImpacto = useMemo(
    () => Object.values(pontosPorMissao).reduce((total, p) => total + p, 0),
    [pontosPorMissao],
  );

  // Missão diária: sorteada UMA vez quando o Provider é criado (ou seja, a
  // cada vez que o app é aberto). A função passada ao useState só roda na
  // primeira renderização, então a missão não muda ao trocar de aba ou ao
  // concluir missões; só muda na próxima abertura do app.
  const [missaoDoDia] = useState<Missao>(() => sortearMissao());

  // Nível (1 a 20) e progresso dentro do nível. Cada nível exige mais XP que o
  // anterior (40, 45, 50, ... XP); as regras estão em data/Missoes.ts.
  const { nivel, progresso: progressoNivel, xpAtual: xpNoNivel, xpNecessario } =
    detalhesDoNivel(pontosDeImpacto);

  // Objeto exposto pelo Provider: é o que as telas recebem em useAppContext().
  const value: AppContextValue = {
    resultado,
    definirResultado: setResultado,
    missoesConcluidas,
    alternarMissao,
    pontosDeImpacto,
    nivel,
    progressoNivel,
    xpNoNivel,
    xpNecessario,
    missaoDoDia,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/**
 * Hook para acessar o estado global a partir de qualquer tela ou componente.
 * Lança um erro explicativo caso seja usado fora do <AppProvider>.
 */
export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext deve ser usado dentro de <AppProvider>');
  }
  return ctx;
}

// Reexportação de conveniência: permite importar a pontuação máxima possível
// das missões (soma de todas) direto do contexto.
export { pontuacaoMaximaMissoes };
