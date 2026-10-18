/*
 * BANCO LOCAL (SQLite) — guarda os dados da pessoa NO CELULAR: a pontuação do
 * questionário e as missões concluídas.
 *
 * Diferença para o estado do React (useState): o estado some quando o app
 * fecha; o SQLite fica gravado no aparelho. Cada linha pertence a uma conta
 * (user_id = id do usuário no Supabase), então cada pessoa que entra no app
 * encontra a própria pontuação.
 *
 * Tabelas:
 *  - pontuacao (user_id, pontuacao, classificacao, atualizado_em)
 *      UMA linha por usuário: o resultado mais recente do questionário.
 *  - missoes_concluidas (user_id, missao_id, pontos, concluida_em)
 *      UMA linha por missão concluída. Os pontos de impacto (XP) e o nível não
 *      têm tabela própria: são calculados somando os pontos destas linhas.
 *
 * obs: é um banco local; os dados ficam neste aparelho. Se a pessoa limpar
 * os dados do app ou entrar em outro celular, a pontuação não vem junto.
 */
import * as SQLite from 'expo-sqlite';

export type PontuacaoSalva = {
  pontuacao: number;
  classificacao: string;
};

// O banco é aberto uma única vez e a mesma conexão é reaproveitada.
let conexao: Promise<SQLite.SQLiteDatabase> | null = null;

function abrirBanco() {
  if (!conexao) {
    conexao = SQLite.openDatabaseAsync('ecoara.db').then(async (db) => {
      // IF NOT EXISTS: cria a tabela na primeira vez e ignora nas seguintes.
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS pontuacao (
          user_id       TEXT PRIMARY KEY NOT NULL,
          pontuacao     INTEGER NOT NULL,
          classificacao TEXT NOT NULL,
          atualizado_em TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS missoes_concluidas (
          user_id      TEXT NOT NULL,
          missao_id    TEXT NOT NULL,
          pontos       INTEGER NOT NULL,
          concluida_em TEXT NOT NULL,
          PRIMARY KEY (user_id, missao_id)
        );
      `);
      return db;
    });
  }
  return conexao;
}

/** Grava (ou substitui) a pontuação da conta `userId`. */
export async function salvarPontuacao(userId: string, r: PontuacaoSalva): Promise<void> {
  const db = await abrirBanco();
  await db.runAsync(
    'INSERT OR REPLACE INTO pontuacao (user_id, pontuacao, classificacao, atualizado_em) VALUES (?, ?, ?, ?)',
    userId,
    r.pontuacao,
    r.classificacao,
    new Date().toISOString(),
  );
}

/** Lê a pontuação da conta `userId`; devolve null se ela ainda não fez o questionário. */
export async function lerPontuacao(userId: string): Promise<PontuacaoSalva | null> {
  const db = await abrirBanco();
  return db.getFirstAsync<PontuacaoSalva>(
    'SELECT pontuacao, classificacao FROM pontuacao WHERE user_id = ?',
    userId,
  );
}

/** Marca uma missão como concluída na conta (se já estava, só atualiza os pontos). */
export async function salvarMissao(userId: string, missaoId: string, pontos: number): Promise<void> {
  const db = await abrirBanco();
  await db.runAsync(
    'INSERT OR REPLACE INTO missoes_concluidas (user_id, missao_id, pontos, concluida_em) VALUES (?, ?, ?, ?)',
    userId,
    missaoId,
    pontos,
    new Date().toISOString(),
  );
}

/** Desmarca uma missão: apaga a linha dela na conta. */
export async function removerMissao(userId: string, missaoId: string): Promise<void> {
  const db = await abrirBanco();
  await db.runAsync('DELETE FROM missoes_concluidas WHERE user_id = ? AND missao_id = ?', userId, missaoId);
}

/** Lê as missões concluídas da conta, no formato { [id]: pontos } usado pelo AppContext. */
export async function lerMissoes(userId: string): Promise<Record<string, number>> {
  const db = await abrirBanco();
  const linhas = await db.getAllAsync<{ missao_id: string; pontos: number }>(
    'SELECT missao_id, pontos FROM missoes_concluidas WHERE user_id = ?',
    userId,
  );
  const mapa: Record<string, number> = {};
  linhas.forEach((l) => {
    mapa[l.missao_id] = l.pontos;
  });
  return mapa;
}
