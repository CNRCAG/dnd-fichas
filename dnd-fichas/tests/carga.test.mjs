import test from "node:test";
import assert from "node:assert/strict";
import {
  MULTIPLICADOR_CAPACIDADE_CARGA,
  calcularCapacidadeCarga,
} from "../src/utils/carga.js";

test("capacidade de carga usa o multiplicador definido pelo M-08", () => {
  assert.equal(MULTIPLICADOR_CAPACIDADE_CARGA, 15);
  assert.equal(calcularCapacidadeCarga(10), 150);
  assert.equal(calcularCapacidadeCarga(20), 300);
});

test("capacidade de carga trata valores ausentes ou inválidos como zero", () => {
  assert.equal(calcularCapacidadeCarga(), 0);
  assert.equal(calcularCapacidadeCarga("inválida"), 0);
  assert.equal(calcularCapacidadeCarga(-1), 0);
});
