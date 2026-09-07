// Exportar: baixa a ficha inteira como um arquivo .json.
// Importar: lê um arquivo .json de volta e devolve o objeto pra virar
// uma ficha nova (uso pensado como cópia de segurança, não sincronização).

export function exportarFicha(ficha) {
  const conteudo = JSON.stringify(ficha, null, 2);
  const blob = new Blob([conteudo], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const nomeArquivo = `ficha-${(ficha.nome || "sem-nome")
    .toLowerCase()
    .replace(/\s+/g, "-")}.json`;

  const link = document.createElement("a");
  link.href = url;
  link.download = nomeArquivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function lerArquivoFicha(arquivo) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onload = () => {
      try {
        resolve(JSON.parse(leitor.result));
      } catch {
        reject(new Error("Arquivo inválido"));
      }
    };
    leitor.onerror = () => reject(new Error("Não foi possível ler o arquivo"));
    leitor.readAsText(arquivo);
  });
}