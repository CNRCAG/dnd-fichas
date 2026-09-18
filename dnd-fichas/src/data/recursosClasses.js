// Sugestões de recursos comuns por classe, pra não precisar cadastrar
// tudo na mão. O número de usos é só um ponto de partida — ajustável
// depois, igual qualquer outro recurso.

export const RECURSOS_CLASSES = [
  { id: "furia", classeId: "barbaro", nome: "Fúria", tipoUsosMax: "fixo", valorFixo: 2, restauraEm: "longo" },
  { id: "inspiracao-bardo", classeId: "bardo", nome: "Inspiração de Bardo", tipoUsosMax: "modCarisma", restauraEm: "longo" },
  { id: "canalizar-divindade-clerigo", classeId: "clerigo", nome: "Canalizar Divindade", tipoUsosMax: "fixo", valorFixo: 1, restauraEm: "curto" },
  { id: "forma-selvagem", classeId: "druida", nome: "Forma Selvagem", tipoUsosMax: "fixo", valorFixo: 2, restauraEm: "curto" },
  { id: "pontos-feiticaria", classeId: "feiticeiro", nome: "Pontos de Feitiçaria", tipoUsosMax: "porNivel", restauraEm: "longo" },
  { id: "segundo-folego", classeId: "guerreiro", nome: "Segundo Fôlego", tipoUsosMax: "fixo", valorFixo: 1, restauraEm: "curto" },
  { id: "surto-de-acao", classeId: "guerreiro", nome: "Surto de Ação", tipoUsosMax: "fixo", valorFixo: 1, restauraEm: "curto" },
  { id: "recuperacao-arcana", classeId: "mago", nome: "Recuperação Arcana", tipoUsosMax: "fixo", valorFixo: 1, restauraEm: "longo" },
  { id: "pontos-ki", classeId: "monge", nome: "Pontos de Ki", tipoUsosMax: "porNivel", restauraEm: "curto" },
  { id: "canalizar-divindade-paladino", classeId: "paladino", nome: "Canalizar Divindade", tipoUsosMax: "fixo", valorFixo: 1, restauraEm: "curto" },
];

export function resolverUsosMax(template, contexto) {
  if (template.tipoUsosMax === "fixo") return template.valorFixo;
  if (template.tipoUsosMax === "porNivel") return Math.max(1, contexto.nivel ?? 1);
  if (template.tipoUsosMax === "modCarisma") return Math.max(1, contexto.modCarisma ?? 0);
  if (template.tipoUsosMax === "modSabedoria") return Math.max(1, contexto.modSabedoria ?? 0);
  if (template.tipoUsosMax === "faixasNivel") {
    return [...(template.faixas ?? [])]
      .filter(([nivel]) => contexto.nivel >= nivel)
      .at(-1)?.[1] ?? 1;
  }
  return 1;
}
