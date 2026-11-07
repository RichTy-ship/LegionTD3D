import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ASSET_3D_CATALOG,
  AnimState3D,
  animateAsset3DModel,
  createCatalogAsset3D,
} from './assets3d';
import {
  ECONOMY_CONFIG,
  FACTIONS,
  FIGHTERS,
  FIGHTER_MAP,
  KING_ITEMS,
  KING_SKILLS,
  LEGION_SPELLS,
  MERCENARIES,
  WAVES,
  validateGameData,
} from './config';
import {
  DAMAGE_MULTIPLIER_MATRIX,
  calculateDamage,
  getArmorMultiplier,
  getTypeMultiplier,
} from './damage';
import {
  accelerateKingRespawn,
  advanceToNextWaveBuildPhase,
  applyDamageToKingHero,
  buyAndPlaceFighter,
  buyKingItem,
  castKingSkill,
  castLegionSpell,
  createInitialMatchState,
  deserializeMatchState,
  hireWorker,
  moveKingByDirection,
  movePlacedFighter,
  queueMercenary,
  resolveWaveCompletion,
  runLaneAIDecision,
  sellPlacedFighter,
  serializeMatchState,
  setKingTargetPosition,
  startBattlePhase,
  stepMatch,
  upgradeKing,
  upgradePlacedFighter,
} from './engine';
import { AttackType, DefenseType } from './types';

test('0. Static Game Data, 24-Batch 3D Asset Catalog & Universal 7-State Multi-Joint Animation Rig Validation (420 Models)', () => {
  const validation = validateGameData();
  assert.equal(validation.valid, true, `Validation errors: ${validation.errors.join(', ')}`);
  assert.ok(FIGHTERS.length >= 30, `Expected >= 30 fighters, got ${FIGHTERS.length}`);
  assert.ok(MERCENARIES.length >= 10, `Expected >= 10 mercenaries, got ${MERCENARIES.length}`);
  assert.equal(WAVES.length, 21, 'Must have exactly 21 waves');
  assert.equal(Object.keys(FACTIONS).length, 8, 'Must have 8 factions');
  assert.ok(LEGION_SPELLS.length >= 12, 'Must have >= 12 Legion Spells');
  assert.ok(KING_ITEMS.length >= 8, 'Must have >= 8 Citadel Armory King Items');
  assert.ok(KING_SKILLS.Q && KING_SKILLS.E && KING_SKILLS.R, 'Must have Q, E, R King Skills');

  // Verify 24-Batch 3D Asset Production Pipeline (420 Assets total: 360 + 30 + 30)
  assert.equal(ASSET_3D_CATALOG.length, 420, 'Must have all 420 3D assets across the 24 batches');
  const expectedBatchCounts: Record<
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19
    | 20
    | 21
    | 22
    | 23
    | 24,
    number
  > = {
    1: 6,
    2: 39,
    3: 16,
    4: 10,
    5: 21,
    6: 12,
    7: 6,
    8: 8,
    9: 8,
    10: 10,
    11: 16,
    12: 14,
    13: 8,
    14: 14,
    15: 12,
    16: 16,
    17: 12,
    18: 12,
    19: 30,
    20: 30,
    21: 30,
    22: 30,
    23: 30,
    24: 30,
  };
  const allAnimStates: AnimState3D[] = [
    'IDLE',
    'WALK',
    'ATTACK',
    'SKILL',
    'HIT',
    'VICTORY',
    'FALLEN',
  ];

  for (const batchNumber of [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
  ] as const) {
    const batchItems = ASSET_3D_CATALOG.filter((item) => item.batchNumber === batchNumber);
    assert.equal(
      batchItems.length,
      expectedBatchCounts[batchNumber],
      `Batch ${batchNumber} must have ${expectedBatchCounts[batchNumber]} 3D assets`
    );
    for (const item of batchItems) {
      assert.ok(item.partsCount >= 7, `${item.name} must be a multi-part 3D model (>= 7 parts)`);
      const group = createCatalogAsset3D(item);
      assert.ok(group.children.length >= 1, `${item.name} 3D group must instantiate meshes`);
      assert.equal(
        group.userData.isOrganicSculpted,
        true,
        `${item.name} 3D group must be sculpted with smooth organic geometry`
      );
      assert.ok(
        group.userData.namedParts instanceof Map,
        `${item.name} 3D group must index O(1) namedParts for high-FPS animation`
      );
      assert.ok(
        group.userData.animRig && group.userData.animRig.activeJointCount >= 1,
        `${item.name} 3D group must build an AnimRig3D with active joints`
      );
      // Verify all 7 animation states execute cleanly without NaN transforms
      for (const animState of allAnimStates) {
        animateAsset3DModel(group, animState, 1.35, {
          explodedRatio: 0.25,
          phaseOffset: 0.4,
          speed: 1.0,
        });
        const body = group.userData.namedParts.get('bodyPivot') ?? group;
        assert.ok(
          Number.isFinite(body.position.y) && Number.isFinite(body.rotation.x),
          `${item.name} animation state ${animState} must produce finite transforms`
        );
      }
    }
  }
});

test('1. Gold Economy: Starting gold, spending validation, and prevention of negative gold', () => {
  const state = createInitialMatchState({ mode: '2v2' });
  const player = state.lanes[0];
  assert.equal(player.gold, ECONOMY_CONFIG.startingGold);

  const cheapFighter = FIGHTERS.find((f) => f.tier === 1 && f.cost <= 50)!;
  let boughtCount = 0;
  for (let x = 0; x < 7; x++) {
    const res = buyAndPlaceFighter(state, 0, cheapFighter.id, x, 0);
    if (res.ok) boughtCount += 1;
  }
  assert.ok(boughtCount >= 4);
  assert.ok(player.gold >= 0, 'Gold must never go negative');

  player.gold = 10;
  const failRes = buyAndPlaceFighter(state, 0, cheapFighter.id, 0, 1);
  assert.equal(failRes.ok, false);
  assert.equal(player.gold, 10, 'Failed transaction must not deduct gold');
});

test('2. Mythium Economy: Starting Mythium and atomic deduction', () => {
  const state = createInitialMatchState();
  const player = state.lanes[0];
  assert.equal(player.mythium, ECONOMY_CONFIG.startingMythium);

  const titanRes = queueMercenary(state, 0, 'merc_astral_titan', 1);
  assert.equal(titanRes.ok, false);
  assert.equal(player.mythium, ECONOMY_CONFIG.startingMythium);
});

test('3. Worker Production: Hiring workers and periodic Mythium generation', () => {
  const state = createInitialMatchState();
  const player = state.lanes[0];
  const initialWorkers = player.workers;
  const hireRes = hireWorker(state, 0);
  assert.equal(hireRes.ok, true);
  assert.equal(player.workers, initialWorkers + 1);
  assert.equal(player.gold, ECONOMY_CONFIG.startingGold - ECONOMY_CONFIG.workerGoldCost);

  const mythiumBefore = player.mythium;
  for (let i = 0; i < 205; i++) {
    stepMatch(state, 0.05);
  }
  const expectedGain = player.workers * ECONOMY_CONFIG.mythiumPerWorkerPerTick;
  assert.equal(player.mythium, mythiumBefore + expectedGain);
});

test('4. Income Calculation: Spending Mythium on Mercenaries and King Upgrades increases Income', () => {
  const state = createInitialMatchState();
  const player = state.lanes[0];
  player.mythium = 100;
  const startIncome = player.income;

  const sendRes = queueMercenary(state, 0, 'merc_rift_snail', 2);
  assert.equal(sendRes.ok, true);
  assert.equal(player.mythium, 60);
  assert.equal(player.income, startIncome + 12);

  const upgRes = upgradeKing(state, 0, 'attack');
  assert.equal(upgRes.ok, true);
  assert.equal(player.mythium, 40);
  assert.equal(player.income, startIncome + 18);
});

test('5. Fighter Purchase: Valid placement, duplicate tile rejection, and Tier-1 enforcement', () => {
  const state = createInitialMatchState();
  const res1 = buyAndPlaceFighter(state, 0, 'inf_cinder_guard', 2, 1);
  assert.equal(res1.ok, true);
  assert.equal(state.lanes[0].placedFighters.length, 1);

  const resDup = buyAndPlaceFighter(state, 0, 'inf_cinder_guard', 2, 1);
  assert.equal(resDup.ok, false);
  assert.equal(state.lanes[0].placedFighters.length, 1);

  const resTier2 = buyAndPlaceFighter(state, 0, 'inf_magma_juggernaut', 3, 1);
  assert.equal(resTier2.ok, false);
});

test('6. Fighter Upgrade: Branch evolution, cost deduction, and invalid branch rejection', () => {
  const state = createInitialMatchState();
  const player = state.lanes[0];
  player.gold = 500;

  buyAndPlaceFighter(state, 0, 'inf_cinder_guard', 3, 2);
  const placed = player.placedFighters[0];

  const invalidUpg = upgradePlacedFighter(state, 0, placed.instanceId, 'nat_ancient_treant');
  assert.equal(invalidUpg.ok, false);

  const validUpg = upgradePlacedFighter(state, 0, placed.instanceId, 'inf_hellfire_executioner');
  assert.equal(validUpg.ok, true);
  assert.equal(placed.fighterId, 'inf_hellfire_executioner');
  assert.equal(player.fighterValue, FIGHTER_MAP['inf_hellfire_executioner'].totalValue);
});

test('7. Fighter Placement: Repositioning, swapping, selling refund, and Battle Phase lock', () => {
  const state = createInitialMatchState();
  buyAndPlaceFighter(state, 0, 'inf_cinder_guard', 1, 1);
  buyAndPlaceFighter(state, 0, 'und_crypt_stalker', 2, 1);

  const f1 = state.lanes[0].placedFighters[0];
  const f2 = state.lanes[0].placedFighters[1];

  const moveRes = movePlacedFighter(state, 0, f1.instanceId, 2, 1);
  assert.equal(moveRes.ok, true);
  assert.equal(f1.gridX, 2);
  assert.equal(f2.gridX, 1);

  const goldBeforeSell = state.lanes[0].gold;
  const sellRes = sellPlacedFighter(state, 0, f2.instanceId);
  assert.equal(sellRes.ok, true);
  assert.equal(state.lanes[0].gold, goldBeforeSell + FIGHTER_MAP['und_crypt_stalker'].cost);

  startBattlePhase(state);
  const lockedBuy = buyAndPlaceFighter(state, 0, 'inf_cinder_guard', 0, 0);
  assert.equal(lockedBuy.ok, false);
  const lockedMove = movePlacedFighter(state, 0, f1.instanceId, 0, 0);
  assert.equal(lockedMove.ok, false);
});

test('8. Damage Calculation Service: Full 5x5 Attack/Defense Matrix, Armor, Crit, and Pure Damage', () => {
  const attackTypes: AttackType[] = ['Pierce', 'Impact', 'Magic', 'Siege', 'Pure'];
  const defenseTypes: DefenseType[] = ['Light', 'Medium', 'Heavy', 'Arcane', 'Massive'];

  for (const atk of attackTypes) {
    for (const def of defenseTypes) {
      const mult = getTypeMultiplier(atk, def);
      assert.equal(mult, DAMAGE_MULTIPLIER_MATRIX[atk][def]);
      const res = calculateDamage({
        baseDamage: 100,
        attackType: atk,
        defenseType: def,
        targetArmor: 0,
      });
      assert.equal(res.finalDamage, Math.round(100 * mult * 10) / 10);
    }
  }

  assert.equal(getArmorMultiplier('Pure', 25), 1.0);
  assert.ok(getArmorMultiplier('Impact', 25) < 0.6);

  const critRes = calculateDamage({
    baseDamage: 100,
    attackType: 'Pure',
    defenseType: 'Light',
    targetArmor: 0,
    critChance: 0.5,
    critMultiplier: 2.0,
    deterministicRoll: 0.1,
  });
  assert.equal(critRes.isCritical, true);
  assert.equal(critRes.finalDamage, 200);
});

test('9 & 10. Mercenary Purchase & Deployment into Opponent Wave', () => {
  const state = createInitialMatchState({ mode: '2v2' });
  const player = state.lanes[0];
  player.mythium = 120;

  const qRes = queueMercenary(state, 0, 'merc_iron_brute', 2);
  assert.equal(qRes.ok, true);
  assert.equal(player.mythium, 0);
  assert.equal(player.outboundMercenaries.length, 1);
  assert.equal(player.outboundMercenaries[0].count, 2);

  startBattlePhase(state);
  assert.equal(player.outboundMercenaries.length, 0);
  const enemyLane2 = state.lanes[2];
  const deployedMercs = enemyLane2.combatUnits.filter((u) => u.isMercenary);
  assert.ok(deployedMercs.length >= 2, 'Mercenaries must spawn in target opponent lane');
});

test('11. Wave Transition: Build -> Battle -> Result -> Next Wave Build', () => {
  const state = createInitialMatchState({ mode: '1v1' });
  assert.equal(state.waveNumber, 1);
  assert.equal(state.phase, 'BUILD');

  startBattlePhase(state);
  assert.equal(state.phase, 'BATTLE');

  for (const lane of state.lanes) {
    for (const u of lane.combatUnits) {
      if (u.side === 'ATTACKER') u.isDead = true;
    }
  }
  stepMatch(state, 0.05);
  assert.equal(state.phase, 'RESULT');

  advanceToNextWaveBuildPhase(state);
  assert.equal(state.phase, 'BUILD');
  assert.equal(state.waveNumber, 2);
});

test('12 & 13. Auto Combat & Clear Resolution: Fighters and Hero King engage, kill enemies, and earn Clear Bonus', () => {
  const state = createInitialMatchState({ mode: '1v1' });
  state.lanes[0].gold = 600;
  buyAndPlaceFighter(state, 0, 'inf_cinder_guard', 2, 1);
  buyAndPlaceFighter(state, 0, 'inf_cinder_guard', 4, 1);
  buyAndPlaceFighter(state, 0, 'inf_pyre_adept', 3, 4);
  buyAndPlaceFighter(state, 0, 'wld_razor_prowler', 1, 2);

  const goldBeforeBattle = state.lanes[0].gold;
  startBattlePhase(state);

  for (let step = 0; step < 800 && state.phase === 'BATTLE'; step++) {
    stepMatch(state, 0.05);
  }

  assert.equal(state.phase, 'RESULT');
  assert.equal(state.lanes[0].clearedThisWave, true);
  assert.equal(state.lanes[0].leaksThisWave, 0);
  assert.ok(state.lanes[0].gold > goldBeforeBattle + state.lanes[0].income);
});

test('14 & 15. Leak & Citadel Core Damage: Undefended lane with dead King leaks enemies to Citadel Core', () => {
  const state = createInitialMatchState({ mode: '1v1' });
  const initialCitadelHp = state.kings[0].citadelHp;
  // Set Hero King dead with long timer so enemies march unobstructed to the Citadel Core
  state.kings[0].isDead = true;
  state.kings[0].respawnTimer = 99;

  startBattlePhase(state);

  for (let step = 0; step < 600 && state.phase === 'BATTLE'; step++) {
    stepMatch(state, 0.05);
  }

  assert.ok(state.lanes[0].leaksThisWave > 0, 'Attackers must leak when lane is empty');
  assert.equal(state.lanes[0].clearedThisWave, false);
  assert.ok(
    state.kings[0].citadelHp < initialCitadelHp,
    'Leaked enemies must damage the Citadel Core (Nhà Chính)'
  );
});

test('16 & 17. Victory & Defeat Conditions based on Citadel Core (Nhà Chính)', () => {
  const winState = createInitialMatchState({ mode: '1v1' });
  startBattlePhase(winState);
  winState.kings[1].citadelHp = 0; // Enemy Citadel destroyed
  resolveWaveCompletion(winState);
  assert.equal(winState.phase, 'VICTORY');
  assert.equal(winState.winnerTeam, 0);

  const loseState = createInitialMatchState({ mode: '1v1' });
  startBattlePhase(loseState);
  loseState.kings[0].citadelHp = 0; // Player Citadel destroyed
  resolveWaveCompletion(loseState);
  assert.equal(loseState.phase, 'DEFEAT');
  assert.equal(loseState.winnerTeam, 1);

  const drawState = createInitialMatchState({ mode: '1v1' });
  startBattlePhase(drawState);
  drawState.kings[0].citadelHp = 0;
  drawState.kings[1].citadelHp = 0;
  resolveWaveCompletion(drawState);
  assert.equal(drawState.winnerTeam, 'DRAW');
});

test('18. AI Decision Engine across all 4 difficulties (Easy, Normal, Hard, Expert)', () => {
  const difficulties = ['Easy', 'Normal', 'Hard', 'Expert'] as const;
  for (const diff of difficulties) {
    const state = createInitialMatchState({ mode: '1v1', aiDifficulty: diff });
    const aiLane = state.lanes[1];
    runLaneAIDecision(state, 1);
    assert.ok(aiLane.placedFighters.length > 0, `AI (${diff}) must deploy fighters`);
    assert.ok(aiLane.gold >= 0, `AI (${diff}) gold must never be negative`);
    assert.ok(aiLane.mythium >= 0, `AI (${diff}) mythium must never be negative`);
  }
});

test('19 & 20. Save/Load State & Legion Spell Execution', () => {
  const state = createInitialMatchState({ mode: '2v2', playerSpellId: 'spell_golden_age' });
  buyAndPlaceFighter(state, 0, 'div_dawn_templar', 3, 1);
  const spellRes = castLegionSpell(state, 0);
  assert.equal(spellRes.ok, true);
  assert.equal(state.lanes[0].spellUsesRemaining, 1);

  const serialized = serializeMatchState(state);
  const restored = deserializeMatchState(serialized);
  assert.ok(restored !== null);
  assert.equal(restored!.matchId, state.matchId);
  assert.equal(restored!.lanes[0].placedFighters.length, 1);
});

test('21. Free Hero King Movement, Active Skills [Q/E/R], Citadel Item Shop, Healing Aura & Respawn Countdown', () => {
  const state = createInitialMatchState({ mode: '1v1' });
  const player = state.lanes[0];
  const king = state.kings[0];
  player.gold = 1000;

  // 1. Free Movement via Direction & Waypoint + 3D Movement Animation Rig Verification
  const startY = king.y;
  moveKingByDirection(state, 0, 0, -1, 0.5);
  assert.ok(king.y < startY, 'King should move upward when dirY = -1');
  assert.ok((king.moveAnimTimer ?? 0) > 0, 'moveKingByDirection must activate king.moveAnimTimer for WALK animation');
  assert.equal(king.facingAngle, Math.atan2(0, -1), 'moveKingByDirection must update king.facingAngle');

  const wpRes = setKingTargetPosition(state, 0, 120, 200);
  assert.equal(wpRes.ok, true);
  assert.equal(king.targetX, 120);
  assert.equal(king.targetY, 200);
  assert.ok((king.moveAnimTimer ?? 0) > 0, 'setKingTargetPosition must activate king.moveAnimTimer');

  const kingGroup = createCatalogAsset3D(ASSET_3D_CATALOG[0]);
  animateAsset3DModel(kingGroup, 'WALK', 0.2, { speed: 1.38 });
  const leftLeg = kingGroup.userData.namedParts.get('leftLeg');
  const rightLeg = kingGroup.userData.namedParts.get('rightLeg');
  assert.ok(leftLeg && rightLeg, 'Hero King 3D model must include articulated leftLeg and rightLeg groups');
  assert.notEqual(
    leftLeg.rotation.x,
    rightLeg.rotation.x,
    'Hero King leftLeg and rightLeg must counter-stride during WALK animation'
  );

  // 2. Citadel Item Shop: Buy Hero Weapon & Citadel Healing Aura Upgrade
  const atkBefore = king.attackDamage;
  const buySword = buyKingItem(state, 0, 'item_sunfire_blade');
  assert.equal(buySword.ok, true);
  assert.ok(king.attackDamage > atkBefore, 'Sunfire Greatsword must increase King Attack Damage');
  assert.equal(king.inventory.includes('item_sunfire_blade'), true);

  const auraHpsBefore = king.healingAuraHps;
  const buyAura = buyKingItem(state, 0, 'item_sanctuary_core');
  assert.equal(buyAura.ok, true);
  assert.ok(king.healingAuraHps > auraHpsBefore, 'Sanctuary Aura Conduit must increase Healing Aura HP/s');

  // 3. Cast King Skills [Q, E, R]
  const qRes = castKingSkill(state, 0, 'Q');
  assert.equal(qRes.ok, true);
  assert.ok(king.skillCooldowns.Q > 0, 'Skill Q must enter cooldown after cast');

  const eRes = castKingSkill(state, 0, 'E');
  assert.equal(eRes.ok, true);
  assert.ok(king.shield >= 320, 'Skill E must grant Sovereign Shield to the King');

  const rRes = castKingSkill(state, 0, 'R');
  assert.equal(rRes.ok, true);
  assert.ok(king.skillCooldowns.R > 0, 'Skill R must enter cooldown after cast');

  // 4. Citadel Healing Aura Regenerates Injured King on the Doubled 1100-Unit Map
  king.x = 215;
  king.y = 1000; // Inside Citadel Healing Aura (center 215, 1024)
  king.hp = 500;
  stepMatch(state, 0.05);
  assert.ok(king.hp > 500, 'Citadel Healing Aura must regenerate Hero King HP when inside radius');

  // 5. King Death -> FALLEN state -> Hold-the-Base Buff -> Emergency Ritual Surge -> Respawn without ending match
  const deepRowRes = buyAndPlaceFighter(state, 0, 'inf_cinder_guard', 3, 10);
  assert.equal(deepRowRes.ok, true, 'Expanded 12-row grid (row 10) must accept fighter placement');
  startBattlePhase(state);
  const defender = player.combatUnits.find((u) => u.side === 'DEFENDER')!;
  const baseArmor = defender.baseArmor;

  king.x = 180;
  king.y = 220;
  king.shield = 0;
  applyDamageToKingHero(state, player, king, 99999, 'Pure');
  assert.equal(king.isDead, true, 'King should be marked dead when HP reaches 0');
  assert.equal(king.status, 'FALLEN', 'King must enter the FALLEN state when defeated');
  assert.equal(king.fallenX, 180, 'Fallen coordinates must be recorded');
  assert.equal(king.respawnTimer, king.maxRespawnTime, 'Respawn countdown must start');
  assert.equal(state.phase, 'BATTLE', 'King entering FALLEN state must NOT cause instant game-over');

  // Step 1 frame in BATTLE: Allied defenders must receive the Hold-the-Base Garrison Buff (+6 Armor, 1.2x Attack Speed)
  stepMatch(state, 0.05);
  assert.equal(
    defender.armor,
    baseArmor + 6,
    'Allied defenders must gain +6 Armor Hold-the-Base buff while King is FALLEN'
  );

  // Rush Respawn (-3s for 50g)
  const timerBeforeRush = king.respawnTimer;
  const rushRes = accelerateKingRespawn(state, 0);
  assert.equal(rushRes.ok, true);
  assert.ok(king.respawnTimer <= timerBeforeRush - 2.9, 'accelerateKingRespawn must reduce respawn timer by 3s');

  // Advance time past remaining respawnTimer
  for (let i = 0; i < 120; i++) {
    stepMatch(state, 0.05);
  }
  assert.equal(king.isDead, false, 'King must respawn after countdown finishes');
  assert.equal(king.status, 'ALIVE', 'Respawned King must return to ALIVE status');
  assert.equal(king.hp, king.maxHp, 'Respawned King must have full HP');
  assert.ok(king.shield >= 280, 'Respawned King must receive Rebirth Shield');
});
