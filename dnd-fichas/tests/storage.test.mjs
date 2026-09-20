import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";

let servidor;
let storage;

before(async () => {
  servidor = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
  });
  storage = await servidor.ssrLoadModule("/src/utils/storage.js");
});

after(async () => { await servidor?.close(); });

test("salvamento bem-sucedido mantém o comportamento e devolve confirmação", () => {
  const gravacoes = [];
  const armazenamento = {
    setItem(chave, valor) {
      gravacoes.push({ chave, valor });
    },
  };
  const fichas = [{ id: "ficha", nome: "Lyra" }];
  const resultado = storage.salvarFichas(fichas, armazenamento);
  assert.deepEqual(resultado, { ok: true, erro: null });
  assert.equal(gravacoes.length, 1);
  assert.equal(gravacoes[0].chave, "pilares-de-atlas:fichas");
  assert.deepEqual(JSON.parse(gravacoes[0].valor), fichas);
});

test("quota excedida gera sinal detectável sem propagar exceção", () => {
  const erroQuota = new Error("quota");
  erroQuota.name = "QuotaExceededError";
  const armazenamento = {
    setItem() {
      throw erroQuota;
    },
  };
  const resultado = storage.salvarFichas([{ id: "ficha" }], armazenamento);
  assert.equal(resultado.ok, false);
  assert.equal(resultado.erro.motivo, "quota");
  assert.match(resultado.erro.mensagem, /cheio/i);
});

test("armazenamento indisponível usa o mesmo caminho seguro de falha", () => {
  const resultado = storage.salvarFichas([{ id: "ficha" }], null);
  assert.equal(resultado.ok, false);
  assert.equal(resultado.erro.motivo, "indisponivel");
  assert.match(resultado.erro.mensagem, /indisponível/i);
});

test("uma falha não impede uma tentativa posterior bem-sucedida", () => {
  const falha = storage.salvarFichas([], { setItem() { throw new Error("bloqueado"); } });
  const sucesso = storage.salvarFichas([], { setItem() {} });
  assert.equal(falha.ok, false);
  assert.equal(sucesso.ok, true);
});
