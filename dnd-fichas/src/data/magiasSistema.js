// Lista de magias do 5e, organizadas por nível (0 = truque). As descrições
// aqui são resumos escritos com nossas próprias palavras — não é uma cópia
// do texto oficial do livro, só um lembrete rápido do efeito.
//
// Campos de mecânica adicionados:
// - resistencia: atributo da salvaguarda que o alvo rola pra resistir
//   ("destreza", "sabedoria" etc.), ou null se a magia não usa salvaguarda.
// - ataque: true quando a magia usa um ataque mágico à distância/corpo a
//   corpo em vez de salvaguarda.
// - dano: dado(s) de dano e o tipo, quando a magia causa dano direto.
// - condicao: efeito ou condição que a magia impõe, quando houver.

export const ESCOLAS = {
  abjuracao: "Abjuração",
  adivinhacao: "Adivinhação",
  conjuracao: "Conjuração",
  encantamento: "Encantamento",
  evocacao: "Evocação",
  ilusao: "Ilusão",
  necromancia: "Necromancia",
  transmutacao: "Transmutação",
};

export const MAGIAS = [
  // ---- Truques (nível 0) ----
  { id: "faisca", nome: "Faísca", nivel: 0, escola: "evocacao", tempo: "1 ação", alcance: "36m", componentes: "V, S", duracao: "Instantânea", descricao: "Dispara um raio de fogo contra um alvo, causando dano de fogo.", ataque: true, dano: "2d10 fogo" },
  { id: "maos-magicas", nome: "Mãos Mágicas", nivel: 0, escola: "conjuracao", tempo: "1 ação", alcance: "9m", componentes: "V, S", duracao: "1 minuto", descricao: "Cria uma mão espectral que manipula objetos leves à distância." },
  { id: "prestidigitacao", nome: "Prestidigitação", nivel: 0, escola: "transmutacao", tempo: "1 ação", alcance: "3m", componentes: "V, S", duracao: "Até 1 hora", descricao: "Truque versátil: pequenos efeitos sensoriais, limpar/sujar algo, acender vela etc." },
  { id: "luz", nome: "Luz", nivel: 0, escola: "evocacao", tempo: "1 ação", alcance: "Toque", componentes: "V, M", duracao: "1 hora", descricao: "Faz um objeto emitir luz forte num raio de 6m." },
  { id: "chama-sagrada", nome: "Chama Sagrada", nivel: 0, escola: "evocacao", tempo: "1 ação", alcance: "18m", componentes: "V, S", duracao: "Instantânea", descricao: "Fogo divino cai sobre uma criatura, causando dano radiante (teste de DES).", resistencia: "destreza", dano: "1d8 radiante" },
  { id: "orientacao", nome: "Orientação", nivel: 0, escola: "adivinhacao", tempo: "1 ação", alcance: "Toque", componentes: "V, S", duracao: "Concentração, 1 minuto", concentracao: true, descricao: "Alvo soma 1d4 num teste de habilidade à escolha." },
  { id: "taumaturgia", nome: "Taumaturgia", nivel: 0, escola: "abjuracao", tempo: "1 ação", alcance: "9m", componentes: "V", duracao: "Até 1 minuto", descricao: "Pequenos efeitos sobrenaturais impressionantes: voz ecoante, portas tremendo etc." },
  { id: "toque-gelido", nome: "Toque Gélido", nivel: 0, escola: "necromancia", tempo: "1 ação", alcance: "18m", componentes: "V, S", duracao: "1 rodada", descricao: "Mão espectral causa dano necrótico e impede a cura do alvo até o fim do turno seguinte.", ataque: true, dano: "1d8 necrótico", condicao: "Alvo não recupera pontos de vida até o fim do próximo turno dele" },
  { id: "raio-de-gelo", nome: "Raio de Gelo", nivel: 0, escola: "evocacao", tempo: "1 ação", alcance: "18m", componentes: "V, S", duracao: "Instantânea", descricao: "Raio gelado causa dano e reduz o deslocamento do alvo até seu próximo turno.", ataque: true, dano: "1d8 frio", condicao: "Deslocamento reduzido em 3m até o início do próximo turno do alvo" },
  { id: "grito-assustador", nome: "Grito Assustador", nivel: 0, escola: "encantamento", tempo: "1 ação bônus", alcance: "18m", componentes: "V", duracao: "Instantânea", descricao: "Insulto mágico causa dano psíquico e impõe desvantagem no próximo ataque do alvo.", resistencia: "sabedoria", dano: "1d4 psíquico", condicao: "Desvantagem no próximo ataque do alvo antes do fim do turno dele" },
  { id: "mensagem", nome: "Mensagem", nivel: 0, escola: "transmutacao", tempo: "1 ação", alcance: "36m", componentes: "V, S, M", duracao: "1 rodada", descricao: "Sussurra uma mensagem curta a um alvo à distância, que pode responder baixinho." },
  { id: "reparar", nome: "Reparar", nivel: 0, escola: "transmutacao", tempo: "1 ação", alcance: "Toque", componentes: "V, S, M", duracao: "Instantânea", descricao: "Conserta uma quebra ou rasgo pequeno num objeto." },
  { id: "luzes-dancantes", nome: "Luzes Dançantes", nivel: 0, escola: "ilusao", tempo: "1 ação", alcance: "36m", componentes: "V, S, M", duracao: "Concentração, 1 minuto", concentracao: true, descricao: "Cria até 4 luzes flutuantes que você controla e move." },
  { id: "ilusao-menor", nome: "Ilusão Menor", nivel: 0, escola: "ilusao", tempo: "1 ação", alcance: "9m", componentes: "S, M", duracao: "1 minuto", descricao: "Cria um som ou imagem silenciosa e ilusória do tamanho de um cubo de 1,5m." },

  // ---- 1º nível ----
  { id: "misseis-magicos", nome: "Mísseis Mágicos", nivel: 1, escola: "evocacao", tempo: "1 ação", alcance: "36m", componentes: "V, S", duracao: "Instantânea", descricao: "3 dardos de força que acertam automaticamente, causando dano cada um.", dano: "1d4+1 força por dardo (3 dardos, sempre acertam)" },
  { id: "escudo", nome: "Escudo", nivel: 1, escola: "abjuracao", tempo: "1 reação", alcance: "Pessoal", componentes: "V, S", duracao: "1 rodada", descricao: "+5 na CA até o início do próximo turno, inclusive contra o ataque que a ativou." },
  { id: "curar-ferimentos", nome: "Curar Ferimentos", nivel: 1, escola: "evocacao", tempo: "1 ação", alcance: "Toque", componentes: "V, S", duracao: "Instantânea", descricao: "Cura 1d8 + mod. de atributo de conjuração em pontos de vida." },
  { id: "detectar-magia", nome: "Detectar Magia", nivel: 1, escola: "adivinhacao", tempo: "1 ação", alcance: "Pessoal", componentes: "V, S", duracao: "Concentração, 10 minutos", concentracao: true, ritual: true, descricao: "Sente a presença de magia num raio de 9m." },
  { id: "comando", nome: "Comando", nivel: 1, escola: "encantamento", tempo: "1 ação", alcance: "18m", componentes: "V", duracao: "1 rodada", descricao: "Ordena uma única palavra (fuja, largue, caia etc.) que o alvo deve obedecer.", resistencia: "sabedoria", condicao: "Obedece à palavra de comando (foge, larga, cai, fica parado etc.) se falhar" },
  { id: "bencao", nome: "Bênção", nivel: 1, escola: "encantamento", tempo: "1 ação", alcance: "9m", componentes: "V, S, M", duracao: "Concentração, 1 minuto", concentracao: true, descricao: "Até 3 criaturas somam 1d4 em ataques e salvaguardas." },
  { id: "armadura-arcana", nome: "Armadura Arcana", nivel: 1, escola: "abjuracao", tempo: "1 ação", alcance: "Toque", componentes: "V, S, M", duracao: "8 horas", descricao: "CA do alvo passa a 13 + mod. DES enquanto sem armadura." },
  { id: "sono", nome: "Sono", nivel: 1, escola: "encantamento", tempo: "1 ação", alcance: "18m", componentes: "V, S, M", duracao: "1 minuto", descricao: "Adormece criaturas numa área, começando pelas com menos PV.", condicao: "Criaturas afetadas ficam adormecidas (não há salvaguarda; dano acorda o alvo)" },
  { id: "enfeiticar-pessoa", nome: "Enfeitiçar Pessoa", nivel: 1, escola: "encantamento", tempo: "1 ação", alcance: "9m", componentes: "V, S", duracao: "1 hora", descricao: "Humanoide vê você como amigo (teste de SAB para resistir).", resistencia: "sabedoria", condicao: "Alvo humanoide fica enfeitiçado e trata você como amigo, se falhar" },
  { id: "identificar", nome: "Identificar", nivel: 1, escola: "adivinhacao", tempo: "1 minuto", alcance: "Toque", componentes: "V, S, M", duracao: "Instantânea", ritual: true, descricao: "Revela as propriedades mágicas de um objeto tocado." },
  { id: "alarme", nome: "Alarme", nivel: 1, escola: "abjuracao", tempo: "1 minuto", alcance: "9m", componentes: "V, S, M", duracao: "8 horas", ritual: true, descricao: "Cria um alarme mágico ou mental quando algo entra na área protegida." },
  { id: "graxa", nome: "Graxa", nivel: 1, escola: "conjuracao", tempo: "1 ação", alcance: "18m", componentes: "V, S, M", duracao: "1 minuto", descricao: "Cobre uma área com substância escorregadia; quem entrar pode cair.", resistencia: "destreza", condicao: "Cai (condição caída) se falhar ao entrar ou começar o turno na área" },
  { id: "saltar", nome: "Saltar", nivel: 1, escola: "transmutacao", tempo: "1 ação bônus", alcance: "Toque", componentes: "V, S, M", duracao: "1 minuto", descricao: "Triplica a distância de salto do alvo." },

  // ---- 2º nível ----
  { id: "raio-ardente", nome: "Raio Ardente", nivel: 2, escola: "evocacao", tempo: "1 ação", alcance: "36m", componentes: "V, S", duracao: "Instantânea", descricao: "Dispara 3 raios de fogo, cada um podendo mirar um alvo diferente.", ataque: true, dano: "2d6 fogo por raio" },
  { id: "invisibilidade", nome: "Invisibilidade", nivel: 2, escola: "ilusao", tempo: "1 ação", alcance: "Toque", componentes: "V, S, M", duracao: "Concentração, 1 hora", concentracao: true, descricao: "Torna o alvo invisível até atacar ou conjurar uma magia." },
  { id: "sugestao", nome: "Sugestão", nivel: 2, escola: "encantamento", tempo: "1 ação", alcance: "9m", componentes: "V, M", duracao: "Concentração, 8 horas", concentracao: true, descricao: "Planta uma sugestão razoável que o alvo tende a seguir.", resistencia: "sabedoria", condicao: "Segue a sugestão razoável dada, se falhar" },
  { id: "estilhacar", nome: "Estilhaçar", nivel: 2, escola: "evocacao", tempo: "1 ação", alcance: "18m", componentes: "V, S, M", duracao: "Instantânea", descricao: "Som estridente causa dano numa área e pode quebrar objetos frágeis.", resistencia: "constituicao", dano: "3d8 concussão (metade se resistir)" },
  { id: "escuridao", nome: "Escuridão", nivel: 2, escola: "evocacao", tempo: "1 ação", alcance: "18m", componentes: "V, M", duracao: "Concentração, 10 minutos", concentracao: true, descricao: "Cria escuridão mágica numa esfera de 4,5m de raio." },
  { id: "imagem-espelhada", nome: "Imagem Espelhada", nivel: 2, escola: "ilusao", tempo: "1 ação", alcance: "Pessoal", componentes: "V, S", duracao: "1 minuto", descricao: "Cria 3 duplicatas ilusórias que podem desviar ataques de você." },
  { id: "detectar-pensamentos", nome: "Detectar Pensamentos", nivel: 2, escola: "adivinhacao", tempo: "1 ação", alcance: "Pessoal", componentes: "V, S, M", duracao: "Concentração, 1 minuto", concentracao: true, descricao: "Lê os pensamentos superficiais de criaturas próximas.", resistencia: "sabedoria", condicao: "Alvo consciente da tentativa pode resistir e perceber sua presença" },
  { id: "restauracao-menor", nome: "Restauração Menor", nivel: 2, escola: "abjuracao", tempo: "1 ação", alcance: "Toque", componentes: "V, S", duracao: "Instantânea", descricao: "Remove uma doença ou uma condição (cego, paralisado, envenenado etc.) do alvo." },
  { id: "auxilio", nome: "Auxílio", nivel: 2, escola: "abjuracao", tempo: "1 ação", alcance: "9m", componentes: "V, S, M", duracao: "8 horas", descricao: "Até 3 criaturas ganham +5 PV máximo temporário pela duração." },
  { id: "passo-nebuloso", nome: "Passo Nebuloso", nivel: 2, escola: "conjuracao", tempo: "1 ação bônus", alcance: "Pessoal", componentes: "V", duracao: "Instantânea", descricao: "Teleporta você até 9m para um local visível." },
  { id: "teia", nome: "Teia", nivel: 2, escola: "conjuracao", tempo: "1 ação", alcance: "18m", componentes: "V, S, M", duracao: "Concentração, 1 hora", concentracao: true, descricao: "Preenche uma área com teias grudentas que restringem movimento.", resistencia: "destreza", condicao: "Fica agarrado pelas teias se falhar (novo teste a cada tentativa de se soltar)" },

  // ---- 3º nível ----
  { id: "bola-de-fogo", nome: "Bola de Fogo", nivel: 3, escola: "evocacao", tempo: "1 ação", alcance: "45m", componentes: "V, S, M", duracao: "Instantânea", descricao: "Explosão de fogo numa esfera de 6m de raio, dano alto em área.", resistencia: "destreza", dano: "8d6 fogo (metade se resistir)" },
  { id: "relampago", nome: "Relâmpago", nivel: 3, escola: "evocacao", tempo: "1 ação", alcance: "Pessoal (linha de 30m)", componentes: "V, S, M", duracao: "Instantânea", descricao: "Linha de eletricidade que causa dano a tudo em seu caminho.", resistencia: "destreza", dano: "8d6 elétrico (metade se resistir)" },
  { id: "dissipar-magia", nome: "Dissipar Magia", nivel: 3, escola: "abjuracao", tempo: "1 ação", alcance: "36m", componentes: "V, S", duracao: "Instantânea", descricao: "Encerra uma magia ativa num alvo." },
  { id: "voo", nome: "Voo", nivel: 3, escola: "transmutacao", tempo: "1 ação", alcance: "Toque", componentes: "V, S, M", duracao: "Concentração, 10 minutos", concentracao: true, descricao: "Alvo ganha deslocamento de voo de 18m." },
  { id: "contramagica", nome: "Contramágica", nivel: 3, escola: "abjuracao", tempo: "1 reação", alcance: "18m", componentes: "S", duracao: "Instantânea", descricao: "Interrompe a magia que outra criatura está conjurando." },
  { id: "clarividencia", nome: "Clarividência", nivel: 3, escola: "adivinhacao", tempo: "10 minutos", alcance: "1,6km", componentes: "V, S, M", duracao: "Concentração, 10 minutos", concentracao: true, descricao: "Cria um sensor invisível que permite ver ou ouvir um lugar distante." },
  { id: "protecao-contra-energia", nome: "Proteção contra Energia", nivel: 3, escola: "abjuracao", tempo: "1 ação", alcance: "Toque", componentes: "V, S", duracao: "Concentração, 1 hora", concentracao: true, descricao: "Alvo ganha resistência a um tipo de dano elemental à escolha." },
  { id: "velocidade", nome: "Velocidade", nivel: 3, escola: "transmutacao", tempo: "1 ação", alcance: "9m", componentes: "V, S, M", duracao: "Concentração, 1 minuto", concentracao: true, descricao: "Dobra o deslocamento do alvo e dá +2 na CA, entre outros benefícios." },
  { id: "lentidao", nome: "Lentidão", nivel: 3, escola: "transmutacao", tempo: "1 ação", alcance: "36m", componentes: "V, S, M", duracao: "Concentração, 1 minuto", concentracao: true, descricao: "Reduz deslocamento e reações de até 6 criaturas numa área.", resistencia: "sabedoria", condicao: "Deslocamento e CA reduzidos, desvantagem em DES e não pode reagir, se falhar" },
  { id: "revivificar", nome: "Revivificar", nivel: 3, escola: "necromancia", tempo: "1 ação", alcance: "Toque", componentes: "V, S, M", duracao: "Instantânea", descricao: "Traz de volta à vida uma criatura morta há no máximo 1 minuto." },

  // ---- 4º nível ----
  { id: "parede-de-fogo", nome: "Parede de Fogo", nivel: 4, escola: "evocacao", tempo: "1 ação", alcance: "36m", componentes: "V, S, M", duracao: "Concentração, 1 minuto", concentracao: true, descricao: "Cria uma parede de fogo que causa dano a quem passar por ela.", resistencia: "destreza", dano: "5d8 fogo (metade se resistir)" },
  { id: "polimorfar", nome: "Polimorfar", nivel: 4, escola: "transmutacao", tempo: "1 ação", alcance: "18m", componentes: "V, S, M", duracao: "Concentração, 1 hora", concentracao: true, descricao: "Transforma o alvo numa besta, mudando seus atributos físicos.", resistencia: "sabedoria", condicao: "Transformado na besta escolhida enquanto durar, se falhar" },
  { id: "confusao", nome: "Confusão", nivel: 4, escola: "encantamento", tempo: "1 ação", alcance: "22,5m", componentes: "V, S, M", duracao: "Concentração, 1 minuto", concentracao: true, descricao: "Criaturas numa área agem de forma aleatória e errática.", resistencia: "sabedoria", condicao: "Age de forma aleatória a cada turno enquanto durar, se falhar" },
  { id: "liberdade-de-movimento", nome: "Liberdade de Movimento", nivel: 4, escola: "abjuracao", tempo: "1 ação", alcance: "Toque", componentes: "V, S, M", duracao: "1 hora", descricao: "Alvo ignora terreno difícil e não pode ser paralisado, agarrado ou restringido." },
  { id: "banimento", nome: "Banimento", nivel: 4, escola: "abjuracao", tempo: "1 ação", alcance: "18m", componentes: "V, S, M", duracao: "Concentração, 1 minuto", concentracao: true, descricao: "Envia o alvo para outro plano de existência temporariamente.", resistencia: "carisma", condicao: "Enviado a outro plano de existência pela duração, se falhar" },
  { id: "pele-de-pedra", nome: "Pele de Pedra", nivel: 4, escola: "transmutacao", tempo: "1 ação", alcance: "Toque", componentes: "V, S, M", duracao: "Concentração, 1 hora", concentracao: true, descricao: "Alvo ganha resistência a dano cortante, perfurante e concussão." },
  { id: "tempestade-de-granizo", nome: "Tempestade de Granizo", nivel: 4, escola: "evocacao", tempo: "1 ação", alcance: "90m", componentes: "V, S, M", duracao: "Instantânea", descricao: "Bolas de gelo caem numa área cilíndrica, causando dano concussão e frio.", resistencia: "destreza", dano: "2d8 concussão + 4d6 frio (metade se resistir)" },

  // ---- 5º nível ----
  { id: "muralha-de-pedra", nome: "Muralha de Pedra", nivel: 5, escola: "evocacao", tempo: "1 ação", alcance: "36m", componentes: "V, S, M", duracao: "Concentração, 10 minutos", concentracao: true, descricao: "Cria uma parede sólida de pedra com formato à sua escolha." },
  { id: "cura-em-massa", nome: "Cura em Massa", nivel: 5, escola: "evocacao", tempo: "1 ação", alcance: "18m", componentes: "V, S", duracao: "Instantânea", descricao: "Cura até 6 criaturas numa área, 3d8 + mod. de atributo cada." },
  { id: "cone-de-frio", nome: "Cone de Frio", nivel: 5, escola: "evocacao", tempo: "1 ação", alcance: "Pessoal (cone de 18m)", componentes: "V, S, M", duracao: "Instantânea", descricao: "Rajada de frio intenso num cone, dano de frio em área.", resistencia: "constituicao", dano: "8d8 frio (metade se resistir)" },
  { id: "dominar-pessoa", nome: "Dominar Pessoa", nivel: 5, escola: "encantamento", tempo: "1 ação", alcance: "18m", componentes: "V, S", duracao: "Concentração, 1 minuto", concentracao: true, descricao: "Toma controle mental de um humanoide, que obedece seus comandos.", resistencia: "sabedoria", condicao: "Fica enfeitiçado e sob seu controle mental, se falhar" },
  { id: "restauracao-maior", nome: "Restauração Maior", nivel: 5, escola: "abjuracao", tempo: "1 ação", alcance: "Toque", componentes: "V, S, M", duracao: "Instantânea", descricao: "Remove exaustão, maldições, ou restaura um atributo/nível drenado." },
  { id: "sonho", nome: "Sonho", nivel: 5, escola: "ilusao", tempo: "1 minuto", alcance: "Especial", componentes: "V, S, M", duracao: "8 horas", descricao: "Envia uma mensagem ou pesadelo aos sonhos de uma criatura conhecida.", resistencia: "sabedoria", dano: "3d6 psíquico (só se usada como pesadelo malicioso)" },

  // ---- 6º nível ----
  { id: "verdadeira-visao", nome: "Verdadeira Visão", nivel: 6, escola: "adivinhacao", tempo: "1 ação", alcance: "Toque", componentes: "V, S, M", duracao: "1 hora", descricao: "Alvo enxerga através de ilusões, disfarces mágicos e a até o plano etéreo." },
  { id: "muralha-de-gelo", nome: "Muralha de Gelo", nivel: 6, escola: "evocacao", tempo: "1 ação", alcance: "36m", componentes: "V, S, M", duracao: "Concentração, 10 minutos", concentracao: true, descricao: "Cria uma parede de gelo que pode bloquear passagem e causar dano ao se formar.", resistencia: "destreza", dano: "10d6 frio (metade se resistir, ao romper a parede)" },
  { id: "contagio", nome: "Contágio", nivel: 6, escola: "necromancia", tempo: "1 ação", alcance: "Toque", componentes: "V, S", duracao: "7 dias", descricao: "Infecta o alvo com uma doença mágica debilitante se ele falhar na resistência.", resistencia: "constituicao", condicao: "Contrai uma doença mágica debilitante à escolha, se falhar" },
  { id: "globo-de-invulnerabilidade", nome: "Globo de Invulnerabilidade", nivel: 6, escola: "abjuracao", tempo: "1 ação", alcance: "Pessoal (raio 3m)", componentes: "V, S, M", duracao: "Concentração, 1 minuto", concentracao: true, descricao: "Cria uma barreira que bloqueia magias de nível 5 ou menor vindas de fora." },
  { id: "curar", nome: "Curar", nivel: 6, escola: "evocacao", tempo: "1 ação", alcance: "18m", componentes: "V, S", duracao: "Instantânea", descricao: "Cura 70 pontos de vida e remove cegueira, surdez e doenças do alvo." },

  // ---- 7º nível ----
  { id: "teleporte", nome: "Teleporte", nivel: 7, escola: "conjuracao", tempo: "1 ação", alcance: "3m", componentes: "V", duracao: "Instantânea", descricao: "Transporta você e acompanhantes instantaneamente até um destino conhecido." },
  { id: "regenerar", nome: "Regenerar", nivel: 7, escola: "transmutacao", tempo: "1 minuto", alcance: "Toque", componentes: "V, S, M", duracao: "1 hora", descricao: "Cura o alvo ao longo do tempo e pode regenerar membros perdidos." },
  { id: "simulacro", nome: "Simulacro", nivel: 7, escola: "ilusao", tempo: "12 horas", alcance: "Toque", componentes: "V, S, M", duracao: "Até dissipada", descricao: "Cria uma duplicata de gelo e neve de uma criatura, mais fraca, leal a você." },

  // ---- 8º nível ----
  { id: "palavra-de-poder-atordoar", nome: "Palavra de Poder: Atordoar", nivel: 8, escola: "encantamento", tempo: "1 ação", alcance: "18m", componentes: "V", duracao: "Instantânea", descricao: "Atordoa uma criatura com muitos PV apenas com uma palavra de poder.", condicao: "Fica atordoada automaticamente se estiver com 150 PV ou menos (sem teste de resistência)" },
  { id: "dominar-monstro", nome: "Dominar Monstro", nivel: 8, escola: "encantamento", tempo: "1 ação", alcance: "18m", componentes: "V, S", duracao: "Concentração, 1 hora", concentracao: true, descricao: "Toma controle mental de qualquer criatura, não só humanoides.", resistencia: "sabedoria", condicao: "Fica enfeitiçada e sob seu controle mental, se falhar" },
  { id: "terremoto", nome: "Terremoto", nivel: 8, escola: "evocacao", tempo: "1 ação", alcance: "150m", componentes: "V, S, M", duracao: "Concentração, 1 minuto", concentracao: true, descricao: "Sacode o chão numa área grande, derrubando criaturas e estruturas.", resistencia: "constituicao", condicao: "Fica caída (condição caída) se falhar, entre outros efeitos do terreno" },

  // ---- 9º nível ----
  { id: "palavra-de-poder-matar", nome: "Palavra de Poder: Matar", nivel: 9, escola: "encantamento", tempo: "1 ação", alcance: "18m", componentes: "V", duracao: "Instantânea", descricao: "Mata instantaneamente uma criatura com 100 PV ou menos.", condicao: "Morre instantaneamente se estiver com 100 PV ou menos (sem teste de resistência)" },
  { id: "desejo", nome: "Desejo", nivel: 9, escola: "conjuracao", tempo: "1 ação", alcance: "Pessoal", componentes: "V", duracao: "Instantânea", descricao: "A magia mais poderosa: pode replicar qualquer magia de nível 8 ou menor, ou criar efeitos quase ilimitados (com riscos)." },
  { id: "meteoro", nome: "Chuva de Meteoros", nivel: 9, escola: "evocacao", tempo: "1 ação", alcance: "1,6km", componentes: "V, S", duracao: "Instantânea", descricao: "Bolas de fogo caem do céu em até 4 pontos, dano devastador em área.", resistencia: "destreza", dano: "20d6 fogo + 20d6 concussão (metade se resistir)" },
  { id: "parar-o-tempo", nome: "Parar o Tempo", nivel: 9, escola: "transmutacao", tempo: "1 ação", alcance: "Pessoal", componentes: "V", duracao: "Instantânea", descricao: "O tempo para para todos exceto você por alguns turnos seguidos." },
];

export function obterMagia(id) {
  return MAGIAS.find((magia) => magia.id === id) ?? null;
}
