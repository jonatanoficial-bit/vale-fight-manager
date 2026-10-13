/* Vale Fight Manager — Fases 1 a 4
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

  const countries = {
    'Alemanha': 'DE', 'Argentina': 'AR', 'Austrália': 'AU', 'Brasil': 'BR', 'Canadá': 'CA', 'Chile': 'CL', 'China': 'CN', 'Coreia do Sul': 'KR', 'Dinamarca': 'DK', 'Egito': 'EG', 'Espanha': 'ES', 'EUA': 'US', 'França': 'FR', 'Gana': 'GH', 'Holanda': 'NL', 'Índia': 'IN', 'Irlanda': 'IE', 'Israel': 'IL', 'Itália': 'IT', 'Japão': 'JP', 'Mali': 'ML', 'Marrocos': 'MA', 'México': 'MX', 'Nigéria': 'NG', 'Paquistão': 'PK', 'Polônia': 'PL', 'Portugal': 'PT', 'Reino Unido': 'GB', 'República Tcheca': 'CZ', 'Rússia': 'RU', 'Suécia': 'SE', 'Tunísia': 'TN',
  };
  const avatarProfiles = [
    { skin: '#7f4f38', hair: '#17100e', shirt: '#bf2534', accent: '#f2bd62' },
    { skin: '#d39368', hair: '#2d1b17', shirt: '#1d74bd', accent: '#8bd4ff' },
    { skin: '#593a2a', hair: '#101114', shirt: '#af7a29', accent: '#ffe09a' },
    { skin: '#e1ad85', hair: '#5a3320', shirt: '#4b8c70', accent: '#a5f0ca' },
    { skin: '#9f6444', hair: '#3a2017', shirt: '#793cc1', accent: '#dcbdff' },
    { skin: '#d7a080', hair: '#1a1515', shirt: '#c44955', accent: '#ffd2d8' },
    { skin: '#71432f', hair: '#161213', shirt: '#278c91', accent: '#a9f3ed' },
    { skin: '#c8845d', hair: '#46342f', shirt: '#a26a28', accent: '#ffe0a5' },
  ];
  const fighterPortraits = {
    mendes: 'assets/fighters/lucas-mendes.png',
    silva: 'assets/fighters/thiago-silva.png',
    carter: 'assets/fighters/jaden-carter.png',
    adeleke: 'assets/fighters/khalil-adeleke.png',
    viana: 'assets/fighters/diego-viana.png',
    araujo: 'assets/fighters/nina-araujo.png',
    moraes: 'assets/fighters/rafael-moraes.png',
  };
  const fightTactics = {
    aggressive: { label: 'Pressão', icon: '✦', copy: 'Aumenta o dano e o risco.', offense: 1.28, guard: .82, stamina: 12, animation: 'strike' },
    defensive: { label: 'Defesa', icon: '◈', copy: 'Protege a saúde e lê a luta.', offense: .72, guard: 1.42, stamina: 6, animation: 'guard' },
    clinch: { label: 'Clinch', icon: '⊗', copy: 'Controle próximo e desgaste.', offense: 1.02, guard: 1.12, stamina: 9, animation: 'clinch' },
    takedown: { label: 'Queda', icon: '↘', copy: 'Busca controle no solo.', offense: 1.16, guard: .96, stamina: 11, animation: 'takedown' },
    counter: { label: 'Contra-golpe', icon: '↶', copy: 'Responde ao avanço rival.', offense: 1.12, guard: 1.18, stamina: 8, animation: 'counter' },
    conserve: { label: 'Conservar', icon: 'ϟ', copy: 'Recupera energia e paciência.', offense: .55, guard: 1.25, stamina: -10, animation: 'recover' },
  };

  function createFightState() {
    return { status: 'idle', readyWeek: null, round: 1, exchanges: 0, maxRounds: 3, playerHealth: 100, playerStamina: 100, opponentHealth: 100, opponentStamina: 100, momentum: 0, log: [], opponent: null, lastAction: 'ready', result: null, seed: 94117 };
  }
  function createNegotiationState() {
    return { prospectId: null, status: 'idle', offer: null, seed: 371951, attempts: 0, result: null };
  }
  function createEventPlannerState() {
    return { venueId: 'vale-arena', promotionId: 'regional', dateOffset: 3, fighterId: null, activeEvent: null, history: [] };
  }
  const eventVenues = [
    { id: 'vale-arena', name: 'Arena Vale', city: 'São Paulo', capacity: 4800, rental: 54000, production: 32000, ticket: 96, badge: 'CASA' },
    { id: 'pavilhao-norte', name: 'Pavilhão Norte', city: 'Campinas', capacity: 7600, rental: 98000, production: 51000, ticket: 118, badge: 'REGIONAL' },
    { id: 'domo-aurora', name: 'Domo Aurora', city: 'Rio de Janeiro', capacity: 11800, rental: 185000, production: 88000, ticket: 145, badge: 'PREMIUM' },
  ];
  const promotionPlans = [
    { id: 'local', name: 'Circuito local', cost: 18000, audience: 320, media: 9000, copy: 'Rádio, mídia de bairro e base de fãs.' },
    { id: 'regional', name: 'Campanha regional', cost: 46000, audience: 980, media: 29000, copy: 'Digital, imprensa esportiva e parceiros locais.' },
    { id: 'broadcast', name: 'Noite transmitida', cost: 98000, audience: 2050, media: 82000, copy: 'Cobertura ampliada e pacote de transmissão fictício.' },
  ];
  function contractFor(fighter, offer = {}) {
    const duration = offer.duration || 2;
    return { id: `contract-${fighter.id}-${Date.now()}-${Math.floor(Math.random() * 1000)}`, fighterId: fighter.id, fighterName: fighter.name, signing: offer.signing ?? fighter.signing ?? 0, salary: offer.salary ?? fighter.salary, duration, revenueShare: offer.revenueShare ?? 10, imageRights: offer.imageRights ?? 50, remainingWeeks: duration * 52, status: 'ativo' };
  }

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
      schemaVersion: 5,
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
      fight: createFightState(),
      contracts: [],
      contractHistory: [],
      negotiation: createNegotiationState(),
      eventPlanner: createEventPlannerState(),
    };
  }

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (parsed && parsed.schemaVersion >= 1) {
        const migrated = { ...makeSeed(), ...parsed, schemaVersion: 5 };
        migrated.world = parsed.world ? { ...createWorldState(), ...parsed.world } : createWorldState();
        migrated.fight = parsed.fight ? { ...createFightState(), ...parsed.fight } : createFightState();
        migrated.contracts = Array.isArray(parsed.contracts) ? parsed.contracts : (parsed.fighters || []).map((fighter) => contractFor(fighter, { signing: fighter.signing || 0, salary: fighter.salary, duration: 2 }));
        migrated.contractHistory = Array.isArray(parsed.contractHistory) ? parsed.contractHistory : [];
        migrated.negotiation = parsed.negotiation ? { ...createNegotiationState(), ...parsed.negotiation } : createNegotiationState();
        migrated.eventPlanner = parsed.eventPlanner ? { ...createEventPlannerState(), ...parsed.eventPlanner, history: Array.isArray(parsed.eventPlanner.history) ? parsed.eventPlanner.history : [] } : createEventPlannerState();
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
  function countryCode(country) { return countries[country] || 'UN'; }
  function countryFlag(country) {
    const code = countryCode(country);
    const flag = code === 'UN' ? '🏳' : String.fromCodePoint(...[...code].map((letter) => 127397 + letter.charCodeAt(0)));
    return `<span class="country-flag" role="img" aria-label="${escapeHTML(country)}">${flag}</span>`;
  }
  function avatarIndex(source) {
    return [...String(source)].reduce((total, character) => total + character.charCodeAt(0), 0) % avatarProfiles.length;
  }
  function fighterAvatar(fighter, size = '') {
    const profileIndex = avatarIndex(fighter.id || fighter.name);
    const profile = avatarProfiles[profileIndex];
    const initials = escapeHTML(fighter.initials || fighter.name.split(' ').map((part) => part[0]).slice(0, 2).join(''));
    const portraitList = Object.values(fighterPortraits);
    const portrait = fighterPortraits[fighter.id] || portraitList[profileIndex % portraitList.length];
    return `<span class="fighter-avatar has-photo ${size}" style="--skin:${profile.skin};--hair:${profile.hair};--shirt:${profile.shirt};--accent:${profile.accent}" role="img" aria-label="Retrato cinematográfico de ${escapeHTML(fighter.name)}"><img src="${portrait}" alt="" loading="lazy"><span class="avatar-mark">${initials}</span></span>`;
  }
  function fighterIdentity(fighter, compact = false) {
    return `${countryFlag(fighter.country)}${compact ? '' : ` ${escapeHTML(fighter.country)}`}`;
  }
  function prospectById(id) { return prospects.find((fighter) => fighter.id === id); }
  function eventPlanner() { return state.eventPlanner || createEventPlannerState(); }
  function selectedVenue() { return eventVenues.find((venue) => venue.id === eventPlanner().venueId) || eventVenues[0]; }
  function selectedPromotion() { return promotionPlans.find((plan) => plan.id === eventPlanner().promotionId) || promotionPlans[1]; }
  function eventFighter() {
    const planner = eventPlanner();
    return state.fighters.find((fighter) => fighter.id === planner.fighterId) || selectedFighter();
  }
  function eventEstimate(fighter = eventFighter(), venue = selectedVenue(), promotion = selectedPromotion()) {
    if (!fighter) return { attendance: 0, gate: 0, media: 0, operating: venue.production, purse: 0, totalCost: venue.rental + promotion.cost + venue.production, projected: -(venue.rental + promotion.cost + venue.production) };
    const interest = state.fans * .16 + state.reputation * 34 + fighter.rating * 12 + promotion.audience;
    const attendance = Math.min(venue.capacity, Math.max(600, Math.round(interest)));
    const gate = attendance * venue.ticket;
    const media = promotion.media + Math.round(state.reputation * 330);
    const purse = 26000 + fighter.rating * 440;
    const operating = venue.production + Math.round(attendance * 7.5);
    const totalCost = venue.rental + promotion.cost + operating;
    return { attendance, gate, media, operating, purse, totalCost, projected: gate + media - totalCost + purse };
  }
  function eventStatusCopy(event) {
    if (!event) return 'Configure seu primeiro card autoral.';
    if (event.status === 'planned') return `Show confirmado para a Semana ${event.week}. A preparação está em curso.`;
    if (event.status === 'ready') return 'Portões abertos. A luta principal está pronta para a Fight Night.';
    if (event.status === 'live') return 'Evento ao vivo. A decisão do corner define o resultado.';
    return `Evento concluído · ${event.attendance.toLocaleString('pt-BR')} pessoas na arena.`;
  }
  function offerFor(prospect) {
    return { signing: prospect.signing, salary: prospect.salary, duration: 2, revenueShare: 10, imageRights: 50 };
  }
  function negotiationProspect() { return prospectById(state.negotiation?.prospectId); }
  function negotiationScore(prospect, offer) {
    if (!prospect || !offer) return 0;
    const signing = Math.min(1.35, Math.max(.2, offer.signing / Math.max(1, prospect.signing)));
    const salary = Math.min(1.35, Math.max(.2, offer.salary / Math.max(1, prospect.salary)));
    const project = Math.min(1, (state.reputation + state.academyLevel * 7) / 70);
    const schedule = state.fightBooked ? .62 : .92;
    const rights = Math.min(1, offer.imageRights / 70);
    const share = Math.min(1, offer.revenueShare / 18);
    const temperament = 5 + avatarIndex(prospect.id) % 8;
    return Math.round(Math.max(7, Math.min(92, 14 + signing * 15 + salary * 21 + project * 12 + schedule * 7 + rights * 7 + share * 6 + temperament)));
  }
  function negotiationRead(score) {
    if (score >= 76) return { label: 'Muito favorável', tone: 'text-green', copy: 'Os termos superam a expectativa do atleta.' };
    if (score >= 58) return { label: 'Proposta competitiva', tone: 'text-gold', copy: 'O agente considera a oferta séria, mas a decisão continua incerta.' };
    if (score >= 40) return { label: 'Zona de risco', tone: 'text-red', copy: 'A proposta precisa de contrapartidas para convencer.' };
    return { label: 'Baixa aderência', tone: 'text-red', copy: 'O pacote está distante das prioridades do atleta.' };
  }
  function negotiationFactors(prospect, offer) {
    const score = negotiationScore(prospect, offer);
    const rows = [
      { label: 'Bônus de assinatura', value: offer.signing >= prospect.signing ? 'acima da referência' : 'abaixo da referência', good: offer.signing >= prospect.signing },
      { label: 'Salário semanal', value: offer.salary >= prospect.salary ? 'mercado respeitado' : 'abaixo do mercado', good: offer.salary >= prospect.salary },
      { label: 'Projeto da academia', value: `reputação ${state.reputation} · nível ${state.academyLevel}`, good: state.reputation + state.academyLevel * 7 >= 30 },
      { label: 'Direitos de imagem', value: `${offer.imageRights}% para o atleta`, good: offer.imageRights >= 45 },
      { label: 'Participação em receitas', value: `${offer.revenueShare}% do atleta`, good: offer.revenueShare >= 9 },
    ];
    return { score, rows };
  }
  function nextNegotiationRandom() {
    state.negotiation.seed = (state.negotiation.seed * 1664525 + 1013904223) >>> 0;
    return state.negotiation.seed / 4294967296;
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
    return `<aside class="sidebar"><div class="brand"><span class="brand-mark">V</span><div><div class="brand-name">VALE</div><div class="brand-sub">Fight Manager</div></div></div><nav class="nav" aria-label="Módulos principais">${navButton('home', '⌂', 'Central')}${navButton('roster', '♟', 'Lutadores')}${navButton('negotiation', '♢', 'Negociar')}${navButton('events', '▦', 'Eventos')}${navButton('fight', '⚑', 'Fight Night')}${navButton('rankings', '♜', 'Rankings')}${navButton('academy', '⌂', 'Academia')}${navButton('finance', '▥', 'Finanças')}</nav><div class="sidebar-bottom"><strong>Parte 5</strong>Carreira local · eventos próprios, contratos e decisões persistentes</div></aside>`;
  }
  function statCard(label, value, note, color = '') { return `<article class="card stat-card"><span class="stat-label">${label}</span><strong style="${color ? `color:${color}` : ''}">${value}</strong><span class="delta">${note}</span></article>`; }
  function regionalOpponent(fighter) {
    const mma = [{ id: 'maya-duarte', name: 'Maya Duarte', initials: 'MD', country: 'México', record: '4-1-0', rating: 64, discipline: 'MMA', division: fighter.division }, { id: 'noor-hassan', name: 'Noor Hassan', initials: 'NH', country: 'França', record: '5-2-0', rating: 66, discipline: 'MMA', division: fighter.division }];
    const boxing = [{ id: 'iris-freitas', name: 'Iris Freitas', initials: 'IF', country: 'Portugal', record: '6-2-0', rating: 63, discipline: 'Boxe', division: fighter.division }, { id: 'amara-okoye', name: 'Amara Okoye', initials: 'AO', country: 'Nigéria', record: '5-1-0', rating: 65, discipline: 'Boxe', division: fighter.division }];
    const pool = fighter.discipline === 'MMA' ? mma : boxing;
    return { ...pool[avatarIndex(fighter.id) % pool.length] };
  }
  function buildFightPanel() {
    const fighter = selectedFighter();
    if (!fighter) return `<aside class="next-fight"><div class="fight-head"><span>PRÓXIMO PASSO</span><span>RECRUTAMENTO</span></div><div class="section-body"><p class="text-muted">Sua academia precisa de um atleta para entrar no circuito.</p><button class="button" data-nav="roster">VER MERCADO</button></div></aside>`;
    const fight = state.fight || createFightState();
    const opponent = fight.opponent || regionalOpponent(fighter);
    const stateLabel = fight.status === 'complete' ? 'RESULTADO DISPONÍVEL' : state.fightBooked ? (fight.status === 'ready' || fight.status === 'active' ? 'NOITE DE LUTA' : 'CAMP CONFIRMADO') : 'PENDENTE';
    const action = fight.status === 'complete' ? `<button class="button secondary" data-action="open-fight">VER RESULTADO</button>` : state.fightBooked ? (fight.status === 'ready' || fight.status === 'active' ? `<button class="button" data-action="open-fight">ENTRAR NO EVENTO</button>` : `<button class="button secondary" data-action="advance-week">PREPARAR CAMP</button>`) : `<button class="button" data-action="book-fight">ACEITAR LUTA</button>`;
    return `<aside class="next-fight"><div class="fight-head"><span>OPORTUNIDADE REGIONAL</span><span>${stateLabel}</span></div><div class="fight-pair"><div class="fighter-token">${fighterAvatar(fighter, 'portrait')}<span>${escapeHTML(fighter.name.split(' ')[0])}</span><small>${fighterIdentity(fighter, true)} ${fighter.record}</small></div><span class="versus">VS</span><div class="fighter-token">${fighterAvatar(opponent, 'portrait')}<span>${escapeHTML(opponent.name.split(' ')[0])}</span><small>${fighterIdentity(opponent, true)} ${opponent.record}</small></div></div><div class="fight-action">${action}</div></aside>`;
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
      return `<tr><td><div class="fighter-cell">${fighterAvatar(fighter, 'mini-portrait')}<div><strong>${escapeHTML(fighter.name)}</strong><small>${fighterIdentity(fighter)} · ${fighter.age} anos</small></div></div></td><td>${fighter.discipline}<br><small class="text-muted">${fighter.division}</small></td><td class="rating">${fighter.rating}</td><td><span class="pill">${fighter.potential}</span></td><td>${escapeHTML(fighter.style)}</td><td>${signed ? `<button class="button secondary" data-action="select-fighter" data-id="${fighter.id}">${selected ? 'SELECIONADO' : 'GERIR'}</button>` : `<button class="button" data-action="hire" data-id="${fighter.id}">NEGOCIAR</button>`}</td></tr>`;
    }).join('');
  }
  function rosterView() {
    const fighter = selectedFighter() || prospects[0];
    const isOwned = state.fighters.some((owned) => owned.id === fighter.id);
    return `<section class="content"><div class="page-heading"><div><div class="eyebrow">Scouting & contratos</div><h1>Mercado de<br><span class="text-gold">talentos.</span></h1><p class="page-copy">O elenco não é decorativo. Cada contratação reduz o caixa, gera salário semanal e abre novas decisões de treinamento e luta.</p></div><button class="button secondary" data-action="advance-week">ATUALIZAR MERCADO</button></div><section class="roster-layout"><article class="card table-wrap"><div class="card-title"><span>Prospects e elenco</span><small>${state.fighters.length} atleta(s) contratado(s)</small></div><table class="fighter-table"><thead><tr><th>Lutador</th><th>Modalidade</th><th>OVR</th><th>Potencial</th><th>Estilo</th><th>Ação</th></tr></thead><tbody>${fighterRows()}</tbody></table></article><aside class="card profile-panel"><div class="profile-banner profile-banner-with-avatar">${fighterAvatar(fighter, 'profile-portrait')}<div><div class="eyebrow">${isOwned ? 'Sob gestão' : 'Prospect disponível'}</div><h2>${escapeHTML(fighter.name)}</h2><p>${fighterIdentity(fighter)} · ${fighter.discipline} · ${fighter.division}</p></div></div><div class="profile-data"><div><span>OVR</span><strong>${fighter.rating}</strong></div><div><span>Potencial</span><strong>${fighter.potential}</strong></div><div><span>Cartel</span><strong>${fighter.record}</strong></div><div><span>Idade</span><strong>${fighter.age}</strong></div></div><div class="section-body"><p class="text-muted">${escapeHTML(fighter.style)}. ${isOwned ? 'Pronto para ser o rosto inicial da academia.' : `Bônus de assinatura: ${money(fighter.signing)} · salário semanal: ${money(fighter.salary)}.`}</p>${isOwned ? `<button class="button" data-action="select-fighter" data-id="${fighter.id}" data-nav-after="home">GERIR ATLETA</button>` : `<button class="button" data-action="hire" data-id="${fighter.id}">ENVIAR PROPOSTA</button>`}</div></aside></section></section>`;
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
  function fightMeter(label, value, type) {
    return `<div class="fight-meter ${type}"><span>${label}</span><div><i style="width:${Math.max(0, Math.min(100, value))}%"></i></div><strong>${Math.round(value)}%</strong></div>`;
  }
  function fightCombatant(fighter, side, health, stamina) {
    return `<section class="combatant ${side}"><div class="combatant-name">${side === 'player' ? '<span class="corner-label">CANTO VALE</span>' : '<span class="corner-label">CANTO RIVAL</span>'}<strong>${escapeHTML(fighter.name)}</strong><small>${fighterIdentity(fighter)} · ${fighter.record}</small></div>${fighterAvatar(fighter, `fight-portrait ${side}`)}<div class="combatant-meters">${fightMeter('Saúde', health, 'health')}${fightMeter('Energia', stamina, 'stamina')}</div></section>`;
  }
  function fightStatusLabel(fight) {
    if (fight.status === 'preparing') return `Camp em curso · evento na semana ${fight.readyWeek}`;
    if (fight.status === 'ready') return 'Tudo pronto. A estratégia é sua.';
    if (fight.status === 'active') return `Round ${fight.round} de ${fight.maxRounds} · troca ${Math.min(3, (fight.exchanges % 3) + 1)} de 3`;
    if (fight.status === 'complete') return fight.result?.won ? 'Vitória registrada no histórico' : 'Resultado registrado no histórico';
    return 'Nenhuma luta confirmada';
  }
  function fightView() {
    const fighter = selectedFighter();
    const fight = state.fight || createFightState();
    if (!fighter) return `<section class="content"><div class="page-heading"><div><div class="eyebrow">Fight Night</div><h1>Primeiro<br><span class="text-gold">contrato.</span></h1><p class="page-copy">Uma noite de luta precisa de um atleta sob gestão. Encontre um prospect para começar seu circuito.</p></div><button class="button" data-nav="roster">ABRIR MERCADO</button></div></section>`;
    const opponent = fight.opponent || regionalOpponent(fighter);
    const playerHealth = fight.playerHealth ?? 100;
    const playerStamina = fight.playerStamina ?? 100;
    const opponentHealth = fight.opponentHealth ?? 100;
    const opponentStamina = fight.opponentStamina ?? 100;
    const promotedEvent = state.eventPlanner?.activeEvent?.id === fight.eventId ? state.eventPlanner.activeEvent : null;
    const showName = promotedEvent?.name || 'Vale Regional 01';
    const waiting = fight.status === 'preparing' && state.week < fight.readyWeek;
    const idle = !state.fightBooked && fight.status !== 'complete';
    const actionArea = idle ? `<div class="fight-callout"><strong>Convite regional aberto</strong><p>Assine o card para abrir a simulação tática de três rounds.</p><button class="button" data-action="book-fight">ACEITAR LUTA</button></div>` : waiting ? `<div class="fight-callout"><strong>Preparação necessária</strong><p>Faltam ${fight.readyWeek - state.week} semana(s) para a noite de luta. Treino e energia ainda podem ser ajustados.</p><button class="button" data-action="advance-week">AVANÇAR SEMANA</button></div>` : fight.status === 'ready' ? `<div class="fight-callout ready"><strong>Card confirmado</strong><p>Escolha uma tática a cada troca. Pressão oferece dano; defesa e energia aumentam a chance de sobreviver ao final.</p><button class="button" data-action="start-fight">INICIAR ROUND 1</button></div>` : fight.status === 'complete' ? `<div class="fight-result ${fight.result?.won ? 'won' : 'lost'}"><span>${fight.result?.won ? 'VITÓRIA' : 'DERROTA'}</span><h2>${escapeHTML(fighter.name)} ${fight.result?.won ? 'venceu' : 'foi superado(a)'} por ${escapeHTML(fight.result?.method || 'decisão')}</h2><p>${fight.result?.summary || 'O resultado foi aplicado no cartel, caixa, reputação e ranking.'}</p><div><button class="button" data-nav="home">VOLTAR À CENTRAL</button><button class="button secondary" data-nav="rankings">VER RANKING</button></div></div>` : `<div class="tactics-grid">${Object.entries(fightTactics).map(([key, tactic]) => `<button class="tactic-button ${fight.lastAction === tactic.animation ? 'last-action' : ''}" data-action="fight-tactic" data-tactic="${key}"><span>${tactic.icon}</span><strong>${tactic.label}</strong><small>${tactic.copy}</small></button>`).join('')}</div>`;
    return `<section class="content fight-page"><div class="page-heading fight-heading"><div><div class="eyebrow">${escapeHTML(showName)} · ${fighter.discipline} · ${fighter.division}</div><h1>Noite de<br><span class="text-gold">luta.</span></h1><p class="page-copy">${fightStatusLabel(fight)} Cada escolha cria uma troca de combate e o resultado muda a carreira de verdade.</p></div><button class="button secondary" data-nav="home">CENTRAL</button></div><section class="fight-arena ${fight.status === 'active' ? `action-${fight.lastAction}` : ''}"><div class="arena-lights"></div><div class="arena-topline"><span>VALE FIGHT MANAGER</span><strong>${fight.status === 'active' ? `ROUND ${fight.round} / ${fight.maxRounds}` : fight.status === 'complete' ? 'RESULTADO OFICIAL' : 'CARD REGIONAL'}</strong><span>${fighter.discipline.toUpperCase()}</span></div><div class="arena-stage">${fightCombatant(fighter, 'player', playerHealth, playerStamina)}<div class="arena-versus"><span>VS</span><small>${fight.momentum > 14 ? 'VALE EM ALTA' : fight.momentum < -14 ? 'RIVAL EM ALTA' : 'LUTA EQUILIBRADA'}</small></div>${fightCombatant(opponent, 'opponent', opponentHealth, opponentStamina)}</div></section><section class="fight-detail-grid"><article class="card tactics-card"><div class="card-title"><span>${fight.status === 'active' ? 'Plano tático' : 'Orientação do corner'}</span><small>${fight.status === 'active' ? 'uma ação por troca' : 'simulação por turnos'}</small></div><div class="section-body">${actionArea}</div></article><aside class="card fight-log-card"><div class="card-title"><span>Log de combate</span><small>${fight.log.length ? `${fight.log.length} troca(s)` : 'aguardando o sino'}</small></div><div class="fight-log">${fight.log.length ? fight.log.map((entry) => `<div class="fight-log-entry ${entry.player ? 'player-log' : ''}"><strong>R${entry.round} · ${escapeHTML(entry.title)}</strong><p>${escapeHTML(entry.copy)}</p></div>`).join('') : `<div class="fight-log-entry"><strong>O plano começa agora</strong><p>Prepare o atleta, entre no evento e escolha como ele reage em cada troca.</p></div>`}</div></aside></section><p class="fight-disclaimer">Simulação tática fictícia. Os retratos representam personagens fictícios e as bandeiras indicam apenas a nacionalidade dos personagens.</p></section>`;
  }
  function contractStepper(label, field, value, step, prefix = '', suffix = '') {
    return `<div class="contract-term"><div><strong>${label}</strong><small>${field === 'signing' ? 'pagamento único na assinatura' : field === 'salary' ? 'custo semanal recorrente' : field === 'duration' ? 'compromisso de longo prazo' : field === 'revenueShare' ? 'receita de bolsas e bônus' : 'porcentagem destinada ao atleta'}</small></div><div class="term-control"><button aria-label="Diminuir ${label}" data-action="adjust-offer" data-field="${field}" data-delta="-${step}">−</button><span>${prefix}${value}${suffix}</span><button aria-label="Aumentar ${label}" data-action="adjust-offer" data-field="${field}" data-delta="${step}">+</button></div></div>`;
  }
  function activeContractRows() {
    if (!state.contracts.length) return '<div class="contract-empty">Nenhum contrato ativo. O mercado está aberto.</div>';
    return state.contracts.map((contract) => {
      const fighter = state.fighters.find((entry) => entry.id === contract.fighterId) || { id: contract.fighterId, name: contract.fighterName, initials: contract.fighterName.split(' ').map((part) => part[0]).join(''), country: 'Brasil' };
      return `<div class="contract-row">${fighterAvatar(fighter, 'mini-portrait')}<div><strong>${escapeHTML(contract.fighterName)}</strong><small>${money(contract.salary)}/semana · ${Math.ceil((contract.remainingWeeks ?? contract.duration * 52) / 52)} temporada(s)</small></div><span class="pill">ATIVO</span></div>`;
    }).join('');
  }
  function negotiationView() {
    const available = prospects.filter((prospect) => !state.signedIds.includes(prospect.id));
    const prospect = negotiationProspect();
    const offer = state.negotiation.offer;
    const canNegotiate = prospect && offer;
    const analysis = canNegotiate ? negotiationFactors(prospect, offer) : { score: 0, rows: [] };
    const read = negotiationRead(analysis.score);
    const result = state.negotiation.result;
    const selection = available.length ? `<div class="negotiation-prospect-list">${available.map((candidate) => `<button class="negotiation-prospect ${prospect?.id === candidate.id ? 'selected' : ''}" data-action="open-negotiation" data-id="${candidate.id}">${fighterAvatar(candidate, 'mini-portrait')}<span><strong>${escapeHTML(candidate.name)}</strong><small>${fighterIdentity(candidate)} · ${candidate.discipline} · ${candidate.rating} OVR</small></span><b>${money(candidate.signing)}</b></button>`).join('')}</div>` : '<div class="contract-empty">Todos os prospects desta primeira janela já receberam contrato.</div>';
    const builder = !canNegotiate ? `<div class="negotiation-placeholder"><span>♢</span><h2>Escolha um prospect</h2><p>Abra um dossiê para montar uma proposta com termos ajustáveis.</p></div>` : state.negotiation.status === 'accepted' ? `<div class="offer-outcome accepted"><span>CONTRATO ASSINADO</span><h2>${escapeHTML(prospect.name)} entrou no elenco.</h2><p>${escapeHTML(result || 'A proposta foi formalizada e a primeira semana de folha foi lançada no caixa.')}</p><div><button class="button" data-nav="roster">VER ELENCO</button><button class="button secondary" data-nav="finance">VER LIVRO-CAIXA</button></div></div>` : `<div class="offer-builder"><div class="deal-hero">${fighterAvatar(prospect, 'deal-portrait')}<div><div class="eyebrow">Dossiê do atleta</div><h2>${escapeHTML(prospect.name)}</h2><p>${fighterIdentity(prospect)} · ${prospect.age} anos · ${prospect.style}</p></div><div class="deal-rating"><span>OVR</span><strong>${prospect.rating}</strong><small>${prospect.potential} potencial</small></div></div><div class="contract-terms">${contractStepper('Bônus de assinatura', 'signing', money(offer.signing), 5000)}${contractStepper('Salário semanal', 'salary', money(offer.salary), 500)}${contractStepper('Duração', 'duration', offer.duration, 1, '', ' temporadas')}${contractStepper('Participação em receita', 'revenueShare', offer.revenueShare, 1, '', '%')}${contractStepper('Direitos de imagem', 'imageRights', offer.imageRights, 5, '', '% atleta')}</div><section class="offer-analysis"><div><span class="eyebrow">Leitura do agente</span><strong class="${read.tone}">${read.label}</strong><p>${read.copy}</p></div><div class="acceptance-gauge"><span style="width:${analysis.score}%"></span><b>${analysis.score}/100</b><small>indicador, não garantia</small></div></section><div class="factor-list">${analysis.rows.map((factor) => `<div class="factor ${factor.good ? 'positive' : 'negative'}"><span>${factor.good ? '✓' : '!'}</span><div><strong>${factor.label}</strong><small>${factor.value}</small></div></div>`).join('')}</div>${state.negotiation.status === 'rejected' ? `<div class="offer-outcome rejected"><strong>Oferta recusada</strong><p>${escapeHTML(result || 'O atleta pediu condições melhores.')}</p></div>` : ''}<div class="negotiation-actions"><button class="button secondary" data-action="reset-offer">RECALIBRAR</button><button class="button" data-action="submit-offer">ENVIAR PROPOSTA</button></div></div>`;
    return `<section class="content negotiation-page"><div class="page-heading"><div><div class="eyebrow">Contratos & representação</div><h1>Valor se<br><span class="text-gold">negocia.</span></h1><p class="page-copy">Escolha o atleta, construa a oferta e aceite o risco. O agente mostra os fatores — a decisão só acontece quando a proposta é enviada.</p></div><button class="button secondary" data-nav="roster">VER MERCADO</button></div><section class="negotiation-layout"><aside class="card prospect-desk"><div class="card-title"><span>Janela de talentos</span><small>${available.length} disponível(is)</small></div>${selection}</aside><article class="card offer-card"><div class="card-title"><span>Proposta de representação</span><small>${canNegotiate ? `tentativa ${state.negotiation.attempts + 1}` : 'selecione um atleta'}</small></div><div class="offer-body">${builder}</div></article><aside class="negotiation-side"><article class="card"><div class="card-title"><span>Contratos ativos</span><small>${state.contracts.length} vínculo(s)</small></div><div class="contract-list">${activeContractRows()}</div></article><article class="card"><div class="card-title"><span>Histórico</span><small>decisões persistentes</small></div><div class="contract-history">${state.contractHistory.length ? state.contractHistory.slice(0, 5).map((entry) => `<div><strong>${escapeHTML(entry.fighter)}</strong><small>${escapeHTML(entry.status)} · S${entry.week}<br>${escapeHTML(entry.terms)}</small></div>`).join('') : '<div class="contract-empty">Propostas e assinaturas aparecerão aqui.</div>'}</div></article></aside></section><p class="negotiation-note">A resolução usa uma semente persistente e só é acionada ao enviar a proposta. Não há resultado novo ao reabrir esta tela.</p></section>`;
  }
  function eventPlannerView() {
    const planner = eventPlanner();
    const active = planner.activeEvent;
    const locked = active && active.status !== 'complete';
    const fighter = eventFighter();
    const venue = selectedVenue();
    const promotion = selectedPromotion();
    const estimate = eventEstimate(fighter, venue, promotion);
    const opponent = fighter ? regionalOpponent(fighter) : null;
    const commitCost = venue.rental + promotion.cost;
    const fighterOptions = state.fighters.length ? `<div class="event-choice-row">${state.fighters.map((candidate) => `<button class="event-fighter-choice ${fighter?.id === candidate.id ? 'selected' : ''}" data-action="select-event-fighter" data-id="${candidate.id}" ${locked ? 'disabled' : ''}>${fighterAvatar(candidate, 'mini-portrait')}<span><strong>${escapeHTML(candidate.name)}</strong><small>${fighterIdentity(candidate)} · ${candidate.discipline} · ${candidate.division}</small></span><b>${candidate.rating} OVR</b></button>`).join('')}</div>` : '<div class="event-empty">Assine um atleta antes de organizar um evento próprio.</div>';
    const activePanel = active && active.status !== 'complete' ? `<article class="card event-command"><div class="event-command-top"><div><div class="eyebrow">Show em andamento</div><h2>${escapeHTML(active.name)}</h2><p>${escapeHTML(eventStatusCopy(active))}</p></div><span class="event-status ${active.status}">${active.status === 'ready' ? 'PORTÕES ABERTOS' : active.status === 'live' ? 'AO VIVO' : 'CONFIRMADO'}</span></div><div class="event-command-grid"><div><small>ARENA</small><strong>${escapeHTML(active.venueName)}</strong></div><div><small>DATA</small><strong>SEMANA ${active.week}</strong></div><div><small>MAIN EVENT</small><strong>${escapeHTML(active.fighterName)} × ${escapeHTML(active.opponent.name)}</strong></div></div><div class="event-command-actions">${active.status === 'ready' ? '<button class="button" data-action="open-event-fight">ENTRAR NA FIGHT NIGHT</button>' : '<button class="button secondary" data-action="advance-week">AVANÇAR SEMANA</button>'}<button class="button secondary" data-nav="finance">VER CAIXA</button></div></article>` : '';
    const history = planner.history.length ? planner.history.slice(0, 3).map((event) => `<div class="event-history-row"><div><strong>${escapeHTML(event.name)}</strong><small>${escapeHTML(event.venueName)} · S${event.week} · ${event.attendance.toLocaleString('pt-BR')} presentes</small></div><strong class="${event.profit >= 0 ? 'text-green' : 'text-red'}">${event.profit >= 0 ? '+' : '−'}${money(Math.abs(event.profit))}</strong></div>`).join('') : '<div class="event-empty">Os resultados dos seus shows aparecerão aqui.</div>';
    return `<section class="content event-page"><div class="page-heading"><div><div class="eyebrow">Produção de eventos · circuito autoral</div><h1>Construa o<br><span class="text-gold">seu show.</span></h1><p class="page-copy">Reserve a arena, escolha a campanha, escale a luta principal e assuma o risco operacional. O resultado entra no caixa somente depois da Fight Night.</p></div><button class="button secondary" data-nav="fight">FIGHT NIGHT</button></div>${activePanel}<section class="event-layout ${locked ? 'is-locked' : ''}"><article class="card event-builder"><div class="card-title"><span>1 · Arena & data</span><small>${locked ? 'produção travada até o show' : 'monte o evento'}</small></div><div class="event-arena-visual"><div><div class="eyebrow">VALE EVENTS</div><h2>${escapeHTML(venue.name)}</h2><p>${escapeHTML(venue.city)} · ${venue.capacity.toLocaleString('pt-BR')} lugares</p></div><span>${venue.badge}</span></div><div class="event-body"><div class="event-section-label">Escolha a praça</div><div class="venue-grid">${eventVenues.map((option) => `<button class="venue-choice ${venue.id === option.id ? 'selected' : ''}" data-action="select-event-venue" data-id="${option.id}" ${locked ? 'disabled' : ''}><strong>${escapeHTML(option.name)}</strong><small>${escapeHTML(option.city)} · ${option.capacity.toLocaleString('pt-BR')} pessoas</small><b>${money(option.rental)}</b></button>`).join('')}</div><div class="event-section-label">Janela de realização</div><div class="date-choice-row">${[2, 3, 4, 5].map((offset) => `<button class="date-choice ${planner.dateOffset === offset ? 'selected' : ''}" data-action="select-event-date" data-offset="${offset}" ${locked ? 'disabled' : ''}><strong>S${state.week + offset}</strong><small>em ${offset} semanas</small></button>`).join('')}</div></div></article><article class="card event-builder"><div class="card-title"><span>2 · Card & promoção</span><small>luta principal jogável</small></div><div class="event-body"><div class="event-section-label">Atleta da luta principal</div>${fighterOptions}<div class="event-section-label">Campanha</div><div class="promotion-grid">${promotionPlans.map((option) => `<button class="promotion-choice ${promotion.id === option.id ? 'selected' : ''}" data-action="select-event-promotion" data-id="${option.id}" ${locked ? 'disabled' : ''}><span>${option.id === 'broadcast' ? '◉' : option.id === 'regional' ? '◈' : '◇'}</span><div><strong>${escapeHTML(option.name)}</strong><small>${escapeHTML(option.copy)}</small></div><b>${money(option.cost)}</b></button>`).join('')}</div><div class="main-event-card">${fighter && opponent ? `<div>${fighterAvatar(fighter, 'portrait')}<strong>${escapeHTML(fighter.name)}</strong><small>${fighterIdentity(fighter)} · ${fighter.record}</small></div><b>VS</b><div>${fighterAvatar(opponent, 'portrait')}<strong>${escapeHTML(opponent.name)}</strong><small>${fighterIdentity(opponent)} · ${opponent.record}</small></div>` : '<span>Selecione um atleta para visualizar a luta principal.</span>'}</div></div></article><aside class="event-sidebar"><article class="card event-projection"><div class="card-title"><span>3 · Projeção</span><small>estimativa transparente</small></div><div class="event-projection-grid"><div><small>PÚBLICO</small><strong>${estimate.attendance.toLocaleString('pt-BR')}</strong><span>de ${venue.capacity.toLocaleString('pt-BR')}</span></div><div><small>BILHETERIA</small><strong>${money(estimate.gate)}</strong><span>${money(venue.ticket)} por ingresso</span></div><div><small>MÍDIA</small><strong>${money(estimate.media)}</strong><span>pacote estimado</span></div><div><small>OPERAÇÃO</small><strong class="text-red">${money(estimate.operating)}</strong><span>produção no dia</span></div></div><div class="event-profit"><span>Resultado estimado</span><strong class="${estimate.projected >= 0 ? 'text-green' : 'text-red'}">${estimate.projected >= 0 ? '+' : '−'}${money(Math.abs(estimate.projected))}</strong><small>inclui a bolsa projetada da luta principal</small></div><button class="button ${fighter && !locked ? '' : 'secondary'}" data-action="plan-event" ${!fighter || locked ? 'disabled' : ''}>CONFIRMAR · ${money(commitCost)}</button><p class="event-disclaimer">A reserva e o marketing são cobrados agora. Bilheteria, mídia e produção são liquidadas após o combate.</p></article><article class="card event-history"><div class="card-title"><span>Shows concluídos</span><small>${planner.history.length} registro(s)</small></div>${history}</article></aside></section></section>`;
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
    if (state.view === 'negotiation') view = negotiationView();
    if (state.view === 'events') view = eventPlannerView();
    if (state.view === 'fight') view = fightView();
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
    state.contracts = [contractFor(starter, { signing: 0, salary: starter.salary, duration: 2, revenueShare: 12, imageRights: 55 })];
    state.contractHistory = [{ fighter: starter.name, status: 'fundador', week: state.week, terms: `Contrato inicial · ${money(starter.salary)}/semana` }];
    state.eventPlanner = { ...createEventPlannerState(), fighterId: starter.id };
    state.ledger = [{ title: 'Capital de abertura', category: 'Início de carreira', amount: state.cash, week: 'S1', kind: 'income' }, { title: 'Licenças e abertura', category: 'Operação', amount: -18000, week: 'S1', kind: 'expense' }];
    state.cash -= 18000;
    state.complete = true;
    addMessage(`${starter.name} assinou como o primeiro atleta de ${state.draft.academyName}.`);
    persist(); render(); toast('Carreira criada. Seu primeiro atleta já está no elenco.');
  }
  function beginNegotiation(id) {
    const prospect = prospectById(id);
    if (!prospect || state.signedIds.includes(id)) return;
    state.negotiation = { ...createNegotiationState(), prospectId: id, offer: offerFor(prospect), seed: (state.world.seed + avatarIndex(id) * 9187 + state.week) >>> 0 };
    state.view = 'negotiation';
    persist(); render();
  }
  function hire(id, negotiatedOffer = null) {
    const prospect = prospects.find((candidate) => candidate.id === id);
    if (!prospect || state.signedIds.includes(id)) return;
    if (!negotiatedOffer) { beginNegotiation(id); return; }
    const price = negotiatedOffer.signing + negotiatedOffer.salary;
    if (state.cash < price) { toast('Caixa insuficiente para assinatura e primeira semana de salário.'); return; }
    state.cash -= price;
    const fighter = { ...prospect, signing: negotiatedOffer.signing, salary: negotiatedOffer.salary, status: 'ativo', conditioning: 68, morale: 68, camp: 18 };
    state.fighters.push(fighter); state.signedIds.push(id); state.selectedFighterId = id;
    const contract = contractFor(fighter, negotiatedOffer);
    state.contracts.push(contract);
    state.contractHistory.unshift({ fighter: fighter.name, status: 'assinado', week: state.week, terms: `${money(negotiatedOffer.signing)} + ${money(negotiatedOffer.salary)}/semana` });
    addLedger(`Assinatura: ${prospect.name}`, 'Contrato de atleta', -negotiatedOffer.signing, 'expense');
    addLedger(`Salário inicial: ${prospect.name}`, 'Folha de pagamento', -negotiatedOffer.salary, 'expense');
    addMessage(`${prospect.name} aceitou a proposta. O atleta entrou no elenco.`);
    state.negotiation = { ...state.negotiation, status: 'accepted', result: `${prospect.name} assinou por ${contract.duration} temporada(s).` };
    persist(); render(); toast(`${prospect.name} foi contratado e agora pode ser gerido.`);
  }
  function adjustOffer(field, delta) {
    const prospect = negotiationProspect();
    if (!prospect || !state.negotiation.offer) return;
    const offer = state.negotiation.offer;
    const bounds = { signing: [Math.max(0, Math.round(prospect.signing * .45)), Math.round(prospect.signing * 2.4)], salary: [Math.max(2500, Math.round(prospect.salary * .55)), Math.round(prospect.salary * 2.3)], duration: [1, 5], revenueShare: [0, 30], imageRights: [20, 80] };
    const [min, max] = bounds[field] || [0, 100];
    offer[field] = Math.max(min, Math.min(max, offer[field] + delta));
    state.negotiation.status = 'draft'; state.negotiation.result = null;
    persist(); render();
  }
  function resetOffer() {
    const prospect = negotiationProspect();
    if (!prospect) return;
    state.negotiation.offer = offerFor(prospect);
    state.negotiation.status = 'draft'; state.negotiation.result = null;
    persist(); render();
  }
  function submitOffer() {
    const prospect = negotiationProspect();
    const offer = state.negotiation.offer;
    if (!prospect || !offer || state.negotiation.status === 'accepted') return;
    const cost = offer.signing + offer.salary;
    if (state.cash < cost) { toast('Caixa insuficiente para cobrir assinatura e primeira semana de salário.'); return; }
    const score = negotiationScore(prospect, offer);
    const accepted = nextNegotiationRandom() * 100 < score;
    state.negotiation.attempts += 1;
    if (accepted) {
      hire(prospect.id, offer);
      return;
    }
    state.negotiation.status = 'rejected';
    state.negotiation.result = `${prospect.name} recusou. O agente sinalizou que salário, bônus ou direitos podem ser revistos.`;
    state.contractHistory.unshift({ fighter: prospect.name, status: 'recusado', week: state.week, terms: `proposta ${score}/100 · ${money(offer.salary)}/semana` });
    addMessage(`${prospect.name} recusou a proposta de representação. A decisão foi registrada no histórico.`);
    persist(); render(); toast('A proposta foi recusada. Ajuste os termos antes de tentar novamente.');
  }
  function selectEventVenue(id) {
    if (!eventVenues.some((venue) => venue.id === id) || eventPlanner().activeEvent?.status === 'planned' || eventPlanner().activeEvent?.status === 'ready' || eventPlanner().activeEvent?.status === 'live') return;
    state.eventPlanner.venueId = id;
    persist(); render();
  }
  function selectEventPromotion(id) {
    if (!promotionPlans.some((plan) => plan.id === id) || eventPlanner().activeEvent?.status === 'planned' || eventPlanner().activeEvent?.status === 'ready' || eventPlanner().activeEvent?.status === 'live') return;
    state.eventPlanner.promotionId = id;
    persist(); render();
  }
  function selectEventDate(offset) {
    if (![2, 3, 4, 5].includes(offset) || eventPlanner().activeEvent?.status === 'planned' || eventPlanner().activeEvent?.status === 'ready' || eventPlanner().activeEvent?.status === 'live') return;
    state.eventPlanner.dateOffset = offset;
    persist(); render();
  }
  function selectEventFighter(id) {
    if (!state.fighters.some((fighter) => fighter.id === id) || eventPlanner().activeEvent?.status === 'planned' || eventPlanner().activeEvent?.status === 'ready' || eventPlanner().activeEvent?.status === 'live') return;
    state.eventPlanner.fighterId = id;
    state.selectedFighterId = id;
    persist(); render();
  }
  function planEvent() {
    const planner = eventPlanner();
    if (planner.activeEvent && ['planned', 'ready', 'live'].includes(planner.activeEvent.status)) { toast('Já existe um show em produção. Conclua-o antes de montar outro card.'); return; }
    if (state.fightBooked && state.fight.status !== 'complete') { toast('Finalize a luta já agendada antes de promover um novo show.'); return; }
    const fighter = eventFighter();
    if (!fighter) { toast('Você precisa de um atleta ativo para confirmar uma luta principal.'); return; }
    const venue = selectedVenue();
    const promotion = selectedPromotion();
    const reservation = venue.rental + promotion.cost;
    if (state.cash < reservation) { toast('Caixa insuficiente para reservar a arena e ativar a campanha.'); return; }
    const estimate = eventEstimate(fighter, venue, promotion);
    const opponent = regionalOpponent(fighter);
    const sequence = planner.history.length + 1;
    const event = {
      id: `vale-show-${state.week}-${sequence}`,
      name: `VALE FIGHT NIGHT ${String(sequence).padStart(2, '0')}`,
      status: 'planned',
      week: state.week + planner.dateOffset,
      venueId: venue.id,
      venueName: venue.name,
      city: venue.city,
      capacity: venue.capacity,
      promotionId: promotion.id,
      promotionName: promotion.name,
      fighterId: fighter.id,
      fighterName: fighter.name,
      opponent,
      attendance: estimate.attendance,
      gate: estimate.gate,
      media: estimate.media,
      operating: estimate.operating,
      purse: estimate.purse,
      reservation,
      undercard: promotion.id === 'broadcast' ? 5 : promotion.id === 'regional' ? 4 : 3,
    };
    state.cash -= reservation;
    state.selectedFighterId = fighter.id;
    state.eventPlanner.activeEvent = event;
    addLedger(`Reserva: ${event.name}`, `Arena · ${venue.name}`, -venue.rental, 'expense');
    addLedger(`Campanha: ${promotion.name}`, 'Promoção de evento', -promotion.cost, 'expense');
    addMessage(`${event.name} foi confirmado na ${venue.name} para a Semana ${event.week}. ${fighter.name} fará a luta principal contra ${opponent.name}.`);
    persist(); render(); toast('Show confirmado. Custos de reserva e campanha foram aplicados.');
  }
  function settlePromotedEvent(event, won) {
    if (!event || event.status === 'complete') return;
    const profit = event.gate + event.media - event.operating;
    state.cash += event.gate + event.media - event.operating;
    state.fans += Math.round(event.attendance * .08) + (won ? 180 : 70);
    state.reputation += won ? 4 : 1;
    event.status = 'complete';
    event.profit = profit;
    event.result = won ? 'luta principal vencida' : 'luta principal perdida';
    state.eventPlanner.history.unshift({ ...event });
    state.eventPlanner.history = state.eventPlanner.history.slice(0, 6);
    addLedger(`Bilheteria: ${event.name}`, `${event.attendance.toLocaleString('pt-BR')} presentes`, event.gate, 'income');
    addLedger(`Mídia: ${event.promotionName}`, 'Direitos locais simulados', event.media, 'income');
    addLedger(`Produção: ${event.name}`, 'Equipe, arbitragem e operação', -event.operating, 'expense');
    addMessage(`${event.name} encerrou com ${event.attendance.toLocaleString('pt-BR')} presentes e ${profit >= 0 ? 'resultado positivo' : 'resultado negativo'} de ${money(Math.abs(profit))}.`);
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
    if (state.fightBooked && state.fight?.status !== 'complete') { state.view = 'fight'; persist(); render(); return; }
    const opponent = regionalOpponent(fighter);
    state.fightBooked = true;
    state.fight = { ...createFightState(), status: 'preparing', readyWeek: state.week + 2, opponent, playerStamina: Math.min(100, (fighter.conditioning || 70) + 15) };
    fighter.camp = Math.min(100, (fighter.camp || 20) + 5);
    addMessage(`${fighter.name} aceitou enfrentar ${opponent.name} no Vale Regional 01. O camp é agora prioridade.`);
    persist(); render(); toast('Luta aceita. Prepare o atleta antes do evento.');
  }
  function nextFightRandom() {
    const fight = state.fight;
    fight.seed = (fight.seed * 1103515245 + 12345) >>> 0;
    return fight.seed / 4294967296;
  }
  function opponentTactic(fight) {
    const choices = ['aggressive', 'defensive', 'counter', 'clinch', 'takedown', 'conserve'];
    return choices[Math.floor(nextFightRandom() * choices.length)];
  }
  function startFight() {
    if (!state.fightBooked || state.fight.status !== 'ready') return;
    const event = state.eventPlanner?.activeEvent;
    if (event?.id === state.fight.eventId) event.status = 'live';
    state.fight.status = 'active';
    state.fight.log.unshift({ round: 1, player: true, title: 'O sino toca', copy: `${selectedFighter().name} entra no centro do espaço de luta. Escolha a primeira orientação do corner.` });
    persist(); render(); toast('Round 1 iniciado. A decisão é sua.');
  }
  function tacticDamage(base, modifier, stamina, random) {
    return Math.max(1, Math.round((base * modifier * (.76 + random * .52)) * (.65 + Math.max(0, stamina) / 285)));
  }
  function finishFight(won, method) {
    const fight = state.fight;
    const fighter = selectedFighter();
    const promotedEvent = state.eventPlanner?.activeEvent?.id === fight.eventId ? state.eventPlanner.activeEvent : null;
    const eventLabel = promotedEvent ? promotedEvent.name : 'Vale Regional 01';
    const reward = promotedEvent ? promotedEvent.purse : 62000 + state.reputation * 750;
    fight.status = 'complete';
    state.fightBooked = false;
    fighter.conditioning = Math.max(46, Math.min(100, (fighter.conditioning || 70) - (won ? 13 : 19)));
    fighter.camp = 14;
    if (won) {
      const previousRank = state.world.playerRanking.position;
      fighter.record = incrementWin(fighter.record);
      state.cash += reward; state.reputation += 7; state.fans += 340; state.world.playerRanking.points += 110;
      const rank = refreshPlayerRanking();
      addLedger(`Bolsa: ${fighter.name}`, eventLabel, reward, 'income');
      addMessage(`${fighter.name} venceu ${fight.opponent.name} por ${method}. A carreira recebeu +110 pontos de ranking.`);
      if (!previousRank && rank?.position) addMessage(`${fighter.name} entrou no ranking simulado em #${rank.position} após a vitória no card regional.`);
      fight.result = { won: true, method, summary: `Bolsa de ${money(reward)}, +7 reputação, +340 fãs e +110 pontos de ranking.` };
      toast(`Vitória por ${method}! A carreira avançou.`);
    } else {
      fighter.record = incrementLoss(fighter.record);
      state.reputation = Math.max(0, state.reputation - 2); state.fans = Math.max(0, state.fans - 45);
      addLedger(`Bolsa de participação: ${fighter.name}`, eventLabel, Math.round(reward * .28), 'income');
      state.cash += Math.round(reward * .28);
      addMessage(`${fighter.name} perdeu para ${fight.opponent.name} por ${method}. A equipe volta ao camp com dados para evoluir.`);
      fight.result = { won: false, method, summary: `Bolsa de participação de ${money(Math.round(reward * .28))}; reputação -2 e aprendizado registrado para o próximo camp.` };
      toast(`Resultado por ${method}. A trajetória continua.`);
    }
    if (promotedEvent) {
      settlePromotedEvent(promotedEvent, won);
      fight.result.summary += ` ${promotedEvent.name} foi liquidado no caixa com bilheteria, mídia e produção.`;
    }
  }
  function executeTactic(key) {
    const fight = state.fight;
    const fighter = selectedFighter();
    if (!fighter || fight.status !== 'active' || !fightTactics[key]) return;
    const tactic = fightTactics[key];
    const rivalKey = opponentTactic(fight);
    const rival = fightTactics[rivalKey];
    const disciplineBonus = fighter.discipline === 'MMA' && (key === 'clinch' || key === 'takedown') ? 1.15 : fighter.discipline === 'Boxe' && (key === 'counter' || key === 'aggressive') ? 1.12 : 1;
    const playerPower = (fighter.rating || 62) / 9;
    const opponentPower = (fight.opponent.rating || 64) / 9;
    let playerDamage = tacticDamage(playerPower, tactic.offense * disciplineBonus / rival.guard, fight.playerStamina, nextFightRandom());
    let opponentDamage = tacticDamage(opponentPower, rival.offense / tactic.guard, fight.opponentStamina, nextFightRandom());
    if (key === 'conserve') { fight.playerStamina = Math.min(100, fight.playerStamina + 14); playerDamage = Math.max(1, Math.round(playerDamage * .55)); }
    if (rivalKey === 'conserve') { fight.opponentStamina = Math.min(100, fight.opponentStamina + 11); opponentDamage = Math.max(1, Math.round(opponentDamage * .55)); }
    if (key === 'counter' && ['aggressive', 'takedown'].includes(rivalKey)) playerDamage += 4;
    if (rivalKey === 'counter' && key === 'aggressive') opponentDamage += 4;
    if (key === 'defensive') opponentDamage = Math.max(1, Math.round(opponentDamage * .72));
    fight.playerStamina = Math.max(0, fight.playerStamina - tactic.stamina);
    fight.opponentStamina = Math.max(0, fight.opponentStamina - rival.stamina);
    fight.opponentHealth = Math.max(0, fight.opponentHealth - playerDamage);
    fight.playerHealth = Math.max(0, fight.playerHealth - opponentDamage);
    fight.momentum = Math.max(-100, Math.min(100, fight.momentum + playerDamage - opponentDamage));
    fight.lastAction = tactic.animation;
    fight.exchanges += 1;
    const playerWonExchange = playerDamage >= opponentDamage;
    const exchangeCopy = playerWonExchange ? `${fighter.name} usa ${tactic.label.toLowerCase()} e conecta melhor: ${playerDamage} de impacto. ${fight.opponent.name} responde com ${rival.label.toLowerCase()} (${opponentDamage}).` : `${fight.opponent.name} encontra espaço com ${rival.label.toLowerCase()} (${opponentDamage}). ${fighter.name} responde com ${tactic.label.toLowerCase()} (${playerDamage}).`;
    fight.log.unshift({ round: fight.round, player: playerWonExchange, title: `${tactic.label} × ${rival.label}`, copy: exchangeCopy });
    if (fight.opponentHealth <= 0 || fight.playerHealth <= 0) {
      finishFight(fight.opponentHealth <= 0, 'nocaute técnico');
    } else if (fight.exchanges >= fight.maxRounds * 3) {
      const playerScore = fight.playerHealth + fight.playerStamina * .35 + fight.momentum * .25;
      const opponentScore = fight.opponentHealth + fight.opponentStamina * .35 - fight.momentum * .25;
      finishFight(playerScore >= opponentScore, 'decisão dos juízes');
    } else if (fight.exchanges % 3 === 0) {
      fight.round += 1;
      fight.log.unshift({ round: fight.round, player: true, title: `Round ${fight.round} começa`, copy: fight.momentum > 8 ? 'O corner pede controle: a vantagem é sua, mas a energia importa.' : fight.momentum < -8 ? 'O corner pede resposta: escolha a próxima troca com cuidado.' : 'Cartões apertados. O próximo round pode definir o combate.' });
    }
    persist(); render();
  }
  function advanceWeek() {
    const payroll = state.fighters.reduce((sum, fighter) => sum + fighter.salary, 0) + state.staff * 1800 + 4500;
    state.cash -= payroll; state.week += 1; state.date = `Semana ${state.week} · 2026`;
    simulateWorldCycle();
    state.contracts.forEach((contract) => { if (contract.status === 'ativo') contract.remainingWeeks = Math.max(0, (contract.remainingWeeks ?? contract.duration * 52) - 1); });
    const plannedShow = state.eventPlanner?.activeEvent?.status === 'planned';
    state.fighters.forEach((fighter) => { fighter.conditioning = Math.max(50, Math.min(100, (fighter.conditioning || 70) + (state.fightBooked || plannedShow ? 2 : -1))); fighter.morale = Math.max(45, Math.min(100, (fighter.morale || 70) + 1)); if (state.fightBooked || plannedShow) fighter.camp = Math.min(100, (fighter.camp || 20) + 7); });
    addLedger('Folha, manutenção e logística', 'Fechamento semanal', -payroll, 'expense');
    const promotedEvent = state.eventPlanner?.activeEvent;
    if (promotedEvent?.status === 'planned' && state.week >= promotedEvent.week) {
      const fighter = state.fighters.find((candidate) => candidate.id === promotedEvent.fighterId);
      if (fighter) {
        state.selectedFighterId = fighter.id;
        promotedEvent.status = 'ready';
        state.fightBooked = true;
        state.fight = { ...createFightState(), status: 'ready', readyWeek: state.week, eventId: promotedEvent.id, opponent: promotedEvent.opponent, playerStamina: Math.min(100, (fighter.conditioning || 70) + 15) };
        addMessage(`${promotedEvent.name} abriu os portões na ${promotedEvent.venueName}. ${fighter.name} está pronto(a) para a luta principal contra ${promotedEvent.opponent.name}.`);
        toast('Seu evento está pronto. Entre na Fight Night para comandar a luta principal.');
      }
    } else if (state.fightBooked && state.fight.status === 'preparing' && state.week >= state.fight.readyWeek) {
      state.fight.status = 'ready';
      addMessage(`A preparação terminou. ${selectedFighter().name} está pronto(a) para enfrentar ${state.fight.opponent.name} no Vale Regional 01.`);
      toast('Noite de luta liberada. Entre no evento para orientar o combate.');
    } else { addMessage(`Semana ${state.week} concluída. Folha e manutenção foram liquidadas.`); toast(`Semana ${state.week} avançada. Custos operacionais aplicados.`); }
    persist(); render();
  }
  function incrementWin(record) { const [wins, losses, draws] = record.split('-').map(Number); return `${wins + 1}-${losses}-${draws}`; }
  function incrementLoss(record) { const [wins, losses, draws] = record.split('-').map(Number); return `${wins}-${losses + 1}-${draws}`; }
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
      if (action === 'open-negotiation') beginNegotiation(button.dataset.id);
      if (action === 'adjust-offer') adjustOffer(button.dataset.field, Number(button.dataset.delta));
      if (action === 'reset-offer') resetOffer();
      if (action === 'submit-offer') submitOffer();
      if (action === 'select-event-venue') selectEventVenue(button.dataset.id);
      if (action === 'select-event-promotion') selectEventPromotion(button.dataset.id);
      if (action === 'select-event-date') selectEventDate(Number(button.dataset.offset));
      if (action === 'select-event-fighter') selectEventFighter(button.dataset.id);
      if (action === 'plan-event') planEvent();
      if (action === 'open-event-fight') { state.view = 'fight'; persist(); render(); }
      if (action === 'select-fighter') { state.selectedFighterId = button.dataset.id; persist(); if (button.dataset.navAfter) state.view = button.dataset.navAfter; render(); }
      if (action === 'upgrade') upgrade(button.dataset.facility, Number(button.dataset.cost));
      if (action === 'train') train();
      if (action === 'media') media();
      if (action === 'book-fight') bookFight();
      if (action === 'open-fight') { state.view = 'fight'; persist(); render(); }
      if (action === 'start-fight') startFight();
      if (action === 'fight-tactic') executeTactic(button.dataset.tactic);
      if (action === 'watch-event') { state.world.watchedEventId = button.dataset.id; const event = state.world.events.find((entry) => entry.id === button.dataset.id); addMessage(`Você passou a monitorar ${event.name}. Os resultados aparecerão ao avançar a semana.`); persist(); render(); toast(`Agora acompanhando ${event.name}.`); }
      if (action === 'advance-week') advanceWeek();
      if (action === 'reset') openModal('Recomeçar carreira', '<p>Isso apagará o save local deste navegador. Esta ação não afeta o código do projeto nem o repositório.</p>', [{ id: 'cancel', label: 'Cancelar', className: 'secondary', onClick: () => {} }, { id: 'confirm', label: 'Apagar save', className: 'danger', onClick: resetCareer }]);
    }));
    const form = app.querySelector('#onboarding-form'); if (form) form.addEventListener('submit', (event) => { event.preventDefault(); startCareer(); });
  }
  window.ValeFightManager = { reset: () => resetCareer(), getState: () => structuredClone(state) };
  render();
}());
