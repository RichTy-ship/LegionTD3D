import {
  AI_DIFFICULTY_CONFIG,
  ECONOMY_CONFIG,
  FACTIONS,
  FIGHTERS,
  FIGHTER_MAP,
  KING_CONFIG,
  KING_ITEMS,
  KING_ITEM_MAP,
  KING_SKILLS,
  LEGION_SPELLS,
  MERCENARIES,
  MERCENARY_MAP,
  SPELL_MAP,
  WAVE_MAP,
} from './config';
import { calculateDamage, getTypeMultiplier } from './damage';
import {
  AIDifficulty,
  CombatUnit,
  FactionId,
  FighterConfig,
  KingSkillKey,
  KingState,
  LaneState,
  MatchHistoryRecord,
  MatchMode,
  MatchState,
  PlacedFighter,
  WaveResultSummary,
} from './types';

let idCounter = 1;
function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}_${idCounter}`;
}

export function getRecommendedValueForWave(waveNumber: number): number {
  const wave = WAVE_MAP[waveNumber];
  if (!wave) return 200;
  return Math.round(160 + (waveNumber - 1) * 115 + Math.pow(waveNumber, 1.65) * 18);
}

export function createInitialKing(teamId: 0 | 1): KingState {
  return {
    teamId,
    name: teamId === 0 ? 'Aegis Sovereign (West)' : 'Obsidian Monarch (East)',
    hp: KING_CONFIG.baseHp,
    maxHp: KING_CONFIG.baseHp,
    shield: 0,
    x: KING_CONFIG.spawnX,
    y: KING_CONFIG.spawnY,
    targetX: null,
    targetY: null,
    movementSpeed: KING_CONFIG.baseMoveSpeed,
    attackDamage: KING_CONFIG.baseAttackDamage,
    attackSpeed: KING_CONFIG.baseAttackSpeed,
    attackRange: KING_CONFIG.baseAttackRange,
    armor: KING_CONFIG.baseArmor,
    lifesteal: 0.05,
    regenerationPerWave: KING_CONFIG.baseRegenPerWave,
    magicPower: KING_CONFIG.baseMagicPower,
    cooldownReduction: 0,
    attackType: 'Pure',
    defenseType: 'Massive',
    status: 'ALIVE',
    isDead: false,
    fallenX: KING_CONFIG.spawnX,
    fallenY: KING_CONFIG.spawnY,
    respawnTimer: 0,
    maxRespawnTime: KING_CONFIG.baseRespawnTimeSeconds,
    deathsCount: 0,
    killsCount: 0,
    skillCooldowns: { Q: 0, E: 0, R: 0 },
    inventory: [],
    citadelHp: KING_CONFIG.citadelBaseHp,
    citadelMaxHp: KING_CONFIG.citadelBaseHp,
    citadelArmor: KING_CONFIG.citadelBaseArmor,
    healingAuraRadius: KING_CONFIG.baseHealingAuraRadius,
    healingAuraHps: KING_CONFIG.baseHealingAuraHps,
    healingAuraLevel: 1,
    attackUpgradeLevel: 0,
    defenseUpgradeLevel: 0,
    regenUpgradeLevel: 0,
    spellUpgradeLevel: 0,
    attackCooldownTimer: 0,
    abilityCooldownTimer: 0,
    moveAnimTimer: 0,
    facingAngle: Math.PI,
  };
}

export function createInitialLane(
  laneId: number,
  name: string,
  teamId: 0 | 1,
  isHuman: boolean,
  aiDifficulty: AIDifficulty,
  selectedFaction: FactionId,
  selectedSpellId: string
): LaneState {
  return {
    laneId,
    name,
    teamId,
    isHuman,
    aiDifficulty,
    selectedFaction,
    gold: ECONOMY_CONFIG.startingGold,
    mythium: ECONOMY_CONFIG.startingMythium,
    workers: ECONOMY_CONFIG.startingWorkers,
    income: ECONOMY_CONFIG.startingIncome,
    fighterValue: 0,
    recommendedValue: getRecommendedValueForWave(1),
    placedFighters: [],
    outboundMercenaries: [],
    inboundMercenaries: [],
    selectedSpellId,
    spellUsesRemaining: SPELL_MAP[selectedSpellId]?.maxUsesPerMatch ?? 2,
    spellCooldownWaves: 0,
    activeSpellTimer: 0,
    leaksThisWave: 0,
    clearedThisWave: false,
    totalLeaks: 0,
    totalMercsSent: 0,
    totalDamageDealt: 0,
    combatUnits: [],
    projectiles: [],
    floatingTexts: [],
    skillEffects: [],
  };
}

export function createInitialMatchState(options?: {
  mode?: MatchMode;
  aiDifficulty?: AIDifficulty;
  playerFaction?: FactionId;
  playerSpellId?: string;
}): MatchState {
  const mode = options?.mode ?? '2v2';
  const aiDifficulty = options?.aiDifficulty ?? 'Normal';
  const playerFaction = options?.playerFaction ?? 'Inferno';
  const playerSpellId = options?.playerSpellId ?? 'spell_golden_age';

  const allFactions: FactionId[] = [
    'Inferno',
    'Undead',
    'Nature',
    'Mechanic',
    'Abyss',
    'Wild',
    'Divine',
    'Arcane',
  ];
  const pickFaction = (idx: number): FactionId =>
    allFactions[(allFactions.indexOf(playerFaction) + idx) % allFactions.length];

  const lanes: LaneState[] =
    mode === '2v2'
      ? [
          createInitialLane(0, 'Commander (You)', 0, true, aiDifficulty, playerFaction, playerSpellId),
          createInitialLane(1, 'Vanguard Ally (AI)', 0, false, aiDifficulty, pickFaction(2), 'spell_divine_shield'),
          createInitialLane(2, 'Warlord Kael (AI)', 1, false, aiDifficulty, pickFaction(4), 'spell_meteor_storm'),
          createInitialLane(3, 'Archon Vex (AI)', 1, false, aiDifficulty, pickFaction(6), 'spell_war_cry'),
        ]
      : [
          createInitialLane(0, 'Commander (You)', 0, true, aiDifficulty, playerFaction, playerSpellId),
          createInitialLane(1, 'Grand Tactician (AI)', 1, false, aiDifficulty, pickFaction(3), 'spell_meteor_storm'),
        ];

  return {
    matchId: nextId('match'),
    mode,
    aiDifficulty,
    waveNumber: 1,
    phase: 'BUILD',
    phaseTimer: ECONOMY_CONFIG.buildPhaseDurationSeconds,
    buildPhaseDuration: ECONOMY_CONFIG.buildPhaseDurationSeconds,
    mythiumTickTimer: 0,
    battleElapsedSeconds: 0,
    simSpeed: 1,
    lanes,
    kings: [createInitialKing(0), createInitialKing(1)],
    activeViewedLaneId: 0,
    lastWaveResult: null,
    winnerTeam: null,
    combatLogs: [
      'Wave 1 Build Phase: Control your Hero King with WASD or Right-Click, cast Skills [Q/E/R], and protect the Citadel!',
    ],
    hitstopTimer: 0,
  };
}

export function getTargetEnemyLaneId(state: MatchState, senderLaneId: number): number {
  if (state.lanes.length === 4) {
    const map: Record<number, number> = { 0: 2, 1: 3, 2: 0, 3: 1 };
    return map[senderLaneId] ?? 2;
  }
  return senderLaneId === 0 ? 1 : 0;
}

export function getAlliedTeammateLaneId(state: MatchState, laneId: number): number | null {
  if (state.lanes.length === 4) {
    const map: Record<number, number> = { 0: 1, 1: 0, 2: 3, 3: 2 };
    return map[laneId] ?? null;
  }
  return null;
}

export function getPrimaryLaneForTeam(state: MatchState, teamId: 0 | 1): LaneState {
  if (teamId === 0) return state.lanes[0];
  return state.lanes.find((l) => l.teamId === 1) ?? state.lanes[state.lanes.length - 1];
}

// ============================================================================
// FREE HERO KING MOVEMENT, ACTIVE SKILLS [Q/E/R] & CITADEL ITEM SHOP
// ============================================================================

export interface ActionResult {
  ok: boolean;
  reason?: string;
}

function clampKingCoord(x: number, y: number): { x: number; y: number } {
  return {
    x: Math.max(32, Math.min(398, x)),
    y: Math.max(36, Math.min(1065, y)),
  };
}

/**
 * Direct WASD / Arrow Key movement vector for the Hero King.
 */
export function moveKingByDirection(
  state: MatchState,
  teamId: 0 | 1,
  dirX: number,
  dirY: number,
  dt: number
): void {
  const king = state.kings[teamId];
  if (!king || king.isDead) return;
  const len = Math.hypot(dirX, dirY);
  if (len <= 0.001) return;

  const nx = dirX / len;
  const ny = dirY / len;
  const clamped = clampKingCoord(
    king.x + nx * king.movementSpeed * dt,
    king.y + ny * king.movementSpeed * dt
  );
  king.x = clamped.x;
  king.y = clamped.y;
  king.targetX = null;
  king.targetY = null;
  king.moveAnimTimer = 0.28;
  king.facingAngle = Math.atan2(nx, ny);
}

/**
 * Sets a click/right-click movement waypoint for the Hero King.
 */
export function setKingTargetPosition(
  state: MatchState,
  teamId: 0 | 1,
  targetX: number,
  targetY: number
): ActionResult {
  const king = state.kings[teamId];
  if (!king) return { ok: false, reason: 'King not found.' };
  if (king.isDead) {
    return {
      ok: false,
      reason: `Hero King is respawning (${Math.ceil(king.respawnTimer)}s remaining).`,
    };
  }
  const clamped = clampKingCoord(targetX, targetY);
  king.targetX = clamped.x;
  king.targetY = clamped.y;
  const dx = clamped.x - king.x;
  const dy = clamped.y - king.y;
  if (Math.hypot(dx, dy) > 1) {
    king.moveAnimTimer = 0.28;
    king.facingAngle = Math.atan2(dx, dy);
  }
  return { ok: true };
}

/**
 * Casts one of the Hero King's 3 active skills: Q (Royal Cleave), E (Sovereign Aegis), R (Cataclysm Judgment).
 */
export function castKingSkill(
  state: MatchState,
  laneId: number,
  skillKey: KingSkillKey
): ActionResult {
  const lane = state.lanes[laneId];
  if (!lane) return { ok: false, reason: 'Invalid lane.' };
  const king = state.kings[lane.teamId];
  if (!king) return { ok: false, reason: 'King not found.' };
  if (king.isDead) {
    return {
      ok: false,
      reason: `Cannot cast skills while King is dead (respawns in ${Math.ceil(king.respawnTimer)}s).`,
    };
  }

  const skill = KING_SKILLS[skillKey];
  if (!skill) return { ok: false, reason: 'Unknown King Skill.' };

  const currentCd = king.skillCooldowns[skillKey] ?? 0;
  if (currentCd > 0) {
    return {
      ok: false,
      reason: `${skill.name} is on cooldown (${currentCd.toFixed(1)}s).`,
    };
  }

  const effectiveCd = Math.max(1.5, skill.cooldown * (1 - king.cooldownReduction));
  king.skillCooldowns[skillKey] = effectiveCd;

  const activeLane = getPrimaryLaneForTeam(state, king.teamId);
  if (!activeLane.skillEffects) activeLane.skillEffects = [];
  activeLane.skillEffects.push({
    id: nextId('kfx'),
    laneId: activeLane.laneId,
    x: king.x,
    y: king.y,
    radius: skill.radius,
    color: skill.accentColor,
    ttl: 0.45,
    maxTtl: 0.45,
  });

  const attackers = activeLane.combatUnits.filter(
    (u) => u.side === 'ATTACKER' && !u.isDead && !u.hasLeaked
  );
  const defenders = activeLane.combatUnits.filter((u) => u.side === 'DEFENDER' && !u.isDead);

  if (skillKey === 'Q') {
    // Royal Cleave: AoE Pure + Attack Damage & Slow
    const totalDmg = Math.round(skill.baseDamage + king.attackDamage);
    for (const foe of attackers) {
      if (Math.hypot(foe.x - king.x, foe.y - king.y) <= skill.radius) {
        applyDamageFromKing(state, activeLane, king, foe, totalDmg, 'Pure', true);
        if (!foe.isDead) {
          foe.statusEffects.push({
            type: 'Slow',
            value: 0.35,
            remainingDuration: skill.slowDuration ?? 3.0,
            sourceId: `king_${king.teamId}`,
          });
        }
      }
    }
  } else if (skillKey === 'E') {
    // Sovereign Aegis: King Shield + Heal + Ally Shield + Enemy Stun
    const shieldGain = skill.shieldAmount ?? 320;
    const healGain = skill.healAmount ?? 180;
    king.shield += shieldGain;
    king.hp = Math.min(king.maxHp, king.hp + healGain);

    for (const ally of defenders) {
      if (Math.hypot(ally.x - king.x, ally.y - king.y) <= skill.radius) {
        ally.shield += Math.round(shieldGain * 0.65);
        ally.hp = Math.min(ally.maxHp, ally.hp + Math.round(healGain * 0.5));
      }
    }
    for (const foe of attackers) {
      if (Math.hypot(foe.x - king.x, foe.y - king.y) <= skill.radius) {
        applyDamageFromKing(state, activeLane, king, foe, skill.baseDamage + king.magicPower, 'Magic', false);
        if (!foe.isDead) {
          foe.statusEffects.push({
            type: 'Stun',
            value: 1,
            remainingDuration: skill.stunDuration ?? 1.2,
            sourceId: `king_${king.teamId}`,
          });
        }
      }
    }
  } else if (skillKey === 'R') {
    // Cataclysm Judgment: Massive AoE Pure damage + Stun + Burn
    const totalDmg = Math.round(skill.baseDamage + king.magicPower * 1.5);
    for (const foe of attackers) {
      if (Math.hypot(foe.x - king.x, foe.y - king.y) <= skill.radius) {
        applyDamageFromKing(state, activeLane, king, foe, totalDmg, 'Pure', true);
        if (!foe.isDead) {
          foe.statusEffects.push({
            type: 'Stun',
            value: 1,
            remainingDuration: skill.stunDuration ?? 1.5,
            sourceId: `king_${king.teamId}`,
          });
          foe.statusEffects.push({
            type: 'Burn',
            value: 45,
            remainingDuration: 4.0,
            sourceId: `king_${king.teamId}`,
          });
        }
      }
    }
  }

  activeLane.floatingTexts.push({
    id: nextId('ft_kskill'),
    laneId: activeLane.laneId,
    x: king.x,
    y: king.y - 22,
    text: `${skill.name.split(' (')[0]}!`,
    color: skill.accentColor,
    ttl: 0.9,
    maxTtl: 0.9,
    isCrit: true,
  });

  state.combatLogs.unshift(`${lane.name} cast King Skill [${skillKey}]: ${skill.name}!`);
  return { ok: true };
}

/**
 * Purchases an Item for the Hero King or upgrades the Citadel Healing Aura from the Main Base Armory.
 */
export function buyKingItem(
  state: MatchState,
  laneId: number,
  itemId: string
): ActionResult {
  const lane = state.lanes[laneId];
  if (!lane) return { ok: false, reason: 'Invalid lane.' };
  const king = state.kings[lane.teamId];
  if (!king) return { ok: false, reason: 'King not found.' };

  const item = KING_ITEM_MAP[itemId];
  if (!item) return { ok: false, reason: 'Unknown item ID.' };

  if (
    item.category !== 'Citadel' &&
    king.inventory.length >= ECONOMY_CONFIG.kingMaxInventorySlots
  ) {
    return {
      ok: false,
      reason: `King inventory is full (${ECONOMY_CONFIG.kingMaxInventorySlots} items max).`,
    };
  }

  if (lane.gold < item.goldCost) {
    return {
      ok: false,
      reason: `Insufficient Gold for ${item.name} (requires ${item.goldCost}g).`,
    };
  }

  lane.gold -= item.goldCost;

  if (item.category !== 'Citadel') {
    king.inventory.push(item.id);
  } else {
    king.healingAuraLevel += 1;
  }

  // Apply item bonuses to Hero King & Citadel Core
  if (item.bonusAttackDamage) king.attackDamage += item.bonusAttackDamage;
  if (item.bonusMaxHp) {
    king.maxHp += item.bonusMaxHp;
    if (!king.isDead) {
      king.hp = Math.min(king.maxHp, king.hp + item.bonusMaxHp);
    }
  }
  if (item.bonusArmor) king.armor += item.bonusArmor;
  if (item.bonusMoveSpeed) king.movementSpeed += item.bonusMoveSpeed;
  if (item.bonusAttackSpeed) {
    king.attackSpeed = Number((king.attackSpeed + item.bonusAttackSpeed).toFixed(2));
  }
  if (item.bonusLifesteal) {
    king.lifesteal = Math.min(0.65, Number((king.lifesteal + item.bonusLifesteal).toFixed(2)));
  }
  if (item.bonusMagicPower) king.magicPower += item.bonusMagicPower;
  if (item.cooldownReduction) {
    king.cooldownReduction = Math.min(
      0.5,
      Number((king.cooldownReduction + item.cooldownReduction).toFixed(2))
    );
  }
  if (item.respawnReductionSeconds) {
    king.maxRespawnTime = Math.max(3, king.maxRespawnTime - item.respawnReductionSeconds);
  }
  if (item.bonusAuraHealPerSec) {
    king.healingAuraHps += item.bonusAuraHealPerSec;
  }
  if (item.bonusAuraRadius) {
    king.healingAuraRadius = Math.min(220, king.healingAuraRadius + item.bonusAuraRadius);
  }
  if (item.bonusCitadelMaxHp) {
    king.citadelMaxHp += item.bonusCitadelMaxHp;
    king.citadelHp = Math.min(king.citadelMaxHp, king.citadelHp + item.bonusCitadelMaxHp);
  }

  state.combatLogs.unshift(`${lane.name} purchased ${item.name} from the Citadel Armory!`);
  return { ok: true };
}

/**
 * Emergency Ritual Surge: Spend 50 Gold while the Hero King is in the 'FALLEN' state
 * to accelerate the respawn timer by 3.0 seconds (or revive immediately if <= 3.0s).
 */
export function accelerateKingRespawn(state: MatchState, laneId: number): ActionResult {
  const lane = state.lanes[laneId];
  if (!lane) return { ok: false, reason: 'Invalid lane.' };
  const king = state.kings[lane.teamId];
  if (!king) return { ok: false, reason: 'King not found.' };
  if (!king.isDead && king.status !== 'FALLEN') {
    return { ok: false, reason: 'Hero King is already alive on the battlefield.' };
  }

  const rushCost = 50;
  if (lane.gold < rushCost) {
    return {
      ok: false,
      reason: `Insufficient Gold to rush King respawn (requires ${rushCost}g).`,
    };
  }

  lane.gold -= rushCost;
  king.respawnTimer = Math.max(0, king.respawnTimer - 3.0);

  if (king.respawnTimer <= 0) {
    reviveFallenKing(state, king);
  } else {
    state.combatLogs.unshift(
      `${lane.name} channeled Emergency Ritual Surge (-3s)! King respawns in ${king.respawnTimer.toFixed(1)}s.`
    );
  }

  return { ok: true };
}

// ============================================================================
// ECONOMY & BUILD PHASE TRANSACTIONS (WITH STRICT ATOMIC VALIDATION)
// ============================================================================

export function isValidGridCoord(gridX: number, gridY: number): boolean {
  return (
    Number.isInteger(gridX) &&
    Number.isInteger(gridY) &&
    gridX >= 0 &&
    gridX < ECONOMY_CONFIG.gridCols &&
    gridY >= 0 &&
    gridY < ECONOMY_CONFIG.gridRows
  );
}

export function buyAndPlaceFighter(
  state: MatchState,
  laneId: number,
  fighterId: string,
  gridX: number,
  gridY: number
): ActionResult {
  if (state.phase !== 'BUILD') {
    return { ok: false, reason: 'Cannot deploy fighters during active combat.' };
  }
  const lane = state.lanes[laneId];
  if (!lane) return { ok: false, reason: 'Invalid lane.' };

  const fighter = FIGHTER_MAP[fighterId];
  if (!fighter) return { ok: false, reason: 'Unknown fighter ID.' };
  if (fighter.tier !== 1) {
    return { ok: false, reason: 'Tier 2 fighters must be evolved from a placed Tier 1 fighter.' };
  }
  if (!isValidGridCoord(gridX, gridY)) {
    return { ok: false, reason: 'Grid coordinates out of bounds.' };
  }
  const occupied = lane.placedFighters.some((p) => p.gridX === gridX && p.gridY === gridY);
  if (occupied) {
    return { ok: false, reason: 'Tile is already occupied by another fighter.' };
  }
  if (lane.gold < fighter.cost) {
    return { ok: false, reason: `Insufficient Gold (requires ${fighter.cost}g).` };
  }

  lane.gold -= fighter.cost;
  lane.fighterValue += fighter.cost;
  lane.placedFighters.push({
    instanceId: nextId('fgt'),
    fighterId: fighter.id,
    gridX,
    gridY,
    waveBought: state.waveNumber,
    kills: 0,
    totalDamageDealt: 0,
  });

  return { ok: true };
}

export function upgradePlacedFighter(
  state: MatchState,
  laneId: number,
  instanceId: string,
  targetUpgradeId: string
): ActionResult {
  if (state.phase !== 'BUILD') {
    return { ok: false, reason: 'Cannot upgrade fighters during Battle Phase.' };
  }
  const lane = state.lanes[laneId];
  if (!lane) return { ok: false, reason: 'Invalid lane.' };

  const placed = lane.placedFighters.find((p) => p.instanceId === instanceId);
  if (!placed) return { ok: false, reason: 'Fighter not found on grid.' };

  const currentCfg = FIGHTER_MAP[placed.fighterId];
  const targetCfg = FIGHTER_MAP[targetUpgradeId];
  if (!currentCfg || !targetCfg) {
    return { ok: false, reason: 'Invalid upgrade configuration.' };
  }
  if (!currentCfg.upgradePaths.includes(targetUpgradeId)) {
    return {
      ok: false,
      reason: `${targetCfg.name} is not a valid upgrade branch for ${currentCfg.name}.`,
    };
  }
  if (lane.gold < targetCfg.cost) {
    return { ok: false, reason: `Insufficient Gold for upgrade (requires ${targetCfg.cost}g).` };
  }

  lane.gold -= targetCfg.cost;
  lane.fighterValue += targetCfg.cost;
  placed.fighterId = targetCfg.id;

  return { ok: true };
}

export function movePlacedFighter(
  state: MatchState,
  laneId: number,
  instanceId: string,
  toGridX: number,
  toGridY: number
): ActionResult {
  if (state.phase !== 'BUILD') {
    return { ok: false, reason: 'Cannot reposition fighters during Battle Phase.' };
  }
  const lane = state.lanes[laneId];
  if (!lane) return { ok: false, reason: 'Invalid lane.' };
  if (!isValidGridCoord(toGridX, toGridY)) {
    return { ok: false, reason: 'Destination tile out of bounds.' };
  }

  const placed = lane.placedFighters.find((p) => p.instanceId === instanceId);
  if (!placed) return { ok: false, reason: 'Fighter not found.' };

  if (placed.gridX === toGridX && placed.gridY === toGridY) {
    return { ok: true };
  }

  const occupant = lane.placedFighters.find(
    (p) => p.gridX === toGridX && p.gridY === toGridY && p.instanceId !== instanceId
  );
  if (occupant) {
    occupant.gridX = placed.gridX;
    occupant.gridY = placed.gridY;
  }

  placed.gridX = toGridX;
  placed.gridY = toGridY;
  return { ok: true };
}

export function getSellRefundAmount(state: MatchState, placed: PlacedFighter): number {
  const cfg = FIGHTER_MAP[placed.fighterId];
  if (!cfg) return 0;
  const ratio =
    placed.waveBought === state.waveNumber
      ? ECONOMY_CONFIG.sameWaveRefundRatio
      : ECONOMY_CONFIG.previousWaveRefundRatio;
  return Math.round(cfg.totalValue * ratio);
}

export function sellPlacedFighter(
  state: MatchState,
  laneId: number,
  instanceId: string
): ActionResult {
  if (state.phase !== 'BUILD') {
    return { ok: false, reason: 'Cannot sell fighters during Battle Phase.' };
  }
  const lane = state.lanes[laneId];
  if (!lane) return { ok: false, reason: 'Invalid lane.' };

  const idx = lane.placedFighters.findIndex((p) => p.instanceId === instanceId);
  if (idx === -1) return { ok: false, reason: 'Fighter not found.' };

  const placed = lane.placedFighters[idx];
  const cfg = FIGHTER_MAP[placed.fighterId];
  const refund = getSellRefundAmount(state, placed);

  lane.placedFighters.splice(idx, 1);
  lane.gold += refund;
  lane.fighterValue = Math.max(0, lane.fighterValue - (cfg?.totalValue ?? refund));

  return { ok: true };
}

export function hireWorker(state: MatchState, laneId: number): ActionResult {
  const lane = state.lanes[laneId];
  if (!lane) return { ok: false, reason: 'Invalid lane.' };
  if (lane.workers >= ECONOMY_CONFIG.maxWorkers) {
    return { ok: false, reason: `Maximum worker cap (${ECONOMY_CONFIG.maxWorkers}) reached.` };
  }
  if (lane.gold < ECONOMY_CONFIG.workerGoldCost) {
    return {
      ok: false,
      reason: `Insufficient Gold to hire Worker (requires ${ECONOMY_CONFIG.workerGoldCost}g).`,
    };
  }

  lane.gold -= ECONOMY_CONFIG.workerGoldCost;
  lane.workers += 1;
  return { ok: true };
}

export function queueMercenary(
  state: MatchState,
  senderLaneId: number,
  mercenaryId: string,
  count = 1
): ActionResult {
  const lane = state.lanes[senderLaneId];
  if (!lane) return { ok: false, reason: 'Invalid sender lane.' };
  if (count <= 0 || !Number.isInteger(count)) {
    return { ok: false, reason: 'Mercenary count must be a positive integer.' };
  }

  const merc = MERCENARY_MAP[mercenaryId];
  if (!merc) return { ok: false, reason: 'Unknown mercenary ID.' };

  const totalCost = merc.mythiumCost * count;
  if (lane.mythium < totalCost) {
    return {
      ok: false,
      reason: `Insufficient Mythium (requires ${totalCost}, available ${lane.mythium}).`,
    };
  }

  lane.mythium -= totalCost;
  lane.income += merc.incomeBonus * count;
  lane.totalMercsSent += count;

  const existing = lane.outboundMercenaries.find((q) => q.mercenaryId === mercenaryId);
  if (existing) {
    existing.count += count;
  } else {
    lane.outboundMercenaries.push({ mercenaryId, count });
  }

  return { ok: true };
}

export function upgradeKing(
  state: MatchState,
  laneId: number,
  upgradeType: 'attack' | 'defense' | 'regen' | 'spell'
): ActionResult {
  const lane = state.lanes[laneId];
  if (!lane) return { ok: false, reason: 'Invalid lane.' };

  const king = state.kings[lane.teamId];
  if (!king) return { ok: false, reason: 'King not found.' };

  const cost = ECONOMY_CONFIG.kingUpgradeMythiumCost;
  if (lane.mythium < cost) {
    return { ok: false, reason: `Insufficient Mythium (requires ${cost} Mythium).` };
  }

  if (upgradeType === 'attack') {
    if (king.attackUpgradeLevel >= ECONOMY_CONFIG.kingMaxUpgradeLevel) {
      return { ok: false, reason: 'King Attack is already at maximum level.' };
    }
    king.attackUpgradeLevel += 1;
    king.attackDamage += KING_CONFIG.attackUpgradeBonusDamage;
  } else if (upgradeType === 'defense') {
    if (king.defenseUpgradeLevel >= ECONOMY_CONFIG.kingMaxUpgradeLevel) {
      return { ok: false, reason: 'King Defense is already at maximum level.' };
    }
    king.defenseUpgradeLevel += 1;
    king.armor += KING_CONFIG.defenseUpgradeBonusArmor;
    king.maxHp += KING_CONFIG.defenseUpgradeBonusMaxHp;
    if (!king.isDead) {
      king.hp = Math.min(king.maxHp, king.hp + KING_CONFIG.defenseUpgradeBonusMaxHp);
    }
    king.citadelMaxHp += KING_CONFIG.defenseUpgradeBonusMaxHp;
    king.citadelHp = Math.min(
      king.citadelMaxHp,
      king.citadelHp + KING_CONFIG.defenseUpgradeBonusMaxHp
    );
  } else if (upgradeType === 'regen') {
    if (king.regenUpgradeLevel >= ECONOMY_CONFIG.kingMaxUpgradeLevel) {
      return { ok: false, reason: 'King & Citadel Aura Regen is already at maximum level.' };
    }
    king.regenUpgradeLevel += 1;
    king.regenerationPerWave += KING_CONFIG.regenUpgradeBonusPerWave;
    king.healingAuraHps += KING_CONFIG.regenUpgradeBonusAuraHps;
  } else if (upgradeType === 'spell') {
    if (king.spellUpgradeLevel >= ECONOMY_CONFIG.kingMaxUpgradeLevel) {
      return { ok: false, reason: 'King Judgment Power is already at maximum level.' };
    }
    king.spellUpgradeLevel += 1;
    king.magicPower += KING_CONFIG.spellUpgradeBonusMagicPower;
  }

  lane.mythium -= cost;
  lane.income += ECONOMY_CONFIG.kingUpgradeIncomeBonus;
  return { ok: true };
}

export function selectLegionSpell(
  state: MatchState,
  laneId: number,
  spellId: string
): ActionResult {
  const lane = state.lanes[laneId];
  if (!lane) return { ok: false, reason: 'Invalid lane.' };
  const spell = SPELL_MAP[spellId];
  if (!spell) return { ok: false, reason: 'Unknown Legion Spell.' };
  if (state.waveNumber < spell.unlockWave) {
    return { ok: false, reason: `${spell.name} unlocks at Wave ${spell.unlockWave}.` };
  }

  lane.selectedSpellId = spell.id;
  lane.spellUsesRemaining = spell.maxUsesPerMatch;
  lane.spellCooldownWaves = 0;
  return { ok: true };
}

export function castLegionSpell(state: MatchState, laneId: number): ActionResult {
  const lane = state.lanes[laneId];
  if (!lane) return { ok: false, reason: 'Invalid lane.' };

  const spell = SPELL_MAP[lane.selectedSpellId];
  if (!spell) return { ok: false, reason: 'No valid Legion Spell equipped.' };
  if (state.waveNumber < spell.unlockWave) {
    return { ok: false, reason: `${spell.name} unlocks at Wave ${spell.unlockWave}.` };
  }
  if (lane.spellUsesRemaining <= 0) {
    return { ok: false, reason: `No uses remaining for ${spell.name}.` };
  }
  if (lane.spellCooldownWaves > 0) {
    return {
      ok: false,
      reason: `${spell.name} is on cooldown for ${lane.spellCooldownWaves} more wave(s).`,
    };
  }
  if (lane.mythium < spell.mythiumCost) {
    return { ok: false, reason: `Requires ${spell.mythiumCost} Mythium.` };
  }

  lane.mythium -= spell.mythiumCost;
  lane.spellUsesRemaining -= 1;
  lane.spellCooldownWaves = spell.cooldownWaves;
  lane.activeSpellTimer = Math.max(15, spell.durationSeconds);

  if (spell.id === 'spell_golden_age') {
    lane.gold += 110;
    lane.income += 12;
  } else if (spell.id === 'spell_overclock_forges') {
    lane.workers = Math.min(ECONOMY_CONFIG.maxWorkers, lane.workers + 2);
    lane.mythium += 40;
  } else if (spell.id === 'spell_venture_capital') {
    lane.gold += 180;
  } else if (spell.id === 'spell_bastion_protocol') {
    const king = state.kings[lane.teamId];
    king.citadelHp = Math.min(king.citadelMaxHp, king.citadelHp + 450);
    if (!king.isDead) {
      king.hp = Math.min(king.maxHp, king.hp + 350);
    }
  } else if (spell.id === 'spell_nature_blessing') {
    const king = state.kings[lane.teamId];
    king.regenerationPerWave += 4;
    king.healingAuraHps += 8;
  }

  if (state.phase === 'BATTLE') {
    applySpellToActiveCombat(state, lane, spell.id);
  }

  state.combatLogs.unshift(`${lane.name} activated Legion Spell: ${spell.name}!`);
  return { ok: true };
}

function applySpellToActiveCombat(state: MatchState, lane: LaneState, spellId: string): void {
  const defenders = lane.combatUnits.filter((u) => u.side === 'DEFENDER' && !u.isDead);
  const attackers = lane.combatUnits.filter((u) => u.side === 'ATTACKER' && !u.isDead);

  if (spellId === 'spell_divine_shield') {
    for (const d of defenders) {
      d.shield += 280;
    }
  } else if (spellId === 'spell_bastion_protocol') {
    for (const d of defenders) {
      d.armor += 8;
    }
  } else if (spellId === 'spell_living_roots') {
    for (const d of defenders) {
      d.hp = Math.min(d.maxHp, d.hp + Math.round(d.maxHp * 0.35));
    }
  } else if (spellId === 'spell_meteor_storm') {
    for (const a of attackers) {
      a.hp -= 320;
      a.hitFlashTimer = 0.15;
      a.statusEffects.push({
        type: 'Burn',
        value: 35,
        remainingDuration: 4.0,
        sourceId: 'spell_meteor',
      });
      if (a.hp <= 0) {
        a.hp = 0;
        a.isDead = true;
        a.koTimer = 0.35;
        lane.gold += a.bountyGold;
      }
    }
  } else if (spellId === 'spell_bloodlust_frenzy') {
    for (const d of defenders) {
      d.attackSpeed = d.baseAttackSpeed * 1.35;
    }
  } else if (spellId === 'spell_abyssal_curse') {
    for (const a of attackers) {
      a.armor -= 8;
      a.movementSpeed = a.baseMovementSpeed * 0.65;
    }
  } else if (spellId === 'spell_war_cry') {
    for (const d of defenders) {
      d.attackDamage = Math.round(d.baseAttackDamage * 1.22);
    }
    const allyId = getAlliedTeammateLaneId(state, lane.laneId);
    if (allyId !== null) {
      const allyLane = state.lanes[allyId];
      for (const d of allyLane.combatUnits.filter((u) => u.side === 'DEFENDER' && !u.isDead)) {
        d.attackDamage = Math.round(d.baseAttackDamage * 1.22);
      }
    }
  } else if (spellId === 'spell_arcane_surge') {
    for (const d of defenders) {
      d.shield += 150;
      d.abilityCooldownTimer = Math.max(0.1, d.abilityCooldownTimer * 0.5);
    }
  } else if (spellId === 'spell_nature_blessing') {
    for (const d of defenders) {
      d.hp = Math.min(d.maxHp, d.hp + 220);
    }
  }
}

// ============================================================================
// AI OPPONENT DECISION ENGINE
// ============================================================================

export function runLaneAIDecision(state: MatchState, laneId: number): void {
  const lane = state.lanes[laneId];
  if (!lane || lane.isHuman || state.phase !== 'BUILD') return;

  const diff = AI_DIFFICULTY_CONFIG[lane.aiDifficulty];
  const wave = WAVE_MAP[state.waveNumber] ?? WAVE_MAP[1];
  const recommendedVal = getRecommendedValueForWave(state.waveNumber);

  // 1. Worker Scaling Decision
  const targetWorkers = Math.min(
    ECONOMY_CONFIG.maxWorkers,
    Math.max(4, Math.floor((4 + state.waveNumber * 1.15) * diff.workerTargetRatio))
  );

  const defenseRatio = lane.fighterValue / Math.max(100, recommendedVal);
  while (
    lane.workers < targetWorkers &&
    lane.gold >= ECONOMY_CONFIG.workerGoldCost + 65 &&
    (defenseRatio >= 0.72 || state.waveNumber === 1)
  ) {
    const res = hireWorker(state, laneId);
    if (!res.ok) break;
  }

  // 2. AI buys an Item for its Team King if it has surplus Gold on Wave 4+
  const ownKing = state.kings[lane.teamId];
  if (
    state.waveNumber >= 4 &&
    ownKing.inventory.length < Math.floor(state.waveNumber / 3) &&
    lane.gold >= 180
  ) {
    const affordableItem = KING_ITEMS.find((it) => it.goldCost <= lane.gold - 90);
    if (affordableItem) {
      buyKingItem(state, laneId, affordableItem.id);
    }
  }

  // 3. Upgrade Existing Fighters (Tier 1 -> Tier 2)
  if (state.waveNumber >= 3 && lane.placedFighters.length >= 2) {
    for (const placed of lane.placedFighters) {
      const cfg = FIGHTER_MAP[placed.fighterId];
      if (!cfg || cfg.upgradePaths.length === 0) continue;

      const sortedUpgrades = [...cfg.upgradePaths]
        .map((id) => FIGHTER_MAP[id])
        .filter((u): u is FighterConfig => Boolean(u))
        .sort((a, b) => {
          const scoreA = scoreFighterAgainstWave(a, wave.attackType, wave.defenseType, diff.counterWeight);
          const scoreB = scoreFighterAgainstWave(b, wave.attackType, wave.defenseType, diff.counterWeight);
          return scoreB - scoreA;
        });

      const bestUpgrade = sortedUpgrades[0];
      if (bestUpgrade && lane.gold >= bestUpgrade.cost && state.waveNumber >= 3) {
        upgradePlacedFighter(state, laneId, placed.instanceId, bestUpgrade.id);
      }
    }
  }

  // 4. Buy & Place New Tier-1 Fighters
  const tier1Fighters = FIGHTERS.filter((f) => f.tier === 1);
  let safetyLoop = 0;
  while (lane.gold >= 45 && safetyLoop < 15) {
    safetyLoop += 1;
    const affordable = tier1Fighters.filter((f) => f.cost <= lane.gold);
    if (affordable.length === 0) break;

    const tankCount = lane.placedFighters.filter(
      (p) => FIGHTER_MAP[p.fighterId]?.role === 'Tank'
    ).length;
    const needTank = tankCount < Math.max(1, Math.ceil(lane.placedFighters.length * 0.35));

    const scored = affordable
      .map((f) => {
        let score = scoreFighterAgainstWave(f, wave.attackType, wave.defenseType, diff.counterWeight);
        if (f.faction === lane.selectedFaction) score += 0.25;
        if (needTank && f.role === 'Tank') score += 0.45;
        return { fighter: f, score };
      })
      .sort((a, b) => b.score - a.score);

    const chosen =
      diff.mistakeRate > 0.2 && scored.length > 1 ? scored[1].fighter : scored[0].fighter;

    const tile = findBestOpenGridTile(lane, chosen);
    if (!tile) break;

    const bought = buyAndPlaceFighter(state, laneId, chosen.id, tile.gridX, tile.gridY);
    if (!bought.ok) break;
  }

  // 5. Mythium Spending: Mercenary Sends & King Upgrades
  const citadelHpRatio = ownKing.citadelHp / ownKing.citadelMaxHp;
  if (citadelHpRatio < 0.55 && lane.mythium >= ECONOMY_CONFIG.kingUpgradeMythiumCost) {
    upgradeKing(
      state,
      laneId,
      ownKing.defenseUpgradeLevel <= ownKing.regenUpgradeLevel ? 'defense' : 'regen'
    );
  }

  const isNextWaveSpike = [5, 10, 15, 20, 21].includes(state.waveNumber);
  const shouldSaveForSpike =
    (diff.mercTimingDiscipline === 'PowerSpike' || diff.mercTimingDiscipline === 'Coordinated') &&
    !isNextWaveSpike &&
    [4, 9, 14, 19].includes(state.waveNumber);

  if (!shouldSaveForSpike) {
    const sortedMercs = [...MERCENARIES].sort((a, b) => b.mythiumCost - a.mythiumCost);
    let mercLoop = 0;
    while (lane.mythium >= 20 && mercLoop < 10) {
      mercLoop += 1;
      const affordableMerc = sortedMercs.find((m) => m.mythiumCost <= lane.mythium);
      if (!affordableMerc) break;
      const res = queueMercenary(state, laneId, affordableMerc.id, 1);
      if (!res.ok) break;
    }
  }

  if (
    lane.spellUsesRemaining > 0 &&
    lane.spellCooldownWaves === 0 &&
    (wave.category === 'Boss' || state.waveNumber >= 6)
  ) {
    castLegionSpell(state, laneId);
  }
}

function scoreFighterAgainstWave(
  fighter: FighterConfig,
  waveAttackType: FighterConfig['attackType'],
  waveDefenseType: FighterConfig['defenseType'],
  counterWeight: number
): number {
  const offensiveMult = getTypeMultiplier(fighter.attackType, waveDefenseType);
  const incomingMult = getTypeMultiplier(waveAttackType, fighter.defenseType);
  const defensiveScore = 2.0 - incomingMult;
  const baseEfficiency = fighter.totalValue / 100;
  return baseEfficiency * 0.25 + (offensiveMult * 1.2 + defensiveScore) * counterWeight;
}

function findBestOpenGridTile(
  lane: LaneState,
  fighter: FighterConfig
): { gridX: number; gridY: number } | null {
  const isMeleeOrTank = fighter.attackRange <= 2 || fighter.role === 'Tank';
  const preferredRows = isMeleeOrTank
    ? [1, 2, 0, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    : [6, 7, 8, 9, 10, 11, 5, 4, 3, 2, 1, 0];
  const preferredCols = [3, 2, 4, 1, 5, 0, 6];

  for (const r of preferredRows) {
    for (const c of preferredCols) {
      const taken = lane.placedFighters.some((p) => p.gridX === c && p.gridY === r);
      if (!taken) {
        return { gridX: c, gridY: r };
      }
    }
  }
  return null;
}

// ============================================================================
// BATTLE PHASE INITIALIZATION & UNIT SPAWNING
// ============================================================================

export function getActiveFactionSynergies(lane: LaneState): Set<FactionId> {
  const counts: Partial<Record<FactionId, number>> = {};
  for (const p of lane.placedFighters) {
    const cfg = FIGHTER_MAP[p.fighterId];
    if (cfg) {
      counts[cfg.faction] = (counts[cfg.faction] ?? 0) + 1;
    }
  }
  const active = new Set<FactionId>();
  for (const [facId, count] of Object.entries(counts)) {
    const facCfg = FACTIONS[facId as FactionId];
    if (facCfg && (count ?? 0) >= facCfg.synergyThreshold) {
      active.add(facId as FactionId);
    }
  }
  return active;
}

export function startBattlePhase(state: MatchState): void {
  if (state.phase !== 'BUILD') return;

  for (const lane of state.lanes) {
    if (!lane.isHuman) {
      runLaneAIDecision(state, lane.laneId);
    }
  }

  for (const lane of state.lanes) {
    lane.inboundMercenaries = [];
  }
  for (const sender of state.lanes) {
    const targetLaneId = getTargetEnemyLaneId(state, sender.laneId);
    const targetLane = state.lanes[targetLaneId];
    if (targetLane && sender.outboundMercenaries.length > 0) {
      for (const item of sender.outboundMercenaries) {
        const existing = targetLane.inboundMercenaries.find(
          (m) => m.mercenaryId === item.mercenaryId
        );
        if (existing) {
          existing.count += item.count;
        } else {
          targetLane.inboundMercenaries.push({ ...item });
        }
      }
    }
    sender.outboundMercenaries = [];
  }

  const wave = WAVE_MAP[state.waveNumber] ?? WAVE_MAP[1];
  state.phase = 'BATTLE';
  state.phaseTimer = 0;
  state.battleElapsedSeconds = 0;

  for (const lane of state.lanes) {
    lane.combatUnits = [];
    lane.projectiles = [];
    lane.floatingTexts = [];
    lane.skillEffects = [];
    lane.leaksThisWave = 0;
    lane.clearedThisWave = false;

    const activeSynergies = getActiveFactionSynergies(lane);

    // Spawn Defenders
    for (const placed of lane.placedFighters) {
      const cfg = FIGHTER_MAP[placed.fighterId];
      if (!cfg) continue;

      const hasSynergy = activeSynergies.has(cfg.faction);
      const fac = FACTIONS[cfg.faction];

      let maxHp = cfg.hp;
      let atkDmg = cfg.attackDamage;
      let atkSpd = cfg.attackSpeed;
      let armor = cfg.armor;
      let shield = 0;

      if (hasSynergy && fac) {
        if (fac.synergyBonusType === 'maxHp') maxHp = Math.round(maxHp * (1 + fac.synergyBonusValue));
        if (fac.synergyBonusType === 'attackDamage')
          atkDmg = Math.round(atkDmg * (1 + fac.synergyBonusValue));
        if (fac.synergyBonusType === 'attackSpeed')
          atkSpd = Number((atkSpd * (1 + fac.synergyBonusValue)).toFixed(2));
        if (fac.synergyBonusType === 'armor') armor += fac.synergyBonusValue;
        if (fac.synergyBonusType === 'shieldStart')
          shield += Math.round(maxHp * fac.synergyBonusValue);
      }

      const unitX = 45 + placed.gridX * 55;
      const unitY = 340 + placed.gridY * 42 + (placed.gridY >= 6 ? 28 : 0);

      lane.combatUnits.push({
        instanceId: placed.instanceId,
        definitionId: cfg.id,
        name: cfg.name,
        side: 'DEFENDER',
        laneId: lane.laneId,
        ownerLaneId: lane.laneId,
        x: unitX,
        y: unitY,
        radius: cfg.tier === 2 ? 15 : 12,
        hp: maxHp,
        maxHp,
        shield,
        attackDamage: atkDmg,
        baseAttackDamage: atkDmg,
        attackSpeed: atkSpd,
        baseAttackSpeed: atkSpd,
        attackRange: cfg.attackRange === 1 ? 42 : 45 + cfg.attackRange * 40,
        armor,
        baseArmor: armor,
        movementSpeed: cfg.movementSpeed,
        baseMovementSpeed: cfg.movementSpeed,
        attackType: cfg.attackType,
        defenseType: cfg.defenseType,
        targetingPriority: cfg.targetingPriority,
        role: cfg.role,
        faction: cfg.faction,
        ability: cfg.ability,
        abilityCooldownTimer: Math.max(1.2, cfg.ability.cooldown * 0.6),
        attackCooldownTimer: 0.2,
        targetId: null,
        isBoss: false,
        isMercenary: false,
        isFlying: false,
        bountyGold: 0,
        leakDamageFactor: 0,
        statusEffects: [],
        color: cfg.color,
        accentColor: cfg.accentColor,
        damageDealtThisWave: 0,
        killsThisWave: 0,
        hitFlashTimer: 0,
        koTimer: 0,
        isDead: false,
        hasLeaked: false,
      });
    }

    // Spawn Wave Enemies
    for (let i = 0; i < wave.count; i++) {
      const col = i % 5;
      const row = Math.floor(i / 5);
      const x = 75 + col * 68 + (row % 2 === 1 ? 20 : -10);
      const y = 35 + row * 28;

      lane.combatUnits.push({
        instanceId: nextId(`wave_${lane.laneId}`),
        definitionId: `wave_${wave.waveNumber}`,
        name: wave.enemyName,
        side: 'ATTACKER',
        laneId: lane.laneId,
        ownerLaneId: lane.laneId,
        x,
        y,
        radius: 12,
        hp: wave.hp,
        maxHp: wave.hp,
        shield: 0,
        attackDamage: wave.damage,
        baseAttackDamage: wave.damage,
        attackSpeed: wave.attackSpeed,
        baseAttackSpeed: wave.attackSpeed,
        attackRange: wave.attackRange === 1 ? 38 : 42 + wave.attackRange * 36,
        armor: wave.armor,
        baseArmor: wave.armor,
        movementSpeed: wave.movementSpeed,
        baseMovementSpeed: wave.movementSpeed,
        attackType: wave.attackType,
        defenseType: wave.defenseType,
        targetingPriority: 'Nearest',
        abilityCooldownTimer: 99,
        attackCooldownTimer: 0.3,
        targetId: null,
        isBoss: false,
        isMercenary: false,
        isFlying: wave.category === 'Flying',
        bountyGold: wave.bountyPerUnit,
        leakDamageFactor: 1.0,
        statusEffects: [],
        color: '#EF4444',
        accentColor: '#FCA5A5',
        damageDealtThisWave: 0,
        killsThisWave: 0,
        hitFlashTimer: 0,
        koTimer: 0,
        isDead: false,
        hasLeaked: false,
      });
    }

    if (wave.bossUnit) {
      lane.combatUnits.push({
        instanceId: nextId(`boss_${lane.laneId}`),
        definitionId: `boss_${wave.waveNumber}`,
        name: wave.bossUnit.name,
        side: 'ATTACKER',
        laneId: lane.laneId,
        ownerLaneId: lane.laneId,
        x: 210,
        y: 24,
        radius: 21,
        hp: wave.bossUnit.hp,
        maxHp: wave.bossUnit.hp,
        shield: 0,
        attackDamage: wave.bossUnit.damage,
        baseAttackDamage: wave.bossUnit.damage,
        attackSpeed: 0.95,
        baseAttackSpeed: 0.95,
        attackRange: 48,
        armor: wave.bossUnit.armor,
        baseArmor: wave.bossUnit.armor,
        movementSpeed: 58,
        baseMovementSpeed: 58,
        attackType: wave.bossUnit.attackType,
        defenseType: wave.bossUnit.defenseType,
        targetingPriority: 'Nearest',
        abilityCooldownTimer: 4.0,
        attackCooldownTimer: 0.4,
        targetId: null,
        isBoss: true,
        isMercenary: false,
        isFlying: false,
        bountyGold: wave.bossUnit ? wave.bountyPerUnit * 4 : 25,
        leakDamageFactor: 3.5,
        statusEffects: [],
        color: '#DC2626',
        accentColor: '#FDE047',
        damageDealtThisWave: 0,
        killsThisWave: 0,
        hitFlashTimer: 0,
        koTimer: 0,
        isDead: false,
        hasLeaked: false,
      });
    }

    let mercIdx = 0;
    for (const inbound of lane.inboundMercenaries) {
      const mercCfg = MERCENARY_MAP[inbound.mercenaryId];
      if (!mercCfg) continue;
      for (let c = 0; c < inbound.count; c++) {
        const mx = 65 + (mercIdx % 5) * 70;
        const my = 18 + Math.floor(mercIdx / 5) * 24;
        mercIdx += 1;

        lane.combatUnits.push({
          instanceId: nextId(`merc_${lane.laneId}`),
          definitionId: mercCfg.id,
          name: mercCfg.name,
          side: 'ATTACKER',
          laneId: lane.laneId,
          ownerLaneId: lane.laneId,
          x: mx,
          y: my,
          radius: mercCfg.group === 'Titan' ? 19 : 14,
          hp: mercCfg.hp,
          maxHp: mercCfg.hp,
          shield: mercCfg.specialEffect === 'MagicShield' ? mercCfg.effectValue : 0,
          attackDamage: mercCfg.damage,
          baseAttackDamage: mercCfg.damage,
          attackSpeed: mercCfg.attackSpeed,
          baseAttackSpeed: mercCfg.attackSpeed,
          attackRange: mercCfg.attackRange === 1 ? 42 : 42 + mercCfg.attackRange * 38,
          armor: mercCfg.armor,
          baseArmor: mercCfg.armor,
          movementSpeed: mercCfg.movementSpeed,
          baseMovementSpeed: mercCfg.movementSpeed,
          attackType: mercCfg.attackType,
          defenseType: mercCfg.defenseType,
          targetingPriority: 'Nearest',
          abilityCooldownTimer: 3.5,
          attackCooldownTimer: 0.25,
          targetId: null,
          isBoss: mercCfg.group === 'Titan',
          isMercenary: true,
          isFlying: false,
          bountyGold: Math.max(8, Math.round(mercCfg.mythiumCost * 0.22)),
          leakDamageFactor: mercCfg.specialEffect === 'SiegeKing' ? 2.2 : 1.4,
          statusEffects: [],
          color: mercCfg.color,
          accentColor: '#FDE047',
          damageDealtThisWave: 0,
          killsThisWave: 0,
          hitFlashTimer: 0,
          koTimer: 0,
          isDead: false,
          hasLeaked: false,
          specialEffect: mercCfg.specialEffect,
          specialEffectValue: mercCfg.effectValue,
        });
      }
    }

    if (lane.activeSpellTimer > 0) {
      applySpellToActiveCombat(state, lane, lane.selectedSpellId);
    }
  }

  state.combatLogs.unshift(
    `Wave ${state.waveNumber}: ${wave.name} (${wave.category}) has begun!`
  );
}

// ============================================================================
// REAL-TIME AUTO COMBAT, HERO KING, CITADEL AURA & RESPAWN COUNTDOWN
// ============================================================================

export function stepMatch(state: MatchState, rawDt: number): void {
  if (state.phase === 'VICTORY' || state.phase === 'DEFEAT') return;

  const clampedDt = Math.min(Math.max(0, rawDt), 0.05) * state.simSpeed;

  if (state.hitstopTimer > 0) {
    state.hitstopTimer = Math.max(0, state.hitstopTimer - rawDt);
  }

  // Tick Hero Kings (Movement, Skill Cooldowns, Citadel Healing Aura, Respawn Countdown)
  for (const king of state.kings) {
    stepHeroKing(state, king, clampedDt);
  }

  // Tick visual skill rings across lanes
  for (const lane of state.lanes) {
    if (lane.skillEffects) {
      for (let i = lane.skillEffects.length - 1; i >= 0; i--) {
        lane.skillEffects[i].ttl -= clampedDt;
        if (lane.skillEffects[i].ttl <= 0) {
          lane.skillEffects.splice(i, 1);
        }
      }
    }
  }

  // Worker Mythium Production Tick
  const mythiumMultiplier =
    state.phase === 'BATTLE' ? ECONOMY_CONFIG.mythiumCombatTickMultiplier : 1.0;
  state.mythiumTickTimer += clampedDt * mythiumMultiplier;
  while (state.mythiumTickTimer >= ECONOMY_CONFIG.mythiumTickIntervalSeconds) {
    state.mythiumTickTimer -= ECONOMY_CONFIG.mythiumTickIntervalSeconds;
    for (const lane of state.lanes) {
      lane.mythium += lane.workers * ECONOMY_CONFIG.mythiumPerWorkerPerTick;
    }
  }

  if (state.phase === 'BUILD') {
    state.phaseTimer -= clampedDt;
    if (state.phaseTimer <= 0) {
      startBattlePhase(state);
    }
    return;
  }

  if (state.phase === 'RESULT') {
    state.phaseTimer -= clampedDt;
    if (state.phaseTimer <= 0) {
      advanceToNextWaveBuildPhase(state);
    }
    return;
  }

  if (state.phase === 'BATTLE') {
    state.battleElapsedSeconds += clampedDt;

    for (const lane of state.lanes) {
      stepLaneCombat(state, lane, clampedDt);
    }

    // Immediate Victory/Defeat if a Citadel Core is destroyed mid-wave
    if (state.kings[0].citadelHp <= 0 || state.kings[1].citadelHp <= 0) {
      resolveWaveCompletion(state);
      return;
    }

    const allLanesResolved = state.lanes.every((lane) =>
      lane.combatUnits.every((u) => u.side !== 'ATTACKER' || u.isDead || u.hasLeaked)
    );

    if (state.battleElapsedSeconds > 55) {
      for (const lane of state.lanes) {
        for (const u of lane.combatUnits) {
          if (!u.isDead) {
            u.attackDamage = Math.round(u.attackDamage * (1 + 0.25 * clampedDt));
          }
        }
      }
    }

    if (allLanesResolved) {
      resolveWaveCompletion(state);
    }
  }
}

function stepHeroKing(state: MatchState, king: KingState, dt: number): void {
  // 1. Tick Skill Cooldowns [Q, E, R]
  for (const key of ['Q', 'E', 'R'] as KingSkillKey[]) {
    if (king.skillCooldowns[key] > 0) {
      king.skillCooldowns[key] = Math.max(0, king.skillCooldowns[key] - dt);
    }
  }
  king.attackCooldownTimer = Math.max(0, king.attackCooldownTimer - dt);
  king.moveAnimTimer = Math.max(0, (king.moveAnimTimer ?? 0) - dt);

  const primaryLane = getPrimaryLaneForTeam(state, king.teamId);

  // 2. If King is in FALLEN state -> Tick Respawn Countdown!
  if (king.isDead || king.status === 'FALLEN') {
    king.isDead = true;
    king.status = 'FALLEN';
    king.respawnTimer = Math.max(0, king.respawnTimer - dt);
    if (king.respawnTimer <= 0) {
      reviveFallenKing(state, king);
    }
    return;
  }

  // 3. Citadel Sanctuary Healing Aura: Regenerate King HP when inside Aura radius of (215, 512)
  const distToCitadel = Math.hypot(
    king.x - KING_CONFIG.citadelX,
    king.y - KING_CONFIG.citadelY
  );
  if (distToCitadel <= king.healingAuraRadius && king.hp < king.maxHp) {
    king.hp = Math.min(king.maxHp, king.hp + king.healingAuraHps * dt);
  }

  // Also heal allied Defenders standing inside the Citadel Healing Aura
  if (state.phase === 'BATTLE') {
    for (const def of primaryLane.combatUnits) {
      if (def.side === 'DEFENDER' && !def.isDead && def.hp < def.maxHp) {
        const dCit = Math.hypot(def.x - KING_CONFIG.citadelX, def.y - KING_CONFIG.citadelY);
        if (dCit <= king.healingAuraRadius) {
          def.hp = Math.min(def.maxHp, def.hp + king.healingAuraHps * 0.65 * dt);
        }
      }
    }
  }

  // 4. Waypoint Movement (Click-to-Move)
  if (king.targetX !== null && king.targetY !== null) {
    const dx = king.targetX - king.x;
    const dy = king.targetY - king.y;
    const dist = Math.hypot(dx, dy);
    const step = king.movementSpeed * dt;
    if (dist > 0.5) {
      king.facingAngle = Math.atan2(dx, dy);
      king.moveAnimTimer = 0.22;
    }
    if (dist <= step + 2) {
      king.x = king.targetX;
      king.y = king.targetY;
      king.targetX = null;
      king.targetY = null;
    } else {
      king.x += (dx / dist) * step;
      king.y += (dy / dist) * step;
    }
  }

  // 5. During BATTLE phase, Hero King engages nearby attackers on the primary lane
  if (state.phase === 'BATTLE') {
    const attackers = primaryLane.combatUnits.filter(
      (u) => u.side === 'ATTACKER' && !u.isDead && !u.hasLeaked
    );
    if (attackers.length === 0) return;

    // Find nearest attacker to King
    const nearestFoe = [...attackers].sort(
      (a, b) =>
        Math.hypot(a.x - king.x, a.y - king.y) - Math.hypot(b.x - king.x, b.y - king.y)
    )[0];
    if (!nearestFoe) return;

    const distToFoe = Math.hypot(nearestFoe.x - king.x, nearestFoe.y - king.y);

    // If player hasn't set a manual waypoint, or if an enemy is threatening the backline/Citadel (y >= 260), King moves to intercept!
    if (king.targetX === null && king.targetY === null) {
      if (king.hp / king.maxHp < 0.25 && distToCitadel > king.healingAuraRadius * 0.7) {
        // Tactical retreat into Citadel Healing Aura when critically low HP
        const dx = KING_CONFIG.citadelX - king.x;
        const dy = KING_CONFIG.spawnY - king.y;
        const d = Math.max(1, Math.hypot(dx, dy));
        king.x += (dx / d) * king.movementSpeed * dt;
        king.y += (dy / d) * king.movementSpeed * dt;
        king.moveAnimTimer = 0.22;
        king.facingAngle = Math.atan2(dx, dy);
      } else if (distToFoe > king.attackRange && (nearestFoe.y >= 340 || distToFoe <= 240)) {
        const dx = nearestFoe.x - king.x;
        const dy = nearestFoe.y - king.y;
        const d = Math.max(1, Math.hypot(dx, dy));
        king.x += (dx / d) * king.movementSpeed * dt;
        king.y += (dy / d) * king.movementSpeed * dt;
        king.moveAnimTimer = 0.22;
        king.facingAngle = Math.atan2(dx, dy);
      } else if (distToFoe <= king.attackRange) {
        king.facingAngle = Math.atan2(nearestFoe.x - king.x, nearestFoe.y - king.y);
      }
    }

    // AI King automatically casts skills when enemies are in range
    if (king.teamId === 1) {
      if (king.skillCooldowns.Q <= 0 && distToFoe <= KING_SKILLS.Q.radius) {
        castKingSkill(state, primaryLane.laneId, 'Q');
      } else if (king.skillCooldowns.E <= 0 && king.hp / king.maxHp < 0.7 && distToFoe <= KING_SKILLS.E.radius) {
        castKingSkill(state, primaryLane.laneId, 'E');
      } else if (king.skillCooldowns.R <= 0 && attackers.length >= 3 && distToFoe <= KING_SKILLS.R.radius) {
        castKingSkill(state, primaryLane.laneId, 'R');
      }
    }

    // Basic Attack when in range
    if (distToFoe <= king.attackRange && king.attackCooldownTimer <= 0) {
      king.attackCooldownTimer = 1 / Math.max(0.3, king.attackSpeed);
      applyDamageFromKing(
        state,
        primaryLane,
        king,
        nearestFoe,
        king.attackDamage,
        king.attackType,
        false
      );
    }
  }
}

function applyDamageFromKing(
  state: MatchState,
  lane: LaneState,
  king: KingState,
  target: CombatUnit,
  baseDamage: number,
  attackType: CombatUnit['attackType'],
  isSkill: boolean
): void {
  if (target.isDead || target.hasLeaked) return;

  const calc = calculateDamage({
    baseDamage,
    attackType,
    defenseType: target.defenseType,
    targetArmor: target.armor,
    critChance: isSkill ? 0.25 : 0.15,
    critMultiplier: 1.5,
    deterministicRoll: 0.5,
  });

  let dmgRemaining = calc.finalDamage;
  if (target.shield > 0) {
    const absorbed = Math.min(target.shield, dmgRemaining);
    target.shield -= absorbed;
    dmgRemaining -= absorbed;
  }

  target.hp -= dmgRemaining;
  target.hitFlashTimer = 0.1;
  lane.totalDamageDealt += calc.finalDamage;

  // Apply King Lifesteal
  if (king.lifesteal > 0 && !king.isDead) {
    const heal = Math.round(calc.finalDamage * king.lifesteal);
    king.hp = Math.min(king.maxHp, king.hp + heal);
  }

  if (target.hp <= 0) {
    king.killsCount += 1;
    handleUnitDeath(state, lane, target, null);
  }
}

export function applyDamageToKingHero(
  state: MatchState,
  lane: LaneState,
  king: KingState,
  rawDamage: number,
  attackType: CombatUnit['attackType']
): void {
  if (king.isDead) return;

  const calc = calculateDamage({
    baseDamage: rawDamage,
    attackType,
    defenseType: king.defenseType,
    targetArmor: king.armor,
  });

  let dmg = calc.finalDamage;
  if (king.shield > 0) {
    const absorbed = Math.min(king.shield, dmg);
    king.shield -= absorbed;
    dmg -= absorbed;
  }

  king.hp -= dmg;

  if (king.hp <= 0) {
    king.hp = 0;
    king.isDead = true;
    king.status = 'FALLEN';
    king.fallenX = king.x;
    king.fallenY = king.y;
    king.respawnTimer = king.maxRespawnTime;
    king.deathsCount += 1;
    king.targetX = null;
    king.targetY = null;

    if (!lane.skillEffects) lane.skillEffects = [];
    lane.skillEffects.push({
      id: nextId('kfx_fallen'),
      laneId: lane.laneId,
      x: king.fallenX,
      y: king.fallenY,
      radius: 95,
      color: '#F97316',
      ttl: 0.65,
      maxTtl: 0.65,
    });

    lane.floatingTexts.push({
      id: nextId('ft_kdead'),
      laneId: lane.laneId,
      x: king.fallenX,
      y: king.fallenY - 16,
      text: `KING FALLEN! HOLD BASE (${king.maxRespawnTime}s)`,
      color: '#F97316',
      ttl: 1.5,
      maxTtl: 1.5,
      isCrit: true,
    });
    state.combatLogs.unshift(
      `${king.name} entered FALLEN state! Hold the Citadel for ${king.maxRespawnTime}s until revival (Allied Defenders gain +20% ATK SPD & +6 ARM).`
    );
  }
}

function reviveFallenKing(state: MatchState, king: KingState): void {
  const primaryLane = getPrimaryLaneForTeam(state, king.teamId);
  king.isDead = false;
  king.status = 'ALIVE';
  king.respawnTimer = 0;
  king.hp = king.maxHp;
  king.shield = 280;
  king.x = KING_CONFIG.spawnX;
  king.y = KING_CONFIG.spawnY;
  king.targetX = null;
  king.targetY = null;

  if (!primaryLane.skillEffects) primaryLane.skillEffects = [];
  primaryLane.skillEffects.push({
    id: nextId('kfx_rebirth'),
    laneId: primaryLane.laneId,
    x: king.x,
    y: king.y,
    radius: 145,
    color: '#4ADE80',
    ttl: 0.6,
    maxTtl: 0.6,
  });

  // Sovereign Rebirth Shockwave: Damages & Stuns enemies besieging the Citadel!
  const attackers = primaryLane.combatUnits.filter(
    (u) => u.side === 'ATTACKER' && !u.isDead && !u.hasLeaked
  );
  for (const foe of attackers) {
    if (Math.hypot(foe.x - king.x, foe.y - king.y) <= 145) {
      applyDamageFromKing(
        state,
        primaryLane,
        king,
        foe,
        180 + king.magicPower,
        'Pure',
        true
      );
      if (!foe.isDead) {
        foe.statusEffects.push({
          type: 'Stun',
          value: 1,
          remainingDuration: 1.2,
          sourceId: `king_rebirth_${king.teamId}`,
        });
      }
    }
  }

  primaryLane.floatingTexts.push({
    id: nextId('ft_respawn'),
    laneId: primaryLane.laneId,
    x: king.x,
    y: king.y - 18,
    text: 'KING REVIVED!',
    color: '#4ADE80',
    ttl: 1.25,
    maxTtl: 1.25,
    isCrit: true,
  });
  state.combatLogs.unshift(
    `${king.name} has risen from the FALLEN state at the Citadel with a 280 HP Shield!`
  );
}

function stepLaneCombat(state: MatchState, lane: LaneState, dt: number): void {
  const activeSynergies = getActiveFactionSynergies(lane);
  const teamKing = state.kings[lane.teamId];
  const isKingPresentOnLane =
    getPrimaryLaneForTeam(state, lane.teamId).laneId === lane.laneId && !teamKing.isDead;

  for (let i = lane.floatingTexts.length - 1; i >= 0; i--) {
    lane.floatingTexts[i].ttl -= dt;
    lane.floatingTexts[i].y -= 18 * dt;
    if (lane.floatingTexts[i].ttl <= 0) {
      lane.floatingTexts.splice(i, 1);
    }
  }

  for (const unit of lane.combatUnits) {
    if (unit.hitFlashTimer > 0) {
      unit.hitFlashTimer = Math.max(0, unit.hitFlashTimer - dt);
    }
    if (unit.koTimer > 0) {
      unit.koTimer = Math.max(0, unit.koTimer - dt);
    }
  }

  const livingDefenders = lane.combatUnits.filter((u) => u.side === 'DEFENDER' && !u.isDead);
  const livingAttackers = lane.combatUnits.filter(
    (u) => u.side === 'ATTACKER' && !u.isDead && !u.hasLeaked
  );

  if (livingAttackers.length === 0 && !lane.clearedThisWave) {
    if (lane.leaksThisWave === 0) {
      lane.clearedThisWave = true;
    }
    const allyLaneId = getAlliedTeammateLaneId(state, lane.laneId);
    if (allyLaneId !== null && livingDefenders.length > 0) {
      const allyLane = state.lanes[allyLaneId];
      const allyAttackers = allyLane.combatUnits.filter(
        (u) => u.side === 'ATTACKER' && !u.isDead && !u.hasLeaked
      );
      if (allyAttackers.length > 0) {
        for (const survivor of livingDefenders) {
          const cloned: CombatUnit = {
            ...survivor,
            laneId: allyLane.laneId,
            y: Math.min(890, Math.max(340, survivor.y)),
            attackDamage: Math.round(
              survivor.attackDamage * ECONOMY_CONFIG.allyReinforceDamageMultiplier
            ),
            targetId: null,
          };
          allyLane.combatUnits.push(cloned);
          survivor.isDead = true;
        }
        state.combatLogs.unshift(
          `${lane.name} cleared their lane and reinforced ${allyLane.name}!`
        );
      }
    }
  }

  for (const merc of livingAttackers) {
    if (!merc.isMercenary) continue;
    if (merc.specialEffect === 'HealAllies') {
      merc.abilityCooldownTimer -= dt;
      if (merc.abilityCooldownTimer <= 0) {
        merc.abilityCooldownTimer = 3.5;
        for (const ally of livingAttackers) {
          if (Math.hypot(ally.x - merc.x, ally.y - merc.y) <= 130) {
            ally.hp = Math.min(ally.maxHp, ally.hp + (merc.specialEffectValue ?? 100));
          }
        }
      }
    }
  }

  for (const unit of lane.combatUnits) {
    if (unit.isDead || unit.hasLeaked) continue;

    let isStunned = false;
    let speedMult = 1.0;
    let armorOffset = 0;
    for (let s = unit.statusEffects.length - 1; s >= 0; s--) {
      const eff = unit.statusEffects[s];
      eff.remainingDuration -= dt;
      if (eff.type === 'Stun') isStunned = true;
      if (eff.type === 'Slow') speedMult = Math.min(speedMult, 1 - eff.value);
      if (eff.type === 'ArmorBreak') armorOffset -= eff.value;
      if (eff.type === 'AttackSpeedBuff') speedMult *= 1 + eff.value;
      if (eff.type === 'Burn') {
        unit.hp -= eff.value * dt;
        if (unit.hp <= 0) {
          handleUnitDeath(state, lane, unit, null);
          break;
        }
      }
      if (eff.remainingDuration <= 0) {
        unit.statusEffects.splice(s, 1);
      }
    }
    if (unit.isDead) continue;

    // Hold-the-Base Garrison Buff: While team's King is FALLEN, allied Defenders gain +6 Armor and +20% Attack Speed
    const holdBaseArmorBonus =
      unit.side === 'DEFENDER' && (teamKing.isDead || teamKing.status === 'FALLEN') ? 6 : 0;
    const holdBaseAtkSpdMult =
      unit.side === 'DEFENDER' && (teamKing.isDead || teamKing.status === 'FALLEN') ? 1.2 : 1.0;

    unit.armor = unit.baseArmor + armorOffset + holdBaseArmorBonus;
    unit.attackSpeed = unit.baseAttackSpeed * holdBaseAtkSpdMult;
    unit.movementSpeed = unit.baseMovementSpeed * speedMult;

    if (isStunned) continue;

    unit.attackCooldownTimer = Math.max(0, unit.attackCooldownTimer - dt);
    unit.abilityCooldownTimer = Math.max(0, unit.abilityCooldownTimer - dt);

    const enemies = unit.side === 'DEFENDER' ? livingAttackers : livingDefenders;

    // If Attacker has no living Defenders blocking it, check if the Hero King is intercepting it before marching to the Citadel Core!
    if (unit.side === 'ATTACKER' && enemies.length === 0) {
      if (isKingPresentOnLane) {
        const distToKing = Math.hypot(teamKing.x - unit.x, teamKing.y - unit.y);
        if (distToKing <= unit.attackRange + 8) {
          if (unit.attackCooldownTimer <= 0) {
            unit.attackCooldownTimer = 1 / Math.max(0.25, unit.attackSpeed);
            applyDamageToKingHero(state, lane, teamKing, unit.attackDamage, unit.attackType);
          }
          continue;
        } else if (distToKing <= 145) {
          // Move toward Hero King to fight him
          const dx = teamKing.x - unit.x;
          const dy = teamKing.y - unit.y;
          const len = Math.max(1, Math.hypot(dx, dy));
          unit.x += (dx / len) * unit.movementSpeed * dt;
          unit.y += (dy / len) * unit.movementSpeed * dt;
          continue;
        }
      }

      // Otherwise march straight to the Main Base / Citadel Core at y >= KING_CONFIG.citadelY - 12
      unit.y += unit.movementSpeed * 1.45 * dt;
      if (unit.y >= KING_CONFIG.citadelY - 12) {
        handleEnemyLeakToCitadel(state, lane, unit);
      }
      continue;
    }

    if (enemies.length === 0) continue;

    // Even when Defenders are alive, if an Attacker is right next to the Hero King, it can strike the King!
    if (unit.side === 'ATTACKER' && isKingPresentOnLane) {
      const distToKing = Math.hypot(teamKing.x - unit.x, teamKing.y - unit.y);
      if (distToKing <= unit.attackRange + 5) {
        if (unit.attackCooldownTimer <= 0) {
          unit.attackCooldownTimer = 1 / Math.max(0.25, unit.attackSpeed);
          applyDamageToKingHero(state, lane, teamKing, unit.attackDamage, unit.attackType);
        }
        continue;
      }
    }

    let target = enemies.find((e) => e.instanceId === unit.targetId && !e.isDead);
    if (!target) {
      target = selectTarget(unit, enemies);
      unit.targetId = target?.instanceId ?? null;
    }
    if (!target) continue;

    const dist = Math.hypot(target.x - unit.x, target.y - unit.y);

    if (
      unit.side === 'DEFENDER' &&
      unit.ability &&
      unit.abilityCooldownTimer <= 0 &&
      dist <= Math.max(unit.attackRange + 35, unit.ability.radius ?? 120)
    ) {
      executeFighterAbility(
        state,
        lane,
        unit,
        target,
        livingDefenders,
        livingAttackers,
        activeSynergies
      );
      unit.abilityCooldownTimer = unit.ability.cooldown;
    }

    if (dist <= unit.attackRange) {
      if (unit.attackCooldownTimer <= 0) {
        unit.attackCooldownTimer = 1 / Math.max(0.25, unit.attackSpeed);
        performUnitAttack(state, lane, unit, target, activeSynergies);
      }
    } else {
      const dx = target.x - unit.x;
      const dy = target.y - unit.y;
      const len = Math.max(1, Math.hypot(dx, dy));
      unit.x += (dx / len) * unit.movementSpeed * dt;
      unit.y += (dy / len) * unit.movementSpeed * dt;
    }
  }

  for (let p = lane.projectiles.length - 1; p >= 0; p--) {
    const proj = lane.projectiles[p];
    const targetUnit = lane.combatUnits.find((u) => u.instanceId === proj.targetId);
    if (targetUnit && !targetUnit.isDead) {
      proj.targetX = targetUnit.x;
      proj.targetY = targetUnit.y;
    }
    const dx = proj.targetX - proj.x;
    const dy = proj.targetY - proj.y;
    const dist = Math.hypot(dx, dy);
    const stepDist = proj.speed * dt;

    if (dist <= stepDist + 8) {
      if (targetUnit && !targetUnit.isDead && !targetUnit.hasLeaked) {
        const sourceUnit = lane.combatUnits.find((u) => u.instanceId === proj.sourceId) ?? null;
        applyCombatDamage(state, lane, sourceUnit, targetUnit, proj.damage, proj.attackType, false);
        if (proj.onHitStatus && !targetUnit.isDead) {
          targetUnit.statusEffects.push({
            type: proj.onHitStatus.type,
            value: proj.onHitStatus.value,
            remainingDuration: proj.onHitStatus.duration,
            sourceId: proj.sourceId,
          });
        }
      }
      lane.projectiles.splice(p, 1);
    } else {
      proj.x += (dx / dist) * stepDist;
      proj.y += (dy / dist) * stepDist;
    }
  }
}

function selectTarget(unit: CombatUnit, candidates: CombatUnit[]): CombatUnit | undefined {
  if (candidates.length === 0) return undefined;
  const prio = unit.targetingPriority;

  if (prio === 'BossFirst') {
    const boss = candidates.find((c) => c.isBoss);
    if (boss) return boss;
  }
  if (prio === 'LowestHP') {
    return [...candidates].sort((a, b) => a.hp - b.hp)[0];
  }
  if (prio === 'HighestDPS') {
    return [...candidates].sort(
      (a, b) => b.attackDamage * b.attackSpeed - a.attackDamage * a.attackSpeed
    )[0];
  }
  if (prio === 'Backline') {
    return [...candidates].sort((a, b) => a.y - b.y)[0];
  }
  return [...candidates].sort(
    (a, b) =>
      Math.hypot(a.x - unit.x, a.y - unit.y) - Math.hypot(b.x - unit.x, b.y - unit.y)
  )[0];
}

function performUnitAttack(
  state: MatchState,
  lane: LaneState,
  attacker: CombatUnit,
  target: CombatUnit,
  activeSynergies: Set<FactionId>
): void {
  const isRanged = attacker.attackRange > 55;

  let auraDmgMult = 1.0;
  if (attacker.side === 'ATTACKER') {
    const auraMerc = lane.combatUnits.find(
      (u) =>
        u.side === 'ATTACKER' &&
        !u.isDead &&
        u.specialEffect === 'AttackAura' &&
        Math.hypot(u.x - attacker.x, u.y - attacker.y) <= 150
    );
    if (auraMerc && auraMerc.specialEffectValue) {
      auraDmgMult += auraMerc.specialEffectValue;
    }
  }

  const effectiveBaseDmg = Math.round(attacker.attackDamage * auraDmgMult);

  if (isRanged) {
    lane.projectiles.push({
      id: nextId('proj'),
      laneId: lane.laneId,
      sourceId: attacker.instanceId,
      targetId: target.instanceId,
      x: attacker.x,
      y: attacker.y,
      targetX: target.x,
      targetY: target.y,
      speed: 340,
      damage: effectiveBaseDmg,
      attackType: attacker.attackType,
      splashRadius: 0,
      color: attacker.accentColor || attacker.color,
    });
  } else {
    const hasWildSynergy = attacker.faction === 'Wild' && activeSynergies.has('Wild');
    applyCombatDamage(
      state,
      lane,
      attacker,
      target,
      effectiveBaseDmg,
      attacker.attackType,
      hasWildSynergy
    );

    if (
      attacker.isMercenary &&
      attacker.specialEffect === 'ArmorBreak' &&
      !target.isDead
    ) {
      target.statusEffects.push({
        type: 'ArmorBreak',
        value: attacker.specialEffectValue ?? 4,
        remainingDuration: 4.0,
        sourceId: attacker.instanceId,
      });
    }
  }
}

function executeFighterAbility(
  state: MatchState,
  lane: LaneState,
  caster: CombatUnit,
  primaryTarget: CombatUnit,
  allies: CombatUnit[],
  enemies: CombatUnit[],
  activeSynergies: Set<FactionId>
): void {
  const ab = caster.ability;
  if (!ab) return;

  const hasArcaneSynergy = caster.faction === 'Arcane' && activeSynergies.has('Arcane');
  const abPowerMult = hasArcaneSynergy ? 1.22 : 1.0;
  const val = Math.round(ab.value * abPowerMult);

  switch (ab.effectType) {
    case 'CleaveAoE':
    case 'ManaBurst':
    case 'FreezeNova': {
      const radius = ab.radius ?? 95;
      for (const foe of enemies) {
        if (Math.hypot(foe.x - primaryTarget.x, foe.y - primaryTarget.y) <= radius) {
          applyCombatDamage(state, lane, caster, foe, val, caster.attackType, false);
          if (ab.effectType === 'FreezeNova' && !foe.isDead) {
            foe.statusEffects.push({
              type: 'Stun',
              value: 1,
              remainingDuration: ab.duration ?? 1.2,
              sourceId: caster.instanceId,
            });
          }
        }
      }
      break;
    }
    case 'ChainLightning': {
      const targets = enemies.slice(0, 4);
      for (const foe of targets) {
        applyCombatDamage(state, lane, caster, foe, val, 'Magic', false);
      }
      break;
    }
    case 'HealAlly': {
      const injured = [...allies].sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
      if (injured) {
        injured.hp = Math.min(injured.maxHp, injured.hp + val);
        lane.floatingTexts.push({
          id: nextId('ft'),
          laneId: lane.laneId,
          x: injured.x,
          y: injured.y - 10,
          text: `+${val}`,
          color: '#4ADE80',
          ttl: 0.75,
          maxTtl: 0.75,
        });
      }
      break;
    }
    case 'ShieldSelf': {
      caster.shield += val;
      caster.hp = Math.min(caster.maxHp, caster.hp + Math.round(val * 0.25));
      break;
    }
    case 'ThornsReflect': {
      caster.hp = Math.min(caster.maxHp, caster.hp + val);
      for (const foe of enemies) {
        if (Math.hypot(foe.x - caster.x, foe.y - caster.y) <= 65) {
          applyCombatDamage(state, lane, caster, foe, Math.round(val * 0.8), 'Impact', false);
        }
      }
      break;
    }
    case 'BurnDoT': {
      primaryTarget.statusEffects.push({
        type: 'Burn',
        value: val,
        remainingDuration: ab.duration ?? 3.0,
        sourceId: caster.instanceId,
      });
      break;
    }
    case 'ArmorSunder': {
      primaryTarget.statusEffects.push({
        type: 'ArmorBreak',
        value: val,
        remainingDuration: ab.duration ?? 4.0,
        sourceId: caster.instanceId,
      });
      applyCombatDamage(state, lane, caster, primaryTarget, val * 10, caster.attackType, false);
      break;
    }
    case 'StunStrike': {
      primaryTarget.statusEffects.push({
        type: 'Stun',
        value: 1,
        remainingDuration: ab.duration ?? 1.1,
        sourceId: caster.instanceId,
      });
      applyCombatDamage(state, lane, caster, primaryTarget, val, caster.attackType, false);
      break;
    }
    case 'CritExecute':
    case 'TrueDamageBolt': {
      applyCombatDamage(
        state,
        lane,
        caster,
        primaryTarget,
        val,
        ab.effectType === 'TrueDamageBolt' ? 'Pure' : caster.attackType,
        true
      );
      break;
    }
    case 'AttackSpeedAura':
    case 'LifestealAura': {
      const radius = ab.radius ?? 140;
      for (const ally of allies) {
        if (Math.hypot(ally.x - caster.x, ally.y - caster.y) <= radius) {
          ally.statusEffects.push({
            type: 'AttackSpeedBuff',
            value: ab.value < 1 ? ab.value : 0.2,
            remainingDuration: ab.duration ?? 3.5,
            sourceId: caster.instanceId,
          });
        }
      }
      if (ab.value > 10) {
        applyCombatDamage(state, lane, caster, primaryTarget, val, caster.attackType, false);
      }
      break;
    }
    default:
      break;
  }
}

function applyCombatDamage(
  state: MatchState,
  lane: LaneState,
  attacker: CombatUnit | null,
  target: CombatUnit,
  baseDamage: number,
  attackType: CombatUnit['attackType'],
  guaranteedCrit: boolean
): void {
  if (target.isDead || target.hasLeaked) return;

  const calc = calculateDamage({
    baseDamage,
    attackType,
    defenseType: target.defenseType,
    targetArmor: target.armor,
    critChance: guaranteedCrit ? 1.0 : 0,
    critMultiplier: 1.5,
    deterministicRoll: 0.0,
  });

  let dmgRemaining = calc.finalDamage;

  if (target.shield > 0) {
    const absorbed = Math.min(target.shield, dmgRemaining);
    target.shield -= absorbed;
    dmgRemaining -= absorbed;
  }

  target.hp -= dmgRemaining;
  target.hitFlashTimer = 0.08;

  if (attacker) {
    attacker.damageDealtThisWave += calc.finalDamage;
    lane.totalDamageDealt += calc.finalDamage;

    if (attacker.side === 'DEFENDER') {
      const placed = state.lanes[attacker.ownerLaneId]?.placedFighters.find(
        (p) => p.instanceId === attacker.instanceId
      );
      if (placed) {
        placed.totalDamageDealt += Math.round(calc.finalDamage);
      }

      if (attacker.faction === 'Undead') {
        const heal = Math.round(calc.finalDamage * 0.16);
        attacker.hp = Math.min(attacker.maxHp, attacker.hp + heal);
      }
    }
  }

  if (calc.isCritical || calc.finalDamage >= 85) {
    lane.floatingTexts.push({
      id: nextId('ft'),
      laneId: lane.laneId,
      x: target.x + ((idCounter % 3) - 1) * 8,
      y: target.y - 12,
      text: `${Math.round(calc.finalDamage)}${calc.isCritical ? '!' : ''}`,
      color: calc.isCritical ? '#FBBF24' : '#F8FAFC',
      ttl: 0.65,
      maxTtl: 0.65,
      isCrit: calc.isCritical,
    });
  }

  if (target.hp <= 0) {
    handleUnitDeath(state, lane, target, attacker);
  }
}

function handleUnitDeath(
  state: MatchState,
  lane: LaneState,
  victim: CombatUnit,
  killer: CombatUnit | null
): void {
  if (victim.isDead) return;
  victim.hp = 0;
  victim.isDead = true;
  victim.koTimer = 0.35;

  if (victim.isBoss) {
    state.hitstopTimer = 0.06;
  }

  if (victim.side === 'ATTACKER') {
    lane.gold += victim.bountyGold;
    if (killer && killer.side === 'DEFENDER') {
      killer.killsThisWave += 1;
      const placed = state.lanes[killer.ownerLaneId]?.placedFighters.find(
        (p) => p.instanceId === killer.instanceId
      );
      if (placed) {
        placed.kills += 1;
      }
    }
  }
}

/**
 * Handles an Enemy leaking past all defenders and the Hero King to attack the Main Base (Citadel Core).
 */
function handleEnemyLeakToCitadel(
  state: MatchState,
  lane: LaneState,
  leaker: CombatUnit
): void {
  if (leaker.isDead || leaker.hasLeaked) return;
  leaker.hasLeaked = true;

  lane.leaksThisWave += 1;
  lane.totalLeaks += 1;
  lane.clearedThisWave = false;

  const king = state.kings[lane.teamId];
  if (!king) return;

  const hpRatio = Math.max(0.25, leaker.hp / leaker.maxHp);
  const citadelMitigation = 100 / (100 + king.citadelArmor * 3.5);
  const rawCitadelDmg =
    (leaker.attackDamage * 2.4 + leaker.hp * 0.18) *
    leaker.leakDamageFactor *
    hpRatio;
  const finalCitadelDmg = Math.max(15, Math.round(rawCitadelDmg * citadelMitigation));

  king.citadelHp = Math.max(0, king.citadelHp - finalCitadelDmg);

  lane.floatingTexts.push({
    id: nextId('ft_citadel'),
    laneId: lane.laneId,
    x: 215,
    y: KING_CONFIG.citadelY - 19,
    text: `-${finalCitadelDmg} CITADEL HP`,
    color: '#EF4444',
    ttl: 1.1,
    maxTtl: 1.1,
    isCrit: true,
  });
}

// ============================================================================
// WAVE COMPLETION, CITADEL VICTORY/DEFEAT & NEXT WAVE TRANSITION
// ============================================================================

export function resolveWaveCompletion(state: MatchState): void {
  const wave = WAVE_MAP[state.waveNumber] ?? WAVE_MAP[1];
  const westKing = state.kings[0];
  const eastKing = state.kings[1];

  // 1. Check if either or both Main Bases (Citadel Cores) were destroyed
  if (westKing.citadelHp <= 0 || eastKing.citadelHp <= 0) {
    if (westKing.citadelHp <= 0 && eastKing.citadelHp <= 0) {
      state.winnerTeam = 'DRAW';
      state.phase = 'DEFEAT';
      state.combatLogs.unshift('Both Citadel Cores fell simultaneously! The battle ends in a Draw.');
    } else if (eastKing.citadelHp <= 0) {
      state.winnerTeam = 0;
      state.phase = 'VICTORY';
      state.combatLogs.unshift('Enemy Citadel Core Destroyed! Victory for the West Alliance!');
    } else {
      state.winnerTeam = 1;
      state.phase = 'DEFEAT';
      state.combatLogs.unshift('Your Citadel Core has fallen! Defeat.');
    }
    recordMatchHistory(state);
    return;
  }

  // 2. Calculate Clear Rewards, Income Payout, and MVP per lane
  const laneSummaries: WaveResultSummary['laneSummaries'] = [];

  for (const lane of state.lanes) {
    const cleared = lane.leaksThisWave === 0;
    lane.clearedThisWave = cleared;

    const clearBonus = cleared
      ? Math.round(
          wave.clearRewardBonus *
            (lane.selectedSpellId === 'spell_venture_capital' && lane.activeSpellTimer > 0
              ? 1.25
              : 1.0)
        )
      : Math.round(wave.clearRewardBonus * 0.35);

    const goldEarned = clearBonus + lane.income;
    lane.gold += goldEarned;

    if (lane.spellCooldownWaves > 0) {
      lane.spellCooldownWaves -= 1;
    }
    lane.activeSpellTimer = 0;

    const defenders = lane.combatUnits.filter((u) => u.side === 'DEFENDER');
    const mvp = [...defenders].sort((a, b) => b.damageDealtThisWave - a.damageDealtThisWave)[0];

    laneSummaries.push({
      laneId: lane.laneId,
      laneName: lane.name,
      teamId: lane.teamId,
      cleared,
      leakedCount: lane.leaksThisWave,
      goldEarned,
      kingDamageDealt: lane.leaksThisWave * 45,
      mvpFighterName: mvp?.name ?? 'Hero King',
      mvpDamage: Math.round(mvp?.damageDealtThisWave ?? 0),
    });
  }

  // 3. Apply End-of-Wave Citadel Regeneration & Hero King Restoration
  for (const king of state.kings) {
    if (king.citadelHp > 0) {
      const teamLeaked = state.lanes
        .filter((l) => l.teamId === king.teamId)
        .some((l) => l.leaksThisWave > 0);
      const regenAmount = teamLeaked
        ? Math.round(king.regenUpgradeLevel * KING_CONFIG.regenUpgradeBonusPerWave * 0.5)
        : king.regenerationPerWave;
      king.citadelHp = Math.min(king.citadelMaxHp, king.citadelHp + regenAmount);
    }
    if (!king.isDead) {
      king.hp = Math.min(king.maxHp, king.hp + Math.round(king.maxHp * 0.35));
    }
  }

  state.lastWaveResult = {
    waveNumber: state.waveNumber,
    waveName: wave.name,
    laneSummaries,
    westKingHp: westKing.citadelHp,
    eastKingHp: eastKing.citadelHp,
  };

  if (state.waveNumber >= 21) {
    const westPct = westKing.citadelHp / westKing.citadelMaxHp;
    const eastPct = eastKing.citadelHp / eastKing.citadelMaxHp;
    if (Math.abs(westPct - eastPct) < 0.001) {
      state.winnerTeam = 'DRAW';
      state.phase = 'VICTORY';
    } else if (westPct > eastPct) {
      state.winnerTeam = 0;
      state.phase = 'VICTORY';
      state.combatLogs.unshift(
        'Wave 21 Complete! West Alliance prevails with superior Citadel Core integrity!'
      );
    } else {
      state.winnerTeam = 1;
      state.phase = 'DEFEAT';
      state.combatLogs.unshift(
        'Wave 21 Complete! East Pact prevails with higher Citadel Core integrity.'
      );
    }
    recordMatchHistory(state);
    return;
  }

  state.phase = 'RESULT';
  state.phaseTimer = ECONOMY_CONFIG.resultPhaseDurationSeconds;
}

export function advanceToNextWaveBuildPhase(state: MatchState): void {
  if (state.waveNumber >= 21) return;
  state.waveNumber += 1;
  state.phase = 'BUILD';
  state.phaseTimer = state.buildPhaseDuration;
  state.battleElapsedSeconds = 0;

  const nextRec = getRecommendedValueForWave(state.waveNumber);
  for (const lane of state.lanes) {
    lane.recommendedValue = nextRec;
    lane.combatUnits = [];
    lane.projectiles = [];
    lane.floatingTexts = [];
    lane.skillEffects = [];
    lane.inboundMercenaries = [];
    lane.leaksThisWave = 0;
  }

  const nextWave = WAVE_MAP[state.waveNumber];
  if (nextWave) {
    state.combatLogs.unshift(
      `Wave ${state.waveNumber} Build Phase: Prepare for ${nextWave.name} (${nextWave.defenseType} Armor / ${nextWave.attackType} Attack).`
    );
  }
}

// ============================================================================
// SAVE / LOAD GAME STATE & MATCH HISTORY PERSISTENCE
// ============================================================================

const SAVE_STORAGE_KEY = 'bastion_protocol_saved_match_v2';
const HISTORY_STORAGE_KEY = 'bastion_protocol_match_history_v2';

export function serializeMatchState(state: MatchState): string {
  return JSON.stringify(state);
}

export function deserializeMatchState(raw: string): MatchState | null {
  try {
    const parsed = JSON.parse(raw) as MatchState;
    if (
      !parsed ||
      typeof parsed.waveNumber !== 'number' ||
      !Array.isArray(parsed.lanes) ||
      !Array.isArray(parsed.kings) ||
      parsed.kings.length !== 2 ||
      typeof parsed.kings[0].citadelHp !== 'number'
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function saveMatchToStorage(state: MatchState): boolean {
  try {
    if (typeof localStorage === 'undefined') return false;
    localStorage.setItem(SAVE_STORAGE_KEY, serializeMatchState(state));
    return true;
  } catch {
    return false;
  }
}

export function loadMatchFromStorage(): MatchState | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(SAVE_STORAGE_KEY);
    if (!raw) return null;
    return deserializeMatchState(raw);
  } catch {
    return null;
  }
}

export function recordMatchHistory(state: MatchState): void {
  try {
    if (typeof localStorage === 'undefined') return;
    const playerLane = state.lanes[0];
    if (!playerLane) return;

    const record: MatchHistoryRecord = {
      id: state.matchId,
      timestamp: Date.now(),
      mode: state.mode,
      difficulty: state.aiDifficulty,
      faction: playerLane.selectedFaction,
      waveReached: state.waveNumber,
      outcome:
        state.winnerTeam === 0
          ? 'VICTORY'
          : state.winnerTeam === 1
          ? 'DEFEAT'
          : 'DRAW',
      finalFighterValue: playerLane.fighterValue,
      finalIncome: playerLane.income,
      westKingHpPercent: Math.round(
        (state.kings[0].citadelHp / state.kings[0].citadelMaxHp) * 100
      ),
      eastKingHpPercent: Math.round(
        (state.kings[1].citadelHp / state.kings[1].citadelMaxHp) * 100
      ),
    };

    const existing = getMatchHistory();
    const filtered = existing.filter((r) => r.id !== record.id);
    filtered.unshift(record);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(filtered.slice(0, 20)));
  } catch {
    // ignore storage errors
  }
}

export function getMatchHistory(): MatchHistoryRecord[] {
  try {
    if (typeof localStorage === 'undefined') return [];
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
