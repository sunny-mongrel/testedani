/*
 * DADOS: MISSÕES E SISTEMA DE NÍVEIS.
 * Esse arquivo possui:
 *  1. o formato de uma missão (tipo `Missao`);
 *  2. as regras de pontos e níveis (calcularNivel, progressoDoNivel);
 *  3. a lista das 34 missões, divididas em fácil (9), médio (16) e difícil (9);
 *  4. funções auxiliares para buscar/escolher missões.
 *
 * Quem usa: AppContext (calcula nível), tela Missões (lista por dificuldade),
 * MissionDetailModal (prevê subida de nível) e Home (nível e progresso).
 *
 * Para criar uma missão nova: acrescente um objeto em `facil`, `medio` ou
 * `dificil`, com `id` ÚNICO (f = fácil, m = médio, d = difícil). O ícone é
 * escolhido automaticamente (`withIcons`).
 */

/** Categorias de dificuldade. Também são as chaves de `missoesPorDificuldade`. */
export type Dificuldade = 'facil' | 'medio' | 'dificil';

/** Uma missão do app. */
export type Missao = {
  id: string;           // Identificador único (ex.: 'f1'); usado para marcar como concluída
  titulo: string;       // Nome curto exibido no cartão
  frase: string;        // Resumo de uma linha (o que fazer)
  descricao: string;    // Texto longo em 3 seções; gerado por `montarDescricao`
  pontos: number;       // Pontos de impacto ganhos ao concluir
  dificuldade: Dificuldade;
  icone: string;        // Nome de ícone do Ionicons (preenchido por `withIcons`)
};

/** Abas da tela de Missões: `id` identifica a categoria e `label` é o texto do botão. */
export const dificuldades: { id: Dificuldade; label: string }[] = [
  { id: 'facil', label: 'Fácil' },
  { id: 'medio', label: 'Médio' },
  { id: 'dificil', label: 'Difícil' },
];

// Sistema de níveis: 20 níveis distribuídos igualmente ao longo de 1700
// pontos de impacto (85 pontos por nível). Esses valores são usados pelo
// AppContext para calcular o nível atual do usuário conforme ele conclui
// missões.
export const NIVEL_MAXIMO = 20;
export const PONTOS_TOTAIS_NIVELACAO = 1700;
export const PONTOS_POR_NIVEL = PONTOS_TOTAIS_NIVELACAO / NIVEL_MAXIMO;

/**
 * Nível atual a partir dos pontos de impacto (1 a 20).
 * Nível 1 = 0 pts, nível 2 = 85 pts, ..., nível 20 = 1615 pts (19 x 85).
 * Os pontos das 34 missões somam 1675, nível 20 é alcançável.
 */
//ERRO DE CALCULO EXATO NESSA PARTE, NECESSARIO ORGANIZAR MELHOR AINDA
export function calcularNivel(pontos: number): number {
  // Math.max(0, ...) impede pontos negativos; Math.floor arredonda para baixo
  // (84 pts ainda é nível 1); o "+ 1" faz a contagem começar no nível 1;
  // Math.min limita ao nível máximo.
  const nivel = Math.floor(Math.max(0, pontos) / PONTOS_POR_NIVEL) + 1;
  return Math.min(NIVEL_MAXIMO, nivel);
}

/*
 * Progresso (0 a 1) dentro do nível atual. No nível máximo, a barra fica cheia.
 */
export function progressoDoNivel(pontos: number): number {
  if (calcularNivel(pontos) >= NIVEL_MAXIMO) return 1;
  // O operador % (resto da divisão) dá quantos pontos "sobraram" no nível atual.
  return (Math.max(0, pontos) % PONTOS_POR_NIVEL) / PONTOS_POR_NIVEL;
}

// Ciclo de ícones (Ionicons) usado para variar o visual dos cartões de
// missão dentro de cada dificuldade.
const iconCycle = [
  'water-outline',
  'bulb-outline',
  'stopwatch-outline',
  'flash-outline',
  'document-text-outline',
  'trash-outline',
  'leaf-outline',
  'library-outline',
  'print-outline',
  'shirt-outline',
  'pricetag-outline',
  'cafe-outline',
  'bag-handle-outline',
  'restaurant-outline',
  'bicycle-outline',
  'refresh-outline',
  'navigate-outline',
  'nutrition-outline',
  'cart-outline',
  'people-outline',
  'paw-outline',
  'school-outline',
  'construct-outline',
  'flame-outline',
  'sunny-outline',
  'flower-outline',
  'analytics-outline',
  'earth-outline',
  'megaphone-outline',
];

/**
 * Acrescenta o campo `icone` a cada missão. As missões são escritas sem ícone
 * (`Omit<Missao, 'icone'>` = "uma Missao menos o campo icone") e aqui cada uma
 * recebe o ícone da posição correspondente em `iconCycle`. O `%` faz a lista
 * de ícones recomeçar quando há mais missões do que ícones.
 */
function withIcons(missoes: Omit<Missao, 'icone'>[]): Missao[] {
  return missoes.map((m, i) => ({ ...m, icone: iconCycle[i % iconCycle.length] }));
}

/**
 * Monta o texto longo de uma missão no padrão de 3 seções separadas por linha
 * em branco. O modal de detalhes (MissionDetailModal) separa esse texto de
 * volta em seções; por isso o formato "Título: texto" NAO deve ser alterado.
 */
function montarDescricao(comoFazer: string, porQueFazer: string, impactos: string): string {
  return `Como fazer: ${comoFazer}\n\nPor que fazer: ${porQueFazer}\n\nImpactos: ${impactos}`;
}

// LISTAS DE MISSÕES (uma por dificuldade)
// Pontos: fácil 10-25 | médio 30-60 | difícil 65-90.

const facil: Missao[] = withIcons([
  {
    id: 'f1',
    titulo: 'Torneira Consciente',
    frase: 'Feche a torneira enquanto escova os dentes.',
    descricao: montarDescricao(
      'Ao escovar os dentes, abra a torneira apenas para molhar a escova e, no final, para enxaguar a boca e a escova. Mantenha o fluxo fechado durante todo o tempo de escovação.',
      'Uma torneira aberta pode desperdiçar até 12 litros de água por minuto. Fechá-la é um gesto simples com retorno imediato para a economia do recurso.',
      'Economiza dezenas de litros de água limpa e tratada em uma única escovação e reduz os custos na conta de água.',
    ),
    pontos: 10,
    dificuldade: 'facil',
  },
  {
    id: 'f2',
    titulo: 'Patrulha da Luz',
    frase: 'Seja o responsável por apagar as luzes dos cômodos vazios.',
    descricao: montarDescricao(
      'Ao sair de qualquer ambiente na sua casa, escola ou trabalho, verifique se a luz ficou acesa. Se não houver ninguém no local, apague-a imediatamente.',
      'O consumo desnecessário de lâmpadas acesas acumula gasto energético ao longo do dia sem qualquer utilidade real.',
      'Diminui o consumo de energia elétrica, reduz a pegada de carbono associada à geração de energia e preserva a vida útil das lâmpadas.',
    ),
    pontos: 10,
    dificuldade: 'facil',
  },
  {
    id: 'f3',
    titulo: 'Banho Sonoro',
    frase: 'Tome um banho com a duração de uma música (3 a 4 minutos).',
    descricao: montarDescricao(
      'Coloque uma música de até 4 minutos para tocar antes de ligar o chuveiro. O desafio é se ensaboar e se enxaguar completamente antes de a música acabar.',
      'O chuveiro elétrico é um dos equipamentos que mais consomem energia e água em uma residência.',
      'Economiza cerca de 30 a 40 litros de água por banho e reduz significativamente o pico de consumo elétrico da casa.',
    ),
    pontos: 15,
    dificuldade: 'facil',
  },
  {
    id: 'f4',
    titulo: 'Desligue da Tomada',
    frase: 'Desconecte um aparelho eletrônico em modo standby.',
    descricao: montarDescricao(
      'Identifique carregadores, TVs, videogames ou computadores que estão na tomada sem uso ativo e remova o plugue da parede quando for seguro.',
      'Aparelhos no modo "standby" (espera) continuam consumindo energia continuamente, o chamado "consumo vampiro".',
      'Evita o desperdício invisível de energia e protege os equipamentos contra eventuais picos de tensão na rede.',
    ),
    pontos: 15,
    dificuldade: 'facil',
  },
  {
    id: 'f5',
    titulo: 'Rascunho Inteligente',
    frase: 'Reutilize uma folha de papel antes de pegar uma nova.',
    descricao: montarDescricao(
      'Guarde folhas impressas incorretamente ou usadas apenas de um lado e utilize o verso para anotações, desenhos, cálculos ou rascunhos diários.',
      'A produção de papel consome árvores, grande quantidade de água e energia elétrica.',
      'Duplica a vida útil do papel, reduz a quantidade de resíduos gerados e diminui a demanda por extração de matéria-prima.',
    ),
    pontos: 15,
    dificuldade: 'facil',
  },
  {
    id: 'f6',
    titulo: 'Lixo no Lugar Certo',
    frase: 'Encontre um resíduo fora do lugar e faça o descarte correto.',
    descricao: montarDescricao(
      'Ao caminhar por uma praça, rua, escola ou corredor da empresa, recolha um resíduo deixado no chão e descarte-o no lixo comum ou reciclável apropriado.',
      'Resíduos largados no chão são levados pelas chuvas para bueiros, causando entupimentos e contaminação de vias públicas e rios.',
      'Melhora a higiene e estética do ambiente comunitário e evita que o plástico atinja redes de esgoto e cursos d\u2019água.',
    ),
    pontos: 20,
    dificuldade: 'facil',
  },
  {
    id: 'f7',
    titulo: 'Guardião da Água',
    frase: 'Identifique um vazamento e ajude a contê-lo.',
    descricao: montarDescricao(
      'Observe se há torneiras pingando, vasos sanitários correndo água ou canos úmidos na sua casa ou local de estudo/trabalho. Caso encontre, feche o registro ou avise o responsável pela manutenção.',
      'Uma única torneira pingando pode desperdiçar mais de 46 litros de água por dia.',
      'Evita a perda contínua de água potável e conscientiza sobre a manutenção preventiva das instalações hidráulicas.',
    ),
    pontos: 25,
    dificuldade: 'facil',
  },
  {
    id: 'f8',
    titulo: 'Herói da Biblioteca',
    frase: 'Pegue um livro emprestado em vez de comprar um novo.',
    descricao: montarDescricao(
      'Visite a biblioteca pública, comunitária ou escolar da sua região (ou peça emprestado a um amigo) para ler a sua próxima obra desejada.',
      'O compartilhamento de bens incentiva a economia circular e evita a produção desnecessária de novos materiais.',
      'Reduz a pegada ecológica ligada à produção e transporte de novos livros e fortalece a cultura de uso compartilhado na comunidade.',
    ),
    pontos: 25,
    dificuldade: 'facil',
  },
  {
    id: 'f9',
    titulo: 'Impressão Consciente',
    frase: 'Ajuste a impressora para usar os dois lados da folha.',
    descricao: montarDescricao(
      'Antes de enviar um documento para impressão, selecione a opção "Imprimir nos dois lados" (frente e verso) e imprima apenas o estritamente necessário.',
      'Metade do papel gasto em impressões de uso diário pode ser economizado com uma simples configuração de software.',
      'Corta o consumo de papel pela metade instantaneamente e reduz os custos operacionais com insumos de escritório.',
    ),
    pontos: 25,
    dificuldade: 'facil',
  },
]);

const medio: Missao[] = withIcons([
  {
    id: 'm1',
    titulo: 'Detox do Guarda-Roupa',
    frase: 'Separe 3 peças de roupa para doação ou conserto.',
    descricao: montarDescricao(
      'Abra seu guarda-roupa, selecione três peças em bom estado que você não usa há meses e destine-as para doação ou providencie os reparos necessários para voltar a usá-las.',
      'A indústria têxtil é uma das mais poluentes do mundo. Estender a vida útil das roupas reduz o impacto ambiental do consumo excessivo.',
      'Promove a moda sustentável, reduz o volume de resíduos têxteis nos aterros e apoia pessoas que precisam das doações.',
    ),
    pontos: 40,
    dificuldade: 'medio',
  },
  {
    id: 'm2',
    titulo: 'Detetive de Etiquetas',
    frase: 'Descubra a composição das roupas antes de comprar.',
    descricao: montarDescricao(
      'Antes de adquirir uma peça de vestuário, leia a etiqueta interna. Priorize tecidos naturais ou reciclados e evite fibras sintéticas puras (como o poliéster convencional) sempre que possível.',
      'Fibras sintéticas liberam microplásticos na lavagem, que acabam nos oceanos e entram na cadeia alimentar marinha.',
      'Estimula escolhas de consumo consciente e reduz a demanda por tecidos derivados do petróleo.',
    ),
    pontos: 45,
    dificuldade: 'medio',
  },
  {
    id: 'm3',
    titulo: 'Dia Sem Descartáveis',
    frase: 'Elimine o uso de itens descartáveis por 24 horas.',
    descricao: montarDescricao(
      'Passe o dia utilizando garrafas recarregáveis, canecas de cerâmica/inox, talheres de metal e guardanapos de tecido, recusando pratos, copos e canudos de plástico.',
      'Os descartáveis são usados por poucos minutos, mas levam centenas de anos para se decompor na natureza.',
      'Evita o acúmulo de plástico de uso único e demonstra a viabilidade de uma rotina livre de resíduos banais.',
    ),
    pontos: 55,
    dificuldade: 'medio',
  },
  {
    id: 'm4',
    titulo: 'Sacola Reutilizável',
    frase: 'Faça compras sem aceitar sacolas plásticas descartáveis.',
    descricao: montarDescricao(
      'Leve ecobags, mochilas ou caixas de papelão ao mercado ou feira e recuse as sacolas plásticas oferecidas no caixa.',
      'Sacolas plásticas finas são difíceis de reciclar, rasgam com facilidade e são grandes causadoras de poluição em áreas urbanas e marinhas.',
      'Diminui a circulação de embalagens plásticas e incentiva o hábito de carregar seus próprios recipientes.',
    ),
    pontos: 50,
    dificuldade: 'medio',
  },
  {
    id: 'm5',
    titulo: 'Adeus, Copinho!',
    frase: 'Substitua copos descartáveis por uma caneca ou copo reutilizável.',
    descricao: montarDescricao(
      'Mantenha um copo ou caneca lavável na sua mesa de trabalho, estudo ou na mochila para tomar água e café ao longo do dia.',
      'O uso diário de múltiplos copos descartáveis para água e café gera um volume enorme de lixo evitável.',
      'Reduz a produção de resíduos plásticos/isopor diários no ambiente corporativo e escolar.',
    ),
    pontos: 45,
    dificuldade: 'medio',
  },
  {
    id: 'm6',
    titulo: 'Embaixador EcoAra',
    frase: 'Ensine um hábito sustentável a outra pessoa.',
    descricao: montarDescricao(
      'Escolha uma prática ecológica (como a separação de resíduos ou economia de água) e explique detalhadamente como e por que executá-la para um amigo, familiar ou colega.',
      'O impacto individual se multiplica exponencialmente quando envolvemos e educamos as pessoas ao nosso redor.',
      'Expande a rede de conscientização ambiental e engaja novos indivíduos em práticas sustentáveis permanentes.',
    ),
    pontos: 55,
    dificuldade: 'medio',
  },
  {
    id: 'm7',
    titulo: 'Garrafa na Mochila',
    frase: 'Leve sua garrafa reutilizável todos os dias durante uma semana.',
    descricao: montarDescricao(
      'Adote uma garrafa de inox, alumínio ou plástico rígido reutilizável e leve-a abastecida com você em todos os seus deslocamentos ao longo de sete dias.',
      'Evita a compra frequente de garrafas PET de uso único quando se está fora de casa.',
      'Evita a produção de dezenas de embalagens plásticas descartáveis e gera economia financeira direta.',
    ),
    pontos: 30,
    dificuldade: 'medio',
  },
  {
    id: 'm8',
    titulo: 'Operação Desperdício Zero',
    frase: 'Passe uma semana sem desperdiçar comida no prato ou na geladeira.',
    descricao: montarDescricao(
      'Sirva apenas o que for consumir, monte pratos conscientes, armazene as sobras corretamente e crie refeições com os alimentos que estão perto de vencer durante sete dias.',
      'A decomposição de alimentos em aterros sanitários produz metano, um gás de efeito estufa extremamente potente.',
      'Evita o desperdício de recursos usados na produção de alimentos (água, solo, combustível) e otimiza o orçamento doméstico.',
    ),
    pontos: 40,
    dificuldade: 'medio',
  },
  {
    id: 'm9',
    titulo: 'Rota Sustentável',
    frase: 'Substitua um trajeto motorizado por caminhada ou bicicleta.',
    descricao: montarDescricao(
      'Escolha um deslocamento curto da sua rotina diária (até 2 km ou 3 km) que faria de carro ou aplicativo e faça o percurso a pé ou de bicicleta.',
      'Veículos automotores individuais são os principais emissores de poluentes atmosféricos e gases de efeito estufa nas cidades.',
      'Elimina a emissão de carbono daquele trajeto, melhora a saúde cardiovascular e alivia o trânsito urbano.',
    ),
    pontos: 60,
    dificuldade: 'medio',
  },
  {
    id: 'm10',
    titulo: 'Reutilizaê',
    frase: 'Dê uma nova utilidade prática a uma embalagem ou objeto descartado.',
    descricao: montarDescricao(
      'Pegue um pote de vidro, lata, caixa ou garrafa e transforme-o em um organizador de bancada, vaso de plantas, porta-canetas ou item de decoração funcional.',
      'O upcycling (reutilização criativa) prolonga a vida útil dos materiais antes que precisem passar pelo processo fabril de reciclagem.',
      'Retarda o descarte de resíduos, economiza recursos na compra de novos utilitários e estimula a criatividade sustentável.',
    ),
    pontos: 60,
    dificuldade: 'medio',
  },
  {
    id: 'm11',
    titulo: 'Ecoponto Explorador',
    frase: 'Localize o ponto correto de descarte para resíduos especiais.',
    descricao: montarDescricao(
      'Pesquise na sua cidade onde entregar pilhas, lâmpadas, eletrônicos quebrados ou óleo de cozinha usado. Leve ao menos um desses materiais até o local correto.',
      'Resíduos especiais contêm metais pesados e substâncias químicas que contaminam o solo e os lençóis freáticos se jogados no lixo comum.',
      'Garante a neutralização de poluentes graves e permite a recuperação de materiais nobres através do descarte especializado.',
    ),
    pontos: 50,
    dificuldade: 'medio',
  },
  {
    id: 'm12',
    titulo: 'Culinária Sem Sobras',
    frase: 'Cozinhe pratos saborosos utilizando partes não convencionais dos alimentos.',
    descricao: montarDescricao(
      'Pesquise receitas que aproveitem cascas de frutas, talos de hortaliças ou sementes (ex: doces com casca de banana, farofa de talos) e prepare a refeição com a devida higienização.',
      'Folhas, cascas e talos contêm alta densidade de nutrientes e frequentemente acabam no lixo por falta de hábito culinário.',
      'Maximiza o aproveitamento nutricional dos alimentos e reduz vertiginosamente o volume de resíduos orgânicos gerados na cozinha.',
    ),
    pontos: 60,
    dificuldade: 'medio',
  },
  {
    id: 'm13',
    titulo: 'Desafio Sem Compras',
    frase: 'Passe 7 dias adquirindo apenas itens essenciais de alimentação e saúde.',
    descricao: montarDescricao(
      'Durante uma semana completa, pause a compra de roupas, acessórios, eletrônicos, decorações ou objetos supérfluos. Avalie o que você já possui caso sinta necessidade de algo.',
      'O consumismo impulsivo aciona cadeias produtivas de alto impacto ambiental para suprir necessidades temporárias.',
      'Reduz a pegada ecológica ligada à produção e transporte de mercadorias e promove a reflexão sobre o consumo consciente.',
    ),
    pontos: 55,
    dificuldade: 'medio',
  },
  {
    id: 'm14',
    titulo: 'Voz da Coleta Seletiva',
    frase: 'Proponha a implementação de coleta seletiva na sua empresa ou escola.',
    descricao: montarDescricao(
      'Verifique se o seu local de trabalho ou estudo possui lixeiras de separação. Caso não tenha, leve uma proposta verbal ou por escrito à direção/coordenação sugerindo a iniciativa.',
      'Ambientes corporativos e escolares geram grandes volumes diários de materiais recicláveis que muitas vezes são misturados ao lixo comum.',
      'Cria potencial para a destinação correta de centenas de quilogramas de resíduos recicláveis por ano naquele espaço.',
    ),
    pontos: 55,
    dificuldade: 'medio',
  },
  {
    id: 'm15',
    titulo: 'Conexão Adotar',
    frase: 'Divulgue a causa da adoção responsável de animais em suas redes.',
    descricao: montarDescricao(
      'Escolha uma publicação de uma ONG ou protetor independente local sobre um animal disponível para adoção e compartilhe em suas redes sociais com uma mensagem de incentivo.',
      'O abandono animal é um problema de saúde pública e bem-estar animal nas cidades. A visibilidade aumenta as chances de encaminhar o animal a um lar seguro.',
      'Apoia a causa da proteção animal local, engaja sua rede de contatos e reduz o número de animais em situação de rua.',
    ),
    pontos: 55,
    dificuldade: 'medio',
  },
  {
    id: 'm16',
    titulo: 'Pequeno Professor',
    frase: 'Ensine uma dica de sustentabilidade para uma criança ou jovem.',
    descricao: montarDescricao(
      'Escolha uma prática ecológica simples — como não jogar lixo na rua ou fechar a torneira — e ensine de forma lúdica a uma criança da sua família ou comunidade.',
      'Formar hábitos ecológicos na infância cria adultos naturalmente conscientes e comprometidos com a preservação do planeta.',
      'Consolida a cultura de respeito ao meio ambiente na formação das novas gerações.',
    ),
    pontos: 35,
    dificuldade: 'medio',
  },
]);


const dificil: Missao[] = withIcons([
  {
    id: 'd1',
    titulo: 'Oficina de Brinquedos',
    frase: 'Crie um brinquedo funcional utilizando materiais recicláveis.',
    descricao: montarDescricao(
      'Reúna papelão, garrafas PET, tampinhas ou tecidos e construa um brinquedo funcional para uma criança ou um brinquedo interativo para um pet.',
      'Substitui a compra de brinquedos plásticos industrializados por soluções artesanais com custo zero e impacto ecológico positivo.',
      'Retira resíduos do fluxo de descarte, promove o consumo consciente e estimula o aprendizado lúdico através da reutilização.',
    ),
    pontos: 65,
    dificuldade: 'dificil',
  },
  {
    id: 'd2',
    titulo: 'Dia Sem Carne',
    frase: 'Faça todas as refeições de um dia inteiro sem consumir carnes.',
    descricao: montarDescricao(
      'Planeje um cardápio de 24 horas baseado em vegetais, leguminosas (feijões, lentilhas, grãos-de-bico), cereais, frutas e hortaliças, eliminando qualquer tipo de carne (boi, frango, porco ou peixe).',
      'A pecuária é responsável por uma parcela significativa das emissões globais de gases de efeito estufa, desmatamento e uso intensivo de água.',
      'Poupa milhares de litros de água virtual e reduz significativamente sua pegada de carbono individual referente àquele dia.',
    ),
    pontos: 80,
    dificuldade: 'dificil',
  },
  {
    id: 'd3',
    titulo: 'Semana Sustentável',
    frase: 'Mantenha cinco hábitos sustentáveis simultâneos por sete dias seguidos.',
    descricao: montarDescricao(
      'Escolha 5 ações sustentáveis (ex: banhos curtos, sem copos descartáveis, separar o lixo, usar ecobag e apagar luzes) e execute todas elas sem interrupção durante uma semana inteira.',
      'A consistência prolongada é o fator decisivo para transformar ações isoladas em hábitos duradouros no estilo de vida.',
      'Consolida mudanças reais no comportamento pessoal e gera economia acumulada de recursos ao longo da semana.',
    ),
    pontos: 90,
    dificuldade: 'dificil',
  },
  {
    id: 'd4',
    titulo: 'Guardião da Composteira',
    frase: 'Monte e inicie o cultivo de uma composteira doméstica.',
    descricao: montarDescricao(
      'Monte uma composteira (usando baldes plásticos, caixas de papelão adaptadas ou minhocário) e comece a depositar seus resíduos orgânicos crus (cascas, borra de café) intercalados com matéria seca (folhas secas, serragem).',
      'Mais da metade do lixo doméstico é composto por matéria orgânica que, se enviada ao aterro, gera contaminação e poluição.',
      'Transforma resíduos orgânicos em adubo rico para plantas, reduz em até 50% o volume de lixo enviado aos aterros e evita a geração de metano.',
    ),
    pontos: 90,
    dificuldade: 'dificil',
  },
  {
    id: 'd5',
    titulo: 'Revolução LED',
    frase: 'Substitua as lâmpadas antigas do seu ambiente por modelos LED.',
    descricao: montarDescricao(
      'Identifique lâmpadas incandescentes ou fluorescentes antigas em sua casa ou ambiente de trabalho e troque-as por lâmpadas de LED de alta eficiência energética.',
      'Lâmpadas de LED consomem até 80% menos energia elétrica que as incandescentes e têm uma durabilidade muito superior.',
      'Reduz permanentemente a demanda de energia elétrica da residência e diminui os custos da fatura de energia a longo prazo.',
    ),
    pontos: 85,
    dificuldade: 'dificil',
  },
  {
    id: 'd6',
    titulo: 'Horta Medicinal',
    frase: 'Plante e cultive ervas aromáticas e medicinais em casa.',
    descricao: montarDescricao(
      'Prepare vasos ou canteiros utilizando terra adubada e plante ao menos duas variedades de ervas medicinais ou aromáticas (como hortelã, manjericão, alecrim ou capim-cidreira), cuidando de sua rega e iluminação.',
      'O cultivo próprio garante temperos e chás frescos livres de agrotóxicos e aproxima o indivíduo do ciclo natural das plantas.',
      'Proporciona alimentos e chás orgânicos na sua rotina, reduz o uso de embalagens plásticas de mercado e traz áreas verdes para dentro de casa.',
    ),
    pontos: 80,
    dificuldade: 'dificil',
  },
  {
    id: 'd7',
    titulo: 'Auditoria da Água',
    frase: 'Monitore e otimize o consumo de água da sua casa por uma semana.',
    descricao: montarDescricao(
      'Acompanhe diariamente o hidrômetro ou as rotinas de uso de água na sua casa por 7 dias. Anote os pontos de maior consumo (banho, máquina de lavar, torneira) e implemente mudanças imediatas para reduzir os exageros.',
      'A medição contínua e a auditoria de consumo são as formas mais eficazes de identificar desperdícios ocultos.',
      'Reduz o consumo hídrico global da família e promove a conscientização coletiva dos moradores sobre a gestão de recursos finitos.',
    ),
    pontos: 65,
    dificuldade: 'dificil',
  },
  {
    id: 'd8',
    titulo: 'Projeto Refloresta',
    frase: 'Plante uma muda de árvore ou espécie nativa e garanta seu cultivo.',
    descricao: montarDescricao(
      'Pesquise uma espécie vegetal ou árvore adequada para o solo e espaço disponível (jardim, calçada ou vaso grande), realize o plantio correto e cuide do seu desenvolvimento nas primeiras semanas.',
      'As plantas produzem oxigênio, absorvem dióxido de carbono, melhoram a umidade do ar e fornecem abrigo para a fauna local.',
      'Auxilia na captura de carbono da atmosfera, combate o aquecimento local e contribui para a biodiversidade da região.',
    ),
    pontos: 80,
    dificuldade: 'dificil',
  },
  {
    id: 'd9',
    titulo: 'Minha Ação, Meu Impacto',
    frase: 'Lidere uma ação ambiental comunitária e meça os resultados obtidos.',
    descricao: montarDescricao(
      'Organize uma iniciativa prática no seu bairro, escola ou local de trabalho (como um mutirão de limpeza, campanha de arrecadação de eletroeletrônicos ou oficina educativa). Registre os dados (quilos recolhidos, pessoas impactadas) e compartilhe o resultado.',
      'A liderança comunitária é o nível mais elevado de engajamento socioambiental, capaz de gerar transformações em escala coletiva.',
      'Mobiliza pessoas, resolve problemas ambientais específicos do local e deixa um legado duradouro de engajamento social.',
    ),
    pontos: 90,
    dificuldade: 'dificil',
  },
]);

// CONSULTAS E ESCOLHAS

/** As missões agrupadas por dificuldade; a tela de Missões usa isto para filtrar a lista. */
export const missoesPorDificuldade: Record<Dificuldade, Missao[]> = {
  facil,
  medio,
  dificil,
};

/** Todas as 34 missões em uma lista só (fáceis, depois médias, depois difíceis). */
export const todasMissoes: Missao[] = [...facil, ...medio, ...dificil];

/** Soma dos pontos de todas as missões (1675). Também reexportada pelo AppContext. */
export const pontuacaoMaximaMissoes = todasMissoes.reduce((total, m) => total + m.pontos, 0);

/**
 * Busca uma missão pelo `id`. Devolve `undefined` se não existir.
 * (nenhuma tela usa esta função; fica disponível para uso futuro.)
 */
export function encontrarMissao(id: string): Missao | undefined {
  return todasMissoes.find((m) => m.id === id);
}

/**
 * Define qual "categoria" de missão combina com o nível atual do usuário:
 * começa nas fáceis (níveis 1-2), passa pelas médias (níveis 3-11) e
 * desbloqueia as difíceis a partir do nível 12, até o nível máximo (20).
 */
export function dificuldadeDoNivel(nivel: number): Dificuldade {
  if (nivel <= 2) return 'facil';
  if (nivel <= 11) return 'medio';
  return 'dificil';
}

/**
 * Escolhe a "missão diária": sempre uma missão da dificuldade compatível com o
 * nível do usuário, dando preferência a uma missão que ele ainda não concluiu.
 * A escolha muda a cada dia (mas continua igual durante o mesmo dia).
 *
 * ERRO NESSA PARTE
 */
export function obterMissaoDoDia(
  nivel: number,
  missoesConcluidas: Record<string, boolean>,
): Missao {
  const dificuldade = dificuldadeDoNivel(nivel);
  const pool = missoesPorDificuldade[dificuldade];

  // Número do dia dentro do ano (1 a 366): diferença entre agora e 31/dez do
  // ano anterior, em milissegundos, dividida pelos ms de um dia (86 400 000).
  const diaDoAno = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000,
  );

  // Prefere as pendentes; se o usuário já fez todas dessa dificuldade, usa a lista completa.
  const pendentes = pool.filter((m) => !missoesConcluidas[m.id]);
  const listaParaEscolher = pendentes.length > 0 ? pendentes : pool;

  // O resto da divisão faz o índice "girar" pela lista, um item por dia.
  const indice = diaDoAno % listaParaEscolher.length;
  return listaParaEscolher[indice];
}
