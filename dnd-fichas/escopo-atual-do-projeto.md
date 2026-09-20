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

- Assistente de level up com escolha da classe que sobe, pontos de vida, subclasse quando ela é desbloqueada, ASI, habilidades, trocas opcionais de magias conhecidas orientadas pela regra da classe e resumo antes de confirmar.
- Histórico de PV por nível e por classe de origem para impedir ganho duplicado, nova rolagem ao revisitar um nível e uso do dado de vida errado em multiclasse.
- ASI limitado a atributos de valor máximo 20.
- Progressão por marco ou XP, com tabela, barra de andamento e trava de XP insuficiente.
- Multiclasse com classes secundárias que guardam independentemente classe, nível e subclasse; o assistente também permite subir cada uma delas.
- Entrada em classe secundária confere pré-requisito, impede classe repetida e registra as proficiências reduzidas de multiclasse, inclusive escolhas de perícia pendentes.
- Dados de vida são mantidos em pools por classe, com gasto escolhido no descanso curto e recuperação no descanso longo priorizando d12, d10, d8 e d6.
- Cálculo de espaços de magia combinados para conjuradores completos, conjuradores de metade e Magia de Pacto do Bruxo em separado.
- Conjuração de um terço para Cavaleiro Arcano e Trapaceiro Arcano, inclusive sua contribuição para os espaços combinados de multiclasse. A ficha recalcula os espaços ao trocar classe, subclasse ou nível e usa Inteligência para CD e ataque mágico dessas subclasses.
- **Nível total máximo de 20 aplicado em todas as camadas:** controles da interface, modal e confirmação do level up, além de normalização obrigatória em toda criação, atualização, carga e importação. A interface de multiclasse limita cada classe ao saldo disponível; JSON antigo ou corrompido é ajustado com preservação do retrato original e aviso ao jogador.
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
- Vantagem e desvantagem podem ser ativadas globalmente antes de qualquer d20; cada uma rola dois dados e escolhe o maior ou menor, enquanto ambas juntas se cancelam.
- Condições de magias podem ser aplicadas à própria ficha, ficam persistidas com fonte e duração convertida em rodadas e podem ser avançadas ou encerradas no bloco de status.

### 2.5 Magias, concentração e recursos

- Catálogo de 117 magias, do truque ao 9º círculo, com detalhes resumidos, dano, cura, resistência, condição, ritual e concentração quando aplicável.
- Inclusão de magias de catálogo ou personalizadas; marcação de magia preparada.
- CD e bônus de ataque mágico calculados separadamente para cada classe conjuradora da ficha.
- Espaços de magia regulares e de Pacto, com contador de usos e atualização automática por nível.
- O catálogo mostra somente as magias disponíveis para a classe selecionada na ficha e somente os círculos que têm opções acessíveis. Espaços combinados de multiclasse não liberam magias acima do nível individual da classe.
- Ao adicionar uma magia, a classe de origem é registrada e pode ser alterada na ficha. A validação avisa sobre lista incompatível e excesso de truques, magias conhecidas ou preparadas por classe. Arcano Místico do Bruxo usa progressão própria.
- Regras de magia de subclasse centralizadas por dados: Domínio da Vida e Domínio da Luz acrescentam suas tabelas completas de magias sempre preparadas; Juramentos de Devoção e Vingança fazem o mesmo nos níveis apropriados; Patrono Arquifada e Patrono Corruptor possuem suas listas expandidas completas; Trapaceiro Arcano recebe Mãos Mágicas.
- Cavaleiro Arcano e Trapaceiro Arcano usam a lista de Mago e o círculo liberado pelo nível da própria classe. O catálogo filtra as escolas habituais e permite uma escolha de qualquer escola no 3º, 8º, 14º e 20º níveis da classe, respeitando as vagas já usadas. A validação avisa sobre excesso de truques, magias conhecidas e escolhas fora das escolas habituais. Ao escolher Trapaceiro Arcano, Mãos Mágicas é adicionado automaticamente; fichas antigas recebem um aviso se o truque estiver ausente.
- As características de todas as 26 subclasses são inseridas automaticamente na ficha conforme o personagem sobe de nível e exibem um resumo de uso. Características sem limite, escolha de alvo, efeito de combate ou decisão do mestre ficam registradas de forma descritiva na aba de habilidades.
- Magias de talento, item ou regra da mesa podem ser marcadas como origem especial. Talentos e itens são escolhidos diretamente entre os registros da ficha; a validação avisa, sem bloquear, quando a fonte é removida. Iniciado em Magia confere lista, círculos e quantidade.
- Rastreador de concentração: iniciar, substituir, encerrar e testar concentração ao reduzir manualmente o PV atual.
- Catálogo unificado de recursos rastreáveis para classe, subclasse, talento, item e regras gerais. Cada definição informa origem, fórmula do máximo e restauração; fórmulas podem combinar nível, atributo e bônus de proficiência sem código específico na interface.
- Os recursos existentes continuam atualizando o máximo por nível ou atributo. Sortudo concede Pontos de Sorte, Adepto Marcial concede seu Dado de Superioridade, e Inspiração pode ser adicionada como marcador de restauração manual.

### 2.6 Descanso, inventário e proficiências

- Descanso curto para gastar explicitamente um dado de vida de qualquer pool de classe e restaurar recursos de descanso curto; Bruxo pode recuperar Magia de Pacto.
- Descanso longo para restaurar PV, espaços, recursos e metade dos dados de vida (mínimo um), priorizando os maiores dados gastos.
- Inventário manual e catálogo local de armas, armaduras, equipamentos e ferramentas.
- Peso total e capacidade de carga exibidos.
- Moedas em cobre, prata, electro, ouro e platina.
- Marcação genérica de item mágico, raridade e bônus numérico; o bônus é aplicado a armas e armaduras equipadas.
- Catálogo inicial de itens mágicos nomeados, com seis entradas orientadas por dados: Espada Longa +1, Escudo +1, Manto de Proteção, Varinha de Mísseis Mágicos, Botas Élficas e Poção de Cura.
- Sintonização persistida com limite de três itens, cargas com gasto bloqueado em zero e recarga diária, além de regras próprias exibidas no inventário. Efeitos passivos suportados aplicam bônus de CA e salvaguardas quando os requisitos do item estão ativos.
- Rolagens de dano e cura das magias oferecem aplicação opcional ao PV da ficha. Dano consome primeiro PV temporário e continua acionando o teste de concentração; cura respeita o PV máximo e reinicia testes de morte ao levantar o personagem. A Poção de Cura usa o mesmo caminho e consome uma unidade.
- Idiomas e proficiências com ferramentas em áreas separadas do inventário, com atributo selecionável e botão de rolagem para cada ferramenta.

### 2.7 Entregas concluídas

- **Sistema de subclasses:** as 26 subclasses cadastradas funcionam para a classe principal e para classes secundárias, incluindo escolha por nível da classe, level up, habilidades automáticas, recursos rastreáveis, regras de magia, persistência e validação.
- **Sistema de multiclasse:** pré-requisitos, limite total de nível 20, prevenção de classe repetida, subclasses, proficiências reduzidas de entrada, pools de dados de vida para descanso e ganho de PV vinculado à classe que subiu estão integrados e persistidos.
- **M-00 — teto de nível verificado:** o total 20 possui uma fonte única de cálculo e uma barreira no modelo de dados. Os cenários 19→20, 20→21, 15+5, 15+6, importação legada e retorno a nível já visitado possuem testes de regressão.
- **M-01 — prontidão para a mesa:** a ficha permanece editável como rascunho, separa erros bloqueantes, escolhas pendentes e avisos, permite confirmação quando restam somente avisos e retorna automaticamente a rascunho se uma alteração criar um bloqueio. Cada item indica e abre a área correspondente.
- **M-04 — proficiências de criação:** escolhas de perícias, idiomas e ferramentas de classe, raça e antecedente são orientadas por dados, validadas e registradas com suas origens. Anão, Monge e antecedentes com jogos, ferramentas de artesão ou veículos usam os grupos corretos; duplicidades automáticas pedem uma substituição, e dados legados ou personalizados continuam preservados e visíveis.
- **M-02 — regras de magia por classe:** Segredos Mágicos funcionam por nível individual do Bardo, aceitam truques e distinguem as escolhas adicionais do Colégio do Conhecimento; origens de talento e item são verificadas contra a ficha; Iniciado em Magia possui regras próprias; o catálogo cobre integralmente as tabelas mágicas das subclasses implementadas; o grimório do Mago permanece sem limite artificial, limitando apenas as magias preparadas.
- **M-03 — troca de magias no level up:** quantidade, níveis disponíveis e tipos de magia substituíveis são definidos por dados. O modal aceita zero, uma ou várias trocas, impede repetir origem ou destino, preserva Segredos Mágicos e registra inclusive a decisão de ignorar a oportunidade para impedir reaplicação ao revisitar o nível.
- **M-08 — capacidade de carga:** a fórmula derivada foi centralizada e corrigida para `Força × 15`. Fichas existentes passam a exibir automaticamente o novo valor, sem migração, porque a capacidade não é persistida.
- **M-09 — lote de antecedentes básicos:** o catálogo passou de 8 para 13 antecedentes e agora cobre Acólito, Charlatão, Criminoso, Artista, Herói do Povo, Artesão Guildado, Eremita, Nobre, Forasteiro, Sábio, Marinheiro, Soldado e Órfão. As novas entradas usam as escolhas de idioma e ferramenta já integradas à criação, incluindo ferramentas de navegador.
- **M-05 — catálogo e funcionamento de itens mágicos:** seis itens nomeados inauguram uma estrutura extensível com item-base, raridade, sintonização, cargas, recarga, efeitos e regras descritivas. O limite de três sintonizações é aplicado também na normalização de importações; bônus genéricos de itens legados continuam válidos.
- **M-06 — aplicação de efeitos:** o motor de d20 suporta vantagem, desvantagem e cancelamento; dano e cura rolados podem alterar o PV pela mesma regra usada pelo status, incluindo PV temporário, testes de morte e concentração; condições do catálogo possuem fonte e duração persistentes. O modelo de ficha foi atualizado para a versão 7.
- **M-07 — recursos e habilidades avançadas:** classe, subclasse, talento, item e regra geral compartilham o mesmo catálogo e o mesmo contador. Novos recursos podem ser declarados apenas por dados, inclusive com máximo composto por nível, atributo e proficiência; remoção da fonte reconcilia o contador e restauração manual não é alterada por descansos. O modelo de ficha foi atualizado para a versão 8.
- **M-10 — ampliação da cobertura automatizada (implementação pronta, execução pendente):** foram acrescentados cenários de PV e testes de morte, descanso curto/longo, Magia de Pacto, pools de dados de vida, inventário, peso, moedas, combinações de CA e round-trip JSON atual/legado. As regras de status e descanso foram extraídas para funções puras; a execução integral da suíte permanece a etapa final do aceite.
- **M-16 — aviso de falha de persistência:** o salvamento automático informa sucesso ou falha sem lançar exceções. Quota cheia e armazenamento indisponível produzem um estado transitório no contexto e um banner global que informa que as alterações não foram salvas, recomenda exportar um backup e permite tentar novamente ou dispensar; um salvamento posterior bem-sucedido limpa o aviso.
- **M-13 — impressão e exportação em PDF (implementação pronta, conferência manual pendente):** a decisão M-D05 foi resolvida em favor da folha de impressão do navegador, sem nova dependência. A ficha possui um botão “Imprimir / Salvar em PDF” e uma apresentação A4 somente leitura que reúne todas as abas — identidade, classes, atributos, status, salvaguardas, perícias, ataques, recursos, proficiências, habilidades, magias, inventário, moedas e anotações — com paginação orientada por CSS. O título temporário do documento usa o nome do personagem para facilitar o salvamento do PDF.

## 3. Limitações atuais e itens ainda pendentes

### Prioridade 0 — precisão de regras e confiança da ficha

Todos os itens de Prioridade 0 do plano mecânico atual estão concluídos. Novas classes, subclasses ou exceções futuras ainda deverão fornecer seus próprios dados de regra ao serem adicionadas.

### Prioridade 1 — conteúdo e automações de mesa

1. **Cobertura de conteúdo.** Os 13 antecedentes básicos e o primeiro lote de itens mágicos estão cadastrados, mas raças, subclasses, magias, itens e demais opções ainda são uma seleção limitada, não uma referência completa do sistema. O M-09 permanece uma frente incremental, sem contagem final definida no plano.
2. **Validação final do M-10.** A cobertura prevista no plano foi escrita, mas a suíte completa, lint e build ainda precisam ser executados pelo usuário para que o pacote atenda integralmente à definição de pronto.

### Prioridade 2 — experiência do jogador e da mesa

1. Modo mesa, com visual compacto para combate e sessão.
2. Tema claro opcional e preferências visuais.
3. Atalhos de teclado para rolagens e ações frequentes.
4. Melhorias de acessibilidade e revisão sistemática para celular.

### Prioridade 3 — recursos de mestre e colaboração

1. Rastreador de iniciativa de combate com personagens e monstros.
2. Fichas simplificadas para NPCs e monstros.
3. Contas, sincronização e compartilhamento entre jogador e mestre.
4. Biblioteca remota/versionada de conteúdos e fichas.

## 4. Recomendação de próxima etapa

Os sistemas de subclasses, multiclasse, teto de nível, prontidão para a mesa, proficiências de criação, regras de magia por classe — incluindo trocas no level up —, capacidade de carga, itens mágicos, efeitos estruturados, recursos rastreáveis, aviso de falha ao salvar e impressão/PDF estão concluídos dentro do modelo atual. A cobertura do M-10 aguarda a execução integral pelo usuário, e o M-13 aguarda a conferência visual de uma ficha curta e outra extensa. A próxima entrega finita recomendada é o M-14, após definir quais ações e teclas receberão atalhos. O M-09 continua recebendo conteúdo por lotes.

Critérios de aceite sugeridos:

- uma ficha não pode ser considerada pronta sem raça, classe, antecedente e atributos válidos;
- a multiclasse exige os pré-requisitos de atributo e mantém o total em 20;
- cada classe secundária pode ter subclasse, recebe as proficiências reduzidas de entrada, tem pool de dados de vida separado para descanso e registra o dado de vida correto em cada ganho de PV;
- perícias, idiomas e ferramentas de criação são concedidos pela origem correta, escolhas incompletas impedem a prontidão e sobreposições de ferramentas exigem uma substituição;
- o catálogo de magia exibe apenas opções da classe e do círculo disponíveis; excessos de magias conhecidas/preparadas são avisados, sem bloquear exceções legítimas;
- Segredos Mágicos, origens de talento/item e o grimório do Mago respeitam seus limites próprios sem impor bloqueios artificiais;
- Cavaleiro Arcano e Trapaceiro Arcano recebem espaços de magia de conjurador de um terço sem usar o nível total para liberar magias;
- as regras críticas de subclasses e magia têm testes automatizados.
- Força 10 resulta em capacidade de carga 150 conforme a fórmula escolhida no M-08.
- os 13 antecedentes básicos aparecem na criação e suas perícias, idiomas e ferramentas seguem o mesmo fluxo de validação das entradas anteriores.
- o quarto item que exigir sintonização é bloqueado, cargas não ficam negativas, recargas respeitam o máximo e itens mágicos genéricos antigos preservam seus bônus.
- vantagem escolhe o maior d20, desvantagem escolhe o menor e as duas juntas se cancelam; dano com PV temporário ainda gera teste de concentração; cura e condições persistem corretamente.
- recursos antigos mantêm seus máximos e descansos; talentos e itens podem oferecer novos contadores apenas por dados, e fórmulas compostas são recalculadas quando a ficha muda.
- PV, testes de morte, descansos, Magia de Pacto, peso, moedas, CA e importação/exportação passam pelos novos cenários automatizados do M-10.
- uma falha ao gravar no `localStorage` não derruba o aplicativo e mostra imediatamente que as alterações não foram salvas; uma nova tentativa bem-sucedida remove o aviso.
- a impressão reúne os dados atuais de todas as abas, omite controles interativos, preserva tabelas legíveis e permite imprimir em A4 ou usar “Salvar como PDF” no diálogo do navegador.

## 5. Estado de qualidade verificado

Foram adicionados testes de subclasses, magia, multiclasse, teto de nível, gate de prontidão, capacidade de carga, integridade dos catálogos, itens mágicos, efeitos, recursos rastreáveis, PV, morte/estabilização, descansos, Magia de Pacto, inventário, moedas, CA, backup JSON atual/legado e falhas de persistência por quota ou indisponibilidade. Os arquivos novos passaram apenas por conferência estática; a suíte não foi executada nesta etapa por solicitação do usuário. O usuário fará testes, lint, build e a conferência visual da impressão/PDF em uma ficha curta e outra extensa.
