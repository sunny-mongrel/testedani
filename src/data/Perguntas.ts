/**
 * DADOS: PERGUNTAS DO QUESTIONÁRIO DE PEGADA ECOLÓGICA.
 * Cada pergunta tem alternativas com um peso. O peso representa o impacto
 * ambiental da escolha: quanto maior o peso, pior para o planeta.
 *
 * Formato de cada item da lista:
 *   { pergunta: 'texto exibido', opcoes: [{ texto: '...', peso: número }, ...] }
 *
 * A tela Questionario soma os pesos das alternativas escolhidas e a tela
 * Resultado interpreta esse total. Por isso, ao mexer nos pesos, é preciso
 * conferir também as faixas de classificação em screens/Resultado.tsx.
 *
 * Total possível com as 15 perguntas atuais: mínimo 22, máximo 88.
 * (Faixas do Resultado: até 23 | 24 a 44 | 45 a 66 | 67 ou mais.)
 *
 * Observação: os pesos não são todos iguais entre perguntas.
 */
export const perguntas = [
  // Consumo e resíduos (perguntas 1 a 3) · pesos de 1 a 4
  {
    pergunta: 'Ao fazer compras no supermercado:',
    opcoes: [
      {
        texto:
          'Compro tudo que tenho vontade, sem prestar atenção no preço, na marca ou na embalagem',
        peso: 4,
      },
      { texto: 'Uso apenas o preço como critério de escolha', peso: 3 },
      {
        texto:
          'Presto atenção se os produtos de uma marca são ligados a alguma empresa que não respeita o meio ambiente ou questões sociais',
        peso: 2,
      },
      {
        texto:
          'Considero preço e qualidade, além de escolher produtos com embalagens recicláveis e critérios ambientais e sociais',
        peso: 1,
      },
    ],
  },
  {
    pergunta:
      'Entre os alimentos que normalmente você consome, que quantidade é pré-preparada, embalada ou importada?',
    opcoes: [
      { texto: 'Quase todos', peso: 4 },
      { texto: 'Metade', peso: 3 },
      { texto: 'Um quarto', peso: 2 },
      {
        texto:
          'Muito poucos. A maior parte não é pré-preparada nem embalada, tem origem orgânica e é produzida na região onde vivo',
        peso: 1,
      },
    ],
  },
  {
    pergunta: 'O que acontece com o lixo produzido na sua casa?',
    opcoes: [
      { texto: 'Não me preocupo muito com o lixo', peso: 4 },
      {
        texto:
          'Tudo é colocado em sacos recolhidos pelo lixeiro, mas não faço ideia para onde vai',
        peso: 3,
      },
      { texto: 'O que é reciclável é separado', peso: 2 },
      {
        texto:
          'O lixo seco é direcionado à reciclagem e o lixo orgânico é encaminhado para a compostagem',
        peso: 1,
      },
    ],
  },
  //Energia elétrica (perguntas 4 a 7) · pesos de 1 a 4
  {
    pergunta:
      'Que eletrodomésticos você utiliza? Escolha a opção que mais se parece com a situação da sua casa.',
    opcoes: [
      {
        texto:
          'Geladeira, freezer, máquina de lavar roupa/tanquinho e forno de micro-ondas',
        peso: 4,
      },
      { texto: 'Geladeira e máquina de lavar roupa/tanquinho', peso: 3 },
      { texto: 'Geladeira e forno de micro-ondas', peso: 2 },
      { texto: 'Geladeira', peso: 1 },
    ],
  },
  {
    pergunta:
      'Você considera, na compra de eletrodomésticos e lâmpadas, informações sobre eficiência energética do produto?',
    opcoes: [
      {
        texto:
          'Não. Compro sempre as lâmpadas e os eletrodomésticos que estiverem mais baratos',
        peso: 4,
      },
      {
        texto:
          'Utilizo lâmpadas frias, mas não considero a eficiência energética dos eletrodomésticos',
        peso: 3,
      },
      {
        texto:
          'Compro eletrodomésticos que consomem menos energia e utilizo lâmpadas incandescentes',
        peso: 2,
      },
      {
        texto:
          'Sim. Só utilizo lâmpadas frias e compro eletrodomésticos que consomem menos energia',
        peso: 1,
      },
    ],
  },
  {
    pergunta:
      'Você deixa luz, aparelhos de som, computadores ou televisão ligados quando não estão sendo utilizados?',
    opcoes: [
      {
        texto:
          'Sim. Deixo luzes acesas, computador e TV ligados, mesmo quando não estou no ambiente ou utilizando-os',
        peso: 4,
      },
      {
        texto:
          'Deixo a luz dos cômodos ligada quando sei que em alguns minutos vou voltar ao local',
        peso: 3,
      },
      {
        texto:
          'Deixo o computador ligado, mas desligo o monitor quando não estou utilizando',
        peso: 2,
      },
      {
        texto:
          'Não. Sempre desligo aparelhos e lâmpadas quando não estou utilizando, ou deixo o computador em hibernação',
        peso: 1,
      },
    ],
  },
  {
    pergunta:
      'Quantas vezes por semana, em média, você liga o ar-condicionado em casa ou no trabalho?',
    opcoes: [
      { texto: 'Praticamente todos os dias', peso: 4 },
      { texto: 'Entre três e quatro vezes', peso: 3 },
      { texto: 'Entre uma e duas vezes por semana', peso: 2 },
      { texto: 'Não tenho ar-condicionado', peso: 1 },
    ],
  },
  //Água (perguntas 8 e 9) · pesos de 1 a 4
  {
    pergunta: 'Quanto tempo você leva, em média, tomando banho diariamente?',
    opcoes: [
      { texto: 'Mais de 20 minutos', peso: 4 },
      { texto: 'Entre 10 e 20 minutos', peso: 3 },
      { texto: 'Entre 5 e 10 minutos', peso: 2 },
      { texto: 'Menos de 5 minutos', peso: 1 },
    ],
  },
  {
    pergunta: 'Quando você escova os dentes:',
    opcoes: [
      { texto: 'A torneira permanece aberta o tempo todo', peso: 4 },
      { texto: 'A torneira fica aberta em alguns momentos', peso: 3 },
      { texto: 'A torneira fica quase sempre fechada', peso: 2 },
      {
        texto:
          'A torneira é aberta apenas para molhar a escova e na hora de enxaguar a boca',
        peso: 1,
      },
    ],
  },
  // Moradia, alimentação e transporte (perguntas 10 a 14)
  // Pesos de 2 a 8: valem mais que os grupos anteriores, impacto é maior.
  {
    pergunta: 'Quantos habitantes moram em sua cidade?',
    opcoes: [
      { texto: 'Acima de 500 mil pessoas', peso: 8 },
      { texto: 'De 100 mil a 500 mil pessoas', peso: 6 },
      { texto: 'De 20 mil a 100 mil pessoas', peso: 4 },
      { texto: 'Menos de 20 mil pessoas', peso: 2 },
    ],
  },
  {
    pergunta: 'Quantas pessoas vivem na sua casa ou apartamento?',
    opcoes: [
      { texto: '1 pessoa', peso: 8 },
      { texto: '2 pessoas', peso: 6 },
      { texto: '3 pessoas', peso: 4 },
      { texto: '4 pessoas ou mais', peso: 2 },
    ],
  },
  {
    pergunta: 'Qual é a área da sua casa/apartamento?',
    opcoes: [
      { texto: '170 metros quadrados ou mais', peso: 8 },
      { texto: 'De 100 a 170 metros quadrados (3 quartos)', peso: 6 },
      { texto: 'De 50 a 100 metros quadrados (2 quartos)', peso: 4 },
      { texto: '50 metros quadrados ou menos (1 quarto)', peso: 2 },
    ],
  },
  {
    pergunta:
      'Com que frequência você consome produtos de origem animal, como carne, peixe, ovos e laticínios?',
    opcoes: [
      { texto: 'Como carne todos os dias', peso: 8 },
      { texto: 'Como carne uma ou duas vezes por semana', peso: 6 },
      {
        texto: 'Como carne raramente, mas ovos/laticínios quase todos os dias',
        peso: 4,
      },
      { texto: 'Nunca (vegetariano)', peso: 2 },
    ],
  },
  {
    pergunta: 'Qual o tipo de transporte que você mais utiliza?',
    opcoes: [
      {
        texto:
          'Carro é meu único meio de transporte e, na maioria das vezes, ando sozinho',
        peso: 8,
      },
      {
        texto:
          'Tenho carro, mas faço a pé os percursos mais curtos e privilegio transporte coletivo sempre que possível',
        peso: 6,
      },
      { texto: 'Não tenho carro e uso transporte coletivo', peso: 4 },
      {
        texto:
          'Não tenho carro, uso transporte coletivo quando necessário, mas ando muito a pé ou de bicicleta',
        peso: 2,
      },
    ],
  },
  // Avião (pergunta 15) · pesos de 3 a 12: a pergunta de maior peso
  {
    pergunta: 'Por ano, quantas horas você gasta andando de avião?',
    opcoes: [
      { texto: 'Acima de 50 horas', peso: 12 },
      { texto: '25 horas', peso: 9 },
      { texto: '10 horas', peso: 6 },
      { texto: 'Nunca ando de avião', peso: 3 },
    ],
  },
];
