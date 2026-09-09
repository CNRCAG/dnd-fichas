// CD do teste de concentração: 10 ou metade do dano recebido, o que for
// maior (regra oficial do 5e — Livro do Jogador, cap. 10).
export function calcularCdConcentracao(danoRecebido) {
  return Math.max(10, Math.floor(danoRecebido / 2));
}