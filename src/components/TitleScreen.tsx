import React, { useState } from 'react';
import {
  FACTIONS,
  LEGION_SPELLS,
  SPELL_MAP,
} from '../game/config';
import {
  AIDifficulty,
  FactionConfig,
  FactionId,
  MatchHistoryRecord,
  MatchMode,
} from '../game/types';
import { sound } from '../game/audio';

interface CampaignMissionPreset {
  id: string;
  subtitle: string;
  title: string;
  description: string;
  mode: MatchMode;
  aiDifficulty: AIDifficulty;
  recommendedFaction: FactionId;
  recommendedSpellId: string;
}

const CAMPAIGN_PRESETS: CampaignMissionPreset[] = [
  {
    id: 'mission_cinder_bastion',
    subtitle: 'Act I · Inferno Outpost',
    title: 'Cinder Bastion',
    description: 'Defend the West Gate with Inferno tanks and Royal Cleave [Q].',
    mode: '2v2',
    aiDifficulty: 'Normal',
    recommendedFaction: 'Inferno',
    recommendedSpellId: 'spell_golden_age',
  },
  {
    id: 'mission_clockwork_siege',
    subtitle: 'Act II · Ironforge',
    title: 'Clockwork Siege',
    description: 'Scale Mythium workers and Mechanic artillery to overwhelm the East Pact.',
    mode: '2v2',
    aiDifficulty: 'Hard',
    recommendedFaction: 'Mechanic',
    recommendedSpellId: 'spell_overclock',
  },
  {
    id: 'mission_sovereign_eclipse',
    subtitle: 'Act III · Apex Trial',
    title: 'Sovereign Eclipse',
    description: '1v1 duel against Expert AI. Master Citadel Relics and Cataclysm [R].',
    mode: '1v1',
    aiDifficulty: 'Expert',
    recommendedFaction: 'Divine',
    recommendedSpellId: 'spell_aegis_barrier',
  },
];

interface TitleScreenProps {
  selectedMode: MatchMode;
  setSelectedMode: (mode: MatchMode) => void;
  selectedDifficulty: AIDifficulty;
  setSelectedDifficulty: (diff: AIDifficulty) => void;
  selectedFaction: FactionId;
  setSelectedFaction: (faction: FactionId) => void;
  selectedSpellId: string;
  setSelectedSpellId: (spellId: string) => void;
  hasSavedMatch: boolean;
  matchHistory: MatchHistoryRecord[];
  muted: boolean;
  onToggleMute: () => void;
  buildDuration: number;
  setBuildDuration: (seconds: number) => void;
  onStartMatch: () => void;
  onResumeSavedMatch: () => void;
  onStartCampaignMission: (
    mode: MatchMode,
    difficulty: AIDifficulty,
    faction: FactionId,
    spellId: string
  ) => void;
  onOpenAssetStudio: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  selectedMode,
  setSelectedMode,
  selectedDifficulty,
  setSelectedDifficulty,
  selectedFaction,
  setSelectedFaction,
  selectedSpellId,
  setSelectedSpellId,
  hasSavedMatch,
  matchHistory,
  muted,
  onToggleMute,
  buildDuration,
  setBuildDuration,
  onStartMatch,
  onResumeSavedMatch,
  onStartCampaignMission,
  onOpenAssetStudio,
}) => {
  const [activeTab, setActiveTab] = useState<'PLAY' | 'CAMPAIGN' | 'AUDIO'>('PLAY');
  const [musicOn, setMusicOn] = useState(sound.musicEnabled);
  const [sfxVol, setSfxVol] = useState(Math.round(sound.sfxVolume * 100));
  const [musicVol, setMusicVol] = useState(Math.round(sound.musicVolume * 100));

  const factionList: FactionConfig[] = Object.values(FACTIONS);
  const activeFaction = FACTIONS[selectedFaction];
  const activeSpell = SPELL_MAP[selectedSpellId] ?? LEGION_SPELLS[0];
  const starterSpells = LEGION_SPELLS.filter((s) => s.unlockWave <= 1);

  const handleToggleMusic = () => {
    const next = sound.toggleMusic();
    setMusicOn(next);
    sound.playUiClick();
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex items-center justify-center bg-[#060B11] text-slate-100 select-none">
      {/* Subtle Dark-Teal Tactical Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 25%, rgba(29, 107, 135, 0.18) 0%, rgba(217, 155, 38, 0.08) 42%, rgba(6, 11, 17, 0.98) 80%)',
        }}
      />

      {/* Compact Legion TD 2 Command Launcher Card */}
      <div className="relative z-10 w-full max-w-3xl mx-4 rounded-xl bg-[#0D1922]/96 border-2 border-[#2B4758] shadow-[0_24px_70px_rgba(0,0,0,0.85)] overflow-hidden">
        {/* Top Beveled Header Bar */}
        <div className="px-5 py-3 bg-[#12232F] border-b border-[#2B4758] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-amber-500/20 border border-amber-400 flex items-center justify-center text-sm">
              👑
            </div>
            <div>
              <h1 className="text-lg font-extrabold font-display tracking-wider text-white leading-tight">
                BASTION PROTOCOL
              </h1>
              <div className="text-[10px] font-mono text-amber-300">
                2v2 Auto TD · 3D Hero Command · 21 Waves
              </div>
            </div>
          </div>

          {/* Compact Navigation & Studio Controls */}
          <div className="flex items-center gap-1.5">
            {(
              [
                { id: 'PLAY', label: 'Skirmish' },
                { id: 'CAMPAIGN', label: 'Campaign (3)' },
                { id: 'AUDIO', label: 'Audio & Settings' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  sound.playUiClick();
                  setActiveTab(tab.id);
                }}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#D99B26] text-slate-950'
                    : 'bg-[#0C161E] hover:bg-[#182B38] text-slate-300 border border-[#243C4A]'
                }`}
              >
                {tab.label}
              </button>
            ))}

            <button
              type="button"
              onClick={handleToggleMusic}
              className={`px-2 py-1 rounded border text-xs font-bold cursor-pointer ${
                musicOn && !muted
                  ? 'bg-amber-500/20 border-amber-400/60 text-amber-300'
                  : 'bg-[#0C161E] border-[#243C4A] text-slate-500'
              }`}
              title="Toggle Ambient Music"
            >
              ♪
            </button>

            <button
              type="button"
              onClick={onToggleMute}
              className="px-2 py-1 rounded bg-[#0C161E] hover:bg-[#182B38] border border-[#243C4A] text-xs cursor-pointer"
              title="Mute / Unmute Audio"
            >
              {muted ? '🔇' : '🔊'}
            </button>

            <button
              type="button"
              data-testid="title-open-3d-forge"
              onClick={() => {
                sound.playUiClick();
                onOpenAssetStudio();
              }}
              className="px-2.5 py-1 rounded bg-[#1D6B87] hover:bg-[#2584A6] text-white font-bold text-xs cursor-pointer"
            >
              3D Forge (420)
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-4">
          {activeTab === 'PLAY' && (
            <>
              {/* Compact 8-Legion Icon Grid */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider text-slate-300">
                    Select Legion (8 Factions)
                  </span>
                  <span className="font-mono text-[11px] text-amber-300">
                    {activeFaction.name} · {activeFaction.synergyName}
                  </span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                  {factionList.map((faction) => {
                    const isSelected = faction.id === selectedFaction;
                    return (
                      <button
                        key={faction.id}
                        type="button"
                        onClick={() => {
                          sound.playUiClick();
                          setSelectedFaction(faction.id);
                        }}
                        className={`p-2 rounded border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#1D3546] border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                            : 'bg-[#0F1D27] border-[#233A48] hover:border-slate-500'
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: faction.primaryColor }}
                        />
                        <span
                          className={`text-[11px] font-bold truncate w-full text-center ${
                            isSelected ? 'text-amber-300' : 'text-slate-200'
                          }`}
                        >
                          {faction.name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="px-3 py-1.5 rounded bg-[#0A131A] border border-[#1E3340] text-[11px] text-slate-300 flex items-center justify-between gap-2">
                  <span className="truncate">{activeFaction.synergyDescription}</span>
                  <span className="text-emerald-400 font-mono shrink-0">3+ Units</span>
                </div>
              </div>

              {/* Compact Mode, AI Difficulty & Starting Spell Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-2.5 rounded bg-[#0F1D27] border border-[#233A48] space-y-1.5">
                  <div className="text-[10px] font-mono uppercase text-slate-400">Match Mode</div>
                  <div className="grid grid-cols-3 gap-1">
                    {(['2v2', '1v1', 'Solo'] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => {
                          sound.playUiClick();
                          setSelectedMode(m);
                        }}
                        className={`py-1 rounded text-xs font-bold cursor-pointer ${
                          selectedMode === m
                            ? 'bg-[#256D9B] text-white'
                            : 'bg-[#0A131A] text-slate-400 hover:text-white'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-2.5 rounded bg-[#0F1D27] border border-[#233A48] space-y-1.5">
                  <div className="text-[10px] font-mono uppercase text-slate-400">
                    AI Difficulty
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {(['Easy', 'Normal', 'Hard', 'Expert'] as const).map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => {
                          sound.playUiClick();
                          setSelectedDifficulty(d);
                        }}
                        className={`py-1 rounded text-[11px] font-bold cursor-pointer ${
                          selectedDifficulty === d
                            ? 'bg-[#D99B26] text-slate-950'
                            : 'bg-[#0A131A] text-slate-400 hover:text-white'
                        }`}
                      >
                        {d === 'Normal' ? 'Norm' : d === 'Expert' ? 'Exp' : d}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-2.5 rounded bg-[#0F1D27] border border-[#233A48] space-y-1.5">
                  <div className="text-[10px] font-mono uppercase text-slate-400">
                    Legion Spell: <span className="text-sky-300">{activeSpell.name}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {starterSpells.slice(0, 3).map((sp) => (
                      <button
                        key={sp.id}
                        type="button"
                        onClick={() => {
                          sound.playUiClick();
                          setSelectedSpellId(sp.id);
                        }}
                        className={`py-1 px-1 rounded text-[10px] font-bold truncate cursor-pointer ${
                          selectedSpellId === sp.id
                            ? 'bg-sky-500 text-slate-950'
                            : 'bg-[#0A131A] text-slate-400 hover:text-white'
                        }`}
                      >
                        {sp.name.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'CAMPAIGN' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {CAMPAIGN_PRESETS.map((m) => (
                <div
                  key={m.id}
                  className="p-3 rounded bg-[#0F1D27] border border-[#233A48] flex flex-col justify-between space-y-2.5"
                >
                  <div>
                    <div className="text-[10px] font-mono text-amber-400">{m.subtitle}</div>
                    <div className="text-sm font-bold font-display text-white mt-0.5">
                      {m.title}
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{m.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playWaveStart();
                      onStartCampaignMission(
                        m.mode,
                        m.aiDifficulty,
                        m.recommendedFaction,
                        m.recommendedSpellId
                      );
                    }}
                    className="w-full py-1.5 rounded bg-[#D99B26] hover:bg-amber-400 text-slate-950 font-extrabold text-xs cursor-pointer"
                  >
                    Start ({m.mode} · {m.aiDifficulty})
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'AUDIO' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded bg-[#0F1D27] border border-[#233A48] space-y-2.5 text-xs">
                <div className="font-bold text-amber-300 uppercase">Studio Web Audio Mixer</div>
                <label className="block space-y-1">
                  <div className="flex justify-between font-mono text-[11px]">
                    <span>SFX Volume</span>
                    <span className="text-amber-300">{sfxVol}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={sfxVol}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setSfxVol(v);
                      sound.setSfxVolume(v / 100);
                    }}
                    onMouseUp={() => sound.playPlaceFighter()}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </label>
                <label className="block space-y-1">
                  <div className="flex justify-between font-mono text-[11px]">
                    <span>Ambient Music Volume</span>
                    <span className="text-sky-300">{musicVol}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={musicVol}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setMusicVol(v);
                      sound.setMusicVolume(v / 100);
                    }}
                    className="w-full accent-sky-400 cursor-pointer"
                  />
                </label>
                <div className="grid grid-cols-3 gap-1 pt-1">
                  <button
                    type="button"
                    onClick={() => sound.playWaveStart()}
                    className="py-1 rounded bg-[#162936] text-[10px] font-bold text-amber-300 cursor-pointer"
                  >
                    ♪ War Horn
                  </button>
                  <button
                    type="button"
                    onClick={() => sound.playKingSkill('R')}
                    className="py-1 rounded bg-[#162936] text-[10px] font-bold text-sky-300 cursor-pointer"
                  >
                    ♪ Meteor [R]
                  </button>
                  <button
                    type="button"
                    onClick={() => sound.playUpgradeFighter()}
                    className="py-1 rounded bg-[#162936] text-[10px] font-bold text-emerald-300 cursor-pointer"
                  >
                    ♪ Evolve
                  </button>
                </div>
              </div>

              <div className="p-3 rounded bg-[#0F1D27] border border-[#233A48] space-y-2.5 text-xs">
                <div className="font-bold text-sky-300 uppercase">
                  Build Timer &amp; Recent Matches ({matchHistory.length})
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {[20, 30, 45].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => {
                        sound.playUiClick();
                        setBuildDuration(sec);
                      }}
                      className={`py-1 rounded font-mono font-bold cursor-pointer ${
                        buildDuration === sec
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-[#0A131A] text-slate-400'
                      }`}
                    >
                      {sec}s Build
                    </button>
                  ))}
                </div>
                <div className="text-[11px] font-mono text-slate-400 space-y-1 max-h-20 overflow-y-auto">
                  {matchHistory.length === 0 ? (
                    <div>No recent matches recorded.</div>
                  ) : (
                    matchHistory.slice(0, 3).map((h) => (
                      <div key={h.id} className="flex justify-between">
                        <span className={h.outcome === 'VICTORY' ? 'text-emerald-400' : 'text-rose-400'}>
                          {h.outcome} ({h.faction})
                        </span>
                        <span>W{h.waveReached}/21 · {h.finalFighterValue}g</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Footer Action Row */}
          <div className="pt-2 border-t border-[#233A48] flex items-center justify-between gap-3">
            <div className="text-[11px] font-mono text-slate-400 truncate">
              WASD / Right-Click: Hero Move · [Q][E][R]: Skills · [H]: Worker
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {hasSavedMatch && (
                <button
                  type="button"
                  onClick={() => {
                    sound.playUiClick();
                    onResumeSavedMatch();
                  }}
                  className="px-3.5 py-2 rounded-lg bg-[#162936] hover:bg-[#1F384A] border border-[#2D4A5A] text-xs font-bold text-slate-200 cursor-pointer"
                >
                  Resume Saved
                </button>
              )}

              <button
                type="button"
                data-start="true"
                onClick={onStartMatch}
                className="px-6 py-2.5 rounded-lg bg-gradient-to-b from-[#F59E0B] to-[#D97706] hover:from-[#FBBF24] hover:to-[#F59E0B] text-slate-950 font-extrabold text-xs tracking-wider uppercase shadow-[0_0_24px_rgba(245,158,11,0.35)] cursor-pointer"
              >
                LAUNCH BATTLE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
