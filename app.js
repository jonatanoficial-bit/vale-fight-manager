/* Vale Fight Manager — Fases 1 a 13
   Dados, atletas e organizações desta demonstração são fictícios. */
(function () {
  'use strict';

  const STORAGE_KEY = 'vale-fight-manager-career-v1';
  const SAVE_SLOT_STORAGE_KEY = 'vale-fight-manager-save-slots-v1';
  let fightAutomationTimer = null;
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
    'Alemanha': 'DE', 'Argentina': 'AR', 'Austrália': 'AU', 'Brasil': 'BR', 'Canadá': 'CA', 'Chile': 'CL', 'China': 'CN', 'Coreia do Sul': 'KR', 'Dinamarca': 'DK', 'Egito': 'EG', 'Emirados Árabes Unidos': 'AE', 'Espanha': 'ES', 'EUA': 'US', 'França': 'FR', 'Gana': 'GH', 'Holanda': 'NL', 'Índia': 'IN', 'Irlanda': 'IE', 'Israel': 'IL', 'Itália': 'IT', 'Japão': 'JP', 'Mali': 'ML', 'Marrocos': 'MA', 'México': 'MX', 'Nigéria': 'NG', 'Paquistão': 'PK', 'Polônia': 'PL', 'Portugal': 'PT', 'Reino Unido': 'GB', 'República Tcheca': 'CZ', 'Rússia': 'RU', 'Suécia': 'SE', 'Tunísia': 'TN',
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
    return { status: 'idle', readyWeek: null, round: 1, exchanges: 0, exchangesPerRound: 5, maxRounds: 3, playerHealth: 100, playerStamina: 100, opponentHealth: 100, opponentStamina: 100, momentum: 0, log: [], opponent: null, lastAction: 'ready', cornerStrategy: 'defensive', roundScores: [], scorecards: null, animationTick: 0, intervalNote: null, result: null, seed: 94117 };
  }
  function createNegotiationState() {
    return { prospectId: null, status: 'idle', offer: null, seed: 371951, attempts: 0, result: null };
  }
  function createEventPlannerState() {
    return { venueId: 'vale-arena', promotionId: 'regional', dateOffset: 3, fighterId: null, activeEvent: null, history: [] };
  }
  function createTrainingCampState() {
    return {
      fighterId: null,
      focus: 'striking',
      weeklyPlan: ['striking', 'conditioning', 'grappling', 'sparring', 'recovery', 'strategy', 'rest'],
      seed: 15485863,
      lastReport: null,
      history: [],
    };
  }
  function createScoutingState() {
    return { selectedProspectId: 'mendes', reports: {}, shortlist: [], filter: 'todos', seed: 730201, history: [] };
  }
  function createStaffCenterState() {
    return { hiredIds: [], history: [] };
  }
  function createSponsorshipState() {
    return { active: [], history: [] };
  }
  function createCompetitionState() {
    return { selectedOfferId: 'rising-cup', active: null, completed: [], history: [] };
  }
  const campSessions = {
    striking: { label: 'Striking técnico', icon: '✦', copy: 'Precisão, combinações e leitura de distância.', gains: { striking: 2, defense: 1 }, fatigue: 9, camp: 6, facility: 'ring' },
    grappling: { label: 'Grappling & quedas', icon: '◈', copy: 'Controle, transições e defesa de quedas.', gains: { grappling: 2, fightIQ: 1 }, fatigue: 10, camp: 6, facility: 'cage' },
    conditioning: { label: 'Força & cardio', icon: '↟', copy: 'Ritmo, potência e capacidade de recuperação.', gains: { cardio: 2 }, fatigue: 8, camp: 5, facility: 'conditioning' },
    sparring: { label: 'Sparring dirigido', icon: '⚡', copy: 'Rounds sob pressão. Alto ganho, maior desgaste.', gains: { fightIQ: 2, defense: 1 }, fatigue: 14, camp: 8, risk: 6 },
    recovery: { label: 'Recuperação ativa', icon: '♡', copy: 'Mobilidade, fisioterapia e sono orientado.', gains: { cardio: 1 }, fatigue: -15, morale: 2, camp: 2, facility: 'recovery' },
    strategy: { label: 'Plano de luta', icon: '◎', copy: 'Vídeo, estudo de rival e tomada de decisão.', gains: { fightIQ: 2, defense: 1 }, fatigue: 3, camp: 4 },
    rest: { label: 'Descanso total', icon: '☾', copy: 'Reduz a fadiga e protege a confiança.', gains: {}, fatigue: -10, morale: 3, camp: 1 },
  };
  const campFocuses = {
    striking: { label: 'Striking', attribute: 'striking', copy: 'Melhora a pressão, o contra-golpe e o dano ofensivo.' },
    grappling: { label: 'Grappling', attribute: 'grappling', copy: 'Favorece clinch, quedas e controle de ritmo.' },
    conditioning: { label: 'Condicionamento', attribute: 'cardio', copy: 'Sustenta energia e reduz o impacto da fadiga.' },
    strategy: { label: 'QI de luta', attribute: 'fightIQ', copy: 'Aprimora decisões, defesa e leitura tática.' },
  };
  const campAttributeLabels = { striking: 'Striking', grappling: 'Grappling', cardio: 'Cardio', defense: 'Defesa', fightIQ: 'QI de luta' };
  const staffMarket = [
    { id: 'marco-silva', name: 'Marco Silva', role: 'Coach de striking', specialty: 'Precisão, combinações e leitura ofensiva.', salary: 6200, signing: 9000, capacity: 3, icon: '✦', effects: { striking: .75, defense: .25 } },
    { id: 'darius-kane', name: 'Darius Kane', role: 'Coach de grappling', specialty: 'Quedas, clinch e transição de solo.', salary: 6700, signing: 10500, capacity: 3, icon: '◈', effects: { grappling: .8, fightIQ: .28 } },
    { id: 'elena-morozova', name: 'Elena Morozova', role: 'Preparadora física', specialty: 'Cardio, carga e recuperação pós-camp.', salary: 5900, signing: 8200, capacity: 4, icon: '↟', effects: { cardio: .72, recovery: .34 } },
    { id: 'ana-soares', name: 'Dra. Ana Soares', role: 'Fisioterapeuta', specialty: 'Prevenção, recuperação e disponibilidade médica.', salary: 5800, signing: 7600, capacity: 5, icon: '♡', effects: { recovery: .82 } },
    { id: 'camila-rocha', name: 'Camila Rocha', role: 'Olheira internacional', specialty: 'Relatórios mais rápidos e leitura de potencial.', salary: 4900, signing: 6200, capacity: 8, icon: '⌕', effects: { scouting: .85 } },
    { id: 'yuri-costa', name: 'Yuri Costa', role: 'Diretor de marketing', specialty: 'Público, parceiros e valor de marca.', salary: 5400, signing: 7000, capacity: 6, icon: '◌', effects: { marketing: .7 } },
  ];
  const sponsorshipOffers = [
    { id: 'prime-edge', name: 'Prime Edge', category: 'Performance', minReputation: 18, minFans: 700, upfront: 18000, weekly: 4200, eventBonus: 8500, duration: 12, copy: 'Equipamento de performance para atletas em ascensão.' },
    { id: 'aurum-fuel', name: 'Aurum Fuel', category: 'Nutrição', minReputation: 30, minFans: 1600, upfront: 36000, weekly: 7200, eventBonus: 14500, duration: 16, copy: 'Parceria de nutrição com ativações em Fight Nights.' },
    { id: 'vertex-media', name: 'Vertex Media', category: 'Mídia regional', minReputation: 42, minFans: 3200, upfront: 62000, weekly: 11000, eventBonus: 26000, duration: 20, copy: 'Cobertura regional e crescimento de audiência da academia.' },
  ];
  function baseDevelopment(fighter) {
    const rating = Number(fighter.rating) || 62;
    const isBoxer = fighter.discipline === 'Boxe';
    return {
      attributes: {
        striking: Math.min(90, rating + (isBoxer ? 6 : 2)),
        grappling: Math.max(38, Math.min(88, rating + (isBoxer ? -14 : 5))),
        cardio: Math.min(88, rating + 1),
        defense: Math.min(88, rating - 1),
        fightIQ: Math.min(88, rating),
      },
      fatigue: 18,
      injury: null,
      totalSessions: 0,
    };
  }
  function ensureDevelopment(fighter) {
    if (!fighter) return baseDevelopment({});
    const fallback = baseDevelopment(fighter);
    const stored = fighter.development || {};
    fighter.development = {
      ...fallback,
      ...stored,
      attributes: { ...fallback.attributes, ...(stored.attributes || {}) },
      fatigue: Number.isFinite(stored.fatigue) ? stored.fatigue : fallback.fatigue,
      injury: stored.injury && Number.isFinite(stored.injury.weeks) && stored.injury.weeks > 0 ? stored.injury : null,
      totalSessions: Number.isFinite(stored.totalSessions) ? stored.totalSessions : 0,
    };
    return fighter.development;
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

  const worldRivalProfiles = [
    { id: 'sokolov', name: 'Viktor Sokolov', initials: 'VS', country: 'Rússia', discipline: 'MMA', division: 'Leve', record: '12-2-0', rating: 70, heat: 34, archetype: 'O provocador', copy: 'Quer transformar cada confronto em manchete.', color: 'red' },
    { id: 'ortega', name: 'Mateo Ortega', initials: 'MO', country: 'México', discipline: 'Boxe', division: 'Leve', record: '14-3-0', rating: 68, heat: 22, archetype: 'O estrategista', copy: 'Aparece no seu caminho sempre que o ranking sobe.', color: 'blue' },
    { id: 'okafor', name: 'Amina Okafor', initials: 'AO', country: 'Nigéria', discipline: 'MMA', division: 'Palha', record: '11-1-0', rating: 71, heat: 18, archetype: 'A campeã jovem', copy: 'Um nome que a mídia já trata como futuro da divisão.', color: 'gold' },
  ];
  const competitionCatalog = [
    { id: 'rising-cup', tier: 'CIRCUITO ABERTO', name: 'VALE Rising Cup', city: 'São Paulo', icon: '◇', minRating: 62, minReputation: 18, minPoints: 0, entryFee: 4500, prize: 34000, participation: 8500, reputationGain: 4, fansGain: 460, pointsGain: 62, delay: 2, description: 'A vitrine regional onde novos nomes deixam de ser promessa.', accent: 'gold' },
    { id: 'contender-series', tier: 'SÉRIE CONTENDER', name: 'Apex Contender Series', city: 'Rio de Janeiro', icon: '◈', minRating: 66, minReputation: 26, minPoints: 70, entryFee: 12000, prize: 78000, participation: 18000, reputationGain: 8, fansGain: 980, pointsGain: 145, delay: 3, description: 'Um card televisionado que aproxima o atleta do ranking mundial.', accent: 'red' },
    { id: 'global-invitational', tier: 'CONVITE INTERNACIONAL', name: 'Meridian Invitational', city: 'Lisboa', icon: '✦', minRating: 71, minReputation: 40, minPoints: 175, entryFee: 24000, prize: 165000, participation: 38000, reputationGain: 13, fansGain: 2100, pointsGain: 255, delay: 4, description: 'A rota internacional exige nome, números e uma reputação que sustente a pressão.', accent: 'blue' },
  ];
  const globalCircuitCatalog = [
    { id: 'vale-rising', name: 'VALE Rising Cup', discipline: 'MMA', city: 'São Paulo', country: 'Brasil', mark: 'VR', tier: 'EMERGENTE', points: 62, x: 31, y: 66, accent: 'gold' },
    { id: 'apex-league', name: 'Apex Combat League', discipline: 'MMA', city: 'Las Vegas', country: 'EUA', mark: 'AC', tier: 'PREMIUM', points: 145, x: 23, y: 39, accent: 'red' },
    { id: 'meridian-boxing', name: 'Meridian Boxing Series', discipline: 'Boxe', city: 'Lisboa', country: 'Portugal', mark: 'MB', tier: 'GLOBAL', points: 255, x: 50, y: 37, accent: 'blue' },
    { id: 'pacific-crown', name: 'Pacific Crown', discipline: 'MMA', city: 'Tóquio', country: 'Japão', mark: 'PC', tier: 'MAJOR', points: 210, x: 83, y: 42, accent: 'green' },
    { id: 'desert-strike', name: 'Desert Strike Championship', discipline: 'Boxe', city: 'Dubai', country: 'Emirados Árabes Unidos', mark: 'DS', tier: 'MAJOR', points: 195, x: 63, y: 49, accent: 'gold' },
  ];
  const worldBriefingCatalog = [
    { id: 'opening-brief', week: 1, category: 'CONSELHO', sender: 'Diretoria VALE', title: 'O mercado está olhando para você.', copy: 'A primeira impressão da academia será formada antes do primeiro cinturão. Escolha como a organização se apresenta ao circuito.', choices: { press: { label: 'ABRIR PORTAS À IMPRENSA', copy: 'Gera atenção imediata e aumenta a pressão.', fans: 170, reputation: 2, rivalry: 4 }, quiet: { label: 'TRABALHAR NOS BASTIDORES', copy: 'Preserva caixa e protege o atleta do ruído.', cash: 3500, morale: 2 } } },
    { id: 'sokolov-callout', week: 2, category: 'RIVALIDADE', sender: 'Viktor Sokolov', rivalId: 'sokolov', title: '“O projeto VALE ainda não provou nada.”', copy: 'Sokolov citou sua academia em uma entrevista após vencer na Arena Solaris. O público já espera uma resposta.', choices: { answer: { label: 'RESPONDER AO DESAFIO', copy: 'Aumenta a rivalidade e a audiência potencial.', fans: 240, reputation: 2, rivalry: 24 }, ignore: { label: 'DEIXAR O CAMP FALAR', copy: 'Protege o foco e evita alimentar a narrativa.', morale: 3, rivalry: -6 } } },
    { id: 'network-window', week: 4, category: 'TRANSMISSÃO', sender: 'Rede Prisma', title: 'Janela de cobertura para o próximo show.', copy: 'A rede aceita acompanhar o evento se a academia se comprometer com uma agenda de conteúdo.', choices: { accept: { label: 'ACEITAR A COBERTURA', copy: 'Amplia a exposição e adiciona receita operacional.', cash: 12000, fans: 360, reputation: 3 }, decline: { label: 'MANTER CONTROLE CRIATIVO', copy: 'Evita a pressão de mídia e eleva a moral do elenco.', morale: 4 } } },
  ];
  function createWorldState() {
    return {
      seed: 271826,
      cycle: 0,
      selectedDiscipline: 'mma',
      selectedDivision: 'leve',
      watchedEventId: 'apex-32',
      playerRanking: { fighterId: null, points: 20, position: null, lastChange: 0 },
      events: [
        { id: 'apex-32', circuitId: 'apex-league', name: 'Apex Combat League 32', discipline: 'MMA', week: 2, date: 'Semana 2', venue: 'Arena Solaris · Las Vegas', main: 'Aiden Brooks × Kaito Nakamura', status: 'agendado' },
        { id: 'meridian-17', circuitId: 'meridian-boxing', name: 'Meridian Boxing Series 17', discipline: 'Boxe', week: 3, date: 'Semana 3', venue: 'Pavilhão Norte · Lisboa', main: 'Andrés Rojas × Kieran Price', status: 'agendado' },
        { id: 'apex-33', circuitId: 'pacific-crown', name: 'Pacific Crown 33', discipline: 'MMA', week: 4, date: 'Semana 4', venue: 'Domo Aurora · Tóquio', main: 'Asha Rahman × Júlia Pinheiro', status: 'agendado' },
      ],
      results: [],
      inbox: [structuredClone(worldBriefingCatalog[0])],
      rivalries: structuredClone(worldRivalProfiles),
    };
  }

  function makeSeed() {
    return {
      schemaVersion: 13,
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
      trainingCamp: createTrainingCampState(),
      scouting: createScoutingState(),
      staffCenter: createStaffCenterState(),
      sponsorship: createSponsorshipState(),
      competitions: createCompetitionState(),
    };
  }

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (parsed && parsed.schemaVersion >= 1) {
        const migrated = { ...makeSeed(), ...parsed, schemaVersion: 13 };
        migrated.world = parsed.world ? { ...createWorldState(), ...parsed.world } : createWorldState();
        migrated.world.events = Array.isArray(migrated.world.events) ? migrated.world.events.map((event, index) => ({ ...event, week: Number.isFinite(event.week) ? event.week : index + 2 })) : createWorldState().events;
        migrated.world.inbox = Array.isArray(migrated.world.inbox) ? migrated.world.inbox : structuredClone(createWorldState().inbox);
        migrated.world.rivalries = Array.isArray(migrated.world.rivalries) ? migrated.world.rivalries : structuredClone(worldRivalProfiles);
        migrated.fight = parsed.fight ? { ...createFightState(), ...parsed.fight } : createFightState();
        migrated.contracts = Array.isArray(parsed.contracts) ? parsed.contracts : (parsed.fighters || []).map((fighter) => contractFor(fighter, { signing: fighter.signing || 0, salary: fighter.salary, duration: 2 }));
        migrated.contractHistory = Array.isArray(parsed.contractHistory) ? parsed.contractHistory : [];
        migrated.negotiation = parsed.negotiation ? { ...createNegotiationState(), ...parsed.negotiation } : createNegotiationState();
        migrated.eventPlanner = parsed.eventPlanner ? { ...createEventPlannerState(), ...parsed.eventPlanner, history: Array.isArray(parsed.eventPlanner.history) ? parsed.eventPlanner.history : [] } : createEventPlannerState();
        migrated.trainingCamp = parsed.trainingCamp ? { ...createTrainingCampState(), ...parsed.trainingCamp, weeklyPlan: Array.isArray(parsed.trainingCamp.weeklyPlan) && parsed.trainingCamp.weeklyPlan.length === 7 ? parsed.trainingCamp.weeklyPlan : createTrainingCampState().weeklyPlan, history: Array.isArray(parsed.trainingCamp.history) ? parsed.trainingCamp.history : [] } : createTrainingCampState();
        migrated.scouting = parsed.scouting ? { ...createScoutingState(), ...parsed.scouting, reports: parsed.scouting.reports && typeof parsed.scouting.reports === 'object' ? parsed.scouting.reports : {}, shortlist: Array.isArray(parsed.scouting.shortlist) ? parsed.scouting.shortlist : [], history: Array.isArray(parsed.scouting.history) ? parsed.scouting.history : [] } : createScoutingState();
        migrated.staffCenter = parsed.staffCenter ? { ...createStaffCenterState(), ...parsed.staffCenter, hiredIds: Array.isArray(parsed.staffCenter.hiredIds) ? parsed.staffCenter.hiredIds : [], history: Array.isArray(parsed.staffCenter.history) ? parsed.staffCenter.history : [] } : createStaffCenterState();
        migrated.sponsorship = parsed.sponsorship ? { ...createSponsorshipState(), ...parsed.sponsorship, active: Array.isArray(parsed.sponsorship.active) ? parsed.sponsorship.active : [], history: Array.isArray(parsed.sponsorship.history) ? parsed.sponsorship.history : [] } : createSponsorshipState();
        migrated.competitions = parsed.competitions ? { ...createCompetitionState(), ...parsed.competitions, completed: Array.isArray(parsed.competitions.completed) ? parsed.competitions.completed : [], history: Array.isArray(parsed.competitions.history) ? parsed.competitions.history : [] } : createCompetitionState();
        migrated.fighters = Array.isArray(parsed.fighters) ? parsed.fighters : [];
        migrated.fighters.forEach((fighter) => ensureDevelopment(fighter));
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
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
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
  function scoutingCenter() { return state.scouting || createScoutingState(); }
  function staffCenter() { return state.staffCenter || createStaffCenterState(); }
  function sponsorshipCenter() { return state.sponsorship || createSponsorshipState(); }
  function competitionCenter() { return state.competitions || createCompetitionState(); }
  function competitionById(id) { return competitionCatalog.find((competition) => competition.id === id); }
  function activeCompetition() { const active = competitionCenter().active; return active && ['registered', 'ready', 'live'].includes(active.status) ? active : null; }
  function openRivalries() { return Array.isArray(state.world.rivalries) ? state.world.rivalries : []; }
  function hottestRivalry(fighter = selectedFighter()) {
    const relevant = openRivalries().filter((rival) => !fighter || rival.discipline === fighter.discipline);
    return relevant.reduce((leader, rival) => !leader || rival.heat > leader.heat ? rival : leader, null);
  }
  function rivalryInfluence(fighter = selectedFighter()) { return hottestRivalry(fighter)?.heat || 0; }
  function competitionEligibility(competition, fighter = selectedFighter()) {
    const activeShow = eventPlanner().activeEvent?.status;
    const hasOpenSlot = !state.fightBooked && !activeCompetition() && !['planned', 'ready', 'live'].includes(activeShow);
    const ready = fighter && fighterCanCompete(fighter);
    const rating = Number(fighter?.rating || 0) >= competition.minRating;
    const reputation = state.reputation >= competition.minReputation;
    const points = state.world.playerRanking.points >= competition.minPoints;
    return { fighter: Boolean(fighter), ready, rating, reputation, points, hasOpenSlot, eligible: Boolean(fighter && ready && rating && reputation && points && hasOpenSlot) };
  }
  function competitionOpponent(fighter, competition) {
    const candidates = openRivalries().filter((rival) => rival.discipline === fighter.discipline && rival.division === fighter.division);
    const fallback = regionalOpponent(fighter);
    const rival = candidates[(avatarIndex(competition.id) + state.week) % Math.max(1, candidates.length)] || candidates[0];
    if (!rival) return { ...fallback, rating: Math.max(fallback.rating || 64, competition.minRating + 1) };
    return { ...rival, rating: Math.max(rival.rating, competition.minRating + 1) };
  }
  function worldCalendarEntries() {
    const globalEvents = state.world.events.map((event, index) => ({ id: event.id, week: event.week || index + 2, type: event.discipline, title: event.name, detail: `${event.venue} · ${event.main}`, status: event.status }));
    const competition = activeCompetition();
    const promoted = eventPlanner().activeEvent;
    if (competition) globalEvents.push({ id: competition.id, week: competition.week, type: competition.tier, title: competition.name, detail: `${competition.city} · ${competition.fighterName} × ${competition.opponent.name}`, status: competition.status });
    if (promoted && ['planned', 'ready', 'live'].includes(promoted.status)) globalEvents.push({ id: promoted.id, week: promoted.week, type: 'VALE EVENT', title: promoted.name, detail: `${promoted.venueName} · ${promoted.fighterName} × ${promoted.opponent.name}`, status: promoted.status });
    return globalEvents.sort((first, second) => first.week - second.week).slice(0, 7);
  }
  function circuitById(id) { return globalCircuitCatalog.find((circuit) => circuit.id === id); }
  function globalCircuitStandings() {
    const champions = ['Dante Kwan', 'Aiden Brooks', 'Samuel Voss', 'Riku Tanaka', 'Nadia Fares'];
    return globalCircuitCatalog.map((circuit, index) => ({ ...circuit, champion: champions[index], score: 980 - index * 86 + state.world.cycle * 4 })).sort((first, second) => second.score - first.score);
  }
  function worldMapPanel() {
    const active = activeCompetition();
    const playerCircuit = active ? { name: active.name, city: active.city, mark: 'V', x: active.city === 'Lisboa' ? 50 : 31, y: active.city === 'Lisboa' ? 37 : 66, accent: 'player' } : null;
    const markers = [...globalCircuitCatalog, ...(playerCircuit ? [playerCircuit] : [])];
    const standings = globalCircuitStandings();
    return `<section class="world-map-section card"><div class="world-map-heading"><div><span class="eyebrow">GLOBAL CIRCUIT NETWORK</span><h2>O palco é <span class="text-gold">o planeta.</span></h2><p>Circuitos autorais conectam cidades, ranking e oportunidades. Selos oficiais podem ser integrados quando houver licenças de marca.</p></div><div class="world-map-live"><span></span>REDE AO VIVO · S${state.week}</div></div><div class="world-map-canvas" role="img" aria-label="Mapa mundial dos circuitos de competição"><svg viewBox="0 0 1000 430" aria-hidden="true"><path d="M75 112l74-48 78 19 21 43-34 41-54-5-29 42-59-18-19-38zM245 220l56 23 18 71-26 88-47-13-22-81zM430 96l86-36 116 18 31 56-70 30-20 67-68-14-45-53zM560 249l83-14 67 45-32 103-79 3-44-73zM746 96l119 15 75 43-42 50-88-15-55 35-49-49zM807 277l78 17 23 60-66 19-49-43z" /></svg><div class="world-map-graticule"></div>${markers.map((circuit) => `<span class="world-map-node ${circuit.accent || 'gold'}" style="--x:${circuit.x};--y:${circuit.y}" aria-label="${escapeHTML(circuit.name)}, ${escapeHTML(circuit.city)}"><b>${escapeHTML(circuit.mark)}</b><small>${escapeHTML(circuit.city)}</small></span>`).join('')}</div><div class="world-circuit-strip">${standings.map((circuit, index) => `<article class="world-circuit-row"><span class="circuit-rank">${index + 1}</span><span class="circuit-mark ${circuit.accent}">${escapeHTML(circuit.mark)}</span><div><strong>${escapeHTML(circuit.name)}</strong><small>${escapeHTML(circuit.city)} · campeão ${escapeHTML(circuit.champion)}</small></div><b>${circuit.score}</b></article>`).join('')}</div></section>`;
  }
  function stageWorldBriefing() {
    const inbox = Array.isArray(state.world.inbox) ? state.world.inbox : (state.world.inbox = []);
    const template = worldBriefingCatalog.find((entry) => entry.week <= state.week && !inbox.some((message) => message.id === entry.id));
    if (!template) return;
    inbox.unshift(structuredClone(template));
    inbox.splice(8);
    addMessage(`Nova inteligência de mercado: ${template.sender} enviou uma decisão para sua caixa estratégica.`);
  }
  function activeInboxMessages() { return (state.world.inbox || []).filter((message) => message.status !== 'resolved'); }
  function staffById(id) { return staffMarket.find((member) => member.id === id); }
  function hiredStaff() { return staffCenter().hiredIds.map(staffById).filter(Boolean); }
  function staffBonus(key) { return hiredStaff().reduce((sum, member) => sum + (member.effects[key] || 0), 0); }
  function staffPayroll() { return hiredStaff().reduce((sum, member) => sum + member.salary, 0); }
  function sponsorById(id) { return sponsorshipOffers.find((sponsor) => sponsor.id === id); }
  function sponsorEligible(sponsor) { return state.reputation >= sponsor.minReputation && state.fans >= sponsor.minFans; }
  function activeSponsors() { return sponsorshipCenter().active.filter((contract) => contract.status === 'ativo'); }
  function sponsorEventBonus() { return activeSponsors().reduce((sum, contract) => sum + (sponsorById(contract.sponsorId)?.eventBonus || 0), 0); }
  function prospectReport(prospect) { return scoutingCenter().reports[prospect.id] || null; }
  function scoutTurnaround() { return Math.max(1, 2 - Math.floor(staffBonus('scouting'))); }
  function selectedVenue() { return eventVenues.find((venue) => venue.id === eventPlanner().venueId) || eventVenues[0]; }
  function selectedPromotion() { return promotionPlans.find((plan) => plan.id === eventPlanner().promotionId) || promotionPlans[1]; }
  function eventFighter() {
    const planner = eventPlanner();
    return state.fighters.find((fighter) => fighter.id === planner.fighterId) || selectedFighter();
  }
  function eventEstimate(fighter = eventFighter(), venue = selectedVenue(), promotion = selectedPromotion()) {
    const sponsorBonus = sponsorEventBonus();
    if (!fighter) return { attendance: 0, gate: 0, media: 0, sponsorBonus, operating: venue.production, purse: 0, totalCost: venue.rental + promotion.cost + venue.production, projected: -(venue.rental + promotion.cost + venue.production) + sponsorBonus };
    const marketing = staffBonus('marketing');
    const rivalryHeat = rivalryInfluence(fighter);
    const interest = state.fans * .16 + state.reputation * 34 + fighter.rating * 12 + promotion.audience + marketing * 140 + rivalryHeat * 11;
    const attendance = Math.min(venue.capacity, Math.max(600, Math.round(interest)));
    const gate = attendance * venue.ticket;
    const media = promotion.media + Math.round(state.reputation * 330) + Math.round(marketing * 9000) + rivalryHeat * 135;
    const purse = 26000 + fighter.rating * 440;
    const operating = venue.production + Math.round(attendance * 7.5);
    const totalCost = venue.rental + promotion.cost + operating;
    return { attendance, gate, media, sponsorBonus, operating, purse, totalCost, projected: gate + media + sponsorBonus - totalCost + purse };
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
  function trainingCamp() { return state.trainingCamp || createTrainingCampState(); }
  function campFighter() {
    const camp = trainingCamp();
    return state.fighters.find((fighter) => fighter.id === camp.fighterId) || selectedFighter();
  }
  function injuryLabel(fighter) {
    const injury = ensureDevelopment(fighter).injury;
    return injury ? `${injury.label} · ${injury.weeks} semana${injury.weeks === 1 ? '' : 's'}` : 'Liberado(a)';
  }
  function fighterCanCompete(fighter) { return !ensureDevelopment(fighter).injury; }
  function effectiveCombatRating(fighter, tacticKey = 'aggressive') {
    const development = ensureDevelopment(fighter);
    const attributes = development.attributes;
    const primary = tacticKey === 'takedown' || tacticKey === 'clinch' ? attributes.grappling : tacticKey === 'defensive' ? attributes.defense : tacticKey === 'conserve' ? attributes.cardio : tacticKey === 'counter' ? Math.round((attributes.striking + attributes.fightIQ) / 2) : attributes.striking;
    const conditioning = Number(fighter.conditioning) || 70;
    const morale = Number(fighter.morale) || 70;
    return Math.max(45, (Number(fighter.rating) || 62) + (primary - 62) * .16 + (attributes.cardio - 62) * .06 + (attributes.fightIQ - 62) * .05 + (conditioning - 70) * .035 + (morale - 70) * .018 - development.fatigue * .075);
  }
  function nextCampRandom() {
    const camp = trainingCamp();
    camp.seed = (camp.seed * 1664525 + 1013904223) >>> 0;
    return camp.seed / 4294967296;
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
    stageWorldBriefing();
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
    return `<aside class="sidebar"><div class="brand"><span class="brand-mark">V</span><div><div class="brand-name">VALE</div><div class="brand-sub">Fight Manager</div></div></div><nav class="nav" aria-label="Módulos principais">${navButton('home', '⌂', 'Central')}${navButton('roster', '♟', 'Lutadores')}${navButton('scouting', '⌕', 'Prospecção')}${navButton('training', '✦', 'Camp')}${navButton('staff', '◌', 'Equipe')}${navButton('negotiation', '♢', 'Negociar')}${navButton('competitions', '♛', 'Competições')}${navButton('events', '▦', 'Eventos')}${navButton('sponsors', '✧', 'Marcas')}${navButton('fight', '⚑', 'Fight Night')}${navButton('rankings', '♜', 'Rankings')}${navButton('world', '◉', 'Mundo')}${navButton('academy', '⌂', 'Academia')}${navButton('finance', '▥', 'Finanças')}${navButton('saves', '▣', 'Saves')}</nav><div class="sidebar-bottom"><strong>Fases 12–13</strong>Arena ao vivo, mundo conectado e carreira protegida</div></aside>`;
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
  function trainingView() {
    const camp = trainingCamp();
    const fighter = campFighter();
    if (!fighter) return `<section class="content"><div class="page-heading"><div><div class="eyebrow">Centro de treinamento</div><h1>Primeiro<br><span class="text-gold">atleta.</span></h1><p class="page-copy">Assine um atleta para abrir uma rotina semanal, desenvolver atributos e preparar a próxima Fight Night.</p></div><button class="button" data-nav="roster">ABRIR MERCADO</button></div></section>`;
    const development = ensureDevelopment(fighter);
    const focus = campFocuses[camp.focus] || campFocuses.striking;
    const plan = camp.weeklyPlan.map((key) => campSessions[key] ? key : 'rest');
    const sparringDays = plan.filter((key) => key === 'sparring').length;
    const risk = Math.max(2, Math.min(36, Math.round(4 + development.fatigue * .22 + sparringDays * 5 - state.facilities.recovery * 3)));
    const readyForFight = fighterCanCompete(fighter);
    const report = camp.lastReport;
    const reportMarkup = report ? `<div class="camp-report"><div><span class="eyebrow">Última semana aplicada · S${report.week}</span><strong>${escapeHTML(report.title)}</strong><p>${escapeHTML(report.copy)}</p></div><span class="${report.injured ? 'report-alert' : 'report-good'}">${report.injured ? 'ATENÇÃO' : '+ EVOLUÇÃO'}</span></div>` : `<div class="camp-report empty"><div><span class="eyebrow">Próxima resolução</span><strong>A rotina será aplicada ao avançar a semana.</strong><p>As escolhas abaixo mudam preparo, atributos e disponibilidade do atleta.</p></div></div>`;
    return `<section class="content training-page"><div class="page-heading"><div><div class="eyebrow">Centro de treinamento · preparação semanal</div><h1>Construa o<br><span class="text-gold">melhor camp.</span></h1><p class="page-copy">Cada dia tem efeito real: os atributos alimentam a simulação da Fight Night, a fadiga limita o desempenho e uma lesão impede novos cards até a recuperação.</p></div><button class="button" data-action="advance-week">APLICAR SEMANA</button></div><section class="training-hero card"><div class="training-hero-backdrop"></div><div class="training-hero-main">${fighterAvatar(fighter, 'camp-portrait')}<div><div class="eyebrow">Atleta no camp</div><h2>${escapeHTML(fighter.name)}</h2><p>${fighterIdentity(fighter)} · ${fighter.discipline} · ${fighter.division} · ${fighter.rating} OVR</p><div class="camp-availability ${readyForFight ? 'ready' : 'injured'}"><span>${readyForFight ? '●' : '!'}</span>${readyForFight ? 'DISPONÍVEL PARA LUTAR' : escapeHTML(injuryLabel(fighter).toUpperCase())}</div></div></div><div class="training-hero-state"><div><small>FADIGA</small><strong>${development.fatigue}<em>/100</em></strong></div><div><small>PREPARO</small><strong>${fighter.camp || 0}<em>%</em></strong></div><div><small>RISCO SEMANAL</small><strong class="${risk >= 22 ? 'text-red' : 'text-green'}">${risk}%</strong></div></div></section><section class="training-layout"><article class="card camp-plan-card"><div class="card-title"><span>Plano da semana</span><small>edite antes de avançar o calendário</small></div><div class="camp-body"><div class="camp-athlete-row">${state.fighters.map((candidate) => `<button class="camp-athlete-choice ${candidate.id === fighter.id ? 'selected' : ''}" data-action="select-camp-fighter" data-id="${candidate.id}">${fighterAvatar(candidate, 'mini-portrait')}<span><strong>${escapeHTML(candidate.name)}</strong><small>${fighterIdentity(candidate, true)} · ${candidate.discipline}</small></span>${fighterCanCompete(candidate) ? '<b>PRONTO</b>' : '<b class="text-red">LESÃO</b>'}</button>`).join('')}</div><div class="focus-row"><span>Foco do camp</span>${Object.entries(campFocuses).map(([key, option]) => `<button class="focus-choice ${camp.focus === key ? 'selected' : ''}" data-action="select-camp-focus" data-focus="${key}">${escapeHTML(option.label)}</button>`).join('')}</div><p class="focus-copy"><strong>${escapeHTML(focus.label)}:</strong> ${escapeHTML(focus.copy)}</p><div class="camp-calendar">${plan.map((key, index) => { const session = campSessions[key]; return `<div class="camp-day"><div><span>DIA ${index + 1}</span><strong>${escapeHTML(session.label)}</strong><small>${escapeHTML(session.copy)}</small></div><button class="session-cycle" data-action="cycle-camp-session" data-day="${index}" aria-label="Alterar atividade do dia ${index + 1}">${session.icon}</button></div>`; }).join('')}</div><p class="camp-hint">Clique no ícone de cada dia para alternar a atividade. Sparring acelera o preparo, mas eleva a fadiga e o risco.</p></div></article><aside class="training-side"><article class="card attribute-card"><div class="card-title"><span>Perfil competitivo</span><small>impacta a Fight Night</small></div><div class="attribute-list">${Object.entries(development.attributes).map(([key, value]) => progress(campAttributeLabels[key], Math.round(value), key === focus.attribute ? 'background:linear-gradient(90deg,#ea293d,#ffc85d)' : '')).join('')}</div><div class="attribute-footer"><span>Impacto tático atual</span><strong>${Math.round(effectiveCombatRating(fighter, camp.focus))} FORÇA</strong></div></article>${reportMarkup}<article class="card camp-guidance"><div class="card-title"><span>Leitura da equipe</span><small>semana ${state.week}</small></div><div class="section-body"><ul class="feature-list"><li>${state.facilities.recovery ? `Recuperação nível ${state.facilities.recovery} reduz o risco do camp.` : 'Construa Recuperação na Academia para reduzir o risco de lesão.'}</li><li>${sparringDays ? `${sparringDays} sessão(ões) de sparring configurada(s): ganho alto, carga maior.` : 'Sem sparring: menor ganho de preparo, mas rotina mais segura.'}</li><li>${readyForFight ? 'O atleta está elegível para aceitar uma luta ou liderar um evento.' : 'Atleta em recuperação: novos cards e lutas ficam bloqueados até a liberação.'}</li></ul></div></article></aside></section></section>`;
  }
  function scoutingView() {
    const scouting = scoutingCenter();
    const available = prospects.filter((prospect) => !state.signedIds.includes(prospect.id));
    const filtered = scouting.filter === 'todos' ? available : available.filter((prospect) => prospect.discipline.toLowerCase() === scouting.filter);
    const prospect = filtered.find((candidate) => candidate.id === scouting.selectedProspectId) || filtered[0] || available[0] || null;
    if (!prospect) return `<section class="content"><div class="page-heading"><div><div class="eyebrow">Prospecção</div><h1>Mercado<br><span class="text-gold">esgotado.</span></h1><p class="page-copy">Todos os prospects desta primeira janela já foram contratados. Avance as semanas para renovar o mercado.</p></div><button class="button" data-action="advance-week">AVANÇAR SEMANA</button></div></section>`;
    const report = prospectReport(prospect);
    const reportComplete = report?.status === 'complete';
    const pending = report?.status === 'pending';
    const traits = reportComplete ? Object.entries(report.attributes).map(([key, value]) => progress(campAttributeLabels[key], value)).join('') : '<div class="scout-unknown">Atributos detalhados ficam ocultos até a conclusão do relatório.</div>';
    const action = reportComplete ? `<button class="button" data-action="scout-negotiate" data-id="${prospect.id}">ABRIR NEGOCIAÇÃO</button>` : pending ? `<button class="button secondary" disabled>EM CAMPO · S${report.dueWeek}</button>` : `<button class="button" data-action="request-scout-report" data-id="${prospect.id}">SOLICITAR RELATÓRIO · ${money(reportCost())}</button>`;
    return `<section class="content scouting-page"><div class="page-heading"><div><div class="eyebrow">Prospecção & inteligência de mercado</div><h1>Encontre o<br><span class="text-gold">próximo nome.</span></h1><p class="page-copy">Observar não contrata automaticamente. Solicite um relatório, aguarde a apuração e só então transforme informação em proposta.</p></div><button class="button secondary" data-nav="negotiation">VER CONTRATOS</button></div><section class="scouting-summary">${statCard('Prospects disponíveis', available.length, `${scouting.shortlist.length} na lista curta`, 'var(--gold-bright)')}${statCard('Relatórios em campo', Object.values(scouting.reports).filter((entry) => entry.status === 'pending').length, staffBonus('scouting') ? 'olheira reduz prazo' : 'prazo padrão: 2 semanas', 'var(--blue)')}${statCard('Inteligência da equipe', `${Math.round(staffBonus('scouting') * 100)}%`, staffBonus('scouting') ? 'relatórios aprimorados' : 'contrate uma olheira para ampliar a leitura', 'var(--green)')}</section><section class="scouting-layout"><article class="card scout-list-card"><div class="card-title"><span>Mapa de prospects</span><small>filtros por modalidade</small></div><div class="scout-filters">${[['todos', 'Todos'], ['mma', 'MMA'], ['boxe', 'Boxe']].map(([key, label]) => `<button class="ranking-tab ${scouting.filter === key ? 'selected' : ''}" data-action="filter-scouting" data-filter="${key}">${label}</button>`).join('')}</div><div class="scout-list">${filtered.map((candidate) => { const itemReport = prospectReport(candidate); return `<button class="scout-row ${candidate.id === prospect.id ? 'selected' : ''}" data-action="select-scout-prospect" data-id="${candidate.id}">${fighterAvatar(candidate, 'mini-portrait')}<span><strong>${escapeHTML(candidate.name)}</strong><small>${fighterIdentity(candidate)} · ${candidate.discipline} · ${candidate.division}</small></span><em>${itemReport?.status === 'complete' ? 'DOSSIÊ' : itemReport?.status === 'pending' ? `S${itemReport.dueWeek}` : 'NÃO VISTO'}</em></button>`; }).join('')}</div></article><article class="card scout-dossier"><div class="scout-dossier-hero">${fighterAvatar(prospect, 'deal-portrait')}<div><div class="eyebrow">${reportComplete ? 'Dossiê confirmado' : pending ? 'Equipe em campo' : 'Perfil preliminar'}</div><h2>${escapeHTML(prospect.name)}</h2><p>${fighterIdentity(prospect)} · ${prospect.age} anos · ${prospect.discipline} · ${prospect.division}</p></div><div class="deal-rating"><span>OVR</span><strong>${prospect.rating}</strong><small>${reportComplete ? `${prospect.potential} potencial` : 'potencial oculto'}</small></div></div><div class="scout-dossier-body"><div class="scout-trait-grid"><div><span>ESTILO</span><strong>${escapeHTML(prospect.style)}</strong></div><div><span>FAIXA DE MERCADO</span><strong>${money(prospect.signing)} + ${money(prospect.salary)}/semana</strong></div><div><span>STATUS</span><strong>${reportComplete ? 'VERIFICADO' : pending ? 'EM ANÁLISE' : 'NÃO VERIFICADO'}</strong></div></div>${reportComplete ? `<div class="scout-report-note"><strong>${escapeHTML(report.summary)}</strong><small>Risco físico: ${escapeHTML(report.risk)} · Disciplina: ${escapeHTML(report.discipline)}</small></div>` : '<div class="scout-report-note muted"><strong>O dossiê completo revela atributos, disciplina e risco físico.</strong><small>O resultado é persistente e só se resolve ao avançar a semana.</small></div>'}</div><div class="attribute-list scout-attributes">${traits}</div><div class="scout-actions"><button class="button secondary" data-action="toggle-shortlist" data-id="${prospect.id}">${scouting.shortlist.includes(prospect.id) ? 'REMOVER DA LISTA' : 'ADICIONAR À LISTA'}</button>${action}</div></article><aside class="scouting-side"><article class="card"><div class="card-title"><span>Lista curta</span><small>${scouting.shortlist.length} atleta(s)</small></div><div class="scout-shortlist">${scouting.shortlist.length ? scouting.shortlist.map((id) => { const candidate = prospectById(id); return candidate ? `<div>${fighterAvatar(candidate, 'mini-portrait')}<span><strong>${escapeHTML(candidate.name)}</strong><small>${candidate.discipline} · ${candidate.rating} OVR</small></span></div>` : ''; }).join('') : '<p>Nenhum atleta priorizado.</p>'}</div></article><article class="card scout-insight"><div class="card-title"><span>Como funciona</span><small>fluxo funcional</small></div><div class="section-body"><ul class="feature-list"><li>Solicite observação e o relatório entra na agenda.</li><li>Avance a semana para revelar dados e traços do atleta.</li><li>Negocie depois de avaliar custo, estilo e risco.</li></ul></div></article></aside></section></section>`;
  }
  function staffView() {
    const center = staffCenter();
    const hired = hiredStaff();
    const capacity = state.staff + state.academyLevel + 2;
    const payroll = staffPayroll();
    return `<section class="content staff-page"><div class="page-heading"><div><div class="eyebrow">Equipe técnica & operação</div><h1>Quem prepara<br><span class="text-gold">campeões.</span></h1><p class="page-copy">Especialistas melhoram relatórios, atributos, recuperação, interesse de marca e resultado de eventos. Seus salários entram na folha semanal.</p></div><button class="button secondary" data-nav="training">ABRIR CAMP</button></div><section class="staff-summary">${statCard('Núcleo operacional', state.staff, 'equipe base da dificuldade', 'var(--white)')}${statCard('Especialistas ativos', `${hired.length}/${capacity}`, `${hired.reduce((sum, member) => sum + member.capacity, 0)} atletas supervisionados`, 'var(--gold-bright)')}${statCard('Folha especializada', money(payroll), 'cobrada por semana', payroll ? '#ffb15d' : 'var(--muted)')}${statCard('Eficiência de camp', `+${Math.round((staffBonus('striking') + staffBonus('grappling') + staffBonus('cardio')) * 10)}%`, 'bônus distribuído por especialidade', 'var(--green)')}</section><section class="staff-layout"><article class="card staff-market"><div class="card-title"><span>Mercado de especialistas</span><small>contratos persistentes</small></div><div class="staff-cards">${staffMarket.map((member) => { const active = center.hiredIds.includes(member.id); const full = hired.length >= capacity; return `<article class="staff-card ${active ? 'hired' : ''}"><div class="staff-monogram">${member.icon}</div><div><span>${escapeHTML(member.role)}</span><strong>${escapeHTML(member.name)}</strong><p>${escapeHTML(member.specialty)}</p><small>${money(member.salary)}/semana · supervisiona ${member.capacity} atleta(s)</small></div><button class="button ${active ? 'secondary' : ''}" data-action="hire-staff" data-id="${member.id}" ${active || full ? 'disabled' : ''}>${active ? 'NA EQUIPE' : full ? 'CAPACIDADE CHEIA' : `${money(member.signing)} +`}</button></article>`; }).join('')}</div></article><aside class="staff-side"><article class="card staff-synergy"><div class="card-title"><span>Sinergia aplicada</span><small>efeitos reais</small></div><div class="section-body"><div class="staff-effect"><span>✦</span><div><strong>Treino técnico</strong><small>Striking +${staffBonus('striking').toFixed(1)} · Grappling +${staffBonus('grappling').toFixed(1)}</small></div></div><div class="staff-effect"><span>♡</span><div><strong>Recuperação</strong><small>Redução de fadiga +${staffBonus('recovery').toFixed(1)}</small></div></div><div class="staff-effect"><span>⌕</span><div><strong>Prospecção</strong><small>Precisão de scout +${staffBonus('scouting').toFixed(1)}</small></div></div><div class="staff-effect"><span>◌</span><div><strong>Marca & evento</strong><small>Alcance de marketing +${staffBonus('marketing').toFixed(1)}</small></div></div></div></article><article class="card"><div class="card-title"><span>Histórico</span><small>${center.history.length} registro(s)</small></div><div class="staff-history">${center.history.length ? center.history.slice(0, 5).map((entry) => `<div><strong>${escapeHTML(entry.name)}</strong><small>${escapeHTML(entry.copy)} · S${entry.week}</small></div>`).join('') : '<p>A primeira contratação técnica aparecerá aqui.</p>'}</div></article></aside></section></section>`;
  }
  function sponsorshipView() {
    const center = sponsorshipCenter();
    const active = activeSponsors();
    const weekly = active.reduce((sum, contract) => sum + (sponsorById(contract.sponsorId)?.weekly || 0), 0);
    return `<section class="content sponsorship-page"><div class="page-heading"><div><div class="eyebrow">Marca, parceiros & receitas</div><h1>Transforme<br><span class="text-gold">atenção em valor.</span></h1><p class="page-copy">As marcas são autorais e seus contratos não são decorativos: pagam na assinatura, geram receita semanal e bonificam eventos próprios.</p></div><button class="button secondary" data-nav="finance">VER LIVRO-CAIXA</button></div><section class="sponsor-summary">${statCard('Parceiros ativos', active.length, active.length ? 'contratos em vigência' : 'ofertas disponíveis', 'var(--gold-bright)')}${statCard('Receita semanal', money(weekly), 'lançada ao fechar a semana', 'var(--green)')}${statCard('Bônus por evento', money(sponsorEventBonus()), 'liquidado após a Fight Night', 'var(--blue)')}${statCard('Força da marca', state.reputation, `${state.fans.toLocaleString('pt-BR')} fãs na base`, 'var(--white)')}</section><section class="sponsor-layout"><article class="card sponsor-offers"><div class="card-title"><span>Ofertas de parceria</span><small>requisitos verificáveis</small></div><div class="sponsor-offer-list">${sponsorshipOffers.map((sponsor) => { const contract = active.find((entry) => entry.sponsorId === sponsor.id); const eligible = sponsorEligible(sponsor); return `<article class="sponsor-offer ${contract ? 'active' : ''}"><div class="sponsor-symbol">${sponsor.name.slice(0, 1)}</div><div><span>${escapeHTML(sponsor.category)}</span><strong>${escapeHTML(sponsor.name)}</strong><p>${escapeHTML(sponsor.copy)}</p><small>Entrada ${money(sponsor.upfront)} · ${money(sponsor.weekly)}/semana · ${money(sponsor.eventBonus)} por show</small></div><div class="sponsor-terms"><em>${contract ? `${contract.remainingWeeks} sem.` : eligible ? 'ELEGÍVEL' : 'BLOQUEADO'}</em><small>Req. rep. ${sponsor.minReputation} · ${sponsor.minFans.toLocaleString('pt-BR')} fãs</small><button class="button ${contract ? 'secondary' : ''}" data-action="accept-sponsor" data-id="${sponsor.id}" ${contract || !eligible ? 'disabled' : ''}>${contract ? 'ATIVO' : eligible ? 'ASSINAR' : 'SEM ALCANCE'}</button></div></article>`; }).join('')}</div></article><aside class="sponsor-side"><article class="card active-sponsors"><div class="card-title"><span>Contratos ativos</span><small>${active.length}/2 vagas</small></div>${active.length ? active.map((contract) => { const sponsor = sponsorById(contract.sponsorId); return `<div class="active-sponsor-row"><div class="sponsor-symbol">${sponsor.name.slice(0, 1)}</div><div><strong>${escapeHTML(sponsor.name)}</strong><small>${contract.remainingWeeks} semanas · ${money(sponsor.weekly)}/semana</small></div><span class="pill">ATIVO</span></div>`; }).join('') : '<div class="contract-empty">Nenhuma marca vinculada. Aumente reputação e fãs ou assine a proposta elegível.</div>'}</article><article class="card sponsor-forecast"><div class="card-title"><span>Próxima liquidação</span><small>automática</small></div><div class="section-body"><strong>${money(weekly)}</strong><p class="text-muted">Entrará no caixa quando a próxima semana for fechada. O histórico será registrado no livro-caixa.</p></div></article><article class="card"><div class="card-title"><span>Histórico de marca</span><small>${center.history.length} registro(s)</small></div><div class="staff-history">${center.history.length ? center.history.slice(0, 5).map((entry) => `<div><strong>${escapeHTML(entry.name)}</strong><small>${escapeHTML(entry.copy)} · S${entry.week}</small></div>`).join('') : '<p>Assinaturas e encerramentos aparecerão aqui.</p>'}</div></article></aside></section></section>`;
  }
  function competitionView() {
    const center = competitionCenter();
    const fighter = selectedFighter();
    const active = activeCompetition();
    const points = state.world.playerRanking.points;
    const activeMarkup = active ? `<article class="card competition-command"><div class="competition-command-stage"><div><span class="eyebrow">INSCRIÇÃO CONFIRMADA · S${active.week}</span><h2>${escapeHTML(active.name)}</h2><p>${escapeHTML(active.city)} · ${escapeHTML(active.tier)} · ${escapeHTML(active.status).toUpperCase()}</p></div><span class="competition-seal">${active.icon}</span></div><div class="competition-faceoff"><div>${fighterAvatar(fighter, 'portrait')}<strong>${escapeHTML(active.fighterName)}</strong><small>${fighterIdentity(fighter)} · ${fighter.record}</small></div><b>VS</b><div>${fighterAvatar(active.opponent, 'portrait')}<strong>${escapeHTML(active.opponent.name)}</strong><small>${fighterIdentity(active.opponent)} · ${active.opponent.record}</small></div></div><div class="competition-command-grid"><div><small>ENTRADA PAGA</small><strong>${money(active.entryFee)}</strong></div><div><small>PRÊMIO POR VITÓRIA</small><strong>${money(active.prize)}</strong></div><div><small>IMPACTO</small><strong>+${active.pointsGain} pts · +${active.reputationGain} rep.</strong></div></div><div class="competition-command-actions"><button class="button ${active.status === 'ready' ? '' : 'secondary'}" data-action="open-competition-fight" ${active.status === 'ready' ? '' : 'disabled'}>${active.status === 'ready' ? 'ENTRAR NA FIGHT NIGHT' : 'CAMP EM PREPARAÇÃO'}</button><button class="button secondary" data-nav="world">VER CALENDÁRIO GLOBAL</button></div></article>` : `<article class="card competition-command competition-empty"><div class="competition-command-stage"><div><span class="eyebrow">ROTA COMPETITIVA</span><h2>O próximo<br><span class="text-gold">convite.</span></h2><p>${fighter ? 'Escolha uma competição elegível. A inscrição reserva o atleta, cobra a taxa e prepara a Fight Night no calendário.' : 'Contrate e selecione um atleta para começar a disputar as rotas oficiais.'}</p></div><span class="competition-seal">♛</span></div><div class="competition-empty-line"><span>Ranking atual</span><strong>${points} pontos · ${state.world.playerRanking.position ? `#${state.world.playerRanking.position}` : 'sem posição'}</strong></div>${fighter ? `<button class="button secondary" data-nav="rankings">ANALISAR RANKINGS</button>` : '<button class="button" data-nav="scouting">ENCONTRAR ATLETA</button>'}</article>`;
    return `<section class="content competition-page"><section class="competition-hero card"><div class="competition-hero-light"></div><div class="competition-hero-copy"><span class="eyebrow">VALE COMPETITION DESK · TEMPORADA ${state.week}</span><h1>Ganhe a<br><span class="text-gold">próxima porta.</span></h1><p>Convites exigem atleta, nível, reputação e pontos. Ao aceitar, a vaga vira um compromisso real da sua carreira.</p><div class="competition-hero-pills"><span>♛ ${points} PONTOS</span><span>◉ ${state.reputation} REPUTAÇÃO</span><span>♟ ${state.fans.toLocaleString('pt-BR')} FÃS</span></div></div><div class="competition-hero-visual"><div class="competition-orbit"></div><div class="competition-crown">V</div><small>ROAD TO<br>THE TOP</small></div></section><section class="competition-layout"><article class="card competition-offers"><div class="card-title"><span>Convites & competições</span><small>critério verificável · vaga única</small></div><div class="competition-offer-list">${competitionCatalog.map((competition) => { const rules = competitionEligibility(competition, fighter); const activeOffer = active?.offerId === competition.id; const completed = center.completed.find((entry) => entry.offerId === competition.id); const checks = [[`OVR ${competition.minRating}+`, rules.rating], [`REP. ${competition.minReputation}+`, rules.reputation], [`${competition.minPoints} PTS`, rules.points]].map(([label, ok]) => `<span class="competition-check ${ok ? 'met' : ''}">${ok ? '✓' : '○'} ${label}</span>`).join(''); const status = completed ? 'CONCLUÍDA' : activeOffer ? active.status === 'ready' ? 'FIGHT NIGHT' : 'CONFIRMADA' : rules.eligible ? 'ELEGÍVEL' : 'EM ANÁLISE'; return `<article class="competition-offer ${competition.accent} ${activeOffer ? 'selected' : ''}"><div class="competition-offer-top"><span class="competition-tier">${competition.icon} ${competition.tier}</span><em>${status}</em></div><div class="competition-offer-main"><div><h2>${escapeHTML(competition.name)}</h2><p>${escapeHTML(competition.city)} · ${escapeHTML(competition.description)}</p></div><div class="competition-prize"><span>PRÊMIO</span><strong>${money(competition.prize)}</strong></div></div><div class="competition-checks">${checks}</div><div class="competition-offer-footer"><div><small>Taxa ${money(competition.entryFee)} · S${state.week + competition.delay}</small><strong>+${competition.pointsGain} pts · +${competition.reputationGain} rep.</strong></div><button class="button ${rules.eligible ? '' : 'secondary'}" data-action="accept-competition" data-id="${competition.id}" ${!rules.eligible || Boolean(active) || Boolean(completed) ? 'disabled' : ''}>${completed ? 'REGISTRO CONCLUÍDO' : activeOffer ? 'VAGA RESERVADA' : rules.eligible ? 'ACEITAR CONVITE' : !rules.fighter ? 'SEM ATLETA' : !rules.ready ? 'ATLETA INDISPONÍVEL' : !rules.hasOpenSlot ? 'AGENDA OCUPADA' : 'REQUISITOS PENDENTES'}</button></div></article>`; }).join('')}</div></article><aside class="competition-side">${activeMarkup}<article class="card competition-route-card"><div class="card-title"><span>Passaporte competitivo</span><small>dados do atleta selecionado</small></div><div class="competition-passport">${fighter ? `${fighterAvatar(fighter, 'profile-portrait')}<div><strong>${escapeHTML(fighter.name)}</strong><small>${fighter.discipline} · ${fighter.division}</small></div>` : '<span class="competition-passport-empty">♛</span>'}</div><div class="competition-route-stats"><div><small>OVR</small><strong>${fighter?.rating || '—'}</strong></div><div><small>RANKING</small><strong>${state.world.playerRanking.position ? `#${state.world.playerRanking.position}` : 'NR'}</strong></div><div><small>PONTOS</small><strong>${points}</strong></div></div></article><article class="card competition-history"><div class="card-title"><span>Registro de campanha</span><small>${center.completed.length} decisão(ões)</small></div>${center.completed.length ? center.completed.slice(0, 4).map((entry) => `<div><span>S${entry.week}</span><strong>${escapeHTML(entry.name)}</strong><small>${escapeHTML(entry.result)}</small></div>`).join('') : '<div class="contract-empty">Sua primeira participação competitiva aparecerá aqui depois da Fight Night.</div>'}</article></aside></section></section>`;
  }
  function worldView() {
    const inbox = [...(state.world.inbox || [])].sort((first, second) => (first.status === 'resolved') - (second.status === 'resolved'));
    const rivals = [...openRivalries()].sort((first, second) => second.heat - first.heat);
    const calendar = worldCalendarEntries();
    const hot = rivals[0];
    const messageMarkup = inbox.map((message) => {
      const choices = message.choices || {};
      const resolved = message.status === 'resolved';
      const choiceButtons = Object.entries(choices).map(([choice, detail]) => `<button class="button ${choice === 'quiet' || choice === 'ignore' || choice === 'decline' ? 'secondary' : ''}" data-action="resolve-world-message" data-id="${message.id}" data-choice="${choice}">${escapeHTML(detail.label)}</button>`).join('');
      const outcome = resolved ? `<div class="world-resolution"><b>✓ ${escapeHTML(message.decisionLabel || 'Decisão registrada')}</b><small>${escapeHTML(message.decisionCopy || 'O mundo reagiu à escolha da academia.')}</small></div>` : `<div class="world-message-actions">${choiceButtons}</div>`;
      return `<article class="world-message ${resolved ? 'resolved' : ''}"><div class="world-message-head"><span>${escapeHTML(message.category)}</span><small>${escapeHTML(message.sender)} · S${message.week}</small></div><h2>${escapeHTML(message.title)}</h2><p>${escapeHTML(message.copy)}</p>${outcome}</article>`;
    }).join('');
    const calendarMarkup = calendar.map((entry) => {
      const tone = entry.status.includes('finalizado') || entry.status === 'complete' ? 'done' : entry.status === 'ready' ? 'ready' : '';
      return `<article class="world-calendar-entry ${tone}"><div class="world-week-badge"><strong>S${entry.week}</strong><span>${escapeHTML(entry.type)}</span></div><div><strong>${escapeHTML(entry.title)}</strong><small>${escapeHTML(entry.detail)}</small></div><em>${escapeHTML(entry.status)}</em></article>`;
    }).join('');
    const resultsMarkup = state.world.results.length ? state.world.results.map((result) => `<div><span>◉</span><p><strong>${escapeHTML(result.event)}</strong>${escapeHTML(result.winner)} venceu por ${escapeHTML(result.method)}.<small>Semana ${result.week}</small></p></div>`).join('') : '<div class="contract-empty">O próximo avanço de semana resolve um evento global e atualiza o radar.</div>';
    const rivalsMarkup = rivals.map((rival) => `<article class="world-rival-row"><div>${fighterAvatar(rival, 'mini-portrait')}</div><div><strong>${escapeHTML(rival.name)}</strong><small>${escapeHTML(rival.archetype)} · ${rival.discipline}</small><p>${escapeHTML(rival.copy)}</p></div><div><b>${rival.heat}%</b><span class="rival-mini-bar"><i style="width:${rival.heat}%"></i></span></div></article>`).join('');
    const hotCopy = hot ? `${hot.archetype} · ${hot.record}` : 'Sem alvo definido';
    const hotSignal = hot?.heat >= 55 ? 'MÍDIA EM ALERTA' : 'OBSERVAÇÃO ATIVA';
    const mapMarkup = worldMapPanel();
    return `<section class="content world-page"><section class="world-hero card"><div class="world-grid-glow"></div><div class="world-hero-copy"><span class="eyebrow">VALE INTELLIGENCE · REDE GLOBAL</span><h1>O mundo<br><span class="text-gold">não espera.</span></h1><p>Eventos rodam, rivais provocam e parceiros tomam posição. Suas decisões geram consequências no ranking, na mídia e nas próximas oportunidades.</p><div class="world-signal-row"><span><b>${activeInboxMessages().length}</b> decisão(ões) abertas</span><span><b>${state.world.results.length}</b> resultado(s) monitorado(s)</span><span><b>${hot?.heat || 0}%</b> rivalidade em alta</span></div></div><div class="world-radar"><div class="world-radar-ring ring-a"></div><div class="world-radar-ring ring-b"></div><div class="world-radar-ring ring-c"></div><span class="world-radar-core">V</span><i class="world-radar-ping ping-one"></i><i class="world-radar-ping ping-two"></i><small>LIVE<br>NETWORK</small></div></section>${mapMarkup}<section class="world-layout"><article class="card world-inbox"><div class="card-title"><span>Caixa estratégica</span><small>${activeInboxMessages().length} decisão(ões) aguardando</small></div><div class="world-message-list">${messageMarkup}</div></article><section class="world-center-column"><article class="card world-calendar"><div class="card-title"><span>Radar de calendário</span><small>o que move o circuito</small></div><div class="world-calendar-track">${calendarMarkup}</div></article><article class="card world-results"><div class="card-title"><span>Placar do circuito</span><small>últimas transmissões</small></div><div class="world-result-feed">${resultsMarkup}</div></article></section><aside class="world-side"><article class="card rival-command"><div class="rival-command-head"><div><span class="eyebrow">RIVAL MAIS QUENTE</span><h2>${escapeHTML(hot?.name || 'Mercado aberto')}</h2><p>${escapeHTML(hotCopy)}</p></div>${hot ? fighterAvatar(hot, 'profile-portrait') : ''}</div><div class="rival-heat"><span style="width:${hot?.heat || 0}%"></span></div><div class="rival-command-footer"><span>CALOR ${hot?.heat || 0}%</span><span>${hotSignal}</span></div></article><article class="card world-rivals"><div class="card-title"><span>Quadro de rivalidades</span><small>efeito em audiência e mídia</small></div>${rivalsMarkup}</article></aside></section></section>`;
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
    if (fight.status === 'active') return `Round ${fight.round} de ${fight.maxRounds} · transmissão em andamento`;
    if (fight.status === 'interval') return `Intervalo antes do round ${fight.round} · o corner pode mudar o plano`;
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
  function clearFightAutomation() {
    if (fightAutomationTimer !== null && typeof window.clearInterval === 'function') window.clearInterval(fightAutomationTimer);
    fightAutomationTimer = null;
  }
  function beginFightAutomation() {
    if (fightAutomationTimer !== null || typeof window.setInterval !== 'function') return;
    fightAutomationTimer = window.setInterval(() => autoFightTick(), 1200);
  }
  function syncFightAutomation() {
    if (state.fight?.status === 'active') beginFightAutomation();
    else clearFightAutomation();
  }
  function fightRoundScore(fight) {
    if (fight.roundScores.some((entry) => entry.round === fight.round)) return;
    const swing = fight.momentum + (fight.playerHealth - fight.opponentHealth) * .42 + (fight.playerStamina - fight.opponentStamina) * .18;
    const player = 10;
    const opponent = swing > 20 ? 8 : 9;
    fight.roundScores.push({ round: fight.round, player: swing >= 0 ? player : opponent, opponent: swing >= 0 ? opponent : player });
  }
  function buildScorecards(fight) {
    const rounds = [...fight.roundScores];
    while (rounds.length < fight.maxRounds) rounds.push({ round: rounds.length + 1, player: 10, opponent: 9 });
    return [0, 1, 2].map((judge) => {
      const modifier = judge === 1 ? 1 : judge === 2 ? -1 : 0;
      const player = rounds.reduce((total, score) => total + Math.max(8, Math.min(10, score.player + (modifier && score.player !== score.opponent ? modifier : 0))), 0);
      const opponent = rounds.reduce((total, score) => total + Math.max(8, Math.min(10, score.opponent - (modifier && score.player !== score.opponent ? modifier : 0))), 0);
      return { judge: judge + 1, player, opponent };
    });
  }
  function fightStrategyOptions(fight) {
    return `<div class="corner-strategy-grid">${Object.entries(fightTactics).map(([key, tactic]) => `<button class="corner-strategy ${fight.cornerStrategy === key ? 'selected' : ''}" data-action="set-fight-strategy" data-tactic="${key}"><span>${tactic.icon}</span><strong>${tactic.label}</strong><small>${tactic.copy}</small></button>`).join('')}</div>`;
  }
  function premiumFightArena(fight, fighter, opponent) {
    const advantage = Math.max(-24, Math.min(24, fight.momentum * .18));
    const announcement = fight.status === 'interval' ? `FIM DO ROUND ${Math.max(1, fight.round - 1)}` : fight.status === 'active' ? `ROUND ${fight.round}` : fight.status === 'complete' ? (fight.result?.won ? 'VITÓRIA VALE' : 'RESULTADO OFICIAL') : 'FIGHT NIGHT';
    const liveNote = fight.status === 'active' ? `SIMULAÇÃO AO VIVO · TROCA ${Math.min(fight.exchangesPerRound, (fight.exchanges % fight.exchangesPerRound) + 1)} DE ${fight.exchangesPerRound}` : fight.status === 'interval' ? 'INTERVALO · O CORNER PODE AJUSTAR A ESTRATÉGIA' : 'ARENA PRONTA PARA O SINO';
    return `<section class="premium-fight-arena ${fight.status}" style="--player-x:${28 + advantage}%;--opponent-x:${72 + advantage}%"><div class="fight-broadcast-bar"><span>VALE GLOBAL FEED</span><strong>${escapeHTML(liveNote)}</strong><span>${fighter.discipline.toUpperCase()}</span></div><div class="round-announcement"><span>${escapeHTML(announcement)}</span><small>${fight.status === 'active' ? 'O combate avança automaticamente' : fight.status === 'interval' ? 'Decisão de corner disponível' : 'Pronto para começar'}</small></div><div class="octagon-topdown"><div class="octagon-grid"></div><div class="fight-token player-token ${fight.status === 'active' ? 'moving' : ''}"><i></i><span>${fighterAvatar(fighter, 'arena-avatar')}</span><b>VALE</b></div><div class="fight-token opponent-token ${fight.status === 'active' ? 'moving' : ''}"><i></i><span>${fighterAvatar(opponent, 'arena-avatar')}</span><b>RIVAL</b></div><div class="fight-clash ${fight.status === 'active' ? 'live' : ''}">✦</div></div><div class="premium-combatant-bars">${fightCombatant(fighter, 'player', fight.playerHealth ?? 100, fight.playerStamina ?? 100)}<div class="fight-center-status"><b>${fight.status === 'active' ? `${fight.round}:00` : fight.status === 'interval' ? 'INTERVALO' : 'PRÉ-LUTA'}</b><span>${fight.momentum > 14 ? 'VALE PRESSIONA' : fight.momentum < -14 ? 'RIVAL PRESSIONA' : 'LUTA EQUILIBRADA'}</span></div>${fightCombatant(opponent, 'opponent', fight.opponentHealth ?? 100, fight.opponentStamina ?? 100)}</div></section>`;
  }
  function fightResultMarkup(fight, fighter, opponent) {
    const winner = fight.result?.won ? fighter : opponent;
    const scorecards = fight.scorecards?.length ? `<div class="scorecard-grid">${fight.scorecards.map((card) => `<div><small>JUIZ ${card.judge}</small><strong class="${card.player > card.opponent ? 'winner-score' : ''}">${card.player}</strong><span>—</span><strong class="${card.opponent > card.player ? 'winner-score' : ''}">${card.opponent}</strong></div>`).join('')}</div>` : `<div class="finish-callout">${escapeHTML(fight.result?.method || 'interrupção')} · round ${fight.result?.round || fight.round}</div>`;
    return `<section class="fight-verdict ${fight.result?.won ? 'won' : 'lost'}"><span class="eyebrow">DECISÃO OFICIAL</span><div class="verdict-winner">${fighterAvatar(winner, 'verdict-avatar')}<div><span>${fight.result?.won ? 'VITÓRIA' : 'DERROTA'}</span><h2>${escapeHTML(winner.name)}</h2><p>${escapeHTML(fight.result?.method || 'decisão dos juízes').toUpperCase()} · ROUND ${fight.result?.round || fight.round}</p></div></div>${scorecards}<p>${escapeHTML(fight.result?.summary || 'O resultado foi aplicado na carreira.')}</p><div class="verdict-actions"><button class="button" data-nav="home">VOLTAR À CENTRAL</button><button class="button secondary" data-nav="rankings">VER RANKINGS</button></div></section>`;
  }
  function fightViewPremium() {
    const fighter = selectedFighter();
    const fight = state.fight || createFightState();
    if (!fighter) return fightView();
    const opponent = fight.opponent || regionalOpponent(fighter);
    const promotedEvent = state.eventPlanner?.activeEvent?.id === fight.eventId ? state.eventPlanner.activeEvent : null;
    const competition = activeCompetition()?.id === fight.competitionId ? activeCompetition() : null;
    const showName = promotedEvent?.name || competition?.name || 'Vale Regional 01';
    const waiting = fight.status === 'preparing' && state.week < fight.readyWeek;
    const idle = !state.fightBooked && fight.status !== 'complete';
    let command = '';
    if (idle) command = `<div class="fight-launch-card"><span class="eyebrow">JANELA DE COMBATE</span><h2>Uma nova<br><span class="text-gold">noite começa.</span></h2><p>Confirme o card para abrir a apresentação automatizada, com rounds, intervalos e resultado oficial.</p><button class="button fight-primary" data-action="book-fight">ACEITAR LUTA</button></div>`;
    else if (waiting) command = `<div class="fight-launch-card"><span class="eyebrow">CAMP EM CURSO</span><h2>O sino chama<br><span class="text-gold">na semana ${fight.readyWeek}.</span></h2><p>O atleta ainda está em preparação. A energia e a condição do camp serão levadas para a arena.</p><button class="button fight-primary" data-action="advance-week">AVANÇAR SEMANA</button></div>`;
    else if (fight.status === 'ready') command = `<div class="fight-launch-card ready"><span class="eyebrow">PRONTO PARA A TRANSMISSÃO</span><h2>O próximo capítulo<br><span class="text-gold">é agora.</span></h2><p>Ao iniciar, a luta avança sozinha. Você escolhe o plano de abertura e volta a intervir somente nos intervalos.</p>${fightStrategyOptions(fight)}<button class="button fight-primary" data-action="start-fight">▶ INICIAR FIGHT NIGHT</button></div>`;
    else if (fight.status === 'active') command = `<div class="fight-live-command"><span class="live-dot"></span><div><span class="eyebrow">COMBATE AO VIVO</span><h2>O round está em andamento.</h2><p>O sistema simula as trocas. A próxima decisão de corner será liberada no intervalo.</p></div><button class="button danger" data-action="throw-towel">JOGAR A TOALHA</button></div>`;
    else if (fight.status === 'interval') command = `<div class="fight-interval-command"><span class="eyebrow">INTERVALO · ROUND ${Math.max(1, fight.round - 1)} ENCERRADO</span><h2>Fale com o<br><span class="text-gold">seu atleta.</span></h2><p>${escapeHTML(fight.intervalNote || 'Recalibre o plano antes do próximo round. A escolha altera a próxima sequência automática.')}</p>${fightStrategyOptions(fight)}<div class="interval-actions"><button class="button fight-primary" data-action="continue-fight">▶ INICIAR ROUND ${fight.round}</button><button class="button danger" data-action="throw-towel">JOGAR A TOALHA</button></div></div>`;
    else command = fightResultMarkup(fight, fighter, opponent);
    return `<section class="content fight-page premium-fight-page"><div class="fight-premium-heading"><div><span class="eyebrow">${escapeHTML(showName)} · ${fighter.discipline} · ${fighter.division}</span><h1>Fight Night<br><span class="text-gold">em transmissão.</span></h1><p>${fightStatusLabel(fight)} O combate é automatizado em tempo real; suas decisões entram como estratégia de corner, não como golpes individuais.</p></div><button class="button secondary" data-nav="world">MAPA MUNDIAL</button></div>${premiumFightArena(fight, fighter, opponent)}<section class="premium-fight-bottom"><article class="card premium-command-card">${command}</article><aside class="card fight-log-card"><div class="card-title"><span>Feed oficial</span><small>${fight.log.length ? `${fight.log.length} momento(s)` : 'aguardando o sino'}</small></div><div class="fight-log">${fight.log.length ? fight.log.slice(0, 7).map((entry) => `<div class="fight-log-entry ${entry.player ? 'player-log' : ''}"><strong>R${entry.round} · ${escapeHTML(entry.title)}</strong><p>${escapeHTML(entry.copy)}</p></div>`).join('') : `<div class="fight-log-entry"><strong>Transmissão pronta</strong><p>Inicie a Fight Night para acompanhar a arena em tempo real.</p></div>`}</div></aside></section><p class="fight-disclaimer">Simulação fictícia de gestão. Estratégias influenciam leitura, energia e risco; nenhuma organização real é representada sem licenciamento.</p></section>`;
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
    return `<section class="content event-page"><div class="page-heading"><div><div class="eyebrow">Produção de eventos · circuito autoral</div><h1>Construa o<br><span class="text-gold">seu show.</span></h1><p class="page-copy">Reserve a arena, escolha a campanha, escale a luta principal e assuma o risco operacional. O resultado entra no caixa somente depois da Fight Night.</p></div><button class="button secondary" data-nav="fight">FIGHT NIGHT</button></div>${activePanel}<section class="event-layout ${locked ? 'is-locked' : ''}"><article class="card event-builder"><div class="card-title"><span>1 · Arena & data</span><small>${locked ? 'produção travada até o show' : 'monte o evento'}</small></div><div class="event-arena-visual"><div><div class="eyebrow">VALE EVENTS</div><h2>${escapeHTML(venue.name)}</h2><p>${escapeHTML(venue.city)} · ${venue.capacity.toLocaleString('pt-BR')} lugares</p></div><span>${venue.badge}</span></div><div class="event-body"><div class="event-section-label">Escolha a praça</div><div class="venue-grid">${eventVenues.map((option) => `<button class="venue-choice ${venue.id === option.id ? 'selected' : ''}" data-action="select-event-venue" data-id="${option.id}" ${locked ? 'disabled' : ''}><strong>${escapeHTML(option.name)}</strong><small>${escapeHTML(option.city)} · ${option.capacity.toLocaleString('pt-BR')} pessoas</small><b>${money(option.rental)}</b></button>`).join('')}</div><div class="event-section-label">Janela de realização</div><div class="date-choice-row">${[2, 3, 4, 5].map((offset) => `<button class="date-choice ${planner.dateOffset === offset ? 'selected' : ''}" data-action="select-event-date" data-offset="${offset}" ${locked ? 'disabled' : ''}><strong>S${state.week + offset}</strong><small>em ${offset} semanas</small></button>`).join('')}</div></div></article><article class="card event-builder"><div class="card-title"><span>2 · Card & promoção</span><small>luta principal jogável</small></div><div class="event-body"><div class="event-section-label">Atleta da luta principal</div>${fighterOptions}<div class="event-section-label">Campanha</div><div class="promotion-grid">${promotionPlans.map((option) => `<button class="promotion-choice ${promotion.id === option.id ? 'selected' : ''}" data-action="select-event-promotion" data-id="${option.id}" ${locked ? 'disabled' : ''}><span>${option.id === 'broadcast' ? '◉' : option.id === 'regional' ? '◈' : '◇'}</span><div><strong>${escapeHTML(option.name)}</strong><small>${escapeHTML(option.copy)}</small></div><b>${money(option.cost)}</b></button>`).join('')}</div><div class="main-event-card">${fighter && opponent ? `<div>${fighterAvatar(fighter, 'portrait')}<strong>${escapeHTML(fighter.name)}</strong><small>${fighterIdentity(fighter)} · ${fighter.record}</small></div><b>VS</b><div>${fighterAvatar(opponent, 'portrait')}<strong>${escapeHTML(opponent.name)}</strong><small>${fighterIdentity(opponent)} · ${opponent.record}</small></div>` : '<span>Selecione um atleta para visualizar a luta principal.</span>'}</div></div></article><aside class="event-sidebar"><article class="card event-projection"><div class="card-title"><span>3 · Projeção</span><small>estimativa transparente</small></div><div class="event-projection-grid"><div><small>PÚBLICO</small><strong>${estimate.attendance.toLocaleString('pt-BR')}</strong><span>de ${venue.capacity.toLocaleString('pt-BR')}</span></div><div><small>BILHETERIA</small><strong>${money(estimate.gate)}</strong><span>${money(venue.ticket)} por ingresso</span></div><div><small>MÍDIA</small><strong>${money(estimate.media)}</strong><span>pacote estimado</span></div><div><small>MARCAS</small><strong>${money(estimate.sponsorBonus)}</strong><span>bônus de parceiros</span></div><div><small>OPERAÇÃO</small><strong class="text-red">${money(estimate.operating)}</strong><span>produção no dia</span></div></div><div class="event-profit"><span>Resultado estimado</span><strong class="${estimate.projected >= 0 ? 'text-green' : 'text-red'}">${estimate.projected >= 0 ? '+' : '−'}${money(Math.abs(estimate.projected))}</strong><small>inclui a bolsa projetada e os parceiros ativos</small></div><button class="button ${fighter && !locked ? '' : 'secondary'}" data-action="plan-event" ${!fighter || locked ? 'disabled' : ''}>CONFIRMAR · ${money(commitCost)}</button><p class="event-disclaimer">A reserva e o marketing são cobrados agora. Bilheteria, mídia, marcas e produção são liquidadas após o combate.</p></article><article class="card event-history"><div class="card-title"><span>Shows concluídos</span><small>${planner.history.length} registro(s)</small></div>${history}</article></aside></section></section>`;
  }
  function chartBars() {
    const incomes = [48, 56, 61, 55, 68, 73, 77, 84];
    const expenses = [22, 25, 29, 27, 34, 31, 38, 36];
    return incomes.map((value, index) => `<div class="bar-set"><span class="bar" style="height:${value}%"></span><span class="bar expense" style="height:${expenses[index]}%"></span><small>S${Math.max(1, state.week - 7 + index)}</small></div>`).join('');
  }
  function financeView() {
    const income = state.ledger.filter((entry) => entry.amount > 0).reduce((sum, entry) => sum + entry.amount, 0);
    const expenses = Math.abs(state.ledger.filter((entry) => entry.amount < 0).reduce((sum, entry) => sum + entry.amount, 0));
    return `<section class="content"><div class="page-heading"><div><div class="eyebrow">Finanças & operação</div><h1>Caixa define<br><span class="text-gold">o alcance.</span></h1><p class="page-copy">Toda decisão deste protótipo gera lançamento no livro-caixa. A receita e os custos persistem no save local.</p></div><button class="button secondary" data-action="advance-week">FECHAR SEMANA</button></div><section class="stat-grid">${statCard('Saldo atual', money(state.cash), 'liquidez disponível', 'var(--green)')}${statCard('Entradas totais', money(income), 'capital e receitas', 'var(--gold-bright)')}${statCard('Saídas totais', money(expenses), 'estrutura e operação', '#ff6870')}${statCard('Projeção semanal', money(-(state.fighters.reduce((sum, fighter) => sum + fighter.salary, 0) + state.staff * 1800 + staffPayroll() + 4500) + activeSponsors().reduce((sum, contract) => sum + (sponsorById(contract.sponsorId)?.weekly || 0), 0)), `${state.staff} base · ${hiredStaff().length} especialista(s) · ${activeSponsors().length} marca(s)`, 'var(--white)')}</section><section class="finance-grid"><article class="card"><div class="card-title"><span>Fluxo da operação</span><small>histórico ilustrativo + operações reais</small></div><div class="chart">${chartBars()}</div><div class="card-title"><span>Livro-caixa</span><small>${state.ledger.length} lançamentos</small></div><div class="ledger">${state.ledger.map((entry) => `<div class="ledger-row"><div><strong>${escapeHTML(entry.title)}</strong><small>${escapeHTML(entry.category)} · ${entry.week}</small></div><strong class="${entry.amount >= 0 ? 'text-green' : 'text-red'}">${entry.amount >= 0 ? '+' : '−'}${money(Math.abs(entry.amount))}</strong></div>`).join('')}</div></article><aside class="card insight"><div class="card-title"><span>Composição</span><small>nesta carreira</small></div><div class="ring"><strong>42%<small>capital</small></strong></div><div class="breakdown"><div class="breakdown-row"><span>Investimento inicial</span><strong>42%</strong></div><div class="breakdown-row"><span>Operação e contratos</span><strong>34%</strong></div><div class="breakdown-row"><span>Reserva de expansão</span><strong>24%</strong></div></div><div class="section-body" style="padding:20px 0 0"><p class="text-muted">A regra de ouro do Vale: não há recursos infinitos. Crescimento exige manter o caixa positivo.</p></div></aside></section></section>`;
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
    if (state.view === 'fight') view = fightViewPremium();
    if (state.view === 'rankings') view = rankingsView();
    if (state.view === 'academy') view = academyView();
    if (state.view === 'training') view = trainingView();
    if (state.view === 'scouting') view = scoutingView();
    if (state.view === 'staff') view = staffView();
    if (state.view === 'sponsors') view = sponsorshipView();
    if (state.view === 'competitions') view = competitionView();
    if (state.view === 'world') view = worldView();
    if (state.view === 'saves') view = savesView();
    if (state.view === 'finance') view = financeView();
    app.innerHTML = shell(view);
    bindEvents();
    syncFightAutomation();
  }
  function setDraftFromInputs() {
    document.querySelectorAll('[data-draft]').forEach((input) => { state.draft[input.dataset.draft] = input.value.trim(); });
  }
  function startCareer() {
    setDraftFromInputs();
    if (!state.draft.managerName || !state.draft.academyName) { toast('Preencha seu nome e o nome da academia antes de começar.'); state.onboardingStep = 1; render(); return; }
    const profile = difficultyProfiles[state.draft.difficulty];
    const starter = { ...starterFighters[state.draft.focus] };
    ensureDevelopment(starter);
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
    state.trainingCamp = { ...createTrainingCampState(), fighterId: starter.id };
    state.scouting = createScoutingState();
    state.staffCenter = createStaffCenterState();
    state.sponsorship = createSponsorshipState();
    state.competitions = createCompetitionState();
    state.ledger = [{ title: 'Capital de abertura', category: 'Início de carreira', amount: state.cash, week: 'S1', kind: 'income' }, { title: 'Licenças e abertura', category: 'Operação', amount: -18000, week: 'S1', kind: 'expense' }];
    state.cash -= 18000;
    state.complete = true;
    addMessage(`${starter.name} assinou como o primeiro atleta de ${state.draft.academyName}.`);
    persist(); render(); toast('Carreira criada. Seu primeiro atleta já está no elenco.');
  }
  function beginNegotiation(id) {
    const prospect = prospectById(id);
    if (!prospect || state.signedIds.includes(id)) return;
    if (scoutingCenter().reports[id]?.status !== 'complete') {
      state.scouting.selectedProspectId = id;
      state.view = 'scouting';
      persist(); render(); toast('Solicite e conclua o dossiê de prospecção antes de negociar.');
      return;
    }
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
    ensureDevelopment(fighter);
    state.fighters.push(fighter); state.signedIds.push(id); state.selectedFighterId = id;
    state.scouting.shortlist = scoutingCenter().shortlist.filter((candidate) => candidate !== id);
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
  function reportCost() { return Math.max(1200, Math.round(2800 - staffBonus('scouting') * 850)); }
  function nextScoutRandom() {
    const scouting = scoutingCenter();
    scouting.seed = (scouting.seed * 1664525 + 1013904223) >>> 0;
    return scouting.seed / 4294967296;
  }
  function requestScoutReport(id) {
    const prospect = prospectById(id);
    const scouting = scoutingCenter();
    if (!prospect || state.signedIds.includes(id) || scouting.reports[id]?.status === 'pending' || scouting.reports[id]?.status === 'complete') return;
    const cost = reportCost();
    if (state.cash < cost) { toast('Caixa insuficiente para enviar a equipe de prospecção.'); return; }
    state.cash -= cost;
    scouting.reports[id] = { status: 'pending', requestedWeek: state.week, dueWeek: state.week + scoutTurnaround(), cost };
    addLedger(`Prospecção: ${prospect.name}`, 'Relatório de atleta', -cost, 'expense');
    addMessage(`A equipe de prospecção iniciou o dossiê de ${prospect.name}. Entrega prevista para a Semana ${scouting.reports[id].dueWeek}.`);
    persist(); render(); toast('Relatório solicitado. A apuração será resolvida ao avançar a semana.');
  }
  function resolveScoutReports() {
    const scouting = scoutingCenter();
    Object.entries(scouting.reports).forEach(([id, report]) => {
      if (report.status !== 'pending' || report.dueWeek > state.week) return;
      const prospect = prospectById(id);
      if (!prospect) return;
      const baseline = baseDevelopment(prospect).attributes;
      const attributes = Object.fromEntries(Object.entries(baseline).map(([key, value]) => [key, Math.max(35, Math.min(96, Math.round(value + (nextScoutRandom() - .5) * 6)))]));
      const riskPool = ['baixo', 'moderado', 'monitorar carga'];
      const disciplinePool = ['muito alta', 'consistente', 'oscilante'];
      const strengths = Object.entries(attributes).sort(([, a], [, b]) => b - a).slice(0, 2).map(([key]) => campAttributeLabels[key].toLowerCase()).join(' e ');
      scouting.reports[id] = { ...report, status: 'complete', completedWeek: state.week, attributes, risk: riskPool[Math.floor(nextScoutRandom() * riskPool.length)], discipline: disciplinePool[Math.floor(nextScoutRandom() * disciplinePool.length)], summary: `Melhores sinais em ${strengths}. Potencial ${prospect.potential} confirmado pela equipe.` };
      scouting.history.unshift({ name: prospect.name, copy: 'Dossiê de scouting concluído', week: state.week });
      scouting.history = scouting.history.slice(0, 8);
      addMessage(`Dossiê concluído: ${prospect.name} teve atributos, risco e potencial revelados.`);
    });
  }
  function selectScoutProspect(id) {
    if (!prospectById(id)) return;
    state.scouting.selectedProspectId = id;
    persist(); render();
  }
  function filterScouting(filter) {
    if (!['todos', 'mma', 'boxe'].includes(filter)) return;
    state.scouting.filter = filter;
    persist(); render();
  }
  function toggleShortlist(id) {
    const scouting = scoutingCenter();
    if (!prospectById(id) || state.signedIds.includes(id)) return;
    scouting.shortlist = scouting.shortlist.includes(id) ? scouting.shortlist.filter((candidate) => candidate !== id) : [...scouting.shortlist, id];
    persist(); render();
  }
  function scoutNegotiate(id) {
    if (scoutingCenter().reports[id]?.status !== 'complete') { toast('Finalize o dossiê antes de abrir uma negociação.'); return; }
    beginNegotiation(id);
  }
  function hireStaff(id) {
    const member = staffById(id);
    const center = staffCenter();
    if (!member || center.hiredIds.includes(id)) return;
    const capacity = state.staff + state.academyLevel + 2;
    if (center.hiredIds.length >= capacity) { toast('Capacidade da equipe atingida. Evolua a academia ou reorganize o núcleo.'); return; }
    const entryCost = member.signing + member.salary;
    if (state.cash < entryCost) { toast('Caixa insuficiente para contratação e primeira semana do especialista.'); return; }
    state.cash -= entryCost;
    center.hiredIds.push(id);
    center.history.unshift({ name: member.name, copy: `${member.role} contratado(a)`, week: state.week });
    center.history = center.history.slice(0, 8);
    addLedger(`Contratação: ${member.name}`, 'Equipe técnica', -member.signing, 'expense');
    addLedger(`Folha inicial: ${member.name}`, 'Equipe técnica', -member.salary, 'expense');
    addMessage(`${member.name} entrou na equipe como ${member.role.toLowerCase()}. Os bônus passam a valer no próximo ciclo.`);
    persist(); render(); toast('Especialista contratado e integrado à operação.');
  }
  function acceptSponsor(id) {
    const sponsor = sponsorById(id);
    const sponsorship = sponsorshipCenter();
    if (!sponsor || activeSponsors().some((contract) => contract.sponsorId === id)) return;
    if (activeSponsors().length >= 2) { toast('Limite de dois parceiros ativos atingido. Aguarde o fim de um contrato.'); return; }
    if (!sponsorEligible(sponsor)) { toast('A marca exige mais reputação ou fãs antes de assinar.'); return; }
    const contract = { sponsorId: id, status: 'ativo', signedWeek: state.week, remainingWeeks: sponsor.duration };
    sponsorship.active.push(contract);
    sponsorship.history.unshift({ name: sponsor.name, copy: `Contrato assinado por ${sponsor.duration} semanas`, week: state.week });
    sponsorship.history = sponsorship.history.slice(0, 8);
    state.cash += sponsor.upfront;
    state.fans += Math.round(sponsor.upfront / 120);
    addLedger(`Assinatura: ${sponsor.name}`, 'Patrocínio da academia', sponsor.upfront, 'income');
    addMessage(`${sponsor.name} assinou parceria com a academia. A receita semanal e o bônus de evento foram ativados.`);
    persist(); render(); toast('Patrocínio assinado. Entrada registrada no caixa.');
  }
  function settleSponsorWeek() {
    const sponsorship = sponsorshipCenter();
    activeSponsors().forEach((contract) => {
      const sponsor = sponsorById(contract.sponsorId);
      if (!sponsor) return;
      state.cash += sponsor.weekly;
      addLedger(`Parceria semanal: ${sponsor.name}`, 'Patrocínio da academia', sponsor.weekly, 'income');
      contract.remainingWeeks = Math.max(0, contract.remainingWeeks - 1);
      if (contract.remainingWeeks === 0) {
        contract.status = 'encerrado';
        sponsorship.history.unshift({ name: sponsor.name, copy: 'Contrato encerrado no prazo', week: state.week });
        sponsorship.history = sponsorship.history.slice(0, 8);
        addMessage(`O contrato de ${sponsor.name} foi concluído. A vaga de parceiro está livre novamente.`);
      }
    });
  }
  function acceptCompetition(id) {
    const competition = competitionById(id);
    const fighter = selectedFighter();
    const center = competitionCenter();
    if (!competition || !fighter) { toast('Selecione um atleta contratado antes de analisar convites.'); return; }
    const eligibility = competitionEligibility(competition, fighter);
    if (!eligibility.eligible) { toast('Esse convite ainda exige requisitos de atleta, reputação, ranking ou agenda.'); return; }
    if (state.cash < competition.entryFee) { toast('Caixa insuficiente para formalizar a inscrição nesta competição.'); return; }
    const opponent = competitionOpponent(fighter, competition);
    const active = { id: `competition-${competition.id}-${state.week}`, offerId: competition.id, ...competition, fighterId: fighter.id, fighterName: fighter.name, opponent, week: state.week + competition.delay, status: 'registered', acceptedWeek: state.week };
    state.cash -= competition.entryFee;
    center.selectedOfferId = id;
    center.active = active;
    center.history.unshift({ name: competition.name, copy: `Inscrição confirmada para a Semana ${active.week}`, week: state.week });
    center.history = center.history.slice(0, 8);
    addLedger(`Inscrição: ${competition.name}`, 'Competição e elegibilidade', -competition.entryFee, 'expense');
    addMessage(`${fighter.name} aceitou o convite para ${competition.name}. O adversário será ${opponent.name} na Semana ${active.week}.`);
    persist(); render(); toast('Convite aceito. A vaga está reservada e o camp foi priorizado.');
  }
  function resolveCompetitionReady() {
    const competition = activeCompetition();
    if (!competition || competition.status !== 'registered' || state.week < competition.week) return false;
    const fighter = state.fighters.find((candidate) => candidate.id === competition.fighterId);
    if (!fighter) return false;
    competition.status = 'ready';
    state.selectedFighterId = fighter.id;
    state.fightBooked = true;
    state.fight = { ...createFightState(), status: 'ready', readyWeek: state.week, competitionId: competition.id, opponent: competition.opponent, playerStamina: Math.min(100, (fighter.conditioning || 70) + 15) };
    addMessage(`${competition.name} está pronto. ${fighter.name} encara ${competition.opponent.name} por uma bolsa de ${money(competition.prize)} e ${competition.pointsGain} pontos.`);
    toast('Convite competitivo liberado. A Fight Night está pronta.');
    return true;
  }
  function resolveWorldMessage(id, choice) {
    const message = (state.world.inbox || []).find((entry) => entry.id === id);
    const outcome = message?.choices?.[choice];
    if (!message || message.status === 'resolved' || !outcome) return;
    state.cash += outcome.cash || 0;
    state.fans = Math.max(0, state.fans + (outcome.fans || 0));
    state.reputation = Math.max(0, state.reputation + (outcome.reputation || 0));
    const fighter = selectedFighter();
    if (fighter && outcome.morale) fighter.morale = Math.max(40, Math.min(100, (fighter.morale || 70) + outcome.morale));
    const rival = openRivalries().find((entry) => entry.id === message.rivalId) || hottestRivalry(fighter);
    if (rival && outcome.rivalry) rival.heat = Math.max(0, Math.min(100, rival.heat + outcome.rivalry));
    if (outcome.cash) addLedger(`Decisão: ${message.sender}`, 'Inteligência de mercado', outcome.cash, 'income');
    message.status = 'resolved';
    message.decisionLabel = outcome.label;
    message.decisionCopy = outcome.copy;
    addMessage(`${message.sender}: ${outcome.copy}`);
    persist(); render(); toast('Decisão registrada. O mundo reagirá a este posicionamento.');
  }
  function settleCompetitionResult(competition, won, fighter, method) {
    const center = competitionCenter();
    if (!competition || competition.status === 'complete') return;
    competition.status = 'complete';
    competition.result = won ? 'vitória na Fight Night' : 'participação encerrada';
    competition.completedWeek = state.week;
    center.completed.unshift({ offerId: competition.offerId, name: competition.name, result: won ? `Vitória por ${method}` : `Derrota por ${method}`, week: state.week });
    center.completed = center.completed.slice(0, 8);
    center.history.unshift({ name: competition.name, copy: won ? 'Campanha concluída com vitória' : 'Campanha concluída com aprendizado', week: state.week });
    center.history = center.history.slice(0, 8);
    const rival = openRivalries().find((entry) => entry.id === competition.opponent.id);
    if (rival) rival.heat = Math.max(0, Math.min(100, rival.heat + (won ? 18 : 12)));
    addMessage(`${competition.name}: ${fighter.name} ${won ? 'transformou o convite em vitória' : 'encerrou a participação'} e deixou uma nova marca no circuito.`);
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
    if (activeCompetition()) { toast('A academia já possui uma competição confirmada. Conclua a campanha antes de produzir outro show.'); return; }
    if (state.fightBooked && state.fight.status !== 'complete') { toast('Finalize a luta já agendada antes de promover um novo show.'); return; }
    const fighter = eventFighter();
    if (!fighter) { toast('Você precisa de um atleta ativo para confirmar uma luta principal.'); return; }
    if (!fighterCanCompete(fighter)) { toast(`${fighter.name} está em recuperação. Aguarde a liberação médica antes de confirmar o show.`); return; }
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
    const sponsorBonus = sponsorEventBonus();
    const profit = event.gate + event.media + sponsorBonus - event.operating;
    state.cash += event.gate + event.media + sponsorBonus - event.operating;
    state.fans += Math.round(event.attendance * .08) + (won ? 180 : 70);
    state.reputation += won ? 4 : 1;
    event.status = 'complete';
    event.profit = profit;
    event.result = won ? 'luta principal vencida' : 'luta principal perdida';
    state.eventPlanner.history.unshift({ ...event });
    state.eventPlanner.history = state.eventPlanner.history.slice(0, 6);
    addLedger(`Bilheteria: ${event.name}`, `${event.attendance.toLocaleString('pt-BR')} presentes`, event.gate, 'income');
    addLedger(`Mídia: ${event.promotionName}`, 'Direitos locais simulados', event.media, 'income');
    if (sponsorBonus) addLedger('Ativação de marcas', `${activeSponsors().length} parceiro(s) no evento`, sponsorBonus, 'income');
    addLedger(`Produção: ${event.name}`, 'Equipe, arbitragem e operação', -event.operating, 'expense');
    addMessage(`${event.name} encerrou com ${event.attendance.toLocaleString('pt-BR')} presentes e ${profit >= 0 ? 'resultado positivo' : 'resultado negativo'} de ${money(Math.abs(profit))}.`);
  }
  function selectCampFighter(id) {
    const fighter = state.fighters.find((candidate) => candidate.id === id);
    if (!fighter) return;
    state.trainingCamp.fighterId = fighter.id;
    state.selectedFighterId = fighter.id;
    ensureDevelopment(fighter);
    persist(); render();
  }
  function selectCampFocus(focus) {
    if (!campFocuses[focus]) return;
    state.trainingCamp.focus = focus;
    persist(); render();
  }
  function cycleCampSession(day) {
    const camp = trainingCamp();
    if (!Number.isInteger(day) || day < 0 || day >= camp.weeklyPlan.length) return;
    const keys = Object.keys(campSessions);
    const index = Math.max(0, keys.indexOf(camp.weeklyPlan[day]));
    camp.weeklyPlan[day] = keys[(index + 1) % keys.length];
    persist(); render();
  }
  function applyTrainingWeek() {
    const camp = trainingCamp();
    const fighter = campFighter();
    if (!fighter) return null;
    camp.fighterId = fighter.id;
    const development = ensureDevelopment(fighter);
    if (development.injury) {
      development.injury.weeks -= 1;
      fighter.conditioning = Math.min(100, (fighter.conditioning || 65) + 5 + state.facilities.recovery * 2 + Math.round(staffBonus('recovery')));
      fighter.morale = Math.min(100, (fighter.morale || 65) + 1);
      development.fatigue = Math.max(0, development.fatigue - 17 - state.facilities.recovery * 3 - Math.round(staffBonus('recovery') * 2));
      const cleared = development.injury.weeks <= 0;
      const label = development.injury.label;
      if (cleared) development.injury = null;
      camp.lastReport = { week: state.week, title: cleared ? 'Atleta liberado pelo departamento médico' : 'Recuperação em andamento', copy: cleared ? `${fighter.name} voltou a ficar disponível para lutar após ${label.toLowerCase()}.` : `${fighter.name} segue em recuperação por ${label.toLowerCase()}.`, injured: !cleared };
      camp.history.unshift({ ...camp.lastReport }); camp.history = camp.history.slice(0, 5);
      addMessage(camp.lastReport.copy);
      return camp.lastReport;
    }
    const plan = camp.weeklyPlan.map((key) => campSessions[key] ? key : 'rest');
    const gains = { striking: 0, grappling: 0, cardio: 0, defense: 0, fightIQ: 0 };
    let fatigueDelta = 0;
    let moraleDelta = 0;
    let campDelta = 0;
    let sparringDays = 0;
    plan.forEach((key) => {
      const session = campSessions[key];
      const facilityLevel = session.facility ? (state.facilities[session.facility] || 0) : 0;
      const multiplier = 1 + Math.max(0, facilityLevel - 1) * .18;
      Object.entries(session.gains).forEach(([attribute, gain]) => { gains[attribute] += gain * multiplier * (1 + staffBonus(attribute) * .08); });
      fatigueDelta += session.fatigue;
      moraleDelta += session.morale || 0;
      campDelta += session.camp;
      if (key === 'sparring') sparringDays += 1;
    });
    const focus = campFocuses[camp.focus] || campFocuses.striking;
    gains[focus.attribute] += (1 + Math.max(0, state.academyLevel - 1) * .3) * (1 + staffBonus(focus.attribute) * .08);
    Object.entries(gains).forEach(([attribute, gain]) => {
      development.attributes[attribute] = Math.min(99, Math.round((development.attributes[attribute] + gain) * 10) / 10);
    });
    development.totalSessions += plan.length;
    development.fatigue = Math.max(0, Math.min(100, Math.round(development.fatigue + fatigueDelta - state.facilities.recovery * 2 - staffBonus('recovery') * 2)));
    fighter.camp = Math.min(100, (fighter.camp || 20) + campDelta);
    fighter.conditioning = Math.max(45, Math.min(100, (fighter.conditioning || 70) + Math.round(gains.cardio * .7) - Math.round(Math.max(0, fatigueDelta) * .09)));
    fighter.morale = Math.max(40, Math.min(100, (fighter.morale || 70) + moraleDelta + (development.fatigue < 35 ? 1 : 0)));
    const injuryRisk = Math.max(2, Math.min(36, Math.round(4 + development.fatigue * .22 + sparringDays * 5 - state.facilities.recovery * 3 - staffBonus('recovery') * 3)));
    const activeEventStatus = state.eventPlanner?.activeEvent?.status;
    const protectedFightWindow = state.fightBooked || Boolean(activeCompetition()) || ['planned', 'ready', 'live'].includes(activeEventStatus);
    const injured = !protectedFightWindow && development.fatigue >= 62 && nextCampRandom() * 100 < injuryRisk;
    const growth = Object.entries(gains).filter(([, gain]) => gain > 0).map(([attribute, gain]) => `+${Math.round(gain)} ${campAttributeLabels[attribute]}`).join(' · ');
    if (injured) {
      const weeks = nextCampRandom() > .67 ? 2 : 1;
      const label = development.fatigue >= 82 ? 'sobrecarga muscular' : 'distensão leve';
      development.injury = { label, weeks };
      fighter.conditioning = Math.max(45, fighter.conditioning - 10);
      fighter.morale = Math.max(40, fighter.morale - 3);
      camp.lastReport = { week: state.week, title: 'Carga interrompida pela equipe médica', copy: `${growth}. ${fighter.name} sofreu ${label} e ficará fora por ${weeks} semana${weeks === 1 ? '' : 's'}.`, injured: true };
    } else {
      camp.lastReport = { week: state.week, title: protectedFightWindow ? 'Camp concluído com carga controlada' : 'Camp concluído com evolução registrada', copy: `${growth}. Fadiga em ${development.fatigue}/100 e preparo em ${fighter.camp}%.`, injured: false };
    }
    camp.history.unshift({ ...camp.lastReport }); camp.history = camp.history.slice(0, 5);
    addMessage(camp.lastReport.copy);
    return camp.lastReport;
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
    if (!fighterCanCompete(fighter)) { toast(`${fighter.name} está em recuperação. A equipe médica ainda não liberou uma nova luta.`); return; }
    if (activeCompetition()) { state.view = 'competitions'; persist(); render(); toast('Existe um convite competitivo em andamento para este ciclo.'); return; }
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
    if (!fighterCanCompete(selectedFighter())) { toast('O atleta ainda está em recuperação e não pode iniciar o combate.'); return; }
    const event = state.eventPlanner?.activeEvent;
    if (event?.id && event.id === state.fight.eventId) event.status = 'live';
    const competition = activeCompetition();
    if (competition?.id && competition.id === state.fight.competitionId) competition.status = 'live';
    state.fight.exchangesPerRound = state.fight.exchangesPerRound || 5;
    state.fight.roundScores = Array.isArray(state.fight.roundScores) ? state.fight.roundScores : [];
    state.fight.cornerStrategy = state.fight.cornerStrategy || 'defensive';
    state.fight.status = 'active';
    state.fight.animationTick = (state.fight.animationTick || 0) + 1;
    state.fight.log.unshift({ round: 1, player: true, title: 'O sino toca', copy: selectedFighter().name + ' entra no centro do octógono. A transmissão começa agora.' });
    persist(); render(); beginFightAutomation(); toast('Round 1 iniciado. O combate avança em tempo real.');
  }

  function setFightStrategy(key) {
    if (!fightTactics[key]) return;
    state.fight.cornerStrategy = key;
    const tactic = fightTactics[key];
    state.fight.log.unshift({ round: state.fight.round, player: true, title: 'Instrução do corner', copy: 'Estratégia definida: ' + tactic.label + '.' });
    persist(); render(); toast(tactic.label + ' preparada para o próximo trecho.');
  }

  function continueFight() {
    if (state.fight.status !== 'interval') return;
    state.fight.status = 'active';
    state.fight.intervalNote = null;
    state.fight.animationTick = (state.fight.animationTick || 0) + 1;
    state.fight.log.unshift({ round: state.fight.round, player: true, title: 'Round ' + state.fight.round, copy: 'O referee reinicia a luta. O corner liberou ' + (fightTactics[state.fight.cornerStrategy]?.label || 'a estratégia') + '.' });
    persist(); render(); beginFightAutomation();
  }

  function throwTowel() {
    const fight = state.fight;
    if (!['active', 'interval'].includes(fight.status)) return;
    fight.log.unshift({ round: fight.round, player: false, title: 'Toalha jogada', copy: 'O corner encerra o combate para preservar o atleta.' });
    finishFight(false, 'interrupção do corner');
    persist(); render(); toast('A luta foi encerrada por interrupção do corner.');
  }

  function autoFightTick() {
    const fight = state.fight;
    const fighter = selectedFighter();
    if (!fighter || fight.status !== 'active') { clearFightAutomation(); return; }
    const tactic = fightTactics[fight.cornerStrategy] || fightTactics.defensive;
    const rivalKey = opponentTactic(fight);
    const rivalTactic = fightTactics[rivalKey];
    const disciplineBonus = fighter.discipline === 'MMA' ? 1.06 : 0.96;
    const playerPower = effectiveCombatRating(fighter) * tactic.offense * disciplineBonus * (0.91 + nextFightRandom() * 0.22);
    const rivalPower = fight.opponent.rating * rivalTactic.offense * (0.91 + nextFightRandom() * 0.22);
    const playerWins = playerPower + fight.momentum * 0.16 >= rivalPower;
    const healthLoss = Math.round((playerWins ? rivalPower * 0.14 : playerPower * 0.16) * (0.88 + nextFightRandom() * 0.28));
    const staminaLoss = Math.round((playerWins ? tactic.stamina : rivalTactic.stamina) * (0.92 + nextFightRandom() * 0.22));
    if (playerWins) {
      fight.opponentHealth = clamp(fight.opponentHealth - healthLoss, 0, 100);
      fight.opponentStamina = clamp(fight.opponentStamina - staminaLoss, 0, 100);
      fight.momentum = clamp(fight.momentum + 8, -100, 100);
    } else {
      fight.playerHealth = clamp(fight.playerHealth - healthLoss, 0, 100);
      fight.playerStamina = clamp(fight.playerStamina - staminaLoss, 0, 100);
      fight.momentum = clamp(fight.momentum - 8, -100, 100);
    }
    fight.exchanges += 1;
    fight.animationTick = (fight.animationTick || 0) + 1;
    fight.lastAction = playerWins ? tactic.label : rivalTactic.label;
    fight.log.unshift({
      round: fight.round,
      player: playerWins,
      title: tactic.label + ' × ' + rivalTactic.label,
      copy: playerWins ? fighter.name + ' encontra espaço e assume o centro do cage.' : fight.opponent.name + ' responde e muda o ritmo do duelo.'
    });
    if (fight.playerHealth <= 0 || fight.opponentHealth <= 0) {
      const playerWon = fight.opponentHealth <= 0;
      const finish = (fight.cornerStrategy === 'takedown' || fight.cornerStrategy === 'clinch') && nextFightRandom() > 0.62 ? 'finalização' : 'nocaute técnico';
      finishFight(playerWon, finish);
    } else if (fight.exchanges % fight.exchangesPerRound === 0) {
      const finishedRound = fight.round;
      fightRoundScore(fight);
      if (finishedRound >= fight.maxRounds) {
        fight.scorecards = buildScorecards(fight);
        const playerCards = fight.scorecards.filter((card) => card.player > card.opponent).length;
        finishFight(playerCards >= 2, 'decisão dos juízes');
      } else {
        fight.round += 1;
        fight.status = 'interval';
        fight.intervalNote = fight.momentum >= 0 ? 'Boa leitura do seu atleta. Ajuste o plano para o próximo round.' : 'O rival cresceu no round. O corner precisa responder.';
        fight.log.unshift({ round: finishedRound, player: fight.momentum >= 0, title: 'Fim do round ' + finishedRound, copy: fight.intervalNote });
        clearFightAutomation();
      }
    }
    persist(); render();
  }
  function tacticDamage(base, modifier, stamina, random) {
    return Math.max(1, Math.round((base * modifier * (.76 + random * .52)) * (.65 + Math.max(0, stamina) / 285)));
  }
  function finishFight(won, method) {
    const fight = state.fight;
    clearFightAutomation();
    const fighter = selectedFighter();
    const promotedEvent = state.eventPlanner?.activeEvent?.id === fight.eventId ? state.eventPlanner.activeEvent : null;
    const competition = activeCompetition()?.id === fight.competitionId ? activeCompetition() : null;
    const eventLabel = promotedEvent ? promotedEvent.name : competition ? competition.name : 'Vale Regional 01';
    const reward = promotedEvent ? promotedEvent.purse : competition ? competition.prize : 62000 + state.reputation * 750;
    const participation = competition ? competition.participation : Math.round(reward * .28);
    const reputationGain = competition ? competition.reputationGain : 7;
    const fansGain = competition ? competition.fansGain : 340;
    const pointsGain = competition ? competition.pointsGain : 110;
    fight.status = 'complete';
    state.fightBooked = false;
    fighter.conditioning = Math.max(46, Math.min(100, (fighter.conditioning || 70) - (won ? 13 : 19)));
    fighter.camp = 14;
    if (won) {
      const previousRank = state.world.playerRanking.position;
      fighter.record = incrementWin(fighter.record);
      state.cash += reward; state.reputation += reputationGain; state.fans += fansGain; state.world.playerRanking.points += pointsGain;
      const rank = refreshPlayerRanking();
      addLedger(`Bolsa: ${fighter.name}`, eventLabel, reward, 'income');
      addMessage(`${fighter.name} venceu ${fight.opponent.name} por ${method}. A carreira recebeu +${pointsGain} pontos de ranking.`);
      if (!previousRank && rank?.position) addMessage(`${fighter.name} entrou no ranking simulado em #${rank.position} após a vitória no card regional.`);
      fight.result = { won: true, method, summary: `Bolsa de ${money(reward)}, +${reputationGain} reputação, +${fansGain} fãs e +${pointsGain} pontos de ranking.` };
      toast(`Vitória por ${method}! A carreira avançou.`);
    } else {
      fighter.record = incrementLoss(fighter.record);
      state.reputation = Math.max(0, state.reputation - (competition ? 1 : 2)); state.fans = Math.max(0, state.fans - (competition ? 25 : 45));
      addLedger(`Bolsa de participação: ${fighter.name}`, eventLabel, participation, 'income');
      state.cash += participation;
      addMessage(`${fighter.name} perdeu para ${fight.opponent.name} por ${method}. A equipe volta ao camp com dados para evoluir.`);
      fight.result = { won: false, method, summary: `Bolsa de participação de ${money(participation)}; reputação reduzida e aprendizado registrado para o próximo camp.` };
      toast(`Resultado por ${method}. A trajetória continua.`);
    }
    if (promotedEvent) {
      settlePromotedEvent(promotedEvent, won);
      fight.result.summary += ` ${promotedEvent.name} foi liquidado no caixa com bilheteria, mídia e produção.`;
    }
    if (competition) {
      settleCompetitionResult(competition, won, fighter, method);
      fight.result.summary += ` ${competition.name} foi registrado no passaporte competitivo.`;
    }
    if (fight.result) fight.result.round = fight.round;
  }
  function executeTactic(key) {
    const fight = state.fight;
    const fighter = selectedFighter();
    if (!fighter || fight.status !== 'active' || !fightTactics[key]) return;
    const tactic = fightTactics[key];
    const rivalKey = opponentTactic(fight);
    const rival = fightTactics[rivalKey];
    const disciplineBonus = fighter.discipline === 'MMA' && (key === 'clinch' || key === 'takedown') ? 1.15 : fighter.discipline === 'Boxe' && (key === 'counter' || key === 'aggressive') ? 1.12 : 1;
    const playerPower = effectiveCombatRating(fighter, key) / 9;
    const opponentPower = effectiveCombatRating(fight.opponent, rivalKey) / 9;
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
    const specialistPayroll = staffPayroll();
    const payroll = state.fighters.reduce((sum, fighter) => sum + fighter.salary, 0) + state.staff * 1800 + specialistPayroll + 4500;
    state.cash -= payroll; state.week += 1; state.date = `Semana ${state.week} · 2026`;
    simulateWorldCycle();
    resolveScoutReports();
    settleSponsorWeek();
    state.contracts.forEach((contract) => { if (contract.status === 'ativo') contract.remainingWeeks = Math.max(0, (contract.remainingWeeks ?? contract.duration * 52) - 1); });
    const plannedShow = state.eventPlanner?.activeEvent?.status === 'planned' || activeCompetition()?.status === 'registered';
    const report = applyTrainingWeek();
    const campFighterId = campFighter()?.id;
    state.fighters.filter((fighter) => fighter.id !== campFighterId).forEach((fighter) => {
      fighter.conditioning = Math.max(50, Math.min(100, (fighter.conditioning || 70) + (state.fightBooked || plannedShow ? 2 : -1)));
      fighter.morale = Math.max(45, Math.min(100, (fighter.morale || 70) + 1));
      if (state.fightBooked || plannedShow) fighter.camp = Math.min(100, (fighter.camp || 20) + 7);
    });
    addLedger(specialistPayroll ? 'Folha, especialistas e operação' : 'Folha, manutenção e logística', 'Fechamento semanal', -payroll, 'expense');
    const promotedEvent = state.eventPlanner?.activeEvent;
    const competitionReady = resolveCompetitionReady();
    if (competitionReady) {
      // A notificação e a Fight Night são configuradas pela resolução do convite.
    } else if (promotedEvent?.status === 'planned' && state.week >= promotedEvent.week) {
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
    } else { addMessage(`Semana ${state.week} concluída. Folha e manutenção foram liquidadas.`); toast(report?.injured ? 'Semana avançada: a equipe médica assumiu o caso.' : `Semana ${state.week} avançada. Camp e custos operacionais aplicados.`); }
    persist(); render();
  }
  function incrementWin(record) { const [wins, losses, draws] = record.split('-').map(Number); return `${wins + 1}-${losses}-${draws}`; }
  function incrementLoss(record) { const [wins, losses, draws] = record.split('-').map(Number); return `${wins}-${losses + 1}-${draws}`; }
  function resetCareer() { localStorage.removeItem(STORAGE_KEY); state = makeSeed(); render(); toast('Save local removido. Uma nova carreira pode começar.'); }
  function loadSaveSlots() {
    try {
      const slots = JSON.parse(localStorage.getItem(SAVE_SLOT_STORAGE_KEY));
      return Array.isArray(slots) ? slots : [null, null, null];
    } catch (error) { return [null, null, null]; }
  }
  function saveToSlot(index) {
    const slots = loadSaveSlots();
    slots[index] = {
      savedAt: new Date().toLocaleString('pt-BR'),
      manager: state.draft.managerName || 'Gestor VALE',
      academy: state.draft.academyName || 'Academia VALE',
      week: state.week,
      cash: state.cash,
      data: structuredClone(state)
    };
    localStorage.setItem(SAVE_SLOT_STORAGE_KEY, JSON.stringify(slots));
    persist(); render(); toast('Carreira salva no slot ' + (index + 1) + '.');
  }
  function loadFromSlot(index) {
    const slot = loadSaveSlots()[index];
    if (!slot?.data) { toast('Este slot ainda está vazio.'); return; }
    clearFightAutomation();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slot.data));
    state = loadState();
    state.view = 'saves';
    persist(); render(); toast('Slot ' + (index + 1) + ' carregado.');
  }
  function savesView() {
    const slots = loadSaveSlots();
    return `<section class="content saves-page"><div class="page-heading"><div><div class="eyebrow">Carreira local · fase 13</div><h1>Proteja<br><span class="text-gold">seu legado.</span></h1><p class="page-copy">Três slots locais para guardar momentos decisivos da carreira. O save automático continua ativo neste navegador.</p></div><button class="button secondary" data-nav="home">VOLTAR À CENTRAL</button></div><section class="save-autosave card"><div><span class="eyebrow">AUTOSAVE ATIVO</span><h2>Seu progresso é gravado a cada decisão.</h2><p>Slots manuais servem para preservar bifurcações da carreira antes de uma luta, contratação ou semana importante.</p></div><div class="autosave-status"><span>●</span><strong>ARMAZENAMENTO LOCAL</strong><small>navegador atual</small></div></section><section class="save-slot-grid">${slots.map((slot, index) => `<article class="card save-slot ${slot ? 'occupied' : 'empty'}"><div class="save-slot-top"><span>SLOT 0${index + 1}</span><b>${slot ? 'REGISTRADO' : 'DISPONÍVEL'}</b></div>${slot ? `<div class="save-slot-body"><h2>${escapeHTML(slot.academy)}</h2><p>${escapeHTML(slot.manager)} · Semana ${slot.week}</p><div><span>CAIXA</span><strong>${money(slot.cash)}</strong></div><small>Último save: ${escapeHTML(slot.savedAt)}</small></div><div class="save-slot-actions"><button class="button secondary" data-action="load-save-slot" data-slot="${index}">CARREGAR</button><button class="button" data-action="save-slot" data-slot="${index}">ATUALIZAR</button></div>` : `<div class="save-slot-empty"><span>◇</span><h2>Novo ponto de retorno</h2><p>Guarde a carreira atual neste espaço.</p><button class="button" data-action="save-slot" data-slot="${index}">SALVAR AQUI</button></div>`}</article>`).join('')}</section></section>`;
  }
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
      if (action === 'filter-scouting') filterScouting(button.dataset.filter);
      if (action === 'select-scout-prospect') selectScoutProspect(button.dataset.id);
      if (action === 'request-scout-report') requestScoutReport(button.dataset.id);
      if (action === 'toggle-shortlist') toggleShortlist(button.dataset.id);
      if (action === 'scout-negotiate') scoutNegotiate(button.dataset.id);
      if (action === 'hire-staff') hireStaff(button.dataset.id);
      if (action === 'accept-sponsor') acceptSponsor(button.dataset.id);
      if (action === 'accept-competition') acceptCompetition(button.dataset.id);
      if (action === 'resolve-world-message') resolveWorldMessage(button.dataset.id, button.dataset.choice);
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
      if (action === 'open-competition-fight') { state.view = 'fight'; persist(); render(); }
      if (action === 'select-fighter') { state.selectedFighterId = button.dataset.id; persist(); if (button.dataset.navAfter) state.view = button.dataset.navAfter; render(); }
      if (action === 'select-camp-fighter') selectCampFighter(button.dataset.id);
      if (action === 'select-camp-focus') selectCampFocus(button.dataset.focus);
      if (action === 'cycle-camp-session') cycleCampSession(Number(button.dataset.day));
      if (action === 'upgrade') upgrade(button.dataset.facility, Number(button.dataset.cost));
      if (action === 'train') train();
      if (action === 'media') media();
      if (action === 'book-fight') bookFight();
      if (action === 'open-fight') { state.view = 'fight'; persist(); render(); }
      if (action === 'start-fight') startFight();
      if (action === 'fight-tactic') executeTactic(button.dataset.tactic);
      if (action === 'set-fight-strategy') setFightStrategy(button.dataset.tactic);
      if (action === 'continue-fight') continueFight();
      if (action === 'throw-towel') throwTowel();
      if (action === 'save-slot') saveToSlot(Number(button.dataset.slot));
      if (action === 'load-save-slot') loadFromSlot(Number(button.dataset.slot));
      if (action === 'watch-event') { state.world.watchedEventId = button.dataset.id; const event = state.world.events.find((entry) => entry.id === button.dataset.id); addMessage(`Você passou a monitorar ${event.name}. Os resultados aparecerão ao avançar a semana.`); persist(); render(); toast(`Agora acompanhando ${event.name}.`); }
      if (action === 'advance-week') advanceWeek();
      if (action === 'reset') openModal('Recomeçar carreira', '<p>Isso apagará o save local deste navegador. Esta ação não afeta o código do projeto nem o repositório.</p>', [{ id: 'cancel', label: 'Cancelar', className: 'secondary', onClick: () => {} }, { id: 'confirm', label: 'Apagar save', className: 'danger', onClick: resetCareer }]);
    }));
    const form = app.querySelector('#onboarding-form'); if (form) form.addEventListener('submit', (event) => { event.preventDefault(); startCareer(); });
  }
  window.ValeFightManager = { reset: () => resetCareer(), getState: () => structuredClone(state) };
  render();
}());
