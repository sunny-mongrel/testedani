export type CategoriaAcessorio = 'Cabeça' | 'Rosto' | 'Pescoço' | 'Costas' | 'Detalhes';

export type Acessorio = {
  id: string;
  nome: string;
  categoria: CategoriaAcessorio;
  slot: string;
  x: number;
  y: number;
  camada: number;
};

export const categoriasAcessorios: Array<'Todos' | CategoriaAcessorio> = [
  'Todos',
  'Cabeça',
  'Rosto',
  'Pescoço',
  'Costas',
  'Detalhes',
];

export const acessorios: Acessorio[] = [
  { id: 'coroa-folhas', nome: 'Coroa de folhas', categoria: 'Cabeça', slot: 'cabeca', x: 49, y: 14, camada: 4 },
  { id: 'flor-amarela', nome: 'Flor amarela', categoria: 'Cabeça', slot: 'enfeite-cabeca', x: 37, y: 19, camada: 5 },
  { id: 'oculos-sol', nome: 'Óculos de sol', categoria: 'Rosto', slot: 'rosto', x: 49, y: 22, camada: 6 },
  { id: 'lenco-verde', nome: 'Lenço verde', categoria: 'Pescoço', slot: 'pescoco', x: 49, y: 40, camada: 3 },
  { id: 'mochila', nome: 'Mochila', categoria: 'Costas', slot: 'costas', x: 66, y: 54, camada: 1 },
  { id: 'lacinho', nome: 'Laço azul', categoria: 'Detalhes', slot: 'enfeite-asa', x: 35, y: 55, camada: 2 },
  { id: 'broche-folha', nome: 'Broche de folha', categoria: 'Detalhes', slot: 'broche', x: 56, y: 48, camada: 7 },
  { id: 'varinha-flor', nome: 'Flor silvestre', categoria: 'Detalhes', slot: 'item-mao', x: 42, y: 74, camada: 8 },
];