// Somente recursos com usos que o modelo atual de contador consegue
// representar. Características passivas e escolhas táticas ficam descritas
// nas habilidades da subclasse.
export const RECURSOS_SUBCLASSES = [
  { id: "presenca-feerica", classeId: "bruxo", subclasseId: "patrono-arquifada", nivelMinimo: 1, nome: "Presença Feérica", tipoUsosMax: "fixo", valorFixo: 1, restauraEm: "curto" },
  { id: "sorte-do-corruptor", classeId: "bruxo", subclasseId: "patrono-corruptor", nivelMinimo: 6, nome: "Sorte do Corruptor", tipoUsosMax: "fixo", valorFixo: 1, restauraEm: "curto" },
  { id: "brilho-protetor", classeId: "clerigo", subclasseId: "dominio-luz", nivelMinimo: 1, nome: "Brilho Protetor", tipoUsosMax: "modSabedoria", restauraEm: "longo" },
  { id: "recuperacao-natural", classeId: "druida", subclasseId: "circulo-terra", nivelMinimo: 2, nome: "Recuperação Natural", tipoUsosMax: "fixo", valorFixo: 1, restauraEm: "longo" },
  { id: "mare-do-caos", classeId: "feiticeiro", subclasseId: "magia-selvagem", nivelMinimo: 1, nome: "Maré do Caos", tipoUsosMax: "fixo", valorFixo: 1, restauraEm: "longo" },
  { id: "dados-superioridade", classeId: "guerreiro", subclasseId: "mestre-de-batalha", nivelMinimo: 3, nome: "Dados de Superioridade", tipoUsosMax: "faixasNivel", faixas: [[3, 4], [7, 5], [15, 6]], restauraEm: "curto" },
  { id: "integridade-corporal", classeId: "monge", subclasseId: "mao-aberta", nivelMinimo: 6, nome: "Integridade Corporal", tipoUsosMax: "fixo", valorFixo: 1, restauraEm: "longo" },
  { id: "ladrao-de-magias", classeId: "ladino", subclasseId: "trapaceiro-arcano", nivelMinimo: 17, nome: "Ladrão de Magias", tipoUsosMax: "fixo", valorFixo: 1, restauraEm: "longo" },
];
