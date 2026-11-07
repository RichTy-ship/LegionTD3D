import * as THREE from 'three';
import {
  FACTIONS,
  FIGHTERS,
  FIGHTER_MAP,
  KING_ITEMS,
  KING_ITEM_MAP,
  LEGION_SPELLS,
  MERCENARIES,
  MERCENARY_MAP,
  WAVES,
} from './config';
import { FactionId, FighterRole, MercenaryGroup } from './types';

export interface AssetBatchItem {
  id: string;
  name: string;
  batchNumber:
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
    | 24;
  category:
    | 'Hero & Citadel'
    | 'Legion Fighters'
    | 'Mercs & Bosses'
    | 'VFX & Relics'
    | 'Wave Creeps (1-21)'
    | 'Legion Spells 3D'
    | 'Battlefield Props'
    | 'Faction Sanctums 3D'
    | 'King Skills & Upgrades'
    | 'Ordnance & Trophies 3D'
    | 'Fighter Abilities 3D'
    | 'Synergies & Status 3D'
    | 'Campaign & Commanders 3D'
    | 'Counter Matrix & Roles 3D'
    | 'Economy & Finale 3D'
    | 'Tier-2 Ascension & Watchtowers 3D'
    | 'Astral Anomalies & Portals 3D'
    | 'Citadel Armory & Royal Relics 3D'
    | 'War Machines & Convoy Engines 3D'
    | 'Celestial Wonders & Pantheon #300'
    | 'War Banners, Radars & Flak 3D'
    | 'Elemental Titans & Sovereign #360'
    | 'Companion Spirits & Ballistics 3D'
    | 'Citadel Superweapons & Apex #420';
  partsCount: number;
  polyStyle: string;
  description: string;
  faction?: FactionId;
  previewType:
    | 'HERO_KING'
    | 'CITADEL_CORE'
    | 'BREACH_GATE'
    | 'MYTHIUM_QUARRY'
    | 'MYTHIUM_WORKER'
    | 'FIGHTER'
    | 'MERCENARY'
    | 'BOSS'
    | 'KING_RELIC'
    | 'SKILL_VFX'
    | 'WAVE_ENEMY'
    | 'LEGION_SPELL'
    | 'BATTLEFIELD_PROP'
    | 'FACTION_SANCTUM'
    | 'KING_SKILL_UPGRADE'
    | 'TACTICAL_ORDNANCE'
    | 'FIGHTER_ABILITY'
    | 'SYNERGY_STATUS'
    | 'CAMPAIGN_COMMANDER'
    | 'COUNTER_MATRIX_ROLE'
    | 'ECONOMY_FINALE'
    | 'TIER2_ASCENSION'
    | 'ASTRAL_ANOMALY'
    | 'CITADEL_ARMORY'
    | 'WAR_MACHINE_CONVOY'
    | 'CELESTIAL_WONDER'
    | 'WAR_BANNER_RADAR_FLAK'
    | 'ELEMENTAL_TITAN_SOVEREIGN'
    | 'COMPANION_BALLISTIC'
    | 'CITADEL_SUPERWEAPON_420';
  refId?: string;
  waveNumber?: number;
  isTier2?: boolean;
}

// ============================================================================
// COMPLETE 15-BATCH 3D ASSET CATALOG (200 MULTI-PART PBR 3D ASSETS — 100% COMPLETE)
// ============================================================================

const BATCH_1_HERO_AND_CITADEL: AssetBatchItem[] = [
  {
    id: 'asset_hero_king_west',
    name: 'Aegis Sovereign (West Hero King)',
    batchNumber: 1,
    category: 'Hero & Citadel',
    partsCount: 12,
    polyStyle: 'Articulated PBR Sovereign Champion',
    description:
      '12-part articulated 3D Hero King with brushed aurum cuirass, winged pauldrons, royal cape, crowned visor helm, Sunfire Greatsword, Aegis Shield, and live relic attachment sockets.',
    previewType: 'HERO_KING',
    refId: 'west',
  },
  {
    id: 'asset_hero_king_east',
    name: 'Crimson Dread-Sovereign (East Rival King)',
    batchNumber: 1,
    category: 'Hero & Citadel',
    partsCount: 12,
    polyStyle: 'Obsidian & Crimson Royal Warlord',
    description:
      '12-part opposing Commander King forged in crimson-gilt plate, horned obsidian crown, blood-rune heart core, and Doomfire Greatsword.',
    previewType: 'HERO_KING',
    refId: 'east',
  },
  {
    id: 'asset_citadel_sanctuary',
    name: 'Citadel Sanctuary Core (Nhà Chính)',
    batchNumber: 1,
    category: 'Hero & Citadel',
    partsCount: 10,
    polyStyle: 'Octagonal Bastion & Levitating Mana Core',
    description:
      '10-part Main Base monument with basalt octagonal foundation, 4 corner bastion turrets, levitating crystal core, counter-rotating runic rings, and emerald healing aura emitter.',
    previewType: 'CITADEL_CORE',
    refId: 'west',
  },
  {
    id: 'asset_breach_portal',
    name: 'Abyssal Breach Gate (Cổng Quái)',
    batchNumber: 1,
    category: 'Hero & Citadel',
    partsCount: 8,
    polyStyle: 'Obsidian Monolith Arch & Void Vortex',
    description:
      '8-part northern invasion portal with carved obsidian pillars, volcanic horn crowns, runic threshold slab, and rotating crimson void vortex.',
    previewType: 'BREACH_GATE',
  },
  {
    id: 'asset_mythium_quarry',
    name: 'Mythium Crystal Quarry (Mỏ Tinh Thể Mythium)',
    batchNumber: 1,
    category: 'Hero & Citadel',
    partsCount: 9,
    polyStyle: 'Crystalline Vein & Arcane Smelter',
    description:
      '9-part economic sanctuary structure behind the Citadel featuring raw purple Mythium crystal clusters, basalt extractor ring, and levitating mana condenser.',
    previewType: 'MYTHIUM_QUARRY',
  },
  {
    id: 'asset_mythium_worker',
    name: 'Automaton Mythium Miner (Worker 3D)',
    batchNumber: 1,
    category: 'Hero & Citadel',
    partsCount: 8,
    polyStyle: 'Clockwork Brass Harvester & Crystal Pick',
    description:
      '8-part non-combat economic Worker unit with brass dome chassis, optical mining lamp, dorsal Mythium crystal canister, and energized plasma pickaxe.',
    previewType: 'MYTHIUM_WORKER',
  },
];

const BATCH_2_FIGHTERS: AssetBatchItem[] = FIGHTERS.filter((f) => f.tier <= 2).map((f) => ({
  id: `asset_fgt_${f.id}`,
  name: `${f.name} (${f.faction} T${f.tier})`,
  batchNumber: 2 as const,
  category: 'Legion Fighters' as const,
  partsCount: f.tier >= 2 ? 10 : 8,
  polyStyle: `${f.faction} ${f.role} · ${f.attackType}/${f.defenseType}`,
  description: `${f.ability.name}: ${f.ability.description} (${f.cost}g · HP ${f.hp} · DMG ${f.attackDamage}).`,
  faction: f.faction,
  previewType: 'FIGHTER' as const,
  refId: f.id,
  isTier2: f.tier >= 2,
}));

const BATCH_3_MERCS_AND_BOSSES: AssetBatchItem[] = [
  ...MERCENARIES.map((m) => ({
    id: `asset_merc_${m.id}`,
    name: `${m.name} (${m.mythiumCost}M Merc)`,
    batchNumber: 3 as const,
    category: 'Mercs & Bosses' as const,
    partsCount: m.mythiumCost >= 80 ? 10 : 8,
    polyStyle: `${m.group} · ${m.attackType}/${m.defenseType}`,
    description: `${m.abilityName}: ${m.abilityDescription} (+${m.incomeBonus}g Income · HP ${m.hp} · DMG ${m.damage}).`,
    previewType: 'MERCENARY' as const,
    refId: m.id,
  })),
  {
    id: 'asset_boss_wave_7',
    name: 'Wave 7 Boss: Molten Colossus',
    batchNumber: 3,
    category: 'Mercs & Bosses',
    partsCount: 10,
    polyStyle: 'Volcanic Siege Dreadnought',
    description:
      'First major Boss wave colossus with basalt armor plates, magma fissure core, and twin seismic war-mauls.',
    previewType: 'BOSS',
    refId: 'boss_wave_7',
  },
  {
    id: 'asset_boss_wave_14',
    name: 'Wave 14 Boss: Abyssal Leviathan',
    batchNumber: 3,
    category: 'Mercs & Bosses',
    partsCount: 11,
    polyStyle: 'Deep-Trench Sovereign & Void Trident',
    description:
      'Mid-game Raid Boss armored in bioluminescent leviathan scales, crowned with tidal horns and a prismarine great-trident.',
    previewType: 'BOSS',
    refId: 'boss_wave_14',
  },
  {
    id: 'asset_boss_wave_18',
    name: 'Wave 18 Boss: Chrono Seraph',
    batchNumber: 3,
    category: 'Mercs & Bosses',
    partsCount: 11,
    polyStyle: 'Six-Winged Celestial Construct',
    description:
      'Late-game Pure-damage Raid Boss featuring 6 articulated golden wings, counter-rotating astrolabe rings, and solar lance.',
    previewType: 'BOSS',
    refId: 'boss_wave_18',
  },
  {
    id: 'asset_boss_apocalypse',
    name: 'Wave 21 Boss: Apocalypse Overlord',
    batchNumber: 3,
    category: 'Mercs & Bosses',
    partsCount: 12,
    polyStyle: 'Final Raid Boss Dreadnought & Hellfire Crown',
    description:
      'Final Wave 21 Raid Boss featuring towering obsidian dread-plate, 4 dorsal magma spires, winged demon helm, and Doomcleaver Halberd.',
    previewType: 'BOSS',
    refId: 'boss_wave_21',
  },
];

const BATCH_4_RELICS_AND_VFX: AssetBatchItem[] = [
  ...KING_ITEMS.slice(0, 8).map((item) => ({
    id: `asset_relic_${item.id}`,
    name: `${item.name} (${item.goldCost}g Relic)`,
    batchNumber: 4 as const,
    category: 'VFX & Relics' as const,
    partsCount: 8,
    polyStyle: `Citadel Armory ${item.category} Artifact`,
    description: `${item.statSummary} — ${item.description}`,
    previewType: 'KING_RELIC' as const,
    refId: item.id,
  })),
  {
    id: 'asset_vfx_cataclysm',
    name: 'Cataclysm Overdrive [R] (3D Skill VFX)',
    batchNumber: 4,
    category: 'VFX & Relics',
    partsCount: 9,
    polyStyle: 'Volumetric Meteor Core & Shockwave Rings',
    description:
      '9-part 3D ultimate skill effect featuring descending solar meteor prism, triple expanding shockwave rings, and molten basalt spikes.',
    previewType: 'SKILL_VFX',
    refId: 'vfx_cataclysm',
  },
  {
    id: 'asset_vfx_rebirth',
    name: 'Fallen King Rebirth Sanctuary (3D Respawn VFX)',
    batchNumber: 4,
    category: 'VFX & Relics',
    partsCount: 9,
    polyStyle: 'Phoenix Ankh Pillar & Hold-the-Base Garrison Ring',
    description:
      '9-part 3D resurrection shrine that manifests when the Hero King enters the FALLEN state, projecting the Hold-the-Base Garrison aura and Rebirth Nova.',
    previewType: 'SKILL_VFX',
    refId: 'vfx_rebirth',
  },
];

const BATCH_5_WAVE_ENEMIES: AssetBatchItem[] = WAVES.map((w) => ({
  id: `asset_wave_${w.waveNumber}`,
  name: `Wave ${w.waveNumber}: ${w.enemyName}`,
  batchNumber: 5 as const,
  category: 'Wave Creeps (1-21)' as const,
  partsCount: w.category === 'Boss' ? 11 : 9,
  polyStyle: `${w.category} · ${w.attackType}/${w.defenseType} (${w.count}x)`,
  description: `${w.name} (${w.phaseName}) — ${w.specialMechanic} (HP ${w.hp} · DMG ${w.damage} · Clear +${w.clearRewardBonus}g).`,
  previewType: 'WAVE_ENEMY' as const,
  waveNumber: w.waveNumber,
  refId: String(w.waveNumber),
}));

const BATCH_6_LEGION_SPELLS: AssetBatchItem[] = LEGION_SPELLS.map((sp) => ({
  id: `asset_spell_${sp.id}`,
  name: `${sp.name} (${sp.category} Spell)`,
  batchNumber: 6 as const,
  category: 'Legion Spells 3D' as const,
  partsCount: 9,
  polyStyle: `Wave ${sp.unlockWave}+ Tactical Spell Shrine`,
  description: `${sp.effectSummary} — ${sp.description}`,
  previewType: 'LEGION_SPELL' as const,
  refId: sp.id,
}));

const BATCH_7_BATTLEFIELD_PROPS: AssetBatchItem[] = [
  {
    id: 'asset_prop_brazier_pyre',
    name: 'Bastion Flame Brazier Tower (Tháp Lửa Chiến Trường)',
    batchNumber: 7,
    category: 'Battlefield Props',
    partsCount: 8,
    polyStyle: 'Gothic Basalt Pillar & Magma Fire Bowl',
    description:
      '8-part perimeter watch-brazier flanking the 7×6 tactical grid with carved basalt column, bronze cauldron, and flickering 3D ember crystals.',
    previewType: 'BATTLEFIELD_PROP',
    refId: 'prop_brazier_pyre',
  },
  {
    id: 'asset_prop_garrison_totem',
    name: 'Hold-the-Base Garrison War Totem (Chiến Kỳ Tử Thủ)',
    batchNumber: 7,
    category: 'Battlefield Props',
    partsCount: 9,
    polyStyle: 'Emergency Defense Standard (+20% ASPD / +6 ARM)',
    description:
      '9-part golden war-standard that rises in the defender formation whenever the Hero King enters the FALLEN state, rallying all allied fighters to hold the base.',
    previewType: 'BATTLEFIELD_PROP',
    refId: 'prop_garrison_totem',
  },
  {
    id: 'asset_prop_runic_obelisk',
    name: 'Runic Lane Waystone Obelisk (Cột Đá Cổ Ngữ)',
    batchNumber: 7,
    category: 'Battlefield Props',
    partsCount: 8,
    polyStyle: 'Carved Granite Monolith & Levitating Prism',
    description:
      '8-part ancient waystone obelisk marking the bridge boundary between the Northern Breach Zone and the Southern Citadel Sanctuary.',
    previewType: 'BATTLEFIELD_PROP',
    refId: 'prop_runic_obelisk',
  },
  {
    id: 'asset_prop_proj_ballistic',
    name: '3D Ballistic & Siege Ordnance (Đạn Đạo Vật Lý 3D)',
    batchNumber: 7,
    category: 'Battlefield Props',
    partsCount: 8,
    polyStyle: 'Pierce Javelin, Impact Maul & Siege Shell Cluster',
    description:
      '8-part 3D physical projectile showcase featuring armored siege shell with stabilizer fins, magma impact boulder, and high-velocity pierce bolt.',
    previewType: 'BATTLEFIELD_PROP',
    refId: 'prop_proj_ballistic',
  },
  {
    id: 'asset_prop_proj_arcane',
    name: '3D Arcane & Pure Celestial Nova (Đạn Đạo Phép Thuật 3D)',
    batchNumber: 7,
    category: 'Battlefield Props',
    partsCount: 8,
    polyStyle: 'Arcane Comet Star & Pure Solar Lance',
    description:
      '8-part 3D magical projectile showcase with counter-rotating mana rings, amethyst star core, and pure golden spearhead.',
    previewType: 'BATTLEFIELD_PROP',
    refId: 'prop_proj_arcane',
  },
  {
    id: 'asset_prop_bounty_chest',
    name: 'Wave Clear Golden Bounty Coffer (Rương Thưởng Dọn Sạch)',
    batchNumber: 7,
    category: 'Battlefield Props',
    partsCount: 8,
    polyStyle: 'Aurum-Bound Reliquary & Gold Ingot Hoard',
    description:
      '8-part war-chest awarded upon clearing an enemy wave with zero leaks, overflowing with minted gold bars and glowing Mythium gems.',
    previewType: 'BATTLEFIELD_PROP',
    refId: 'prop_bounty_chest',
  },
];

const BATCH_8_FACTION_SANCTUMS: AssetBatchItem[] = (
  Object.keys(FACTIONS) as FactionId[]
).map((fId) => {
  const f = FACTIONS[fId];
  return {
    id: `asset_sanctum_${fId.toLowerCase()}`,
    name: `${f.name} Sanctum (${fId} 3D Citadel)`,
    batchNumber: 8 as const,
    category: 'Faction Sanctums 3D' as const,
    partsCount: 10,
    polyStyle: `${f.specialty} · 10-Part Elemental Monument`,
    description: `${f.synergyName}: ${f.synergyDescription} — ${f.lore}`,
    faction: fId,
    previewType: 'FACTION_SANCTUM' as const,
    refId: fId,
  };
});

const BATCH_9_KING_SKILLS_AND_UPGRADES: AssetBatchItem[] = [
  {
    id: 'asset_skill_q_cleave',
    name: 'Royal Cleave [Q] (Sóng Kiếm Hoàng Gia 3D)',
    batchNumber: 9,
    category: 'King Skills & Upgrades',
    partsCount: 9,
    polyStyle: 'Aurum Crescent Blade Wave & Frost-Slow Runes',
    description:
      '9-part 3D active skill showcase for Hero King [Q]: sweeping aurum crescent arc, searing plasma wake, and 4 shattering slow shards.',
    previewType: 'KING_SKILL_UPGRADE',
    refId: 'skill_q_royal_cleave',
  },
  {
    id: 'asset_skill_e_aegis',
    name: 'Sovereign Aegis [E] (Vòm Khiên Hộ Vệ 3D)',
    batchNumber: 9,
    category: 'King Skills & Upgrades',
    partsCount: 10,
    polyStyle: '6-Shield Hexagonal Bastion Ring & Vitality Core',
    description:
      '10-part 3D active skill showcase for Hero King [E]: 6 orbiting hexagonal Aegis tower shields, celestial barrier torus, and emerald healing prism.',
    previewType: 'KING_SKILL_UPGRADE',
    refId: 'skill_e_sovereign_aegis',
  },
  {
    id: 'asset_skill_r_judgment',
    name: 'Cataclysm Judgment [R] (Thương Phán Quyết 3D)',
    batchNumber: 9,
    category: 'King Skills & Upgrades',
    partsCount: 10,
    polyStyle: 'Descending Orbital Solar Lance & Triple Shockwave',
    description:
      '10-part 3D ultimate skill showcase for Hero King [R]: orbital golden spearhead, triple expanding shockwave rings, and 4 volcanic eruption spires.',
    previewType: 'KING_SKILL_UPGRADE',
    refId: 'skill_r_cataclysm_judgment',
  },
  {
    id: 'asset_upg_king_attack',
    name: 'Mythium Upgrade: Sovereign Blade Forge (+ATK)',
    batchNumber: 9,
    category: 'King Skills & Upgrades',
    partsCount: 9,
    polyStyle: 'Royal Anvil, Crossed Greatswords & Mythium Core',
    description:
      '9-part 3D upgrade monument representing King Attack upgrades (+26 ATK per rank & +6g Income).',
    previewType: 'KING_SKILL_UPGRADE',
    refId: 'upg_king_attack',
  },
  {
    id: 'asset_upg_king_defense',
    name: 'Mythium Upgrade: Bastion Aegis Bulwark (+ARM/HP)',
    batchNumber: 9,
    category: 'King Skills & Upgrades',
    partsCount: 9,
    polyStyle: 'Fortified Dragonscale Shield Wall & Citadel Crest',
    description:
      '9-part 3D upgrade monument representing King Defense upgrades (+240 Max HP, +3 Armor & +6g Income).',
    previewType: 'KING_SKILL_UPGRADE',
    refId: 'upg_king_defense',
  },
  {
    id: 'asset_upg_king_regen',
    name: 'Mythium Upgrade: Sanctuary Fountain (+REGEN/AURA)',
    batchNumber: 9,
    category: 'King Skills & Upgrades',
    partsCount: 9,
    polyStyle: 'Emerald Vitality Chalice & Healing Aura Rings',
    description:
      '9-part 3D upgrade monument representing Citadel Healing Aura & Regen upgrades (+18 HPS Aura & +6g Income).',
    previewType: 'KING_SKILL_UPGRADE',
    refId: 'upg_king_regen',
  },
  {
    id: 'asset_upg_king_spell',
    name: 'Mythium Upgrade: Astral Grimoire Conduit (+MAGIC)',
    batchNumber: 9,
    category: 'King Skills & Upgrades',
    partsCount: 9,
    polyStyle: 'Levitating Runic Tome, Twin Staves & Mana Star',
    description:
      '9-part 3D upgrade monument representing King Spell Power upgrades (+30 Magic Power & +6g Income).',
    previewType: 'KING_SKILL_UPGRADE',
    refId: 'upg_king_spell',
  },
  {
    id: 'asset_vfx_ally_gate',
    name: '2v2 Ally Reinforcement Warp Gate (Cổng Tiếp Viện)',
    batchNumber: 9,
    category: 'King Skills & Upgrades',
    partsCount: 9,
    polyStyle: 'Twin Azure Warp Pylons & Cross-Lane Conduit',
    description:
      '9-part 3D warp gate positioned on the eastern bridge flank where surviving allied defenders teleport to reinforce their teammate.',
    previewType: 'KING_SKILL_UPGRADE',
    refId: 'vfx_ally_reinforce_gate',
  },
];

const BATCH_10_TACTICAL_ORDNANCE_AND_TROPHIES: AssetBatchItem[] = [
  {
    id: 'asset_ord_pierce_harpoon',
    name: 'Pierce Harpoon Ballista Bolt 3D (Lao Xuyên Phá)',
    batchNumber: 10,
    category: 'Ordnance & Trophies 3D',
    partsCount: 8,
    polyStyle: 'Barbed Steel Javelin & Sonic Wind Ring',
    description:
      '8-part 3D Pierce projectile model dealing 125% damage vs Light armor and 110% vs Arcane armor.',
    previewType: 'TACTICAL_ORDNANCE',
    refId: 'ord_pierce_harpoon',
  },
  {
    id: 'asset_ord_impact_meteor',
    name: 'Impact Seismic Magma Boulder 3D (Thiên Thạch Chấn Động)',
    batchNumber: 10,
    category: 'Ordnance & Trophies 3D',
    partsCount: 8,
    polyStyle: 'Fractured Basalt Core & Orbiting Magma Shards',
    description:
      '8-part 3D Impact projectile model dealing 125% damage vs Medium armor and 115% vs Heavy armor.',
    previewType: 'TACTICAL_ORDNANCE',
    refId: 'ord_impact_meteor',
  },
  {
    id: 'asset_ord_magic_starbolt',
    name: 'Magic Arcane Starbolt 3D (Tinh Cầu Phép Thuật)',
    batchNumber: 10,
    category: 'Ordnance & Trophies 3D',
    partsCount: 8,
    polyStyle: 'Amethyst Octahedron & Gyroscopic Mana Rings',
    description:
      '8-part 3D Magic projectile model dealing 130% damage vs Heavy armor and 110% vs Massive armor.',
    previewType: 'TACTICAL_ORDNANCE',
    refId: 'ord_magic_starbolt',
  },
  {
    id: 'asset_ord_siege_hellshell',
    name: 'Siege Hellfire Mortar Shell 3D (Đạn Pháo Công Thành)',
    batchNumber: 10,
    category: 'Ordnance & Trophies 3D',
    partsCount: 9,
    polyStyle: 'Brass Artillery Casing, 4 Fins & Thruster Core',
    description:
      '9-part 3D Siege artillery shell dealing 135% damage vs Massive Bosses and 115% vs Heavy armor.',
    previewType: 'TACTICAL_ORDNANCE',
    refId: 'ord_siege_hellshell',
  },
  {
    id: 'asset_ord_pure_solarlance',
    name: 'Pure Celestial Lance 3D (Thương Ánh Sáng Chuẩn)',
    batchNumber: 10,
    category: 'Ordnance & Trophies 3D',
    partsCount: 9,
    polyStyle: 'Radiant Aurum Spearhead & 4 Light Pinions',
    description:
      '9-part 3D Pure damage lance dealing unmitigated 100% true damage across all 5 defense types.',
    previewType: 'TACTICAL_ORDNANCE',
    refId: 'ord_pure_solarlance',
  },
  {
    id: 'asset_ord_merc_droppod',
    name: 'Mythium Mercenary Rift Pod 3D (Khoang Đổ Bộ Merc)',
    batchNumber: 10,
    category: 'Ordnance & Trophies 3D',
    partsCount: 9,
    polyStyle: 'Obsidian Rift Capsule & 4 Stabilizer Claws',
    description:
      '9-part 3D invasion pod that materializes beside the Northern Breach Gate whenever Mythium Mercenaries are queued.',
    previewType: 'TACTICAL_ORDNANCE',
    refId: 'ord_merc_droppod',
  },
  {
    id: 'asset_ord_leak_alarm',
    name: 'Citadel Breach Alarm Beacon 3D (Còi Báo Động Lọt Quái)',
    batchNumber: 10,
    category: 'Ordnance & Trophies 3D',
    partsCount: 8,
    polyStyle: 'Rotating Crimson Warning Prism & Siren Horns',
    description:
      '8-part 3D emergency warning beacon triggered when enemy wave creeps breach the defender formation and approach the Citadel.',
    previewType: 'TACTICAL_ORDNANCE',
    refId: 'ord_leak_breach_alarm',
  },
  {
    id: 'asset_ord_heal_bloom',
    name: 'Sanctuary Aura Healing Bloom 3D (Hoa Hồi Phục)',
    batchNumber: 10,
    category: 'Ordnance & Trophies 3D',
    partsCount: 8,
    polyStyle: 'Emerald Lotus Petals & Ascending Vitality Cross',
    description:
      '8-part 3D restoration bloom emitted by the Citadel Sanctuary Core while regenerating the Hero King.',
    previewType: 'TACTICAL_ORDNANCE',
    refId: 'ord_heal_sanctuary_bloom',
  },
  {
    id: 'asset_ord_victory_crown',
    name: 'Sovereign Victory Trophy Monument 3D (Đài Chiến Thắng)',
    batchNumber: 10,
    category: 'Ordnance & Trophies 3D',
    partsCount: 10,
    polyStyle: 'Laureled Aurum Crown, Crossed Blades & Rising Star',
    description:
      '10-part 3D grand championship trophy celebrating Wave 21 Apocalypse Overlord victory.',
    previewType: 'TACTICAL_ORDNANCE',
    refId: 'ord_victory_crown',
  },
  {
    id: 'asset_ord_defeat_ruin',
    name: 'Shattered Citadel Ruin 3D (Phế Tích Nhà Chính)',
    batchNumber: 10,
    category: 'Ordnance & Trophies 3D',
    partsCount: 9,
    polyStyle: 'Fractured Basalt Columns & Fallen Sovereign Crown',
    description:
      '9-part 3D diorama of a breached Citadel Sanctuary after its core HP falls to zero.',
    previewType: 'TACTICAL_ORDNANCE',
    refId: 'ord_defeat_ruin',
  },
];

const BATCH_11_FIGHTER_ABILITIES: AssetBatchItem[] = [
  {
    id: 'asset_abi_cleave_aoe',
    name: 'Magma Cleave Shockwave 3D (CleaveAoE)',
    batchNumber: 11,
    category: 'Fighter Abilities 3D',
    partsCount: 8,
    polyStyle: 'Sweeping Molten Arc & 4 Magma Shards',
    description:
      '8-part 3D fighter ability model for CleaveAoE: searing volcanic blade wave that cleaves adjacent enemies in a wide frontline arc.',
    previewType: 'FIGHTER_ABILITY',
    refId: 'CleaveAoE',
  },
  {
    id: 'asset_abi_chain_lightning',
    name: 'Arcane Chain Lightning Conduit 3D (ChainLightning)',
    batchNumber: 11,
    category: 'Fighter Abilities 3D',
    partsCount: 8,
    polyStyle: 'Tesla Coil Prism & 4 Forked Plasma Arcs',
    description:
      '8-part 3D fighter ability model for ChainLightning: high-voltage storm core jumping across multiple enemy targets.',
    previewType: 'FIGHTER_ABILITY',
    refId: 'ChainLightning',
  },
  {
    id: 'asset_abi_heal_ally',
    name: 'Verdant Mending Sanctuary Bloom 3D (HealAlly)',
    batchNumber: 11,
    category: 'Fighter Abilities 3D',
    partsCount: 8,
    polyStyle: 'Emerald Life-Cross & 4 Sylvan Petals',
    description:
      '8-part 3D fighter ability model for HealAlly: restorative nature blossom that mends the lowest-HP allied defender.',
    previewType: 'FIGHTER_ABILITY',
    refId: 'HealAlly',
  },
  {
    id: 'asset_abi_shield_self',
    name: 'Aegis Bulwark Barrier Prism 3D (ShieldSelf)',
    batchNumber: 11,
    category: 'Fighter Abilities 3D',
    partsCount: 8,
    polyStyle: 'Hexagonal Forcefield Plates & Aurum Core',
    description:
      '8-part 3D fighter ability model for ShieldSelf: interlocking golden barrier plates that absorb incoming wave damage.',
    previewType: 'FIGHTER_ABILITY',
    refId: 'ShieldSelf',
  },
  {
    id: 'asset_abi_burn_dot',
    name: 'Hellfire Ignition Pyre 3D (BurnDoT)',
    batchNumber: 11,
    category: 'Fighter Abilities 3D',
    partsCount: 8,
    polyStyle: 'Swirling Ember Vortex & 4 Flame Spires',
    description:
      '8-part 3D fighter ability model for BurnDoT: persistent volcanic fire pillar that scorches enemies over time.',
    previewType: 'FIGHTER_ABILITY',
    refId: 'BurnDoT',
  },
  {
    id: 'asset_abi_slow_target',
    name: 'Cryo-Rift Frost Shackle 3D (SlowTarget)',
    batchNumber: 11,
    category: 'Fighter Abilities 3D',
    partsCount: 8,
    polyStyle: 'Glacial Ice Monolith & 4 Sub-Zero Chains',
    description:
      '8-part 3D fighter ability model for SlowTarget: crystalline frost shackle that reduces enemy movement and attack speed.',
    previewType: 'FIGHTER_ABILITY',
    refId: 'SlowTarget',
  },
  {
    id: 'asset_abi_stun_strike',
    name: 'Seismic Concussion Maul 3D (StunStrike)',
    batchNumber: 11,
    category: 'Fighter Abilities 3D',
    partsCount: 8,
    polyStyle: 'Earthshaker War-Hammer & Impact Crater Ring',
    description:
      '8-part 3D fighter ability model for StunStrike: heavy kinetic war-maul that immobilizes frontline attackers.',
    previewType: 'FIGHTER_ABILITY',
    refId: 'StunStrike',
  },
  {
    id: 'asset_abi_armor_sunder',
    name: 'Sundered Carapace Breaker 3D (ArmorSunder)',
    batchNumber: 11,
    category: 'Fighter Abilities 3D',
    partsCount: 8,
    polyStyle: 'Fractured Shield Icon & Crimson Piercing Wedges',
    description:
      '8-part 3D fighter ability model for ArmorSunder: corrosive rending spikes that strip enemy armor plating.',
    previewType: 'FIGHTER_ABILITY',
    refId: 'ArmorSunder',
  },
  {
    id: 'asset_abi_aspd_aura',
    name: 'Warcaller Bloodlust Standard 3D (AttackSpeedAura)',
    batchNumber: 11,
    category: 'Fighter Abilities 3D',
    partsCount: 9,
    polyStyle: 'Tribal War-Horn Totem & Haste Wind Rings',
    description:
      '9-part 3D fighter ability model for AttackSpeedAura: primal war-totem accelerating the attack cadence of nearby allies.',
    previewType: 'FIGHTER_ABILITY',
    refId: 'AttackSpeedAura',
  },
  {
    id: 'asset_abi_lifesteal_aura',
    name: 'Necrotic Siphon Reliquary 3D (LifestealAura)',
    batchNumber: 11,
    category: 'Fighter Abilities 3D',
    partsCount: 9,
    polyStyle: 'Blood-Ruby Chalice & Soul-Drain Orbitals',
    description:
      '9-part 3D fighter ability model for LifestealAura: vampiric sanctuary reliquary granting lifesteal to nearby defenders.',
    previewType: 'FIGHTER_ABILITY',
    refId: 'LifestealAura',
  },
  {
    id: 'asset_abi_crit_execute',
    name: 'Assassin Guillotine Crosshair 3D (CritExecute)',
    batchNumber: 11,
    category: 'Fighter Abilities 3D',
    partsCount: 8,
    polyStyle: 'Twin Executioner Scythes & Target Reticle',
    description:
      '8-part 3D fighter ability model for CritExecute: lethal precision blades that deal massive critical damage to wounded targets.',
    previewType: 'FIGHTER_ABILITY',
    refId: 'CritExecute',
  },
  {
    id: 'asset_abi_mana_burst',
    name: 'Astral Supernova Detonation 3D (ManaBurst)',
    batchNumber: 11,
    category: 'Fighter Abilities 3D',
    partsCount: 9,
    polyStyle: 'Crystalline Star Core & Triple Arcane Rings',
    description:
      '9-part 3D fighter ability model for ManaBurst: concentrated arcane singularity that erupts in an AoE mana blast.',
    previewType: 'FIGHTER_ABILITY',
    refId: 'ManaBurst',
  },
  {
    id: 'asset_abi_thorns_reflect',
    name: 'Ironwood Bramble Carapace 3D (ThornsReflect)',
    batchNumber: 11,
    category: 'Fighter Abilities 3D',
    partsCount: 8,
    polyStyle: 'Spiked Bark Fortress & 6 Briar Needles',
    description:
      '8-part 3D fighter ability model for ThornsReflect: living ironwood thorn barrier that reflects melee damage back to attackers.',
    previewType: 'FIGHTER_ABILITY',
    refId: 'ThornsReflect',
  },
  {
    id: 'asset_abi_summon_ward',
    name: 'Clockwork Auto-Sentry Turret Ward 3D (SummonWard)',
    batchNumber: 11,
    category: 'Fighter Abilities 3D',
    partsCount: 9,
    polyStyle: 'Tripod Brass Chassis & Twin Gatling Barrels',
    description:
      '9-part 3D summoned ward model for SummonWard: autonomous mechanical sentry turret deployed onto the battlefield.',
    previewType: 'FIGHTER_ABILITY',
    refId: 'SummonWard',
  },
  {
    id: 'asset_abi_true_damage_bolt',
    name: 'Void Singularity Spear 3D (TrueDamageBolt)',
    batchNumber: 11,
    category: 'Fighter Abilities 3D',
    partsCount: 8,
    polyStyle: 'Abyssal Javelin & Pure Light Helix',
    description:
      '8-part 3D fighter ability model for TrueDamageBolt: armor-piercing void lance that inflicts unmitigated Pure damage.',
    previewType: 'FIGHTER_ABILITY',
    refId: 'TrueDamageBolt',
  },
  {
    id: 'asset_abi_freeze_nova',
    name: 'Glacial Absolute Zero Nova 3D (FreezeNova)',
    batchNumber: 11,
    category: 'Fighter Abilities 3D',
    partsCount: 9,
    polyStyle: '6-Pointed Frost Snowflake & Cryo Shockwave',
    description:
      '9-part 3D fighter ability model for FreezeNova: expanding blizzard ring that freezes and slows all surrounding foes.',
    previewType: 'FIGHTER_ABILITY',
    refId: 'FreezeNova',
  },
];

const BATCH_12_SYNERGIES_AND_STATUS: AssetBatchItem[] = [
  ...(Object.keys(FACTIONS) as FactionId[]).map((fId) => {
    const f = FACTIONS[fId];
    return {
      id: `asset_syn_${fId.toLowerCase()}`,
      name: `Synergy Totem: ${f.synergyName} (3+ ${fId})`,
      batchNumber: 12 as const,
      category: 'Synergies & Status 3D' as const,
      partsCount: 9,
      polyStyle: `3+ ${fId} Formation Banner · ${f.specialty}`,
      description: `${f.synergyDescription} — Rises on the frontline when 3+ ${fId} fighters are deployed.`,
      faction: fId,
      previewType: 'SYNERGY_STATUS' as const,
      refId: `syn_${fId.toLowerCase()}`,
    };
  }),
  {
    id: 'asset_status_burn',
    name: 'Combat Status 3D: Hellfire Burn DoT (Thiêu Đốt)',
    batchNumber: 12,
    category: 'Synergies & Status 3D',
    partsCount: 8,
    polyStyle: 'Orbiting Flame Crown & Searing Ring',
    description:
      '8-part 3D status effect indicator attached to burning units taking continuous fire damage over time.',
    previewType: 'SYNERGY_STATUS',
    refId: 'status_burn',
  },
  {
    id: 'asset_status_slow',
    name: 'Combat Status 3D: Glacial Slow Shackle (Làm Chậm)',
    batchNumber: 12,
    category: 'Synergies & Status 3D',
    partsCount: 8,
    polyStyle: 'Frost Anklet Ring & 4 Ice Shards',
    description:
      '8-part 3D status effect indicator attached to chilled units suffering reduced movement and attack speed.',
    previewType: 'SYNERGY_STATUS',
    refId: 'status_slow',
  },
  {
    id: 'asset_status_stun',
    name: 'Combat Status 3D: Concussion Stun Halo (Choáng)',
    batchNumber: 12,
    category: 'Synergies & Status 3D',
    partsCount: 8,
    polyStyle: 'dizzying Aurum Stars & Overhead Orbit Ring',
    description:
      '8-part 3D status effect halo spinning above stunned units unable to move or attack.',
    previewType: 'SYNERGY_STATUS',
    refId: 'status_stun',
  },
  {
    id: 'asset_status_armor_break',
    name: 'Combat Status 3D: Sundered Armor Fracture (Phá Giáp)',
    batchNumber: 12,
    category: 'Synergies & Status 3D',
    partsCount: 8,
    polyStyle: 'Cracked Crimson Shield & Piercing Wedges',
    description:
      '8-part 3D status effect indicator marking targets with reduced armor resistance.',
    previewType: 'SYNERGY_STATUS',
    refId: 'status_armor_break',
  },
  {
    id: 'asset_status_aspd_buff',
    name: 'Combat Status 3D: Frenzy Haste Pinions (Tăng Tốc Đánh)',
    batchNumber: 12,
    category: 'Synergies & Status 3D',
    partsCount: 8,
    polyStyle: 'Twin Wind-Feather Wings & Golden Aura',
    description:
      '8-part 3D status effect indicator empowering allied defenders with bonus attack speed.',
    previewType: 'SYNERGY_STATUS',
    refId: 'status_aspd_buff',
  },
  {
    id: 'asset_status_shield',
    name: 'Combat Status 3D: Aegis Barrier Ward (Khiên Chắn)',
    batchNumber: 12,
    category: 'Synergies & Status 3D',
    partsCount: 8,
    polyStyle: '6 Orbiting Hex-Plates & Azure Force Ring',
    description:
      '8-part 3D status effect barrier surrounding shielded fighters and the Hero King.',
    previewType: 'SYNERGY_STATUS',
    refId: 'status_shield',
  },
];

const BATCH_13_CAMPAIGN_AND_COMMANDERS: AssetBatchItem[] = [
  {
    id: 'asset_camp_diorama_1',
    name: 'Campaign 01 Diorama: Caldera Vanguard Bridge',
    batchNumber: 13,
    category: 'Campaign & Commanders 3D',
    partsCount: 10,
    polyStyle: 'Volcanic Bridge Fortress & Twin Magma Spires',
    description:
      '10-part 3D architectural diorama of Mission 01 (Caldera Vanguard · Inferno Protocol 2v2).',
    previewType: 'CAMPAIGN_COMMANDER',
    refId: 'camp_diorama_1',
  },
  {
    id: 'asset_camp_diorama_2',
    name: 'Campaign 02 Diorama: Citadel of Brass Gears',
    batchNumber: 13,
    category: 'Campaign & Commanders 3D',
    partsCount: 10,
    polyStyle: 'Clockwork Foundry Bastion & Steam Turbines',
    description:
      '10-part 3D architectural diorama of Mission 02 (Citadel of Brass Gears · Mechanic Siege 2v2).',
    previewType: 'CAMPAIGN_COMMANDER',
    refId: 'camp_diorama_2',
  },
  {
    id: 'asset_camp_diorama_3',
    name: 'Campaign 03 Diorama: Sanctuary of the Verdant Root',
    batchNumber: 13,
    category: 'Campaign & Commanders 3D',
    partsCount: 10,
    polyStyle: 'Ancient World-Tree Bridge & Druidic Stones',
    description:
      '10-part 3D architectural diorama of Mission 03 (Sanctuary of the Verdant Root · Nature 1v1).',
    previewType: 'CAMPAIGN_COMMANDER',
    refId: 'camp_diorama_3',
  },
  {
    id: 'asset_camp_diorama_4',
    name: 'Campaign 04 Diorama: Trench of the Abyssal Sovereign',
    batchNumber: 13,
    category: 'Campaign & Commanders 3D',
    partsCount: 10,
    polyStyle: 'Deep-Sea Leviathan Gate & Whirlpool Spire',
    description:
      '10-part 3D architectural diorama of Mission 04 (Trench of the Abyssal Sovereign · Expert 2v2).',
    previewType: 'CAMPAIGN_COMMANDER',
    refId: 'camp_diorama_4',
  },
  {
    id: 'asset_cmd_statue_player',
    name: 'Commander Statue: [1] West Sovereign (Bạn)',
    batchNumber: 13,
    category: 'Campaign & Commanders 3D',
    partsCount: 9,
    polyStyle: 'Gilded Marble Pedestal & Sovereign Champion Bust',
    description:
      '9-part 3D lane monument representing Lane 1 (Human Player Commander of the West Alliance).',
    previewType: 'CAMPAIGN_COMMANDER',
    refId: 'cmd_statue_player',
  },
  {
    id: 'asset_cmd_statue_ally',
    name: 'Commander Statue: [2] Vanguard Ally (Đồng Đội AI)',
    batchNumber: 13,
    category: 'Campaign & Commanders 3D',
    partsCount: 9,
    polyStyle: 'Azure Bastion Pedestal & Winged Sentinel Statue',
    description:
      '9-part 3D lane monument representing Lane 2 (Allied AI Commander reinforcing the West Citadel).',
    previewType: 'CAMPAIGN_COMMANDER',
    refId: 'cmd_statue_ally',
  },
  {
    id: 'asset_cmd_statue_kael',
    name: 'Commander Statue: [3] Warlord Kael (Địch Làn 3)',
    batchNumber: 13,
    category: 'Campaign & Commanders 3D',
    partsCount: 9,
    polyStyle: 'Obsidian Dread-Plinth & Horned Warlord Statue',
    description:
      '9-part 3D lane monument representing Lane 3 (Enemy AI Commander Warlord Kael of the East Pact).',
    previewType: 'CAMPAIGN_COMMANDER',
    refId: 'cmd_statue_kael',
  },
  {
    id: 'asset_cmd_statue_vex',
    name: 'Commander Statue: [4] Archon Vex (Địch Làn 4)',
    batchNumber: 13,
    category: 'Campaign & Commanders 3D',
    partsCount: 9,
    polyStyle: 'Void Basalt Plinth & Ascended Archon Statue',
    description:
      '9-part 3D lane monument representing Lane 4 (Enemy AI Commander Archon Vex of the East Pact).',
    previewType: 'CAMPAIGN_COMMANDER',
    refId: 'cmd_statue_vex',
  },
];

export const BATCH_14_COUNTER_MATRIX_AND_ROLES: AssetBatchItem[] = [
  {
    id: 'asset_def_bastion_light',
    name: 'Defense Matrix: Giáp Nhẹ (Light Carapace)',
    batchNumber: 14,
    category: 'Counter Matrix & Roles 3D',
    partsCount: 8,
    polyStyle: 'Emerald Wind-Skirt & Agile Buckler',
    description:
      '8-part 3D armor standard for Light Defense units (vulnerable to Pierce 125%, resistant to Siege 80%).',
    previewType: 'COUNTER_MATRIX_ROLE',
    refId: 'def_bastion_light',
  },
  {
    id: 'asset_def_bastion_medium',
    name: 'Defense Matrix: Giáp Vừa (Medium Brigandine)',
    batchNumber: 14,
    category: 'Counter Matrix & Roles 3D',
    partsCount: 8,
    polyStyle: 'Gilded Brigandine Plates & Crest',
    description:
      '8-part 3D armor standard for Medium Defense units (vulnerable to Impact 125%, resistant to Pierce 80%).',
    previewType: 'COUNTER_MATRIX_ROLE',
    refId: 'def_bastion_medium',
  },
  {
    id: 'asset_def_bastion_heavy',
    name: 'Defense Matrix: Giáp Nặng (Heavy Bastion)',
    batchNumber: 14,
    category: 'Counter Matrix & Roles 3D',
    partsCount: 8,
    polyStyle: 'Titanium Greatshield & Interlocking Pauldrons',
    description:
      '8-part 3D armor standard for Heavy Defense units (vulnerable to Magic 125%, resistant to Impact 80%).',
    previewType: 'COUNTER_MATRIX_ROLE',
    refId: 'def_bastion_heavy',
  },
  {
    id: 'asset_def_bastion_arcane',
    name: 'Defense Matrix: Giáp Bí Thuật (Arcane Ward)',
    batchNumber: 14,
    category: 'Counter Matrix & Roles 3D',
    partsCount: 8,
    polyStyle: 'Runic Aegis Barrier & Violet Nodes',
    description:
      '8-part 3D armor standard for Arcane Defense units (vulnerable to Pierce 115%, resistant to Magic 75%).',
    previewType: 'COUNTER_MATRIX_ROLE',
    refId: 'def_bastion_arcane',
  },
  {
    id: 'asset_def_bastion_massive',
    name: 'Defense Matrix: Giáp Khổng Lồ (Massive Colossus)',
    batchNumber: 14,
    category: 'Counter Matrix & Roles 3D',
    partsCount: 8,
    polyStyle: 'Colossus Citadel Plating & Siege Boss Core',
    description:
      '8-part 3D armor standard for Massive Bosses & Fortified units (vulnerable to Siege 130%, resistant to Pierce/Impact/Magic).',
    previewType: 'COUNTER_MATRIX_ROLE',
    refId: 'def_bastion_massive',
  },
  {
    id: 'asset_role_standard_tank',
    name: 'Role Standard: Tiên Phong Chắn Đòn (Tank)',
    batchNumber: 14,
    category: 'Counter Matrix & Roles 3D',
    partsCount: 8,
    polyStyle: 'Fortress Mast & Twin Bulwark Pillars',
    description:
      '8-part 3D tactical standard for frontline Tank Fighters positioned in rows Z=0..2.',
    previewType: 'COUNTER_MATRIX_ROLE',
    refId: 'role_standard_tank',
  },
  {
    id: 'asset_role_standard_dps',
    name: 'Role Standard: Xạ Thủ Sát Thương (DPS)',
    batchNumber: 14,
    category: 'Counter Matrix & Roles 3D',
    partsCount: 8,
    polyStyle: 'Crimson Crosshair Spire & Twin Blade Wings',
    description:
      '8-part 3D tactical standard for sustained single-target DPS Fighters.',
    previewType: 'COUNTER_MATRIX_ROLE',
    refId: 'role_standard_dps',
  },
  {
    id: 'asset_role_standard_aoe',
    name: 'Role Standard: Pháo Kích Diện Rộng (AoE)',
    batchNumber: 14,
    category: 'Counter Matrix & Roles 3D',
    partsCount: 8,
    polyStyle: 'Solar Detonation Crest & Bombard Wings',
    description:
      '8-part 3D tactical standard for multi-target splash AoE Fighters.',
    previewType: 'COUNTER_MATRIX_ROLE',
    refId: 'role_standard_aoe',
  },
  {
    id: 'asset_role_standard_support',
    name: 'Role Standard: Bí Thuật Hỗ Trợ (Support / Aura)',
    batchNumber: 14,
    category: 'Counter Matrix & Roles 3D',
    partsCount: 8,
    polyStyle: 'Emerald Chalice Spire & Harmonic Wings',
    description:
      '8-part 3D tactical standard for Support and Aura Fighters buffing adjacent allies.',
    previewType: 'COUNTER_MATRIX_ROLE',
    refId: 'role_standard_support',
  },
  {
    id: 'asset_role_standard_specialist',
    name: 'Role Standard: Đặc Nhiệm & Carry (Specialist)',
    batchNumber: 14,
    category: 'Counter Matrix & Roles 3D',
    partsCount: 8,
    polyStyle: 'Void Assassin Prism & Twin Glaive Wings',
    description:
      '8-part 3D tactical standard for hyper-scaling Carry and Specialist Fighters.',
    previewType: 'COUNTER_MATRIX_ROLE',
    refId: 'role_standard_specialist',
  },
  {
    id: 'asset_ai_core_easy',
    name: 'AI Command Core: Tân Binh (Easy AI Brain)',
    batchNumber: 14,
    category: 'Counter Matrix & Roles 3D',
    partsCount: 10,
    polyStyle: 'Emerald Logic Sphere & 3-Ring Gyroscope',
    description:
      '10-part 3D AI tactical processor core representing Easy AI decision-making and economy pacing.',
    previewType: 'COUNTER_MATRIX_ROLE',
    refId: 'ai_core_easy',
  },
  {
    id: 'asset_ai_core_normal',
    name: 'AI Command Core: Chiến Thuật (Normal AI Brain)',
    batchNumber: 14,
    category: 'Counter Matrix & Roles 3D',
    partsCount: 10,
    polyStyle: 'Aether Cyan Synapse Core & Triple Gimbal',
    description:
      '10-part 3D AI tactical processor core representing Normal AI counter-building and Mercenary sends.',
    previewType: 'COUNTER_MATRIX_ROLE',
    refId: 'ai_core_normal',
  },
  {
    id: 'asset_ai_core_hard',
    name: 'AI Command Core: Chỉ Huy Trưởng (Hard AI Brain)',
    batchNumber: 14,
    category: 'Counter Matrix & Roles 3D',
    partsCount: 10,
    polyStyle: 'Solar Gold War-Mind & High-Speed Gimbals',
    description:
      '10-part 3D AI tactical processor core representing Hard AI wave-spike timing and armor-matrix optimization.',
    previewType: 'COUNTER_MATRIX_ROLE',
    refId: 'ai_core_hard',
  },
  {
    id: 'asset_ai_core_expert',
    name: 'AI Command Core: Đại Kiện Tướng (Grandmaster AI)',
    batchNumber: 14,
    category: 'Counter Matrix & Roles 3D',
    partsCount: 10,
    polyStyle: 'Crimson Overlord Singularity & Apex Gyroscopes',
    description:
      '10-part 3D AI tactical processor core representing Expert/Grandmaster AI ruthless eco-pressure and boss-wave all-ins.',
    previewType: 'COUNTER_MATRIX_ROLE',
    refId: 'ai_core_expert',
  },
];

export const BATCH_15_ECONOMY_AND_FINALE_MONUMENTS: AssetBatchItem[] = [
  {
    id: 'asset_econ_tier_1_camp',
    name: 'Economy Forge I: Trại Khai Khoáng Sơ Cấp (1-3 Workers)',
    batchNumber: 15,
    category: 'Economy & Finale 3D',
    partsCount: 8,
    polyStyle: 'Basalt Smelter Drum & Single Mythium Conduit',
    description:
      '8-part 3D economy monument rendered near the Quarry when operating 1–3 Workers.',
    previewType: 'ECONOMY_FINALE',
    refId: 'econ_tier_1_camp',
  },
  {
    id: 'asset_econ_tier_2_foundry',
    name: 'Economy Forge II: Xưởng Tinh Luyện (4-6 Workers)',
    batchNumber: 15,
    category: 'Economy & Finale 3D',
    partsCount: 9,
    polyStyle: 'Dual-Ring Mythium Foundry & Twin Conduits',
    description:
      '9-part 3D economy monument rendered near the Quarry when operating 4–6 Workers.',
    previewType: 'ECONOMY_FINALE',
    refId: 'econ_tier_2_foundry',
  },
  {
    id: 'asset_econ_tier_3_refinery',
    name: 'Economy Forge III: Lò Phản Ứng Mythium (7-9 Workers)',
    batchNumber: 15,
    category: 'Economy & Finale 3D',
    partsCount: 10,
    polyStyle: 'Triple-Ring High-Pressure Refinery & 3 Conduits',
    description:
      '10-part 3D economy monument rendered near the Quarry when operating 7–9 Workers.',
    previewType: 'ECONOMY_FINALE',
    refId: 'econ_tier_3_refinery',
  },
  {
    id: 'asset_econ_tier_4_nexus',
    name: 'Economy Forge IV: Đại Trung Tâm Kinh Tế (10+ Workers)',
    batchNumber: 15,
    category: 'Economy & Finale 3D',
    partsCount: 11,
    polyStyle: 'Quad-Ring Sovereign Mythium Nexus & 4 Conduits',
    description:
      '11-part 3D economy monument rendered near the Quarry at peak 10+ Worker industrialization.',
    previewType: 'ECONOMY_FINALE',
    refId: 'econ_tier_4_nexus',
  },
  {
    id: 'asset_phase_herald_early',
    name: 'Wave Phase Herald: Tiền Đồn Khởi Đầu (Waves 1-6)',
    batchNumber: 15,
    category: 'Economy & Finale 3D',
    partsCount: 8,
    polyStyle: 'Emerald Vanguard Obelisk & Twin Braziers',
    description:
      '8-part 3D wave phase monument heralding Early Skirmish Waves 1–6 on the battlefield.',
    previewType: 'ECONOMY_FINALE',
    refId: 'phase_herald_early',
  },
  {
    id: 'asset_phase_herald_mid',
    name: 'Wave Phase Herald: Chiến Dịch Trung Kỳ (Waves 7-13)',
    batchNumber: 15,
    category: 'Economy & Finale 3D',
    partsCount: 8,
    polyStyle: 'Aether Cyan Escalation Obelisk & Braziers',
    description:
      '8-part 3D wave phase monument heralding Mid-Game Escalation Waves 7–13.',
    previewType: 'ECONOMY_FINALE',
    refId: 'phase_herald_mid',
  },
  {
    id: 'asset_phase_herald_late',
    name: 'Wave Phase Herald: Đại Chiến Hậu Kỳ (Waves 14-20)',
    batchNumber: 15,
    category: 'Economy & Finale 3D',
    partsCount: 8,
    polyStyle: 'Solar Gold Siege Obelisk & Flaming Braziers',
    description:
      '8-part 3D wave phase monument heralding Late-Game Total War Waves 14–20.',
    previewType: 'ECONOMY_FINALE',
    refId: 'phase_herald_late',
  },
  {
    id: 'asset_phase_herald_boss',
    name: 'Wave Phase Herald: Huyết Nguyệt Chung Cuộc (Boss Waves)',
    batchNumber: 15,
    category: 'Economy & Finale 3D',
    partsCount: 8,
    polyStyle: 'Crimson Dread Obelisk & Apocalypse Halo',
    description:
      '8-part 3D wave phase monument heralding Boss Waves (5, 10, 15, 20, 21).',
    previewType: 'ECONOMY_FINALE',
    refId: 'phase_herald_boss',
  },
  {
    id: 'asset_finale_bounty_vault',
    name: 'Finale Monument: Kho Báu Chiến Lợi Phẩm (Golden Vault)',
    batchNumber: 15,
    category: 'Economy & Finale 3D',
    partsCount: 11,
    polyStyle: 'Imperial Gold Treasury Spire & 4 Reliquary Pillars',
    description:
      '11-part 3D monument celebrating wave clear gold bounties and leak-hunt rewards.',
    previewType: 'ECONOMY_FINALE',
    refId: 'finale_bounty_vault',
  },
  {
    id: 'asset_finale_sanctuary_bell',
    name: 'Finale Monument: Đại Hồng Chung Thành Trì (Citadel Bell)',
    batchNumber: 15,
    category: 'Economy & Finale 3D',
    partsCount: 11,
    polyStyle: 'Resonant Aether Spire & 4 Guardian Columns',
    description:
      '11-part 3D monument chiming when the Fallen King is resurrected at the Citadel.',
    previewType: 'ECONOMY_FINALE',
    refId: 'finale_sanctuary_bell',
  },
  {
    id: 'asset_finale_legion_pantheon',
    name: 'Finale Monument: Đền Thờ Bát Đại Quân Đoàn (8-Faction Pantheon)',
    batchNumber: 15,
    category: 'Economy & Finale 3D',
    partsCount: 11,
    polyStyle: 'Grand Octagonal Pantheon & Ascending Crown',
    description:
      '11-part 3D monument honoring all 8 Factions united under the Bastion Protocol.',
    previewType: 'ECONOMY_FINALE',
    refId: 'finale_legion_pantheon',
  },
  {
    id: 'asset_finale_grand_bastion_crown',
    name: 'Finale Monument #200: Vương Miện Tối Thượng Bastion (Apex #200)',
    batchNumber: 15,
    category: 'Economy & Finale 3D',
    partsCount: 12,
    polyStyle: 'Grand Sovereign Crown, Twin Halos & 4 Obelisk Pillars',
    description:
      '12-part flagship #200 3D Masterpiece Monument crowning the completed 15-Batch / 200-Model 3D Asset Pipeline.',
    previewType: 'ECONOMY_FINALE',
    refId: 'finale_grand_bastion_crown',
  },
];

export const BATCH_16_TIER2_ASCENSION_SHRINES: AssetBatchItem[] = [
  {
    id: 'asset_watchtower_inferno',
    name: 'Bastion Watchtower: Hỏa Ngục Canh Tháp (Inferno)',
    batchNumber: 16,
    category: 'Tier-2 Ascension & Watchtowers 3D',
    partsCount: 9,
    polyStyle: 'Obsidian Watchtower, Magma Turret & 4 Buttresses',
    description:
      '9-part 3D perimeter watchtower activated when deploying Tier-2 Inferno Fighters.',
    faction: 'Inferno',
    previewType: 'TIER2_ASCENSION',
    refId: 'watchtower_inferno',
  },
  {
    id: 'asset_watchtower_undead',
    name: 'Bastion Watchtower: Vong Linh Canh Tháp (Undead)',
    batchNumber: 16,
    category: 'Tier-2 Ascension & Watchtowers 3D',
    partsCount: 9,
    polyStyle: 'Necropolis Spire, Soulfire Beacon & Bone Buttresses',
    description:
      '9-part 3D perimeter watchtower activated when deploying Tier-2 Undead Fighters.',
    faction: 'Undead',
    previewType: 'TIER2_ASCENSION',
    refId: 'watchtower_undead',
  },
  {
    id: 'asset_watchtower_nature',
    name: 'Bastion Watchtower: Cổ Thụ Canh Tháp (Nature)',
    batchNumber: 16,
    category: 'Tier-2 Ascension & Watchtowers 3D',
    partsCount: 9,
    polyStyle: 'Heartwood Sentinel Tower & Emerald Canopy Star',
    description:
      '9-part 3D perimeter watchtower activated when deploying Tier-2 Nature Fighters.',
    faction: 'Nature',
    previewType: 'TIER2_ASCENSION',
    refId: 'watchtower_nature',
  },
  {
    id: 'asset_watchtower_mechanic',
    name: 'Bastion Watchtower: Cơ Giới Pháo Tháp (Mechanic)',
    batchNumber: 16,
    category: 'Tier-2 Ascension & Watchtowers 3D',
    partsCount: 9,
    polyStyle: 'Brass Clockwork Turret & Twin Tesla Coils',
    description:
      '9-part 3D perimeter watchtower activated when deploying Tier-2 Mechanic Fighters.',
    faction: 'Mechanic',
    previewType: 'TIER2_ASCENSION',
    refId: 'watchtower_mechanic',
  },
  {
    id: 'asset_watchtower_abyss',
    name: 'Bastion Watchtower: Hải Vương Canh Tháp (Abyss)',
    batchNumber: 16,
    category: 'Tier-2 Ascension & Watchtowers 3D',
    partsCount: 9,
    polyStyle: 'Trench Coral Spire & Whirlpool Prism',
    description:
      '9-part 3D perimeter watchtower activated when deploying Tier-2 Abyss Fighters.',
    faction: 'Abyss',
    previewType: 'TIER2_ASCENSION',
    refId: 'watchtower_abyss',
  },
  {
    id: 'asset_watchtower_wild',
    name: 'Bastion Watchtower: Cuồng Phong Canh Tháp (Wild)',
    batchNumber: 16,
    category: 'Tier-2 Ascension & Watchtowers 3D',
    partsCount: 9,
    polyStyle: 'Steppe Totem Watchtower & Storm Horn Crest',
    description:
      '9-part 3D perimeter watchtower activated when deploying Tier-2 Wild Fighters.',
    faction: 'Wild',
    previewType: 'TIER2_ASCENSION',
    refId: 'watchtower_wild',
  },
  {
    id: 'asset_watchtower_divine',
    name: 'Bastion Watchtower: Thánh Quang Canh Tháp (Divine)',
    batchNumber: 16,
    category: 'Tier-2 Ascension & Watchtowers 3D',
    partsCount: 9,
    polyStyle: 'Marble Cathedral Belfry & Solar Sunburst',
    description:
      '9-part 3D perimeter watchtower activated when deploying Tier-2 Divine Fighters.',
    faction: 'Divine',
    previewType: 'TIER2_ASCENSION',
    refId: 'watchtower_divine',
  },
  {
    id: 'asset_watchtower_arcane',
    name: 'Bastion Watchtower: Tinh Cầu Canh Tháp (Arcane)',
    batchNumber: 16,
    category: 'Tier-2 Ascension & Watchtowers 3D',
    partsCount: 9,
    polyStyle: 'Crystalline Mage Tower & Orbiting Spell Ring',
    description:
      '9-part 3D perimeter watchtower activated when deploying Tier-2 Arcane Fighters.',
    faction: 'Arcane',
    previewType: 'TIER2_ASCENSION',
    refId: 'watchtower_arcane',
  },
  {
    id: 'asset_ascension_vanguard_bulwark',
    name: 'Tier-2 Ascension: Ấn Bất Khuất Tiên Phong (Bulwark Branch)',
    batchNumber: 16,
    category: 'Tier-2 Ascension & Watchtowers 3D',
    partsCount: 9,
    polyStyle: 'Double-Helix Ascension Rings & Titanium Aegis Core',
    description:
      '9-part 3D Tier-2 evolution shrine representing defensive Tank/Juggernaut ascension branches.',
    previewType: 'TIER2_ASCENSION',
    refId: 'ascension_vanguard_bulwark',
  },
  {
    id: 'asset_ascension_crimson_berserker',
    name: 'Tier-2 Ascension: Ấn Cuồng Chiến Huyết Kiếm (Slayer Branch)',
    batchNumber: 16,
    category: 'Tier-2 Ascension & Watchtowers 3D',
    partsCount: 9,
    polyStyle: 'Crimson Dual-Blade Helix & Bloodstone Core',
    description:
      '9-part 3D Tier-2 evolution shrine representing high-crit melee Berserker/Slayer branches.',
    previewType: 'TIER2_ASCENSION',
    refId: 'ascension_crimson_berserker',
  },
  {
    id: 'asset_ascension_cataclysm_artillery',
    name: 'Tier-2 Ascension: Ấn Hủy Diệt Pháo Kích (Siege Branch)',
    batchNumber: 16,
    category: 'Tier-2 Ascension & Watchtowers 3D',
    partsCount: 9,
    polyStyle: 'Solar Bombard Helix & Siege Detonator Core',
    description:
      '9-part 3D Tier-2 evolution shrine representing long-range Siege/Artillery ascension branches.',
    previewType: 'TIER2_ASCENSION',
    refId: 'ascension_cataclysm_artillery',
  },
  {
    id: 'asset_ascension_aether_archon',
    name: 'Tier-2 Ascension: Ấn Đại Pháp Sư Tinh Vân (Archon Branch)',
    batchNumber: 16,
    category: 'Tier-2 Ascension & Watchtowers 3D',
    partsCount: 9,
    polyStyle: 'Aetherial Twin Halos & Arcane Archon Prism',
    description:
      '9-part 3D Tier-2 evolution shrine representing Pure/Magic spellcaster ascension branches.',
    previewType: 'TIER2_ASCENSION',
    refId: 'ascension_aether_archon',
  },
  {
    id: 'asset_ascension_chronos_overclock',
    name: 'Tier-2 Ascension: Ấn Siêu Tốc Động Cơ (Overclock Branch)',
    batchNumber: 16,
    category: 'Tier-2 Ascension & Watchtowers 3D',
    partsCount: 9,
    polyStyle: 'High-RPM Gyroscope Rings & Hyper-Drive Core',
    description:
      '9-part 3D Tier-2 evolution shrine representing hyper-attack-speed Carry ascension branches.',
    previewType: 'TIER2_ASCENSION',
    refId: 'ascension_chronos_overclock',
  },
  {
    id: 'asset_ascension_abyssal_leviathan',
    name: 'Tier-2 Ascension: Ấn Bá Chủ Biển Sâu (Leviathan Branch)',
    batchNumber: 16,
    category: 'Tier-2 Ascension & Watchtowers 3D',
    partsCount: 9,
    polyStyle: 'Abyssal Maelstrom Rings & Kraken Heart',
    description:
      '9-part 3D Tier-2 evolution shrine representing crowd-control Specialist ascension branches.',
    previewType: 'TIER2_ASCENSION',
    refId: 'ascension_abyssal_leviathan',
  },
  {
    id: 'asset_ascension_solar_seraphim',
    name: 'Tier-2 Ascension: Ấn Thiên Thần Hộ Mệnh (Seraphim Branch)',
    batchNumber: 16,
    category: 'Tier-2 Ascension & Watchtowers 3D',
    partsCount: 9,
    polyStyle: 'Radiant Winged Halos & Seraphic Chalice',
    description:
      '9-part 3D Tier-2 evolution shrine representing healing & Aura Support ascension branches.',
    previewType: 'TIER2_ASCENSION',
    refId: 'ascension_solar_seraphim',
  },
  {
    id: 'asset_ascension_void_singularity',
    name: 'Tier-2 Ascension: Ấn Kỳ Dị Hư Không (Singularity Branch)',
    batchNumber: 16,
    category: 'Tier-2 Ascension & Watchtowers 3D',
    partsCount: 9,
    polyStyle: 'Event-Horizon Vortex & Void Star Core',
    description:
      '9-part 3D Tier-2 evolution shrine representing armor-shredding Void/Pure ascension branches.',
    previewType: 'TIER2_ASCENSION',
    refId: 'ascension_void_singularity',
  },
];

export const BATCH_17_ASTRAL_ANOMALIES_AND_PORTALS: AssetBatchItem[] = [
  {
    id: 'asset_astral_rift_crimson',
    name: 'Astral Rift: Cổng Hư Không Huyết Nguyệt (Blood Moon Rift)',
    batchNumber: 17,
    category: 'Astral Anomalies & Portals 3D',
    partsCount: 10,
    polyStyle: 'Crimson Toroidal Portal, Twin Spires & Vortex Core',
    description:
      '10-part 3D dimensional rift portal manifesting during Boss Waves on the upper battlefield.',
    previewType: 'ASTRAL_ANOMALY',
    refId: 'astral_rift_crimson',
  },
  {
    id: 'asset_astral_rift_aether',
    name: 'Astral Rift: Cổng Tinh Vân Aether (Aetherial Warp Gate)',
    batchNumber: 17,
    category: 'Astral Anomalies & Portals 3D',
    partsCount: 10,
    polyStyle: 'Cyan Starlight Stargate & 4 Conduit Pylons',
    description:
      '10-part 3D dimensional portal channeling cosmic Aether across the battlefield.',
    previewType: 'ASTRAL_ANOMALY',
    refId: 'astral_rift_aether',
  },
  {
    id: 'asset_astral_rift_chronos',
    name: 'Astral Rift: Cổng Thời Không Dịch Chuyển (Chronos Gate)',
    batchNumber: 17,
    category: 'Astral Anomalies & Portals 3D',
    partsCount: 10,
    polyStyle: 'Golden Pendulum Portal & Temporal Rings',
    description:
      '10-part 3D temporal portal warping wave reinforcement timelines.',
    previewType: 'ASTRAL_ANOMALY',
    refId: 'astral_rift_chronos',
  },
  {
    id: 'asset_astral_rift_abyss',
    name: 'Astral Rift: Cổng Vực Thẳm Biển Sâu (Trench Vortex)',
    batchNumber: 17,
    category: 'Astral Anomalies & Portals 3D',
    partsCount: 10,
    polyStyle: 'Deep-Sea Whirlpool Gate & Fang Pillars',
    description:
      '10-part 3D abyssal portal summoning deep-trench leviathans.',
    previewType: 'ASTRAL_ANOMALY',
    refId: 'astral_rift_abyss',
  },
  {
    id: 'asset_astral_eclipse_engine',
    name: 'Celestial Phenomenon: Thiên Cầu Nhật Thực (Solar Astrolabe)',
    batchNumber: 17,
    category: 'Astral Anomalies & Portals 3D',
    partsCount: 11,
    polyStyle: '3-Axis Celestial Armillary Sphere & Eclipse Core',
    description:
      '11-part 3D astronomical astrolabe tracking wave escalations and solar alignment.',
    previewType: 'ASTRAL_ANOMALY',
    refId: 'astral_eclipse_engine',
  },
  {
    id: 'asset_astral_meteor_beacon',
    name: 'Celestial Phenomenon: Đài Dẫn Hướng Thiên Thạch (Meteor Beacon)',
    batchNumber: 17,
    category: 'Astral Anomalies & Portals 3D',
    partsCount: 10,
    polyStyle: 'Orbital Targeting Dish & Suspended Star-Shard',
    description:
      '10-part 3D orbital targeting beacon locking onto enemy siege waves.',
    previewType: 'ASTRAL_ANOMALY',
    refId: 'astral_meteor_beacon',
  },
  {
    id: 'asset_astral_ion_tempest',
    name: 'Celestial Phenomenon: Trụ Bão Từ Trường Ion (Ion Tempest Coil)',
    batchNumber: 17,
    category: 'Astral Anomalies & Portals 3D',
    partsCount: 10,
    polyStyle: 'Triple-Ring Superconductor Coil & Lightning Crown',
    description:
      '10-part 3D weather spire discharging high-voltage ion storms across the lane.',
    previewType: 'ASTRAL_ANOMALY',
    refId: 'astral_ion_tempest',
  },
  {
    id: 'asset_astral_mana_geyser',
    name: 'Celestial Phenomenon: Mạch Phun Trào Năng Lượng (Leyline Geyser)',
    batchNumber: 17,
    category: 'Astral Anomalies & Portals 3D',
    partsCount: 10,
    polyStyle: 'Fractured Basalt Crater & Ascending Mana Plume',
    description:
      '10-part 3D arcane leyline fissure erupting with concentrated Mythium vapor.',
    previewType: 'ASTRAL_ANOMALY',
    refId: 'astral_mana_geyser',
  },
  {
    id: 'asset_astral_gravity_well',
    name: 'Celestial Phenomenon: Giếng Trọng Trường Hố Đen (Gravity Well)',
    batchNumber: 17,
    category: 'Astral Anomalies & Portals 3D',
    partsCount: 11,
    polyStyle: 'Accretion Disk Rings & Dark-Matter Singularity',
    description:
      '11-part 3D gravitational anomaly bending light and slowing enemy advances.',
    previewType: 'ASTRAL_ANOMALY',
    refId: 'astral_gravity_well',
  },
  {
    id: 'asset_astral_aurora_prism',
    name: 'Celestial Phenomenon: Lăng Kính Cực Quang (Aurora Prism)',
    batchNumber: 17,
    category: 'Astral Anomalies & Portals 3D',
    partsCount: 10,
    polyStyle: 'Emerald-Cyan Harmonic Crystal & Floating Shards',
    description:
      '10-part 3D polar aurora resonator projecting protective light over the sanctuary.',
    previewType: 'ASTRAL_ANOMALY',
    refId: 'astral_aurora_prism',
  },
  {
    id: 'asset_astral_void_monolith',
    name: 'Celestial Phenomenon: Cự Thạch Hư Không Cổ Đại (Void Monolith)',
    batchNumber: 17,
    category: 'Astral Anomalies & Portals 3D',
    partsCount: 10,
    polyStyle: 'Split Obsidian Obelisk & Levitating Runic Core',
    description:
      '10-part 3D ancient monolith humming with primordial void energy.',
    previewType: 'ASTRAL_ANOMALY',
    refId: 'astral_void_monolith',
  },
  {
    id: 'asset_astral_starforge_heart',
    name: 'Celestial Phenomenon: Trái Tim Lò Rèn Tinh Tú (Starforge Heart)',
    batchNumber: 17,
    category: 'Astral Anomalies & Portals 3D',
    partsCount: 11,
    polyStyle: 'Dyson Cage Rings & Captive dwarf-Star Core',
    description:
      '11-part 3D miniature Dyson-sphere reactor powering the Bastion Citadel defenses.',
    previewType: 'ASTRAL_ANOMALY',
    refId: 'astral_starforge_heart',
  },
];

export const BATCH_18_CITADEL_ARMORY_AND_ROYAL_RELICS: AssetBatchItem[] = [
  {
    id: 'asset_citadel_armory_ballista',
    name: 'Citadel Armory: Đại Nỏ Phá Thành Hoàng Gia (Royal Ballista)',
    batchNumber: 18,
    category: 'Citadel Armory & Royal Relics 3D',
    partsCount: 10,
    polyStyle: 'Articulated Gilded Siege Bow, Twin Arms & Bolt',
    description:
      '10-part 3D defensive siege ballista mounted beside the Citadel Sanctuary.',
    previewType: 'CITADEL_ARMORY',
    refId: 'citadel_armory_ballista',
  },
  {
    id: 'asset_citadel_armory_mortar',
    name: 'Citadel Armory: Đại Pháo Hơi Nước Hạng Nặng (Imperial Mortar)',
    batchNumber: 18,
    category: 'Citadel Armory & Royal Relics 3D',
    partsCount: 10,
    polyStyle: 'Heavy Brass Siege Barrel, Recoil Pistons & Turntable',
    description:
      '10-part 3D heavy siege mortar protecting the Hero King’s sanctuary perimeter.',
    previewType: 'CITADEL_ARMORY',
    refId: 'citadel_armory_mortar',
  },
  {
    id: 'asset_citadel_armory_aegis_dome',
    name: 'Citadel Armory: Máy Phát Khiên Vòm Thành Trì (Aegis Generator)',
    batchNumber: 18,
    category: 'Citadel Armory & Royal Relics 3D',
    partsCount: 11,
    polyStyle: 'Hexagonal Barrier Projector & 4 Energy Emitters',
    description:
      '11-part 3D shield dome generator reinforcing the Citadel when Bastion Plating is purchased.',
    previewType: 'CITADEL_ARMORY',
    refId: 'citadel_armory_aegis_dome',
  },
  {
    id: 'asset_citadel_armory_soul_forge',
    name: 'Citadel Armory: Lò Rèn Linh Hồn Anh Hùng (Heroic Soul Forge)',
    batchNumber: 18,
    category: 'Citadel Armory & Royal Relics 3D',
    partsCount: 10,
    polyStyle: 'Crucible Cauldron, Anvil Pedestal & Soul Flame',
    description:
      '10-part 3D royal armory forge where the Hero King’s weapons and relics are tempered.',
    previewType: 'CITADEL_ARMORY',
    refId: 'citadel_armory_soul_forge',
  },
  {
    id: 'asset_citadel_armory_war_drums',
    name: 'Citadel Armory: Trống Trận Đại Quân Đoàn (Grand War-Drums)',
    batchNumber: 18,
    category: 'Citadel Armory & Royal Relics 3D',
    partsCount: 10,
    polyStyle: 'Twin War-Drums, Gilded Frame & Resonance Banner',
    description:
      '10-part 3D war-drum battery that rallies defenders (+20% Attack Speed) during Fallen King Hold-the-Base.',
    previewType: 'CITADEL_ARMORY',
    refId: 'citadel_armory_war_drums',
  },
  {
    id: 'asset_citadel_armory_runic_anvil',
    name: 'Citadel Armory: Đe Rèn Cổ Ngữ Thần Khí (Runic Relic Anvil)',
    batchNumber: 18,
    category: 'Citadel Armory & Royal Relics 3D',
    partsCount: 10,
    polyStyle: 'Monolithic Runic Anvil & Levitating Forge Hammer',
    description:
      '10-part 3D enchanted anvil that upgrades the Hero King’s 6-slot equipment arsenal.',
    previewType: 'CITADEL_ARMORY',
    refId: 'citadel_armory_runic_anvil',
  },
  {
    id: 'asset_citadel_armory_healing_fountain',
    name: 'Citadel Armory: Đài Phun Nước Thánh Hồi Phục (Sanctuary Fountain)',
    batchNumber: 18,
    category: 'Citadel Armory & Royal Relics 3D',
    partsCount: 11,
    polyStyle: 'Tiered Emerald Basin, Life Crystal & Healing Halo',
    description:
      '11-part 3D sanctuary life fountain radiating the Citadel’s +55 HP/s Healing Aura.',
    previewType: 'CITADEL_ARMORY',
    refId: 'citadel_armory_healing_fountain',
  },
  {
    id: 'asset_citadel_armory_banner_hall',
    name: 'Citadel Armory: Đại Sảnh Quân Kỳ Liên Minh (Coalition Hall)',
    batchNumber: 18,
    category: 'Citadel Armory & Royal Relics 3D',
    partsCount: 10,
    polyStyle: 'Twin Heraldic Standards & Sovereign Archway',
    description:
      '10-part 3D ceremonial hall bearing the standards of the West Coalition.',
    previewType: 'CITADEL_ARMORY',
    refId: 'citadel_armory_banner_hall',
  },
  {
    id: 'asset_citadel_armory_throne_valor',
    name: 'Citadel Armory: Ngai Vàng Dũng Khí Đế Vương (Throne of Valor)',
    batchNumber: 18,
    category: 'Citadel Armory & Royal Relics 3D',
    partsCount: 11,
    polyStyle: 'Gilded War-Throne, Greatsword Backrest & Lion Pillars',
    description:
      '11-part 3D royal war-throne of the West Coalition Hero King.',
    previewType: 'CITADEL_ARMORY',
    refId: 'citadel_armory_throne_valor',
  },
  {
    id: 'asset_citadel_armory_throne_wisdom',
    name: 'Citadel Armory: Ngai Vàng Trí Tuệ Tinh Tú (Throne of Wisdom)',
    batchNumber: 18,
    category: 'Citadel Armory & Royal Relics 3D',
    partsCount: 11,
    polyStyle: 'Aether Crystal Throne & Floating Astrolabe Halo',
    description:
      '11-part 3D astral command throne overseeing all 4 lanes of the Bastion Protocol.',
    previewType: 'CITADEL_ARMORY',
    refId: 'citadel_armory_throne_wisdom',
  },
  {
    id: 'asset_citadel_armory_ark_covenant',
    name: 'Citadel Armory: Hòm Giao Ước Bất Diệt (Immortal Bastion Ark)',
    batchNumber: 18,
    category: 'Citadel Armory & Royal Relics 3D',
    partsCount: 11,
    polyStyle: 'Sacred Golden Reliquary Chest & Twin Winged Cherubim',
    description:
      '11-part 3D sacred reliquary preserving the Hero King’s immortal soul during resurrection.',
    previewType: 'CITADEL_ARMORY',
    refId: 'citadel_armory_ark_covenant',
  },
  {
    id: 'asset_citadel_armory_omega_monument',
    name: 'Finale Monument #240: Đại Kỳ Quan Thành Trì Vĩnh Cửu (Omega #240)',
    batchNumber: 18,
    category: 'Citadel Armory & Royal Relics 3D',
    partsCount: 14,
    polyStyle: '14-Part Omega Bastion Citadel, Triple Halos & 6 Royal Spires',
    description:
      '14-part flagship #240 3D Masterpiece Monument crowning the expanded 18-Batch / 240-Model 3D Asset Pipeline.',
    previewType: 'CITADEL_ARMORY',
    refId: 'citadel_armory_omega_monument',
  },
];

export const BATCH_19_WAR_MACHINES_AND_CONVOY_ENGINES: AssetBatchItem[] = [
  ...(Object.keys(FACTIONS) as FactionId[]).map((faction) => ({
    id: `asset_convoy_chariot_${faction.toLowerCase()}`,
    name: `War Chariot: Chiến Xa Hộ Tống ${FACTIONS[faction].name}`,
    batchNumber: 19 as const,
    category: 'War Machines & Convoy Engines 3D' as const,
    partsCount: 10,
    polyStyle: `${FACTIONS[faction].name} Armored Chariot, 4 Wheels & Siege Prow`,
    description: `10-part 3D armored convoy war-chariot of the ${FACTIONS[faction].name} Legion stationed near the Sanctuary Quarry.`,
    faction,
    previewType: 'WAR_MACHINE_CONVOY' as const,
    refId: `convoy_chariot_${faction.toLowerCase()}`,
  })),
  ...(Object.keys(FACTIONS) as FactionId[]).map((faction) => ({
    id: `asset_supply_depot_${faction.toLowerCase()}`,
    name: `Supply Depot: Kho Quân Nhu ${FACTIONS[faction].name}`,
    batchNumber: 19 as const,
    category: 'War Machines & Convoy Engines 3D' as const,
    partsCount: 9,
    polyStyle: `${FACTIONS[faction].name} Ordnance Crane, Energy Crates & Beacon`,
    description: `9-part 3D frontline ordnance depot supplying ${FACTIONS[faction].name} defenders during prolonged waves.`,
    faction,
    previewType: 'WAR_MACHINE_CONVOY' as const,
    refId: `supply_depot_${faction.toLowerCase()}`,
  })),
  ...[
    {
      refId: 'royal_mech_vanguard',
      name: 'Royal Guardian Mech: Thiết Giáp Tiên Phong (Vanguard Titan)',
      style: 'Articulated Gilded Mech, Twin Pauldrons & Greatsword Arm',
    },
    {
      refId: 'royal_mech_centurion',
      name: 'Royal Guardian Mech: Thiết Giáp Bách Phu Trưởng (Centurion)',
      style: 'Heavy Bastion Mech, Tower Shield & Lance Cannon',
    },
    {
      refId: 'royal_mech_colossus',
      name: 'Royal Guardian Mech: Thiết Giáp Khổng Lồ (Siege Colossus)',
      style: 'Quad-Core Reactor Chassis & Twin Shoulder Mortars',
    },
    {
      refId: 'royal_mech_valkyrie',
      name: 'Royal Guardian Mech: Thiết Giáp Nữ Vũ Thần (Solar Valkyrie)',
      style: 'Winged Aether Frame & Radiant Spear Thrusters',
    },
    {
      refId: 'royal_mech_arcanist',
      name: 'Royal Guardian Mech: Thiết Giáp Pháp Sư (Arcane Construct)',
      style: 'Crystalline Spell-Chassis & Orbiting Mana Pylons',
    },
    {
      refId: 'royal_mech_reaper',
      name: 'Royal Guardian Mech: Thiết Giáp Tử Thần (Soul Reaper)',
      style: 'Obsidian Dreadnought Frame & Necrotic Scythe Arm',
    },
    {
      refId: 'royal_mech_leviathan',
      name: 'Royal Guardian Mech: Thiết Giáp Hải Vương (Trench Walker)',
      style: 'Pressurized Abyssal Dive-Suit & Harpoon Cannon',
    },
    {
      refId: 'royal_mech_seraph',
      name: 'Royal Guardian Mech: Thiết Giáp Thiên Sứ (Celestial Seraph)',
      style: 'Six-Winged Golden Automaton & Halo Core',
    },
  ].map((m) => ({
    id: `asset_${m.refId}`,
    name: m.name,
    batchNumber: 19 as const,
    category: 'War Machines & Convoy Engines 3D' as const,
    partsCount: 11,
    polyStyle: m.style,
    description: `11-part 3D articulated Royal Guardian Mech deployed alongside the Citadel Sanctuary.`,
    previewType: 'WAR_MACHINE_CONVOY' as const,
    refId: m.refId,
  })),
  ...[
    {
      refId: 'sky_cruiser_helios',
      name: 'Sky Dreadnought: Chiến Hạm Không Gian Helios (Solar Cruiser)',
      style: 'Twin Rotor Turbines, Armored Hull & Solar Lance',
    },
    {
      refId: 'sky_cruiser_eclipse',
      name: 'Sky Dreadnought: Chiến Hạm Không Gian Eclipse (Void Cruiser)',
      style: 'Stealth Obsidian Hull & Dark-Matter Broadside',
    },
    {
      refId: 'sky_cruiser_tempest',
      name: 'Sky Dreadnought: Chiến Hạm Không Gian Tempest (Storm Airship)',
      style: 'Brass Dirigible Keel & Lightning Arc Cannons',
    },
    {
      refId: 'sky_cruiser_necro',
      name: 'Sky Dreadnought: Chiến Hạm Không Gian Necropolis (Bone Galleon)',
      style: 'Floating Necrotic Hulk & Soulfire Broadsides',
    },
    {
      refId: 'sky_cruiser_sylvan',
      name: 'Sky Dreadnought: Chiến Hạm Không Gian Sylvan (Emerald Ark)',
      style: 'Living Heartwood Hull & Wind-Sail Wings',
    },
    {
      refId: 'sky_cruiser_aether',
      name: 'Sky Dreadnought: Chiến Hạm Không Gian Aether (Star Carrier)',
      style: 'Prismatic Carrier Deck & Warp Drive Ring',
    },
  ].map((s) => ({
    id: `asset_${s.refId}`,
    name: s.name,
    batchNumber: 19 as const,
    category: 'War Machines & Convoy Engines 3D' as const,
    partsCount: 10,
    polyStyle: s.style,
    description: `10-part 3D aerial sky-cruiser dreadnought patrolling the Bastion airspace.`,
    previewType: 'WAR_MACHINE_CONVOY' as const,
    refId: s.refId,
  })),
];

export const BATCH_20_CELESTIAL_WONDERS_AND_MYTHIC_PANTHEON: AssetBatchItem[] = [
  ...(Object.keys(FACTIONS) as FactionId[]).map((faction) => ({
    id: `asset_primordial_idol_${faction.toLowerCase()}`,
    name: `Primordial Genesis Idol: Cổ Vật Khởi Nguyên ${FACTIONS[faction].name}`,
    batchNumber: 20 as const,
    category: 'Celestial Wonders & Pantheon #300' as const,
    partsCount: 10,
    polyStyle: `Ancient ${FACTIONS[faction].name} Genesis Totem & 4 Orbiting Shards`,
    description: `10-part 3D primordial genesis idol embodying the ancient origin of the ${FACTIONS[faction].name} Faction.`,
    faction,
    previewType: 'CELESTIAL_WONDER' as const,
    refId: `primordial_idol_${faction.toLowerCase()}`,
  })),
  ...[
    {
      refId: 'grandmaster_seal_1_opening',
      name: 'Grandmaster Seal I: Khai Cuộc Chuẩn Xác (Opening Mastery)',
    },
    {
      refId: 'grandmaster_seal_2_worker',
      name: 'Grandmaster Seal II: Nhịp Kinh Tế Công Nhân (Worker Tempo)',
    },
    {
      refId: 'grandmaster_seal_3_counter',
      name: 'Grandmaster Seal III: Ma Trận Khắc Chế 5x5 (Matrix Counter)',
    },
    {
      refId: 'grandmaster_seal_4_positioning',
      name: 'Grandmaster Seal IV: Đội Hình Chia Đam (Split Positioning)',
    },
    {
      refId: 'grandmaster_seal_5_aura',
      name: 'Grandmaster Seal V: Giao Thoa Hào Quang (Aura Stacking)',
    },
    {
      refId: 'grandmaster_seal_6_starve',
      name: 'Grandmaster Seal VI: Tích Trữ Mythium Đột Kích (Mythium Starve)',
    },
    {
      refId: 'grandmaster_seal_7_breaker',
      name: 'Grandmaster Seal VII: Phá Vỡ Phòng Tuyến (Wave Breaker)',
    },
    {
      refId: 'grandmaster_seal_8_king_micro',
      name: 'Grandmaster Seal VIII: Điều Khiển Đế Vương (Hero King Micro)',
    },
    {
      refId: 'grandmaster_seal_9_garrison',
      name: 'Grandmaster Seal IX: Tử Thủ Thành Trì (Hold-the-Base)',
    },
    {
      refId: 'grandmaster_seal_10_apocalypse',
      name: 'Grandmaster Seal X: Chinh Phục Huyết Nguyệt (Wave 21 Clear)',
    },
  ].map((g) => ({
    id: `asset_${g.refId}`,
    name: g.name,
    batchNumber: 20 as const,
    category: 'Celestial Wonders & Pantheon #300' as const,
    partsCount: 10,
    polyStyle: 'Grandmaster Tactical Crest, Twin Laurels & Runic Plinth',
    description: `10-part 3D Grandmaster Tactical Seal commemorating mastery of competitive Auto Tower Defense.`,
    previewType: 'CELESTIAL_WONDER' as const,
    refId: g.refId,
  })),
  ...[
    {
      refId: 'celestial_wonder_solaris',
      name: 'Celestial Wonder: Đại Thái Dương Hệ (Solaris Dyson Spire)',
    },
    {
      refId: 'celestial_wonder_lunaris',
      name: 'Celestial Wonder: Nguyệt Cung Tinh Cầu (Lunaris Sanctum)',
    },
    {
      refId: 'celestial_wonder_nebula',
      name: 'Celestial Wonder: Tinh Vân Sáng Thế (Genesis Nebula Pillar)',
    },
    {
      refId: 'celestial_wonder_quasar',
      name: 'Celestial Wonder: Chuẩn Tinh Chiếu Rọi (Quasar Beam Obelisk)',
    },
    {
      refId: 'celestial_wonder_pulsar',
      name: 'Celestial Wonder: Sao Từ Trường Xung Nhịp (Pulsar Chrono-Core)',
    },
    {
      refId: 'celestial_wonder_supernova',
      name: 'Celestial Wonder: Siêu Tân Tinh Bùng Nổ (Supernova Crucible)',
    },
    {
      refId: 'celestial_wonder_hyperion',
      name: 'Celestial Wonder: Cột Chống Trời Hyperion (Titan Atlas Spire)',
    },
    {
      refId: 'celestial_wonder_chronosphere',
      name: 'Celestial Wonder: Quả Cầu Vĩnh Hằng (Eternal Chronosphere)',
    },
    {
      refId: 'celestial_wonder_worldtree',
      name: 'Celestial Wonder: Đại Thụ Vũ Trụ Yggdrasil (Cosmic Worldtree)',
    },
    {
      refId: 'celestial_wonder_eternal_flame',
      name: 'Celestial Wonder: Ngọn Lửa Bất Diệt Khởi Nguyên (First Flame)',
    },
    {
      refId: 'celestial_wonder_aether_nexus',
      name: 'Celestial Wonder: Trái Tim Đa Vũ Trụ Aether (Multiverse Nexus)',
    },
  ].map((w) => ({
    id: `asset_${w.refId}`,
    name: w.name,
    batchNumber: 20 as const,
    category: 'Celestial Wonders & Pantheon #300' as const,
    partsCount: 12,
    polyStyle: 'Triple-Axis Cosmic Wonder, 6 Star Pillars & Zenith Crown',
    description: `12-part 3D Celestial Wonder monument radiating cosmic power across the Bastion arena.`,
    previewType: 'CELESTIAL_WONDER' as const,
    refId: w.refId,
  })),
  {
    id: 'asset_celestial_wonder_300_supreme_pantheon',
    name: 'Masterpiece #300: Đại Điện Vạn Vương Bastion Tối Thượng (Apex #300)',
    batchNumber: 20,
    category: 'Celestial Wonders & Pantheon #300',
    partsCount: 16,
    polyStyle: '16-Part Supreme Bastion Pantheon, Quadruple Halos & 8 Sovereign Pillars',
    description:
      '16-part flagship #300 3D Masterpiece Monument crowning the completed 20-Batch / 300-Model 3D Asset Pipeline.',
    previewType: 'CELESTIAL_WONDER',
    refId: 'celestial_wonder_300_supreme_pantheon',
  },
];

export const BATCH_21_WAR_BANNERS_RADARS_AND_FLAK_TOWERS: AssetBatchItem[] = [
  ...(Object.keys(FACTIONS) as FactionId[]).map((faction) => ({
    id: `asset_war_banner_${faction.toLowerCase()}`,
    name: `Grand War-Banner: Đại Quân Kỳ ${FACTIONS[faction].name}`,
    batchNumber: 21 as const,
    category: 'War Banners, Radars & Flak 3D' as const,
    partsCount: 10,
    polyStyle: `${FACTIONS[faction].name} Heraldic Standard, Twin Crossbars & Crest`,
    description: `10-part 3D grand heraldic war-banner of the ${FACTIONS[faction].name} Legion inspiring frontline defenders.`,
    faction,
    previewType: 'WAR_BANNER_RADAR_FLAK' as const,
    refId: `war_banner_${faction.toLowerCase()}`,
  })),
  ...(Object.keys(FACTIONS) as FactionId[]).map((faction) => ({
    id: `asset_radar_array_${faction.toLowerCase()}`,
    name: `Scrying Radar Array: Đài Trinh Sát ${FACTIONS[faction].name}`,
    batchNumber: 21 as const,
    category: 'War Banners, Radars & Flak 3D' as const,
    partsCount: 10,
    polyStyle: `${FACTIONS[faction].name} Rotating Dish, Scrying Orb & 3 Pylons`,
    description: `10-part 3D tactical scrying radar array scanning incoming opponent Mercenary sends on the West flank.`,
    faction,
    previewType: 'WAR_BANNER_RADAR_FLAK' as const,
    refId: `radar_array_${faction.toLowerCase()}`,
  })),
  ...(Object.keys(FACTIONS) as FactionId[]).map((faction) => ({
    id: `asset_flak_battery_${faction.toLowerCase()}`,
    name: `Flak Interceptor Battery: Pháo Phòng Không ${FACTIONS[faction].name}`,
    batchNumber: 21 as const,
    category: 'War Banners, Radars & Flak 3D' as const,
    partsCount: 11,
    polyStyle: `${FACTIONS[faction].name} Quad-Barrel Interceptor Turret & Armor Base`,
    description: `11-part 3D quad-barrel flak interceptor battery guarding the East tactical grid flank.`,
    faction,
    previewType: 'WAR_BANNER_RADAR_FLAK' as const,
    refId: `flak_battery_${faction.toLowerCase()}`,
  })),
  ...[
    {
      refId: 'grid_pylon_vanguard',
      name: 'Grid Force Pylon: Trụ Năng Lượng Tuyến Đầu (Vanguard Pylon)',
    },
    {
      refId: 'grid_pylon_midline',
      name: 'Grid Force Pylon: Trụ Năng Lượng Tuyến Giữa (Midline Pylon)',
    },
    {
      refId: 'grid_pylon_backline',
      name: 'Grid Force Pylon: Trụ Năng Lượng Tuyến Sau (Backline Pylon)',
    },
    {
      refId: 'grid_pylon_sanctuary',
      name: 'Grid Force Pylon: Trụ Năng Lượng Thành Trì (Sanctuary Pylon)',
    },
    {
      refId: 'grid_pylon_overcharge',
      name: 'Grid Force Pylon: Trụ Quá Tải Sát Thương (Overcharge Pylon)',
    },
    {
      refId: 'grid_pylon_aegis',
      name: 'Grid Force Pylon: Trụ Khiên Chắn Bất Diệt (Aegis Pylon)',
    },
  ].map((p) => ({
    id: `asset_${p.refId}`,
    name: p.name,
    batchNumber: 21 as const,
    category: 'War Banners, Radars & Flak 3D' as const,
    partsCount: 10,
    polyStyle: 'Hexagonal Forcefield Pylon, Floating Emitter & Twin Rings',
    description: `10-part 3D tactical grid boundary pylon projecting protective forcefields across the lane.`,
    previewType: 'WAR_BANNER_RADAR_FLAK' as const,
    refId: p.refId,
  })),
];

export const BATCH_22_ELEMENTAL_TITANS_AND_SOVEREIGN_AVATARS: AssetBatchItem[] = [
  ...(Object.keys(FACTIONS) as FactionId[]).map((faction) => ({
    id: `asset_elemental_avatar_${faction.toLowerCase()}`,
    name: `Elemental Avatar: Hộ Pháp Nguyên Tố ${FACTIONS[faction].name}`,
    batchNumber: 22 as const,
    category: 'Elemental Titans & Sovereign #360' as const,
    partsCount: 12,
    polyStyle: `${FACTIONS[faction].name} Colossal Avatar, Floating Monoliths & Blade`,
    description: `12-part 3D colossal elemental avatar standing guard beside the Southern Citadel Sanctuary.`,
    faction,
    previewType: 'ELEMENTAL_TITAN_SOVEREIGN' as const,
    refId: `elemental_avatar_${faction.toLowerCase()}`,
  })),
  ...[
    {
      refId: 'campaign_medal_op1',
      name: 'Campaign Trophy I: Huân Chương Phá Vây Tiền Đồn (Operation 1)',
    },
    {
      refId: 'campaign_medal_op2',
      name: 'Campaign Trophy II: Huân Chương Mỏ Tinh Thể Mythium (Operation 2)',
    },
    {
      refId: 'campaign_medal_op3',
      name: 'Campaign Trophy III: Huân Chương Lò Luyện Hỏa Ngục (Operation 3)',
    },
    {
      refId: 'campaign_medal_op4',
      name: 'Campaign Trophy IV: Huân Chương Rừng Cổ Thụ Sylvan (Operation 4)',
    },
    {
      refId: 'campaign_medal_op5',
      name: 'Campaign Trophy V: Huân Chương Pháo Đài Cơ Giới (Operation 5)',
    },
    {
      refId: 'campaign_medal_op6',
      name: 'Campaign Trophy VI: Huân Chương Vực Thẳm Hải Vương (Operation 6)',
    },
    {
      refId: 'campaign_medal_op7',
      name: 'Campaign Trophy VII: Huân Chương Thảo Nguyên Cuồng Phong (Operation 7)',
    },
    {
      refId: 'campaign_medal_op8',
      name: 'Campaign Trophy VIII: Huân Chương Thánh Đường Ánh Sáng (Operation 8)',
    },
    {
      refId: 'campaign_medal_op9',
      name: 'Campaign Trophy IX: Huân Chương Tháp Tinh Cầu Bí Thuật (Operation 9)',
    },
    {
      refId: 'campaign_medal_op10',
      name: 'Campaign Trophy X: Huân Chương Tử Chiến Thành Bastion (Operation 10)',
    },
  ].map((c) => ({
    id: `asset_${c.refId}`,
    name: c.name,
    batchNumber: 22 as const,
    category: 'Elemental Titans & Sovereign #360' as const,
    partsCount: 10,
    polyStyle: 'Imperial Campaign Star-Medal, Twin Wings & Marble Pedestal',
    description: `10-part 3D campaign operation trophy commemorating victory in Bastion Protocol’s Story Campaign.`,
    previewType: 'ELEMENTAL_TITAN_SOVEREIGN' as const,
    refId: c.refId,
  })),
  ...[
    {
      refId: 'matrix_shrine_pierce_light',
      name: 'Counter Shrine: Xuyên Thấu Phá Giáp Nhẹ (Pierce → Light 125%)',
    },
    {
      refId: 'matrix_shrine_impact_medium',
      name: 'Counter Shrine: Chấn Động Phá Giáp Vừa (Impact → Medium 125%)',
    },
    {
      refId: 'matrix_shrine_magic_heavy',
      name: 'Counter Shrine: Ma Thuật Phá Giáp Nặng (Magic → Heavy 125%)',
    },
    {
      refId: 'matrix_shrine_siege_massive',
      name: 'Counter Shrine: Công Thành Phá Giáp Khổng Lồ (Siege → Massive 130%)',
    },
    {
      refId: 'matrix_shrine_pure_arcane',
      name: 'Counter Shrine: Chuẩn Sát Xuyên Mọi Giáp (Pure → All 100%)',
    },
    {
      refId: 'matrix_shrine_armor_shred',
      name: 'Combat Shrine: Ấn Nghiền Nát Giáp Trụ (Armor Shred Mastery)',
    },
    {
      refId: 'matrix_shrine_crit_strike',
      name: 'Combat Shrine: Ấn Bạo Kích Tử Thần (Critical Strike Mastery)',
    },
    {
      refId: 'matrix_shrine_lifesteal',
      name: 'Combat Shrine: Ấn Huyết Tinh Hút Máu (Vampiric Lifesteal)',
    },
    {
      refId: 'matrix_shrine_mana_surge',
      name: 'Combat Shrine: Ấn Bùng Nổ Năng Lượng (Mana Surge Conduit)',
    },
    {
      refId: 'matrix_shrine_execute',
      name: 'Combat Shrine: Ấn Phán Quyết Kết Liễu (Cull Execute Shrine)',
    },
    {
      refId: 'matrix_shrine_immortal',
      name: 'Combat Shrine: Ấn Bất Tử Hồi Sinh (Phoenix Immortal Shrine)',
    },
  ].map((m) => ({
    id: `asset_${m.refId}`,
    name: m.name,
    batchNumber: 22 as const,
    category: 'Elemental Titans & Sovereign #360' as const,
    partsCount: 11,
    polyStyle: '5x5 Tactical Matrix Altar, Dual Counter Rings & Apex Prism',
    description: `11-part 3D combat shrine enshrining the 5x5 Attack/Defense Counter Matrix of Bastion Protocol.`,
    previewType: 'ELEMENTAL_TITAN_SOVEREIGN' as const,
    refId: m.refId,
  })),
  {
    id: 'asset_sovereign_avatar_360_eternal_bastion',
    name: 'Masterpiece #360: Đại Thánh Điện Hộ Pháp Vĩnh Hằng Bastion (Apex #360)',
    batchNumber: 22,
    category: 'Elemental Titans & Sovereign #360',
    partsCount: 16,
    polyStyle: '16-Part Eternal Sovereign Avatar, 8 Star Obelisks & Triple Crown',
    description:
      '16-part flagship #360 3D Masterpiece Monument crowning the 22-Batch 3D Asset Pipeline.',
    previewType: 'ELEMENTAL_TITAN_SOVEREIGN',
    refId: 'sovereign_avatar_360_eternal_bastion',
  },
];

// ============================================================================
// BATCH 23: COMPANION SPIRITS, ARCANE CONDUITS & BALLISTIC PROJECTILES 3D (30)
// ============================================================================
const BATCH_23_COMPANION_SPIRITS_AND_BALLISTICS: AssetBatchItem[] = [
  ...(
    [
      {
        faction: 'Inferno' as FactionId,
        refId: 'spirit_familiar_inferno',
        name: 'Tinh Linh Hộ Vệ Hỏa Ngục (Inferno Cinder Wisp Familiar)',
      },
      {
        faction: 'Undead' as FactionId,
        refId: 'spirit_familiar_undead',
        name: 'Tinh Linh Hộ Vệ Tử Linh (Undead Soul Lantern Familiar)',
      },
      {
        faction: 'Nature' as FactionId,
        refId: 'spirit_familiar_nature',
        name: 'Tinh Linh Hộ Vệ Rừng Già (Nature Emerald Pixie Familiar)',
      },
      {
        faction: 'Mechanic' as FactionId,
        refId: 'spirit_familiar_mechanic',
        name: 'Drone Hộ Vệ Cơ Giới (Mechanic Gyro-Drone Familiar)',
      },
      {
        faction: 'Abyss' as FactionId,
        refId: 'spirit_familiar_abyss',
        name: 'Tinh Linh Hộ Vệ Vực Thẳm (Abyssal Nautilus Familiar)',
      },
      {
        faction: 'Wild' as FactionId,
        refId: 'spirit_familiar_wild',
        name: 'Tinh Linh Hộ Vệ Hoang Dã (Wild Falcon Totem Spirit)',
      },
      {
        faction: 'Divine' as FactionId,
        refId: 'spirit_familiar_divine',
        name: 'Tinh Linh Hộ Vệ Thánh Quang (Divine Cherub Halo Spirit)',
      },
      {
        faction: 'Arcane' as FactionId,
        refId: 'spirit_familiar_arcane',
        name: 'Tinh Linh Hộ Vệ Bí Thuật (Arcane Aether Sprite Familiar)',
      },
    ] as const
  ).map((s) => ({
    id: `asset_${s.refId}`,
    name: s.name,
    batchNumber: 23 as const,
    category: 'Companion Spirits & Ballistics 3D' as const,
    partsCount: 10,
    polyStyle: 'Sculpted Floating Spirit Core, Winged Orbitals & Harmonic Halo',
    description: `10-part organic sculpted 3D companion spirit familiar accompanying ${s.faction} legion fighters.`,
    faction: s.faction,
    previewType: 'COMPANION_BALLISTIC' as const,
    refId: s.refId,
  })),
  ...(
    [
      {
        faction: 'Inferno' as FactionId,
        refId: 'spell_conduit_inferno',
        name: 'Tháp Truyền Phép Hỏa Ngục (Inferno Pyre Spell Conduit)',
      },
      {
        faction: 'Undead' as FactionId,
        refId: 'spell_conduit_undead',
        name: 'Tháp Truyền Phép Tử Linh (Undead Necro-Loom Conduit)',
      },
      {
        faction: 'Nature' as FactionId,
        refId: 'spell_conduit_nature',
        name: 'Tháp Truyền Phép Rừng Già (Nature Verdant Leyline Conduit)',
      },
      {
        faction: 'Mechanic' as FactionId,
        refId: 'spell_conduit_mechanic',
        name: 'Tháp Truyền Phép Cơ Giới (Mechanic Tesla Coil Conduit)',
      },
      {
        faction: 'Abyss' as FactionId,
        refId: 'spell_conduit_abyss',
        name: 'Tháp Truyền Phép Vực Thẳm (Abyssal Maelstrom Conduit)',
      },
      {
        faction: 'Wild' as FactionId,
        refId: 'spell_conduit_wild',
        name: 'Tháp Truyền Phép Hoang Dã (Wild Tempest Totem Conduit)',
      },
      {
        faction: 'Divine' as FactionId,
        refId: 'spell_conduit_divine',
        name: 'Tháp Truyền Phép Thánh Quang (Divine Sunbeam Prism Conduit)',
      },
      {
        faction: 'Arcane' as FactionId,
        refId: 'spell_conduit_arcane',
        name: 'Tháp Truyền Phép Bí Thuật (Arcane Astral Matrix Conduit)',
      },
    ] as const
  ).map((c) => ({
    id: `asset_${c.refId}`,
    name: c.name,
    batchNumber: 23 as const,
    category: 'Companion Spirits & Ballistics 3D' as const,
    partsCount: 11,
    polyStyle: 'Sculpted Leyline Pedestal, Crystal Resonator & Dual Mana Rings',
    description: `11-part smooth 3D arcane conduit channeling ${c.faction} spell resonance across the battlefield.`,
    faction: c.faction,
    previewType: 'COMPANION_BALLISTIC' as const,
    refId: c.refId,
  })),
  ...[
    {
      refId: 'ballistic_arrow_pierce',
      name: 'Đạn Đạo 3D: Mũi Tên Xuyên Phá Ánh Sao (Starlight Pierce Arrow)',
    },
    {
      refId: 'ballistic_meteor_siege',
      name: 'Đạn Đạo 3D: Thiên Thạch Công Thành Dung Nham (Molten Siege Meteor)',
    },
    {
      refId: 'ballistic_nova_magic',
      name: 'Đạn Đạo 3D: Cầu Phép Tinh Vân Bí Thuật (Arcane Nebula Magic Orb)',
    },
    {
      refId: 'ballistic_hammer_impact',
      name: 'Đạn Đạo 3D: Búa Chấn Động Trọng Lực (Gravitic Impact War-Head)',
    },
    {
      refId: 'ballistic_lance_pure',
      name: 'Đạn Đạo 3D: Mũi Giáo Chân Lý Thuần Khiết (Sovereign Pure Lance)',
    },
    {
      refId: 'ballistic_frost_shard',
      name: 'Đạn Đạo 3D: Mũi Băng Vĩnh Cửu Làm Chậm (Glacial Frost Shard)',
    },
    {
      refId: 'ballistic_venom_glob',
      name: 'Đạn Đạo 3D: Cầu Độc Tố Ănòn Giáp (Corrosive Venom Globule)',
    },
    {
      refId: 'ballistic_chain_lightning',
      name: 'Đạn Đạo 3D: Lõi Sét Liên Hoàn Điện Từ (Arc-Tesla Lightning Core)',
    },
    {
      refId: 'ballistic_holy_sunbeam',
      name: 'Đạn Đạo 3D: Quang Tiễn Bình Minh Thánh Quang (Solar Sanctum Bolt)',
    },
    {
      refId: 'ballistic_void_singularity',
      name: 'Đạn Đạo 3D: Hạt Nhân Hố Đen Hư Không (Void Singularity Core)',
    },
  ].map((b) => ({
    id: `asset_${b.refId}`,
    name: b.name,
    batchNumber: 23 as const,
    category: 'Companion Spirits & Ballistics 3D' as const,
    partsCount: 9,
    polyStyle: 'Aerodynamic Ogive Warhead, Stabilizer Fins & Plasma Wake Ring',
    description: `9-part bespoke 3D ballistic projectile model rendered during ranged combat volleys.`,
    previewType: 'COMPANION_BALLISTIC' as const,
    refId: b.refId,
  })),
  ...[
    {
      refId: 'grid_anchor_frontline_bastion',
      name: 'Trụ Mốc Bàn Cờ: Tiền Tuyến Thiết Giáp (Frontline Grid Anchor)',
    },
    {
      refId: 'grid_anchor_midline_relay',
      name: 'Trụ Mốc Bàn Cờ: Trung Tuyến Chiến Thuật (Midline Tactical Relay)',
    },
    {
      refId: 'grid_anchor_backline_artillery',
      name: 'Trụ Mốc Bàn Cờ: Hậu Tuyến Pháo Binh (Backline Artillery Anchor)',
    },
    {
      refId: 'grid_anchor_sanctuary_aegis',
      name: 'Trụ Mốc Bàn Cờ: Vành Đai Bảo Hộ Nhà Chính (Sanctuary Aegis Pylon)',
    },
  ].map((g) => ({
    id: `asset_${g.refId}`,
    name: g.name,
    batchNumber: 23 as const,
    category: 'Companion Spirits & Ballistics 3D' as const,
    partsCount: 10,
    polyStyle: 'Beveled Corner Pylon, Holographic Grid Emitter & Floating Crest',
    description: `10-part 3D tactical grid boundary pylon anchoring the 7x6 deployment matrix.`,
    previewType: 'COMPANION_BALLISTIC' as const,
    refId: g.refId,
  })),
];

// ============================================================================
// BATCH 24: CITADEL SUPERWEAPONS, SOVEREIGN HALOS & APEX #420 (30 MODELS)
// ============================================================================
const BATCH_24_CITADEL_SUPERWEAPONS_AND_APEX_420: AssetBatchItem[] = [
  ...(
    [
      {
        faction: 'Inferno' as FactionId,
        refId: 'citadel_superweapon_inferno',
        name: 'Thần Khí Nhà Chính: Đại Pháo Dung Nham Hỏa Ngục (Inferno Hellstorm Cannon)',
      },
      {
        faction: 'Undead' as FactionId,
        refId: 'citadel_superweapon_undead',
        name: 'Thần Khí Nhà Chính: Tháp Linh Hồn Tử Thần (Undead Soul-Harvester Spire)',
      },
      {
        faction: 'Nature' as FactionId,
        refId: 'citadel_superweapon_nature',
        name: 'Thần Khí Nhà Chính: Đại Thụ Sinh Mệnh Bảo Hộ (Nature World-Bough Aegis)',
      },
      {
        faction: 'Mechanic' as FactionId,
        refId: 'citadel_superweapon_mechanic',
        name: 'Thần Khí Nhà Chính: Pháo Điện Từ Quỹ Đạo (Mechanic Orbital Rail-Battery)',
      },
      {
        faction: 'Abyss' as FactionId,
        refId: 'citadel_superweapon_abyss',
        name: 'Thần Khí Nhà Chính: Lõi Thủy Triều Sâu Thẳm (Abyssal Leviathan Mortar)',
      },
      {
        faction: 'Wild' as FactionId,
        refId: 'citadel_superweapon_wild',
        name: 'Thần Khí Nhà Chính: Trống Sấm Cuồng Nộ (Wild Thunder-Horn Resonator)',
      },
      {
        faction: 'Divine' as FactionId,
        refId: 'citadel_superweapon_divine',
        name: 'Thần Khí Nhà Chính: Tháp Phán Quyết Mặt Trời (Divine Solar Judgment Lance)',
      },
      {
        faction: 'Arcane' as FactionId,
        refId: 'citadel_superweapon_arcane',
        name: 'Thần Khí Nhà Chính: Tinh Cầu Vũ Trụ Bí Thuật (Arcane Singularity Projector)',
      },
    ] as const
  ).map((w) => ({
    id: `asset_${w.refId}`,
    name: w.name,
    batchNumber: 24 as const,
    category: 'Citadel Superweapons & Apex #420' as const,
    partsCount: 12,
    polyStyle: 'Sculpted Citadel Bastion Turret, Twin Energy Coils & Sovereign Core',
    description: `12-part faction Citadel superweapon battery defending the Southern Sanctuary Core.`,
    faction: w.faction,
    previewType: 'CITADEL_SUPERWEAPON_420' as const,
    refId: w.refId,
  })),
  ...[
    {
      refId: 'king_ascension_solar_wings',
      name: 'Thần Trang Hero King: Đôi Cánh Hoàng Kim Thái Dương (Solar Seraph Wings)',
    },
    {
      refId: 'king_ascension_void_mantle',
      name: 'Thần Trang Hero King: Áo Choàng Tinh Vân Hư Không (Void Nebula Mantle)',
    },
    {
      refId: 'king_ascension_emerald_sylph',
      name: 'Thần Trang Hero King: Cánh Phong Linh Ngọc Lục Bảo (Emerald Sylph Pinions)',
    },
    {
      refId: 'king_ascension_chrono_gears',
      name: 'Thần Trang Hero King: Vòng Bánh Răng Thời Gian (Chrono-Aether Astrolabe)',
    },
    {
      refId: 'king_ascension_necrotic_shroud',
      name: 'Thần Trang Hero King: Hào Quang Hắc Ám Minh Vương (Wraithlord Soul Shroud)',
    },
    {
      refId: 'king_ascension_primal_claws',
      name: 'Thần Trang Hero King: Chiến Giáp Thú Vương Nguyên Thủy (Primal Sovereign Crest)',
    },
    {
      refId: 'king_ascension_seraphic_halo',
      name: 'Thần Trang Hero King: Vương Miện Thánh Quang Bất Diệt (Archon Immortal Halo)',
    },
    {
      refId: 'king_ascension_astral_constellation',
      name: 'Thần Trang Hero King: Tinh Đồ Hoàng Đạo Tối Thượng (Astral Zodiac Regalia)',
    },
  ].map((k) => ({
    id: `asset_${k.refId}`,
    name: k.name,
    batchNumber: 24 as const,
    category: 'Citadel Superweapons & Apex #420' as const,
    partsCount: 11,
    polyStyle: 'Articulated Sovereign Wing Pinions, Floating Crown & Clearcoat Gems',
    description: `11-part sculpted 3D ascension regalia and wing mantle for the Hero King.`,
    previewType: 'CITADEL_SUPERWEAPON_420' as const,
    refId: k.refId,
  })),
  ...[
    {
      refId: 'bastion_monolith_alpha',
      name: 'Cột Trụ Phòng Tuyến: Mốc Chắn Sóng Xung Kích Alpha (Bastion Shock-Barrier Alpha)',
    },
    {
      refId: 'bastion_monolith_beta',
      name: 'Cột Trụ Phòng Tuyến: Trạm Cộng Hưởng Giáp Trụ Beta (Aegis Armor Relay Beta)',
    },
    {
      refId: 'bastion_monolith_gamma',
      name: 'Cột Trụ Phòng Tuyến: Lò Phản Ứng Tinh Thể Gamma (Mythium Core Reactor Gamma)',
    },
    {
      refId: 'bastion_monolith_delta',
      name: 'Cột Trụ Phòng Tuyến: Tháp Khuếch Đại Tốc Đánh Delta (Haste Beacon Pylon Delta)',
    },
    {
      refId: 'bastion_monolith_epsilon',
      name: 'Cột Trụ Phòng Tuyến: Đài Quan Sát Hư Không Epsilon (Void-Watch Spire Epsilon)',
    },
    {
      refId: 'bastion_monolith_zeta',
      name: 'Cột Trụ Phòng Tuyến: Trụ Chữa Lành Thánh Địa Zeta (Sanctuary Vitae Pillar Zeta)',
    },
    {
      refId: 'bastion_monolith_eta',
      name: 'Cột Trụ Phòng Tuyến: Mốc Phản Đòn Sấm Sét Eta (Thorns Tempest Monolith Eta)',
    },
    {
      refId: 'bastion_monolith_theta',
      name: 'Cột Trụ Phòng Tuyến: Cổng Tiếp Viện Tinh Nhuệ Theta (Vanguard Drop-Beacon Theta)',
    },
    {
      refId: 'bastion_monolith_iota',
      name: 'Cột Trụ Phòng Tuyến: Trụ Khắc Chế Quái Bay Iota (Sky-Net Gravity Pylon Iota)',
    },
    {
      refId: 'bastion_monolith_kappa',
      name: 'Cột Trụ Phòng Tuyến: Trụ Phá Giáp Boss Kappa (Colossus-Breaker Spire Kappa)',
    },
    {
      refId: 'bastion_monolith_lambda',
      name: 'Cột Trụ Phòng Tuyến: Đài Tích Tụ Vàng Hoàng Gia Lambda (Royal Treasury Obelisk Lambda)',
    },
    {
      refId: 'bastion_monolith_mu',
      name: 'Cột Trụ Phòng Tuyến: Tháp Hộ Pháp Tử Chiến Mu (Last-Stand Garrison Monolith Mu)',
    },
    {
      refId: 'bastion_monolith_omega',
      name: 'Cột Trụ Phòng Tuyến: Đại Mốc Phòng Thủ Tối Thượng Omega (Supreme Bastion Pylon Omega)',
    },
  ].map((m) => ({
    id: `asset_${m.refId}`,
    name: m.name,
    batchNumber: 24 as const,
    category: 'Citadel Superweapons & Apex #420' as const,
    partsCount: 11,
    polyStyle: 'Sculpted Runic Monolith, Floating Shield Rings & Radiant Apex Orb',
    description: `11-part sculpted 3D defensive monolith reinforcing the Bastion lane perimeter.`,
    previewType: 'CITADEL_SUPERWEAPON_420' as const,
    refId: m.refId,
  })),
  {
    id: 'asset_apex_420_omniverse_bastion_citadel',
    name: 'Masterpiece #420: Đại Kỳ Quan Vĩnh Cửu Bastion Protocol (Omniverse Apex #420)',
    batchNumber: 24,
    category: 'Citadel Superweapons & Apex #420',
    partsCount: 18,
    polyStyle: '18-Part Omniverse Bastion Sanctuary, 8 Faction Crowns & Triple Astral Gyroscope',
    description:
      '18-part flagship #420 Grand Masterpiece Monument crowning the 24-Batch / 420-Model Organic Sculpted 3D Asset Pipeline.',
    previewType: 'CITADEL_SUPERWEAPON_420',
    refId: 'apex_420_omniverse_bastion_citadel',
  },
];

export const ASSET_3D_CATALOG: AssetBatchItem[] = [
  ...BATCH_1_HERO_AND_CITADEL,
  ...BATCH_2_FIGHTERS,
  ...BATCH_3_MERCS_AND_BOSSES,
  ...BATCH_4_RELICS_AND_VFX,
  ...BATCH_5_WAVE_ENEMIES,
  ...BATCH_6_LEGION_SPELLS,
  ...BATCH_7_BATTLEFIELD_PROPS,
  ...BATCH_8_FACTION_SANCTUMS,
  ...BATCH_9_KING_SKILLS_AND_UPGRADES,
  ...BATCH_10_TACTICAL_ORDNANCE_AND_TROPHIES,
  ...BATCH_11_FIGHTER_ABILITIES,
  ...BATCH_12_SYNERGIES_AND_STATUS,
  ...BATCH_13_CAMPAIGN_AND_COMMANDERS,
  ...BATCH_14_COUNTER_MATRIX_AND_ROLES,
  ...BATCH_15_ECONOMY_AND_FINALE_MONUMENTS,
  ...BATCH_16_TIER2_ASCENSION_SHRINES,
  ...BATCH_17_ASTRAL_ANOMALIES_AND_PORTALS,
  ...BATCH_18_CITADEL_ARMORY_AND_ROYAL_RELICS,
  ...BATCH_19_WAR_MACHINES_AND_CONVOY_ENGINES,
  ...BATCH_20_CELESTIAL_WONDERS_AND_MYTHIC_PANTHEON,
  ...BATCH_21_WAR_BANNERS_RADARS_AND_FLAK_TOWERS,
  ...BATCH_22_ELEMENTAL_TITANS_AND_SOVEREIGN_AVATARS,
  ...BATCH_23_COMPANION_SPIRITS_AND_BALLISTICS,
  ...BATCH_24_CITADEL_SUPERWEAPONS_AND_APEX_420,
];

// ============================================================================
// SHARED PROCEDURAL TEXTURES & PBR MATERIAL CACHE (ZERO GC / ZERO 404)
// ============================================================================

let sharedShadowTex: THREE.CanvasTexture | null = null;
let sharedRunicRingTex: THREE.CanvasTexture | null = null;
let sharedMetalBumpTex: THREE.CanvasTexture | null = null;

export function getContactShadowTexture(): THREE.CanvasTexture {
  if (sharedShadowTex) return sharedShadowTex;
  if (typeof document === 'undefined') {
    sharedShadowTex = new THREE.CanvasTexture(new OffscreenCanvas(64, 64) as unknown as HTMLCanvasElement);
    return sharedShadowTex;
  }
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(64, 64, 6, 64, 64, 60);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
  grad.addColorStop(0.55, 'rgba(0, 0, 0, 0.28)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0.0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  sharedShadowTex = new THREE.CanvasTexture(canvas);
  sharedShadowTex.colorSpace = THREE.SRGBColorSpace;
  return sharedShadowTex;
}

export function getSurfaceBumpTexture(): THREE.CanvasTexture | null {
  if (sharedMetalBumpTex) return sharedMetalBumpTex;
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 128, 128);

  // Subtle brushed metal / carved stone micro-relief
  for (let i = 0; i < 420; i++) {
    const x = (i * 37) % 128;
    const y = (i * 73) % 128;
    const shade = i % 2 === 0 ? 155 : 100;
    ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
    ctx.fillRect(x, y, 6, 2);
  }
  // Panel bevel seams
  ctx.strokeStyle = '#505050';
  ctx.lineWidth = 2;
  ctx.strokeRect(8, 8, 112, 112);
  ctx.beginPath();
  ctx.moveTo(64, 8);
  ctx.lineTo(64, 120);
  ctx.stroke();

  sharedMetalBumpTex = new THREE.CanvasTexture(canvas);
  sharedMetalBumpTex.wrapS = THREE.RepeatWrapping;
  sharedMetalBumpTex.wrapT = THREE.RepeatWrapping;
  return sharedMetalBumpTex;
}

export function getRunicAuraTexture(): THREE.CanvasTexture {
  if (sharedRunicRingTex) return sharedRunicRingTex;
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, 256, 256);

  ctx.strokeStyle = '#4ADE80';
  ctx.lineWidth = 5;
  ctx.setLineDash([14, 10]);
  ctx.beginPath();
  ctx.arc(128, 128, 118, 0, Math.PI * 2);
  ctx.stroke();

  ctx.setLineDash([]);
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.75)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(128, 128, 96, 0, Math.PI * 2);
  ctx.stroke();

  const grad = ctx.createRadialGradient(128, 128, 15, 128, 128, 120);
  grad.addColorStop(0, 'rgba(34, 197, 94, 0.25)');
  grad.addColorStop(0.75, 'rgba(34, 197, 94, 0.08)');
  grad.addColorStop(1, 'rgba(34, 197, 94, 0.0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(128, 128, 120, 0, Math.PI * 2);
  ctx.fill();

  sharedRunicRingTex = new THREE.CanvasTexture(canvas);
  sharedRunicRingTex.colorSpace = THREE.SRGBColorSpace;
  return sharedRunicRingTex;
}

const matCache = new Map<string, THREE.MeshStandardMaterial>();
export function getPBRMaterial(
  color: string | number,
  roughness: number,
  metalness: number,
  emissive?: string | number,
  emissiveIntensity = 0
): THREE.MeshStandardMaterial {
  const key = `${color}_${roughness}_${metalness}_${emissive ?? 0}_${emissiveIntensity}`;
  const cached = matCache.get(key);
  if (cached) return cached;

  const bump = emissiveIntensity > 0.35 ? null : getSurfaceBumpTexture();
  const mat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    roughness: Math.max(0.08, roughness * 0.92),
    metalness,
    clearcoat: emissiveIntensity > 0.45 ? 0.18 : 0.45,
    clearcoatRoughness: 0.16,
    reflectivity: 0.88,
    emissive: emissive ? new THREE.Color(emissive) : new THREE.Color(0x000000),
    emissiveIntensity,
    bumpMap: bump,
    bumpScale: bump ? 0.005 : 0,
  });
  matCache.set(key, mat);
  return mat;
}

const sculptGeoCache = new Map<string, THREE.BufferGeometry>();

function createSculptedOrganicBoxGeometry(w: number, h: number, d: number): THREE.BufferGeometry {
  const key = `box_${w.toFixed(3)}_${h.toFixed(3)}_${d.toFixed(3)}`;
  const cached = sculptGeoCache.get(key);
  if (cached) return cached;

  // 6x6x6 subdivision with analytical SDF normal smoothing: silky-smooth bevels at 3x higher FPS
  const segX = 6;
  const segY = 6;
  const segZ = 6;
  const geo = new THREE.BoxGeometry(w, h, d, segX, segY, segZ);
  const pos = geo.attributes.position;
  const norm = geo.attributes.normal;

  const hx = Math.max(0.0001, w * 0.5);
  const hy = Math.max(0.0001, h * 0.5);
  const hz = Math.max(0.0001, d * 0.5);

  const bevelRatio = 0.38;
  const rx = hx * bevelRatio;
  const ry = hy * bevelRatio;
  const rz = hz * bevelRatio;
  const ix = hx - rx;
  const iy = hy - ry;
  const iz = hz - rz;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    const nx = x / hx;
    const ny = y / hy;
    const nz = z / hz;

    const cx = Math.max(-ix, Math.min(ix, x));
    const cy = Math.max(-iy, Math.min(iy, y));
    const cz = Math.max(-iz, Math.min(iz, z));

    const dx = x - cx;
    const dy = y - cy;
    const dz = z - cz;

    const elLen = Math.hypot(dx / rx, dy / ry, dz / rz);
    let px = x;
    let py = y;
    let pz = z;
    if (elLen > 0.00001) {
      px = cx + dx / elLen;
      py = cy + dy / elLen;
      pz = cz + dz / elLen;
    }

    // Gentle organic pillowing & forged-armor contour
    const midSwell = 1 + 0.055 * (1 - nx * nx * 0.65) * (1 - nz * nz * 0.65);
    const verticalContour = 1 - 0.032 * ny * ny;
    px *= midSwell * verticalContour;
    py *= 1 + 0.03 * (1 - nx * nx * 0.5) * (1 - nz * nz * 0.5);
    pz *= midSwell * verticalContour;

    pos.setXYZ(i, px, py, pz);

    // Seamless analytical normal across all 6 faces (eliminates hard cube creases)
    const gx = dx / (rx * rx) + nx * 0.32;
    const gy = dy / (ry * ry) + ny * 0.32;
    const gz = dz / (rz * rz) + nz * 0.32;
    const gLen = Math.hypot(gx, gy, gz) || 1;
    norm.setXYZ(i, gx / gLen, gy / gLen, gz / gLen);
  }

  pos.needsUpdate = true;
  norm.needsUpdate = true;
  geo.computeBoundingSphere();
  sculptGeoCache.set(key, geo);
  return geo;
}

function createSculptedOrganicCylinderGeometry(
  rTop: number,
  rBottom: number,
  height: number,
  openEnded = false
): THREE.BufferGeometry {
  const key = `cyl_${rTop.toFixed(3)}_${rBottom.toFixed(3)}_${height.toFixed(3)}_${openEnded ? 1 : 0}`;
  const cached = sculptGeoCache.get(key);
  if (cached) return cached;

  const radialSegs = 24;
  const heightSegs = 6;
  const geo = new THREE.CylinderGeometry(rTop, rBottom, height, radialSegs, heightSegs, openEnded);
  const pos = geo.attributes.position;
  const norm = geo.attributes.normal;
  const halfH = Math.max(0.0001, height * 0.5);

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    const v = Math.max(-1, Math.min(1, y / halfH));
    const absV = Math.abs(v);
    const r = Math.hypot(x, z);

    // Smooth chamfered cap rounding + graceful organic lathe contour
    let radialFactor = 1 + 0.045 * Math.cos(v * Math.PI * 0.5);
    let yAdjusted = y;
    if (!openEnded && absV > 0.78) {
      const t = (absV - 0.78) / 0.22;
      radialFactor *= 1 - 0.22 * t * t;
      yAdjusted = Math.sign(y) * halfH * (0.78 + 0.22 * Math.sin(t * Math.PI * 0.5));
    }

    const px = x * radialFactor;
    const pz = z * radialFactor;
    pos.setXYZ(i, px, yAdjusted, pz);

    const rx = r > 0.0001 ? x / r : 0;
    const rz = r > 0.0001 ? z / r : 0;
    const ny = openEnded ? 0 : Math.pow(v, 3) * 0.85;
    const nLen = Math.hypot(rx, ny, rz) || 1;
    norm.setXYZ(i, rx / nLen, ny / nLen, rz / nLen);
  }

  pos.needsUpdate = true;
  norm.needsUpdate = true;
  geo.computeBoundingSphere();
  sculptGeoCache.set(key, geo);
  return geo;
}

function createSculptedOrganicConeGeometry(radius: number, height: number): THREE.BufferGeometry {
  const key = `cone_${radius.toFixed(3)}_${height.toFixed(3)}`;
  const cached = sculptGeoCache.get(key);
  if (cached) return cached;

  const geo = new THREE.ConeGeometry(radius, height, 24, 8);
  const pos = geo.attributes.position;
  const halfH = Math.max(0.0001, height * 0.5);

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    // Normalized height t in [0, 1] from base to apex
    const t = Math.max(0, Math.min(1, (y + halfH) / Math.max(0.0001, height)));
    const linearProfile = Math.max(0.001, 1 - t);
    // Smooth parabolic ogive spire with soft base bevel and rounded tip
    const ogiveProfile = Math.pow(1 - t * 0.96, 0.76);
    const baseBevel = t < 0.1 ? 0.88 + 0.12 * Math.sin((t / 0.1) * Math.PI * 0.5) : 1;
    const scale = (ogiveProfile / linearProfile) * baseBevel;

    const ySoft = t > 0.92 ? y - (t - 0.92) * height * 0.18 : y;
    pos.setXYZ(i, x * scale, ySoft, z * scale);
  }

  pos.needsUpdate = true;
  geo.computeVertexNormals();
  geo.computeBoundingSphere();
  sculptGeoCache.set(key, geo);
  return geo;
}

function createSculptedOrganicGemOrbGeometry(radius: number): THREE.BufferGeometry {
  const key = `gem_${radius.toFixed(3)}`;
  const cached = sculptGeoCache.get(key);
  if (cached) return cached;

  const geo = new THREE.IcosahedronGeometry(radius, 2);
  const pos = geo.attributes.position;
  const norm = geo.attributes.normal;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const len = Math.hypot(x, y, z) || 1;
    const nx = x / len;
    const ny = y / len;
    const nz = z / len;

    const theta = Math.atan2(nz, nx);
    const phi = Math.asin(Math.max(-1, Math.min(1, ny)));
    const harmonic = 1 + 0.042 * Math.cos(theta * 4) * Math.cos(phi * 3);

    pos.setXYZ(i, nx * radius * harmonic, ny * radius * (harmonic * 1.03), nz * radius * harmonic);
    norm.setXYZ(i, nx, ny, nz);
  }

  pos.needsUpdate = true;
  norm.needsUpdate = true;
  geo.computeBoundingSphere();
  sculptGeoCache.set(key, geo);
  return geo;
}

function createSculptedOrganicTorusGeometry(
  radius: number,
  tube: number,
  arc = Math.PI * 2
): THREE.BufferGeometry {
  const key = `torus_${radius.toFixed(3)}_${tube.toFixed(3)}_${arc.toFixed(3)}`;
  const cached = sculptGeoCache.get(key);
  if (cached) return cached;

  const geo = new THREE.TorusGeometry(radius, tube, 16, 48, arc);
  sculptGeoCache.set(key, geo);
  return geo;
}

function createSculptedOrganicSphereGeometry(
  radius: number,
  phiStart = 0,
  phiLength = Math.PI * 2,
  thetaStart = 0,
  thetaLength = Math.PI
): THREE.BufferGeometry {
  const key = `sphere_${radius.toFixed(3)}_${phiStart.toFixed(2)}_${phiLength.toFixed(2)}_${thetaStart.toFixed(2)}_${thetaLength.toFixed(2)}`;
  const cached = sculptGeoCache.get(key);
  if (cached) return cached;

  const geo = new THREE.SphereGeometry(radius, 24, 18, phiStart, phiLength, thetaStart, thetaLength);
  sculptGeoCache.set(key, geo);
  return geo;
}

export type AnimState3D =
  | 'IDLE'
  | 'WALK'
  | 'ATTACK'
  | 'SKILL'
  | 'HIT'
  | 'VICTORY'
  | 'FALLEN';

export type RigPartRole =
  | 'BODY_PIVOT'
  | 'WEAPON_ARM'
  | 'SHIELD_ARM'
  | 'LEFT_LEG'
  | 'RIGHT_LEG'
  | 'LEFT_SHOULDER'
  | 'RIGHT_SHOULDER'
  | 'LEFT_WING'
  | 'RIGHT_WING'
  | 'HEAD_HELM'
  | 'TORSO_CORE'
  | 'CAPE_MANTLE'
  | 'HALO_RING'
  | 'ENERGY_CRYSTAL'
  | 'WHEEL_GEAR'
  | 'ORBITAL_SATELLITE'
  | 'STATIC_PLINTH';

export interface RigPartEntry {
  obj: THREE.Object3D;
  role: RigPartRole;
  side: -1 | 0 | 1;
  phase: number;
  basePosX: number;
  basePosY: number;
  basePosZ: number;
  baseRotX: number;
  baseRotY: number;
  baseRotZ: number;
  baseScaleX: number;
  baseScaleY: number;
  baseScaleZ: number;
  explodeDirX: number;
  explodeDirY: number;
  explodeDirZ: number;
}

export interface AnimRig3D {
  parts: RigPartEntry[];
  activeJointCount: number;
}

/**
 * O(1) lookup for named sub-parts ('bodyPivot', 'weaponArm', 'citadelCrystal', etc.)
 * avoiding expensive recursive .getObjectByName() traversals on every 60fps render frame.
 */
export function getFastPart(root: THREE.Group, name: string): THREE.Object3D | undefined {
  const map = root.userData.namedParts as Map<string, THREE.Object3D> | undefined;
  if (map) return map.get(name);
  return root.getObjectByName(name);
}

/**
 * Classifies a 3D sub-part into an anatomical or mechanical joint role based on its name,
 * original primitive geometry type, and rest position.
 */
function classifyRigPartRole(
  obj: THREE.Object3D,
  root: THREE.Group,
  origGeoType: string
): RigPartRole {
  const name = obj.name;
  if (name === 'bodyPivot') {
    if (obj instanceof THREE.Mesh && origGeoType === 'TorusGeometry') return 'HALO_RING';
    return 'BODY_PIVOT';
  }
  if (name === 'weaponArm') return 'WEAPON_ARM';
  if (name === 'shieldArm') return 'SHIELD_ARM';
  if (name === 'leftLeg') return 'LEFT_LEG';
  if (name === 'rightLeg') return 'RIGHT_LEG';
  if (name === 'leftShoulder') return 'LEFT_SHOULDER';
  if (name === 'rightShoulder') return 'RIGHT_SHOULDER';
  if (name === 'helmGroup') return 'HEAD_HELM';
  if (name === 'royalCape') return 'CAPE_MANTLE';
  if (name === 'citadelCrystal' || name === 'heartCore') return 'ENERGY_CRYSTAL';
  if (
    name === 'citadelGimbal' ||
    name === 'citadelInnerRing' ||
    name === 'portalVortex' ||
    name === 'tier2Halo' ||
    name === 'relicAnkh' ||
    name === 'pedestalRing'
  ) {
    return 'HALO_RING';
  }

  const isTopLevelChild = obj.parent === root || obj.parent?.name === 'bodyPivot';
  if (!isTopLevelChild) {
    if (origGeoType === 'TorusGeometry' || origGeoType === 'RingGeometry') {
      return 'HALO_RING';
    }
    if (
      (origGeoType === 'OctahedronGeometry' || origGeoType === 'IcosahedronGeometry') &&
      obj.position.y > 0.35
    ) {
      return 'ENERGY_CRYSTAL';
    }
    return 'STATIC_PLINTH';
  }

  const px = obj.position.x;
  const py = obj.position.y;
  const pz = obj.position.z;
  const absX = Math.abs(px);
  const absZ = Math.abs(pz);
  const radial = Math.hypot(px, pz);

  // Ground pedestal / plinth stays anchored to floor
  if (
    obj.parent === root &&
    py <= 0.48 &&
    absX < 0.15 &&
    absZ < 0.15 &&
    (origGeoType === 'CylinderGeometry' ||
      origGeoType === 'BoxGeometry' ||
      origGeoType === 'TorusGeometry')
  ) {
    return 'STATIC_PLINTH';
  }

  // Sideways cylinders on lower chassis -> Wheels / Treads / Gears
  if (
    origGeoType === 'CylinderGeometry' &&
    (Math.abs(obj.rotation.z) > 1.0 || Math.abs(obj.rotation.x) > 1.0) &&
    py <= 0.85 &&
    absX >= 0.18
  ) {
    return 'WHEEL_GEAR';
  }

  // Bipedal / Quadrupedal / Arachnid Legs
  if (py >= 0.12 && py <= 0.68 && absX >= 0.14 && absX <= 0.65 && absZ <= 0.55) {
    return px < 0 ? 'LEFT_LEG' : 'RIGHT_LEG';
  }

  // Halo / Gyroscope / Portal Rings
  if (origGeoType === 'TorusGeometry' || origGeoType === 'RingGeometry') {
    return py <= 0.25 && Math.abs(obj.rotation.x) > 1.2 ? 'STATIC_PLINTH' : 'HALO_RING';
  }

  // Wings / Feathered Pinions / Dorsal Fins
  if (absX >= 0.46 && py >= 0.72 && (pz < -0.04 || Math.abs(obj.rotation.z) >= 0.22)) {
    return px < 0 ? 'LEFT_WING' : 'RIGHT_WING';
  }

  // Shoulders / Pauldrons / Side Arms / Flanking Sponsons
  if (absX >= 0.2 && absX < 1.15 && py >= 0.52 && py <= 2.15) {
    return px < 0 ? 'LEFT_SHOULDER' : 'RIGHT_SHOULDER';
  }

  // Head / Helmet / Visor / Canopy
  if (
    absX < 0.22 &&
    py >= 1.4 &&
    (origGeoType === 'SphereGeometry' ||
      origGeoType === 'BoxGeometry' ||
      origGeoType === 'DodecahedronGeometry')
  ) {
    return 'HEAD_HELM';
  }

  // Floating Energy Crystal / Mana Core / Beacon
  if (
    (origGeoType === 'OctahedronGeometry' ||
      origGeoType === 'IcosahedronGeometry' ||
      origGeoType === 'DodecahedronGeometry') &&
    py >= 0.62
  ) {
    return 'ENERGY_CRYSTAL';
  }

  // Outer Orbitals / Corner Turrets / Pylons
  if (radial >= 0.65 && py >= 0.3) {
    return 'ORBITAL_SATELLITE';
  }

  // Main Torso / Spire / Hull
  if (py >= 0.42) {
    return 'TORSO_CORE';
  }

  return 'STATIC_PLINTH';
}

/**
 * Traverses a 3D model hierarchy once at creation time, replaces any low-poly / blocky primitive
 * geometries with cached, rounded-bevel, organically sculpted geometries, indexes all named
 * sub-parts into `root.userData.namedParts`, and builds a full multi-joint `AnimRig3D` (`root.userData.animRig`).
 */
export function sculptAndSmoothAssetGroup(root: THREE.Group): THREE.Group {
  if (root.userData.isOrganicSculpted) return root;
  root.userData.isOrganicSculpted = true;

  const namedParts = new Map<string, THREE.Object3D>();
  root.userData.namedParts = namedParts;

  const rigParts: RigPartEntry[] = [];
  let partIdx = 0;
  let activeJointCount = 0;

  root.traverse((obj) => {
    if (obj.name && !namedParts.has(obj.name)) {
      namedParts.set(obj.name, obj);
    }
    if (obj === root || obj.name === 'contactShadow') return;

    let origGeoType = '';
    if (obj instanceof THREE.Mesh && obj.geometry) {
      const geo = obj.geometry;
      origGeoType = geo.type;
      const params = (
        geo as unknown as { parameters?: Record<string, number | boolean | undefined> }
      ).parameters;
      if (params) {
        if (origGeoType === 'BoxGeometry') {
          const w = typeof params.width === 'number' ? params.width : 1;
          const h = typeof params.height === 'number' ? params.height : 1;
          const d = typeof params.depth === 'number' ? params.depth : 1;
          obj.geometry = createSculptedOrganicBoxGeometry(w, h, d);
        } else if (origGeoType === 'CylinderGeometry') {
          const rTop = typeof params.radiusTop === 'number' ? params.radiusTop : 0.5;
          const rBottom = typeof params.radiusBottom === 'number' ? params.radiusBottom : 0.5;
          const height = typeof params.height === 'number' ? params.height : 1;
          const openEnded = Boolean(params.openEnded);
          obj.geometry = createSculptedOrganicCylinderGeometry(rTop, rBottom, height, openEnded);
        } else if (origGeoType === 'ConeGeometry') {
          const radius = typeof params.radius === 'number' ? params.radius : 0.5;
          const height = typeof params.height === 'number' ? params.height : 1;
          obj.geometry = createSculptedOrganicConeGeometry(radius, height);
        } else if (
          origGeoType === 'OctahedronGeometry' ||
          origGeoType === 'DodecahedronGeometry' ||
          origGeoType === 'IcosahedronGeometry'
        ) {
          const radius = typeof params.radius === 'number' ? params.radius : 0.5;
          obj.geometry = createSculptedOrganicGemOrbGeometry(radius);
        } else if (origGeoType === 'TorusGeometry') {
          const radius = typeof params.radius === 'number' ? params.radius : 1;
          const tube = typeof params.tube === 'number' ? params.tube : 0.1;
          const arc = typeof params.arc === 'number' ? params.arc : Math.PI * 2;
          obj.geometry = createSculptedOrganicTorusGeometry(radius, tube, arc);
        } else if (origGeoType === 'SphereGeometry') {
          const radius = typeof params.radius === 'number' ? params.radius : 0.5;
          const phiStart = typeof params.phiStart === 'number' ? params.phiStart : 0;
          const phiLength =
            typeof params.phiLength === 'number' ? params.phiLength : Math.PI * 2;
          const thetaStart = typeof params.thetaStart === 'number' ? params.thetaStart : 0;
          const thetaLength =
            typeof params.thetaLength === 'number' ? params.thetaLength : Math.PI;
          obj.geometry = createSculptedOrganicSphereGeometry(
            radius,
            phiStart,
            phiLength,
            thetaStart,
            thetaLength
          );
        }
      }
    }

    const role = classifyRigPartRole(obj, root, origGeoType);
    if (role !== 'STATIC_PLINTH') {
      activeJointCount += 1;
    }

    const bx = obj.position.x;
    const by = obj.position.y;
    const bz = obj.position.z;
    const side: -1 | 0 | 1 = bx < -0.05 ? -1 : bx > 0.05 ? 1 : 0;

    rigParts.push({
      obj,
      role,
      side,
      phase: partIdx * 0.85 + Math.atan2(bz, bx),
      basePosX: bx,
      basePosY: by,
      basePosZ: bz,
      baseRotX: obj.rotation.x,
      baseRotY: obj.rotation.y,
      baseRotZ: obj.rotation.z,
      baseScaleX: obj.scale.x,
      baseScaleY: obj.scale.y,
      baseScaleZ: obj.scale.z,
      explodeDirX: bx * 0.55,
      explodeDirY: by > 0.5 ? by * 0.45 : 0,
      explodeDirZ: bz * 0.55,
    });
    partIdx += 1;
  });

  // Fallback: if a simple prop had no classified joints, promote its highest child to ENERGY_CRYSTAL
  if (activeJointCount === 0 && rigParts.length > 0) {
    rigParts[rigParts.length - 1].role = 'ENERGY_CRYSTAL';
    activeJointCount = 1;
  }

  const animRig: AnimRig3D = {
    parts: rigParts,
    activeJointCount,
  };
  root.userData.animRig = animRig;

  return root;
}

/**
 * Full multi-joint procedural 3D animation driver for all 420 sculpted 3D models.
 * Supports 7 complete animation states ('IDLE' | 'WALK' | 'ATTACK' | 'SKILL' | 'HIT' | 'VICTORY' | 'FALLEN'),
 * speed scaling, phase offsets (so armies never move in robotic lockstep), and exploded-view inspection.
 * Zero per-frame object allocations for 60 FPS performance.
 */
export function animateAsset3DModel(
  root: THREE.Group,
  state: AnimState3D,
  elapsed: number,
  options?: {
    phaseOffset?: number;
    speed?: number;
    explodedRatio?: number;
  }
): void {
  const rig = root.userData.animRig as AnimRig3D | undefined;
  if (!rig) return;

  const speed = options?.speed ?? 1.0;
  const phaseOffset = options?.phaseOffset ?? 0;
  const explode = options?.explodedRatio ?? 0;
  const t = elapsed * speed + phaseOffset;

  const walkCycle = t * 7.8;
  const atkRaw = (t * 2.1) % 1;
  const atkPhase = atkRaw < 0 ? atkRaw + 1 : atkRaw;
  // Attack envelope: 0..0.35 windup (-1), 0.35..0.55 strike (+1), 0.55..1.0 recovery (0)
  const atkSwing =
    atkPhase < 0.35
      ? -(atkPhase / 0.35) * 0.75
      : atkPhase < 0.56
      ? -0.75 + ((atkPhase - 0.35) / 0.21) * 1.95
      : 1.2 * (1 - (atkPhase - 0.56) / 0.44);

  const hitPulse = Math.pow(Math.max(0, Math.sin(t * 4.8)), 4);
  const victoryJump = Math.abs(Math.sin(t * 5.4));

  const parts = rig.parts;
  const len = parts.length;

  for (let i = 0; i < len; i++) {
    const p = parts[i];
    const obj = p.obj;
    const role = p.role;
    const side = p.side || 1;
    const ph = p.phase;

    let dx = p.explodeDirX * explode;
    let dy = p.explodeDirY * explode;
    let dz = p.explodeDirZ * explode;

    let rx = 0;
    let ry = 0;
    let rz = 0;

    let sx = 1;
    let sy = 1;
    let sz = 1;

    if (state === 'IDLE') {
      switch (role) {
        case 'BODY_PIVOT':
          dy += Math.sin(t * 2.5) * 0.055;
          rz += Math.sin(t * 1.25) * 0.024;
          ry += Math.sin(t * 0.9) * 0.045;
          break;
        case 'TORSO_CORE': {
          const breath = Math.sin(t * 2.5) * 0.026;
          sx = 1 + breath;
          sy = 1 - breath * 0.5;
          sz = 1 + breath;
          break;
        }
        case 'HEAD_HELM':
          ry += Math.sin(t * 1.35) * 0.16;
          rx += Math.sin(t * 2.5 + 0.6) * 0.06;
          break;
        case 'WEAPON_ARM':
          rx += Math.sin(t * 2.5) * 0.14;
          rz += Math.cos(t * 1.8) * 0.06;
          break;
        case 'SHIELD_ARM':
        case 'LEFT_SHOULDER':
        case 'RIGHT_SHOULDER':
          dy += Math.sin(t * 2.5 + side * 0.7) * 0.032;
          rx += Math.sin(t * 1.8 + side) * 0.08;
          break;
        case 'LEFT_WING':
        case 'RIGHT_WING':
          ry += side * Math.sin(t * 3.4) * 0.22;
          rz += side * Math.cos(t * 3.4) * 0.14;
          break;
        case 'CAPE_MANTLE':
          rx += 0.06 + Math.sin(t * 3.0) * 0.07;
          ry += Math.cos(t * 2.1) * 0.05;
          break;
        case 'HALO_RING':
          rz += t * (1.3 + (i % 2) * 0.55) * (i % 2 === 0 ? 1 : -1);
          ry += Math.sin(t * 1.4 + ph) * 0.22;
          break;
        case 'ENERGY_CRYSTAL': {
          dy += Math.sin(t * 3.1 + ph) * 0.085;
          ry += t * 1.65;
          const pulse = 1 + Math.sin(t * 4.2 + ph) * 0.055;
          sx = pulse;
          sy = pulse;
          sz = pulse;
          break;
        }
        case 'ORBITAL_SATELLITE':
          dy += Math.sin(t * 2.6 + ph) * 0.075;
          ry += Math.sin(t * 1.5 + ph) * 0.22;
          break;
        default:
          break;
      }
    } else if (state === 'WALK') {
      const legPhase = walkCycle + (side < 0 ? 0 : Math.PI);
      const stride = Math.sin(legPhase);
      const lift = Math.max(0, Math.cos(legPhase));

      switch (role) {
        case 'BODY_PIVOT':
          dy += Math.abs(Math.sin(walkCycle)) * 0.22;
          rx += 0.16 + Math.sin(walkCycle * 2) * 0.04;
          rz += Math.cos(walkCycle) * 0.095;
          ry += Math.sin(walkCycle) * 0.16;
          break;
        case 'TORSO_CORE':
          ry += Math.sin(walkCycle) * 0.12;
          rz += Math.cos(walkCycle) * 0.05;
          break;
        case 'LEFT_LEG':
        case 'RIGHT_LEG':
          rx += stride * 0.82;
          dz += stride * 0.34;
          dy += lift * 0.24;
          break;
        case 'WEAPON_ARM':
          rx += Math.sin(walkCycle + Math.PI) * 0.68;
          ry += Math.cos(walkCycle) * 0.24;
          rz += Math.sin(walkCycle) * 0.15;
          dz += Math.sin(walkCycle + Math.PI) * 0.2;
          break;
        case 'SHIELD_ARM':
          rx += Math.sin(walkCycle) * 0.58;
          ry += -Math.cos(walkCycle) * 0.22;
          dz += Math.sin(walkCycle) * 0.18;
          break;
        case 'LEFT_SHOULDER':
        case 'RIGHT_SHOULDER':
          rx += Math.sin(walkCycle + (side < 0 ? 0 : Math.PI)) * 0.45;
          dy += Math.abs(Math.cos(walkCycle)) * 0.08;
          rz += side * Math.sin(walkCycle) * 0.12;
          break;
        case 'HEAD_HELM':
          rx += -0.08 + Math.abs(Math.sin(walkCycle)) * 0.08;
          ry += -Math.sin(walkCycle) * 0.12;
          break;
        case 'LEFT_WING':
        case 'RIGHT_WING':
          ry += side * Math.sin(walkCycle * 1.4) * 0.38;
          rz += side * Math.cos(walkCycle * 1.4) * 0.22;
          break;
        case 'CAPE_MANTLE':
          rx += 0.42 + Math.sin(walkCycle * 2) * 0.22;
          ry += Math.cos(walkCycle) * 0.14;
          dz -= 0.08 + Math.abs(Math.sin(walkCycle)) * 0.08;
          break;
        case 'WHEEL_GEAR':
          rx += t * 9.5;
          break;
        case 'HALO_RING':
          rz += t * 2.8 * (i % 2 === 0 ? 1 : -1);
          break;
        case 'ENERGY_CRYSTAL':
          dy += Math.sin(walkCycle * 2) * 0.12;
          ry += t * 3.0;
          break;
        case 'ORBITAL_SATELLITE':
          dy += Math.sin(walkCycle + ph) * 0.12;
          ry += t * 2.2;
          break;
        default:
          break;
      }
    } else if (state === 'ATTACK') {
      switch (role) {
        case 'BODY_PIVOT':
          dz += Math.max(0, atkSwing) * 0.18;
          rx += atkSwing * 0.16;
          ry += atkSwing * 0.22;
          dy += Math.abs(atkSwing) * 0.06;
          break;
        case 'WEAPON_ARM':
          rx += atkSwing * 0.95;
          ry += atkSwing * 0.25;
          dz += Math.max(0, atkSwing) * 0.12;
          break;
        case 'SHIELD_ARM':
          rx += -atkSwing * 0.32;
          ry += 0.22;
          dz += 0.08;
          break;
        case 'LEFT_SHOULDER':
        case 'RIGHT_SHOULDER':
          rx += side > 0 ? atkSwing * 0.55 : -atkSwing * 0.28;
          rz += side * Math.max(0, atkSwing) * 0.15;
          break;
        case 'LEFT_LEG':
        case 'RIGHT_LEG':
          rx += side < 0 ? Math.max(0, atkSwing) * 0.28 : -Math.max(0, atkSwing) * 0.28;
          dz += side < 0 ? Math.max(0, atkSwing) * 0.1 : -Math.max(0, atkSwing) * 0.08;
          break;
        case 'HEAD_HELM':
          rx += -atkSwing * 0.08;
          ry += -atkSwing * 0.12;
          break;
        case 'LEFT_WING':
        case 'RIGHT_WING':
          ry += side * (0.25 + atkSwing * 0.38);
          rz += -side * Math.max(0, atkSwing) * 0.22;
          break;
        case 'CAPE_MANTLE':
          rx += 0.22 + Math.abs(atkSwing) * 0.25;
          break;
        case 'HALO_RING':
          rz += t * 4.2 * (i % 2 === 0 ? 1 : -1);
          break;
        case 'ENERGY_CRYSTAL': {
          ry += t * 4.5;
          const flare = 1 + Math.max(0, atkSwing) * 0.22;
          sx = flare;
          sy = flare;
          sz = flare;
          break;
        }
        case 'ORBITAL_SATELLITE':
          dy += Math.max(0, atkSwing) * 0.15;
          ry += t * 3.2;
          break;
        default:
          break;
      }
    } else if (state === 'SKILL') {
      const castWave = Math.sin(t * 6.0);
      switch (role) {
        case 'BODY_PIVOT':
          dy += 0.24 + Math.sin(t * 4.2) * 0.09;
          rx += -0.12 + Math.sin(t * 3.0) * 0.05;
          ry += Math.sin(t * 2.2) * 0.28;
          break;
        case 'TORSO_CORE': {
          const surge = 1 + Math.sin(t * 7.5) * 0.06;
          sx = surge;
          sy = surge;
          sz = surge;
          break;
        }
        case 'WEAPON_ARM':
          rx += -0.82 + castWave * 0.22;
          rz += 0.22 + Math.cos(t * 6.0) * 0.14;
          dy += 0.12;
          break;
        case 'SHIELD_ARM':
        case 'LEFT_SHOULDER':
        case 'RIGHT_SHOULDER':
          rx += -0.45 + castWave * 0.18;
          rz += -side * (0.28 + Math.sin(t * 6.0) * 0.12);
          dy += 0.08;
          break;
        case 'HEAD_HELM':
          rx += -0.22 + Math.sin(t * 4.0) * 0.08;
          break;
        case 'LEFT_WING':
        case 'RIGHT_WING':
          ry += side * Math.sin(t * 7.2) * 0.42;
          rz += -side * (0.32 + Math.cos(t * 7.2) * 0.18);
          break;
        case 'CAPE_MANTLE':
          rx += 0.38 + Math.sin(t * 8.0) * 0.16;
          break;
        case 'HALO_RING': {
          rz += t * 5.8 * (i % 2 === 0 ? 1 : -1);
          rx += Math.sin(t * 3.6 + ph) * 0.55;
          const ringScale = 1.12 + Math.sin(t * 8.0 + ph) * 0.08;
          sx = ringScale;
          sy = ringScale;
          sz = ringScale;
          break;
        }
        case 'ENERGY_CRYSTAL': {
          dy += 0.18 + Math.sin(t * 6.5 + ph) * 0.12;
          ry += t * 6.2;
          const crystalScale = 1.24 + Math.sin(t * 9.5 + ph) * 0.14;
          sx = crystalScale;
          sy = crystalScale;
          sz = crystalScale;
          break;
        }
        case 'ORBITAL_SATELLITE':
          dy += 0.18 + Math.sin(t * 5.2 + ph) * 0.14;
          ry += t * 4.0;
          break;
        default:
          break;
      }
    } else if (state === 'HIT') {
      switch (role) {
        case 'BODY_PIVOT':
          dz += -0.18 * hitPulse;
          rx += -0.24 * hitPulse;
          dx += Math.sin(t * 42) * 0.065 * hitPulse;
          dy += -0.06 * hitPulse;
          break;
        case 'SHIELD_ARM':
        case 'LEFT_SHOULDER':
          ry += 0.42 * hitPulse;
          dz += 0.14 * hitPulse;
          rx += -0.25 * hitPulse;
          break;
        case 'WEAPON_ARM':
        case 'RIGHT_SHOULDER':
          rz += -0.38 * hitPulse;
          rx += -0.32 * hitPulse;
          break;
        case 'HEAD_HELM':
          rx += 0.25 * hitPulse;
          ry += Math.sin(t * 28) * 0.12 * hitPulse;
          break;
        case 'LEFT_WING':
        case 'RIGHT_WING':
          ry += -side * 0.35 * hitPulse;
          break;
        default:
          break;
      }
    } else if (state === 'VICTORY') {
      switch (role) {
        case 'BODY_PIVOT':
          dy += victoryJump * 0.28;
          ry += Math.sin(t * 2.7) * 0.42;
          rz += Math.cos(t * 5.4) * 0.08;
          break;
        case 'WEAPON_ARM':
          rx += -0.92 + Math.sin(t * 10.8) * 0.35;
          rz += 0.18;
          dy += 0.14;
          break;
        case 'SHIELD_ARM':
        case 'LEFT_SHOULDER':
        case 'RIGHT_SHOULDER':
          dy += victoryJump * 0.12;
          rz += -side * (0.28 + victoryJump * 0.18);
          rx += -0.35 * victoryJump;
          break;
        case 'LEFT_LEG':
        case 'RIGHT_LEG':
          rx += side * Math.sin(t * 5.4) * 0.35;
          dy += victoryJump * 0.08;
          break;
        case 'HEAD_HELM':
          rx += -0.15 * victoryJump;
          ry += Math.sin(t * 5.4) * 0.18;
          break;
        case 'LEFT_WING':
        case 'RIGHT_WING':
          ry += side * Math.sin(t * 8.0) * 0.38;
          rz += -side * 0.28;
          break;
        case 'HALO_RING':
          rz += t * 4.5 * (i % 2 === 0 ? 1 : -1);
          break;
        case 'ENERGY_CRYSTAL': {
          dy += victoryJump * 0.2;
          ry += t * 5.0;
          const vScale = 1.16 + victoryJump * 0.12;
          sx = vScale;
          sy = vScale;
          sz = vScale;
          break;
        }
        default:
          break;
      }
    } else if (state === 'FALLEN') {
      switch (role) {
        case 'BODY_PIVOT':
          dy += -0.28 + Math.sin(t * 1.4) * 0.018;
          rx += 0.46;
          rz += 0.14;
          break;
        case 'WEAPON_ARM':
          rx += 0.58;
          rz += 0.26;
          break;
        case 'SHIELD_ARM':
        case 'LEFT_SHOULDER':
        case 'RIGHT_SHOULDER':
          rx += 0.32;
          dy += -0.08;
          break;
        case 'LEFT_LEG':
        case 'RIGHT_LEG':
          rx += -0.38;
          dy += 0.12;
          break;
        case 'HEAD_HELM':
          rx += 0.32;
          break;
        case 'LEFT_WING':
        case 'RIGHT_WING':
          rz += side * 0.36;
          break;
        case 'HALO_RING':
          rz += t * 0.35;
          break;
        case 'ENERGY_CRYSTAL':
          ry += t * 0.4;
          sx = 0.84;
          sy = 0.84;
          sz = 0.84;
          break;
        default:
          break;
      }
    }

    obj.position.set(p.basePosX + dx, p.basePosY + dy, p.basePosZ + dz);
    obj.rotation.set(p.baseRotX + rx, p.baseRotY + ry, p.baseRotZ + rz);

    if (obj.name !== 'kingSwordBlade') {
      obj.scale.set(p.baseScaleX * sx, p.baseScaleY * sy, p.baseScaleZ * sz);
    }
  }
}

let sharedContactShadowGeo: THREE.PlaneGeometry | null = null;
let sharedContactShadowMat: THREE.MeshBasicMaterial | null = null;

function addContactShadow(group: THREE.Group, radius: number): void {
  if (typeof document === 'undefined') return;
  if (!sharedContactShadowGeo) {
    sharedContactShadowGeo = new THREE.PlaneGeometry(1, 1);
  }
  if (!sharedContactShadowMat) {
    sharedContactShadowMat = new THREE.MeshBasicMaterial({
      map: getContactShadowTexture(),
      transparent: true,
      depthWrite: false,
      opacity: 0.75,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
  }
  const plane = new THREE.Mesh(sharedContactShadowGeo, sharedContactShadowMat);
  plane.scale.set(radius * 2.4, radius * 2.4, 1);
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = 0.02;
  plane.name = 'contactShadow';
  group.add(plane);
}

// ============================================================================
// BATCH 1: HERO KING, CITADEL, BREACH GATE, MYTHIUM QUARRY & WORKER 3D
// ============================================================================

/**
 * Builds the 12-part articulated 3D Hero King model (`THREE.Group`), grounded at y=0.
 * Includes live attachment sockets (`relicCrown`, `relicAnkh`, `relicBanner`, `relicWings`)
 * toggled dynamically when the player purchases items from the Citadel Armory!
 */
export function createHeroKing3DModel(teamId: 0 | 1 = 0): THREE.Group {
  const root = new THREE.Group();
  root.name = `HeroKing_${teamId}`;

  const primaryGold = teamId === 0 ? '#F59E0B' : '#E11D48';
  const secondaryTrim = teamId === 0 ? '#FEF08A' : '#FDA4AF';
  const capeColor = teamId === 0 ? '#1D4ED8' : '#881337';
  const bladeHex = teamId === 0 ? '#38BDF8' : '#F97316';
  const darkSteel = '#1E293B';

  const armorMat = getPBRMaterial(primaryGold, 0.22, 0.88);
  const trimMat = getPBRMaterial(secondaryTrim, 0.15, 0.95, secondaryTrim, 0.18);
  const steelMat = getPBRMaterial(darkSteel, 0.52, 0.65);
  const capeMat = getPBRMaterial(capeColor, 0.78, 0.12);
  const bladeMat = getPBRMaterial(bladeHex, 0.12, 0.92, bladeHex, 0.48);
  const phoenixMat = getPBRMaterial('#FB923C', 0.15, 0.92, '#F97316', 0.55);

  addContactShadow(root, 1.85);

  // 1. Sovereign Royal Pedestal Ring
  const ringGeo = new THREE.TorusGeometry(1.15, 0.08, 10, 28);
  const ringMesh = new THREE.Mesh(ringGeo, trimMat);
  ringMesh.rotation.x = Math.PI / 2;
  ringMesh.position.y = 0.08;
  ringMesh.name = 'pedestalRing';
  root.add(ringMesh);

  const bodyPivot = new THREE.Group();
  bodyPivot.name = 'bodyPivot';
  root.add(bodyPivot);

  // 2 & 3. Articulated Hip-Pivoted Armored Greaves, Sabaton War-Boots & Winged Striders
  const legGeo = new THREE.CylinderGeometry(0.23, 0.19, 0.88, 10);
  const bootGeo = new THREE.BoxGeometry(0.36, 0.24, 0.56);
  const striderWingGeo = new THREE.ConeGeometry(0.14, 0.48, 4);
  for (const side of [-1, 1]) {
    const legPivot = new THREE.Group();
    legPivot.position.set(side * 0.36, 0.92, 0);
    legPivot.name = side < 0 ? 'leftLeg' : 'rightLeg';
    bodyPivot.add(legPivot);

    const greave = new THREE.Mesh(legGeo, steelMat);
    greave.position.set(0, -0.42, 0);
    greave.castShadow = true;
    legPivot.add(greave);

    const kneeGuard = new THREE.Mesh(new THREE.OctahedronGeometry(0.21, 0), armorMat);
    kneeGuard.position.set(0, -0.28, 0.22);
    legPivot.add(kneeGuard);

    const sabatonBoot = new THREE.Mesh(bootGeo, armorMat);
    sabatonBoot.position.set(0, -0.8, 0.18);
    sabatonBoot.castShadow = true;
    legPivot.add(sabatonBoot);

    const striderFin = new THREE.Mesh(striderWingGeo, trimMat);
    striderFin.position.set(side * 0.22, -0.68, -0.06);
    striderFin.rotation.x = -0.35;
    striderFin.rotation.z = side * -0.38;
    legPivot.add(striderFin);
  }

  // 4. Cuirass Torso (Beveled Hexagonal Chestplate)
  const torsoGeo = new THREE.CylinderGeometry(0.68, 0.48, 1.25, 8);
  const torso = new THREE.Mesh(torsoGeo, armorMat);
  torso.position.set(0, 1.42, 0);
  torso.castShadow = true;
  torso.name = 'torso';
  bodyPivot.add(torso);

  // 5. Glowing Sovereign Heart Core on Chest
  const coreGeo = new THREE.OctahedronGeometry(0.24, 0);
  const coreMesh = new THREE.Mesh(coreGeo, bladeMat);
  coreMesh.position.set(0, 1.5, 0.56);
  coreMesh.name = 'heartCore';
  bodyPivot.add(coreMesh);

  // 6. Flowing Royal Mantle / Cape
  const capeGeo = new THREE.BoxGeometry(1.18, 1.58, 0.12);
  const cape = new THREE.Mesh(capeGeo, capeMat);
  cape.position.set(0, 1.25, -0.52);
  cape.rotation.x = 0.18;
  cape.castShadow = true;
  cape.name = 'royalCape';
  bodyPivot.add(cape);

  // 7 & 8. Winged Pauldrons (Left & Right Shoulders)
  const pauldronGeo = new THREE.DodecahedronGeometry(0.38, 0);
  for (const side of [-1, 1]) {
    const pauldron = new THREE.Mesh(pauldronGeo, armorMat);
    pauldron.position.set(side * 0.82, 1.88, 0);
    pauldron.scale.set(1.15, 0.85, 1.0);
    pauldron.castShadow = true;
    pauldron.name = side < 0 ? 'leftShoulder' : 'rightShoulder';
    bodyPivot.add(pauldron);

    const wingFin = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.65, 4), trimMat);
    wingFin.position.set(side * 0.22, 0.28, -0.1);
    wingFin.rotation.z = side * -0.45;
    pauldron.add(wingFin);
  }

  // 9. Sovereign Helm & Visor
  const helmGroup = new THREE.Group();
  helmGroup.position.set(0, 2.38, 0);
  helmGroup.name = 'helmGroup';
  bodyPivot.add(helmGroup);

  const headMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.32, 0.62, 8), steelMat);
  headMesh.castShadow = true;
  helmGroup.add(headMesh);

  const crownMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.44, 0.36, 0.28, 6, 1, true),
    trimMat
  );
  crownMesh.position.y = 0.28;
  helmGroup.add(crownMesh);

  const visorMesh = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.12, 0.25), bladeMat);
  visorMesh.position.set(0, 0.04, 0.26);
  helmGroup.add(visorMesh);

  // 10. Right Weapon Arm: Sunfire Greatsword
  const weaponArm = new THREE.Group();
  weaponArm.position.set(0.88, 1.65, 0.2);
  weaponArm.name = 'weaponArm';
  bodyPivot.add(weaponArm);

  const hilt = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.55, 8), steelMat);
  weaponArm.add(hilt);

  const guard = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.12, 0.16), trimMat);
  guard.position.y = 0.28;
  weaponArm.add(guard);

  const swordBlade = new THREE.Mesh(new THREE.ConeGeometry(0.19, 1.9, 4), bladeMat);
  swordBlade.position.y = 1.24;
  swordBlade.scale.set(1.0, 1.0, 0.35);
  swordBlade.castShadow = true;
  swordBlade.name = 'kingSwordBlade';
  weaponArm.add(swordBlade);
  weaponArm.rotation.x = Math.PI / 5;

  // 11. Left Shield Arm: Sovereign Aegis Tower Shield
  const shieldArm = new THREE.Group();
  shieldArm.position.set(-0.88, 1.48, 0.32);
  shieldArm.name = 'shieldArm';
  bodyPivot.add(shieldArm);

  const shieldBody = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.42, 1.15, 6), armorMat);
  shieldBody.scale.set(0.9, 1.0, 0.22);
  shieldBody.rotation.y = -0.35;
  shieldBody.castShadow = true;
  shieldArm.add(shieldBody);

  const shieldBoss = new THREE.Mesh(new THREE.OctahedronGeometry(0.22, 0), trimMat);
  shieldBoss.position.set(-0.08, 0.05, 0.14);
  shieldArm.add(shieldBoss);

  // 12. Dynamic Relic Attachment Group (Phoenix Ankh Halo & Dorsal War Banner)
  const relicAnkh = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.055, 8, 24), phoenixMat);
  relicAnkh.position.set(0, 1.95, -0.45);
  relicAnkh.name = 'relicAnkh';
  relicAnkh.visible = false; // Enabled when King buys Phoenix Ankh or Relics
  bodyPivot.add(relicAnkh);

  const relicBanner = new THREE.Group();
  relicBanner.position.set(0, 2.25, -0.58);
  relicBanner.name = 'relicBanner';
  relicBanner.visible = false;
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.6, 6), trimMat);
  const flag = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.55, 0.05), phoenixMat);
  flag.position.set(0, 0.45, 0);
  relicBanner.add(pole, flag);
  bodyPivot.add(relicBanner);

  return sculptAndSmoothAssetGroup(root);
}

/**
 * Builds the 10-part Citadel Sanctuary Core (Nhà Chính) 3D Monument, grounded at y=0.
 */
export function createCitadel3DModel(teamId: 0 | 1 = 0): THREE.Group {
  const root = new THREE.Group();
  root.name = `CitadelCore_${teamId}`;

  const crystalHex = teamId === 0 ? '#38BDF8' : '#F43F5E';
  const auraHex = teamId === 0 ? '#4ADE80' : '#FB7185';

  const basaltMat = getPBRMaterial('#0F172A', 0.72, 0.28);
  const graniteMat = getPBRMaterial('#1E293B', 0.55, 0.42);
  const goldTrimMat = getPBRMaterial('#F59E0B', 0.2, 0.9);
  const crystalMat = getPBRMaterial(crystalHex, 0.12, 0.85, crystalHex, 0.55);
  const emeraldMat = getPBRMaterial(auraHex, 0.18, 0.78, auraHex, 0.4);

  addContactShadow(root, 4.2);

  // 1. Octagonal Basalt Fortress Plinth
  const baseMesh = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.6, 0.75, 8), basaltMat);
  baseMesh.position.y = 0.38;
  baseMesh.receiveShadow = true;
  baseMesh.castShadow = true;
  root.add(baseMesh);

  // 2. Stepped Inner Sanctuary Dais
  const daisMesh = new THREE.Mesh(new THREE.CylinderGeometry(2.15, 2.45, 0.55, 8), graniteMat);
  daisMesh.position.y = 0.95;
  daisMesh.receiveShadow = true;
  root.add(daisMesh);

  // 3..6. Four Corner Bastion Turrets with Gold Caps & Emerald Beacons
  for (let i = 0; i < 4; i++) {
    const angle = (Math.PI / 2) * i + Math.PI / 4;
    const tx = Math.cos(angle) * 2.55;
    const tz = Math.sin(angle) * 2.55;

    const towerGroup = new THREE.Group();
    towerGroup.position.set(tx, 0.7, tz);

    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, 1.85, 6), graniteMat);
    pillar.position.y = 0.92;
    pillar.castShadow = true;
    towerGroup.add(pillar);

    const cap = new THREE.Mesh(new THREE.ConeGeometry(0.58, 0.65, 6), goldTrimMat);
    cap.position.y = 2.15;
    towerGroup.add(cap);

    const beacon = new THREE.Mesh(new THREE.OctahedronGeometry(0.22, 0), emeraldMat);
    beacon.position.y = 2.68;
    towerGroup.add(beacon);

    root.add(towerGroup);
  }

  // 7. Central Levitating Citadel Mana Crystal
  const crystalMesh = new THREE.Mesh(new THREE.OctahedronGeometry(1.15, 0), crystalMat);
  crystalMesh.position.y = 2.85;
  crystalMesh.scale.set(0.85, 1.45, 0.85);
  crystalMesh.castShadow = true;
  crystalMesh.name = 'citadelCrystal';
  root.add(crystalMesh);

  // 8. Rotating Golden Gimbal Ring
  const gimbalMesh = new THREE.Mesh(new THREE.TorusGeometry(1.55, 0.09, 10, 32), goldTrimMat);
  gimbalMesh.position.y = 2.85;
  gimbalMesh.rotation.x = Math.PI / 3;
  gimbalMesh.name = 'citadelGimbal';
  root.add(gimbalMesh);

  // 9. Counter-Rotating Sanctuary Ring
  const innerRing = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.06, 8, 28), emeraldMat);
  innerRing.position.y = 2.85;
  innerRing.rotation.y = Math.PI / 4;
  innerRing.name = 'citadelInnerRing';
  root.add(innerRing);

  // 10. Base Crown Ring
  const crownRing = new THREE.Mesh(new THREE.TorusGeometry(2.3, 0.08, 8, 24), goldTrimMat);
  crownRing.rotation.x = Math.PI / 2;
  crownRing.position.y = 1.24;
  root.add(crownRing);

  return sculptAndSmoothAssetGroup(root);
}

/**
 * Builds the 8-part Abyssal Breach Gate (Northern Wave Spawn Portal).
 */
export function createBreachGate3DModel(): THREE.Group {
  const root = new THREE.Group();
  root.name = 'BreachGate';

  const obsidianMat = getPBRMaterial('#111827', 0.65, 0.35);
  const crimsonMat = getPBRMaterial('#DC2626', 0.25, 0.75, '#EF4444', 0.55);
  const bronzeMat = getPBRMaterial('#B45309', 0.3, 0.85);

  addContactShadow(root, 3.8);

  const slab = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.35, 2.2), obsidianMat);
  slab.position.y = 0.18;
  slab.receiveShadow = true;
  root.add(slab);

  for (const side of [-1, 1]) {
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.75, 3.8, 6), obsidianMat);
    pillar.position.set(side * 2.5, 1.9, 0);
    pillar.castShadow = true;
    root.add(pillar);

    const horn = new THREE.Mesh(new THREE.ConeGeometry(0.48, 1.45, 5), bronzeMat);
    horn.position.set(side * 2.3, 4.1, 0);
    horn.rotation.z = side * -0.35;
    root.add(horn);
  }

  const lintel = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.65, 0.9), bronzeMat);
  lintel.position.set(0, 3.75, 0);
  lintel.castShadow = true;
  root.add(lintel);

  const vortex = new THREE.Mesh(new THREE.TorusGeometry(1.75, 0.14, 10, 32), crimsonMat);
  vortex.position.set(0, 2.1, 0);
  vortex.name = 'portalVortex';
  root.add(vortex);

  const coreSkull = new THREE.Mesh(new THREE.OctahedronGeometry(0.48, 0), crimsonMat);
  coreSkull.position.set(0, 3.85, 0.45);
  root.add(coreSkull);

  return sculptAndSmoothAssetGroup(root);
}

/**
 * Builds the 9-part Mythium Crystal Quarry monument (placed behind the Citadel).
 */
export function createMythiumQuarry3DModel(): THREE.Group {
  const root = new THREE.Group();
  root.name = 'MythiumQuarry';

  const basaltMat = getPBRMaterial('#1E293B', 0.7, 0.3);
  const brassMat = getPBRMaterial('#D97706', 0.28, 0.85);
  const mythiumMat = getPBRMaterial('#A855F7', 0.12, 0.88, '#9333EA', 0.65);

  addContactShadow(root, 2.4);

  // 1. Quarry Basalt Foundation
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.85, 2.2, 0.42, 7), basaltMat);
  base.position.y = 0.21;
  root.add(base);

  // 2. Brass Extractor Ring
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.55, 0.1, 8, 24), brassMat);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.45;
  root.add(ring);

  // 3..8. Six Clustered Mythium Crystal Spires
  const spireOffsets = [
    { x: 0, z: 0, h: 2.3, r: 0.46, rotX: 0, rotZ: 0 },
    { x: -0.68, z: 0.35, h: 1.65, r: 0.34, rotX: 0.18, rotZ: 0.28 },
    { x: 0.72, z: 0.28, h: 1.75, r: 0.36, rotX: 0.14, rotZ: -0.32 },
    { x: -0.48, z: -0.62, h: 1.45, r: 0.3, rotX: -0.24, rotZ: 0.2 },
    { x: 0.55, z: -0.58, h: 1.55, r: 0.32, rotX: -0.22, rotZ: -0.22 },
    { x: 0, z: 0.78, h: 1.25, r: 0.28, rotX: 0.32, rotZ: 0 },
  ];

  for (const s of spireOffsets) {
    const spire = new THREE.Mesh(new THREE.ConeGeometry(s.r, s.h, 6), mythiumMat);
    spire.position.set(s.x, 0.35 + s.h * 0.45, s.z);
    spire.rotation.set(s.rotX, 0, s.rotZ);
    spire.castShadow = true;
    root.add(spire);
  }

  // 9. Levitating Harvester Halo
  const halo = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.06, 8, 20), mythiumMat);
  halo.rotation.x = Math.PI / 2;
  halo.position.y = 2.45;
  halo.name = 'bodyPivot';
  root.add(halo);

  return sculptAndSmoothAssetGroup(root);
}

/**
 * Builds the 8-part Automaton Mythium Worker 3D Model.
 */
export function createMythiumWorker3DModel(): THREE.Group {
  const root = new THREE.Group();
  root.name = 'MythiumWorker';

  const brassMat = getPBRMaterial('#F59E0B', 0.28, 0.85);
  const ironMat = getPBRMaterial('#334155', 0.55, 0.65);
  const mythiumMat = getPBRMaterial('#C084FC', 0.12, 0.9, '#9333EA', 0.65);
  const lampMat = getPBRMaterial('#38BDF8', 0.1, 0.95, '#38BDF8', 0.7);

  addContactShadow(root, 0.85);

  const bodyPivot = new THREE.Group();
  bodyPivot.name = 'bodyPivot';
  root.add(bodyPivot);

  // 1 & 2. Treads / Stubby Automaton Legs
  for (const side of [-1, 1]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.42, 0.38), ironMat);
    leg.position.set(side * 0.24, 0.21, 0);
    bodyPivot.add(leg);
  }

  // 3. Domed Clockwork Hull
  const hull = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, 0.68, 8), brassMat);
  hull.position.y = 0.72;
  hull.castShadow = true;
  bodyPivot.add(hull);

  // 4. Mining Helmet Dome
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.36, 12, 8), ironMat);
  dome.position.y = 1.15;
  bodyPivot.add(dome);

  // 5. Optical Mining Lamp
  const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.18, 8), lampMat);
  lamp.rotation.x = Math.PI / 2;
  lamp.position.set(0, 1.18, 0.32);
  bodyPivot.add(lamp);

  // 6. Dorsal Mythium Crystal Canister (Backpack)
  const pack = new THREE.Mesh(new THREE.OctahedronGeometry(0.28, 0), mythiumMat);
  pack.position.set(0, 0.92, -0.44);
  pack.scale.set(0.85, 1.35, 0.85);
  bodyPivot.add(pack);

  // 7 & 8. Right Pickaxe Arm (Handle + Double Crystal Pick Head)
  const weaponArm = new THREE.Group();
  weaponArm.position.set(0.52, 0.88, 0.18);
  weaponArm.name = 'weaponArm';
  bodyPivot.add(weaponArm);

  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.78, 6), ironMat);
  shaft.position.y = 0.25;
  weaponArm.add(shaft);

  const pickHead = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.62, 4), mythiumMat);
  pickHead.rotation.x = Math.PI / 2;
  pickHead.position.set(0, 0.58, 0.12);
  weaponArm.add(pickHead);

  return sculptAndSmoothAssetGroup(root);
}

// ============================================================================
// BATCH 2: BESPOKE 8-FACTION & 7-ROLE COMPOSITE 3D FIGHTER BUILDER (8-10 PARTS)
// ============================================================================

export function createFighter3DModel(fighterId: string): THREE.Group {
  const cfg = FIGHTER_MAP[fighterId];
  const faction: FactionId = cfg?.faction ?? 'Inferno';
  const role: FighterRole = cfg?.role ?? 'Tank';
  const isTier3 = cfg?.tier === 3;
  const isTier2 = cfg?.tier === 2 || isTier3;
  const primaryHex = cfg?.color ?? FACTIONS[faction].primaryColor;
  const accentHex = cfg?.accentColor ?? FACTIONS[faction].secondaryColor;

  const root = new THREE.Group();
  root.name = `Fighter_${fighterId}`;

  const scale = isTier3 ? 1.42 : isTier2 ? 1.24 : 1.0;
  addContactShadow(root, 0.95 * scale);

  const primaryMat = getPBRMaterial(primaryHex, isTier3 ? 0.2 : 0.3, isTier3 ? 0.88 : 0.76);
  const accentMat = getPBRMaterial(
    accentHex,
    0.15,
    0.92,
    accentHex,
    isTier3 ? 0.55 : isTier2 ? 0.38 : 0.16
  );
  const darkMetalMat = getPBRMaterial('#1E293B', 0.58, 0.48);
  const glowMat = getPBRMaterial(accentHex, 0.08, 0.95, accentHex, isTier3 ? 0.82 : 0.62);
  const goldTrimMat = getPBRMaterial('#FBBF24', 0.14, 0.95, '#F59E0B', 0.45);

  // 1. Tactical Base Pedestal (Hexagonal Runic Plinth for Tier 2, Cylindrical for Tier 1)
  const baseGeo = new THREE.CylinderGeometry(
    0.68 * scale,
    0.76 * scale,
    0.16 * scale,
    isTier2 ? 6 : 16
  );
  const baseMesh = new THREE.Mesh(baseGeo, isTier2 ? accentMat : darkMetalMat);
  baseMesh.position.y = 0.08 * scale;
  root.add(baseMesh);

  const bodyGroup = new THREE.Group();
  bodyGroup.name = 'bodyPivot';
  root.add(bodyGroup);

  // 2 & 3. Lower Stance / Legs / Hover Vortex depending on Faction
  if (faction === 'Arcane' || faction === 'Abyss') {
    const hoverCone = new THREE.Mesh(
      new THREE.ConeGeometry(0.46 * scale, 0.85 * scale, 6),
      darkMetalMat
    );
    hoverCone.rotation.x = Math.PI;
    hoverCone.position.y = 0.58 * scale;
    bodyGroup.add(hoverCone);

    const vortexRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.48 * scale, 0.045 * scale, 8, 20),
      glowMat
    );
    vortexRing.rotation.x = Math.PI / 2;
    vortexRing.position.y = 0.32 * scale;
    bodyGroup.add(vortexRing);
  } else {
    for (const side of [-1, 1]) {
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.16 * scale, 0.14 * scale, 0.65 * scale, 8),
        darkMetalMat
      );
      leg.position.set(side * 0.22 * scale, 0.42 * scale, 0);
      leg.castShadow = true;
      bodyGroup.add(leg);
    }
  }

  // 4. Primary Torso / Hull Silhouette (customized by Faction & Role)
  const torsoGeo =
    role === 'Tank'
      ? new THREE.BoxGeometry(0.88 * scale, 0.94 * scale, 0.7 * scale)
      : faction === 'Nature'
      ? new THREE.DodecahedronGeometry(0.56 * scale, 0)
      : role === 'AoE' || role === 'Support'
      ? new THREE.OctahedronGeometry(0.56 * scale, 0)
      : new THREE.CylinderGeometry(0.48 * scale, 0.36 * scale, 0.88 * scale, 7);
  const torso = new THREE.Mesh(torsoGeo, primaryMat);
  torso.position.y = 1.05 * scale;
  torso.castShadow = true;
  bodyGroup.add(torso);

  // 5. Faction-Specific Chest Core / Dorsal Feature
  if (faction === 'Mechanic') {
    // Twin Dorsal Steam Exhaust Stacks
    for (const side of [-1, 1]) {
      const pipe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08 * scale, 0.1 * scale, 0.65 * scale, 8),
        accentMat
      );
      pipe.position.set(side * 0.24 * scale, 1.48 * scale, -0.34 * scale);
      pipe.rotation.x = -0.25;
      bodyGroup.add(pipe);
    }
  } else if (faction === 'Divine') {
    // Articulated Feathered Wings
    for (const side of [-1, 1]) {
      const wing = new THREE.Mesh(
        new THREE.BoxGeometry(0.68 * scale, 0.92 * scale, 0.08 * scale),
        accentMat
      );
      wing.position.set(side * 0.56 * scale, 1.38 * scale, -0.34 * scale);
      wing.rotation.z = side * -0.38;
      wing.rotation.y = side * 0.25;
      bodyGroup.add(wing);
    }
  } else {
    // Glowing Faction Heart Crystal
    const chestGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.18 * scale, 0), glowMat);
    chestGem.position.set(0, 1.1 * scale, 0.38 * scale);
    bodyGroup.add(chestGem);
  }

  // 6 & 7. Shoulder Pauldrons
  for (const side of [-1, 1]) {
    const shoulderGeo =
      faction === 'Nature'
        ? new THREE.DodecahedronGeometry(0.28 * scale, 0)
        : faction === 'Mechanic'
        ? new THREE.CylinderGeometry(0.24 * scale, 0.24 * scale, 0.36 * scale, 8)
        : new THREE.ConeGeometry(0.26 * scale, 0.5 * scale, 5);
    const shoulder = new THREE.Mesh(shoulderGeo, accentMat);
    shoulder.position.set(side * 0.56 * scale, 1.32 * scale, 0);
    shoulder.rotation.z = side * -0.4;
    shoulder.castShadow = true;
    bodyGroup.add(shoulder);
  }

  // 8. Head / Helm / Crest
  const headGeo =
    faction === 'Mechanic'
      ? new THREE.BoxGeometry(0.44 * scale, 0.42 * scale, 0.44 * scale)
      : faction === 'Arcane'
      ? new THREE.OctahedronGeometry(0.32 * scale, 0)
      : new THREE.SphereGeometry(0.28 * scale, 12, 10);
  const head = new THREE.Mesh(headGeo, darkMetalMat);
  head.position.y = 1.68 * scale;
  head.castShadow = true;
  bodyGroup.add(head);

  const visor = new THREE.Mesh(
    new THREE.BoxGeometry(0.32 * scale, 0.1 * scale, 0.22 * scale),
    glowMat
  );
  visor.position.set(0, 1.68 * scale, 0.2 * scale);
  bodyGroup.add(visor);

  // Faction Horn / Canopy / Crown on Head
  if (faction === 'Inferno' || faction === 'Wild' || faction === 'Undead') {
    for (const side of [-1, 1]) {
      const horn = new THREE.Mesh(
        new THREE.ConeGeometry(0.09 * scale, 0.42 * scale, 5),
        accentMat
      );
      horn.position.set(side * 0.24 * scale, 1.92 * scale, 0);
      horn.rotation.z = side * -0.45;
      bodyGroup.add(horn);
    }
  } else if (faction === 'Nature') {
    const canopy = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.38 * scale, 0),
      glowMat
    );
    canopy.position.set(0, 1.98 * scale, 0);
    bodyGroup.add(canopy);
  }

  // 9. Role-Specific Weapon / Artillery / Staff
  const weaponGroup = new THREE.Group();
  weaponGroup.position.set(0.58 * scale, 1.15 * scale, 0.22 * scale);
  weaponGroup.name = 'weaponArm';
  bodyGroup.add(weaponGroup);

  if (role === 'Tank') {
    const shield = new THREE.Mesh(
      new THREE.BoxGeometry(0.16 * scale, 0.95 * scale, 0.68 * scale),
      accentMat
    );
    shield.position.set(-1.12 * scale, 0, 0.15 * scale);
    shield.castShadow = true;
    weaponGroup.add(shield);

    const hammerShaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05 * scale, 0.05 * scale, 0.85 * scale, 6),
      darkMetalMat
    );
    hammerShaft.position.y = 0.2 * scale;
    weaponGroup.add(hammerShaft);

    const hammerHead = new THREE.Mesh(
      new THREE.BoxGeometry(0.35 * scale, 0.28 * scale, 0.54 * scale),
      primaryMat
    );
    hammerHead.position.set(0, 0.62 * scale, 0.12 * scale);
    weaponGroup.add(hammerHead);
  } else if (role === 'DPS' || role === 'Carry') {
    const barrel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1 * scale, 0.14 * scale, 1.28 * scale, 8),
      glowMat
    );
    barrel.rotation.x = Math.PI / 3;
    barrel.position.set(0, 0.25 * scale, 0.35 * scale);
    weaponGroup.add(barrel);
  } else if (role === 'Specialist') {
    // Twin Assassin / Executioner Blades
    const blade1 = new THREE.Mesh(
      new THREE.ConeGeometry(0.12 * scale, 1.15 * scale, 4),
      glowMat
    );
    blade1.position.set(0, 0.45 * scale, 0.25 * scale);
    blade1.rotation.x = Math.PI / 4;
    weaponGroup.add(blade1);
  } else {
    // Arcane / Support / Aura Staff with Floating Orb
    const staff = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05 * scale, 0.05 * scale, 1.35 * scale, 6),
      accentMat
    );
    staff.position.y = 0.2 * scale;
    weaponGroup.add(staff);

    const orb = new THREE.Mesh(new THREE.OctahedronGeometry(0.24 * scale, 0), glowMat);
    orb.position.y = 0.98 * scale;
    weaponGroup.add(orb);
  }

  // 10. Tier-2 & Tier-3 Ascended Halo Rings & Sovereign Pinions
  if (isTier2) {
    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(0.54 * scale, 0.05 * scale, 8, 24),
      isTier3 ? goldTrimMat : glowMat
    );
    halo.position.set(0, 1.58 * scale, -0.34 * scale);
    halo.name = 'tier2Halo';
    bodyGroup.add(halo);
  }
  if (isTier3) {
    const outerHalo = new THREE.Mesh(
      new THREE.TorusGeometry(0.76 * scale, 0.045 * scale, 8, 28),
      glowMat
    );
    outerHalo.position.set(0, 1.62 * scale, -0.38 * scale);
    outerHalo.rotation.z = Math.PI / 4;
    bodyGroup.add(outerHalo);

    const apexGem = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.22 * scale, 0),
      goldTrimMat
    );
    apexGem.position.set(0, 2.25 * scale, 0);
    bodyGroup.add(apexGem);

    for (const side of [-1, 1]) {
      const wing = new THREE.Mesh(
        new THREE.ConeGeometry(0.2 * scale, 0.95 * scale, 4),
        goldTrimMat
      );
      wing.position.set(side * 0.68 * scale, 1.52 * scale, -0.28 * scale);
      wing.rotation.z = side * -0.52;
      bodyGroup.add(wing);
    }
  }

  return sculptAndSmoothAssetGroup(root);
}

// ============================================================================
// BATCH 3: MERCENARIES, SIEGE ENGINES & RAID BOSSES 3D BUILDER
// ============================================================================

export function createEnemyOrMerc3DModel(options: {
  isBoss?: boolean;
  isMercenary?: boolean;
  mercenaryId?: string;
  bossId?: string;
  color?: string;
}): THREE.Group {
  const root = new THREE.Group();
  const isBoss = Boolean(options.isBoss);
  const isMerc = Boolean(options.isMercenary);
  const mercCfg = options.mercenaryId ? MERCENARY_MAP[options.mercenaryId] : null;
  const groupType: MercenaryGroup | 'Wave' = mercCfg?.group ?? 'Brute';

  const scale = isBoss ? 1.62 : isMerc ? 1.2 : 0.92;
  addContactShadow(root, 1.08 * scale);

  const mainHex =
    options.color ??
    (options.bossId === 'boss_wave_14'
      ? '#0284C7'
      : options.bossId === 'boss_wave_18'
      ? '#F59E0B'
      : isBoss
      ? '#DC2626'
      : isMerc
      ? '#9333EA'
      : '#EF4444');
  const trimHex =
    options.bossId === 'boss_wave_14'
      ? '#38BDF8'
      : options.bossId === 'boss_wave_18'
      ? '#FEF08A'
      : isBoss
      ? '#FACC15'
      : isMerc
      ? '#C084FC'
      : '#FCA5A5';

  const hullMat = getPBRMaterial(mainHex, 0.34, 0.74);
  const trimMat = getPBRMaterial(trimHex, 0.18, 0.9, trimHex, isBoss ? 0.48 : 0.25);
  const obsidianMat = getPBRMaterial('#111827', 0.65, 0.4);

  const bodyPivot = new THREE.Group();
  bodyPivot.name = 'bodyPivot';
  root.add(bodyPivot);

  // Archetype A: Wheeled Siege Beast / Battering Ram
  if (groupType === 'Siege Beast' && !isBoss) {
    const chassis = new THREE.Mesh(
      new THREE.BoxGeometry(1.1 * scale, 0.65 * scale, 1.55 * scale),
      hullMat
    );
    chassis.position.y = 0.62 * scale;
    chassis.castShadow = true;
    bodyPivot.add(chassis);

    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(0.85 * scale, 0.65 * scale, 4),
      obsidianMat
    );
    roof.position.y = 1.22 * scale;
    roof.rotation.y = Math.PI / 4;
    bodyPivot.add(roof);

    const ramLog = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18 * scale, 0.22 * scale, 1.95 * scale, 8),
      trimMat
    );
    ramLog.rotation.x = Math.PI / 2;
    ramLog.position.set(0, 0.58 * scale, 0.35 * scale);
    ramLog.name = 'weaponArm';
    bodyPivot.add(ramLog);

    for (const sx of [-0.62, 0.62]) {
      for (const sz of [-0.52, 0.52]) {
        const wheel = new THREE.Mesh(
          new THREE.CylinderGeometry(0.28 * scale, 0.28 * scale, 0.16 * scale, 12),
          obsidianMat
        );
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(sx * scale, 0.28 * scale, sz * scale);
        bodyPivot.add(wheel);
      }
    }
    return sculptAndSmoothAssetGroup(root);
  }

  // Archetype B: Armored Rift Snail / Scout
  if (groupType === 'Scout' && !isBoss) {
    const slugBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.55 * scale, 0.38 * scale, 1.35 * scale),
      obsidianMat
    );
    slugBody.position.y = 0.25 * scale;
    bodyPivot.add(slugBody);

    const spiralShell = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.62 * scale, 0),
      hullMat
    );
    spiralShell.position.set(0, 0.78 * scale, -0.1 * scale);
    spiralShell.castShadow = true;
    bodyPivot.add(spiralShell);

    for (const side of [-1, 1]) {
      const spike = new THREE.Mesh(
        new THREE.ConeGeometry(0.16 * scale, 0.52 * scale, 5),
        trimMat
      );
      spike.position.set(side * 0.42 * scale, 1.18 * scale, -0.1 * scale);
      spike.rotation.z = side * -0.45;
      bodyPivot.add(spike);

      const feeler = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04 * scale, 0.04 * scale, 0.45 * scale, 6),
        trimMat
      );
      feeler.position.set(side * 0.16 * scale, 0.55 * scale, 0.62 * scale);
      feeler.rotation.x = 0.45;
      bodyPivot.add(feeler);
    }
    return sculptAndSmoothAssetGroup(root);
  }

  // Archetype C: Bipedal Raider / Mercenary Titan / Raid Boss
  for (const side of [-1, 1]) {
    const leg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.19 * scale, 0.15 * scale, 0.72 * scale, 8),
      obsidianMat
    );
    leg.position.set(side * 0.26 * scale, 0.36 * scale, 0);
    leg.castShadow = true;
    bodyPivot.add(leg);
  }

  const torso = new THREE.Mesh(new THREE.DodecahedronGeometry(0.62 * scale, 0), hullMat);
  torso.position.y = 1.08 * scale;
  torso.castShadow = true;
  bodyPivot.add(torso);

  for (const side of [-1, 1]) {
    const horn = new THREE.Mesh(
      new THREE.ConeGeometry(0.22 * scale, 0.75 * scale, 5),
      trimMat
    );
    horn.position.set(side * 0.55 * scale, 1.55 * scale, -0.1 * scale);
    horn.rotation.z = side * -0.45;
    bodyPivot.add(horn);
  }

  const head = new THREE.Mesh(new THREE.OctahedronGeometry(0.34 * scale, 0), obsidianMat);
  head.position.y = 1.72 * scale;
  bodyPivot.add(head);

  const weaponArm = new THREE.Group();
  weaponArm.position.set(0.62 * scale, 1.18 * scale, 0.25 * scale);
  weaponArm.name = 'weaponArm';
  bodyPivot.add(weaponArm);

  const cleaver = new THREE.Mesh(
    new THREE.BoxGeometry(0.14 * scale, 1.18 * scale, 0.44 * scale),
    trimMat
  );
  cleaver.position.y = 0.45 * scale;
  cleaver.rotation.x = Math.PI / 4;
  weaponArm.add(cleaver);

  if (isBoss || groupType === 'Titan') {
    const bossCrown = new THREE.Mesh(
      new THREE.TorusGeometry(0.68 * scale, 0.07 * scale, 8, 24),
      trimMat
    );
    bossCrown.rotation.x = Math.PI / 2;
    bossCrown.position.y = 2.15 * scale;
    bodyPivot.add(bossCrown);

    for (const side of [-1, 1]) {
      const wing = new THREE.Mesh(
        new THREE.BoxGeometry(0.75 * scale, 1.1 * scale, 0.1 * scale),
        obsidianMat
      );
      wing.position.set(side * 0.68 * scale, 1.35 * scale, -0.38 * scale);
      wing.rotation.z = side * -0.35;
      bodyPivot.add(wing);
    }
  }

  return sculptAndSmoothAssetGroup(root);
}

// ============================================================================
// BATCH 4: 3D CITADEL ARMORY RELICS & VOLUMETRIC SKILL VFX SHOWCASES
// ============================================================================

export function createKingRelic3DShowcase(itemId?: string): THREE.Group {
  const root = new THREE.Group();
  root.name = `RelicShowcase_${itemId ?? 'default'}`;

  const item = itemId ? KING_ITEM_MAP[itemId] : null;
  const category = item?.category ?? 'Weapon';

  const goldMat = getPBRMaterial('#F59E0B', 0.16, 0.94);
  const bladeMat = getPBRMaterial('#38BDF8', 0.1, 0.95, '#0284C7', 0.48);
  const rubyMat = getPBRMaterial('#E11D48', 0.12, 0.85, '#F43F5E', 0.55);
  const emeraldMat = getPBRMaterial('#10B981', 0.14, 0.88, '#34D399', 0.52);
  const amethystMat = getPBRMaterial('#A855F7', 0.12, 0.9, '#9333EA', 0.58);
  const darkGripMat = getPBRMaterial('#1E293B', 0.7, 0.3);

  addContactShadow(root, 2.2);

  // 1. Octagonal Relic Pedestal
  const plinth = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.65, 0.35, 8), darkGripMat);
  plinth.position.y = 0.18;
  root.add(plinth);

  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.48, 0.06, 8, 24), goldMat);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.36;
  root.add(ring);

  const relicGroup = new THREE.Group();
  relicGroup.position.y = 1.95;
  relicGroup.name = 'bodyPivot';
  root.add(relicGroup);

  if (itemId === 'item_celestial_boots') {
    // Twin Winged Celestial Greaves (9 parts)
    for (const side of [-1, 1]) {
      const bootShaft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.28, 0.24, 1.25, 8),
        goldMat
      );
      bootShaft.position.set(side * 0.52, -0.1, 0);
      relicGroup.add(bootShaft);

      const footPlate = new THREE.Mesh(
        new THREE.BoxGeometry(0.46, 0.28, 0.82),
        goldMat
      );
      footPlate.position.set(side * 0.52, -0.62, 0.22);
      relicGroup.add(footPlate);

      const wing = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.92, 4), bladeMat);
      wing.position.set(side * 0.86, 0.22, -0.1);
      wing.rotation.z = side * -0.45;
      relicGroup.add(wing);
    }
    const windRing = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.055, 8, 28), bladeMat);
    windRing.rotation.x = Math.PI / 2;
    windRing.name = 'weaponArm';
    relicGroup.add(windRing);
    return sculptAndSmoothAssetGroup(root);
  }

  if (itemId === 'item_crown_of_haste') {
    // Crown of Astral Haste (9 parts)
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.14, 10, 28), goldMat);
    band.rotation.x = Math.PI / 2;
    relicGroup.add(band);

    for (let i = 0; i < 6; i++) {
      const a = (Math.PI * 2 * i) / 6;
      const spire = new THREE.Mesh(
        new THREE.ConeGeometry(0.16, i % 2 === 0 ? 0.82 : 0.58, 4),
        i % 2 === 0 ? goldMat : bladeMat
      );
      spire.position.set(Math.cos(a) * 0.85, 0.38, Math.sin(a) * 0.85);
      relicGroup.add(spire);
    }

    const starGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.42, 0), amethystMat);
    starGem.position.y = 0.45;
    starGem.name = 'weaponArm';
    relicGroup.add(starGem);
    return sculptAndSmoothAssetGroup(root);
  }

  if (itemId === 'item_phoenix_ankh') {
    // Phoenix Rebirth Ankh (9 parts)
    const verticalPillar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.18, 2.1, 8),
      goldMat
    );
    verticalPillar.position.y = -0.35;
    relicGroup.add(verticalPillar);

    const crossWing = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.26, 0.24), goldMat);
    crossWing.position.y = 0.15;
    relicGroup.add(crossWing);

    const topLoop = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.12, 10, 24), goldMat);
    topLoop.position.y = 0.85;
    relicGroup.add(topLoop);

    const phoenixHeart = new THREE.Mesh(new THREE.OctahedronGeometry(0.32, 0), rubyMat);
    phoenixHeart.position.y = 0.85;
    phoenixHeart.name = 'weaponArm';
    relicGroup.add(phoenixHeart);

    for (const side of [-1, 1]) {
      const pinion = new THREE.Mesh(new THREE.ConeGeometry(0.24, 1.05, 4), rubyMat);
      pinion.position.set(side * 1.05, 0.45, 0);
      pinion.rotation.z = side * -0.5;
      relicGroup.add(pinion);
    }
    return sculptAndSmoothAssetGroup(root);
  }

  if (itemId === 'item_soulreaver_scepter') {
    // Soulreaver Arcane Scepter (9 parts)
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 2.55, 8), darkGripMat);
    shaft.position.y = -0.15;
    relicGroup.add(shaft);

    const headCradle = new THREE.Mesh(new THREE.TorusGeometry(0.54, 0.08, 8, 20), goldMat);
    headCradle.position.y = 1.05;
    relicGroup.add(headCradle);

    const soulOrb = new THREE.Mesh(new THREE.OctahedronGeometry(0.42, 0), amethystMat);
    soulOrb.position.y = 1.05;
    soulOrb.name = 'weaponArm';
    relicGroup.add(soulOrb);

    for (const side of [-1, 1]) {
      const prong = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.78, 4), bladeMat);
      prong.position.set(side * 0.56, 1.28, 0);
      prong.rotation.z = side * -0.32;
      relicGroup.add(prong);
    }
    return sculptAndSmoothAssetGroup(root);
  }

  if (category === 'Armor') {
    // Dragonscale Cuirass 3D Armor Showcase (8 parts)
    const breastplate = new THREE.Mesh(
      new THREE.CylinderGeometry(0.85, 0.65, 1.45, 8),
      goldMat
    );
    relicGroup.add(breastplate);

    const coreGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.32, 0), rubyMat);
    coreGem.position.set(0, 0.15, 0.72);
    relicGroup.add(coreGem);

    for (const side of [-1, 1]) {
      const pauldron = new THREE.Mesh(new THREE.DodecahedronGeometry(0.46, 0), goldMat);
      pauldron.position.set(side * 1.02, 0.55, 0);
      relicGroup.add(pauldron);

      const wing = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.85, 4), bladeMat);
      wing.position.set(side * 1.25, 0.95, -0.15);
      wing.rotation.z = side * -0.45;
      relicGroup.add(wing);
    }

    const halo = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.055, 8, 28), bladeMat);
    halo.name = 'weaponArm';
    relicGroup.add(halo);
    return sculptAndSmoothAssetGroup(root);
  }

  if (category === 'Citadel') {
    // Sanctuary Aura Conduit / Bastion War Banner (8 parts)
    const staff = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 2.6, 8), goldMat);
    relicGroup.add(staff);

    const crossbar = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.16, 0.16), goldMat);
    crossbar.position.y = 0.85;
    relicGroup.add(crossbar);

    const bannerCloth = new THREE.Mesh(new THREE.BoxGeometry(1.25, 1.45, 0.08), emeraldMat);
    bannerCloth.position.set(0, 0.05, 0);
    relicGroup.add(bannerCloth);

    const crest = new THREE.Mesh(new THREE.OctahedronGeometry(0.38, 0), goldMat);
    crest.position.set(0, 1.38, 0);
    relicGroup.add(crest);

    const auraOrbit = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.06, 8, 28), emeraldMat);
    auraOrbit.rotation.x = Math.PI / 3;
    auraOrbit.name = 'weaponArm';
    relicGroup.add(auraOrbit);
    return sculptAndSmoothAssetGroup(root);
  }

  // Weapon Default: Sunfire Greatsword (8 parts)
  relicGroup.rotation.z = 0.22;

  const pommel = new THREE.Mesh(new THREE.OctahedronGeometry(0.26, 0), rubyMat);
  pommel.position.y = -1.35;
  relicGroup.add(pommel);

  const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.85, 12), darkGripMat);
  grip.position.y = -0.82;
  relicGroup.add(grip);

  const guardCenter = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.24, 0.32), goldMat);
  guardCenter.position.y = -0.35;
  relicGroup.add(guardCenter);

  const fullerGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.2, 0), rubyMat);
  fullerGem.position.set(0, -0.35, 0.18);
  relicGroup.add(fullerGem);

  const blade = new THREE.Mesh(new THREE.ConeGeometry(0.34, 2.65, 4), bladeMat);
  blade.position.y = 1.05;
  blade.scale.set(1.0, 1.0, 0.28);
  relicGroup.add(blade);

  const ankhRing = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.06, 10, 32), goldMat);
  ankhRing.name = 'weaponArm';
  relicGroup.add(ankhRing);

  return sculptAndSmoothAssetGroup(root);
}

export function createSkillVfx3DShowcase(vfxId?: string): THREE.Group {
  const root = new THREE.Group();
  root.name = `SkillVfx_${vfxId ?? 'cataclysm'}`;

  const isRebirth = vfxId === 'vfx_rebirth';
  const primaryMat = getPBRMaterial(
    isRebirth ? '#F97316' : '#EF4444',
    0.12,
    0.9,
    isRebirth ? '#FB923C' : '#DC2626',
    0.65
  );
  const secondaryMat = getPBRMaterial(
    isRebirth ? '#38BDF8' : '#FACC15',
    0.1,
    0.95,
    isRebirth ? '#38BDF8' : '#F59E0B',
    0.55
  );
  const basaltMat = getPBRMaterial('#1E293B', 0.65, 0.35);

  addContactShadow(root, 2.6);

  const bodyPivot = new THREE.Group();
  bodyPivot.name = 'bodyPivot';
  root.add(bodyPivot);

  // 1..3. Triple Expanding Shockwave Torus Rings
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.1 + i * 0.55, 0.06, 8, 32),
      i % 2 === 0 ? primaryMat : secondaryMat
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.25 + i * 0.35;
    bodyPivot.add(ring);
  }

  // 4. Central Meteor / Rebirth Phoenix Core
  const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.78, 0), primaryMat);
  core.position.y = 1.75;
  core.name = 'weaponArm';
  bodyPivot.add(core);

  // 5..9. Five Surrounding Basalt / Crystal Eruption Spires
  for (let i = 0; i < 5; i++) {
    const angle = (Math.PI * 2 * i) / 5;
    const spire = new THREE.Mesh(new THREE.ConeGeometry(0.28, 1.35, 5), basaltMat);
    spire.position.set(Math.cos(angle) * 1.65, 0.65, Math.sin(angle) * 1.65);
    spire.rotation.z = -Math.cos(angle) * 0.35;
    spire.rotation.x = Math.sin(angle) * 0.35;
    bodyPivot.add(spire);
  }

  return sculptAndSmoothAssetGroup(root);
}

export function createRelicSword3DShowcase(): THREE.Group {
  return createKingRelic3DShowcase('item_sunfire_blade');
}

// ============================================================================
// BATCH 5: 21 WAVE ENEMY CREEP 3D MODELS (SWARM, FLYING, ARMOR, ARCANE, BOSS)
// ============================================================================

export function createWaveEnemy3DModel(waveNumber: number): THREE.Group {
  const waveCfg = WAVES[(waveNumber - 1) % WAVES.length] ?? WAVES[0];
  const category = waveCfg.category;
  const isBossWave = category === 'Boss';

  const root = new THREE.Group();
  root.name = `WaveEnemy_${waveNumber}`;

  const scale = isBossWave ? 1.55 : category === 'Swarm' ? 0.86 : 1.02;
  addContactShadow(root, 0.95 * scale);

  // Palette derived from Attack & Defense Type
  const primaryHex =
    waveCfg.defenseType === 'Heavy'
      ? '#475569'
      : waveCfg.defenseType === 'Arcane'
      ? '#7C3AED'
      : waveCfg.defenseType === 'Massive'
      ? '#DC2626'
      : waveCfg.defenseType === 'Light'
      ? '#EA580C'
      : '#E11D48';
  const accentHex =
    waveCfg.attackType === 'Magic'
      ? '#38BDF8'
      : waveCfg.attackType === 'Pure'
      ? '#FEF08A'
      : waveCfg.attackType === 'Siege'
      ? '#F97316'
      : '#FB7185';

  const carapaceMat = getPBRMaterial(primaryHex, 0.34, 0.72);
  const accentMat = getPBRMaterial(accentHex, 0.16, 0.9, accentHex, 0.42);
  const darkChitinMat = getPBRMaterial('#111827', 0.62, 0.45);

  const bodyPivot = new THREE.Group();
  bodyPivot.name = 'bodyPivot';
  root.add(bodyPivot);

  if (category === 'Swarm') {
    // 9-Part Arachnid / Chitin Scuttler (4 legs, abdomen, thorax, head, mandibles, tail stinger)
    const thorax = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.48 * scale, 0),
      carapaceMat
    );
    thorax.position.y = 0.62 * scale;
    thorax.castShadow = true;
    bodyPivot.add(thorax);

    const abdomen = new THREE.Mesh(
      new THREE.SphereGeometry(0.54 * scale, 10, 8),
      darkChitinMat
    );
    abdomen.position.set(0, 0.72 * scale, -0.55 * scale);
    bodyPivot.add(abdomen);

    const stinger = new THREE.Mesh(
      new THREE.ConeGeometry(0.18 * scale, 0.75 * scale, 5),
      accentMat
    );
    stinger.position.set(0, 1.15 * scale, -0.82 * scale);
    stinger.rotation.x = 0.45;
    stinger.name = 'weaponArm';
    bodyPivot.add(stinger);

    for (const side of [-1, 1]) {
      for (const zOff of [-0.25, 0.25]) {
        const leg = new THREE.Mesh(
          new THREE.CylinderGeometry(0.08 * scale, 0.05 * scale, 0.75 * scale, 6),
          darkChitinMat
        );
        leg.position.set(side * 0.52 * scale, 0.35 * scale, zOff * scale);
        leg.rotation.z = side * 0.45;
        bodyPivot.add(leg);
      }
      const pincer = new THREE.Mesh(
        new THREE.ConeGeometry(0.12 * scale, 0.48 * scale, 4),
        accentMat
      );
      pincer.position.set(side * 0.24 * scale, 0.58 * scale, 0.58 * scale);
      pincer.rotation.x = Math.PI / 2;
      bodyPivot.add(pincer);
    }
    return sculptAndSmoothAssetGroup(root);
  }

  if (category === 'Flying') {
    // 9-Part Hovering Sky-Drake / Wyvern
    bodyPivot.position.y = 0.65 * scale;

    const drakeBody = new THREE.Mesh(
      new THREE.ConeGeometry(0.46 * scale, 1.45 * scale, 6),
      carapaceMat
    );
    drakeBody.rotation.x = Math.PI / 2;
    drakeBody.position.y = 0.85 * scale;
    drakeBody.castShadow = true;
    bodyPivot.add(drakeBody);

    const head = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.32 * scale, 0),
      darkChitinMat
    );
    head.position.set(0, 0.98 * scale, 0.72 * scale);
    bodyPivot.add(head);

    const breathCore = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.18 * scale, 0),
      accentMat
    );
    breathCore.position.set(0, 0.95 * scale, 0.98 * scale);
    breathCore.name = 'weaponArm';
    bodyPivot.add(breathCore);

    for (const side of [-1, 1]) {
      const outerWing = new THREE.Mesh(
        new THREE.BoxGeometry(1.15 * scale, 0.08 * scale, 0.68 * scale),
        accentMat
      );
      outerWing.position.set(side * 0.75 * scale, 1.02 * scale, 0);
      outerWing.rotation.z = side * 0.28;
      outerWing.castShadow = true;
      bodyPivot.add(outerWing);

      const horn = new THREE.Mesh(
        new THREE.ConeGeometry(0.1 * scale, 0.45 * scale, 4),
        accentMat
      );
      horn.position.set(side * 0.2 * scale, 1.25 * scale, 0.65 * scale);
      horn.rotation.x = -0.35;
      bodyPivot.add(horn);
    }

    const tailFin = new THREE.Mesh(
      new THREE.ConeGeometry(0.24 * scale, 0.65 * scale, 4),
      accentMat
    );
    tailFin.position.set(0, 0.85 * scale, -0.88 * scale);
    tailFin.rotation.x = -Math.PI / 2;
    bodyPivot.add(tailFin);

    const groundShadowRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.55 * scale, 0.04 * scale, 6, 20),
      accentMat
    );
    groundShadowRing.rotation.x = Math.PI / 2;
    groundShadowRing.position.y = -0.58 * scale;
    bodyPivot.add(groundShadowRing);

    return sculptAndSmoothAssetGroup(root);
  }

  // Armored / Magic Resistant / Boss / Normal Vanguard Wave Raider (9-11 parts)
  return createEnemyOrMerc3DModel({
    isBoss: isBossWave,
    color: primaryHex,
  });
}

// ============================================================================
// BATCH 6: 12 LEGION SPELLS 3D TOTEMS, ALTARS & ORBITAL STRIKE MONUMENTS
// ============================================================================

export function createLegionSpell3DModel(spellId?: string): THREE.Group {
  const root = new THREE.Group();
  const spell = LEGION_SPELLS.find((s) => s.id === spellId) ?? LEGION_SPELLS[0];
  const accentHex = spell?.accentColor ?? '#F59E0B';
  const cat = spell?.category ?? 'Offense';

  const stoneMat = getPBRMaterial('#0F172A', 0.68, 0.35);
  const goldMat = getPBRMaterial('#F59E0B', 0.2, 0.9);
  const spellMat = getPBRMaterial(accentHex, 0.12, 0.92, accentHex, 0.62);

  addContactShadow(root, 2.3);

  // 1. Stepped Runic Altar Plinth
  const plinth = new THREE.Mesh(new THREE.CylinderGeometry(1.55, 1.85, 0.42, 8), stoneMat);
  plinth.position.y = 0.21;
  root.add(plinth);

  // 2. Glowing Spell Circle Ring
  const baseRing = new THREE.Mesh(new THREE.TorusGeometry(1.62, 0.07, 8, 28), spellMat);
  baseRing.rotation.x = Math.PI / 2;
  baseRing.position.y = 0.44;
  root.add(baseRing);

  const bodyPivot = new THREE.Group();
  bodyPivot.name = 'bodyPivot';
  bodyPivot.position.y = 1.65;
  root.add(bodyPivot);

  // 3..6. Four Corner Arcane Pylons
  for (let i = 0; i < 4; i++) {
    const angle = (Math.PI / 2) * i + Math.PI / 4;
    const pylon = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 1.45, 6), stoneMat);
    pylon.position.set(Math.cos(angle) * 1.15, -0.55, Math.sin(angle) * 1.15);
    bodyPivot.add(pylon);
  }

  // 7. Central Category-Specific 3D Spell Iconography
  const coreMesh =
    cat === 'Economy'
      ? new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 0.24, 12), goldMat)
      : cat === 'Defense'
      ? new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.52, 1.35, 6), spellMat)
      : new THREE.Mesh(new THREE.OctahedronGeometry(0.75, 0), spellMat);
  coreMesh.name = 'weaponArm';
  bodyPivot.add(coreMesh);

  // 8 & 9. Counter-Rotating Astrolabe Rings
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.18, 0.06, 8, 28), goldMat);
  ring1.rotation.x = Math.PI / 3;
  bodyPivot.add(ring1);

  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.96, 0.05, 8, 24), spellMat);
  ring2.rotation.y = Math.PI / 3;
  bodyPivot.add(ring2);

  return sculptAndSmoothAssetGroup(root);
}

// ============================================================================
// BATCH 7: 3D BATTLEFIELD ARCHITECTURE, BRAZIERS, GARRISON TOTEM & PROPS
// ============================================================================

export function createBattlefieldProp3DModel(propId?: string): THREE.Group {
  const root = new THREE.Group();
  root.name = `Prop_${propId ?? 'brazier'}`;

  const basaltMat = getPBRMaterial('#1E293B', 0.68, 0.35);
  const bronzeMat = getPBRMaterial('#D97706', 0.25, 0.88);
  const flameMat = getPBRMaterial('#F97316', 0.1, 0.9, '#EA580C', 0.72);
  const cyanMat = getPBRMaterial('#38BDF8', 0.12, 0.92, '#0284C7', 0.62);
  const emeraldMat = getPBRMaterial('#10B981', 0.15, 0.88, '#10B981', 0.55);

  addContactShadow(root, 1.5);

  const bodyPivot = new THREE.Group();
  bodyPivot.name = 'bodyPivot';
  root.add(bodyPivot);

  if (propId === 'prop_garrison_totem') {
    // 9-Part Hold-the-Base Garrison War Totem
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.15, 0.32, 6), basaltMat);
    base.position.y = 0.16;
    bodyPivot.add(base);

    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 2.85, 8), bronzeMat);
    mast.position.y = 1.45;
    bodyPivot.add(mast);

    const crossbar = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.18, 0.18), bronzeMat);
    crossbar.position.y = 2.35;
    bodyPivot.add(crossbar);

    const banner = new THREE.Mesh(new THREE.BoxGeometry(1.25, 1.45, 0.08), flameMat);
    banner.position.y = 1.55;
    bodyPivot.add(banner);

    const shieldEmblem = new THREE.Mesh(new THREE.OctahedronGeometry(0.36, 0), cyanMat);
    shieldEmblem.position.set(0, 1.65, 0.12);
    bodyPivot.add(shieldEmblem);

    const topCrest = new THREE.Mesh(new THREE.OctahedronGeometry(0.38, 0), bronzeMat);
    topCrest.position.y = 3.05;
    topCrest.name = 'weaponArm';
    bodyPivot.add(topCrest);

    for (const side of [-1, 1]) {
      const horn = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.65, 5), bronzeMat);
      horn.position.set(side * 0.88, 2.62, 0);
      horn.rotation.z = side * -0.35;
      bodyPivot.add(horn);
    }

    const auraRing = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.06, 8, 28), emeraldMat);
    auraRing.rotation.x = Math.PI / 2;
    auraRing.position.y = 0.25;
    bodyPivot.add(auraRing);
    return sculptAndSmoothAssetGroup(root);
  }

  if (propId === 'prop_bounty_chest') {
    // 8-Part Golden Bounty War-Chest
    const plinth = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.5, 0.28, 8), basaltMat);
    plinth.position.y = 0.14;
    bodyPivot.add(plinth);

    const box = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.82, 0.95), basaltMat);
    box.position.y = 0.68;
    bodyPivot.add(box);

    const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 1.45, 8), bronzeMat);
    lid.rotation.z = Math.PI / 2;
    lid.position.set(0, 1.15, -0.12);
    lid.name = 'weaponArm';
    bodyPivot.add(lid);

    const lock = new THREE.Mesh(new THREE.OctahedronGeometry(0.24, 0), cyanMat);
    lock.position.set(0, 0.88, 0.52);
    bodyPivot.add(lock);

    for (let i = 0; i < 4; i++) {
      const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.22, 0), flameMat);
      gem.position.set((i - 1.5) * 0.28, 1.12, 0.15);
      bodyPivot.add(gem);
    }
    return sculptAndSmoothAssetGroup(root);
  }

  // Default: Bastion Flame Brazier / Runic Obelisk / Projectile Cluster (8 parts)
  const plinth = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.92, 0.35, 6), basaltMat);
  plinth.position.y = 0.18;
  bodyPivot.add(plinth);

  const column = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.48, 1.45, 6), basaltMat);
  column.position.y = 1.05;
  column.castShadow = true;
  bodyPivot.add(column);

  const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.38, 0.45, 8), bronzeMat);
  bowl.position.y = 1.88;
  bodyPivot.add(bowl);

  const mainFlame = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.46, 0),
    propId === 'prop_runic_obelisk' || propId === 'prop_proj_arcane' ? cyanMat : flameMat
  );
  mainFlame.position.y = 2.42;
  mainFlame.scale.set(0.85, 1.45, 0.85);
  mainFlame.name = 'weaponArm';
  bodyPivot.add(mainFlame);

  for (let i = 0; i < 4; i++) {
    const a = (Math.PI / 2) * i;
    const spark = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.48, 4), flameMat);
    spark.position.set(Math.cos(a) * 0.48, 2.25, Math.sin(a) * 0.48);
    bodyPivot.add(spark);
  }

  return sculptAndSmoothAssetGroup(root);
}

// ============================================================================
// BATCH 8: 8 FACTION ELEMENTAL SANCTUMS 3D (10-PART FACTION MONUMENTS)
// ============================================================================

export function createFactionSanctum3DModel(factionId?: string): THREE.Group {
  const fId = (factionId as FactionId) ?? 'Inferno';
  const fCfg = FACTIONS[fId] ?? FACTIONS.Inferno;

  const root = new THREE.Group();
  root.name = `FactionSanctum_${fId}`;

  const primaryMat = getPBRMaterial(fCfg.primaryColor, 0.25, 0.82);
  const accentMat = getPBRMaterial(
    fCfg.secondaryColor,
    0.14,
    0.92,
    fCfg.secondaryColor,
    0.58
  );
  const stoneMat = getPBRMaterial('#0F172A', 0.68, 0.35);

  addContactShadow(root, 2.4);

  // 1. Octagonal Faction Foundation Dais
  const dais = new THREE.Mesh(new THREE.CylinderGeometry(1.65, 1.95, 0.42, 8), stoneMat);
  dais.position.y = 0.21;
  root.add(dais);

  // 2. Glowing Elemental Sanctum Ring
  const groundRing = new THREE.Mesh(new THREE.TorusGeometry(1.75, 0.065, 8, 28), accentMat);
  groundRing.rotation.x = Math.PI / 2;
  groundRing.position.y = 0.44;
  root.add(groundRing);

  const bodyPivot = new THREE.Group();
  bodyPivot.name = 'bodyPivot';
  root.add(bodyPivot);

  // 3..6. Four Faction-Themed Perimeter Pillars / Horns / Wings / Tentacles
  for (let i = 0; i < 4; i++) {
    const angle = (Math.PI / 2) * i + Math.PI / 4;
    const px = Math.cos(angle) * 1.22;
    const pz = Math.sin(angle) * 1.22;

    if (fId === 'Inferno' || fId === 'Wild' || fId === 'Abyss') {
      const horn = new THREE.Mesh(new THREE.ConeGeometry(0.28, 1.85, 5), primaryMat);
      horn.position.set(px, 1.2, pz);
      horn.rotation.z = -Math.cos(angle) * 0.28;
      horn.rotation.x = Math.sin(angle) * 0.28;
      bodyPivot.add(horn);
    } else if (fId === 'Divine') {
      const wingButtress = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 1.95, 0.65),
        primaryMat
      );
      wingButtress.position.set(px, 1.25, pz);
      wingButtress.rotation.y = -angle;
      bodyPivot.add(wingButtress);
    } else {
      const pillar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.25, 1.75, 6),
        primaryMat
      );
      pillar.position.set(px, 1.15, pz);
      bodyPivot.add(pillar);
    }
  }

  // 7. Central Sanctum Spire / World-Tree Trunk / Dynamo Core
  const centerSpire =
    fId === 'Nature'
      ? new THREE.Mesh(new THREE.DodecahedronGeometry(0.88, 0), primaryMat)
      : fId === 'Mechanic'
      ? new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.72, 1.45, 8), primaryMat)
      : new THREE.Mesh(new THREE.OctahedronGeometry(0.78, 0), accentMat);
  centerSpire.position.y = 1.72;
  centerSpire.name = 'weaponArm';
  bodyPivot.add(centerSpire);

  // 8 & 9. Twin Counter-Rotating Elemental Halo Rings
  const halo1 = new THREE.Mesh(new THREE.TorusGeometry(1.18, 0.055, 8, 28), accentMat);
  halo1.position.y = 1.72;
  halo1.rotation.x = Math.PI / 3;
  bodyPivot.add(halo1);

  const halo2 = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.05, 8, 24), primaryMat);
  halo2.position.y = 1.72;
  halo2.rotation.y = Math.PI / 3;
  bodyPivot.add(halo2);

  // 10. Apex Faction Crown Prism
  const apexGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.34, 0), accentMat);
  apexGem.position.y = 2.88;
  bodyPivot.add(apexGem);

  return sculptAndSmoothAssetGroup(root);
}

// ============================================================================
// BATCH 9: 8 HERO KING ACTIVE SKILLS, MYTHIUM UPGRADES & 2v2 WARP GATE 3D
// ============================================================================

export function createKingSkillOrUpgrade3DModel(refId?: string): THREE.Group {
  const root = new THREE.Group();
  root.name = `KingSkillOrUpgrade_${refId ?? 'skill_q_royal_cleave'}`;

  const goldMat = getPBRMaterial('#F59E0B', 0.16, 0.92, '#F59E0B', 0.35);
  const cyanMat = getPBRMaterial('#38BDF8', 0.12, 0.94, '#0284C7', 0.58);
  const emeraldMat = getPBRMaterial('#10B981', 0.14, 0.88, '#10B981', 0.55);
  const crimsonMat = getPBRMaterial('#EF4444', 0.14, 0.88, '#DC2626', 0.58);
  const mythiumMat = getPBRMaterial('#A855F7', 0.12, 0.92, '#9333EA', 0.62);
  const basaltMat = getPBRMaterial('#1E293B', 0.65, 0.38);

  addContactShadow(root, 2.2);

  const bodyPivot = new THREE.Group();
  bodyPivot.name = 'bodyPivot';
  root.add(bodyPivot);

  if (refId === 'skill_q_royal_cleave') {
    // 9-Part Sweeping Aurum Crescent Blade Wave [Q]
    bodyPivot.position.y = 1.25;
    const crescentOuter = new THREE.Mesh(
      new THREE.TorusGeometry(1.45, 0.14, 10, 28, Math.PI * 1.25),
      goldMat
    );
    crescentOuter.rotation.x = Math.PI / 2;
    crescentOuter.name = 'weaponArm';
    bodyPivot.add(crescentOuter);

    const crescentInner = new THREE.Mesh(
      new THREE.TorusGeometry(1.08, 0.08, 8, 24, Math.PI * 1.1),
      cyanMat
    );
    crescentInner.rotation.x = Math.PI / 2;
    bodyPivot.add(crescentInner);

    for (let i = 0; i < 6; i++) {
      const a = (Math.PI * i) / 5;
      const shard = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.68, 4), cyanMat);
      shard.position.set(Math.cos(a) * 1.45, 0, Math.sin(a) * 1.45);
      shard.rotation.z = -Math.PI / 4;
      bodyPivot.add(shard);
    }

    const coreSword = new THREE.Mesh(new THREE.OctahedronGeometry(0.42, 0), goldMat);
    bodyPivot.add(coreSword);
    return sculptAndSmoothAssetGroup(root);
  }

  if (refId === 'skill_e_sovereign_aegis') {
    // 10-Part 6-Shield Hexagonal Bastion Ring [E]
    bodyPivot.position.y = 1.35;
    const ringGroup = new THREE.Group();
    ringGroup.name = 'weaponArm';
    bodyPivot.add(ringGroup);

    for (let i = 0; i < 6; i++) {
      const a = (Math.PI * 2 * i) / 6;
      const shield = new THREE.Mesh(
        new THREE.CylinderGeometry(0.46, 0.36, 0.95, 6),
        i % 2 === 0 ? goldMat : cyanMat
      );
      shield.scale.set(0.85, 1.0, 0.2);
      shield.position.set(Math.cos(a) * 1.48, 0, Math.sin(a) * 1.48);
      shield.rotation.y = -a + Math.PI / 2;
      ringGroup.add(shield);
    }

    const barrierTorus = new THREE.Mesh(new THREE.TorusGeometry(1.48, 0.065, 8, 32), cyanMat);
    barrierTorus.rotation.x = Math.PI / 2;
    bodyPivot.add(barrierTorus);

    const healCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.54, 0), emeraldMat);
    bodyPivot.add(healCore);
    return sculptAndSmoothAssetGroup(root);
  }

  if (refId === 'skill_r_cataclysm_judgment') {
    // 10-Part Descending Orbital Solar Lance & Shockwaves [R]
    const lance = new THREE.Mesh(new THREE.ConeGeometry(0.42, 2.85, 6), goldMat);
    lance.rotation.x = Math.PI;
    lance.position.y = 1.95;
    lance.name = 'weaponArm';
    bodyPivot.add(lance);

    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.0 + i * 0.48, 0.06, 8, 28),
        i % 2 === 0 ? goldMat : crimsonMat
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.25 + i * 0.35;
      bodyPivot.add(ring);
    }

    for (let i = 0; i < 4; i++) {
      const a = (Math.PI / 2) * i + Math.PI / 4;
      const spire = new THREE.Mesh(new THREE.ConeGeometry(0.24, 1.15, 5), crimsonMat);
      spire.position.set(Math.cos(a) * 1.55, 0.58, Math.sin(a) * 1.55);
      bodyPivot.add(spire);
    }
    return sculptAndSmoothAssetGroup(root);
  }

  if (refId === 'vfx_ally_reinforce_gate') {
    // 9-Part 2v2 Ally Reinforcement Warp Gate
    const slab = new THREE.Mesh(new THREE.CylinderGeometry(1.55, 1.75, 0.32, 8), basaltMat);
    slab.position.y = 0.16;
    bodyPivot.add(slab);

    for (const side of [-1, 1]) {
      const pylon = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.34, 2.65, 6), basaltMat);
      pylon.position.set(side * 1.25, 1.45, 0);
      bodyPivot.add(pylon);

      const finial = new THREE.Mesh(new THREE.OctahedronGeometry(0.32, 0), cyanMat);
      finial.position.set(side * 1.25, 2.95, 0);
      bodyPivot.add(finial);
    }

    const arch = new THREE.Mesh(new THREE.BoxGeometry(2.95, 0.32, 0.48), goldMat);
    arch.position.y = 2.65;
    bodyPivot.add(arch);

    const warpRing = new THREE.Mesh(new THREE.TorusGeometry(0.92, 0.08, 10, 28), cyanMat);
    warpRing.position.y = 1.48;
    warpRing.name = 'weaponArm';
    bodyPivot.add(warpRing);

    const warpStar = new THREE.Mesh(new THREE.OctahedronGeometry(0.38, 0), emeraldMat);
    warpStar.position.y = 1.48;
    bodyPivot.add(warpStar);
    return sculptAndSmoothAssetGroup(root);
  }

  // Mythium Upgrade Forges (Attack / Defense / Regen / Spell — 9 parts)
  const plinth = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 1.7, 0.38, 8), basaltMat);
  plinth.position.y = 0.19;
  bodyPivot.add(plinth);

  const ringMat =
    refId === 'upg_king_attack'
      ? crimsonMat
      : refId === 'upg_king_defense'
      ? goldMat
      : refId === 'upg_king_regen'
      ? emeraldMat
      : mythiumMat;

  const baseRing = new THREE.Mesh(new THREE.TorusGeometry(1.52, 0.06, 8, 28), ringMat);
  baseRing.rotation.x = Math.PI / 2;
  baseRing.position.y = 0.4;
  bodyPivot.add(baseRing);

  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.85, 1.15, 6), basaltMat);
  pedestal.position.y = 0.92;
  bodyPivot.add(pedestal);

  const iconCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.62, 0), ringMat);
  iconCore.position.y = 2.05;
  iconCore.name = 'weaponArm';
  bodyPivot.add(iconCore);

  const orbitRing = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.055, 8, 24), goldMat);
  orbitRing.position.y = 2.05;
  orbitRing.rotation.x = Math.PI / 3;
  bodyPivot.add(orbitRing);

  for (let i = 0; i < 4; i++) {
    const a = (Math.PI / 2) * i + Math.PI / 4;
    const crystal = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.72, 5), mythiumMat);
    crystal.position.set(Math.cos(a) * 1.18, 0.72, Math.sin(a) * 1.18);
    bodyPivot.add(crystal);
  }

  return sculptAndSmoothAssetGroup(root);
}

// ============================================================================
// BATCH 10: 10 TACTICAL ORDNANCE, MERCENARY DROP-POD & TROPHY MONUMENTS 3D
// ============================================================================

export function createTacticalOrdnance3DModel(refId?: string): THREE.Group {
  const root = new THREE.Group();
  root.name = `Ordnance_${refId ?? 'ord_pierce_harpoon'}`;

  const goldMat = getPBRMaterial('#F59E0B', 0.16, 0.92, '#F59E0B', 0.35);
  const cyanMat = getPBRMaterial('#38BDF8', 0.12, 0.94, '#0284C7', 0.58);
  const emeraldMat = getPBRMaterial('#10B981', 0.14, 0.88, '#10B981', 0.55);
  const crimsonMat = getPBRMaterial('#EF4444', 0.14, 0.88, '#DC2626', 0.58);
  const mythiumMat = getPBRMaterial('#A855F7', 0.12, 0.92, '#9333EA', 0.62);
  const basaltMat = getPBRMaterial('#1E293B', 0.65, 0.38);

  addContactShadow(root, 1.8);

  const bodyPivot = new THREE.Group();
  bodyPivot.name = 'bodyPivot';
  root.add(bodyPivot);

  if (refId === 'ord_merc_droppod') {
    // 9-Part Mythium Mercenary Rift Pod
    const podHull = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.92, 1.85, 8), basaltMat);
    podHull.position.y = 1.15;
    bodyPivot.add(podHull);

    const noseCone = new THREE.Mesh(new THREE.ConeGeometry(0.68, 0.75, 8), mythiumMat);
    noseCone.position.y = 2.45;
    noseCone.name = 'weaponArm';
    bodyPivot.add(noseCone);

    const coreRing = new THREE.Mesh(new THREE.TorusGeometry(0.88, 0.07, 8, 24), mythiumMat);
    coreRing.rotation.x = Math.PI / 2;
    coreRing.position.y = 1.25;
    bodyPivot.add(coreRing);

    for (let i = 0; i < 4; i++) {
      const a = (Math.PI / 2) * i + Math.PI / 4;
      const claw = new THREE.Mesh(new THREE.ConeGeometry(0.18, 1.15, 4), goldMat);
      claw.position.set(Math.cos(a) * 0.95, 0.65, Math.sin(a) * 0.95);
      claw.rotation.z = -Math.cos(a) * 0.35;
      claw.rotation.x = Math.sin(a) * 0.35;
      bodyPivot.add(claw);
    }
    return sculptAndSmoothAssetGroup(root);
  }

  if (refId === 'ord_victory_crown' || refId === 'ord_defeat_ruin') {
    const isVictory = refId === 'ord_victory_crown';
    const mainMat = isVictory ? goldMat : basaltMat;
    const subMat = isVictory ? cyanMat : crimsonMat;

    const plinth = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.8, 0.45, 8), basaltMat);
    plinth.position.y = 0.22;
    bodyPivot.add(plinth);

    const column = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.78, 1.35, 8), mainMat);
    column.position.y = 1.05;
    if (!isVictory) column.rotation.z = 0.25;
    bodyPivot.add(column);

    const crownTorus = new THREE.Mesh(new THREE.TorusGeometry(0.82, 0.12, 10, 28), mainMat);
    crownTorus.rotation.x = Math.PI / 2;
    crownTorus.position.y = isVictory ? 2.15 : 0.65;
    bodyPivot.add(crownTorus);

    const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.52, 0), subMat);
    star.position.y = isVictory ? 2.45 : 1.55;
    star.name = 'weaponArm';
    bodyPivot.add(star);

    for (let i = 0; i < 4; i++) {
      const a = (Math.PI / 2) * i + Math.PI / 4;
      const blade = new THREE.Mesh(new THREE.ConeGeometry(0.16, 1.25, 4), mainMat);
      blade.position.set(Math.cos(a) * 1.15, 1.15, Math.sin(a) * 1.15);
      blade.rotation.z = isVictory ? -Math.cos(a) * 0.25 : Math.cos(a) * 0.65;
      bodyPivot.add(blade);
    }
    return sculptAndSmoothAssetGroup(root);
  }

  // Combat Projectiles & Beacons (Pierce / Impact / Magic / Siege / Pure / Alarm / Heal)
  bodyPivot.position.y = 1.45;
  const projMat =
    refId === 'ord_pierce_harpoon'
      ? cyanMat
      : refId === 'ord_impact_meteor' || refId === 'ord_leak_breach_alarm'
      ? crimsonMat
      : refId === 'ord_magic_starbolt'
      ? mythiumMat
      : refId === 'ord_heal_sanctuary_bloom'
      ? emeraldMat
      : goldMat;

  const core =
    refId === 'ord_pierce_harpoon' || refId === 'ord_pure_solarlance'
      ? new THREE.Mesh(new THREE.ConeGeometry(0.32, 2.45, 6), projMat)
      : refId === 'ord_siege_hellshell'
      ? new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.46, 1.85, 8), projMat)
      : new THREE.Mesh(new THREE.OctahedronGeometry(0.68, 0), projMat);
  core.rotation.z = -Math.PI / 6;
  core.name = 'weaponArm';
  bodyPivot.add(core);

  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.12, 0.055, 8, 24), goldMat);
  ring1.rotation.x = Math.PI / 3;
  bodyPivot.add(ring1);

  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.88, 0.045, 8, 24), projMat);
  ring2.rotation.y = Math.PI / 3;
  bodyPivot.add(ring2);

  for (let i = 0; i < 4; i++) {
    const a = (Math.PI / 2) * i;
    const fin = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.58, 4), basaltMat);
    fin.position.set(Math.cos(a) * 0.78, -0.35, Math.sin(a) * 0.78);
    bodyPivot.add(fin);
  }

  return sculptAndSmoothAssetGroup(root);
}

// ============================================================================
// BATCH 11: 16 FIGHTER ACTIVE ABILITY 3D VFX & SUMMONED SENTRY WARDS
// ============================================================================

export function createFighterAbility3DModel(effectType?: string): THREE.Group {
  const root = new THREE.Group();
  root.name = `FighterAbility_${effectType ?? 'CleaveAoE'}`;

  const basaltMat = getPBRMaterial('#0F172A', 0.68, 0.35);
  const goldMat = getPBRMaterial('#F59E0B', 0.16, 0.92, '#F59E0B', 0.42);
  const cyanMat = getPBRMaterial('#38BDF8', 0.12, 0.94, '#0284C7', 0.62);
  const emeraldMat = getPBRMaterial('#10B981', 0.14, 0.88, '#10B981', 0.58);
  const crimsonMat = getPBRMaterial('#EF4444', 0.14, 0.88, '#DC2626', 0.62);
  const arcaneMat = getPBRMaterial('#A855F7', 0.12, 0.92, '#9333EA', 0.62);

  addContactShadow(root, 2.0);

  const bodyPivot = new THREE.Group();
  bodyPivot.name = 'bodyPivot';
  root.add(bodyPivot);

  if (effectType === 'SummonWard') {
    // 9-Part Clockwork Auto-Sentry Turret Ward
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.15, 0.28, 6), basaltMat);
    base.position.y = 0.14;
    bodyPivot.add(base);

    for (let i = 0; i < 3; i++) {
      const a = (Math.PI * 2 * i) / 3;
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.85, 0.28), basaltMat);
      leg.position.set(Math.cos(a) * 0.68, 0.45, Math.sin(a) * 0.68);
      leg.rotation.z = -Math.cos(a) * 0.35;
      leg.rotation.x = Math.sin(a) * 0.35;
      bodyPivot.add(leg);
    }

    const turretHead = new THREE.Group();
    turretHead.position.y = 1.15;
    turretHead.name = 'weaponArm';
    bodyPivot.add(turretHead);

    const hull = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.64, 0.65, 8), goldMat);
    turretHead.add(hull);

    const sensor = new THREE.Mesh(new THREE.OctahedronGeometry(0.28, 0), cyanMat);
    sensor.position.set(0, 0.42, 0.25);
    turretHead.add(sensor);

    for (const side of [-1, 1]) {
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 1.35, 8), cyanMat);
      barrel.rotation.x = Math.PI / 2;
      barrel.position.set(side * 0.34, 0.05, 0.68);
      turretHead.add(barrel);
    }
    return sculptAndSmoothAssetGroup(root);
  }

  // Determine palette & geometry by AbilityEffectType
  const mainMat =
    effectType === 'CleaveAoE' || effectType === 'BurnDoT' || effectType === 'ArmorSunder'
      ? crimsonMat
      : effectType === 'HealAlly' || effectType === 'ThornsReflect'
      ? emeraldMat
      : effectType === 'ChainLightning' || effectType === 'SlowTarget' || effectType === 'FreezeNova'
      ? cyanMat
      : effectType === 'ManaBurst' || effectType === 'LifestealAura' || effectType === 'TrueDamageBolt'
      ? arcaneMat
      : goldMat;

  const plinth = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.55, 0.26, 8), basaltMat);
  plinth.position.y = 0.13;
  bodyPivot.add(plinth);

  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.42, 0.06, 8, 28), mainMat);
  ring1.rotation.x = Math.PI / 2;
  ring1.position.y = 0.32;
  bodyPivot.add(ring1);

  const coreGroup = new THREE.Group();
  coreGroup.position.y = 1.48;
  coreGroup.name = 'weaponArm';
  bodyPivot.add(coreGroup);

  const centerGem =
    effectType === 'StunStrike'
      ? new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.68, 1.25), mainMat)
      : effectType === 'ShieldSelf'
      ? new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.62, 1.35, 6), mainMat)
      : new THREE.Mesh(new THREE.OctahedronGeometry(0.72, 0), mainMat);
  coreGroup.add(centerGem);

  const orbitRing = new THREE.Mesh(new THREE.TorusGeometry(1.12, 0.055, 8, 24), goldMat);
  orbitRing.rotation.x = Math.PI / 3;
  coreGroup.add(orbitRing);

  const count = effectType === 'FreezeNova' || effectType === 'ThornsReflect' ? 6 : 4;
  for (let i = 0; i < count; i++) {
    const a = (Math.PI * 2 * i) / count;
    const shard = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.92, 4), mainMat);
    shard.position.set(Math.cos(a) * 1.18, 0.72, Math.sin(a) * 1.18);
    shard.rotation.z = -Math.cos(a) * 0.38;
    shard.rotation.x = Math.sin(a) * 0.38;
    bodyPivot.add(shard);
  }

  return sculptAndSmoothAssetGroup(root);
}

// ============================================================================
// BATCH 12: 8 FACTION SYNERGY TOTEMS & 6 COMBAT STATUS 3D HALOS
// ============================================================================

export function createSynergyOrStatus3DModel(refId?: string): THREE.Group {
  const root = new THREE.Group();
  root.name = `SynergyOrStatus_${refId ?? 'syn_inferno'}`;

  const basaltMat = getPBRMaterial('#0F172A', 0.68, 0.35);
  const goldMat = getPBRMaterial('#F59E0B', 0.16, 0.92, '#F59E0B', 0.42);
  const cyanMat = getPBRMaterial('#38BDF8', 0.12, 0.94, '#0284C7', 0.62);
  const emeraldMat = getPBRMaterial('#10B981', 0.14, 0.88, '#10B981', 0.58);
  const crimsonMat = getPBRMaterial('#EF4444', 0.14, 0.88, '#DC2626', 0.62);
  const arcaneMat = getPBRMaterial('#A855F7', 0.12, 0.92, '#9333EA', 0.62);

  addContactShadow(root, 1.9);

  const bodyPivot = new THREE.Group();
  bodyPivot.name = 'bodyPivot';
  root.add(bodyPivot);

  if (refId?.startsWith('syn_')) {
    const facKey = refId.replace('syn_', '');
    const matchedFac =
      (Object.keys(FACTIONS) as FactionId[]).find(
        (k) => k.toLowerCase() === facKey
      ) ?? 'Inferno';
    const fCfg = FACTIONS[matchedFac];
    const primaryMat = getPBRMaterial(fCfg.primaryColor, 0.24, 0.84);
    const accentMat = getPBRMaterial(
      fCfg.secondaryColor,
      0.14,
      0.92,
      fCfg.secondaryColor,
      0.58
    );

    // 9-Part Faction Synergy War-Totem Banner
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.32, 0.32, 6), basaltMat);
    base.position.y = 0.16;
    bodyPivot.add(base);

    const auraRing = new THREE.Mesh(new THREE.TorusGeometry(1.38, 0.06, 8, 28), accentMat);
    auraRing.rotation.x = Math.PI / 2;
    auraRing.position.y = 0.34;
    bodyPivot.add(auraRing);

    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 2.8, 8), goldMat);
    mast.position.y = 1.45;
    bodyPivot.add(mast);

    const crossbar = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.18, 0.18), goldMat);
    crossbar.position.y = 2.38;
    bodyPivot.add(crossbar);

    const cloth = new THREE.Mesh(new THREE.BoxGeometry(1.25, 1.45, 0.08), primaryMat);
    cloth.position.y = 1.55;
    bodyPivot.add(cloth);

    const emblem = new THREE.Mesh(new THREE.OctahedronGeometry(0.38, 0), accentMat);
    emblem.position.set(0, 1.62, 0.12);
    bodyPivot.add(emblem);

    const apex = new THREE.Mesh(new THREE.OctahedronGeometry(0.42, 0), accentMat);
    apex.position.y = 3.05;
    apex.name = 'weaponArm';
    bodyPivot.add(apex);

    for (const side of [-1, 1]) {
      const horn = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.68, 5), primaryMat);
      horn.position.set(side * 0.9, 2.65, 0);
      horn.rotation.z = side * -0.35;
      bodyPivot.add(horn);
    }
    return sculptAndSmoothAssetGroup(root);
  }

  // 6 Combat Status Effect 3D Halos (8 parts)
  bodyPivot.position.y = 1.35;
  const statusMat =
    refId === 'status_burn' || refId === 'status_armor_break'
      ? crimsonMat
      : refId === 'status_slow' || refId === 'status_shield'
      ? cyanMat
      : refId === 'status_aspd_buff'
      ? emeraldMat
      : goldMat;

  const mainRing = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.075, 10, 28), statusMat);
  mainRing.rotation.x = Math.PI / 2;
  bodyPivot.add(mainRing);

  const spinGroup = new THREE.Group();
  spinGroup.name = 'weaponArm';
  bodyPivot.add(spinGroup);

  for (let i = 0; i < 6; i++) {
    const a = (Math.PI * 2 * i) / 6;
    const node =
      refId === 'status_shield'
        ? new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.65, 0.12), statusMat)
        : new THREE.Mesh(new THREE.OctahedronGeometry(0.28, 0), statusMat);
    node.position.set(Math.cos(a) * 1.25, 0.15, Math.sin(a) * 1.25);
    node.rotation.y = -a;
    spinGroup.add(node);
  }

  const centerIcon = new THREE.Mesh(new THREE.OctahedronGeometry(0.46, 0), arcaneMat);
  spinGroup.add(centerIcon);

  return sculptAndSmoothAssetGroup(root);
}

// ============================================================================
// BATCH 13: 4 CAMPAIGN BIOME 3D DIORAMAS & 4 LANE COMMANDER STATUES
// ============================================================================

export function createCampaignOrCommander3DModel(refId?: string): THREE.Group {
  const root = new THREE.Group();
  root.name = `CampaignOrCommander_${refId ?? 'camp_diorama_1'}`;

  const basaltMat = getPBRMaterial('#0F172A', 0.68, 0.35);
  const marbleMat = getPBRMaterial('#334155', 0.45, 0.55);
  const goldMat = getPBRMaterial('#F59E0B', 0.16, 0.92, '#F59E0B', 0.38);
  const cyanMat = getPBRMaterial('#38BDF8', 0.12, 0.94, '#0284C7', 0.58);
  const emeraldMat = getPBRMaterial('#10B981', 0.14, 0.88, '#10B981', 0.58);
  const crimsonMat = getPBRMaterial('#EF4444', 0.14, 0.88, '#DC2626', 0.58);
  const arcaneMat = getPBRMaterial('#A855F7', 0.12, 0.92, '#9333EA', 0.62);

  addContactShadow(root, 2.3);

  const bodyPivot = new THREE.Group();
  bodyPivot.name = 'bodyPivot';
  root.add(bodyPivot);

  if (refId?.startsWith('cmd_statue_')) {
    const isEast = refId === 'cmd_statue_kael' || refId === 'cmd_statue_vex';
    const isVex = refId === 'cmd_statue_vex';
    const isAlly = refId === 'cmd_statue_ally';
    const statueMat = isVex
      ? arcaneMat
      : isEast
      ? crimsonMat
      : isAlly
      ? cyanMat
      : goldMat;

    // 9-Part Commander Monument Statue
    const plinth = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.48, 0.48, 8), basaltMat);
    plinth.position.y = 0.24;
    bodyPivot.add(plinth);

    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.92, 0.85, 8), marbleMat);
    pillar.position.y = 0.88;
    bodyPivot.add(pillar);

    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.46, 1.15, 6), statueMat);
    torso.position.y = 1.85;
    bodyPivot.add(torso);

    const head = new THREE.Mesh(new THREE.OctahedronGeometry(0.36, 0), statueMat);
    head.position.y = 2.68;
    bodyPivot.add(head);

    const halo = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.055, 8, 24), goldMat);
    halo.position.set(0, 2.55, -0.25);
    halo.name = 'weaponArm';
    bodyPivot.add(halo);

    for (const side of [-1, 1]) {
      const pauldron = new THREE.Mesh(new THREE.DodecahedronGeometry(0.32, 0), goldMat);
      pauldron.position.set(side * 0.72, 2.22, 0);
      bodyPivot.add(pauldron);

      const wingOrHorn = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.85, 4), statueMat);
      wingOrHorn.position.set(side * 0.88, 2.65, -0.15);
      wingOrHorn.rotation.z = side * -0.4;
      bodyPivot.add(wingOrHorn);
    }
    return sculptAndSmoothAssetGroup(root);
  }

  // 4 Campaign Biome 3D Architectural Dioramas (10 parts)
  const themeMat =
    refId === 'camp_diorama_1'
      ? crimsonMat
      : refId === 'camp_diorama_2'
      ? goldMat
      : refId === 'camp_diorama_3'
      ? emeraldMat
      : cyanMat;

  const baseSlab = new THREE.Mesh(new THREE.CylinderGeometry(1.85, 2.1, 0.38, 8), basaltMat);
  baseSlab.position.y = 0.19;
  bodyPivot.add(baseSlab);

  const bridgeSpan = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.35, 2.85), marbleMat);
  bridgeSpan.position.y = 0.52;
  bodyPivot.add(bridgeSpan);

  // North Breach Portal Miniature & South Citadel Miniature
  const miniGate = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.08, 8, 20), crimsonMat);
  miniGate.position.set(0, 1.18, -1.05);
  bodyPivot.add(miniGate);

  const miniCitadel = new THREE.Mesh(new THREE.OctahedronGeometry(0.58, 0), themeMat);
  miniCitadel.position.set(0, 1.38, 0.95);
  miniCitadel.name = 'weaponArm';
  bodyPivot.add(miniCitadel);

  for (const side of [-1, 1]) {
    for (const zOff of [-0.85, 0.85]) {
      const spire = new THREE.Mesh(new THREE.ConeGeometry(0.28, 1.45, 6), themeMat);
      spire.position.set(side * 1.25, 0.95, zOff);
      bodyPivot.add(spire);
    }
  }

  const skyHalo = new THREE.Mesh(new THREE.TorusGeometry(1.65, 0.055, 8, 28), goldMat);
  skyHalo.rotation.x = Math.PI / 2;
  skyHalo.position.y = 2.15;
  bodyPivot.add(skyHalo);

  return sculptAndSmoothAssetGroup(root);
}

// ============================================================================
// BATCH 14: 10 ARMOR COUNTER-MATRIX & ROLE STANDARDS + 4 AI COMMAND CORES (14 MODELS)
// ============================================================================

export function createCounterMatrixOrRole3DModel(refId = 'def_bastion_heavy'): THREE.Group {
  const root = new THREE.Group();
  root.name = `CounterMatrixRole_${refId}`;
  addContactShadow(root, 1.55);

  const bodyPivot = new THREE.Group();
  bodyPivot.name = 'bodyPivot';
  root.add(bodyPivot);

  const basaltMat = getPBRMaterial('#1E293B', 0.25, 0.78);
  const goldMat = getPBRMaterial('#F59E0B', 0.88, 0.2, '#78350F', 0.28);
  const steelMat = getPBRMaterial('#94A3B8', 0.86, 0.22);
  const cyanMat = getPBRMaterial('#38BDF8', 0.2, 0.15, '#0284C7', 0.9);
  const emeraldMat = getPBRMaterial('#10B981', 0.25, 0.2, '#059669', 0.85);
  const crimsonMat = getPBRMaterial('#EF4444', 0.3, 0.2, '#DC2626', 0.88);
  const purpleMat = getPBRMaterial('#A855F7', 0.25, 0.2, '#7E22CE', 0.9);

  // Pedestal base (2 parts)
  const plinth = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.48, 0.36, 8), basaltMat);
  plinth.position.y = 0.18;
  bodyPivot.add(plinth);

  const trimRing = new THREE.Mesh(new THREE.TorusGeometry(1.32, 0.055, 8, 24), goldMat);
  trimRing.rotation.x = Math.PI / 2;
  trimRing.position.y = 0.36;
  bodyPivot.add(trimRing);

  if (refId.startsWith('def_bastion_')) {
    const defType = refId.replace('def_bastion_', '');
    const shieldMat =
      defType === 'light'
        ? emeraldMat
        : defType === 'medium'
        ? goldMat
        : defType === 'heavy'
        ? steelMat
        : defType === 'arcane'
        ? purpleMat
        : crimsonMat;

    // Central Armor Greatshield / Carapace Core
    const shieldCore = new THREE.Mesh(new THREE.BoxGeometry(1.35, 1.75, 0.32), shieldMat);
    shieldCore.position.y = 1.45;
    shieldCore.name = 'weaponArm';
    bodyPivot.add(shieldCore);

    const bossGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.42, 0), goldMat);
    bossGem.position.set(0, 1.45, 0.26);
    bodyPivot.add(bossGem);

    for (let i = 0; i < 4; i++) {
      const a = (Math.PI * 2 * i) / 4 + Math.PI / 4;
      const plate = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.95, 0.18), basaltMat);
      plate.position.set(Math.cos(a) * 0.95, 1.25, Math.sin(a) * 0.65);
      bodyPivot.add(plate);
    }

    const crownHalo = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.05, 8, 24), shieldMat);
    crownHalo.rotation.x = Math.PI / 2;
    crownHalo.position.y = 2.48;
    bodyPivot.add(crownHalo);

    return sculptAndSmoothAssetGroup(root);
  }

  if (refId.startsWith('role_standard_')) {
    const roleType = refId.replace('role_standard_', '');
    const roleMat =
      roleType === 'tank'
        ? steelMat
        : roleType === 'dps'
        ? crimsonMat
        : roleType === 'aoe'
        ? goldMat
        : roleType === 'support'
        ? emeraldMat
        : purpleMat;

    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.14, 2.55, 8), goldMat);
    mast.position.y = 1.45;
    bodyPivot.add(mast);

    const standardCrest = new THREE.Mesh(new THREE.OctahedronGeometry(0.62, 0), roleMat);
    standardCrest.position.y = 2.55;
    standardCrest.name = 'weaponArm';
    bodyPivot.add(standardCrest);

    for (const side of [-1, 1]) {
      const wing = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.28, 0.14), roleMat);
      wing.position.set(side * 0.65, 1.95, 0);
      wing.rotation.z = side * 0.35;
      bodyPivot.add(wing);

      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 1.25, 6), basaltMat);
      pillar.position.set(side * 0.85, 0.95, 0);
      bodyPivot.add(pillar);
    }

    return sculptAndSmoothAssetGroup(root);
  }

  // AI Command Cores (ai_core_easy, ai_core_normal, ai_core_hard, ai_core_expert)
  const aiMat =
    refId === 'ai_core_easy'
      ? emeraldMat
      : refId === 'ai_core_normal'
      ? cyanMat
      : refId === 'ai_core_hard'
      ? goldMat
      : crimsonMat;

  const coreSphere = new THREE.Mesh(new THREE.OctahedronGeometry(0.68, 1), aiMat);
  coreSphere.position.y = 1.65;
  coreSphere.name = 'weaponArm';
  bodyPivot.add(coreSphere);

  for (let i = 0; i < 3; i++) {
    const gimbal = new THREE.Mesh(
      new THREE.TorusGeometry(0.95 + i * 0.22, 0.045, 8, 24),
      i % 2 === 0 ? goldMat : aiMat
    );
    gimbal.position.y = 1.65;
    gimbal.rotation.set(i * 0.8, i * 0.5, 0);
    bodyPivot.add(gimbal);
  }

  for (let i = 0; i < 4; i++) {
    const a = (Math.PI * 2 * i) / 4;
    const pylon = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.95, 5), basaltMat);
    pylon.position.set(Math.cos(a) * 1.05, 0.82, Math.sin(a) * 1.05);
    bodyPivot.add(pylon);
  }

  return sculptAndSmoothAssetGroup(root);
}

// ============================================================================
// BATCH 15: 12 ECONOMY FORGES, WAVE PHASE HERALDS & FINALE MONUMENTS (12 MODELS)
// ============================================================================

export function createEconomyOrFinale3DModel(refId = 'finale_grand_bastion_crown'): THREE.Group {
  const root = new THREE.Group();
  root.name = `EconomyFinale_${refId}`;
  addContactShadow(root, 1.75);

  const bodyPivot = new THREE.Group();
  bodyPivot.name = 'bodyPivot';
  root.add(bodyPivot);

  const basaltMat = getPBRMaterial('#1E293B', 0.25, 0.76);
  const goldMat = getPBRMaterial('#F59E0B', 0.9, 0.18, '#78350F', 0.32);
  const purpleMat = getPBRMaterial('#A855F7', 0.25, 0.18, '#7E22CE', 0.92);
  const cyanMat = getPBRMaterial('#38BDF8', 0.2, 0.15, '#0284C7', 0.9);
  const crimsonMat = getPBRMaterial('#EF4444', 0.3, 0.2, '#DC2626', 0.88);
  const emeraldMat = getPBRMaterial('#10B981', 0.25, 0.2, '#059669', 0.85);

  // Stepped Octagonal Foundation (2 parts)
  const basePlinth = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 1.7, 0.42, 8), basaltMat);
  basePlinth.position.y = 0.21;
  bodyPivot.add(basePlinth);

  const baseHalo = new THREE.Mesh(new THREE.TorusGeometry(1.52, 0.06, 8, 28), goldMat);
  baseHalo.rotation.x = Math.PI / 2;
  baseHalo.position.y = 0.42;
  bodyPivot.add(baseHalo);

  if (refId.startsWith('econ_tier_')) {
    const tierNum = refId.includes('_4_')
      ? 4
      : refId.includes('_3_')
      ? 3
      : refId.includes('_2_')
      ? 2
      : 1;

    const smelterCore = new THREE.Mesh(
      new THREE.CylinderGeometry(0.65, 0.82, 1.35 + tierNum * 0.18, 8),
      basaltMat
    );
    smelterCore.position.y = 1.05;
    bodyPivot.add(smelterCore);

    const crystalSpire = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.55 + tierNum * 0.08, 0),
      purpleMat
    );
    crystalSpire.position.y = 2.15 + tierNum * 0.12;
    crystalSpire.name = 'weaponArm';
    bodyPivot.add(crystalSpire);

    for (let i = 0; i < 4; i++) {
      const a = (Math.PI * 2 * i) / 4 + Math.PI / 4;
      const node = new THREE.Mesh(
        new THREE.ConeGeometry(0.24, 1.1 + tierNum * 0.15, 6),
        i % 2 === 0 ? purpleMat : goldMat
      );
      node.position.set(Math.cos(a) * 1.1, 0.95, Math.sin(a) * 1.1);
      bodyPivot.add(node);
    }

    const turbineRing = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.055, 8, 24), cyanMat);
    turbineRing.rotation.x = Math.PI / 2;
    turbineRing.position.y = 1.85;
    bodyPivot.add(turbineRing);

    return sculptAndSmoothAssetGroup(root);
  }

  if (refId.startsWith('phase_herald_')) {
    const isBoss = refId === 'phase_herald_boss';
    const isLate = refId === 'phase_herald_late';
    const heraldMat = isBoss ? crimsonMat : isLate ? purpleMat : goldMat;

    for (const side of [-1, 1]) {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 2.25, 8), basaltMat);
      col.position.set(side * 0.92, 1.35, 0);
      bodyPivot.add(col);

      const horn = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.85, 6), heraldMat);
      horn.position.set(side * 1.15, 2.45, 0);
      horn.rotation.z = -side * 0.45;
      bodyPivot.add(horn);
    }

    const archBeam = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.34, 0.42), goldMat);
    archBeam.position.y = 2.45;
    bodyPivot.add(archBeam);

    const heraldCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.62, 0), heraldMat);
    heraldCore.position.y = 1.55;
    heraldCore.name = 'weaponArm';
    bodyPivot.add(heraldCore);

    const vortexRing = new THREE.Mesh(new THREE.TorusGeometry(0.82, 0.055, 8, 24), heraldMat);
    vortexRing.position.y = 1.55;
    bodyPivot.add(vortexRing);

    return sculptAndSmoothAssetGroup(root);
  }

  // Grand Finale Reliquaries & #200 Grand Sovereign Apex Crown
  const crownMat =
    refId === 'finale_citadel_aegis'
      ? emeraldMat
      : refId === 'finale_overtime_chronos'
      ? cyanMat
      : goldMat;

  const centralPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.72, 1.45, 8), basaltMat);
  centralPillar.position.y = 1.1;
  bodyPivot.add(centralPillar);

  const apexCrown = new THREE.Mesh(new THREE.OctahedronGeometry(0.75, 0), crownMat);
  apexCrown.position.y = 2.35;
  apexCrown.name = 'weaponArm';
  bodyPivot.add(apexCrown);

  for (let i = 0; i < 6; i++) {
    const a = (Math.PI * 2 * i) / 6;
    const spire = new THREE.Mesh(
      new THREE.ConeGeometry(0.2, 1.15, 5),
      i % 2 === 0 ? goldMat : cyanMat
    );
    spire.position.set(Math.cos(a) * 1.15, 1.25, Math.sin(a) * 1.15);
    bodyPivot.add(spire);
  }

  const celestialHalo = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.065, 8, 28), goldMat);
  celestialHalo.rotation.x = Math.PI / 2;
  celestialHalo.position.y = 2.35;
  bodyPivot.add(celestialHalo);

  return sculptAndSmoothAssetGroup(root);
}

// ============================================================================
// BATCH 16: 16 TIER-2 ASCENSION SHRINES & BASTION WATCHTOWERS (16 MODELS)
// ============================================================================

export function createTier2AscensionOrWatchtower3DModel(refId = 'watchtower_inferno'): THREE.Group {
  const root = new THREE.Group();
  root.name = `Tier2Ascension_${refId}`;
  addContactShadow(root, 1.65);

  const bodyPivot = new THREE.Group();
  bodyPivot.name = 'bodyPivot';
  root.add(bodyPivot);

  const basaltMat = getPBRMaterial('#1E293B', 0.25, 0.76);
  const goldMat = getPBRMaterial('#F59E0B', 0.9, 0.18, '#78350F', 0.32);
  const cyanMat = getPBRMaterial('#38BDF8', 0.2, 0.15, '#0284C7', 0.9);
  const crimsonMat = getPBRMaterial('#EF4444', 0.3, 0.2, '#DC2626', 0.88);
  const emeraldMat = getPBRMaterial('#10B981', 0.25, 0.2, '#059669', 0.85);
  const purpleMat = getPBRMaterial('#A855F7', 0.25, 0.18, '#7E22CE', 0.92);

  const accentMat =
    refId.includes('inferno') || refId.includes('berserker')
      ? crimsonMat
      : refId.includes('nature') || refId.includes('wild') || refId.includes('seraphim')
      ? emeraldMat
      : refId.includes('undead') || refId.includes('arcane') || refId.includes('singularity')
      ? purpleMat
      : refId.includes('abyss') || refId.includes('archon') || refId.includes('leviathan')
      ? cyanMat
      : goldMat;

  // Octagonal Foundation & Gold Ring (2 parts)
  const basePlinth = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.55, 0.38, 8), basaltMat);
  basePlinth.position.y = 0.19;
  bodyPivot.add(basePlinth);

  const baseRing = new THREE.Mesh(new THREE.TorusGeometry(1.38, 0.055, 8, 24), goldMat);
  baseRing.rotation.x = Math.PI / 2;
  baseRing.position.y = 0.38;
  bodyPivot.add(baseRing);

  if (refId.startsWith('watchtower_')) {
    const towerShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.78, 1.85, 8), basaltMat);
    towerShaft.position.y = 1.25;
    bodyPivot.add(towerShaft);

    const belfryCrown = new THREE.Mesh(new THREE.CylinderGeometry(0.76, 0.64, 0.36, 8), goldMat);
    belfryCrown.position.y = 2.25;
    bodyPivot.add(belfryCrown);

    const turretCrystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.52, 0), accentMat);
    turretCrystal.position.y = 2.85;
    turretCrystal.name = 'weaponArm';
    bodyPivot.add(turretCrystal);

    for (let i = 0; i < 4; i++) {
      const a = (Math.PI * 2 * i) / 4 + Math.PI / 4;
      const buttress = new THREE.Mesh(new THREE.BoxGeometry(0.26, 1.45, 0.38), goldMat);
      buttress.position.set(Math.cos(a) * 0.82, 1.0, Math.sin(a) * 0.82);
      buttress.rotation.y = -a;
      bodyPivot.add(buttress);
    }

    return sculptAndSmoothAssetGroup(root);
  }

  // Tier-2 Ascension Branch Shrines
  const corePedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.62, 1.15, 8), basaltMat);
  corePedestal.position.y = 0.85;
  bodyPivot.add(corePedestal);

  const ascensionCrystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.65, 0), accentMat);
  ascensionCrystal.position.y = 1.95;
  ascensionCrystal.name = 'weaponArm';
  bodyPivot.add(ascensionCrystal);

  for (let i = 0; i < 2; i++) {
    const helix = new THREE.Mesh(
      new THREE.TorusGeometry(1.05 + i * 0.18, 0.05, 8, 24),
      i === 0 ? goldMat : accentMat
    );
    helix.position.y = 1.95;
    helix.rotation.set(0.6 + i * 0.5, i * 0.8, 0);
    bodyPivot.add(helix);
  }

  for (let i = 0; i < 3; i++) {
    const a = (Math.PI * 2 * i) / 3;
    const fang = new THREE.Mesh(new THREE.ConeGeometry(0.2, 1.15, 5), accentMat);
    fang.position.set(Math.cos(a) * 1.02, 1.05, Math.sin(a) * 1.02);
    bodyPivot.add(fang);
  }

  return sculptAndSmoothAssetGroup(root);
}

// ============================================================================
// BATCH 17: 12 ASTRAL ANOMALIES, RIFT PORTALS & CELESTIAL PHENOMENA (12 MODELS)
// ============================================================================

export function createAstralAnomalyOrPortal3DModel(refId = 'astral_rift_aether'): THREE.Group {
  const root = new THREE.Group();
  root.name = `AstralAnomaly_${refId}`;
  addContactShadow(root, 1.75);

  const bodyPivot = new THREE.Group();
  bodyPivot.name = 'bodyPivot';
  root.add(bodyPivot);

  const basaltMat = getPBRMaterial('#1E293B', 0.25, 0.76);
  const goldMat = getPBRMaterial('#F59E0B', 0.9, 0.18, '#78350F', 0.32);
  const cyanMat = getPBRMaterial('#38BDF8', 0.2, 0.15, '#0284C7', 0.92);
  const crimsonMat = getPBRMaterial('#EF4444', 0.3, 0.2, '#DC2626', 0.9);
  const purpleMat = getPBRMaterial('#A855F7', 0.25, 0.18, '#7E22CE', 0.92);
  const emeraldMat = getPBRMaterial('#10B981', 0.25, 0.2, '#059669', 0.88);

  const portalMat =
    refId.includes('crimson') || refId.includes('meteor')
      ? crimsonMat
      : refId.includes('chronos') || refId.includes('eclipse') || refId.includes('starforge')
      ? goldMat
      : refId.includes('gravity') || refId.includes('void')
      ? purpleMat
      : refId.includes('aurora') || refId.includes('mana')
      ? emeraldMat
      : cyanMat;

  // Base Platform (2 parts)
  const dais = new THREE.Mesh(new THREE.CylinderGeometry(1.42, 1.65, 0.38, 8), basaltMat);
  dais.position.y = 0.19;
  bodyPivot.add(dais);

  const daisRing = new THREE.Mesh(new THREE.TorusGeometry(1.48, 0.055, 8, 28), portalMat);
  daisRing.rotation.x = Math.PI / 2;
  daisRing.position.y = 0.38;
  bodyPivot.add(daisRing);

  // Stargate / Astrolabe Outer Frame
  const outerGate = new THREE.Mesh(new THREE.TorusGeometry(1.18, 0.11, 10, 28), basaltMat);
  outerGate.position.y = 1.75;
  bodyPivot.add(outerGate);

  const innerVortex = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.06, 8, 24), portalMat);
  innerVortex.position.y = 1.75;
  bodyPivot.add(innerVortex);

  const singularityCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.58, 1), portalMat);
  singularityCore.position.y = 1.75;
  singularityCore.name = 'weaponArm';
  bodyPivot.add(singularityCore);

  for (let i = 0; i < 4; i++) {
    const a = (Math.PI * 2 * i) / 4 + Math.PI / 4;
    const pylon = new THREE.Mesh(
      new THREE.ConeGeometry(0.22, 1.25, 6),
      i % 2 === 0 ? goldMat : portalMat
    );
    pylon.position.set(Math.cos(a) * 1.18, 0.95, Math.sin(a) * 1.18);
    bodyPivot.add(pylon);
  }

  const zenithHalo = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.045, 8, 24), goldMat);
  zenithHalo.rotation.x = Math.PI / 2;
  zenithHalo.position.y = 2.95;
  bodyPivot.add(zenithHalo);

  return sculptAndSmoothAssetGroup(root);
}

// ============================================================================
// BATCH 18: 12 CITADEL ARMORY SIEGE ENGINES & ROYAL RELICS (#240 OMEGA)
// ============================================================================

export function createCitadelArmoryOrRoyalRelic3DModel(
  refId = 'citadel_armory_omega_monument'
): THREE.Group {
  const root = new THREE.Group();
  root.name = `CitadelArmory_${refId}`;
  addContactShadow(root, 1.8);

  const bodyPivot = new THREE.Group();
  bodyPivot.name = 'bodyPivot';
  root.add(bodyPivot);

  const basaltMat = getPBRMaterial('#1E293B', 0.25, 0.76);
  const goldMat = getPBRMaterial('#F59E0B', 0.9, 0.18, '#78350F', 0.34);
  const steelMat = getPBRMaterial('#94A3B8', 0.86, 0.22);
  const cyanMat = getPBRMaterial('#38BDF8', 0.2, 0.15, '#0284C7', 0.9);
  const emeraldMat = getPBRMaterial('#10B981', 0.25, 0.2, '#059669', 0.88);
  const crimsonMat = getPBRMaterial('#EF4444', 0.3, 0.2, '#DC2626', 0.88);

  const basePlinth = new THREE.Mesh(new THREE.CylinderGeometry(1.48, 1.72, 0.42, 8), basaltMat);
  basePlinth.position.y = 0.21;
  bodyPivot.add(basePlinth);

  const baseHalo = new THREE.Mesh(new THREE.TorusGeometry(1.56, 0.06, 8, 28), goldMat);
  baseHalo.rotation.x = Math.PI / 2;
  baseHalo.position.y = 0.42;
  bodyPivot.add(baseHalo);

  if (refId === 'citadel_armory_ballista' || refId === 'citadel_armory_mortar') {
    const isMortar = refId === 'citadel_armory_mortar';
    const turretBase = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.92, 0.75, 8), basaltMat);
    turretBase.position.y = 0.78;
    bodyPivot.add(turretBase);

    const barrelOrBow = new THREE.Mesh(
      isMortar
        ? new THREE.CylinderGeometry(0.38, 0.48, 1.65, 10)
        : new THREE.BoxGeometry(1.85, 0.22, 0.32),
      goldMat
    );
    barrelOrBow.position.set(0, 1.55, 0.2);
    barrelOrBow.rotation.x = isMortar ? -Math.PI / 4 : 0;
    barrelOrBow.name = 'weaponArm';
    bodyPivot.add(barrelOrBow);

    const boltOrShell = new THREE.Mesh(
      new THREE.ConeGeometry(0.24, 1.15, 6),
      isMortar ? crimsonMat : cyanMat
    );
    boltOrShell.position.set(0, 1.85, 0.45);
    boltOrShell.rotation.x = Math.PI / 3;
    bodyPivot.add(boltOrShell);

    for (const side of [-1, 1]) {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.18, 12), steelMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(side * 0.92, 0.85, 0);
      bodyPivot.add(wheel);
    }

    return sculptAndSmoothAssetGroup(root);
  }

  // Royal Reliquaries, Healing Fountain, Thrones & #240 Omega Bastion Monument
  const isFountain = refId === 'citadel_armory_healing_fountain';
  const isOmega = refId === 'citadel_armory_omega_monument';
  const relicMat = isFountain ? emeraldMat : isOmega ? goldMat : cyanMat;

  const sanctumCore = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.88, 1.5, 8), basaltMat);
  sanctumCore.position.y = 1.15;
  bodyPivot.add(sanctumCore);

  const crownSpire = new THREE.Mesh(
    new THREE.OctahedronGeometry(isOmega ? 0.82 : 0.65, 0),
    relicMat
  );
  crownSpire.position.y = 2.45;
  crownSpire.name = 'weaponArm';
  bodyPivot.add(crownSpire);

  const spireCount = isOmega ? 6 : 4;
  for (let i = 0; i < spireCount; i++) {
    const a = (Math.PI * 2 * i) / spireCount;
    const col = new THREE.Mesh(
      new THREE.ConeGeometry(0.22, 1.35, 6),
      i % 2 === 0 ? goldMat : relicMat
    );
    col.position.set(Math.cos(a) * 1.18, 1.15, Math.sin(a) * 1.18);
    bodyPivot.add(col);
  }

  const upperHalo = new THREE.Mesh(new THREE.TorusGeometry(1.32, 0.06, 8, 28), goldMat);
  upperHalo.rotation.x = Math.PI / 2;
  upperHalo.position.y = 2.45;
  bodyPivot.add(upperHalo);

  if (isOmega) {
    const secondHalo = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.05, 8, 24), cyanMat);
    secondHalo.position.y = 2.45;
    bodyPivot.add(secondHalo);
  }

  return sculptAndSmoothAssetGroup(root);
}

// ============================================================================
// BATCH 19: 30 WAR MACHINES, CONVOY CHARIOTS, ROYAL MECHS & SKY CRUISERS
// ============================================================================

export function createWarMachineOrConvoyEngine3DModel(
  refId = 'royal_mech_vanguard'
): THREE.Group {
  const root = new THREE.Group();
  root.name = `WarMachineConvoy_${refId}`;
  addContactShadow(root, 1.75);

  const bodyPivot = new THREE.Group();
  bodyPivot.name = 'bodyPivot';
  root.add(bodyPivot);

  const basaltMat = getPBRMaterial('#1E293B', 0.28, 0.72);
  const goldMat = getPBRMaterial('#F59E0B', 0.9, 0.18, '#78350F', 0.34);
  const steelMat = getPBRMaterial('#94A3B8', 0.88, 0.2);
  const cyanMat = getPBRMaterial('#38BDF8', 0.2, 0.15, '#0284C7', 0.92);
  const crimsonMat = getPBRMaterial('#EF4444', 0.3, 0.2, '#DC2626', 0.9);
  const emeraldMat = getPBRMaterial('#10B981', 0.25, 0.2, '#059669', 0.88);
  const purpleMat = getPBRMaterial('#A855F7', 0.25, 0.18, '#7E22CE', 0.92);

  const trimMat =
    refId.includes('inferno') || refId.includes('vanguard') || refId.includes('helios')
      ? crimsonMat
      : refId.includes('nature') || refId.includes('wild') || refId.includes('sylvan')
      ? emeraldMat
      : refId.includes('undead') ||
        refId.includes('arcane') ||
        refId.includes('reaper') ||
        refId.includes('eclipse') ||
        refId.includes('necro')
      ? purpleMat
      : refId.includes('abyss') ||
        refId.includes('leviathan') ||
        refId.includes('aether') ||
        refId.includes('arcanist')
      ? cyanMat
      : goldMat;

  // Base Plinth (2 parts)
  const basePlinth = new THREE.Mesh(new THREE.CylinderGeometry(1.42, 1.65, 0.36, 8), basaltMat);
  basePlinth.position.y = 0.18;
  bodyPivot.add(basePlinth);

  const baseRing = new THREE.Mesh(new THREE.TorusGeometry(1.48, 0.05, 8, 24), goldMat);
  baseRing.rotation.x = Math.PI / 2;
  baseRing.position.y = 0.36;
  bodyPivot.add(baseRing);

  if (refId.startsWith('convoy_chariot_') || refId.startsWith('supply_depot_')) {
    const hull = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.78, 1.95), basaltMat);
    hull.position.y = 0.92;
    bodyPivot.add(hull);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.65, 1.05), goldMat);
    cabin.position.set(0, 1.55, -0.2);
    bodyPivot.add(cabin);

    const turretBanner = new THREE.Mesh(new THREE.OctahedronGeometry(0.48, 0), trimMat);
    turretBanner.position.set(0, 2.35, -0.2);
    turretBanner.name = 'weaponArm';
    bodyPivot.add(turretBanner);

    for (const sx of [-0.88, 0.88]) {
      for (const sz of [-0.65, 0.65]) {
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.2, 12), steelMat);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(sx, 0.65, sz);
        bodyPivot.add(wheel);
      }
    }

    return sculptAndSmoothAssetGroup(root);
  }

  if (refId.startsWith('sky_cruiser_')) {
    const keel = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.65, 2.35), basaltMat);
    keel.position.y = 1.85;
    bodyPivot.add(keel);

    const bridge = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.52, 0.65, 8), goldMat);
    bridge.position.set(0, 2.45, -0.25);
    bodyPivot.add(bridge);

    const prowCannon = new THREE.Mesh(new THREE.ConeGeometry(0.34, 1.15, 6), trimMat);
    prowCannon.rotation.x = Math.PI / 2;
    prowCannon.position.set(0, 1.85, 1.45);
    prowCannon.name = 'weaponArm';
    bodyPivot.add(prowCannon);

    for (const side of [-1, 1]) {
      const wing = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.14, 0.72), goldMat);
      wing.position.set(side * 1.1, 1.92, 0);
      bodyPivot.add(wing);

      const rotor = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.06, 8, 20), trimMat);
      rotor.rotation.x = Math.PI / 2;
      rotor.position.set(side * 1.35, 2.05, 0);
      bodyPivot.add(rotor);
    }

    return sculptAndSmoothAssetGroup(root);
  }

  // Royal Guardian Mechs (11 parts)
  const pelvis = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.42, 0.72), basaltMat);
  pelvis.position.y = 0.95;
  bodyPivot.add(pelvis);

  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.58, 1.15, 8), goldMat);
  torso.position.y = 1.72;
  bodyPivot.add(torso);

  const reactorCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.34, 0), trimMat);
  reactorCore.position.set(0, 1.75, 0.62);
  bodyPivot.add(reactorCore);

  const headHelm = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.65, 6), trimMat);
  headHelm.position.y = 2.58;
  bodyPivot.add(headHelm);

  for (const side of [-1, 1]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.75, 0.42), steelMat);
    leg.position.set(side * 0.42, 0.62, 0);
    bodyPivot.add(leg);

    const pauldron = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.48, 0.62), basaltMat);
    pauldron.position.set(side * 0.92, 2.05, 0);
    bodyPivot.add(pauldron);
  }

  const mechWeapon = new THREE.Mesh(new THREE.BoxGeometry(0.24, 1.45, 0.36), trimMat);
  mechWeapon.position.set(1.05, 1.75, 0.48);
  mechWeapon.rotation.x = Math.PI / 4;
  mechWeapon.name = 'weaponArm';
  bodyPivot.add(mechWeapon);

  return sculptAndSmoothAssetGroup(root);
}

// ============================================================================
// BATCH 20: 30 CELESTIAL WONDERS, PRIMORDIAL IDOLS & #300 SUPREME PANTHEON
// ============================================================================

export function createCelestialWonderOrPantheon3DModel(
  refId = 'celestial_wonder_300_supreme_pantheon'
): THREE.Group {
  const root = new THREE.Group();
  root.name = `CelestialWonder_${refId}`;
  addContactShadow(root, 1.9);

  const bodyPivot = new THREE.Group();
  bodyPivot.name = 'bodyPivot';
  root.add(bodyPivot);

  const basaltMat = getPBRMaterial('#1E293B', 0.25, 0.74);
  const goldMat = getPBRMaterial('#F59E0B', 0.92, 0.16, '#78350F', 0.38);
  const cyanMat = getPBRMaterial('#38BDF8', 0.2, 0.14, '#0284C7', 0.95);
  const crimsonMat = getPBRMaterial('#EF4444', 0.3, 0.18, '#DC2626', 0.92);
  const emeraldMat = getPBRMaterial('#10B981', 0.25, 0.18, '#059669', 0.9);
  const purpleMat = getPBRMaterial('#A855F7', 0.25, 0.16, '#7E22CE', 0.95);

  const isApex300 = refId === 'celestial_wonder_300_supreme_pantheon';
  const wonderMat = isApex300
    ? goldMat
    : refId.includes('inferno') || refId.includes('supernova') || refId.includes('flame')
    ? crimsonMat
    : refId.includes('nature') || refId.includes('wild') || refId.includes('worldtree')
    ? emeraldMat
    : refId.includes('undead') ||
      refId.includes('arcane') ||
      refId.includes('nebula') ||
      refId.includes('quasar')
    ? purpleMat
    : cyanMat;

  // Stepped Grand Sanctuary Dais (2 parts)
  const grandDais = new THREE.Mesh(
    new THREE.CylinderGeometry(isApex300 ? 1.65 : 1.45, isApex300 ? 1.92 : 1.7, 0.45, 8),
    basaltMat
  );
  grandDais.position.y = 0.22;
  bodyPivot.add(grandDais);

  const daisHalo = new THREE.Mesh(
    new THREE.TorusGeometry(isApex300 ? 1.72 : 1.52, 0.065, 8, 28),
    goldMat
  );
  daisHalo.rotation.x = Math.PI / 2;
  daisHalo.position.y = 0.45;
  bodyPivot.add(daisHalo);

  // Central Pantheon Sanctum Core
  const centralSanctum = new THREE.Mesh(
    new THREE.CylinderGeometry(0.68, 0.88, isApex300 ? 1.75 : 1.45, 8),
    basaltMat
  );
  centralSanctum.position.y = 1.25;
  bodyPivot.add(centralSanctum);

  const sovereignStar = new THREE.Mesh(
    new THREE.OctahedronGeometry(isApex300 ? 0.88 : 0.68, 0),
    wonderMat
  );
  sovereignStar.position.y = isApex300 ? 2.65 : 2.35;
  sovereignStar.name = 'weaponArm';
  bodyPivot.add(sovereignStar);

  const pillarCount = isApex300 ? 8 : 6;
  for (let i = 0; i < pillarCount; i++) {
    const a = (Math.PI * 2 * i) / pillarCount;
    const radius = isApex300 ? 1.35 : 1.15;
    const pillar = new THREE.Mesh(
      new THREE.ConeGeometry(0.21, isApex300 ? 1.55 : 1.25, 6),
      i % 2 === 0 ? goldMat : wonderMat
    );
    pillar.position.set(Math.cos(a) * radius, 1.18, Math.sin(a) * radius);
    bodyPivot.add(pillar);
  }

  const ringCount = isApex300 ? 3 : 2;
  for (let r = 0; r < ringCount; r++) {
    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(1.12 + r * 0.22, 0.05, 8, 28),
      r % 2 === 0 ? goldMat : cyanMat
    );
    halo.position.y = isApex300 ? 2.65 : 2.35;
    halo.rotation.set(r * 0.55, r * 0.4, 0);
    bodyPivot.add(halo);
  }

  return sculptAndSmoothAssetGroup(root);
}

// ============================================================================
// BATCH 21: 30 WAR BANNERS, SCRYING RADAR ARRAYS & FLAK INTERCEPTOR TOWERS
// ============================================================================

export function createWarBannerRadarOrFlak3DModel(
  refId = 'radar_array_inferno'
): THREE.Group {
  const root = new THREE.Group();
  root.name = `WarBannerRadarFlak_${refId}`;
  addContactShadow(root, 1.68);

  const bodyPivot = new THREE.Group();
  bodyPivot.name = 'bodyPivot';
  root.add(bodyPivot);

  const basaltMat = getPBRMaterial('#1E293B', 0.28, 0.72);
  const goldMat = getPBRMaterial('#F59E0B', 0.9, 0.18, '#78350F', 0.34);
  const steelMat = getPBRMaterial('#94A3B8', 0.88, 0.2);
  const cyanMat = getPBRMaterial('#38BDF8', 0.2, 0.15, '#0284C7', 0.92);
  const crimsonMat = getPBRMaterial('#EF4444', 0.3, 0.2, '#DC2626', 0.9);
  const emeraldMat = getPBRMaterial('#10B981', 0.25, 0.2, '#059669', 0.88);
  const purpleMat = getPBRMaterial('#A855F7', 0.25, 0.18, '#7E22CE', 0.92);

  const accentMat =
    refId.includes('inferno') || refId.includes('overcharge')
      ? crimsonMat
      : refId.includes('nature') || refId.includes('wild')
      ? emeraldMat
      : refId.includes('undead') || refId.includes('arcane')
      ? purpleMat
      : refId.includes('abyss') || refId.includes('aegis')
      ? cyanMat
      : goldMat;

  // Stepped Octagonal Base (2 parts)
  const basePlinth = new THREE.Mesh(new THREE.CylinderGeometry(1.32, 1.56, 0.36, 8), basaltMat);
  basePlinth.position.y = 0.18;
  bodyPivot.add(basePlinth);

  const baseRing = new THREE.Mesh(new THREE.TorusGeometry(1.38, 0.05, 8, 24), goldMat);
  baseRing.rotation.x = Math.PI / 2;
  baseRing.position.y = 0.36;
  bodyPivot.add(baseRing);

  if (refId.startsWith('radar_array_')) {
    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.72, 1.15, 8), basaltMat);
    pedestal.position.y = 0.92;
    bodyPivot.add(pedestal);

    const dishAssembly = new THREE.Group();
    dishAssembly.position.y = 1.95;
    dishAssembly.name = 'weaponArm';
    bodyPivot.add(dishAssembly);

    const dishRing = new THREE.Mesh(new THREE.TorusGeometry(0.88, 0.08, 8, 24), goldMat);
    dishRing.rotation.x = Math.PI / 4;
    dishAssembly.add(dishRing);

    const scryingOrb = new THREE.Mesh(new THREE.OctahedronGeometry(0.45, 1), accentMat);
    dishAssembly.add(scryingOrb);

    for (let i = 0; i < 3; i++) {
      const a = (Math.PI * 2 * i) / 3;
      const antenna = new THREE.Mesh(new THREE.ConeGeometry(0.18, 1.05, 5), steelMat);
      antenna.position.set(Math.cos(a) * 1.02, 0.92, Math.sin(a) * 1.02);
      bodyPivot.add(antenna);
    }

    return sculptAndSmoothAssetGroup(root);
  }

  if (refId.startsWith('flak_battery_')) {
    const bunker = new THREE.Mesh(new THREE.CylinderGeometry(0.82, 0.98, 1.05, 8), basaltMat);
    bunker.position.y = 0.85;
    bodyPivot.add(bunker);

    const turretHead = new THREE.Group();
    turretHead.position.y = 1.65;
    turretHead.name = 'weaponArm';
    bodyPivot.add(turretHead);

    const turretCore = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.65, 1.1), goldMat);
    turretHead.add(turretCore);

    for (const sx of [-0.36, 0.36]) {
      for (const sy of [-0.14, 0.18]) {
        const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 1.45, 8), steelMat);
        barrel.rotation.x = -Math.PI / 3;
        barrel.position.set(sx, sy + 0.25, 0.65);
        turretHead.add(barrel);
      }
    }

    const ammoCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.38, 0), accentMat);
    ammoCore.position.y = 0.55;
    turretHead.add(ammoCore);

    return sculptAndSmoothAssetGroup(root);
  }

  // Grand War-Banners & Grid Force Pylons (10 parts)
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 2.75, 8), goldMat);
  mast.position.y = 1.55;
  bodyPivot.add(mast);

  const crossbar = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.16, 0.18), goldMat);
  crossbar.position.y = 2.45;
  bodyPivot.add(crossbar);

  const bannerCloth = new THREE.Mesh(new THREE.BoxGeometry(1.25, 1.55, 0.12), accentMat);
  bannerCloth.position.set(0, 1.62, 0.08);
  bodyPivot.add(bannerCloth);

  const apexCrest = new THREE.Mesh(new THREE.OctahedronGeometry(0.48, 0), accentMat);
  apexCrest.position.y = 2.98;
  apexCrest.name = 'weaponArm';
  bodyPivot.add(apexCrest);

  for (const side of [-1, 1]) {
    const tassel = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.95, 5), goldMat);
    tassel.position.set(side * 0.82, 1.85, 0);
    bodyPivot.add(tassel);

    const guardPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 1.05, 6), basaltMat);
    guardPillar.position.set(side * 0.95, 0.85, 0);
    bodyPivot.add(guardPillar);
  }

  return sculptAndSmoothAssetGroup(root);
}

// ============================================================================
// BATCH 22: 30 ELEMENTAL AVATARS, CAMPAIGN MEDALS & #360 ETERNAL BASTION
// ============================================================================

export function createElementalTitanOrSovereignAvatar3DModel(
  refId = 'sovereign_avatar_360_eternal_bastion'
): THREE.Group {
  const root = new THREE.Group();
  root.name = `ElementalTitanSovereign_${refId}`;
  addContactShadow(root, 1.9);

  const bodyPivot = new THREE.Group();
  bodyPivot.name = 'bodyPivot';
  root.add(bodyPivot);

  const basaltMat = getPBRMaterial('#1E293B', 0.25, 0.74);
  const goldMat = getPBRMaterial('#F59E0B', 0.92, 0.16, '#78350F', 0.38);
  const cyanMat = getPBRMaterial('#38BDF8', 0.2, 0.14, '#0284C7', 0.95);
  const crimsonMat = getPBRMaterial('#EF4444', 0.3, 0.18, '#DC2626', 0.92);
  const emeraldMat = getPBRMaterial('#10B981', 0.25, 0.18, '#059669', 0.9);
  const purpleMat = getPBRMaterial('#A855F7', 0.25, 0.16, '#7E22CE', 0.95);

  const isApex360 = refId === 'sovereign_avatar_360_eternal_bastion';
  const avatarMat = isApex360
    ? goldMat
    : refId.includes('inferno') || refId.includes('crit') || refId.includes('siege')
      ? crimsonMat
      : refId.includes('nature') || refId.includes('wild') || refId.includes('pierce')
      ? emeraldMat
      : refId.includes('undead') || refId.includes('arcane') || refId.includes('magic')
      ? purpleMat
      : cyanMat;

  // Grand Octagonal Dais (2 parts)
  const dais = new THREE.Mesh(
    new THREE.CylinderGeometry(isApex360 ? 1.68 : 1.44, isApex360 ? 1.95 : 1.68, 0.44, 8),
    basaltMat
  );
  dais.position.y = 0.22;
  bodyPivot.add(dais);

  const daisHalo = new THREE.Mesh(
    new THREE.TorusGeometry(isApex360 ? 1.76 : 1.5, 0.06, 8, 28),
    goldMat
  );
  daisHalo.rotation.x = Math.PI / 2;
  daisHalo.position.y = 0.44;
  bodyPivot.add(daisHalo);

  // Colossal Avatar Torso & Sovereign Core
  const avatarTorso = new THREE.Mesh(
    new THREE.CylinderGeometry(0.72, 0.55, isApex360 ? 1.85 : 1.55, 8),
    basaltMat
  );
  avatarTorso.position.y = 1.35;
  bodyPivot.add(avatarTorso);

  const avatarCrown = new THREE.Mesh(
    new THREE.OctahedronGeometry(isApex360 ? 0.86 : 0.66, 0),
    avatarMat
  );
  avatarCrown.position.y = isApex360 ? 2.68 : 2.38;
  avatarCrown.name = 'weaponArm';
  bodyPivot.add(avatarCrown);

  for (const side of [-1, 1]) {
    const wingMonolith = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 1.35, 0.28),
      goldMat
    );
    wingMonolith.position.set(side * 1.05, 1.95, -0.15);
    wingMonolith.rotation.z = -side * 0.28;
    bodyPivot.add(wingMonolith);
  }

  const obeliskCount = isApex360 ? 8 : 4;
  for (let i = 0; i < obeliskCount; i++) {
    const a = (Math.PI * 2 * i) / obeliskCount + Math.PI / 4;
    const obelisk = new THREE.Mesh(
      new THREE.ConeGeometry(0.2, isApex360 ? 1.45 : 1.15, 6),
      i % 2 === 0 ? avatarMat : goldMat
    );
    const r = isApex360 ? 1.38 : 1.16;
    obelisk.position.set(Math.cos(a) * r, 1.1, Math.sin(a) * r);
    bodyPivot.add(obelisk);
  }

  const haloRing = new THREE.Mesh(
    new THREE.TorusGeometry(isApex360 ? 1.32 : 1.08, 0.055, 8, 28),
    avatarMat
  );
  haloRing.rotation.x = Math.PI / 2;
  haloRing.position.y = isApex360 ? 2.68 : 2.38;
  bodyPivot.add(haloRing);

  return sculptAndSmoothAssetGroup(root);
}

// ============================================================================
// BATCH 23: COMPANION SPIRITS, ARCANE CONDUITS & BALLISTIC PROJECTILES 3D
// ============================================================================
export function createCompanionSpiritOrBallistic3DModel(
  refId = 'spirit_familiar_inferno'
): THREE.Group {
  const root = new THREE.Group();
  root.name = `CompanionOrBallistic_${refId}`;
  addContactShadow(root, 1.55);

  const bodyPivot = new THREE.Group();
  bodyPivot.name = 'bodyPivot';
  root.add(bodyPivot);

  const paletteMap: Record<string, string> = {
    inferno: '#F97316',
    undead: '#A855F7',
    nature: '#22C55E',
    mechanic: '#38BDF8',
    abyss: '#06B6D4',
    wild: '#EAB308',
    divine: '#FDE047',
    arcane: '#EC4899',
    pierce: '#38BDF8',
    siege: '#F97316',
    magic: '#C084FC',
    impact: '#F59E0B',
    pure: '#FEF08A',
    frost: '#7DD3FC',
    venom: '#4ADE80',
    lightning: '#60A5FA',
    sunbeam: '#FDE047',
    void: '#A855F7',
    frontline: '#F59E0B',
    midline: '#38BDF8',
    backline: '#EC4899',
    sanctuary: '#22C55E',
  };

  let accentHex = '#38BDF8';
  for (const [k, hex] of Object.entries(paletteMap)) {
    if (refId.includes(k)) {
      accentHex = hex;
      break;
    }
  }

  const coreMat = getPBRMaterial(accentHex, 0.14, 0.9, accentHex, 0.48);
  const goldMat = getPBRMaterial('#F59E0B', 0.2, 0.88, '#F59E0B', 0.18);
  const obsidianMat = getPBRMaterial('#1E293B', 0.35, 0.78);

  if (refId.startsWith('ballistic_')) {
    const plinth = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.35, 0.28, 24), obsidianMat);
    plinth.position.y = 0.14;
    bodyPivot.add(plinth);

    const projectileGroup = new THREE.Group();
    projectileGroup.position.y = 1.55;
    projectileGroup.name = 'weaponArm';
    bodyPivot.add(projectileGroup);

    const warhead = new THREE.Mesh(new THREE.ConeGeometry(0.45, 1.45, 24), coreMat);
    warhead.rotation.x = Math.PI / 2;
    warhead.position.z = 0.35;
    projectileGroup.add(warhead);

    const fusel = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.24, 1.2, 24), goldMat);
    fusel.rotation.x = Math.PI / 2;
    fusel.position.z = -0.35;
    projectileGroup.add(fusel);

    for (let i = 0; i < 4; i++) {
      const a = (Math.PI * 2 * i) / 4 + Math.PI / 4;
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.55, 0.48), coreMat);
      fin.position.set(Math.cos(a) * 0.36, Math.sin(a) * 0.36, -0.65);
      fin.rotation.z = a;
      projectileGroup.add(fin);
    }

    const wakeRing = new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.055, 16, 48), coreMat);
    wakeRing.position.z = -0.55;
    projectileGroup.add(wakeRing);

    const tailOrb = new THREE.Mesh(new THREE.OctahedronGeometry(0.34, 0), goldMat);
    tailOrb.position.z = -1.05;
    projectileGroup.add(tailOrb);

    return sculptAndSmoothAssetGroup(root);
  }

  if (refId.startsWith('spirit_familiar_')) {
    const dais = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.38, 0.26, 24), obsidianMat);
    dais.position.y = 0.13;
    bodyPivot.add(dais);

    const spiritCore = new THREE.Group();
    spiritCore.position.y = 1.68;
    spiritCore.name = 'weaponArm';
    bodyPivot.add(spiritCore);

    const bodyGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.56, 0), coreMat);
    spiritCore.add(bodyGem);

    const crownHalo = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.05, 16, 48), goldMat);
    crownHalo.rotation.x = Math.PI / 2;
    crownHalo.position.y = 0.48;
    spiritCore.add(crownHalo);

    for (const side of [-1, 1]) {
      const wing = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.42, 0.14), goldMat);
      wing.position.set(side * 0.72, 0.18, -0.1);
      wing.rotation.z = side * 0.35;
      spiritCore.add(wing);

      const feather = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.65, 24), coreMat);
      feather.position.set(side * 0.96, -0.12, -0.12);
      feather.rotation.z = side * 0.65;
      spiritCore.add(feather);
    }

    for (let i = 0; i < 3; i++) {
      const a = (Math.PI * 2 * i) / 3;
      const wisp = new THREE.Mesh(new THREE.OctahedronGeometry(0.2, 0), coreMat);
      wisp.position.set(Math.cos(a) * 0.92, -0.45, Math.sin(a) * 0.92);
      spiritCore.add(wisp);
    }

    return sculptAndSmoothAssetGroup(root);
  }

  const basePlinth = new THREE.Mesh(new THREE.CylinderGeometry(1.38, 1.62, 0.36, 24), obsidianMat);
  basePlinth.position.y = 0.18;
  bodyPivot.add(basePlinth);

  const column = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.62, 1.75, 24), obsidianMat);
  column.position.y = 1.15;
  bodyPivot.add(column);

  const resonator = new THREE.Mesh(new THREE.OctahedronGeometry(0.62, 0), coreMat);
  resonator.position.y = 2.38;
  resonator.name = 'weaponArm';
  bodyPivot.add(resonator);

  const ringA = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.055, 16, 48), goldMat);
  ringA.rotation.x = Math.PI / 3;
  ringA.position.y = 2.38;
  bodyPivot.add(ringA);

  const ringB = new THREE.Mesh(new THREE.TorusGeometry(1.22, 0.045, 16, 48), coreMat);
  ringB.rotation.y = Math.PI / 3;
  ringB.position.y = 2.38;
  bodyPivot.add(ringB);

  for (let i = 0; i < 4; i++) {
    const a = (Math.PI * 2 * i) / 4 + Math.PI / 4;
    const rib = new THREE.Mesh(new THREE.ConeGeometry(0.18, 1.15, 24), goldMat);
    rib.position.set(Math.cos(a) * 0.95, 1.05, Math.sin(a) * 0.95);
    bodyPivot.add(rib);
  }

  return sculptAndSmoothAssetGroup(root);
}

// ============================================================================
// BATCH 24: CITADEL SUPERWEAPONS, SOVEREIGN HALOS & APEX #420 (30 MODELS)
// ============================================================================
export function createCitadelSuperweaponOrApex420Model(
  refId = 'citadel_superweapon_inferno'
): THREE.Group {
  const root = new THREE.Group();
  root.name = `CitadelSuperweaponOrApex420_${refId}`;
  addContactShadow(root, 1.95);

  const bodyPivot = new THREE.Group();
  bodyPivot.name = 'bodyPivot';
  root.add(bodyPivot);

  const isApex420 = refId.includes('420');
  const paletteMap: Record<string, string> = {
    inferno: '#F97316',
    undead: '#A855F7',
    nature: '#22C55E',
    mechanic: '#38BDF8',
    abyss: '#06B6D4',
    wild: '#EAB308',
    divine: '#FDE047',
    arcane: '#EC4899',
    solar: '#F59E0B',
    void: '#A855F7',
    emerald: '#22C55E',
    chrono: '#38BDF8',
    necrotic: '#C084FC',
    primal: '#EAB308',
    seraphic: '#FEF08A',
    astral: '#EC4899',
  };

  let primaryHex = isApex420 ? '#38BDF8' : '#F59E0B';
  for (const [k, hex] of Object.entries(paletteMap)) {
    if (refId.includes(k)) {
      primaryHex = hex;
      break;
    }
  }

  const primaryMat = getPBRMaterial(primaryHex, 0.14, 0.92, primaryHex, isApex420 ? 0.56 : 0.42);
  const goldMat = getPBRMaterial('#F59E0B', 0.18, 0.9, '#F59E0B', 0.24);
  const darkMat = getPBRMaterial('#0F172A', 0.35, 0.82);

  if (refId.startsWith('citadel_superweapon_')) {
    const bastionBase = new THREE.Mesh(new THREE.CylinderGeometry(1.58, 1.85, 0.45, 24), darkMat);
    bastionBase.position.y = 0.22;
    bodyPivot.add(bastionBase);

    const turretRing = new THREE.Mesh(new THREE.TorusGeometry(1.45, 0.065, 16, 48), goldMat);
    turretRing.rotation.x = Math.PI / 2;
    turretRing.position.y = 0.46;
    bodyPivot.add(turretRing);

    const turretHead = new THREE.Group();
    turretHead.position.y = 1.25;
    turretHead.name = 'weaponArm';
    bodyPivot.add(turretHead);

    const coreHousing = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.95, 1.35), darkMat);
    turretHead.add(coreHousing);

    for (const side of [-1, 1]) {
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 1.85, 24), goldMat);
      barrel.rotation.x = Math.PI / 3;
      barrel.position.set(side * 0.46, 0.35, 0.72);
      turretHead.add(barrel);

      const coil = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.055, 16, 48), primaryMat);
      coil.rotation.x = Math.PI / 3;
      coil.position.set(side * 0.46, 0.55, 0.98);
      turretHead.add(coil);
    }

    const reactorOrb = new THREE.Mesh(new THREE.OctahedronGeometry(0.55, 0), primaryMat);
    reactorOrb.position.set(0, 0.72, -0.15);
    turretHead.add(reactorOrb);

    return sculptAndSmoothAssetGroup(root);
  }

  if (refId.startsWith('king_ascension_')) {
    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(1.32, 1.55, 0.34, 24), darkMat);
    pedestal.position.y = 0.17;
    bodyPivot.add(pedestal);

    const regaliaGroup = new THREE.Group();
    regaliaGroup.position.y = 1.75;
    regaliaGroup.name = 'weaponArm';
    bodyPivot.add(regaliaGroup);

    const centerCrest = new THREE.Mesh(new THREE.OctahedronGeometry(0.62, 0), primaryMat);
    regaliaGroup.add(centerCrest);

    const sovereignHalo = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.06, 16, 48), goldMat);
    regaliaGroup.add(sovereignHalo);

    for (const side of [-1, 1]) {
      for (let tier = 0; tier < 3; tier++) {
        const pinion = new THREE.Mesh(
          new THREE.ConeGeometry(0.22, 1.35 - tier * 0.2, 24),
          tier % 2 === 0 ? primaryMat : goldMat
        );
        pinion.position.set(side * (0.78 + tier * 0.34), 0.35 - tier * 0.28, -0.12);
        pinion.rotation.z = -side * (0.45 + tier * 0.24);
        regaliaGroup.add(pinion);
      }
    }

    return sculptAndSmoothAssetGroup(root);
  }

  const grandPlinth = new THREE.Mesh(
    new THREE.CylinderGeometry(isApex420 ? 1.95 : 1.55, isApex420 ? 2.25 : 1.82, 0.46, 24),
    darkMat
  );
  grandPlinth.position.y = 0.23;
  bodyPivot.add(grandPlinth);

  const baseHalo = new THREE.Mesh(
    new THREE.TorusGeometry(isApex420 ? 1.88 : 1.52, 0.065, 16, 48),
    goldMat
  );
  baseHalo.rotation.x = Math.PI / 2;
  baseHalo.position.y = 0.46;
  bodyPivot.add(baseHalo);

  const centralSpire = new THREE.Mesh(
    new THREE.CylinderGeometry(0.58, 0.82, isApex420 ? 2.15 : 1.75, 24),
    darkMat
  );
  centralSpire.position.y = 1.35;
  bodyPivot.add(centralSpire);

  const apexStar = new THREE.Mesh(
    new THREE.OctahedronGeometry(isApex420 ? 0.92 : 0.68, 0),
    primaryMat
  );
  apexStar.position.y = isApex420 ? 2.82 : 2.45;
  apexStar.name = 'weaponArm';
  bodyPivot.add(apexStar);

  const gyroA = new THREE.Mesh(
    new THREE.TorusGeometry(isApex420 ? 1.48 : 1.18, 0.055, 16, 48),
    goldMat
  );
  gyroA.rotation.x = Math.PI / 3;
  gyroA.position.y = isApex420 ? 2.82 : 2.45;
  bodyPivot.add(gyroA);

  const gyroB = new THREE.Mesh(
    new THREE.TorusGeometry(isApex420 ? 1.68 : 1.32, 0.05, 16, 48),
    primaryMat
  );
  gyroB.rotation.y = Math.PI / 3;
  gyroB.position.y = isApex420 ? 2.82 : 2.45;
  bodyPivot.add(gyroB);

  const pillarCount = isApex420 ? 8 : 4;
  for (let i = 0; i < pillarCount; i++) {
    const a = (Math.PI * 2 * i) / pillarCount;
    const r = isApex420 ? 1.52 : 1.22;
    const obelisk = new THREE.Mesh(
      new THREE.ConeGeometry(0.22, isApex420 ? 1.55 : 1.2, 24),
      i % 2 === 0 ? primaryMat : goldMat
    );
    obelisk.position.set(Math.cos(a) * r, 1.15, Math.sin(a) * r);
    bodyPivot.add(obelisk);
  }

  return sculptAndSmoothAssetGroup(root);
}

/**
 * Instantiates any of the 420 catalog items for the 3D Asset Forge & Batch Inspector.
 */
export function createCatalogAsset3D(item: AssetBatchItem): THREE.Group {
  switch (item.previewType) {
    case 'HERO_KING':
      return createHeroKing3DModel(item.refId === 'east' ? 1 : 0);
    case 'CITADEL_CORE':
      return createCitadel3DModel(0);
    case 'BREACH_GATE':
      return createBreachGate3DModel();
    case 'MYTHIUM_QUARRY':
      return createMythiumQuarry3DModel();
    case 'MYTHIUM_WORKER':
      return createMythiumWorker3DModel();
    case 'FIGHTER':
      return createFighter3DModel(item.refId ?? 'inf_magma_juggernaut');
    case 'MERCENARY':
      return createEnemyOrMerc3DModel({
        isMercenary: true,
        mercenaryId: item.refId ?? 'merc_siege_ram',
      });
    case 'BOSS':
      return createEnemyOrMerc3DModel({
        isBoss: true,
        bossId: item.refId,
      });
    case 'WAVE_ENEMY':
      return createWaveEnemy3DModel(item.waveNumber ?? 1);
    case 'LEGION_SPELL':
      return createLegionSpell3DModel(item.refId);
    case 'BATTLEFIELD_PROP':
      return createBattlefieldProp3DModel(item.refId);
    case 'FACTION_SANCTUM':
      return createFactionSanctum3DModel(item.refId);
    case 'KING_SKILL_UPGRADE':
      return createKingSkillOrUpgrade3DModel(item.refId);
    case 'TACTICAL_ORDNANCE':
      return createTacticalOrdnance3DModel(item.refId);
    case 'FIGHTER_ABILITY':
      return createFighterAbility3DModel(item.refId);
    case 'SYNERGY_STATUS':
      return createSynergyOrStatus3DModel(item.refId);
    case 'CAMPAIGN_COMMANDER':
      return createCampaignOrCommander3DModel(item.refId);
    case 'COUNTER_MATRIX_ROLE':
      return createCounterMatrixOrRole3DModel(item.refId);
    case 'ECONOMY_FINALE':
      return createEconomyOrFinale3DModel(item.refId);
    case 'TIER2_ASCENSION':
      return createTier2AscensionOrWatchtower3DModel(item.refId);
    case 'ASTRAL_ANOMALY':
      return createAstralAnomalyOrPortal3DModel(item.refId);
    case 'CITADEL_ARMORY':
      return createCitadelArmoryOrRoyalRelic3DModel(item.refId);
    case 'WAR_MACHINE_CONVOY':
      return createWarMachineOrConvoyEngine3DModel(item.refId);
    case 'CELESTIAL_WONDER':
      return createCelestialWonderOrPantheon3DModel(item.refId);
    case 'WAR_BANNER_RADAR_FLAK':
      return createWarBannerRadarOrFlak3DModel(item.refId);
    case 'ELEMENTAL_TITAN_SOVEREIGN':
      return createElementalTitanOrSovereignAvatar3DModel(item.refId);
    case 'COMPANION_BALLISTIC':
      return createCompanionSpiritOrBallistic3DModel(item.refId);
    case 'CITADEL_SUPERWEAPON_420':
      return createCitadelSuperweaponOrApex420Model(item.refId);
    case 'SKILL_VFX':
      return createSkillVfx3DShowcase(item.refId);
    case 'KING_RELIC':
    default:
      return createKingRelic3DShowcase(item.refId);
  }
}




