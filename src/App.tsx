/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AssetStudio3DModal } from './components/AssetStudio3DModal';
import { Battlefield3D } from './components/Battlefield3D';
import { BattlefieldCanvas } from './components/BattlefieldCanvas';
import { BattleHUD } from './components/BattleHUD';
import { StatusModal } from './components/StatusModal';
import { TitleScreen } from './components/TitleScreen';
import { soundFX } from './game/audio';
import { ECONOMY_CONFIG, FIGHTER_MAP, KING_ITEM_MAP, KING_SKILLS } from './game/config';
import {
  accelerateKingRespawn,
  buyAndPlaceFighter,
  buyKingItem,
  castKingSkill,
  castLegionSpell,
  createInitialMatchState,
  getMatchHistory,
  hireWorker,
  loadMatchFromStorage,
  moveKingByDirection,
  movePlacedFighter,
  queueMercenary,
  saveMatchToStorage,
  selectLegionSpell,
  sellPlacedFighter,
  setKingTargetPosition,
  startBattlePhase,
  stepMatch,
  upgradeKing,
  upgradePlacedFighter,
} from './game/engine';
import { AIDifficulty, FactionId, KingSkillKey, MatchMode, MatchState } from './game/types';

type ShellState = 'title' | 'playing' | 'paused' | 'gameover';

export default function App() {
  const isAutoStart =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('autostart') === '1';

  const [shellState, setShellState] = useState<ShellState>(isAutoStart ? 'playing' : 'title');
  const [selectedMode, setSelectedMode] = useState<MatchMode>('2v2');
  const [selectedDifficulty, setSelectedDifficulty] = useState<AIDifficulty>('Normal');
  const [selectedFaction, setSelectedFaction] = useState<FactionId>('Inferno');
  const [selectedSpellId, setSelectedSpellId] = useState<string>('spell_golden_age');
  const [buildDuration, setBuildDuration] = useState<number>(
    ECONOMY_CONFIG.buildPhaseDurationSeconds
  );
  const [muted, setMuted] = useState<boolean>(false);
  const [showAssetStudio, setShowAssetStudio] = useState<boolean>(false);
  const [render3DMode, setRender3DMode] = useState<boolean>(true);

  const matchRef = useRef<MatchState>(
    createInitialMatchState({
      mode: '2v2',
      aiDifficulty: 'Normal',
      playerFaction: 'Inferno',
      playerSpellId: 'spell_golden_age',
    })
  );

  const keysPressedRef = useRef<Set<string>>(new Set());

  // Throttled snapshot state for React HUD reconciliation (~10Hz + immediate on user action)
  const [hudState, setHudState] = useState<MatchState>(() => ({ ...matchRef.current }));
  const [selectedShopFighterId, setSelectedShopFighterId] = useState<string | null>(
    'inf_cinder_guard'
  );
  const [selectedPlacedInstanceId, setSelectedPlacedInstanceId] = useState<string | null>(null);
  const [isMoveMode, setIsMoveMode] = useState<boolean>(false);
  const [feedbackBanner, setFeedbackBanner] = useState<string | null>(null);
  const [hasSavedMatch, setHasSavedMatch] = useState<boolean>(() => Boolean(loadMatchFromStorage()));
  const [matchHistory, setMatchHistory] = useState(() => getMatchHistory());

  const syncHud = useCallback(() => {
    setHudState({
      ...matchRef.current,
      lanes: matchRef.current.lanes.map((l) => ({ ...l })),
      kings: [
        {
          ...matchRef.current.kings[0],
          skillCooldowns: { ...matchRef.current.kings[0].skillCooldowns },
          inventory: [...matchRef.current.kings[0].inventory],
        },
        {
          ...matchRef.current.kings[1],
          skillCooldowns: { ...matchRef.current.kings[1].skillCooldowns },
          inventory: [...matchRef.current.kings[1].inventory],
        },
      ],
    });
  }, []);

  const showFeedback = useCallback((msg: string) => {
    setFeedbackBanner(msg);
  }, []);

  // Sync document.body.dataset.state for Ultra Mode & accessibility verification
  useEffect(() => {
    document.body.dataset.state = shellState;
  }, [shellState]);

  // Start a fresh match
  const handleStartMatch = useCallback(
    (override?: {
      mode?: MatchMode;
      difficulty?: AIDifficulty;
      faction?: FactionId;
      spellId?: string;
    }) => {
      const mode = override?.mode ?? selectedMode;
      const aiDifficulty = override?.difficulty ?? selectedDifficulty;
      const playerFaction = override?.faction ?? selectedFaction;
      const playerSpellId = override?.spellId ?? selectedSpellId;

      const fresh = createInitialMatchState({
        mode,
        aiDifficulty,
        playerFaction,
        playerSpellId,
      });
      fresh.buildPhaseDuration = buildDuration;
      fresh.phaseTimer = buildDuration;

      // Deploy 1 starter vanguard fighter automatically on ?autostart=1 so the game survives the first few seconds without input!
      if (isAutoStart) {
        buyAndPlaceFighter(fresh, 0, 'inf_cinder_guard', 3, 1);
      }

      matchRef.current = fresh;
      setSelectedPlacedInstanceId(null);
      setIsMoveMode(false);
      setShellState('playing');
      document.body.dataset.state = 'playing';
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      soundFX.playWaveStart();
      syncHud();
    },
    [
      buildDuration,
      isAutoStart,
      selectedDifficulty,
      selectedFaction,
      selectedMode,
      selectedSpellId,
      syncHud,
    ]
  );

  // If booted with ?autostart=1, ensure starter fighter is placed
  useEffect(() => {
    if (isAutoStart && matchRef.current.lanes[0].placedFighters.length === 0) {
      buyAndPlaceFighter(matchRef.current, 0, 'inf_cinder_guard', 3, 1);
      syncHud();
    }
  }, [isAutoStart, syncHud]);

  const handleResumeSavedMatch = useCallback(() => {
    const saved = loadMatchFromStorage();
    if (!saved) return;
    matchRef.current = saved;
    setSelectedPlacedInstanceId(null);
    setIsMoveMode(false);
    setShellState('playing');
    document.body.dataset.state = 'playing';
    syncHud();
  }, [syncHud]);

  // Paced Simulation Loop (decoupled from React state, yielding to main thread for smooth headless browser responsiveness)
  useEffect(() => {
    if (shellState !== 'playing') return;

    let lastTime = performance.now();
    let hudAccumulator = 0;
    let timerId: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      const now = performance.now();
      const rawDt = (now - lastTime) / 1000;
      lastTime = now;

      const state = matchRef.current;

      // Apply continuous WASD / Arrow Key free movement for the player's Hero King
      const keys = keysPressedRef.current;
      let dirX = 0;
      let dirY = 0;
      if (keys.has('KeyW') || keys.has('ArrowUp')) dirY -= 1;
      if (keys.has('KeyS') || keys.has('ArrowDown')) dirY += 1;
      if (keys.has('KeyA') || keys.has('ArrowLeft')) dirX -= 1;
      if (keys.has('KeyD') || keys.has('ArrowRight')) dirX += 1;
      if (dirX !== 0 || dirY !== 0) {
        moveKingByDirection(state, 0, dirX, dirY, rawDt);
        soundFX.playHeroStep();
      } else if ((state.kings[0].moveAnimTimer ?? 0) > 0.08 && !state.kings[0].isDead) {
        soundFX.playHeroStep();
      }

      const prevPhase = state.phase;
      stepMatch(state, rawDt);

      if (state.phase !== prevPhase) {
        if (state.phase === 'VICTORY') {
          soundFX.syncAmbientPhase('TITLE', false);
          soundFX.playVictory();
          setMatchHistory(getMatchHistory());
          setShellState('gameover');
        } else if (state.phase === 'DEFEAT') {
          soundFX.syncAmbientPhase('TITLE', false);
          soundFX.playDefeat();
          setMatchHistory(getMatchHistory());
          setShellState('gameover');
        } else if (state.phase === 'BATTLE') {
          soundFX.syncAmbientPhase('BATTLE', true);
          soundFX.playWaveStart();
        } else if (state.phase === 'BUILD') {
          soundFX.syncAmbientPhase('BUILD', true);
        }
        syncHud();
      } else {
        hudAccumulator += rawDt;
        if (hudAccumulator >= 0.15) {
          hudAccumulator = 0;
          syncHud();
        }
      }

      timerId = setTimeout(tick, 25);
    };

    soundFX.syncAmbientPhase(
      matchRef.current.phase === 'BATTLE' ? 'BATTLE' : 'BUILD',
      true
    );
    timerId = setTimeout(tick, 25);
    return () => {
      cancelled = true;
      soundFX.syncAmbientPhase('TITLE', false);
      if (timerId) clearTimeout(timerId);
    };
  }, [shellState, syncHud]);

  // Player Actions
  const handleTileClick = useCallback(
    (gridX: number, gridY: number) => {
      const state = matchRef.current;
      if (isMoveMode && selectedPlacedInstanceId) {
        const res = movePlacedFighter(state, 0, selectedPlacedInstanceId, gridX, gridY);
        if (res.ok) {
          soundFX.playPlaceFighter();
          showFeedback(`Fighter repositioned to (${gridX + 1}, ${gridY + 1}).`);
          setIsMoveMode(false);
        } else if (res.reason) {
          showFeedback(res.reason);
        }
        syncHud();
        return;
      }

      if (selectedShopFighterId) {
        const res = buyAndPlaceFighter(state, 0, selectedShopFighterId, gridX, gridY);
        if (res.ok) {
          soundFX.playPlaceFighter();
          const cfg = FIGHTER_MAP[selectedShopFighterId];
          showFeedback(`Deployed ${cfg?.name ?? 'Fighter'} at (${gridX + 1}, ${gridY + 1}).`);
        } else if (res.reason) {
          showFeedback(res.reason);
        }
        syncHud();
      }
    },
    [isMoveMode, selectedPlacedInstanceId, selectedShopFighterId, showFeedback, syncHud]
  );

  const handleMoveKingTo = useCallback(
    (targetX: number, targetY: number) => {
      setKingTargetPosition(matchRef.current, 0, targetX, targetY);
      soundFX.playHeroStep();
      showFeedback(`Hero King moving to (${Math.round(targetX)}, ${Math.round(targetY)}).`);
      syncHud();
    },
    [showFeedback, syncHud]
  );

  const handleCastKingSkill = useCallback(
    (skillKey: KingSkillKey) => {
      const res = castKingSkill(matchRef.current, 0, skillKey);
      if (res.ok) {
        soundFX.playKingSkill(skillKey);
        const sk = KING_SKILLS[skillKey];
        showFeedback(`Hero King cast [${skillKey}] ${sk?.name ?? skillKey}!`);
      } else if (res.reason) {
        showFeedback(res.reason);
      }
      syncHud();
    },
    [showFeedback, syncHud]
  );

  const handleBuyKingItem = useCallback(
    (itemId: string) => {
      const res = buyKingItem(matchRef.current, 0, itemId);
      if (res.ok) {
        soundFX.playUpgradeFighter();
        const item = KING_ITEM_MAP[itemId];
        showFeedback(`Citadel Armory: Purchased ${item?.name ?? 'Item'}!`);
      } else if (res.reason) {
        showFeedback(res.reason);
      }
      syncHud();
    },
    [showFeedback, syncHud]
  );

  const handleRushKingRespawn = useCallback(() => {
    const res = accelerateKingRespawn(matchRef.current, 0);
    if (res.ok) {
      soundFX.playSpellCast();
      const king = matchRef.current.kings[0];
      showFeedback(
        king.isDead
          ? `Emergency Ritual Surge! King respawns in ${king.respawnTimer.toFixed(1)}s.`
          : 'Hero King has risen from the FALLEN state!'
      );
    } else if (res.reason) {
      showFeedback(res.reason);
    }
    syncHud();
  }, [showFeedback, syncHud]);

  const handleQuickDeployFighter = useCallback(
    (fighterId: string) => {
      const state = matchRef.current;
      const lane = state.lanes[0];
      const cfg = FIGHTER_MAP[fighterId];
      if (!cfg) return;

      const isFrontline = cfg.attackRange <= 2 || cfg.role === 'Tank';
      const rows = isFrontline ? [1, 2, 0, 3, 4, 5] : [4, 5, 3, 2, 1, 0];
      const cols = [3, 2, 4, 1, 5, 0, 6];

      for (const r of rows) {
        for (const c of cols) {
          const occupied = lane.placedFighters.some((p) => p.gridX === c && p.gridY === r);
          if (!occupied) {
            const res = buyAndPlaceFighter(state, 0, fighterId, c, r);
            if (res.ok) {
              soundFX.playPlaceFighter();
              const newlyPlaced = lane.placedFighters[lane.placedFighters.length - 1];
              if (newlyPlaced) {
                setSelectedPlacedInstanceId(newlyPlaced.instanceId);
              }
              showFeedback(`Deployed ${cfg.name} to (${c + 1}, ${r + 1}).`);
            } else if (res.reason) {
              showFeedback(res.reason);
            }
            syncHud();
            return;
          }
        }
      }
      showFeedback('No open grid tiles remaining on your lane.');
    },
    [showFeedback, syncHud]
  );

  const handleUpgradePlacedFighter = useCallback(
    (instanceId: string, upgradeId: string) => {
      const res = upgradePlacedFighter(matchRef.current, 0, instanceId, upgradeId);
      if (res.ok) {
        soundFX.playUpgradeFighter();
        const cfg = FIGHTER_MAP[upgradeId];
        showFeedback(`Evolved fighter into ${cfg?.name ?? 'Tier 2'}!`);
      } else if (res.reason) {
        showFeedback(res.reason);
      }
      syncHud();
    },
    [showFeedback, syncHud]
  );

  const handleSellPlacedFighter = useCallback(
    (instanceId: string) => {
      const res = sellPlacedFighter(matchRef.current, 0, instanceId);
      if (res.ok) {
        soundFX.playSellFighter();
        setSelectedPlacedInstanceId(null);
        setIsMoveMode(false);
        showFeedback('Fighter sold and Gold refunded.');
      } else if (res.reason) {
        showFeedback(res.reason);
      }
      syncHud();
    },
    [showFeedback, syncHud]
  );

  const handleHireWorker = useCallback(() => {
    const res = hireWorker(matchRef.current, 0);
    if (res.ok) {
      soundFX.playHireWorker();
      showFeedback(`Worker recruited! Total Workers: ${matchRef.current.lanes[0].workers}`);
    } else if (res.reason) {
      showFeedback(res.reason);
    }
    syncHud();
  }, [showFeedback, syncHud]);

  const handleQueueMercenary = useCallback(
    (mercenaryId: string, count: number) => {
      const res = queueMercenary(matchRef.current, 0, mercenaryId, count);
      if (res.ok) {
        soundFX.playSendMercenary();
        showFeedback('Mercenary dispatched to enemy wave!');
      } else if (res.reason) {
        showFeedback(res.reason);
      }
      syncHud();
    },
    [showFeedback, syncHud]
  );

  const handleUpgradeKing = useCallback(
    (type: 'attack' | 'defense' | 'regen' | 'spell') => {
      const res = upgradeKing(matchRef.current, 0, type);
      if (res.ok) {
        soundFX.playUpgradeFighter();
        showFeedback(`West King ${type.toUpperCase()} upgraded (+6g Income)!`);
      } else if (res.reason) {
        showFeedback(res.reason);
      }
      syncHud();
    },
    [showFeedback, syncHud]
  );

  const handleCastSpell = useCallback(() => {
    const res = castLegionSpell(matchRef.current, 0);
    if (res.ok) {
      soundFX.playSpellCast();
      showFeedback('Legion Spell unleashed!');
    } else if (res.reason) {
      showFeedback(res.reason);
    }
    syncHud();
  }, [showFeedback, syncHud]);

  const handleSelectSpell = useCallback(
    (spellId: string) => {
      const res = selectLegionSpell(matchRef.current, 0, spellId);
      if (res.ok) {
        showFeedback('Legion Spell equipped.');
      } else if (res.reason) {
        showFeedback(res.reason);
      }
      syncHud();
    },
    [showFeedback, syncHud]
  );

  const handleLaunchWaveNow = useCallback(() => {
    if (matchRef.current.phase === 'BUILD') {
      startBattlePhase(matchRef.current);
      soundFX.playWaveStart();
      syncHud();
    }
  }, [syncHud]);

  const handleSetSimSpeed = useCallback(
    (speed: 1 | 2 | 4) => {
      matchRef.current.simSpeed = speed;
      syncHud();
    },
    [syncHud]
  );

  const handleSwitchLane = useCallback(
    (laneId: number) => {
      if (matchRef.current.lanes[laneId]) {
        matchRef.current.activeViewedLaneId = laneId;
        setSelectedPlacedInstanceId(null);
        setIsMoveMode(false);
        syncHud();
      }
    },
    [syncHud]
  );

  const handleSaveMatch = useCallback(() => {
    const ok = saveMatchToStorage(matchRef.current);
    if (ok) {
      setHasSavedMatch(true);
      showFeedback('Match state saved to local storage.');
      syncHud();
    }
  }, [showFeedback, syncHud]);

  const handleToggleMute = useCallback(() => {
    const next = soundFX.toggleMute();
    setMuted(next);
  }, []);

  // Unified Keyboard Shortcuts & Continuous Hero King Movement
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (shellState === 'title') {
        if (e.code === 'Enter' || e.code === 'Space') {
          e.preventDefault();
          handleStartMatch();
        }
        return;
      }

      if (e.code === 'Escape' || e.code === 'KeyP') {
        e.preventDefault();
        keysPressedRef.current.clear();
        setShellState((prev) =>
          prev === 'playing' ? 'paused' : prev === 'paused' ? 'playing' : prev
        );
        return;
      }

      if (shellState !== 'playing') return;

      if (
        e.code === 'KeyW' ||
        e.code === 'KeyA' ||
        e.code === 'KeyS' ||
        e.code === 'KeyD' ||
        e.code === 'ArrowUp' ||
        e.code === 'ArrowDown' ||
        e.code === 'ArrowLeft' ||
        e.code === 'ArrowRight'
      ) {
        keysPressedRef.current.add(e.code);
        return;
      }

      if (e.code === 'KeyQ') {
        e.preventDefault();
        handleCastKingSkill('Q');
      } else if (e.code === 'KeyE') {
        e.preventDefault();
        handleCastKingSkill('E');
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        handleCastKingSkill('R');
      } else if (e.code === 'KeyG') {
        e.preventDefault();
        handleRushKingRespawn();
      } else if (e.code === 'KeyH') {
        e.preventDefault();
        handleHireWorker();
      } else if (e.code === 'Space') {
        e.preventDefault();
        handleLaunchWaveNow();
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        handleCastSpell();
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        if (selectedPlacedInstanceId) {
          setIsMoveMode((m) => !m);
        } else {
          handleToggleMute();
        }
      } else if (e.code === 'Digit1') {
        handleSwitchLane(0);
      } else if (e.code === 'Digit2') {
        handleSwitchLane(1);
      } else if (e.code === 'Digit3') {
        handleSwitchLane(2);
      } else if (e.code === 'Digit4') {
        handleSwitchLane(3);
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keysPressedRef.current.delete(e.code);
    };

    const onBlur = () => {
      keysPressedRef.current.clear();
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
    };
  }, [
    handleCastKingSkill,
    handleCastSpell,
    handleHireWorker,
    handleLaunchWaveNow,
    handleRushKingRespawn,
    handleStartMatch,
    handleSwitchLane,
    handleToggleMute,
    selectedPlacedInstanceId,
    shellState,
  ]);

  if (shellState === 'title') {
    return (
      <>
        <TitleScreen
          selectedMode={selectedMode}
          setSelectedMode={setSelectedMode}
          selectedDifficulty={selectedDifficulty}
          setSelectedDifficulty={setSelectedDifficulty}
          selectedFaction={selectedFaction}
          setSelectedFaction={setSelectedFaction}
          selectedSpellId={selectedSpellId}
          setSelectedSpellId={setSelectedSpellId}
          hasSavedMatch={hasSavedMatch}
          matchHistory={matchHistory}
          muted={muted}
          onToggleMute={handleToggleMute}
          buildDuration={buildDuration}
          setBuildDuration={setBuildDuration}
          onStartMatch={() => handleStartMatch()}
          onResumeSavedMatch={handleResumeSavedMatch}
          onStartCampaignMission={(mode, difficulty, faction, spellId) => {
            setSelectedMode(mode);
            setSelectedDifficulty(difficulty);
            setSelectedFaction(faction);
            setSelectedSpellId(spellId);
            handleStartMatch({ mode, difficulty, faction, spellId });
          }}
          onOpenAssetStudio={() => setShowAssetStudio(true)}
        />
        {showAssetStudio && <AssetStudio3DModal onClose={() => setShowAssetStudio(false)} />}
      </>
    );
  }

  return (
    <>
      <BattleHUD
        state={hudState}
        selectedShopFighterId={selectedShopFighterId}
        onSelectShopFighter={setSelectedShopFighterId}
        onQuickDeployFighter={handleQuickDeployFighter}
        selectedPlacedInstanceId={selectedPlacedInstanceId}
        onSelectPlacedFighter={(id) => {
          setSelectedPlacedInstanceId(id);
          setIsMoveMode(false);
        }}
        isMoveMode={isMoveMode}
        onToggleMoveMode={() => setIsMoveMode((m) => !m)}
        onUpgradePlacedFighter={handleUpgradePlacedFighter}
        onSellPlacedFighter={handleSellPlacedFighter}
        onHireWorker={handleHireWorker}
        onQueueMercenary={handleQueueMercenary}
        onUpgradeKing={handleUpgradeKing}
        onCastKingSkill={handleCastKingSkill}
        onBuyKingItem={handleBuyKingItem}
        onRushKingRespawn={handleRushKingRespawn}
        onCastSpell={handleCastSpell}
        onSelectSpell={handleSelectSpell}
        onLaunchWaveNow={handleLaunchWaveNow}
        onSetSimSpeed={handleSetSimSpeed}
        onSwitchLane={handleSwitchLane}
        onSaveMatch={handleSaveMatch}
        onTogglePause={() =>
          setShellState((prev) => (prev === 'playing' ? 'paused' : 'playing'))
        }
        muted={muted}
        onToggleMute={handleToggleMute}
        feedbackBanner={feedbackBanner}
      >
        {render3DMode ? (
          <div className="relative w-full h-full">
            <Battlefield3D
              matchRef={matchRef}
              selectedShopFighterId={selectedShopFighterId}
              selectedPlacedInstanceId={selectedPlacedInstanceId}
              isMoveMode={isMoveMode}
              onSelectPlacedFighter={(id) => {
                setSelectedPlacedInstanceId(id);
                setIsMoveMode(false);
              }}
              onTileClick={handleTileClick}
              onMoveKingTo={handleMoveKingTo}
              onOpenAssetStudio={() => setShowAssetStudio(true)}
            />
            <button
              type="button"
              onClick={() => setRender3DMode(false)}
              className="absolute top-8 left-1.5 z-20 px-1.5 py-0.5 rounded bg-[#0C161E]/90 border border-[#243B4A] text-[9px] font-semibold text-slate-300 hover:border-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
            >
              2D View
            </button>
          </div>
        ) : (
          <div className="relative w-full h-full">
            <BattlefieldCanvas
              matchRef={matchRef}
              selectedShopFighterId={selectedShopFighterId}
              selectedPlacedInstanceId={selectedPlacedInstanceId}
              isMoveMode={isMoveMode}
              onSelectPlacedFighter={(id) => {
                setSelectedPlacedInstanceId(id);
                setIsMoveMode(false);
              }}
              onTileClick={handleTileClick}
              onMoveKingTo={handleMoveKingTo}
              onSwitchLane={handleSwitchLane}
            />
            <div className="absolute top-2 left-2 z-20 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setRender3DMode(true)}
                className="px-2 py-1 rounded bg-amber-500 text-slate-950 text-[10px] font-bold hover:bg-amber-400 transition-colors cursor-pointer"
              >
                3D WebGL View
              </button>
              <button
                type="button"
                data-testid="open-3d-forge-btn"
                onClick={() => setShowAssetStudio(true)}
                className="px-2 py-1 rounded bg-[#1D6B87] text-white text-[10px] font-bold hover:bg-[#2584A6] transition-colors cursor-pointer"
              >
                3D Forge (420)
              </button>
            </div>
          </div>
        )}
      </BattleHUD>

      {showAssetStudio && <AssetStudio3DModal onClose={() => setShowAssetStudio(false)} />}

      {(shellState === 'paused' || shellState === 'gameover') && (
        <StatusModal
          modalType={
            shellState === 'paused'
              ? 'PAUSED'
              : hudState.winnerTeam === 0
              ? 'VICTORY'
              : 'DEFEAT'
          }
          state={hudState}
          onResume={() => setShellState('playing')}
          onRestart={() => handleStartMatch()}
          onReturnToTitle={() => setShellState('title')}
        />
      )}
    </>
  );
}
