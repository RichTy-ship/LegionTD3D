export type AttackType = 'Pierce' | 'Impact' | 'Magic' | 'Siege' | 'Pure';
export type DefenseType = 'Light' | 'Medium' | 'Heavy' | 'Arcane' | 'Massive';

export type FactionId =
  | 'Inferno'
  | 'Undead'
  | 'Nature'
  | 'Mechanic'
  | 'Abyss'
  | 'Wild'
  | 'Divine'
  | 'Arcane';

export type FighterRole =
  | 'Tank'
  | 'DPS'
  | 'AoE'
  | 'Support'
  | 'Aura'
  | 'Carry'
  | 'Specialist';

export type TargetingPriority =
  | 'Nearest'
  | 'LowestHP'
  | 'HighestDPS'
  | 'Backline'
  | 'BossFirst';

export type FighterRarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';

export type AbilityEffectType =
  | 'CleaveAoE'
  | 'ChainLightning'
  | 'HealAlly'
  | 'ShieldSelf'
  | 'BurnDoT'
  | 'SlowTarget'
  | 'StunStrike'
  | 'ArmorSunder'
  | 'AttackSpeedAura'
  | 'LifestealAura'
  | 'CritExecute'
  | 'ManaBurst'
  | 'ThornsReflect'
  | 'SummonWard'
  | 'TrueDamageBolt'
  | 'FreezeNova';

export interface FighterAbility {
  id: string;
  name: string;
  description: string;
  effectType: AbilityEffectType;
  cooldown: number; // seconds, 0 = passive/on-hit
  value: number; // damage, heal, shield, or percentage
  radius?: number; // for AoE or Aura
  duration?: number; // seconds for buffs/debuffs
}

export interface FighterConfig {
  id: string;
  name: string;
  faction: FactionId;
  tier: 1 | 2 | 3;
  baseFighterId?: string; // If tier 2 or 3, references the base unit
  cost: number; // Gold cost (for tier 2/3, this is the upgrade cost from previous tier)
  totalValue: number; // Total gold value on board
  hp: number;
  attackDamage: number;
  attackSpeed: number; // attacks per second
  attackRange: number; // 1 = melee (~42px), 2-5 = ranged (90-240px)
  armor: number;
  movementSpeed: number;
  attackType: AttackType;
  defenseType: DefenseType;
  ability: FighterAbility;
  upgradePaths: string[]; // IDs of evolved fighters
  targetingPriority: TargetingPriority;
  role: FighterRole;
  rarity: FighterRarity;
  color: string;
  accentColor: string;
}

export type MercenaryGroup =
  | 'Scout'
  | 'Brute'
  | 'Assassin'
  | 'Mage'
  | 'Siege Beast'
  | 'Titan';

export interface MercenaryConfig {
  id: string;
  name: string;
  group: MercenaryGroup;
  mythiumCost: number;
  incomeBonus: number;
  hp: number;
  damage: number;
  armor: number;
  attackSpeed: number;
  attackRange: number;
  movementSpeed: number;
  attackType: AttackType;
  defenseType: DefenseType;
  abilityName: string;
  abilityDescription: string;
  specialEffect: 'None' | 'AttackAura' | 'ArmorBreak' | 'HealAllies' | 'SiegeKing' | 'Evasion' | 'MagicShield';
  effectValue: number;
  color: string;
}

export type WaveCategory =
  | 'Normal'
  | 'Swarm'
  | 'Armor'
  | 'Flying'
  | 'Magic Resistant'
  | 'Boss'
  | 'Special';

export type WavePhaseName =
  | 'Early Game'
  | 'Mid Game'
  | 'Power Spike'
  | 'Late Game'
  | 'Final Battle'
  | 'Endless Ascension';

export interface WaveConfig {
  waveNumber: number; // 1 to 21
  name: string;
  phaseName: WavePhaseName;
  category: WaveCategory;
  enemyName: string;
  count: number;
  hp: number;
  damage: number;
  armor: number;
  attackSpeed: number;
  attackRange: number;
  movementSpeed: number;
  attackType: AttackType;
  defenseType: DefenseType;
  bountyPerUnit: number;
  clearRewardBonus: number;
  specialMechanic: string;
  difficultyRating: number; // 1 to 10
  bossUnit?: {
    name: string;
    hp: number;
    damage: number;
    armor: number;
    attackType: AttackType;
    defenseType: DefenseType;
    abilityDescription: string;
  };
}

export interface FactionConfig {
  id: FactionId;
  name: string;
  tagline: string;
  lore: string;
  specialty: string;
  tactics: string;
  strengths: string[];
  weaknesses: string[];
  synergyName: string;
  synergyDescription: string;
  synergyThreshold: number; // e.g., 3 units of this faction
  synergyBonusType: 'attackDamage' | 'armor' | 'attackSpeed' | 'maxHp' | 'lifesteal' | 'abilityPower' | 'shieldStart' | 'critChance';
  synergyBonusValue: number;
  primaryColor: string;
  secondaryColor: string;
}

export type SpellCategory = 'Economy' | 'Defense' | 'Offense' | 'Support';

export interface LegionSpellConfig {
  id: string;
  name: string;
  category: SpellCategory;
  description: string;
  effectSummary: string;
  unlockWave: number; // Available from Wave 1 or Wave 11
  maxUsesPerMatch: number;
  cooldownWaves: number;
  mythiumCost: number;
  durationSeconds: number;
  accentColor: string;
}

export type KingSkillKey = 'Q' | 'E' | 'R';

export interface KingSkillConfig {
  key: KingSkillKey;
  id: string;
  name: string;
  description: string;
  cooldown: number; // seconds
  radius: number;
  baseDamage: number;
  shieldAmount?: number;
  healAmount?: number;
  stunDuration?: number;
  slowDuration?: number;
  accentColor: string;
}

export interface KingItemConfig {
  id: string;
  name: string;
  category: 'Weapon' | 'Armor' | 'Relic' | 'Citadel';
  goldCost: number;
  description: string;
  statSummary: string;
  bonusAttackDamage?: number;
  bonusMaxHp?: number;
  bonusArmor?: number;
  bonusMoveSpeed?: number;
  bonusAttackSpeed?: number;
  bonusLifesteal?: number;
  bonusMagicPower?: number;
  cooldownReduction?: number; // 0..0.5
  respawnReductionSeconds?: number;
  bonusAuraHealPerSec?: number;
  bonusAuraRadius?: number;
  bonusCitadelMaxHp?: number;
  accentColor: string;
}

export type AIDifficulty = 'Easy' | 'Normal' | 'Hard' | 'Expert';

export type MatchMode = '2v2' | '1v1' | 'Solo';

export type TurnPhase = 'BUILD' | 'BATTLE' | 'RESULT' | 'VICTORY' | 'DEFEAT';

export interface PlacedFighter {
  instanceId: string;
  fighterId: string;
  gridX: number; // 0 to 6 (7 columns)
  gridY: number; // 0 to 5 (6 rows)
  waveBought: number;
  kills: number;
  totalDamageDealt: number;
}

export interface QueuedMercenary {
  mercenaryId: string;
  count: number;
}

export interface StatusEffect {
  type: 'Burn' | 'Slow' | 'Stun' | 'ArmorBreak' | 'AttackSpeedBuff' | 'Shield';
  value: number;
  remainingDuration: number;
  sourceId: string;
}

export interface CombatUnit {
  instanceId: string;
  definitionId: string;
  name: string;
  side: 'DEFENDER' | 'ATTACKER' | 'KING';
  laneId: number; // 0..3
  ownerLaneId: number;
  x: number; // 0..430 inside lane coordinate space
  y: number; // 0..550 inside lane coordinate space
  radius: number;
  hp: number;
  maxHp: number;
  shield: number;
  attackDamage: number;
  baseAttackDamage: number;
  attackSpeed: number;
  baseAttackSpeed: number;
  attackRange: number; // in pixels
  armor: number;
  baseArmor: number;
  movementSpeed: number;
  baseMovementSpeed: number;
  attackType: AttackType;
  defenseType: DefenseType;
  targetingPriority: TargetingPriority;
  role?: FighterRole;
  faction?: FactionId;
  ability?: FighterAbility;
  abilityCooldownTimer: number;
  attackCooldownTimer: number;
  targetId: string | null;
  isBoss: boolean;
  isMercenary: boolean;
  isFlying: boolean;
  bountyGold: number;
  leakDamageFactor: number;
  statusEffects: StatusEffect[];
  color: string;
  accentColor: string;
  damageDealtThisWave: number;
  killsThisWave: number;
  hitFlashTimer: number;
  koTimer: number; // > 0 when dying topple animation is active
  isDead: boolean;
  hasLeaked: boolean;
  specialEffect?: MercenaryConfig['specialEffect'];
  specialEffectValue?: number;
}

export interface Projectile {
  id: string;
  laneId: number;
  sourceId: string;
  targetId: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speed: number;
  damage: number;
  attackType: AttackType;
  splashRadius: number;
  color: string;
  onHitStatus?: {
    type: StatusEffect['type'];
    value: number;
    duration: number;
  };
}

export interface FloatingText {
  id: string;
  laneId: number;
  x: number;
  y: number;
  text: string;
  color: string;
  ttl: number;
  maxTtl: number;
  isCrit?: boolean;
}

export interface SkillVisualEffect {
  id: string;
  laneId: number;
  x: number;
  y: number;
  radius: number;
  color: string;
  ttl: number;
  maxTtl: number;
}

export type LootDropType = 'GOLD_CACHE' | 'MYTHIUM_CRYSTAL' | 'BOSS_RELIC';

export interface LootDrop {
  id: string;
  laneId: number;
  x: number;
  y: number;
  type: LootDropType;
  name: string;
  goldAmount?: number;
  mythiumAmount?: number;
  itemId?: string;
  color: string;
  ttl: number;
}

export interface CampaignMissionPreset {
  id: string;
  actNumber: number;
  subtitle: string;
  title: string;
  description: string;
  lore: string;
  modifierLabel: string;
  mode: MatchMode;
  aiDifficulty: AIDifficulty;
  recommendedFaction: FactionId;
  recommendedSpellId: string;
  startingGoldBonus?: number;
  startingMythiumBonus?: number;
  startingWorkersBonus?: number;
  kingHpBonus?: number;
  endlessMode?: boolean;
}

export interface KingState {
  teamId: 0 | 1; // Team 0 = West Alliance (Player + Ally), Team 1 = East Pact (AI 1 + AI 2)
  name: string;
  // Hero King stats & free-roaming state
  hp: number;
  maxHp: number;
  shield: number;
  x: number;
  y: number;
  targetX: number | null;
  targetY: number | null;
  movementSpeed: number;
  attackDamage: number;
  attackSpeed: number;
  attackRange: number;
  armor: number;
  lifesteal: number;
  regenerationPerWave: number;
  magicPower: number;
  cooldownReduction: number;
  attackType: AttackType;
  defenseType: DefenseType;
  // Hero Death ('FALLEN' state) & Respawn Countdown
  status: 'ALIVE' | 'FALLEN';
  isDead: boolean;
  fallenX: number;
  fallenY: number;
  respawnTimer: number;
  maxRespawnTime: number;
  deathsCount: number;
  killsCount: number;
  // Hero Active Skills Cooldowns
  skillCooldowns: Record<KingSkillKey, number>;
  // Hero Equipped Items (purchased from Citadel Armory)
  inventory: string[];
  // Main Base / Citadel Core (Nhà Chính - Objective to Protect)
  citadelHp: number;
  citadelMaxHp: number;
  citadelArmor: number;
  healingAuraRadius: number;
  healingAuraHps: number;
  healingAuraLevel: number;
  // Mythium Upgrade Levels
  attackUpgradeLevel: number;
  defenseUpgradeLevel: number;
  regenUpgradeLevel: number;
  spellUpgradeLevel: number;
  attackCooldownTimer: number;
  abilityCooldownTimer: number;
  moveAnimTimer?: number;
  facingAngle?: number;
}

export interface LaneState {
  laneId: number; // 0 = Player, 1 = Ally AI, 2 = Enemy AI 1, 3 = Enemy AI 2
  name: string;
  teamId: 0 | 1;
  isHuman: boolean;
  aiDifficulty: AIDifficulty;
  selectedFaction: FactionId;
  gold: number;
  mythium: number;
  workers: number;
  income: number;
  fighterValue: number;
  recommendedValue: number;
  placedFighters: PlacedFighter[];
  outboundMercenaries: QueuedMercenary[];
  inboundMercenaries: QueuedMercenary[];
  selectedSpellId: string;
  spellUsesRemaining: number;
  spellCooldownWaves: number;
  activeSpellTimer: number;
  leaksThisWave: number;
  clearedThisWave: boolean;
  totalLeaks: number;
  totalMercsSent: number;
  totalDamageDealt: number;
  combatUnits: CombatUnit[];
  projectiles: Projectile[];
  floatingTexts: FloatingText[];
  skillEffects: SkillVisualEffect[];
  lootDrops?: LootDrop[];
  relicsCollected?: number;
}

export interface WaveResultSummary {
  waveNumber: number;
  waveName: string;
  laneSummaries: {
    laneId: number;
    laneName: string;
    teamId: 0 | 1;
    cleared: boolean;
    leakedCount: number;
    goldEarned: number;
    kingDamageDealt: number;
    mvpFighterName: string;
    mvpDamage: number;
  }[];
  westKingHp: number;
  eastKingHp: number;
}

export interface MatchState {
  matchId: string;
  mode: MatchMode;
  aiDifficulty: AIDifficulty;
  waveNumber: number; // 1..21 (or 22+ in Endless Mode)
  endlessMode?: boolean;
  campaignMissionId?: string;
  phase: TurnPhase;
  phaseTimer: number; // seconds remaining in current phase
  buildPhaseDuration: number;
  mythiumTickTimer: number; // counts up to 10s for worker production
  battleElapsedSeconds: number;
  simSpeed: 1 | 2 | 4;
  lanes: LaneState[];
  kings: [KingState, KingState]; // [Team 0 King & Citadel, Team 1 King & Citadel]
  activeViewedLaneId: number; // Which lane the player is currently inspecting
  lastWaveResult: WaveResultSummary | null;
  winnerTeam: 0 | 1 | 'DRAW' | null;
  combatLogs: string[];
  hitstopTimer: number;
}

export interface MatchHistoryRecord {
  id: string;
  timestamp: number;
  mode: MatchMode;
  difficulty: AIDifficulty;
  faction: FactionId;
  waveReached: number;
  outcome: 'VICTORY' | 'DEFEAT' | 'DRAW';
  finalFighterValue: number;
  finalIncome: number;
  westKingHpPercent: number;
  eastKingHpPercent: number;
  isEndless?: boolean;
  campaignMissionId?: string;
}
