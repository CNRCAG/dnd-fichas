# D&D Fichas — Escopo Atual do Projeto

> Documento de escopo baseado na auditoria do código-fonte, atualizado em 18 de setembro de 2026. Ele substitui os documentos anteriores como referência de status: a classificação abaixo considera o que de fato está implementado, e não apenas o que estava planejado.

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
- 26 subclasses no catálogo, todas ligadas à classe correta e liberadas pelo nível daquela classe, tanto na classe principal quanto em multiclasse.
- Características detalhadas para todas as subclasses cadastradas, inseridas automaticamente no nível correspondente sem apagar habilidades personalizadas. Há também 105 habilidades de classe e 27 talentos no catálogo.

### 2.3 Nível, progressão e multiclasse

- Assistente de level up com escolha da classe que sobe, pontos de vida, subclasse quando ela é desbloqueada, ASI, habilidades, troca opcional de magia conhecida e resumo antes de confirmar.
- Histórico de PV por nível e por classe de origem para impedir ganho duplicado, nova rolagem ao revisitar um nível e uso do dado de vida errado em multiclasse.
- ASI limitado a atributos de valor máximo 20.
- Progressão por marco ou XP, com tabela, barra de andamento e trava de XP insuficiente.
- Multiclasse com classes secundárias que guardam independentemente classe, nível e subclasse; o assistente também permite subir cada uma delas.
- Entrada em classe secundária confere pré-requisito, impede classe repetida e registra as proficiências reduzidas de multiclasse, inclusive escolhas de perícia pendentes.
- Dados de vida são mantidos em pools por classe, com gasto escolhido no descanso curto e recuperação no descanso longo priorizando d12, d10, d8 e d6.
- Cálculo de espaços de magia combinados para conjuradores completos, conjuradores de metade e Magia de Pacto do Bruxo em separado.
- Conjuração de um terço para Cavaleiro Arcano e Trapaceiro Arcano, inclusive sua contribuição para os espaços combinados de multiclasse. A ficha recalcula os espaços ao trocar classe, subclasse ou nível e usa Inteligência para CD e ataque mágico dessas subclasses.
- **Nível total máximo de 20 aplicado em três camadas:** botão de level up, modal de level up e persistência da ficha. A interface de multiclasse também limita cada classe ao saldo de níveis disponível e bloqueia novas classes no nível 20.
- Painel de validação que separa pendências de avisos e confere dados obrigatórios, atributos, níveis, multiclasse, compatibilidade e desbloqueio de subclasses, habilidades automáticas ausentes/duplicadas, PV, recursos, espaços de magia, nível das magias e pré-requisitos de talentos já adicionados.

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
- CD e bônus de ataque mágico calculados separadamente para cada classe conjuradora da ficha.
- Espaços de magia regulares e de Pacto, com contador de usos e atualização automática por nível.
- O catálogo mostra somente as magias disponíveis para a classe selecionada na ficha e somente os círculos que têm opções acessíveis. Espaços combinados de multiclasse não liberam magias acima do nível individual da classe.
- Ao adicionar uma magia, a classe de origem é registrada e pode ser alterada na ficha. A validação avisa sobre lista incompatível e excesso de truques, magias conhecidas ou preparadas por classe. Arcano Místico do Bruxo usa progressão própria.
- Regras de magia de subclasse centralizadas por dados: Domínio da Vida e Domínio da Luz acrescentam magias sempre preparadas; Juramentos de Devoção e Vingança fazem o mesmo nos níveis apropriados; Patrono Arquifada e Patrono Corruptor ampliam listas sem aprender automaticamente; Trapaceiro Arcano recebe Mãos Mágicas. A cobertura se limita às magias dessas regras presentes no catálogo local.
- Cavaleiro Arcano e Trapaceiro Arcano usam a lista de Mago e o círculo liberado pelo nível da própria classe. O catálogo filtra as escolas habituais e permite uma escolha de qualquer escola no 3º, 8º, 14º e 20º níveis da classe, respeitando as vagas já usadas. A validação avisa sobre excesso de truques, magias conhecidas e escolhas fora das escolas habituais. Ao escolher Trapaceiro Arcano, Mãos Mágicas é adicionado automaticamente; fichas antigas recebem um aviso se o truque estiver ausente.
- As características de todas as 26 subclasses são inseridas automaticamente na ficha conforme o personagem sobe de nível e exibem um resumo de uso. Características sem limite, escolha de alvo, efeito de combate ou decisão do mestre ficam registradas de forma descritiva na aba de habilidades.
- Magias de talento, item ou regra da mesa podem ser marcadas como origem especial, com descrição da fonte e aviso quando ela não é informada. A existência do talento ou item na ficha ainda não é conferida automaticamente.
- Rastreador de concentração: iniciar, substituir, encerrar e testar concentração ao reduzir manualmente o PV atual.
- Recursos de classe e de subclasse sugeridos com usos, gasto e restauração em descanso curto ou longo. Os recursos rastreáveis de subclasse atualizam o máximo por nível ou atributo quando a ficha é alterada.

### 2.6 Descanso, inventário e proficiências

- Descanso curto para gastar explicitamente um dado de vida de qualquer pool de classe e restaurar recursos de descanso curto; Bruxo pode recuperar Magia de Pacto.
- Descanso longo para restaurar PV, espaços, recursos e metade dos dados de vida (mínimo um), priorizando os maiores dados gastos.
- Inventário manual e catálogo com 37 armas, 13 armaduras e 40 equipamentos/ferramentas.
- Peso total e capacidade de carga exibidos.
- Moedas em cobre, prata, electro, ouro e platina.
- Marcação genérica de item mágico, raridade e bônus numérico; o bônus é aplicado a armas e armaduras equipadas.
- Idiomas e proficiências com ferramentas em áreas separadas do inventário, com atributo selecionável e botão de rolagem para cada ferramenta.

### 2.7 Entregas concluídas

- **Sistema de subclasses:** as 26 subclasses cadastradas funcionam para a classe principal e para classes secundárias, incluindo escolha por nível da classe, level up, habilidades automáticas, recursos rastreáveis, regras de magia, persistência e validação.
- **Sistema de multiclasse:** pré-requisitos, limite total de nível 20, prevenção de classe repetida, subclasses, proficiências reduzidas de entrada, pools de dados de vida para descanso e ganho de PV vinculado à classe que subiu estão integrados e persistidos.

## 3. Limitações atuais e itens ainda pendentes

### Prioridade 0 — precisão de regras e confiança da ficha

1. **Validação de ficha antes de usar na mesa.** A checagem consolidada básica já existe, mas ainda não há um fluxo de bloqueio/confirmação nem validação de todas as escolhas de criação e regras específicas por classe.
2. **Magias por classe.** Listas básicas, círculo acessível, limites, magias sempre preparadas/concedidas e listas expandidas das subclasses disponíveis são tratados. Ainda faltam Segredos Mágicos, a validação da posse de talentos/itens usados como origem especial e ampliar o catálogo local. O grimório do Mago continua sem limite artificial de magias registradas.
3. **Troca de magias conhecidas no level up.** O fluxo dedicado existe para classes cuja tabela local representa magias conhecidas. Regras futuras que concedam troca diferente ou mais de uma magia no mesmo nível exigirão modelagem adicional.
4. **Proficiências de criação.** Antecedentes aplicam perícias, mas a escolha de perícias da classe, idiomas concedidos por raça/antecedente e proficiências iniciais de ferramentas não é automatizada.

### Prioridade 1 — conteúdo e automações de mesa

1. **Catálogo real de itens mágicos.** O suporte atual é genérico: marcação, raridade e bônus numérico. Faltam itens prontos, sintonização, cargas, efeitos e regras individuais.
2. **Efeitos de magias e habilidades.** O sistema registra e rola os dados, mas não aplica automaticamente dano, cura, condições, duração, vantagens/desvantagens ou efeitos sobre a ficha.
3. **Recursos e habilidades avançadas.** Recursos rastreáveis das subclasses atuais foram incluídos; ainda faltam recursos de outras opções futuras, talentos, itens e regras particulares de combate.
4. **Carga conforme a regra escolhida pela mesa.** A implementação usa Força × 7,5. Se a intenção for a regra padrão de D&D 5e, o multiplicador precisa ser ajustado para × 15 ou tornado configurável.
5. **Cobertura de conteúdo.** Raças, antecedentes, subclasses, magias, itens e opções de personagem ainda são uma seleção limitada, não uma referência completa do sistema.
6. **Testes automatizados.** Há cobertura para regras críticas de subclasses, magia e multiclasse. Ainda faltam cenários amplos de PV, descanso, inventário, CA e importação/exportação.

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

Os sistemas de subclasses e multiclasse estão concluídos dentro do modelo atual de ficha. A próxima entrega recomendada é o fluxo de validação final antes de usar a ficha na mesa, começando pelos dados e escolhas feitos na criação.

Critérios de aceite sugeridos:

- uma ficha não pode ser considerada pronta sem raça, classe, antecedente e atributos válidos;
- a multiclasse exige os pré-requisitos de atributo e mantém o total em 20;
- cada classe secundária pode ter subclasse, recebe as proficiências reduzidas de entrada, tem pool de dados de vida separado para descanso e registra o dado de vida correto em cada ganho de PV;
- o catálogo de magia exibe apenas opções da classe e do círculo disponíveis; excessos de magias conhecidas/preparadas são avisados, sem bloquear exceções legítimas;
- Cavaleiro Arcano e Trapaceiro Arcano recebem espaços de magia de conjurador de um terço sem usar o nível total para liberar magias;
- as regras críticas de subclasses e magia têm testes automatizados.

## 5. Estado de qualidade verificado

Foram adicionados testes de subclasses, magia e multiclasse, incluindo pools de dados de vida, proficiências de entrada e PV ao subir uma classe secundária. Eles não foram executados nesta etapa por solicitação do usuário. O usuário fará testes, lint, build e conferência da interface.
