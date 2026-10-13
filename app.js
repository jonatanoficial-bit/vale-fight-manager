/* Vale Fight Manager — Parte 1
   Dados, atletas e organizações desta demonstração são fictícios. */
(function () {
  'use strict';

  const STORAGE_KEY = 'vale-fight-manager-career-v1';
  const app = document.querySelector('#app');
  const toastRegion = document.querySelector('#toast-region');
  const difficultyProfiles = {
    aprendiz: { label: 'Aprendiz', cash: 120000, staff: 1, modifier: 0.82, description: 'Custos menores e orientação adicional.' },
    profissional: { label: 'Profissional', cash: 600000, staff: 3, modifier: 1, description: 'Economia completa e mercado equilibrado.' },
    elite: { label: 'Elite', cash: 2000000, staff: 4, modifier: 1.35, description: 'Mercado agressivo, estrutura de alto nível.' },
  };
  const prospects = [
    { id: 'mendes', name: 'Lucas Mendes', initials: 'LM', country: 'Brasil', discipline: 'MMA', division: 'Leve', age: 23, rating: 67, potential: 'B+', style: 'Finalizador versátil', signing: 45000, salary: 6100, record: '7-1-0', status: 'disponível' },
    { id: 'silva', name: 'Thiago Silva', initials: 'TS', country: 'Brasil', discipline: 'Boxe', division: 'Meio-médio', age: 22, rating: 64, potential: 'A-', style: 'Contra-golpeador', signing: 38000, salary: 5400, record: '5-0-0', status: 'disponível' },
    { id: 'carter', name: 'Jaden Carter', initials: 'JC', country: 'EUA', discipline: 'Boxe', division: 'Meio-médio', age: 21, rating: 72, potential: 'A', style: 'Pressão e volume', signing: 95000, salary: 12000, record: '8-1-0', status: 'disponível' },
    { id: 'adeleke', name: 'Khalil Adeleke', initials: 'KA', country: 'Nigéria', discipline: 'MMA', division: 'Pesado', age: 24, rating: 66, potential: 'A-', style: 'Power striker', signing: 61000, salary: 7800, record: '6-1-0', status: 'disponível' },
  ];
  const starterFighters = {
    boxe: { id: 'viana', name: 'Diego Viana', initials: 'DV', country: 'Brasil', discipline: 'Boxe', division: 'Leve', age: 24, rating: 63, potential: 'B+', style: 'Boxe técnico', signing: 0, salary: 5200, record: '4-0-0', status: 'ativo', conditioning: 76, morale: 72, camp: 35 },
    mma: { id: 'araujo', name: 'Nina Araújo', initials: 'NA', country: 'Brasil', discipline: 'MMA', division: 'Palha', age: 23, rating: 64, potential: 'A-', style: 'Grappling ofensivo', signing: 0, salary: 5600, record: '3-0-0', status: 'ativo', conditioning: 79, morale: 74, camp: 38 },
    misto: { id: 'moraes', name: 'Rafael Moraes', initials: 'RM', country: 'Brasil', discipline: 'MMA', division: 'Leve', age: 25, rating: 65, potential: 'B+', style: 'Striker completo', signing: 0, salary: 5900, record: '5-1-0', status: 'ativo', conditioning: 75, morale: 76, camp: 36 },
  };

  const rankingCatalog = {
    mma: {
      leve: { label: 'Peso leve', promotion: 'Circuito Apex', champion: 'Dante Kwan', country: 'Coreia do Sul', record: '18-3-0', rows: [
        ['Aiden Brooks', 'EUA', '20-4-0', 846, '▲ 1'], ['Murilo Sato', 'Brasil', '16-3-0', 812, '—'], ['Kaito Nakamura', 'Japão', '19-5-0', 798, '▼ 1'], ['Noah Clarke', 'Reino Unido', '15-2-0', 760, '▲ 2'], ['Ibrahim Touré', 'França', '17-5-0', 731, '—'], ['Pavel Orlov', 'Rússia', '14-3-0', 706, '▲ 1'], ['Mateo Díaz', 'México', '13-2-0', 694, '—'], ['Rui Carvalho', 'Portugal', '16-6-0', 671, '▼ 2'], ['Elias Grant', 'Canadá', '12-2-0', 648, '▲ 1'], ['Sora Kim', 'Coreia do Sul', '15-7-0', 623, '—'], ['Victor Mendez', 'Argentina', '14-5-0', 598, '—'], ['Otto Brandt', 'Alemanha', '11-3-0', 570, '▲ 2'], ['Sami Haddad', 'Tunísia', '13-6-0', 544, '—'], ['Diego Torres', 'Chile', '12-4-0', 515, '▼ 1'], ['Liam Parker', 'Austrália', '10-2-0', 490, '—'] ] },
      pena: { label: 'Peso pena', promotion: 'Circuito Apex', champion: 'Mina Okafor', country: 'Nigéria', record: '17-1-0', rows: [
        ['Asha Rahman', 'Índia', '16-2-0', 830, '—'], ['Bianca Ferretti', 'Itália', '15-3-0', 798, '▲ 1'], ['Camille Moreau', 'França', '14-2-0', 771, '▼ 1'], ['Erika Solberg', 'Suécia', '13-4-0', 734, '—'], ['Júlia Pinheiro', 'Brasil', '12-3-0', 701, '▲ 2'], ['Nora Hayes', 'Irlanda', '14-5-0', 675, '—'], ['Keiko Ito', 'Japão', '11-2-0', 649, '—'], ['Lola Mendoza', 'México', '13-6-0', 624, '▼ 2'], ['Sara Bell', 'EUA', '12-5-0', 598, '▲ 1'], ['Tala Ibrahim', 'Egito', '10-2-0', 575, '—'], ['Vera Costa', 'Portugal', '11-4-0', 548, '—'], ['Zoe Martin', 'Canadá', '9-2-0', 520, '▲ 1'], ['Hana Lee', 'Coreia do Sul', '12-6-0', 493, '—'], ['Lina Cruz', 'Espanha', '10-4-0', 468, '▼ 1'], ['Faye King', 'Reino Unido', '8-1-0', 441, '—'] ] },
    },
    boxe: {
      leve: { label: 'Peso leve', promotion: 'Liga Meridian', champion: 'Samuel Voss', country: 'Dinamarca', record: '24-1-0', rows: [
        ['Andrés Rojas', 'México', '22-3-0', 862, '—'], ['Maksim Levin', 'Rússia', '19-2-0', 824, '▲ 1'], ['Caio Fonseca', 'Brasil', '18-1-0', 790, '▼ 1'], ['Kieran Price', 'Reino Unido', '20-4-0', 755, '—'], ['Ari Cohen', 'Israel', '17-2-0', 728, '▲ 2'], ['Quinn Miller', 'EUA', '18-4-0', 699, '—'], ['Tomas Novak', 'República Tcheca', '16-3-0', 672, '▲ 1'], ['Gustavo Peña', 'Argentina', '15-3-0', 642, '▼ 2'], ['Luca Bianchi', 'Itália', '14-1-0', 615, '—'], ['Dario Klein', 'Alemanha', '16-5-0', 586, '▲ 1'], ['Hiro Tanaka', 'Japão', '13-2-0', 555, '—'], ['Issa Diallo', 'Mali', '15-6-0', 529, '—'], ['Nico Janssen', 'Holanda', '12-2-0', 502, '▲ 1'], ['Rami Akhtar', 'Paquistão', '14-5-0', 476, '—'], ['Ben Walker', 'Austrália', '11-1-0', 451, '▼ 1'] ] },
      'meio-medio': { label: 'Meio-médio', promotion: 'Liga Meridian', champion: 'Leon Sterling', country: 'Canadá', record: '25-0-0', rows: [
        ['Bruno Alcântara', 'Brasil', '21-2-0', 851, '▲ 1'], ['Caleb James', 'EUA', '20-3-0', 819, '—'], ['Dario Rizzo', 'Itália', '18-2-0', 783, '▼ 1'], ['Emil Kowalski', 'Polônia', '19-4-0', 748, '—'], ['Farid Mansour', 'Marrocos', '17-1-0', 720, '▲ 2'], ['Gabe O’Connor', 'Irlanda', '18-5-0', 694, '—'], ['Hugo Varela', 'Espanha', '16-2-0', 666, '—'], ['Ilya Denisov', 'Rússia', '17-5-0', 640, '▼ 2'], ['Jon Bell', 'Reino Unido', '15-3-0', 612, '▲ 1'], ['Kofi Mensah', 'Gana', '14-2-0', 584, '—'], ['Luis Ortega', 'México', '16-6-0', 557, '—'], ['Marco Dantas', 'Portugal', '13-2-0', 531, '▲ 1'], ['Neil Fraser', 'Escócia', '15-5-0', 502, '—'], ['Owen Li', 'China', '12-1-0', 475, '▼ 1'], ['Rafael Prado', 'Argentina', '14-4-0', 447, '—'] ] },
    },
  };

  function createWorldState() {
    return {
      seed: 271826,
      cycle: 0,
      selectedDiscipline: 'mma',
      selectedDivision: 'leve',
      watchedEventId: 'apex-32',
      playerRanking: { fighterId: null, points: 20, position: null, lastChange: 0 },
      events: [
        { id: 'apex-32', name: 'Circuito Apex 32', discipline: 'MMA', date: 'Semana 2', venue: 'Arena Solaris', main: 'Aiden Brooks × Kaito Nakamura', status: 'agendado' },
        { id: 'meridian-17', name: 'Liga Meridian 17', discipline: 'Boxe', date: 'Semana 3', venue: 'Pavilhão Norte', main: 'Andrés Rojas × Kieran Price', status: 'agendado' },
        { id: 'apex-33', name: 'Circuito Apex 33', discipline: 'MMA', date: 'Semana 4', venue: 'Domo Aurora', main: 'Asha Rahman × Júlia Pinheiro', status: 'agendado' },
      ],
      results: [],
    };
  }

  function makeSeed() {
    return {
      schemaVersion: 2,
      complete: false,
      view: 'home',
      onboardingStep: 1,
      draft: { managerName: '', academyName: '', city: 'São Paulo', focus: 'misto', difficulty: 'profissional', background: 'Ex-treinador' },
      week: 1,
      date: '12 Out 2026',
      cash: 600000,
      reputation: 21,
      fans: 950,
      academyLevel: 1,
      facilities: { ring: 1, cage: 1, conditioning: 1, recovery: 0 },
      staff: 3,
      fighters: [],
      signedIds: [],
      selectedFighterId: null,
      fightBooked: false,
      messages: [
        { text: 'Seu primeiro ciclo começa agora. Escolha bem: cada gasto altera o futuro da academia.', time: 'Semana 1' },
        { text: 'Mercado regional atualizado com quatro atletas fictícios disponíveis.', time: 'Hoje' },
      ],
      ledger: [
        { title: 'Capital inicial', category: 'Entrada de carreira', amount: 600000, week: 'S1', kind: 'income' },
        { title: 'Taxas e licenças da academia', category: 'Operação', amount: -18000, week: 'S1', kind: 'expense' },
      ],
      world: createWorldState(),
    };
  }

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (parsed && parsed.schemaVersion >= 1) {
        const migrated = { ...makeSeed(), ...parsed, schemaVersion: 2 };
        migrated.world = parsed.world ? { ...createWorldState(), ...parsed.world } : createWorldState();
        return migrated;
      }
    } catch (error) { console.warn('Não foi possível recuperar o save local.', error); }
    return makeSeed();
  }
  let state = loadState();

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
  function money(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);
  }
  function escapeHTML(value) {
    return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
  }
  function selectedFighter() {
    return state.fighters.find((fighter) => fighter.id === state.selectedFighterId) || state.fighters[0] || null;
  }
  function divisionKey(division = '') {
    return division.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '-');
  }
  function disciplineKey(discipline = '') { return discipline.toLowerCase() === 'boxe' ? 'boxe' : 'mma'; }
  function randomWorld() {
    state.world.seed = (state.world.seed * 1664525 + 1013904223) >>> 0;
    return state.world.seed / 4294967296;
  }
  function rankingGroup(discipline = state.world.selectedDiscipline, division = state.world.selectedDivision) {
    return rankingCatalog[discipline]?.[division] || rankingCatalog.mma.leve;
  }
  function rankingPosition() {
    const points = state.world.playerRanking.points;
    if (points < 90) return null;
    return Math.max(1, Math.min(15, 16 - Math.floor((points - 90) / 42)));
  }
  function refreshPlayerRanking() {
    const fighter = selectedFighter();
    if (!fighter) return null;
    const ranking = state.world.playerRanking;
    ranking.fighterId = fighter.id;
    const before = ranking.position;
    ranking.position = rankingPosition();
    ranking.lastChange = before && ranking.position ? before - ranking.position : 0;
    return ranking;
  }
  function playerRankingEntry(discipline, division) {
    const fighter = selectedFighter();
    const ranking = refreshPlayerRanking();
    if (!fighter || !ranking?.position || disciplineKey(fighter.discipline) !== discipline || divisionKey(fighter.division) !== division) return null;
    return { name: fighter.name, country: fighter.country, record: fighter.record, score: ranking.points, movement: ranking.lastChange > 0 ? `▲ ${ranking.lastChange}` : ranking.lastChange < 0 ? `▼ ${Math.abs(ranking.lastChange)}` : 'NOVO', player: true, position: ranking.position };
  }
  function composedRanking(discipline, division) {
    const group = rankingGroup(discipline, division);
    const rows = group.rows.map(([name, country, record, score, movement]) => ({ name, country, record, score, movement }));
    const player = playerRankingEntry(discipline, division);
    if (player) rows.splice(Math.min(player.position - 1, rows.length), 0, player);
    return rows.slice(0, 15).map((row, index) => ({ ...row, position: index + 1 }));
  }
  function simulateWorldCycle() {
    const event = state.world.events[state.world.cycle % state.world.events.length];
    const winnerFirst = randomWorld() > .46;
    const [first, second] = event.main.split(' × ');
    const method = winnerFirst ? 'decisão dividida' : 'interrupção no 3º round';
    const winner = winnerFirst ? first : second;
    event.status = `finalizado · ${winner}`;
    state.world.results.unshift({ event: event.name, winner, method, week: state.week });
    state.world.results = state.world.results.slice(0, 6);
    state.world.cycle += 1;
    const group = rankingGroup(event.discipline === 'Boxe' ? 'boxe' : 'mma', event.discipline === 'Boxe' ? 'leve' : state.world.cycle % 2 ? 'leve' : 'pena');
    if (group?.rows?.length > 3) {
      const index = 1 + Math.floor(randomWorld() * Math.min(8, group.rows.length - 2));
      [group.rows[index], group.rows[index + 1]] = [group.rows[index + 1], group.rows[index]];
    }
    addMessage(`${event.name}: ${winner} venceu por ${method}. O ranking simulado foi atualizado.`);
  }
  function addMessage(text) {
    state.messages.unshift({ text, time: `Semana ${state.week}` });
    state.messages = state.messages.slice(0, 12);
  }
  function addLedger(title, category, amount, kind) {
    state.ledger.unshift({ title, category, amount, kind, week: `S${state.week}` });
    state.ledger = state.ledger.slice(0, 18);
  }
  function toast(message) {
    const element = document.createElement('div');
    element.className = 'toast';
    element.innerHTML = `<strong>VALE //</strong> ${escapeHTML(message)}`;
    toastRegion.append(element);
    window.setTimeout(() => element.remove(), 3600);
  }
  function openModal(title, content, actions) {
    const actionHTML = actions.map((action) => `<button class="button ${action.className || 'secondary'}" data-modal-action="${action.id}">${escapeHTML(action.label)}</button>`).join('');
    document.body.insertAdjacentHTML('beforeend', `<div class="modal-backdrop" id="modal-backdrop" role="presentation"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><header id="modal-title">${escapeHTML(title)}</header><div class="modal-content">${content}</div><footer>${actionHTML}</footer></section></div>`);
    document.querySelector('#modal-backdrop').addEventListener('click', (event) => { if (event.target.id === 'modal-backdrop') closeModal(); });
    actions.forEach((action) => {
      document.querySelector(`[data-modal-action="${action.id}"]`).addEventListener('click', () => { closeModal(); action.onClick(); });
    });
  }
  function closeModal() { document.querySelector('#modal-backdrop')?.remove(); }
  function navButton(view, icon, label) { return `<button data-nav="${view}" class="${state.view === view ? 'active' : ''}"><span class="nav-icon">${icon}</span><span class="nav-label">${label}</span></button>`; }
  function progress(label, value, color = '') { return `<div class="progress-item"><span>${label}</span><div class="progress-track"><span style="width:${value}%;${color ? `background:${color}` : ''}"></span></div><strong class="progress-value">${value}%</strong></div>`; }
  function topBar() {
    return `<header class="topbar"><div class="manager"><div class="manager-avatar">♛</div><div><div class="overline">Gestor da academia</div><strong>${escapeHTML(state.draft.managerName || 'Novo empresário')}</strong></div></div><div class="resources"><div class="resource cash"><div class="resource-label">💵 Caixa disponível</div><strong>${money(state.cash)}</strong></div><div class="resource"><div class="resource-label">♛ Reputação</div><strong>${state.reputation}</strong></div><div class="resource fans"><div class="resource-label">♟ Fãs</div><strong>${state.fans.toLocaleString('pt-BR')}</strong></div></div><div class="week-chip">SEMANA ${state.week}<small>${state.date}</small></div></header>`;
  }
  function sideBar() {
    return `<aside class="sidebar"><div class="brand"><span class="brand-mark">V</span><div><div class="brand-name">VALE</div><div class="brand-sub">Fight Manager</div></div></div><nav class="nav" aria-label="Módulos principais">${navButton('home', '⌂', 'Central')}${navButton('roster', '♟', 'Lutadores')}${navButton('rankings', '♜', 'Rankings')}${navButton('academy', '⌂', 'Academia')}${navButton('finance', '▥', 'Finanças')}</nav><div class="sidebar-bottom"><strong>Parte 2</strong>Carreira local · rankings simulados · calendário competitivo</div></aside>`;
  }
  function statCard(label, value, note, color = '') { return `<article class="card stat-card"><span class="stat-label">${label}</span><strong style="${color ? `color:${color}` : ''}">${value}</strong><span class="delta">${note}</span></article>`; }
  function buildFightPanel() {
    const fighter = selectedFighter();
    if (!fighter) return `<aside class="next-fight"><div class="fight-head"><span>PRÓXIMO PASSO</span><span>RECRUTAMENTO</span></div><div class="section-body"><p class="text-muted">Sua academia precisa de um atleta para entrar no circuito.</p><button class="button" data-nav="roster">VER MERCADO</button></div></aside>`;
    const opponent = fighter.discipline === 'MMA' ? { name: 'Maya Santos', initials: 'MS', record: '4-1-0' } : { name: 'Iris Freitas', initials: 'IF', record: '6-2-0' };
    return `<aside class="next-fight"><div class="fight-head"><span>OPORTUNIDADE REGIONAL</span><span>${state.fightBooked ? 'CONFIRMADA' : 'PENDENTE'}</span></div><div class="fight-pair"><div class="fighter-token"><span class="portrait">${fighter.initials}</span><span>${escapeHTML(fighter.name.split(' ')[0])}</span><small>${fighter.record}</small></div><span class="versus">VS</span><div class="fighter-token"><span class="portrait">${opponent.initials}</span><span>${opponent.name.split(' ')[0]}</span><small>${opponent.record}</small></div></div><div class="fight-action">${state.fightBooked ? `<button class="button secondary" data-action="advance-week">PREPARAR CAMP</button>` : `<button class="button" data-action="book-fight">ACEITAR LUTA</button>`}</div></aside>`;
  }
  function homeView() {
    const fighter = selectedFighter();
    const cashNote = state.ledger[0]?.amount < 0 ? 'custos sob controle' : 'operação iniciada';
    const ranking = refreshPlayerRanking();
    return `<section class="content"><div class="page-heading"><div><div class="eyebrow">Central de gestão · ${escapeHTML(state.draft.academyName)}</div><h1>Construa o<br><span class="text-gold">seu legado.</span></h1><p class="page-copy">A primeira camada da carreira já está viva: recrute, desenvolva a estrutura e faça escolhas que mudam o seu caixa, elenco e reputação.</p></div><button class="button" data-action="advance-week">▸ AVANÇAR SEMANA</button></div><section class="hero"><div class="hero-copy"><div class="eyebrow">Ciclo de carreira ${state.week}</div><h1>${state.fightBooked ? 'CAMP<br><span class="text-gold">EM CURSO</span>' : 'PRÓXIMA<br><span class="text-gold">DECISÃO</span>'}</h1><p>${state.fightBooked ? 'Sua luta regional foi confirmada. Ganhe condicionamento, proteja a moral e avance o calendário para chegar pronto.' : 'A academia está aberta. O primeiro contrato e a primeira luta definirão o tom da sua trajetória.'}</p><button class="button secondary" data-nav="${fighter ? 'rankings' : 'roster'}">${fighter ? 'VER RANKINGS' : 'ENCONTRAR TALENTO'}</button></div><div class="hero-emblem"><div class="hero-emblem-inner"><span>V</span></div></div>${buildFightPanel()}</section><section class="stat-grid">${statCard('Caixa operacional', money(state.cash), cashNote, 'var(--green)')}${statCard('Reputação regional', state.reputation, state.reputation >= 30 ? 'marca em crescimento' : 'academia emergente', 'var(--gold-bright)')}${statCard('Posição de ranking', ranking?.position ? `#${ranking.position}` : 'NR', ranking?.position ? `${ranking.points} pontos de ranking` : 'vença no circuito para entrar', 'var(--gold-bright)')}${statCard('Elenco contratado', `${state.fighters.length}/4`, state.fighters.length ? 'atletas sob gestão' : 'mercado aguardando', 'var(--white)')}</section><section class="dashboard-grid"><article class="card"><div class="card-title"><span>${fighter ? `Evolução — ${escapeHTML(fighter.name)}` : 'Plano de entrada'}</span><small>${fighter ? 'camp inicial' : 'primeiro contrato'}</small></div><div class="section-body">${fighter ? `${progress('Condicionamento', fighter.conditioning || 70, 'background:linear-gradient(90deg,#45d78c,#84f1bd)')}${progress('Moral', fighter.morale || 70, 'background:linear-gradient(90deg,#4eaeff,#8ed2ff)')}${progress('Camp', fighter.camp || 35)}<div class="action-list" style="margin-top:14px"><div class="action-row"><div><strong>Treino dirigido</strong><small>+6 condicionamento · custo ${money(8500)}</small></div><button class="button secondary" data-action="train">TREINAR</button></div><div class="action-row"><div><strong>Sessão com a mídia</strong><small>+100 fãs · moral +2 · custo ${money(3200)}</small></div><button class="button secondary" data-action="media">ATIVAR</button></div></div>` : `<p class="text-muted">Contrate um atleta do mercado para liberar treino, camp e negociações de luta.</p><button class="button" data-nav="roster">ABRIR SCOUTING</button>`}</div></article><article class="card"><div class="card-title"><span>Agenda</span><small>próximos marcos</small></div><div class="section-body"><div class="agenda-item"><div class="agenda-date">W${state.week}<small>AGORA</small></div><div><strong>${state.fightBooked ? 'Camp de preparação' : 'Janela de recrutamento'}</strong><p>${state.fightBooked ? 'Treino e recuperação afetam a estreia.' : 'Prospects regionais disponíveis por tempo limitado.'}</p></div></div><div class="agenda-item"><div class="agenda-date">W${state.week + 1}<small>SEMANA</small></div><div><strong>Relatório financeiro</strong><p>Salários e manutenção serão aplicados no avanço do calendário.</p></div></div><div class="agenda-item"><div class="agenda-date">W${state.week + 2}<small>EVENTO</small></div><div><strong>${state.fightBooked ? 'Vale Regional 01' : 'Vitrine de talentos'}</strong><p>${state.fightBooked ? 'A vitória pode acelerar sua posição no ranking.' : 'Recrute antes de disputar sua primeira luta.'}</p></div></div></div></article><article class="card"><div class="card-title"><span>Central de notícias</span><small>mundo simulado</small></div><div class="feed">${state.messages.map((message) => `<div class="feed-item">${escapeHTML(message.text)}<small>${message.time}</small></div>`).join('')}</div></article></section></section>`;
  }
  function fighterRows() {
    const available = prospects.filter((prospect) => !state.signedIds.includes(prospect.id));
    const roster = [...state.fighters, ...available];
    return roster.map((fighter) => {
      const signed = state.signedIds.includes(fighter.id) || state.fighters.some((owned) => owned.id === fighter.id);
      const selected = fighter.id === state.selectedFighterId;
      return `<tr><td><div class="fighter-cell"><span class="mini-portrait">${fighter.initials}</span><div><strong>${escapeHTML(fighter.name)}</strong><small>${fighter.country} · ${fighter.age} anos</small></div></div></td><td>${fighter.discipline}<br><small class="text-muted">${fighter.division}</small></td><td class="rating">${fighter.rating}</td><td><span class="pill">${fighter.potential}</span></td><td>${escapeHTML(fighter.style)}</td><td>${signed ? `<button class="button secondary" data-action="select-fighter" data-id="${fighter.id}">${selected ? 'SELECIONADO' : 'GERIR'}</button>` : `<button class="button" data-action="hire" data-id="${fighter.id}">CONTRATAR</button>`}</td></tr>`;
    }).join('');
  }
  function rosterView() {
    const fighter = selectedFighter() || prospects[0];
    const isOwned = state.fighters.some((owned) => owned.id === fighter.id);
    return `<section class="content"><div class="page-heading"><div><div class="eyebrow">Scouting & contratos</div><h1>Mercado de<br><span class="text-gold">talentos.</span></h1><p class="page-copy">O elenco não é decorativo. Cada contratação reduz o caixa, gera salário semanal e abre novas decisões de treinamento e luta.</p></div><button class="button secondary" data-action="advance-week">ATUALIZAR MERCADO</button></div><section class="roster-layout"><article class="card table-wrap"><div class="card-title"><span>Prospects e elenco</span><small>${state.fighters.length} atleta(s) contratado(s)</small></div><table class="fighter-table"><thead><tr><th>Lutador</th><th>Modalidade</th><th>OVR</th><th>Potencial</th><th>Estilo</th><th>Ação</th></tr></thead><tbody>${fighterRows()}</tbody></table></article><aside class="card profile-panel"><div class="profile-banner"><div class="eyebrow">${isOwned ? 'Sob gestão' : 'Prospect disponível'}</div><h2>${escapeHTML(fighter.name)}</h2><p>${fighter.country} · ${fighter.discipline} · ${fighter.division}</p></div><div class="profile-data"><div><span>OVR</span><strong>${fighter.rating}</strong></div><div><span>Potencial</span><strong>${fighter.potential}</strong></div><div><span>Cartel</span><strong>${fighter.record}</strong></div><div><span>Idade</span><strong>${fighter.age}</strong></div></div><div class="section-body"><p class="text-muted">${escapeHTML(fighter.style)}. ${isOwned ? 'Pronto para ser o rosto inicial da academia.' : `Bônus de assinatura: ${money(fighter.signing)} · salário semanal: ${money(fighter.salary)}.`}</p>${isOwned ? `<button class="button" data-action="select-fighter" data-id="${fighter.id}" data-nav-after="home">GERIR ATLETA</button>` : `<button class="button" data-action="hire" data-id="${fighter.id}">ENVIAR PROPOSTA</button>`}</div></aside></section></section>`;
  }
  function academyView() {
    const ringCost = 70000 * state.academyLevel;
    const cageCost = 85000 * state.academyLevel;
    const recoveryCost = 54000 * (state.facilities.recovery + 1);
    return `<section class="content"><div class="page-heading"><div><div class="eyebrow">Estrutura & desenvolvimento</div><h1>Casa dos<br><span class="text-gold">campeões.</span></h1><p class="page-copy">Invista na estrutura para aumentar a qualidade do desenvolvimento. O upgrade desconta dinheiro, permanece salvo e se reflete na semana seguinte.</p></div><button class="button secondary" data-nav="roster">VER ELENCO</button></div><section class="academy-grid"><article class="card academy-stage"><div class="eyebrow">Academia nível ${state.academyLevel}</div><h2>${escapeHTML(state.draft.academyName)}</h2><p class="page-copy">${escapeHTML(state.draft.city)} · foco ${state.draft.focus === 'misto' ? 'MMA e Boxe' : state.draft.focus.toUpperCase()}</p><div class="facility-map"><div class="facility active"><span class="facility-icon">▣</span><strong>Ringue de boxe</strong><small>Nível ${state.facilities.ring} · técnica e sparring</small></div><div class="facility active"><span class="facility-icon">⬡</span><strong>Área de MMA</strong><small>Nível ${state.facilities.cage} · grappling e parede</small></div><div class="facility"><span class="facility-icon">▥</span><strong>Condicionamento</strong><small>Nível ${state.facilities.conditioning} · energia e prevenção</small></div><div class="facility ${state.facilities.recovery ? 'active' : ''}"><span class="facility-icon">♡</span><strong>Recuperação</strong><small>${state.facilities.recovery ? `Nível ${state.facilities.recovery} · moral e saúde` : 'Não construída'}</small></div></div></article><aside class="card upgrade-card"><div class="upgrade-hero"><div class="eyebrow">Melhoria disponível</div><h2>Próximo<br><span class="text-gold">investimento.</span></h2><p class="text-muted">Escolha uma evolução permanente.</p></div><div class="section-body"><div class="action-list"><div class="action-row"><div><strong>Elevar ringue</strong><small>Nível ${state.facilities.ring} → ${state.facilities.ring + 1} · Técnica +5%</small></div><button class="button" data-action="upgrade" data-facility="ring" data-cost="${ringCost}">${money(ringCost)}</button></div><div class="action-row"><div><strong>Elevar área de MMA</strong><small>Nível ${state.facilities.cage} → ${state.facilities.cage + 1} · Grappling +5%</small></div><button class="button" data-action="upgrade" data-facility="cage" data-cost="${cageCost}">${money(cageCost)}</button></div><div class="action-row"><div><strong>${state.facilities.recovery ? 'Elevar recuperação' : 'Construir recuperação'}</strong><small>Moral +3 · risco de lesão reduzido</small></div><button class="button" data-action="upgrade" data-facility="recovery" data-cost="${recoveryCost}">${money(recoveryCost)}</button></div></div></div><div class="upgrade-footer"><div><div class="overline">Caixa após próximo upgrade</div><div class="upgrade-cost">${money(Math.max(0, state.cash - Math.min(ringCost, cageCost, recoveryCost)))}</div></div><span class="pill ${state.cash < Math.min(ringCost, cageCost, recoveryCost) ? 'locked' : ''}">${state.cash < Math.min(ringCost, cageCost, recoveryCost) ? 'CAIXA INSUFICIENTE' : 'DISPONÍVEL'}</span></div></aside></section></section>`;
  }
  function rankingTabs() {
    const discipline = state.world.selectedDiscipline;
    const divisions = Object.entries(rankingCatalog[discipline]);
    return `<div class="ranking-filters"><div class="filter-label">Modalidade</div><div class="tab-row">${['mma', 'boxe'].map((key) => `<button class="ranking-tab ${discipline === key ? 'selected' : ''}" data-ranking-discipline="${key}">${key === 'mma' ? 'MMA' : 'BOXE'}</button>`).join('')}</div><div class="filter-label">Categoria</div><div class="tab-row">${divisions.map(([key, group]) => `<button class="ranking-tab ${state.world.selectedDivision === key ? 'selected' : ''}" data-ranking-division="${key}">${escapeHTML(group.label)}</button>`).join('')}</div></div>`;
  }
  function rankingRoute(position, points) {
    if (!position) return { title: 'Entrar no ranking', copy: `Faltam ${Math.max(0, 90 - points)} pontos. Uma vitória regional vale 95 pontos.`, tone: 'text-gold' };
    if (position > 10) return { title: 'Porta do Top 10', copy: 'Vença um atleta ranqueado ou acumule mais pontos no circuito para receber uma luta de aproximação.', tone: 'text-gold' };
    if (position > 5) return { title: 'Rota de eliminatória', copy: 'O Top 10 habilita convites para eliminatórias e eventos principais de maior bolsa.', tone: 'text-green' };
    return { title: 'Faixa de disputa', copy: 'Você está em faixa de disputa. Defesas, condições físicas e uma sequência consistente serão decisivas.', tone: 'text-green' };
  }
  function rankingsView() {
    const discipline = state.world.selectedDiscipline;
    const division = state.world.selectedDivision;
    const group = rankingGroup(discipline, division);
    const rows = composedRanking(discipline, division);
    const player = playerRankingEntry(discipline, division);
    const globalPlayer = refreshPlayerRanking();
    const route = rankingRoute(globalPlayer?.position, globalPlayer?.points || 0);
    const watched = state.world.events.find((event) => event.id === state.world.watchedEventId);
    return `<section class="content"><div class="page-heading"><div><div class="eyebrow">Circuitos independentes · temporada ${state.week}</div><h1>Ranking não é<br><span class="text-gold">decoração.</span></h1><p class="page-copy">O mundo segue em movimento a cada semana. Vitórias, eventos e a pontuação do seu atleta definem a rota até a oportunidade de título.</p></div><button class="button" data-action="advance-week">SIMULAR SEMANA</button></div><section class="ranking-summary">${statCard('Sua posição', globalPlayer?.position ? `#${globalPlayer.position}` : 'NR', globalPlayer?.position ? `${globalPlayer.points} pontos ativos` : `${globalPlayer?.points || 0}/90 para entrar`, 'var(--gold-bright)')}${statCard('Mundo simulado', `${state.world.cycle}`, `${state.world.results.length} evento(s) resolvido(s)`, 'var(--blue)')}${statCard('Próximo limiar', globalPlayer?.position ? 'TOP 10' : 'RANK 15', globalPlayer?.position ? 'rankings mudam a cada semana' : 'vitória regional necessária', 'var(--white)')}</section><section class="rankings-layout"><article class="card rankings-card"><div class="card-title"><span>Ranking simulado do Vale</span><small>atualizado após eventos de mundo</small></div><div class="rankings-body">${rankingTabs()}<div class="champion-strip"><div><span class="eyebrow">Campeão — ${escapeHTML(group.promotion)}</span><strong>${escapeHTML(group.champion)}</strong><small>${escapeHTML(group.country)} · ${group.record}</small></div><span class="champion-crown">♛</span></div><div class="ranking-list"><div class="ranking-list-head"><span>#</span><span>Lutador</span><span>Cartel</span><span>Pontos</span><span>Mov.</span></div>${rows.map((row) => `<div class="ranking-row ${row.player ? 'player-row' : ''}"><strong>${row.position}</strong><div><b>${escapeHTML(row.name)}${row.player ? '<em>VOCÊ</em>' : ''}</b><small>${escapeHTML(row.country)}</small></div><span>${row.record}</span><strong>${row.score}</strong><span class="movement ${row.movement.startsWith('▲') ? 'up' : row.movement.startsWith('▼') ? 'down' : ''}">${row.movement}</span></div>`).join('')}</div></div></article><aside class="ranking-side"><article class="card path-card"><div class="card-title"><span>Rota do atleta</span><small>${player ? 'na divisão exibida' : 'foco atual'}</small></div><div class="section-body"><div class="path-number">${globalPlayer?.position ? `#${globalPlayer.position}` : 'NR'}</div><h2>${escapeHTML(route.title)}</h2><p class="${route.tone}">${escapeHTML(route.copy)}</p><div class="point-meter"><span style="width:${Math.min(100, ((globalPlayer?.points || 0) / (globalPlayer?.position ? 510 : 90)) * 100)}%"></span></div><div class="path-footer"><span>${globalPlayer?.points || 0} PONTOS</span><span>${globalPlayer?.position ? 'META: TOP 10' : 'META: 90 PONTOS'}</span></div></div></article><article class="card"><div class="card-title"><span>Calendário competitivo</span><small>${watched ? `monitorando ${watched.name}` : 'escolha um evento'}</small></div><div class="event-list">${state.world.events.map((event) => `<div class="event-row ${event.id === state.world.watchedEventId ? 'watched' : ''}"><div><strong>${escapeHTML(event.name)}</strong><small>${event.discipline} · ${event.date} · ${event.venue}</small><p>${escapeHTML(event.main)}</p></div><button class="button secondary" data-action="watch-event" data-id="${event.id}">${event.id === state.world.watchedEventId ? 'SEGUINDO' : 'SEGUIR'}</button></div>`).join('')}</div></article><article class="card"><div class="card-title"><span>Últimos resultados</span><small>mundo autônomo</small></div><div class="feed ranking-feed">${state.world.results.length ? state.world.results.map((result) => `<div class="feed-item"><strong>${escapeHTML(result.event)}</strong><br>${escapeHTML(result.winner)} venceu por ${escapeHTML(result.method)}.<small>Semana ${result.week}</small></div>`).join('') : '<div class="feed-item">O primeiro evento do mundo será resolvido ao avançar a semana.<small>Calendário ativo</small></div>'}</div></article></aside></section></section>`;
  }
  function chartBars() {
    const incomes = [48, 56, 61, 55, 68, 73, 77, 84];
    const expenses = [22, 25, 29, 27, 34, 31, 38, 36];
    return incomes.map((value, index) => `<div class="bar-set"><span class="bar" style="height:${value}%"></span><span class="bar expense" style="height:${expenses[index]}%"></span><small>S${Math.max(1, state.week - 7 + index)}</small></div>`).join('');
  }
  function financeView() {
    const income = state.ledger.filter((entry) => entry.amount > 0).reduce((sum, entry) => sum + entry.amount, 0);
    const expenses = Math.abs(state.ledger.filter((entry) => entry.amount < 0).reduce((sum, entry) => sum + entry.amount, 0));
    return `<section class="content"><div class="page-heading"><div><div class="eyebrow">Finanças & operação</div><h1>Caixa define<br><span class="text-gold">o alcance.</span></h1><p class="page-copy">Toda decisão deste protótipo gera lançamento no livro-caixa. A receita e os custos persistem no save local.</p></div><button class="button secondary" data-action="advance-week">FECHAR SEMANA</button></div><section class="stat-grid">${statCard('Saldo atual', money(state.cash), 'liquidez disponível', 'var(--green)')}${statCard('Entradas totais', money(income), 'capital e receitas', 'var(--gold-bright)')}${statCard('Saídas totais', money(expenses), 'estrutura e operação', '#ff6870')}${statCard('Projeção semanal', money(-(state.fighters.reduce((sum, fighter) => sum + fighter.salary, 0) + state.staff * 1800)), `${state.staff} pessoa(s) na equipe`, 'var(--white)')}</section><section class="finance-grid"><article class="card"><div class="card-title"><span>Fluxo da operação</span><small>histórico ilustrativo + operações reais</small></div><div class="chart">${chartBars()}</div><div class="card-title"><span>Livro-caixa</span><small>${state.ledger.length} lançamentos</small></div><div class="ledger">${state.ledger.map((entry) => `<div class="ledger-row"><div><strong>${escapeHTML(entry.title)}</strong><small>${escapeHTML(entry.category)} · ${entry.week}</small></div><strong class="${entry.amount >= 0 ? 'text-green' : 'text-red'}">${entry.amount >= 0 ? '+' : '−'}${money(Math.abs(entry.amount))}</strong></div>`).join('')}</div></article><aside class="card insight"><div class="card-title"><span>Composição</span><small>nesta carreira</small></div><div class="ring"><strong>42%<small>capital</small></strong></div><div class="breakdown"><div class="breakdown-row"><span>Investimento inicial</span><strong>42%</strong></div><div class="breakdown-row"><span>Operação e contratos</span><strong>34%</strong></div><div class="breakdown-row"><span>Reserva de expansão</span><strong>24%</strong></div></div><div class="section-body" style="padding:20px 0 0"><p class="text-muted">A regra de ouro do Vale: não há recursos infinitos. Crescimento exige manter o caixa positivo.</p></div></aside></section></section>`;
  }
  function shell(viewMarkup) { return `<div class="app-shell">${sideBar()}<main class="main">${topBar()}${viewMarkup}</main></div>`; }
  function onboarding() {
    const step = state.onboardingStep;
    const draft = state.draft;
    const steps = [1, 2, 3].map((number) => `<span class="step-dot ${step === number ? 'current' : ''}">${number}</span>`).join('<span>—</span>');
    let content = '';
    if (step === 1) content = `<h2>Você no comando.</h2><p>Crie a identidade do empresário e dê um nome ao primeiro capítulo da sua operação.</p><div class="form-grid"><div class="field"><label for="managerName">Seu nome</label><input id="managerName" data-draft="managerName" value="${escapeHTML(draft.managerName)}" maxlength="28" placeholder="Ex.: Alex Monteiro" autocomplete="name" /></div><div class="field"><label for="city">Cidade-sede</label><input id="city" data-draft="city" value="${escapeHTML(draft.city)}" maxlength="30" /></div><div class="field full"><label for="academyName">Nome da academia</label><input id="academyName" data-draft="academyName" value="${escapeHTML(draft.academyName)}" maxlength="34" placeholder="Ex.: Orion Fight Club" /></div></div>`;
    if (step === 2) content = `<h2>Defina o foco.</h2><p>Seu primeiro atleta e a leitura do mercado refletem a disciplina escolhida. A expansão para ambas as modalidades continua possível.</p><div class="choices">${['boxe', 'mma', 'misto'].map((focus) => `<button class="choice ${draft.focus === focus ? 'selected' : ''}" data-choice="focus" data-value="${focus}"><strong>${focus === 'mma' ? 'MMA' : focus === 'boxe' ? 'BOXE' : 'MISTO'}</strong><small>${focus === 'misto' ? 'Flexibilidade de elenco · início equilibrado' : focus === 'boxe' ? 'Técnica, cartel e circuito de ringue' : 'Grappling, striking e transição de solo'}</small></button>`).join('')}</div><div style="height:18px"></div><div class="field"><label>Histórico profissional</label><div class="choices">${['Ex-treinador', 'Ex-atleta', 'Investidor'].map((background) => `<button class="choice ${draft.background === background ? 'selected' : ''}" data-choice="background" data-value="${background}"><strong>${background}</strong><small>${background === 'Ex-treinador' ? '+ desenvolvimento inicial' : background === 'Ex-atleta' ? '+ moral e leitura de luta' : '+ caixa inicial de segurança'}</small></button>`).join('')}</div></div>`;
    if (step === 3) content = `<h2>Escolha o risco.</h2><p>A dificuldade determina seu caixa de partida e a pressão do mercado. As regras da carreira permanecem as mesmas.</p><div class="choices">${Object.entries(difficultyProfiles).map(([key, profile]) => `<button class="choice ${draft.difficulty === key ? 'selected' : ''}" data-choice="difficulty" data-value="${key}"><strong>${profile.label}</strong><small>${money(profile.cash)} · ${profile.staff} técnico(s)<br>${profile.description}</small></button>`).join('')}</div><div class="card" style="margin-top:24px"><div class="section-body"><div class="eyebrow">Resumo da carreira</div><h3 style="margin-top:8px">${escapeHTML(draft.academyName || 'Sua academia')}</h3><p class="text-muted" style="margin-bottom:0">${escapeHTML(draft.managerName || 'Novo empresário')} · ${escapeHTML(draft.city)} · ${difficultyProfiles[draft.difficulty].label} · ${draft.focus === 'misto' ? 'MMA e Boxe' : draft.focus.toUpperCase()}</p></div></div>`;
    return `<section class="onboarding"><div class="onboarding-frame"><header class="onboarding-header"><div class="onboarding-logo"><img src="assets/vale-fight-manager-logo.png" alt="Logo Vale Fight Manager" /><div><div class="brand-name">VALE</div><div class="brand-sub">Fight Manager · Parte 1</div></div></div><div class="steps" aria-label="Etapa ${step} de 3">${steps}</div></header><div class="onboarding-body"><aside class="onboarding-art"><div class="eyebrow">A jornada começa agora</div><h1>DONO.<br><span class="text-gold">GESTOR.</span><br>LEGADO.</h1><p>Você não entra no octógono: você encontra talentos, constrói a estrutura e escreve carreiras.</p></aside><form class="onboarding-content" id="onboarding-form">${content}<div class="onboarding-actions">${step > 1 ? '<button class="button secondary" type="button" data-action="onboarding-back">VOLTAR</button>' : '<span></span>'}${step < 3 ? '<button class="button" type="button" data-action="onboarding-next">CONTINUAR</button>' : '<button class="button" type="submit">INICIAR CARREIRA</button>'}</div></form></div></div></section>`;
  }
  function render() {
    if (!state.complete) { app.innerHTML = onboarding(); bindEvents(); return; }
    let view = homeView();
    if (state.view === 'roster') view = rosterView();
    if (state.view === 'rankings') view = rankingsView();
    if (state.view === 'academy') view = academyView();
    if (state.view === 'finance') view = financeView();
    app.innerHTML = shell(view);
    bindEvents();
  }
  function setDraftFromInputs() {
    document.querySelectorAll('[data-draft]').forEach((input) => { state.draft[input.dataset.draft] = input.value.trim(); });
  }
  function startCareer() {
    setDraftFromInputs();
    if (!state.draft.managerName || !state.draft.academyName) { toast('Preencha seu nome e o nome da academia antes de começar.'); state.onboardingStep = 1; render(); return; }
    const profile = difficultyProfiles[state.draft.difficulty];
    const starter = { ...starterFighters[state.draft.focus] };
    if (state.draft.background === 'Ex-treinador') starter.camp += 8;
    if (state.draft.background === 'Ex-atleta') starter.morale += 7;
    state.cash = profile.cash;
    if (state.draft.background === 'Investidor') state.cash += 90000;
    state.staff = profile.staff;
    state.fighters = [starter];
    state.selectedFighterId = starter.id;
    state.ledger = [{ title: 'Capital de abertura', category: 'Início de carreira', amount: state.cash, week: 'S1', kind: 'income' }, { title: 'Licenças e abertura', category: 'Operação', amount: -18000, week: 'S1', kind: 'expense' }];
    state.cash -= 18000;
    state.complete = true;
    addMessage(`${starter.name} assinou como o primeiro atleta de ${state.draft.academyName}.`);
    persist(); render(); toast('Carreira criada. Seu primeiro atleta já está no elenco.');
  }
  function hire(id) {
    const prospect = prospects.find((candidate) => candidate.id === id);
    if (!prospect || state.signedIds.includes(id)) return;
    const price = prospect.signing + prospect.salary;
    if (state.cash < price) { toast('Caixa insuficiente para assinatura e primeira semana de salário.'); return; }
    state.cash -= price;
    const fighter = { ...prospect, status: 'ativo', conditioning: 68, morale: 68, camp: 18 };
    state.fighters.push(fighter); state.signedIds.push(id); state.selectedFighterId = id;
    addLedger(`Assinatura: ${prospect.name}`, 'Contrato de atleta', -prospect.signing, 'expense');
    addLedger(`Salário inicial: ${prospect.name}`, 'Folha de pagamento', -prospect.salary, 'expense');
    addMessage(`${prospect.name} aceitou a proposta. O atleta entrou no elenco.`);
    persist(); render(); toast(`${prospect.name} foi contratado e agora pode ser gerido.`);
  }
  function upgrade(facility, cost) {
    if (state.cash < cost) { toast('Caixa insuficiente para este investimento.'); return; }
    state.cash -= cost; state.facilities[facility] += 1; state.academyLevel = Math.max(state.academyLevel, state.facilities[facility]);
    const names = { ring: 'Ringue de boxe', cage: 'Área de MMA', recovery: 'Centro de recuperação' };
    addLedger(`Upgrade: ${names[facility]}`, 'Estrutura', -cost, 'expense');
    addMessage(`${names[facility]} avançou para o nível ${state.facilities[facility]}.`);
    persist(); render(); toast(`${names[facility]} melhorado com sucesso.`);
  }
  function train() {
    const fighter = selectedFighter(); if (!fighter) { toast('Contrate ou selecione um atleta primeiro.'); return; }
    const cost = 8500; if (state.cash < cost) { toast('Caixa insuficiente para este bloco de treinamento.'); return; }
    state.cash -= cost; fighter.conditioning = Math.min(100, (fighter.conditioning || 70) + 6); fighter.camp = Math.min(100, (fighter.camp || 20) + 8); fighter.morale = Math.min(100, (fighter.morale || 70) + 1);
    addLedger(`Treino dirigido: ${fighter.name}`, 'Desenvolvimento', -cost, 'expense'); addMessage(`${fighter.name} concluiu treino dirigido: condicionamento e camp evoluíram.`);
    persist(); render(); toast('Sessão concluída: condicionamento +6 e camp +8.');
  }
  function media() {
    const fighter = selectedFighter(); if (!fighter) { toast('Contrate ou selecione um atleta primeiro.'); return; }
    const cost = 3200; if (state.cash < cost) { toast('Caixa insuficiente para acionar a mídia.'); return; }
    state.cash -= cost; state.fans += 100; fighter.morale = Math.min(100, (fighter.morale || 70) + 2);
    addLedger(`Sessão de mídia: ${fighter.name}`, 'Marketing', -cost, 'expense'); addMessage(`A sessão de mídia de ${fighter.name} alcançou 100 novos fãs locais.`);
    persist(); render(); toast('Alcance ativado: +100 fãs e moral +2.');
  }
  function bookFight() {
    const fighter = selectedFighter(); if (!fighter) { toast('Você precisa de um atleta contratado para aceitar a luta.'); return; }
    state.fightBooked = true; fighter.camp = Math.min(100, (fighter.camp || 20) + 5); addMessage(`${fighter.name} aceitou uma luta no Vale Regional 01. O camp é agora prioridade.`);
    persist(); render(); toast('Luta aceita. Prepare o atleta antes do evento.');
  }
  function advanceWeek() {
    const payroll = state.fighters.reduce((sum, fighter) => sum + fighter.salary, 0) + state.staff * 1800 + 4500;
    state.cash -= payroll; state.week += 1; state.date = `Semana ${state.week} · 2026`;
    simulateWorldCycle();
    state.fighters.forEach((fighter) => { fighter.conditioning = Math.max(50, Math.min(100, (fighter.conditioning || 70) + (state.fightBooked ? 2 : -1))); fighter.morale = Math.max(45, Math.min(100, (fighter.morale || 70) + 1)); if (state.fightBooked) fighter.camp = Math.min(100, (fighter.camp || 20) + 7); });
    addLedger('Folha, manutenção e logística', 'Fechamento semanal', -payroll, 'expense');
    if (state.fightBooked && state.week % 3 === 0) {
      const fighter = selectedFighter(); const reward = 48000 + state.reputation * 900; const previousRank = state.world.playerRanking.position; state.cash += reward; state.reputation += 5; state.fans += 260; fighter.record = incrementWin(fighter.record); fighter.camp = 15; fighter.conditioning = Math.max(55, fighter.conditioning - 12); state.fightBooked = false;
      state.world.playerRanking.points += 95;
      const updatedRank = refreshPlayerRanking();
      addLedger(`Bolsa e bônus: ${fighter.name}`, 'Vale Regional 01', reward, 'income'); addMessage(`${fighter.name} venceu no Vale Regional 01. +95 pontos de ranking e reputação em alta.`);
      if (!previousRank && updatedRank?.position) addMessage(`${fighter.name} entrou no ranking simulado em #${updatedRank.position}. Uma nova rota competitiva foi aberta.`);
      toast(`Vitória no Vale Regional 01! +${money(reward)}, +5 reputação e +95 pontos.`);
    } else { addMessage(`Semana ${state.week} concluída. Folha e manutenção foram liquidadas.`); toast(`Semana ${state.week} avançada. Custos operacionais aplicados.`); }
    persist(); render();
  }
  function incrementWin(record) { const [wins, losses, draws] = record.split('-').map(Number); return `${wins + 1}-${losses}-${draws}`; }
  function resetCareer() { localStorage.removeItem(STORAGE_KEY); state = makeSeed(); render(); toast('Save local removido. Uma nova carreira pode começar.'); }
  function bindEvents() {
    app.querySelectorAll('[data-nav]').forEach((button) => button.addEventListener('click', () => { state.view = button.dataset.nav; persist(); render(); }));
    app.querySelectorAll('[data-choice]').forEach((button) => button.addEventListener('click', () => { state.draft[button.dataset.choice] = button.dataset.value; persist(); render(); }));
    app.querySelectorAll('[data-ranking-discipline]').forEach((button) => button.addEventListener('click', () => { state.world.selectedDiscipline = button.dataset.rankingDiscipline; state.world.selectedDivision = Object.keys(rankingCatalog[state.world.selectedDiscipline])[0]; persist(); render(); }));
    app.querySelectorAll('[data-ranking-division]').forEach((button) => button.addEventListener('click', () => { state.world.selectedDivision = button.dataset.rankingDivision; persist(); render(); }));
    app.querySelectorAll('[data-action]').forEach((button) => button.addEventListener('click', () => {
      const action = button.dataset.action;
      if (action === 'onboarding-next') { setDraftFromInputs(); if (state.onboardingStep === 1 && (!state.draft.managerName || !state.draft.academyName)) { toast('Informe seu nome e o nome da academia.'); return; } state.onboardingStep += 1; persist(); render(); }
      if (action === 'onboarding-back') { setDraftFromInputs(); state.onboardingStep -= 1; persist(); render(); }
      if (action === 'hire') hire(button.dataset.id);
      if (action === 'select-fighter') { state.selectedFighterId = button.dataset.id; persist(); if (button.dataset.navAfter) state.view = button.dataset.navAfter; render(); }
      if (action === 'upgrade') upgrade(button.dataset.facility, Number(button.dataset.cost));
      if (action === 'train') train();
      if (action === 'media') media();
      if (action === 'book-fight') bookFight();
      if (action === 'watch-event') { state.world.watchedEventId = button.dataset.id; const event = state.world.events.find((entry) => entry.id === button.dataset.id); addMessage(`Você passou a monitorar ${event.name}. Os resultados aparecerão ao avançar a semana.`); persist(); render(); toast(`Agora acompanhando ${event.name}.`); }
      if (action === 'advance-week') advanceWeek();
      if (action === 'reset') openModal('Recomeçar carreira', '<p>Isso apagará o save local deste navegador. Esta ação não afeta o código do projeto nem o repositório.</p>', [{ id: 'cancel', label: 'Cancelar', className: 'secondary', onClick: () => {} }, { id: 'confirm', label: 'Apagar save', className: 'danger', onClick: resetCareer }]);
    }));
    const form = app.querySelector('#onboarding-form'); if (form) form.addEventListener('submit', (event) => { event.preventDefault(); startCareer(); });
  }
  window.ValeFightManager = { reset: () => resetCareer(), getState: () => structuredClone(state) };
  render();
}());
