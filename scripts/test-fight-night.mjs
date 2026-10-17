import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const appSource = await readFile('app.js', 'utf8');
const exportLine = "window.ValeFightManager = { reset: () => resetCareer(), getState: () => structuredClone(state) };";
const debugLine = "window.ValeFightManager = { reset: () => resetCareer(), getState: () => structuredClone(state), __debug: { state: () => state, startCareer, bookFight, setFightPace, startFight, autoFightTick, continueFight, finishFight } };";
assert.ok(appSource.includes(exportLine), 'A API pública esperada não foi encontrada.');

const node = () => ({ innerHTML: '', className: '', append() {}, remove() {}, addEventListener() {}, querySelectorAll: () => [], querySelector: () => null });
const app = node();
const toastRegion = node();
const storage = new Map();
const document = { querySelector: (selector) => selector === '#app' ? app : selector === '#toast-region' ? toastRegion : null, querySelectorAll: () => [], createElement: node, body: { insertAdjacentHTML() {} } };
const window = { setTimeout: () => 1, clearTimeout() {}, setInterval: () => 1, clearInterval() {} };
const context = vm.createContext({ window, document, localStorage: { getItem: (key) => storage.get(key) || null, setItem: (key, value) => storage.set(key, String(value)), removeItem: (key) => storage.delete(key) }, structuredClone, Intl, console, Math, Date });
vm.runInContext(appSource.replace(exportLine, debugLine), context, { filename: 'app.js' });

const { __debug: debug } = context.window.ValeFightManager;
let state = debug.state();
state.draft.managerName = 'QA Manager';
state.draft.academyName = 'QA Vale';
state.draft.focus = 'mma';
debug.startCareer();
debug.bookFight();
state = debug.state();
state.fight.status = 'ready';

debug.setFightPace('relentless');
assert.equal(state.fight.pace, 'relentless', 'O ritmo escolhido deve persistir antes do sino.');
assert.equal(state.fight.exchangesPerRound, 6, 'Alta pressão deve criar seis trocas por round.');
debug.startFight();
assert.equal(state.fight.status, 'active', 'A Fight Night deve iniciar no estado ativo.');
assert.equal(state.fight.roundSeconds, 300, 'O relógio do round deve começar em 5:00.');

debug.autoFightTick();
assert.ok(state.fight.roundSeconds < 300, 'Uma troca automática deve consumir tempo de round.');
assert.ok(state.fight.elapsedSeconds > 0, 'A transmissão deve registrar o tempo decorrido.');
assert.equal(state.fight.replay.length, 1, 'Uma troca deve gerar um momento para replay.');
assert.notEqual(state.fight.position, 'long-range', 'A troca deve atualizar a leitura posicional.');

state.fight.exchanges = state.fight.exchangesPerRound - 1;
state.fight.roundSeconds = 50;
debug.autoFightTick();
assert.equal(state.fight.status, 'interval', 'O fim do round deve abrir o intervalo tático.');
assert.equal(state.fight.roundSeconds, 0, 'O relógio deve marcar 0:00 no intervalo.');
debug.continueFight();
assert.equal(state.fight.status, 'active', 'O corner deve conseguir reiniciar o próximo round.');
assert.equal(state.fight.roundSeconds, 300, 'O próximo round deve reiniciar o relógio.');
assert.equal(state.fight.position, 'long-range', 'O reinício deve reposicionar os atletas.');

debug.finishFight(true, 'nocaute técnico');
assert.match(state.fight.result.clock, /^\d:\d{2}$/, 'O resultado deve guardar o relógio oficial do término.');
console.log(`Fight Night 2D passou: ritmo ${state.fight.pace}, ${state.fight.replay.length} replay(s) e relógio ${state.fight.result.clock}.`);
