# D&D Fichas — Escopo Atual do Projeto

> Documento de escopo baseado na auditoria do código-fonte atual em 16 de setembro de 2026. Ele substitui os documentos anteriores como referência de status: a classificação abaixo considera o que de fato está implementado, e não apenas o que estava planejado.

## 1. Visão do produto

**D&D Fichas** é uma aplicação web local para criar, consultar e gerenciar fichas de personagens de D&D 5e durante uma campanha. Não há servidor, conta de usuário ou sincronização: os dados ficam no navegador e podem ser salvos/restaurados por arquivos JSON.

O produto já é utilizável como ficha digital de mesa. Ainda não é um construtor que valide automaticamente todas as regras de D&D 5e nem uma ferramenta de mestre.

### Tecnologia e arquitetura

- React 19 + Vite 8;
- React Router para as telas inicial, criação e ficha;
- CSS próprio, com tema escuro “grimório”;
- `localStorage` para persistência automática;
- dados locais em arquivos JavaScript e regras de cálculo em `utils/`.

## 2. Escopo implementado

### 2.1 Gestão de fichas e criação

- Criação guiada em cinco etapas: raça, classe, antecedente, atributos e toques finais.
- Possibilidade de criar uma ficha em branco.
- Página inicial com busca, acesso, remoção, importação e exportação das fichas.
- Persistência automática no navegador.
- Exportação da ficha inteira para JSON e importação como uma nova ficha.
- Campos narrativos para jogador, aparência, personalidade, histórico, objetivo e notas.

### 2.2 Base de personagem

- Seis atributos, modificadores calculados e rolagens associadas.
- Bônus raciais, deslocamento e seleção livre de dois atributos para Meio-Elfo.
- 9 raças, 12 classes e 8 antecedentes na base atual.
- Perícias e salvaguardas com bônus de proficiência calculado pelo nível total.
- As duas perícias de cada antecedente são aplicadas automaticamente na criação e na troca de antecedente.
- 24 subclasses: duas opções para cada uma das 12 classes, liberadas no nível definido para a classe principal.
- 105 habilidades de classe e 27 talentos no catálogo, além de habilidades personalizadas.

### 2.3 Nível, progressão e multiclasse

- Assistente de level up com escolha da classe que sobe, pontos de vida, ASI, habilidades e resumo antes de confirmar.
- Histórico de PV por nível para impedir ganho duplicado e nova rolagem ao revisitar um nível.
- ASI limitado a atributos de valor máximo 20.
- Progressão por marco ou XP, com tabela, barra de andamento e trava de XP insuficiente.
- Multiclasse com classes secundárias e escolha da classe a subir no assistente.
- Cálculo de espaços de magia combinados para conjuradores completos, conjuradores de metade e Magia de Pacto do Bruxo em separado.
- **Nível total máximo de 20 aplicado em três camadas:** botão de level up, modal de level up e persistência da ficha. A interface de multiclasse também limita cada classe ao saldo de níveis disponível e bloqueia novas classes no nível 20.
- Painel de validação que separa pendências de avisos e confere dados obrigatórios, atributos, níveis, multiclasse, PV, recursos, espaços de magia, nível das magias e pré-requisitos de talentos já adicionados.

### 2.4 Combate, status e rolagens

- PV atual, máximo e temporário; CA; deslocamento; iniciativa e dados de vida usados.
- Iniciativa calculada como Destreza + bônus manual, com botão de rolagem.
- Testes de morte clicáveis, estados de estabilizado/morto e reinício dos marcadores.
- Percepção e Investigação passivas calculadas.
- CA automática para armaduras e escudos equipados, Defesa sem Armadura de Bárbaro e Monge, e bônus mágico de armadura.
- Ataques automáticos para armas equipadas e ataques manuais.
- Rolagem de d20 e fórmulas de dados; painel com resultado atual e histórico recente.
- Motor entende fórmulas simples e combinações usadas pela base, como `1d8+3` e `3x(1d4+1)`.

### 2.5 Magias, concentração e recursos

- Catálogo de 76 magias, do truque ao 9º círculo, com detalhes resumidos, dano, cura, resistência, condição, ritual e concentração quando aplicável.
- Inclusão de magias de catálogo ou personalizadas; marcação de magia preparada.
- CD e bônus de ataque mágico calculados para a classe principal.
- Espaços de magia regulares e de Pacto, com contador de usos e atualização automática por nível.
- Rastreador de concentração: iniciar, substituir, encerrar e testar concentração ao reduzir manualmente o PV atual.
- 10 recursos de classe sugeridos com usos, gasto e restauração em descanso curto ou longo.

### 2.6 Descanso, inventário e proficiências

- Descanso curto para gastar dado de vida e restaurar recursos de descanso curto; Bruxo pode recuperar Magia de Pacto.
- Descanso longo para restaurar PV, espaços, recursos e metade dos dados de vida (mínimo um).
- Inventário manual e catálogo com 37 armas, 13 armaduras e 40 equipamentos/ferramentas.
- Peso total e capacidade de carga exibidos.
- Moedas em cobre, prata, electro, ouro e platina.
- Marcação genérica de item mágico, raridade e bônus numérico; o bônus é aplicado a armas e armaduras equipadas.
- Idiomas e proficiências com ferramentas em áreas separadas do inventário, com atributo selecionável e botão de rolagem para cada ferramenta.

## 3. Limitações atuais e itens ainda pendentes

### Prioridade 0 — precisão de regras e confiança da ficha

1. **Validação de ficha antes de usar na mesa.** A checagem consolidada básica já existe, mas ainda não há um fluxo de bloqueio/confirmação nem validação de todas as escolhas de criação e regras específicas por classe.
2. **Multiclasse completa.** O teto total de 20 e os pré-requisitos de atributo já são validados, mas ainda faltam proficiências concedidas na primeira classe secundária, subclasses de classes secundárias e todos os casos especiais das regras.
3. **Dados de vida em multiclasse.** O descanso curto usa o dado de vida e a quantidade de níveis da classe principal; ele não mantém pools separados por classe, como a regra pede.
4. **Magias por classe.** A ficha permite adicionar qualquer magia do catálogo e alterar níveis/espaços manualmente. Não valida lista da classe, nível disponível, quantidade de magias conhecidas/preparadas, nem as regras específicas de cada conjurador.
5. **Subclasses com conjuração parcial.** Arquétipos como Cavaleiro Arcano não entram no cálculo de espaços de magia.
6. **Proficiências de criação.** Antecedentes aplicam perícias, mas a escolha de perícias da classe, idiomas concedidos por raça/antecedente e proficiências iniciais de ferramentas não é automatizada.

### Prioridade 1 — conteúdo e automações de mesa

1. **Catálogo real de itens mágicos.** O suporte atual é genérico: marcação, raridade e bônus numérico. Faltam itens prontos, sintonização, cargas, efeitos e regras individuais.
2. **Efeitos de magias e habilidades.** O sistema registra e rola os dados, mas não aplica automaticamente dano, cura, condições, duração, vantagens/desvantagens ou efeitos sobre a ficha.
3. **Recursos e habilidades avançadas.** A base cobre dez recursos comuns; faltam mais recursos de classe, subclasse, talentos, itens e suas regras particulares.
4. **Carga conforme a regra escolhida pela mesa.** A implementação usa Força × 7,5. Se a intenção for a regra padrão de D&D 5e, o multiplicador precisa ser ajustado para × 15 ou tornado configurável.
5. **Cobertura de conteúdo.** Raças, antecedentes, subclasses, magias, itens e opções de personagem ainda são uma seleção limitada, não uma referência completa do sistema.
6. **Testes automatizados.** Não há suíte de testes para regras críticas, por exemplo nível máximo, multiclasse, PV, espaços de magia, descanso e CA.

### Prioridade 2 — experiência do jogador e da mesa

1. Modo mesa, com visual compacto para combate e sessão.
2. Tema claro opcional e preferências visuais.
3. Impressão e exportação em PDF.
4. Atalhos de teclado para rolagens e ações frequentes.
5. Melhorias de acessibilidade e revisão sistemática para celular.
6. Exibição de avisos de dados não salvos caso o `localStorage` fique indisponível ou cheio; hoje a falha de persistência é silenciosa.

### Prioridade 3 — recursos de mestre e colaboração

1. Rastreador de iniciativa de combate com personagens e monstros.
2. Fichas simplificadas para NPCs e monstros.
3. Contas, sincronização e compartilhamento entre jogador e mestre.
4. Biblioteca remota/versionada de conteúdos e fichas.

## 4. Recomendação de próxima etapa

A próxima entrega deve aprofundar a **validação de magias por classe** e os detalhes restantes de multiclasse. Ela elimina incoerências que hoje precisam ser conferidas manualmente e aproveita os cálculos que já existem.

Critérios de aceite sugeridos:

- uma ficha não pode ser considerada pronta sem raça, classe, antecedente e atributos válidos;
- a multiclasse exige os pré-requisitos de atributo e mantém o total em 20;
- cada classe secundária pode ter subclasse e seus dados de vida são controlados separadamente;
- o catálogo de magia só oferece opções válidas para as classes da ficha, respeitando nível e limites conhecidos/preparados;
- as regras críticas acima têm testes automatizados.

## 5. Estado de qualidade verificado

Na versão auditada, os comandos `npm run lint` e `npm run build` foram executados com sucesso. O projeto ainda não possui testes automatizados, portanto a verificação atual de comportamento é de build/lint e revisão de código.
