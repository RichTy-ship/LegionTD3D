import React, { useState } from 'react';
import {
  ECONOMY_CONFIG,
  FIGHTERS,
  FIGHTER_MAP,
  getWaveConfig,
  KING_ITEMS,
  KING_SKILLS,
  MERCENARIES,
  SPELL_MAP,
} from '../game/config';
import { getTypeMultiplier } from '../game/damage';
import { collectLootDrop, getActiveFactionSynergies, getSellRefundAmount } from '../game/engine';
import {
  AttackType,
  DefenseType,
  KingSkillKey,
  MatchState,
} from '../game/types';
import { sound } from '../game/audio';

interface BattleHUDProps {
  state: MatchState;
  selectedShopFighterId: string | null;
  onSelectShopFighter: (fighterId: string | null) => void;
  onQuickDeployFighter: (fighterId: string) => void;
  selectedPlacedInstanceId: string | null;
  onSelectPlacedFighter: (instanceId: string | null) => void;
  isMoveMode: boolean;
  onToggleMoveMode: () => void;
  onUpgradePlacedFighter: (instanceId: string, upgradeId: string) => void;
  onSellPlacedFighter: (instanceId: string) => void;
  onHireWorker: () => void;
  onQueueMercenary: (mercenaryId: string, count: number) => void;
  onUpgradeKing: (type: 'attack' | 'defense' | 'regen' | 'spell') => void;
  onCastKingSkill: (skillKey: KingSkillKey) => void;
  onBuyKingItem: (itemId: string) => void;
  onRushKingRespawn: () => void;
  onCastSpell: () => void;
  onSelectSpell: (spellId: string) => void;
  onLaunchWaveNow: () => void;
  onSetSimSpeed: (speed: 1 | 2 | 4) => void;
  onSwitchLane: (laneId: number) => void;
  onSaveMatch: () => void;
  onTogglePause: () => void;
  muted: boolean;
  onToggleMute: () => void;
  feedbackBanner: string | null;
  children?: React.ReactNode;
}

const ATTACK_TYPES: AttackType[] = ['Impact', 'Pierce', 'Magic', 'Siege', 'Pure'];
const DEFENSE_TYPES: DefenseType[] = ['Light', 'Medium', 'Heavy', 'Arcane', 'Massive'];

const ATK_SHORT: Record<AttackType, { icon: string; color: string }> = {
  Impact: { icon: '🔨', color: '#F59E0B' },
  Pierce: { icon: '🏹', color: '#10B981' },
  Magic: { icon: '🔮', color: '#38BDF8' },
  Siege: { icon: '💣', color: '#F97316' },
  Pure: { icon: '⚡', color: '#C084FC' },
};

const DEF_SHORT: Record<DefenseType, { label: string; color: string }> = {
  Light: { label: 'Swift', color: '#38BDF8' },
  Medium: { label: 'Natural', color: '#10B981' },
  Heavy: { label: 'Fortified', color: '#F59E0B' },
  Arcane: { label: 'Arcane', color: '#C084FC' },
  Massive: { label: 'Massive', color: '#F43F5E' },
};

const ROLE_ICON: Record<string, string> = {
  Tank: '🛡️',
  DPS: '⚔️',
  AoE: '🔥',
  Support: '✨',
  Aura: '👑',
  Carry: '🏹',
  Specialist: '🗡️',
};

const SHORT_LANE_NAMES: Record<number, string> = {
  0: 'You',
  1: 'Ally',
  2: 'Kael',
  3: 'Vex',
};

export const BattleHUD: React.FC<BattleHUDProps> = ({
  state,
  selectedShopFighterId,
  onSelectShopFighter,
  onQuickDeployFighter,
  selectedPlacedInstanceId,
  onSelectPlacedFighter,
  isMoveMode,
  onToggleMoveMode,
  onUpgradePlacedFighter,
  onSellPlacedFighter,
  onHireWorker,
  onQueueMercenary,
  onUpgradeKing,
  onCastKingSkill,
  onBuyKingItem,
  onRushKingRespawn,
  onCastSpell,
  onLaunchWaveNow,
  onSetSimSpeed,
  onSwitchLane,
  onSaveMatch,
  onTogglePause,
  muted,
  onToggleMute,
  feedbackBanner,
  children,
}) => {
  const [dockTab, setDockTab] = useState<'FIGHTERS' | 'MERCS' | 'CITADEL'>('FIGHTERS');
  const [showAllFactions, setShowAllFactions] = useState(true);
  // Single mutually-exclusive tactical drawer so panels NEVER overlap each other or the dock!
  const [activeDrawer, setActiveDrawer] = useState<'NONE' | 'WAVE' | 'MATRIX' | 'LOG'>('NONE');
  const [showScoreboard, setShowScoreboard] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(sound.musicEnabled);

  const playerLane = state.lanes[0];
  const viewedLane = state.lanes[state.activeViewedLaneId] ?? playerLane;
  const westKing = state.kings[0];
  const eastKing = state.kings[1];
  const currentWave = getWaveConfig(state.waveNumber);

  const westHpPct = Math.max(
    0,
    Math.min(100, Math.round((westKing.citadelHp / westKing.citadelMaxHp) * 100))
  );
  const eastHpPct = Math.max(
    0,
    Math.min(100, Math.round((eastKing.citadelHp / eastKing.citadelMaxHp) * 100))
  );

  const tier1Fighters = FIGHTERS.filter(
    (f) => f.tier === 1 && (showAllFactions || f.faction === playerLane.selectedFaction)
  ).sort((a, b) => {
    const aOwn = a.faction === playerLane.selectedFaction ? 0 : 1;
    const bOwn = b.faction === playerLane.selectedFaction ? 0 : 1;
    if (aOwn !== bOwn) return aOwn - bOwn;
    return a.cost - b.cost;
  });

  const selectedPlaced = viewedLane.placedFighters.find(
    (p) => p.instanceId === selectedPlacedInstanceId
  );
  const selectedPlacedCfg = selectedPlaced ? FIGHTER_MAP[selectedPlaced.fighterId] : null;

  const activeSynergies = getActiveFactionSynergies(playerLane);
  const equippedSpell = SPELL_MAP[playerLane.selectedSpellId];
  const mythiumProgressPct = Math.min(
    100,
    Math.round((state.mythiumTickTimer / ECONOMY_CONFIG.mythiumTickIntervalSeconds) * 100)
  );
  const valueDiff = playerLane.fighterValue - playerLane.recommendedValue;

  const maxPreviewWave = state.endlessMode ? state.waveNumber + 2 : 21;
  const upcomingWaves = [
    getWaveConfig(state.waveNumber),
    getWaveConfig(Math.min(maxPreviewWave, state.waveNumber + 1)),
    getWaveConfig(Math.min(maxPreviewWave, state.waveNumber + 2)),
  ].filter(Boolean);

  const toggleDrawer = (drawer: 'WAVE' | 'MATRIX' | 'LOG') => {
    sound.playUiClick();
    setActiveDrawer((prev) => (prev === drawer ? 'NONE' : drawer));
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#060B12] text-slate-100 select-none">
      {/* ==================== 100% FULL-SCREEN 3D BATTLEFIELD CANVAS ==================== */}
      <div className="absolute inset-0 z-0">{children}</div>

      {/* ==================== NON-OVERLAPPING FLOATING HUD LAYER ==================== */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* 1. TOP-CENTER COMPACT WAVE & CITADEL CREST (380px wide — zero collision on 900px screens) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto">
          {/* Mini Wave Strip + Speed Selector */}
          <div className="flex items-center gap-1 bg-[#0C161E]/95 border-x border-b border-[#26404F] px-2 py-0.5 rounded-b">
            {[
              state.waveNumber,
              Math.min(maxPreviewWave, state.waveNumber + 1),
              Math.min(maxPreviewWave, state.waveNumber + 2),
            ].map((wNum, idx) => {
              const wCfg = getWaveConfig(wNum);
              const isCurr = idx === 0;
              return (
                <div
                  key={`${wNum}-${idx}`}
                  title={`Wave ${wNum}: ${wCfg.name} (${wCfg.attackType} / ${wCfg.defenseType})`}
                  className={`px-1.5 py-0.2 rounded text-[9px] font-mono flex items-center gap-0.5 border ${
                    isCurr
                      ? 'bg-[#1B3342] border-[#EAB308] text-white font-bold'
                      : 'bg-[#091118] border-[#1E3240] text-slate-400'
                  }`}
                >
                  <span>{ATK_SHORT[wCfg.attackType].icon}</span>
                  <span>W{wNum}</span>
                </div>
              );
            })}

            {state.endlessMode && (
              <span
                data-testid="endless-mode-badge"
                className="px-1.5 py-0.2 rounded bg-purple-600/30 border border-purple-400/70 text-[8px] font-mono font-bold text-purple-200 uppercase"
              >
                ∞ ENDLESS
              </span>
            )}

            <div className="h-3 w-px bg-[#26404F] mx-0.5" />

            {([1, 2, 4] as const).map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => {
                  sound.playUiClick();
                  onSetSimSpeed(spd);
                }}
                className={`px-1 py-0.2 rounded text-[9px] font-mono cursor-pointer ${
                  state.simSpeed === spd
                    ? 'bg-sky-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Main Beveled Crest (~385px wide) */}
          <div className="flex items-center bg-[#0F1C24]/95 border border-[#2C4858] rounded-b-lg shadow-[0_8px_24px_rgba(0,0,0,0.75)] px-2 py-1 gap-2">
            {/* West Citadel & King */}
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded bg-amber-500/20 border border-amber-400/70 flex items-center justify-center text-xs">
                👑
              </div>
              <div className="w-28">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold leading-none">
                  <span className="text-emerald-300">{westHpPct}%</span>
                  <span data-testid="west-citadel-hp" className="text-slate-300 text-[9px]">
                    {Math.round(westKing.citadelHp)}/{westKing.citadelMaxHp}
                  </span>
                </div>
                <div className="w-full h-2 bg-[#081016] rounded-xs overflow-hidden border border-[#243B4A] mt-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-lime-400 transition-all duration-150"
                    style={{ width: `${westHpPct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[8px] font-mono mt-0.5 leading-none">
                  {westKing.isDead || westKing.status === 'FALLEN' ? (
                    <span data-testid="west-king-status" className="text-orange-400 font-bold">
                      FALLEN {westKing.respawnTimer.toFixed(0)}s
                    </span>
                  ) : (
                    <span data-testid="west-king-status" className="text-amber-300">
                      King {Math.round(westKing.hp)}
                    </span>
                  )}
                  <span className="text-emerald-400">+{westKing.healingAuraHps}/s</span>
                </div>
              </div>
            </div>

            {/* Center Keystone */}
            <div className="px-2.5 py-0.5 bg-[#0A131A] border border-[#345466] rounded text-center min-w-[116px]">
              <div className="text-xs font-extrabold font-display tracking-wider text-white leading-tight">
                WAVE {state.waveNumber}
              </div>
              <div className="flex items-center justify-center gap-1 mt-0.5">
                <span className="text-[9px] font-mono text-sky-300 font-bold">
                  {state.phase === 'BUILD'
                    ? `${Math.ceil(state.phaseTimer)}s`
                    : `${Math.floor(state.battleElapsedSeconds)}s`}
                </span>
                {state.phase === 'BUILD' ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.currentTarget.blur();
                      onLaunchWaveNow();
                    }}
                    className="px-1.5 py-0.2 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-[8px] uppercase cursor-pointer"
                  >
                    Launch [Space]
                  </button>
                ) : (
                  <span className="text-[8px] font-mono text-rose-400 uppercase font-bold">
                    BATTLE
                  </span>
                )}
              </div>
            </div>

            {/* East Citadel & King */}
            <div className="flex items-center gap-1.5">
              <div className="w-28 text-right">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold leading-none">
                  <span className="text-slate-300 text-[9px]">
                    {Math.round(eastKing.citadelHp)}/{eastKing.citadelMaxHp}
                  </span>
                  <span className="text-rose-400">{eastHpPct}%</span>
                </div>
                <div className="w-full h-2 bg-[#081016] rounded-xs overflow-hidden border border-[#243B4A] mt-0.5">
                  <div
                    className="h-full bg-gradient-to-l from-rose-500 to-orange-500 ml-auto transition-all duration-150"
                    style={{ width: `${eastHpPct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[8px] font-mono mt-0.5 leading-none text-slate-400">
                  <span className="truncate max-w-[68px]">{currentWave.name.split(' ')[0]}</span>
                  <span className="text-rose-300">
                    {eastKing.isDead
                      ? `${Math.ceil(eastKing.respawnTimer)}s`
                      : `K:${Math.round(eastKing.hp)}`}
                  </span>
                </div>
              </div>
              <div className="w-7 h-7 rounded bg-rose-500/20 border border-rose-400/70 flex items-center justify-center text-xs">
                💀
              </div>
            </div>
          </div>

          {/* Subtle Single-Line Phase Banner */}
          <div className="mt-1 px-4 py-0.2 border-y border-amber-400/35 bg-[#0A131C]/75 text-[10px] font-display font-bold tracking-widest text-amber-200 uppercase">
            {state.phase === 'BATTLE'
              ? `⚔ Battle · ${currentWave.name}`
              : `🛡 Build Phase · ${currentWave.name} (${currentWave.attackType}/${currentWave.defenseType})`}
          </div>
          {feedbackBanner && (
            <div className="mt-0.5 px-2 py-0.2 rounded bg-[#0E1B24]/90 border border-amber-400/40 text-[9px] font-mono text-amber-300">
              {feedbackBanner}
            </div>
          )}
          {(playerLane.lootDrops?.length ?? 0) > 0 && (
            <button
              type="button"
              data-testid="claim-loot-drops-btn"
              onClick={() => {
                sound.playUpgradeFighter();
                for (const d of [...(playerLane.lootDrops ?? [])]) {
                  collectLootDrop(state, 0, d.id);
                }
              }}
              className="mt-0.5 px-2.5 py-0.5 rounded bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-extrabold text-[9px] font-mono shadow-lg animate-pulse cursor-pointer"
            >
              🎁 Thu Thập Chiến Lợi Phẩm ({playerLane.lootDrops?.length})
            </button>
          )}
        </div>

        {/* 2. TOP-RIGHT COMPACT 4-LANE MINIMAP & SCOREBOARD */}
        <div className="absolute top-1.5 right-1.5 flex flex-col items-end gap-1.5 pointer-events-auto">
          {/* 4-Lane Switcher Minimap (~116px wide) */}
          <div className="bg-[#0C161E]/92 border border-[#243B4A] rounded p-1 shadow">
            <div className="text-[8px] font-mono uppercase text-slate-400 text-center mb-0.5">
              Lanes [1-4]
            </div>
            <div className="grid grid-cols-4 gap-1">
              {state.lanes.map((ln) => {
                const isSelected = state.activeViewedLaneId === ln.laneId;
                return (
                  <button
                    key={ln.laneId}
                    type="button"
                    onClick={() => {
                      sound.playUiClick();
                      onSwitchLane(ln.laneId);
                    }}
                    title={`${ln.name} (${ln.fighterValue}g · ${ln.workers} Workers)`}
                    className={`w-6 h-10 rounded-xs border flex flex-col items-center justify-between p-0.5 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#1D3545] border-amber-400'
                        : 'bg-[#091218] border-[#1F3442] hover:border-slate-500'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        ln.teamId === 0 ? 'bg-emerald-400' : 'bg-rose-400'
                      }`}
                    />
                    <span className="text-[8px] font-mono text-slate-200 font-bold leading-none">
                      {ln.placedFighters.length}
                    </span>
                    <span className="text-[8px] font-mono text-amber-300 leading-none">
                      {SHORT_LANE_NAMES[ln.laneId]?.[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Compact 4-Commander Scoreboard (Right Edge, 148px wide) */}
          {showScoreboard && (
            <div className="w-36 bg-[#0C161E]/88 backdrop-blur-xs border border-[#243B4A] rounded shadow overflow-hidden">
              {state.lanes.map((ln) => {
                const isCurrent = state.activeViewedLaneId === ln.laneId;
                const shortName = SHORT_LANE_NAMES[ln.laneId] ?? ln.name;
                const barPct = Math.min(
                  100,
                  Math.round(
                    (ln.fighterValue / Math.max(1, playerLane.recommendedValue * 1.25)) * 100
                  )
                );
                return (
                  <button
                    key={ln.laneId}
                    type="button"
                    onClick={() => {
                      sound.playUiClick();
                      onSwitchLane(ln.laneId);
                    }}
                    className={`w-full px-2 py-1 text-left border-b border-[#192B38] last:border-b-0 transition-colors cursor-pointer ${
                      isCurrent ? 'bg-[#1A3140]' : 'hover:bg-[#132430]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold leading-tight">
                      <span className={ln.teamId === 0 ? 'text-emerald-300' : 'text-rose-300'}>
                        [{ln.laneId + 1}] {shortName}
                      </span>
                      <span className="font-mono text-white">
                        {ln.fighterValue}g{' '}
                        <span className="text-[8px] text-slate-400">{ln.workers}W</span>
                      </span>
                    </div>
                    <div className="w-full h-1 bg-[#081016] rounded-full overflow-hidden mt-0.5">
                      <div
                        className={`h-full ${
                          ln.teamId === 0 ? 'bg-emerald-400' : 'bg-rose-400'
                        }`}
                        style={{ width: `${barPct}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. SINGLE MUTUALLY-EXCLUSIVE TACTICAL POPOVER DRAWER (Opens cleanly at bottom-28 right-10, NEVER overlapping the dock!) */}
        {activeDrawer !== 'NONE' && (
          <div className="absolute bottom-28 right-10 z-30 bg-[#0D1922]/96 backdrop-blur-md border border-[#2D4A5A] rounded-lg shadow-2xl overflow-hidden pointer-events-auto">
            {activeDrawer === 'WAVE' && (
              <div className="w-[270px]">
                <div className="px-2.5 py-1 bg-[#142530] border-b border-[#284252] flex items-center justify-between text-[11px] font-bold text-slate-200">
                  <span>📖 Wave Info (W{state.waveNumber}–W{Math.min(21, state.waveNumber + 2)})</span>
                  <button
                    type="button"
                    onClick={() => setActiveDrawer('NONE')}
                    className="px-1 text-slate-400 hover:text-white text-[10px] cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
                <table className="w-full text-left border-collapse font-mono text-[10px]">
                  <thead>
                    <tr className="border-b border-[#1E3240] text-[9px] text-amber-400">
                      <th className="py-1 px-2">Wave</th>
                      <th className="py-1 px-1">Types</th>
                      <th className="py-1 px-1">Counter</th>
                      <th className="py-1 px-1.5">Rec.Val</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingWaves.map((w) => {
                      const isCurrent = w.waveNumber === state.waveNumber;
                      const bestAtk =
                        ATTACK_TYPES.find((a) => getTypeMultiplier(a, w.defenseType) >= 1.15) ??
                        'Pure';
                      return (
                        <tr
                          key={w.waveNumber}
                          className={`border-b border-[#172834] last:border-b-0 ${
                            isCurrent ? 'bg-[#172D3B] text-white font-bold' : 'text-slate-300'
                          }`}
                        >
                          <td className="py-1 px-2 text-amber-300">W{w.waveNumber}</td>
                          <td className="py-1 px-1">
                            {ATK_SHORT[w.attackType].icon} {DEF_SHORT[w.defenseType].label}
                          </td>
                          <td className="py-1 px-1 text-emerald-400">
                            {ATK_SHORT[bestAtk].icon} {bestAtk}
                          </td>
                          <td className="py-1 px-1.5 text-amber-200">
                            {w.waveNumber === state.waveNumber
                              ? playerLane.recommendedValue
                              : Math.round(
                                  playerLane.recommendedValue *
                                    (1 + (w.waveNumber - state.waveNumber) * 0.28)
                                )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {activeDrawer === 'MATRIX' && (
              <div className="w-[290px]">
                <div className="px-2.5 py-1 bg-[#142530] border-b border-[#284252] flex items-center justify-between text-[11px] font-bold text-slate-200">
                  <span>⚔️ Attack Effectiveness Matrix</span>
                  <button
                    type="button"
                    onClick={() => setActiveDrawer('NONE')}
                    className="px-1 text-slate-400 hover:text-white text-[10px] cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-1.5 font-mono text-[9px]">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="p-1 text-left text-slate-400">ATK \ DEF</th>
                        {DEFENSE_TYPES.map((def) => (
                          <th
                            key={def}
                            className={`px-1 py-0.5 text-center ${
                              currentWave.defenseType === def
                                ? 'text-amber-300 underline'
                                : 'text-slate-300'
                            }`}
                          >
                            {DEF_SHORT[def].label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {ATTACK_TYPES.map((atk) => (
                        <tr key={atk} className="border-t border-[#1A2D3B]">
                          <td className="pr-1.5 py-0.5 font-bold text-slate-200">
                            {ATK_SHORT[atk].icon} {atk}
                          </td>
                          {DEFENSE_TYPES.map((def) => {
                            const mult = getTypeMultiplier(atk, def);
                            const diffPct = Math.round((mult - 1) * 100);
                            const label =
                              diffPct > 0 ? `+${diffPct}%` : diffPct < 0 ? `${diffPct}%` : '0%';
                            const colorCls =
                              diffPct >= 15
                                ? 'text-emerald-400 font-bold'
                                : diffPct > 0
                                ? 'text-emerald-300'
                                : diffPct <= -15
                                ? 'text-rose-400 font-bold'
                                : diffPct < 0
                                ? 'text-orange-300'
                                : 'text-slate-500';
                            return (
                              <td key={def} className={`px-1 py-0.5 text-center ${colorCls}`}>
                                {label}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeDrawer === 'LOG' && (
              <div className="w-[260px]">
                <div className="px-2.5 py-1 bg-[#142530] border-b border-[#284252] flex items-center justify-between text-[11px] font-bold text-slate-200">
                  <span>🛡 Combat Telemetry</span>
                  <button
                    type="button"
                    onClick={() => setActiveDrawer('NONE')}
                    className="px-1 text-slate-400 hover:text-white text-[10px] cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-2 space-y-1 font-mono text-[10px]">
                  {state.lastWaveResult && (
                    <div className="text-emerald-300 border-b border-[#1E3240] pb-1">
                      W{state.lastWaveResult.waveNumber}:{' '}
                      {state.lastWaveResult.laneSummaries[0]?.cleared
                        ? 'CLEARED'
                        : `${state.lastWaveResult.laneSummaries[0]?.leakedCount} Leaked`}{' '}
                      (+{state.lastWaveResult.laneSummaries[0]?.goldEarned}g)
                    </div>
                  )}
                  {state.combatLogs.slice(0, 4).map((log, i) => (
                    <div key={i} className="text-slate-300 leading-snug">
                      • {log}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. BOTTOM-RIGHT VERTICAL UTILITY ICON BAR (Far Right Corner, 32px wide) */}
        <div className="absolute bottom-1.5 right-1.5 flex flex-col gap-1 bg-[#0C161E]/94 border border-[#26404F] p-1 rounded shadow-lg pointer-events-auto">
          <button
            type="button"
            onClick={() => {
              sound.playUiClick();
              setShowScoreboard((s) => !s);
            }}
            title="Toggle Scoreboard"
            className={`w-6 h-6 rounded flex items-center justify-center text-[11px] cursor-pointer ${
              showScoreboard ? 'bg-[#1E394A] text-amber-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            📊
          </button>
          <button
            type="button"
            onClick={() => toggleDrawer('WAVE')}
            title="Toggle Wave Info Table"
            className={`w-6 h-6 rounded flex items-center justify-center text-[11px] cursor-pointer ${
              activeDrawer === 'WAVE'
                ? 'bg-[#1E394A] text-amber-300'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📖
          </button>
          <button
            type="button"
            onClick={() => toggleDrawer('MATRIX')}
            title="Toggle Attack Effectiveness Matrix"
            className={`w-6 h-6 rounded flex items-center justify-center text-[11px] cursor-pointer ${
              activeDrawer === 'MATRIX'
                ? 'bg-[#1E394A] text-amber-300'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚔️
          </button>
          <button
            type="button"
            onClick={() => toggleDrawer('LOG')}
            title="Toggle Combat Log"
            className={`w-6 h-6 rounded flex items-center justify-center text-[11px] cursor-pointer ${
              activeDrawer === 'LOG'
                ? 'bg-[#1E394A] text-amber-300'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🛡️
          </button>
          <button
            type="button"
            onClick={() => {
              const next = sound.toggleMusic();
              setMusicEnabled(next);
              sound.playUiClick();
            }}
            title="Bật / Tắt Nhạc nền"
            className={`w-6 h-6 rounded flex items-center justify-center text-[11px] cursor-pointer ${
              musicEnabled && !muted
                ? 'bg-[#1E394A] text-amber-300'
                : 'text-slate-500 hover:text-white'
            }`}
          >
            ♪
          </button>
          <button
            type="button"
            aria-label={muted ? 'Unmute Audio' : 'Mute Audio'}
            onClick={onToggleMute}
            title="Mute / Unmute Audio [M]"
            className="w-6 h-6 rounded flex items-center justify-center text-[11px] text-slate-300 hover:bg-[#1E394A] cursor-pointer"
          >
            {muted ? '🔇' : '🔊'}
          </button>
          <button
            type="button"
            aria-label="Save Match"
            onClick={() => {
              sound.playUiClick();
              onSaveMatch();
            }}
            title="Save Match"
            className="w-6 h-6 rounded flex items-center justify-center text-[11px] text-slate-300 hover:bg-[#1E394A] cursor-pointer"
          >
            💾
          </button>
          <button
            type="button"
            aria-label="Pause Game"
            onClick={() => {
              sound.playUiClick();
              onTogglePause();
            }}
            title="Pause / Audio Mixer Settings [P]"
            className="w-6 h-6 rounded bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-[11px] text-amber-300 hover:bg-amber-500/30 cursor-pointer"
          >
            ⚙️
          </button>
        </div>

        {/* 5. BOTTOM-CENTER UNIFIED LEGION TD 2 COMMAND DOCK (~630px total width — fits 900px screens with zero overlap!) */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto">
          {/* Selected Placed Unit Floating Evolution Strip */}
          {selectedPlaced && selectedPlacedCfg && (
            <div className="mb-1 px-2.5 py-1 rounded bg-[#0F1E28]/96 border border-amber-400/70 shadow-xl flex items-center gap-2.5">
              <div>
                <span className="text-[11px] font-extrabold text-amber-300">
                  {selectedPlacedCfg.name} (T{selectedPlacedCfg.tier})
                </span>
                <span className="text-[10px] font-mono text-slate-300 ml-2">
                  HP {selectedPlacedCfg.hp} · DMG {selectedPlacedCfg.attackDamage} · Kills{' '}
                  {selectedPlaced.kills}
                </span>
              </div>

              {viewedLane.isHuman && state.phase === 'BUILD' && (
                <div className="flex items-center gap-1">
                  {selectedPlacedCfg.upgradePaths.map((upgId) => {
                    const upg = FIGHTER_MAP[upgId];
                    if (!upg) return null;
                    const canAfford = playerLane.gold >= upg.cost;
                    const isApex = upg.tier === 3;
                    return (
                      <button
                        key={upg.id}
                        type="button"
                        data-testid={`evolve-to-${upg.id}`}
                        disabled={!canAfford}
                        onClick={() => onUpgradePlacedFighter(selectedPlaced.instanceId, upg.id)}
                        className={`px-2 py-0.5 rounded disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-extrabold text-[10px] cursor-pointer ${
                          isApex
                            ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 hover:brightness-110 shadow-[0_0_12px_rgba(251,191,36,0.5)]'
                            : 'bg-amber-500 hover:bg-amber-400'
                        }`}
                      >
                        {isApex ? '👑 Tiến Hóa T3: ' : 'Evolve: '}
                        {upg.name} ({upg.cost}g)
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => {
                      sound.playUiClick();
                      onToggleMoveMode();
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border cursor-pointer ${
                      isMoveMode
                        ? 'bg-sky-500 text-slate-950 border-sky-300'
                        : 'bg-[#162936] text-slate-200 border-[#2C4A5C]'
                    }`}
                  >
                    {isMoveMode ? 'Click Tile' : 'Move [M]'}
                  </button>
                  <button
                    type="button"
                    onClick={() => onSellPlacedFighter(selectedPlaced.instanceId)}
                    className="px-2 py-0.5 rounded bg-rose-950/90 hover:bg-rose-900 text-rose-200 border border-rose-700/60 text-[10px] font-bold cursor-pointer"
                  >
                    Sell (+{getSellRefundAmount(state, selectedPlaced)}g)
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => onSelectPlacedFighter(null)}
                className="text-slate-400 hover:text-white text-[11px] px-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Main Compact Dock Row */}
          <div className="flex items-end">
            {/* Left Vertical 3-Skill Column */}
            <div className="flex flex-col gap-0.5 bg-[#0E1B24]/96 border border-r-0 border-[#2B4758] p-1 rounded-tl-md">
              {Object.values(KING_SKILLS).map((sk) => {
                const cd = westKing.skillCooldowns[sk.key] ?? 0;
                const isReady = !westKing.isDead && cd <= 0;
                const icon = sk.key === 'Q' ? '⚔️' : sk.key === 'E' ? '🛡️' : '☄️';
                return (
                  <button
                    key={sk.key}
                    type="button"
                    data-testid={`king-skill-${sk.key}`}
                    disabled={!isReady}
                    onClick={(e) => {
                      e.currentTarget.blur();
                      onCastKingSkill(sk.key);
                    }}
                    title={`${sk.name}: ${sk.description}`}
                    className={`w-8 h-7 rounded-xs border flex flex-col items-center justify-center transition-all cursor-pointer ${
                      isReady
                        ? 'bg-gradient-to-b from-[#1C3342] to-[#0E1B24] border-amber-400/80 hover:border-amber-300 text-white'
                        : 'bg-[#091218] border-[#1E3240] text-slate-500 opacity-70'
                    }`}
                  >
                    <span className="text-[10px] leading-none">{icon}</span>
                    <span className="text-[8px] font-mono font-bold text-amber-300 leading-none">
                      {cd > 0 ? `${cd.toFixed(0)}s` : sk.key}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Center Beveled Action Bar */}
            <div className="flex flex-col">
              {/* Top Trapezoid Switcher Tabs */}
              <div className="flex items-center px-2 gap-1">
                <button
                  type="button"
                  onClick={() => {
                    sound.playUiClick();
                    setDockTab('FIGHTERS');
                  }}
                  className={`flex-1 py-0.5 px-3 rounded-t-md border-t border-x text-[11px] font-extrabold tracking-wide flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    dockTab === 'FIGHTERS'
                      ? 'bg-gradient-to-b from-[#256D9B] to-[#174969] border-sky-300 text-white'
                      : 'bg-[#101F29]/90 border-[#263F4E] text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🛡️</span>
                  <span>Fighters ({tier1Fighters.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playUiClick();
                    setDockTab('MERCS');
                  }}
                  className={`flex-1 py-0.5 px-3 rounded-t-md border-t border-x text-[11px] font-extrabold tracking-wide flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    dockTab === 'MERCS'
                      ? 'bg-gradient-to-b from-[#B83B2A] to-[#7D2418] border-orange-300 text-white'
                      : 'bg-[#101F29]/90 border-[#263F4E] text-slate-400 hover:text-white'
                  }`}
                >
                  <span>⚔️</span>
                  <span>Mercs ({MERCENARIES.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playUiClick();
                    setDockTab('CITADEL');
                  }}
                  className={`py-0.5 px-3 rounded-t-md border-t border-x text-[11px] font-extrabold tracking-wide flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    dockTab === 'CITADEL'
                      ? 'bg-gradient-to-b from-[#C2861B] to-[#7C530D] border-amber-300 text-slate-950'
                      : 'bg-[#101F29]/90 border-[#263F4E] text-slate-400 hover:text-white'
                  }`}
                >
                  <span>👑</span>
                  <span>Citadel</span>
                </button>
              </div>

              {/* Compact Portrait Card Tray (h-[74px]) */}
              <div className="h-[74px] bg-[#0D1922]/96 border border-[#2D4A5A] px-2 py-1 flex items-center gap-1 shadow-2xl">
                {dockTab === 'FIGHTERS' && (
                  <>
                    <div className="flex items-center gap-1 max-w-[366px] overflow-x-auto pb-0.5">
                      {tier1Fighters.map((fighter) => {
                        const isSelected = selectedShopFighterId === fighter.id;
                        const canAfford =
                          playerLane.gold >= fighter.cost && state.phase === 'BUILD';
                        const counterMult = getTypeMultiplier(
                          fighter.attackType,
                          currentWave.defenseType
                        );
                        const isCounter = counterMult >= 1.15;

                        return (
                          <div
                            key={fighter.id}
                            onClick={() => {
                              sound.playUiClick();
                              onSelectShopFighter(isSelected ? null : fighter.id);
                            }}
                            onDoubleClick={() => {
                              if (canAfford) onQuickDeployFighter(fighter.id);
                            }}
                            title={`${fighter.name} (${fighter.cost}g) · ${fighter.role} · ${fighter.attackType}/${fighter.defenseType}`}
                            className={`w-[56px] h-[60px] shrink-0 rounded-xs border flex flex-col justify-between p-1 cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-[#263F52] border-amber-400'
                                : isCounter
                                ? 'bg-[#132924] border-emerald-400/70 hover:border-emerald-300'
                                : 'bg-[#12222E] border-[#284252] hover:border-slate-400'
                            } ${!canAfford ? 'opacity-50' : ''}`}
                          >
                            <div className="flex items-center justify-between text-[8px] font-mono">
                              <span>{ATK_SHORT[fighter.attackType].icon}</span>
                              <button
                                type="button"
                                disabled={!canAfford}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onQuickDeployFighter(fighter.id);
                                }}
                                title="Quick Deploy"
                                className="px-1 rounded-xs bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 text-slate-950 font-extrabold text-[8px] cursor-pointer"
                              >
                                +
                              </button>
                            </div>

                            <div className="text-center text-sm leading-none">
                              {ROLE_ICON[fighter.role] ?? '🛡️'}
                            </div>

                            <div className="text-center">
                              <div className="text-[8px] font-bold text-white truncate leading-tight">
                                {fighter.name.split(' ').pop()}
                              </div>
                              <div className="text-[8px] font-mono font-bold text-amber-300 leading-none">
                                {fighter.cost}g
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="h-12 w-px bg-[#284252] mx-0.5" />

                    {/* Hire Worker Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.currentTarget.blur();
                        onHireWorker();
                      }}
                      disabled={
                        playerLane.gold < ECONOMY_CONFIG.workerGoldCost ||
                        playerLane.workers >= ECONOMY_CONFIG.maxWorkers
                      }
                      title={`Hire Mythium Worker [H] (${ECONOMY_CONFIG.workerGoldCost}g)`}
                      className="w-[50px] h-[60px] shrink-0 rounded-xs bg-gradient-to-b from-[#1D3546] to-[#11212C] hover:from-[#26465C] disabled:opacity-40 border border-amber-400/60 flex flex-col items-center justify-between p-1 cursor-pointer"
                    >
                      <span className="text-[8px] font-mono font-bold text-sky-300">+1 [H]</span>
                      <span className="text-sm leading-none">⛏️</span>
                      <span className="text-[9px] font-mono font-extrabold text-amber-300">
                        {ECONOMY_CONFIG.workerGoldCost}g
                      </span>
                    </button>

                    {/* Faction / All Toggle */}
                    <button
                      type="button"
                      onClick={() => {
                        sound.playUiClick();
                        setShowAllFactions((s) => !s);
                      }}
                      className={`w-[44px] h-[60px] shrink-0 rounded-xs border flex flex-col items-center justify-between p-1 cursor-pointer ${
                        showAllFactions
                          ? 'bg-[#253D4E] border-amber-400 text-amber-300'
                          : 'bg-[#12222E] border-[#284252] text-slate-300'
                      }`}
                    >
                      <span className="text-[7px] font-mono uppercase">Legion</span>
                      <span className="text-sm leading-none">🎲</span>
                      <span className="text-[8px] font-bold truncate w-full text-center">
                        {showAllFactions ? 'All 8' : playerLane.selectedFaction.slice(0, 4)}
                      </span>
                    </button>
                  </>
                )}

                {dockTab === 'MERCS' && (
                  <div className="flex items-center gap-1 max-w-[468px] overflow-x-auto pb-0.5">
                    {MERCENARIES.map((merc) => {
                      const canAfford = playerLane.mythium >= merc.mythiumCost;
                      const queued =
                        playerLane.outboundMercenaries.find((q) => q.mercenaryId === merc.id)
                          ?.count ?? 0;
                      return (
                        <button
                          key={merc.id}
                          type="button"
                          disabled={!canAfford}
                          onClick={() => onQueueMercenary(merc.id, 1)}
                          title={`${merc.name} (${merc.mythiumCost}M · +${merc.incomeBonus}g Income)`}
                          className={`w-[56px] h-[60px] shrink-0 rounded-xs border flex flex-col justify-between p-1 cursor-pointer transition-all ${
                            canAfford
                              ? 'bg-[#241628] border-purple-400/70 hover:border-purple-300'
                              : 'bg-[#121922] border-[#243644] opacity-50'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full text-[8px] font-mono">
                            <span className="text-emerald-400">+{merc.incomeBonus}g</span>
                            {queued > 0 && (
                              <span className="px-0.5 rounded-xs bg-purple-500 text-slate-950 font-bold">
                                x{queued}
                              </span>
                            )}
                          </div>
                          <div className="text-sm leading-none">👹</div>
                          <div className="w-full text-center">
                            <div className="text-[8px] font-bold text-white truncate">
                              {merc.name.split(' ').pop()}
                            </div>
                            <div className="text-[8px] font-mono font-bold text-purple-300">
                              {merc.mythiumCost}M
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {dockTab === 'CITADEL' && (
                  <div className="flex items-center gap-1 max-w-[468px] overflow-x-auto pb-0.5">
                    {equippedSpell && (
                      <button
                        type="button"
                        disabled={
                          playerLane.spellUsesRemaining <= 0 ||
                          playerLane.spellCooldownWaves > 0
                        }
                        onClick={onCastSpell}
                        title={`${equippedSpell.name} [F]: ${equippedSpell.description}`}
                        className="w-[58px] h-[60px] shrink-0 rounded-xs bg-[#142B3B] border border-sky-400 flex flex-col items-center justify-between p-1 cursor-pointer disabled:opacity-40"
                      >
                        <span className="text-[7px] font-mono text-sky-300">SPELL [F]</span>
                        <span className="text-sm leading-none">✨</span>
                        <span className="text-[8px] font-bold text-white truncate w-full text-center">
                          {equippedSpell.name.split(' ')[0]}
                        </span>
                      </button>
                    )}

                    {(
                      [
                        { type: 'attack', icon: '🗡️', lv: westKing.attackUpgradeLevel },
                        { type: 'defense', icon: '🏰', lv: westKing.defenseUpgradeLevel },
                        { type: 'regen', icon: '💚', lv: westKing.regenUpgradeLevel },
                        { type: 'spell', icon: '🔮', lv: westKing.spellUpgradeLevel },
                      ] as const
                    ).map((u) => (
                      <button
                        key={u.type}
                        type="button"
                        disabled={
                          playerLane.mythium < ECONOMY_CONFIG.kingUpgradeMythiumCost ||
                          u.lv >= ECONOMY_CONFIG.kingMaxUpgradeLevel
                        }
                        onClick={() => onUpgradeKing(u.type)}
                        className="w-[52px] h-[60px] shrink-0 rounded-xs bg-[#182634] border border-amber-400/50 flex flex-col items-center justify-between p-1 cursor-pointer disabled:opacity-40"
                      >
                        <span className="text-[8px] font-mono text-amber-300">Lv.{u.lv}</span>
                        <span className="text-sm leading-none">{u.icon}</span>
                        <span className="text-[8px] font-mono font-bold text-purple-300">
                          20M
                        </span>
                      </button>
                    ))}

                    {KING_ITEMS.map((item) => {
                      const isCitadelUpgrade =
                        item.id === 'item_sanctuary_core' || item.id === 'item_bastion_bulwark';
                      const inventoryFull = !isCitadelUpgrade && westKing.inventory.length >= 6;
                      const canAfford = playerLane.gold >= item.goldCost && !inventoryFull;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          data-testid={`buy-${item.id}`}
                          disabled={!canAfford}
                          onClick={() => onBuyKingItem(item.id)}
                          title={`${item.name} (${item.goldCost}g): ${item.description}`}
                          className="w-[56px] h-[60px] shrink-0 rounded-xs bg-[#132824] border border-emerald-400/60 flex flex-col items-center justify-between p-1 cursor-pointer disabled:opacity-40"
                        >
                          <span className="text-[7px] font-mono text-emerald-300 uppercase">
                            {item.category.slice(0, 5)}
                          </span>
                          <span className="text-xs leading-none">👑</span>
                          <div className="text-center w-full">
                            <div className="text-[8px] font-bold text-white truncate">
                              {item.name.split(' ')[0]}
                            </div>
                            <div className="text-[8px] font-mono font-bold text-amber-300">
                              {item.goldCost}g
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Economy & Value Box (w-36, h-[94px]) */}
            <div className="h-[94px] w-36 bg-[#0E1B24]/96 border border-l-0 border-[#2D4A5A] rounded-tr-lg px-2.5 py-1.5 flex flex-col justify-between font-mono text-[11px] shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="text-amber-200" title="Workers">
                  ⛏️ {playerLane.workers}
                </span>
                <span
                  data-testid="hud-gold"
                  className="text-amber-400 font-extrabold"
                  title="Gold Treasury"
                >
                  🪙 {Math.round(playerLane.gold)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span
                  data-testid="hud-mythium"
                  className="text-sky-300 font-bold"
                  title={`Mythium (${mythiumProgressPct}%)`}
                >
                  💎 {Math.round(playerLane.mythium)}
                </span>
                <span className="text-emerald-400 font-bold" title="Income per Wave">
                  📈 +{playerLane.income}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-[#223846] pt-0.5 text-[10px]">
                <span className="text-slate-200 font-bold" title="Army Fighter Value">
                  🛡️ {playerLane.fighterValue}
                </span>
                <span
                  className={`font-bold ${
                    valueDiff >= 0 ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  ({valueDiff >= 0 ? `+${valueDiff}` : valueDiff})
                </span>
              </div>

              <div className="flex items-center justify-between text-[9px]">
                <span
                  data-testid="hero-king-state-badge"
                  className={
                    westKing.isDead || westKing.status === 'FALLEN'
                      ? 'text-orange-400 font-bold truncate'
                      : 'text-amber-300 font-bold truncate'
                  }
                >
                  {westKing.isDead || westKing.status === 'FALLEN'
                    ? `FALLEN ${westKing.respawnTimer.toFixed(0)}s`
                    : `KING ${Math.round(westKing.hp)}`}
                </span>

                {westKing.isDead || westKing.status === 'FALLEN' ? (
                  <button
                    type="button"
                    data-testid="rush-respawn-btn"
                    disabled={playerLane.gold < 50}
                    onClick={onRushKingRespawn}
                    className="px-1 rounded-xs bg-emerald-500 text-slate-950 font-extrabold text-[8px] cursor-pointer"
                  >
                    Rush [G]
                  </button>
                ) : (
                  <span className="text-slate-400">
                    {westKing.inventory.length}/6{activeSynergies.size > 0 ? '★' : ''}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
