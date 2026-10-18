/*
 * ESTADO GLOBAL DO APLICATIVO (React Context).
 * O Context permite que qualquer tela leia e altere dados compartilhados sem
 * precisar passá-los de componente em componente (props). Estao aqui:
 * - o resultado do questionário de pegada ecológica;
 * - as missões concluídas e, a partir delas, os pontos de impacto (XP) e o nível;
 * - a "missão diária", sorteada uma vez a cada abertura do app.
 *
 * Como usar em uma tela:  const { nivel, pontosDeImpacto } = useAppContext();
 * - a conta do usuário (login via Supabase).
 *
 * PERSISTÊNCIA:
 * - a conta (cadastro/login) é guardada no Supabase;
 * - a pontuação do questionário é guardada em SQLite (lib/db.ts), ligada à
 *   conta: quem já tem login e já fez o questionário abre direto no app;
 * - as missões concluídas também ficam em SQLite, ligadas à conta. Os pontos de
 *   impacto (XP) e o nível são calculados a partir delas, então voltam
 *   sozinhos quando as missões são carregadas.
 *
 * Sem login, nada é gravado no aparelho: tudo fica só na memória e, ao se
 * cadastrar ou entrar, o que foi feito até ali é ligado à conta.
 */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, supabaseConfigurado } from '../lib/supabase';
import { lerMissoes, lerPontuacao, removerMissao, salvarMissao, salvarPontuacao } from '../lib/db';
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

/** Retorno das ações de conta: `erro` vem preenchido (em português) quando algo falha. */
export type RespostaAuth = {
  erro?: string;
  precisaConfirmarEmail?: boolean;
  /** true quando a conta já tem uma pontuação (do questionário) salva ou acabou de receber uma */
  temPontuacao?: boolean;
};

const ERRO_SEM_CONFIG =
  'O app não encontrou a configuração do Supabase. Confira o arquivo .env e reinicie com "npx expo start -c".';

/** Traduz as mensagens de erro mais comuns do Supabase Auth. */
function traduzirErroAuth(mensagem: string): string {
  const m = mensagem.toLowerCase();
  if (m.includes('invalid login credentials')) return 'E-mail ou senha incorretos.';
  if (m.includes('already registered') || m.includes('already been registered'))
    return 'Este e-mail já está cadastrado. Use "Entrar".';
  if (m.includes('email not confirmed')) return 'Confirme seu e-mail antes de entrar (veja sua caixa de entrada).';
  if (m.includes('rate limit')) return 'Muitas tentativas. Aguarde um pouco e tente de novo.';
  if (m.includes('network') || m.includes('fetch')) return 'Sem conexão com o servidor. Verifique sua internet.';
  return mensagem;
}

/** Estrutura dos dados e funções que o contexto disponibiliza às telas. */
type AppContextValue = {
  /** Usuário logado (null = sem login) e o nome salvo no perfil */
  usuario: { id: string; email: string; nome: string } | null;
  cadastrar: (nome: string, email: string, senha: string) => Promise<RespostaAuth>;
  entrar: (email: string, senha: string) => Promise<RespostaAuth>;
  sair: () => Promise<void>;
  /** true enquanto o app confere se há login salvo e carrega a pontuação (usado para escolher a tela inicial) */
  carregandoInicio: boolean;

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

  // Sessão do Supabase (null = ninguém logado).
  const [session, setSession] = useState<Session | null>(null);
  const userId = session?.user.id ?? null;

  // true até o app descobrir se existe login salvo e, se existir, carregar a
  // pontuação e as missões dele do SQLite. Enquanto isso o app mostra uma tela de carregamento.
  const [carregandoInicio, setCarregandoInicio] = useState(true);

  // Mapeamento id da missão: pontos da missão.
  // Uma missão é concluída somente se o id dela existir aqui.
  // Guardar os pontos junto com o id permite somar tudo sem consultar a lista
  // de missões de novo
  const [pontosPorMissao, setPontosPorMissao] = useState<Record<string, number>>({});

  // Cópias sempre atualizadas do resultado e das missões, para ler dentro de
  // funções assíncronas sem pegar um valor antigo.
  const resultadoRef = useRef(resultado);
  resultadoRef.current = resultado;
  const pontosRef = useRef(pontosPorMissao);
  pontosRef.current = pontosPorMissao;

  // --- Abertura do app: restaura o login salvo e os dados dele -------------
  useEffect(() => {
    let ativo = true;
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!ativo) return;
        setSession(data.session);
        if (data.session) {
          const [salva, missoes] = await Promise.all([
            lerPontuacao(data.session.user.id),
            lerMissoes(data.session.user.id),
          ]);
          if (!ativo) return;
          if (salva) setResultado(salva);
          setPontosPorMissao(missoes);
        }
      } catch (e) {
        console.warn('Abertura do app:', e);
      } finally {
        if (ativo) setCarregandoInicio(false);
      }
    })();
    return () => {
      ativo = false;
    };
  }, []);

  // --- Acompanha entradas e saídas de conta --------------------------------
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_evento, novaSessao) => {
      setSession(novaSessao);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  // --- Ações de conta ------------------------------------------------------
  async function cadastrar(nome: string, email: string, senha: string): Promise<RespostaAuth> {
    if (!supabaseConfigurado) return { erro: ERRO_SEM_CONFIG };
    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
      // O gatilho do banco (schema.sql) copia este "nome" para a tabela profiles.
      options: { data: { nome } },
    });
    if (error) return { erro: traduzirErroAuth(error.message) };
    // Com "Confirm email" ligado no Supabase, não há sessão até o usuário clicar no e-mail.
    if (!data.session) return { precisaConfirmarEmail: true };
    return { temPontuacao: await sincronizarDados(data.session.user.id) };
  }

  async function entrar(email: string, senha: string): Promise<RespostaAuth> {
    if (!supabaseConfigurado) return { erro: ERRO_SEM_CONFIG };
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
    if (error) return { erro: traduzirErroAuth(error.message) };
    return { temPontuacao: await sincronizarDados(data.user.id) };
  }

  async function sair() {
    await supabase.auth.signOut();
    // Limpa pontuação e missões da memória para a próxima pessoa não herdar nada.
    // (Tudo continua guardado no SQLite, nas linhas da conta.)
    setResultado(null);
    setPontosPorMissao({});
  }

  /**
   * Liga os dados da pessoa à conta que acabou de entrar. Retorna true se, ao
   * final, a conta tem uma pontuação de questionário.
   *
   * Pontuação:
   * - Se a conta já tinha pontuação salva (quem está entrando de novo), ela é
   *   carregada e vale a da conta.
   * - Se não tinha (conta nova), o questionário que a pessoa acabou de fazer
   *   (resultado na memória) é gravado na conta: o cadastro "leva" a
   *   pontuação junto.
   *
   * Missões: une as da conta com as feitas antes do login (nada se perde; se
   * a mesma missão estiver nos dois lados, vale o que a conta já tinha). As que
   * só existiam na memória são gravadas na conta.
   */
  async function sincronizarDados(idDaConta: string): Promise<boolean> {
    let temPontuacao = false;
    try {
      const salva = await lerPontuacao(idDaConta);
      if (salva) {
        setResultado(salva);
        temPontuacao = true;
      } else if (resultadoRef.current) {
        await salvarPontuacao(idDaConta, resultadoRef.current);
        temPontuacao = true;
      }

      const daConta = await lerMissoes(idDaConta);
      const daMemoria = pontosRef.current;
      for (const [id, pontos] of Object.entries(daMemoria)) {
        if (daConta[id] === undefined) await salvarMissao(idDaConta, id, pontos);
      }
      setPontosPorMissao({ ...daMemoria, ...daConta });
    } catch (e) {
      console.warn('SQLite (sincronização):', e);
    }
    return temPontuacao;
  }

  // Guarda o resultado do questionário. Com login, grava também no SQLite.
  // useCallback mantém a mesma função entre renderizações (a tela Resultado a
  // chama dentro de um useEffect).
  const definirResultado = useCallback(
    (r: ResultadoQuestionario) => {
      setResultado(r);
      if (userId && r) {
        salvarPontuacao(userId, r).catch((e) => console.warn('SQLite (pontuação):', e));
      }
    },
    [userId],
  );

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
    // Parte do estado mais recente (pontosRef) e copia o objeto: em React
    // nunca se altera o estado diretamente.
    const proximo = { ...pontosRef.current };
    const jaConcluida = proximo[id] !== undefined;

    if (jaConcluida) {
      // Se já está salva, remove para desmarcar
      delete proximo[id];
    } else {
      // Se não estava salva, insere com a pontuação correspondente
      proximo[id] = pontos;
    }

    // Atualiza a cópia já, para dois toques seguidos não lerem o valor antigo.
    pontosRef.current = proximo;
    setPontosPorMissao(proximo);

    // Com login, repete a mudança no SQLite (a tela já foi atualizada acima).
    if (userId) {
      const gravacao = jaConcluida ? removerMissao(userId, id) : salvarMissao(userId, id, pontos);
      gravacao.catch((e) => console.warn('SQLite (missão):', e));
    }
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
    usuario: session
      ? { id: session.user.id, email: session.user.email ?? '', nome: (session.user.user_metadata?.nome as string) || '' }
      : null,
    cadastrar,
    entrar,
    sair,
    carregandoInicio,
    resultado,
    definirResultado,
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
