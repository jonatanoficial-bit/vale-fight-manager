import { access, readFile } from 'node:fs/promises';

const files = ['index.html', 'styles.css', 'app.js', 'manifest.webmanifest', 'assets/vale-fight-manager-logo.png', 'assets/vale-octagon-arena.png', 'assets/fighters/lucas-mendes.png', 'assets/fighters/nina-araujo.png'];
for (const file of files) await access(file);
const source = await readFile('app.js', 'utf8');
const required = ['localStorage', 'startCareer', 'advanceWeek', 'hire(', 'upgrade(', 'bookFight', 'rankingsView', 'simulateWorldCycle', 'createWorldState', 'fightView', 'executeTactic', 'fighterAvatar', 'fighterPortraits', 'countryFlag', 'negotiationView', 'beginNegotiation', 'submitOffer', 'createNegotiationState', 'eventPlannerView', 'planEvent', 'settlePromotedEvent', 'createEventPlannerState', 'trainingView', 'createTrainingCampState', 'applyTrainingWeek', 'effectiveCombatRating', 'ensureDevelopment'];
for (const item of required) if (!source.includes(item)) throw new Error(`Fluxo essencial ausente: ${item}`);
console.log(`Verificação passou: ${files.length} artefatos e ${required.length} fluxos essenciais encontrados.`);
