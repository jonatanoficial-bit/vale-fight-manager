import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const appSource = await readFile('app.js', 'utf8');
const exportLine = "window.ValeFightManager = { reset: () => resetCareer(), getState: () => structuredClone(state) };";
const debugLine = "window.ValeFightManager = { reset: () => resetCareer(), getState: () => structuredClone(state), __debug: { state: () => state, startCareer, circuitById, circuitTitleThreshold, scheduleTitleChallenge, resolveCompetitionReady, startFight, finishFight } };";
assert.ok(appSource.includes(exportLine), 'A API pública esperada não foi encontrada.');

const node = () => ({
  innerHTML: '',
  className: '',
  append() {},
  remove() {},
  addEventListener() {},
  querySelectorAll: () => [],
  querySelector: () => null,
});
const app = node();
const toastRegion = node();
const storage = new Map();
const document = {
  querySelector: (selector) => selector === '#app' ? app : selector === '#toast-region' ? toastRegion : null,
  querySelectorAll: () => [],
  createElement: node,
  body: { insertAdjacentHTML() {} },
};
const window = {
  setTimeout: () => 1,
  clearTimeout() {},
  setInterval: () => 1,
  clearInterval() {},
};
const context = vm.createContext({
  window,
  document,
  localStorage: { getItem: (key) => storage.get(key) || null, setItem: (key, value) => storage.set(key, String(value)), removeItem: (key) => storage.delete(key) },
  structuredClone,
  Intl,
  console,
  Math,
  Date,
});
vm.runInContext(appSource.replace(exportLine, debugLine), context, { filename: 'app.js' });

const { __debug: debug } = context.window.ValeFightManager;
let state = debug.state();
state.draft.managerName = 'QA Manager';
state.draft.academyName = 'QA Vale';
state.draft.focus = 'mma';
debug.startCareer();

state = debug.state();
const circuit = debug.circuitById('vale-rising');
const threshold = debug.circuitTitleThreshold(circuit);
state.world.circuitCampaign.points[circuit.id] = threshold;
const cashBefore = state.cash;
debug.scheduleTitleChallenge(circuit.id);

const challenge = state.competitions.active;
assert.equal(challenge.titleChallenge, true, 'A rota deve criar uma disputa de cinturão.');
assert.equal(challenge.status, 'registered', 'A disputa deve entrar no calendário como registrada.');
assert.ok(state.cash < cashBefore, 'A logística da disputa deve impactar o caixa.');

state.week = challenge.week;
assert.equal(debug.resolveCompetitionReady(), true, 'A disputa deve se tornar Fight Night na semana marcada.');
debug.startFight();
assert.equal(state.fight.status, 'active', 'A Fight Night de título deve iniciar.');
debug.finishFight(true, 'nocaute técnico');

const fighter = state.fighters[0];
assert.equal(state.world.circuitCampaign.titles[circuit.id].fighterId, fighter.id, 'A vitória deve registrar o campeão do circuito.');
assert.equal(state.competitions.active.status, 'complete', 'A disputa deve ser liquidada após o resultado.');
assert.ok(state.world.circuitCampaign.history.some((entry) => entry.result.includes('conquistou o cinturão')), 'O passaporte deve registrar a conquista.');
console.log(`Rota de título passou: ${fighter.name} conquistou ${circuit.name} com ${threshold} pontos.`);
