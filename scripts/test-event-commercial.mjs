import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const appSource = await readFile('app.js', 'utf8');
const exportLine = "window.ValeFightManager = { reset: () => resetCareer(), getState: () => structuredClone(state) };";
const debugLine = "window.ValeFightManager = { reset: () => resetCareer(), getState: () => structuredClone(state), __debug: { state: () => state, startCareer, selectEventTicketProfile, selectEventBroadcast, selectEventActivation, selectEventCardFormat, eventEstimate, planEvent, settlePromotedEvent } };";
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
debug.selectEventTicketProfile('premium');
debug.selectEventBroadcast('national-stream');
debug.selectEventActivation('headline-partner');
debug.selectEventCardFormat('stacked');

const estimate = debug.eventEstimate();
assert.equal(estimate.ticketSales.length, 3, 'A projeção deve separar os três setores de ingresso.');
assert.equal(estimate.ticketSales.reduce((sum, sector) => sum + sector.sold, 0), estimate.attendance, 'Os setores devem fechar o público projetado.');
assert.ok(estimate.commitment > 0, 'O compromisso comercial deve somar reservas e contratos.');
assert.ok(estimate.media > 0 && estimate.sponsorBonus > 0, 'Mídia e ativação comercial devem entrar na estimativa.');

const cashBeforePlan = state.cash;
debug.planEvent();
state = debug.state();
const event = state.eventPlanner.activeEvent;
assert.ok(event, 'O evento comercial deve ser confirmado.');
assert.equal(event.card.length, 7, 'O card de gala deve criar sete lutas.');
assert.equal(event.ticketSales.length, 3, 'A venda por setor deve persistir no evento.');
assert.equal(event.broadcastName, 'Pulse Combat Network', 'A distribuição escolhida deve ser preservada.');
assert.equal(event.activationName, 'Naming partner', 'A ativação escolhida deve ser preservada.');
assert.equal(state.cash, cashBeforePlan - event.reservation, 'O caixa deve receber o custo de contratação no planejamento.');

const fansBeforeSettlement = state.fans;
debug.settlePromotedEvent(event, true);
assert.equal(event.status, 'complete', 'A liquidação deve concluir o evento.');
assert.ok(state.regionalImpact[event.city]?.shows >= 1, 'A praça deve guardar impacto comercial persistente.');
assert.ok(state.fans > fansBeforeSettlement, 'A realização do show deve ampliar a base de fãs.');
assert.equal(state.eventPlanner.history[0].id, event.id, 'O show concluído deve entrar no histórico.');
console.log(`Evento comercial passou: ${event.card.length} lutas, ${event.ticketSales.length} setores e impacto em ${event.city}.`);
