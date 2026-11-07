import { AttackType, DefenseType } from './types';

/**
 * Complete 5x5 Attack Type vs Defense Type Multiplier Matrix
 * Values represent percentage multipliers (e.g. 1.25 = 125% damage, 0.75 = 75% damage)
 *
 * Counter relationships:
 * - Pierce excels vs Light (1.30x) & Arcane (1.15x), weak vs Heavy (0.75x) & Massive (0.80x)
 * - Impact excels vs Heavy (1.30x) & Medium (1.15x), weak vs Light (0.80x) & Arcane (0.85x)
 * - Magic excels vs Arcane (1.30x) & Heavy (1.20x), weak vs Medium (0.75x) & Massive (0.85x)
 * - Siege excels vs Massive (1.35x) & Medium (1.20x), weak vs Light (0.75x)
 * - Pure deals unmitigated 1.00x across all Defense Types (1.05x vs Massive)
 */
export const DAMAGE_MULTIPLIER_MATRIX: Record<AttackType, Record<DefenseType, number>> = {
  Pierce: {
    Light: 1.30,
    Medium: 1.00,
    Heavy: 0.75,
    Arcane: 1.15,
    Massive: 0.80,
  },
  Impact: {
    Light: 0.80,
    Medium: 1.15,
    Heavy: 1.30,
    Arcane: 0.85,
    Massive: 1.00,
  },
  Magic: {
    Light: 1.00,
    Medium: 0.75,
    Heavy: 1.20,
    Arcane: 1.30,
    Massive: 0.85,
  },
  Siege: {
    Light: 0.75,
    Medium: 1.20,
    Heavy: 1.05,
    Arcane: 0.90,
    Massive: 1.35,
  },
  Pure: {
    Light: 1.00,
    Medium: 1.00,
    Heavy: 1.00,
    Arcane: 1.00,
    Massive: 1.05,
  },
};

export interface DamageCalculationInput {
  baseDamage: number;
  attackType: AttackType;
  defenseType: DefenseType;
  targetArmor: number;
  attackerDamageMultiplier?: number; // e.g. 1.15 for +15% buff
  targetVulnerabilityMultiplier?: number; // e.g. 1.10 for +10% damage taken debuff
  critChance?: number; // 0..1
  critMultiplier?: number; // default 1.5
  deterministicRoll?: number; // 0..1 for deterministic unit tests
  flatTrueDamageBonus?: number;
}

export interface DamageCalculationResult {
  finalDamage: number;
  typeMultiplier: number;
  armorMultiplier: number;
  isCritical: boolean;
}

/**
 * Returns the type counter multiplier from the balance matrix.
 */
export function getTypeMultiplier(attackType: AttackType, defenseType: DefenseType): number {
  const row = DAMAGE_MULTIPLIER_MATRIX[attackType];
  if (!row) return 1.0;
  return row[defenseType] ?? 1.0;
}

/**
 * Calculates armor mitigation multiplier.
 * Pure attack type ignores positive armor reduction!
 * Positive armor reduces damage via: 100 / (100 + armor * 3.5)
 * Negative armor (from ArmorBreak debuffs) amplifies damage up to +50%.
 */
export function getArmorMultiplier(attackType: AttackType, armor: number): number {
  if (attackType === 'Pure' && armor > 0) {
    return 1.0;
  }
  const clampedArmor = Math.max(-30, Math.min(200, armor));
  if (clampedArmor >= 0) {
    return 100 / (100 + clampedArmor * 3.5);
  } else {
    // Negative armor increases damage taken
    return 1 + Math.min(0.5, Math.abs(clampedArmor) * 0.02);
  }
}

/**
 * Independent, deterministic Damage Calculation Service.
 * Prevents NaN, negative damage, or runaway multipliers.
 */
export function calculateDamage(input: DamageCalculationInput): DamageCalculationResult {
  const rawBase = Math.max(0, Number.isFinite(input.baseDamage) ? input.baseDamage : 0);
  const typeMultiplier = getTypeMultiplier(input.attackType, input.defenseType);
  const armorMultiplier = getArmorMultiplier(input.attackType, input.targetArmor);

  const atkBuff = Math.max(0.1, Math.min(4.0, input.attackerDamageMultiplier ?? 1.0));
  const vulnDebuff = Math.max(0.1, Math.min(3.0, input.targetVulnerabilityMultiplier ?? 1.0));

  const critChance = Math.max(0, Math.min(1, input.critChance ?? 0));
  const critMult = Math.max(1.0, Math.min(3.5, input.critMultiplier ?? 1.5));
  const roll = input.deterministicRoll ?? 1.0; // Only crits if roll < critChance
  const isCritical = critChance > 0 && roll < critChance;

  const mitigated =
    rawBase *
    typeMultiplier *
    armorMultiplier *
    atkBuff *
    vulnDebuff *
    (isCritical ? critMult : 1.0);

  const trueBonus = Math.max(0, input.flatTrueDamageBonus ?? 0);
  const finalDamage = Math.max(1, Math.round((mitigated + trueBonus) * 10) / 10);

  return {
    finalDamage: rawBase === 0 && trueBonus === 0 ? 0 : finalDamage,
    typeMultiplier,
    armorMultiplier: Math.round(armorMultiplier * 1000) / 1000,
    isCritical,
  };
}
