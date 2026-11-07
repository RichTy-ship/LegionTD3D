import React, { useEffect, useRef } from 'react';
import { ECONOMY_CONFIG, FIGHTER_MAP, KING_CONFIG, WAVE_MAP } from '../game/config';
import { CombatUnit, LaneState, MatchState } from '../game/types';

interface BattlefieldCanvasProps {
  matchRef: React.MutableRefObject<MatchState>;
  selectedShopFighterId: string | null;
  selectedPlacedInstanceId: string | null;
  isMoveMode: boolean;
  onSelectPlacedFighter: (instanceId: string | null) => void;
  onTileClick: (gridX: number, gridY: number) => void;
  onMoveKingTo: (targetX: number, targetY: number) => void;
  onSwitchLane: (laneId: number) => void;
}

const BOARD_W = 430;
const BOARD_H = 1100;
const GRID_LEFT = 45;
const GRID_TOP = 340;
const CELL_W = 55;
const CELL_H = 42;
const BACKLINE_GAP = 28;

function getRowCenterY(row: number): number {
  return GRID_TOP + row * CELL_H + (row >= 6 ? BACKLINE_GAP : 0);
}

function getRowFromBoardY(by: number): number {
  for (let r = 0; r < ECONOMY_CONFIG.gridRows; r++) {
    const cy = getRowCenterY(r);
    if (by >= cy - CELL_H / 2 && by <= cy + CELL_H / 2) {
      return r;
    }
  }
  return -1;
}

export const BattlefieldCanvas: React.FC<BattlefieldCanvasProps> = ({
  matchRef,
  selectedShopFighterId,
  selectedPlacedInstanceId,
  isMoveMode,
  onSelectPlacedFighter,
  onTileClick,
  onMoveKingTo,
  onSwitchLane,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hoverCellRef = useRef<{ gridX: number; gridY: number } | null>(null);

  const propsRef = useRef({
    selectedShopFighterId,
    selectedPlacedInstanceId,
    isMoveMode,
    onSelectPlacedFighter,
    onTileClick,
    onMoveKingTo,
    onSwitchLane,
  });
  useEffect(() => {
    propsRef.current = {
      selectedShopFighterId,
      selectedPlacedInstanceId,
      isMoveMode,
      onSelectPlacedFighter,
      onTileClick,
      onMoveKingTo,
      onSwitchLane,
    };
  }, [
    selectedShopFighterId,
    selectedPlacedInstanceId,
    isMoveMode,
    onSelectPlacedFighter,
    onTileClick,
    onMoveKingTo,
    onSwitchLane,
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let timerId: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = parent.clientWidth * dpr;
      canvas.height = parent.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    const ro = new ResizeObserver(handleResize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const screenToBoard = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const cssW = rect.width;
      const cssH = rect.height;
      const scale = Math.min((cssW - 24) / BOARD_W, (cssH - 24) / BOARD_H);
      const offsetX = (cssW - BOARD_W * scale) / 2;
      const offsetY = (cssH - BOARD_H * scale) / 2;
      const bx = (clientX - rect.left - offsetX) / scale;
      const by = (clientY - rect.top - offsetY) / scale;
      return { bx, by };
    };

    const onPointerMove = (e: MouseEvent) => {
      const { bx, by } = screenToBoard(e.clientX, e.clientY);
      const gx = Math.floor((bx - GRID_LEFT + CELL_W / 2) / CELL_W);
      const gy = getRowFromBoardY(by);
      if (
        gx >= 0 &&
        gx < ECONOMY_CONFIG.gridCols &&
        gy >= 0 &&
        gy < ECONOMY_CONFIG.gridRows
      ) {
        hoverCellRef.current = { gridX: gx, gridY: gy };
      } else {
        hoverCellRef.current = null;
      }
    };

    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      const { bx, by } = screenToBoard(e.clientX, e.clientY);
      if (bx >= 10 && bx <= BOARD_W - 10 && by >= 15 && by <= BOARD_H - 15) {
        propsRef.current.onMoveKingTo(bx, by);
      }
    };

    const onPointerDown = (e: MouseEvent) => {
      const state = matchRef.current;
      const lane = state.lanes[state.activeViewedLaneId] ?? state.lanes[0];
      const { bx, by } = screenToBoard(e.clientX, e.clientY);

      // Right-click or Shift+Click always moves the Hero King
      if (e.button === 2 || e.shiftKey) {
        e.preventDefault();
        if (bx >= 10 && bx <= BOARD_W - 10 && by >= 15 && by <= BOARD_H - 15) {
          propsRef.current.onMoveKingTo(bx, by);
        }
        return;
      }

      // During BATTLE Phase, left-clicking anywhere on the arena moves the Hero King!
      if (state.phase === 'BATTLE' && lane.teamId === 0) {
        if (bx >= 10 && bx <= BOARD_W - 10 && by >= 15 && by <= BOARD_H - 15) {
          propsRef.current.onMoveKingTo(bx, by);
        }
        return;
      }

      const gx = Math.floor((bx - GRID_LEFT + CELL_W / 2) / CELL_W);
      const gy = getRowFromBoardY(by);

      if (
        gx >= 0 &&
        gx < ECONOMY_CONFIG.gridCols &&
        gy >= 0 &&
        gy < ECONOMY_CONFIG.gridRows
      ) {
        const existing = lane.placedFighters.find(
          (p) => p.gridX === gx && p.gridY === gy
        );
        const {
          selectedShopFighterId: shopId,
          selectedPlacedInstanceId: placedId,
          isMoveMode: moving,
        } = propsRef.current;

        if (moving && placedId) {
          propsRef.current.onTileClick(gx, gy);
          return;
        }
        if (existing) {
          propsRef.current.onSelectPlacedFighter(existing.instanceId);
          return;
        }
        if (shopId && lane.isHuman && state.phase === 'BUILD') {
          propsRef.current.onTileClick(gx, gy);
          return;
        }
        propsRef.current.onSelectPlacedFighter(null);
      } else if (bx >= 10 && bx <= BOARD_W - 10 && by >= 15 && by <= BOARD_H - 15) {
        // Clicking outside the build grid moves the Hero King
        propsRef.current.onMoveKingTo(bx, by);
      }
    };

    canvas.addEventListener('mousemove', onPointerMove);
    canvas.addEventListener('mousedown', onPointerDown);
    canvas.addEventListener('contextmenu', onContextMenu);

    const renderFrame = () => {
      if (cancelled) return;
      const rect = canvas.getBoundingClientRect();
      const cssW = rect.width;
      const cssH = rect.height;

      ctx.clearRect(0, 0, cssW, cssH);

      ctx.fillStyle = '#080C15';
      ctx.fillRect(0, 0, cssW, cssH);

      const state = matchRef.current;
      const lane = state.lanes[state.activeViewedLaneId] ?? state.lanes[0];
      const scale = Math.min((cssW - 24) / BOARD_W, (cssH - 24) / BOARD_H);
      const offsetX = (cssW - BOARD_W * scale) / 2;
      const offsetY = (cssH - BOARD_H * scale) / 2;

      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.scale(scale, scale);

      drawLaneBoard(ctx, state, lane, hoverCellRef.current, propsRef.current);

      ctx.restore();

      timerId = setTimeout(renderFrame, 30);
    };

    renderFrame();

    return () => {
      cancelled = true;
      if (timerId) clearTimeout(timerId);
      ro.disconnect();
      canvas.removeEventListener('mousemove', onPointerMove);
      canvas.removeEventListener('mousedown', onPointerDown);
      canvas.removeEventListener('contextmenu', onContextMenu);
    };
  }, [matchRef]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#080C15]">
      <canvas
        ref={canvasRef}
        data-testid="battlefield-canvas"
        aria-label="Tactical Battlefield Arena"
        className="w-full h-full block cursor-crosshair"
      />
    </div>
  );
};

function drawLaneBoard(
  ctx: CanvasRenderingContext2D,
  state: MatchState,
  lane: LaneState,
  hoverCell: { gridX: number; gridY: number } | null,
  uiState: {
    selectedShopFighterId: string | null;
    selectedPlacedInstanceId: string | null;
    isMoveMode: boolean;
  }
) {
  const king = state.kings[lane.teamId];

  // 1. Outer Stone Bastion Frame
  ctx.fillStyle = '#0E1525';
  ctx.strokeStyle = lane.teamId === 0 ? '#1E3A8A' : '#7F1D1D';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(6, 6, BOARD_W - 12, BOARD_H - 12, 10);
  ctx.fill();
  ctx.stroke();

  // 2. Top Breach Portal Zone (y: 14..150)
  const portalGrad = ctx.createLinearGradient(0, 14, 0, 150);
  portalGrad.addColorStop(0, 'rgba(127, 29, 29, 0.38)');
  portalGrad.addColorStop(1, 'rgba(15, 23, 42, 0.05)');
  ctx.fillStyle = portalGrad;
  ctx.fillRect(14, 14, BOARD_W - 28, 136);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '600 10px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  const wave = WAVE_MAP[state.waveNumber] ?? WAVE_MAP[1];
  ctx.fillText(
    `BREACH GATE · WAVE ${state.waveNumber}: ${wave.name.toUpperCase()} (${wave.count}x ${wave.enemyName})`,
    BOARD_W / 2,
    28
  );

  // During BUILD phase, preview incoming wave formation
  if (state.phase === 'BUILD') {
    for (let i = 0; i < Math.min(15, wave.count); i++) {
      const col = i % 5;
      const row = Math.floor(i / 5);
      const px = 85 + col * 65;
      const py = 52 + row * 26;
      ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
      ctx.strokeStyle = 'rgba(248, 113, 113, 0.6)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(px, py, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    if (wave.bossUnit) {
      ctx.fillStyle = 'rgba(220, 38, 38, 0.45)';
      ctx.strokeStyle = '#FACC15';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(BOARD_W / 2, 48, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }

  // 3. Mid-Arena Clash Bridge Divider
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.14)';
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(24, 295);
  ctx.lineTo(BOARD_W - 24, 295);
  ctx.stroke();
  ctx.setLineDash([]);

  // 4. Draw Citadel Sanctuary Healing Aura Ring around Main Base (215, 512)
  ctx.save();
  ctx.beginPath();
  ctx.rect(10, 10, BOARD_W - 20, BOARD_H - 20);
  ctx.clip();

  const auraGrad = ctx.createRadialGradient(
    KING_CONFIG.citadelX,
    KING_CONFIG.citadelY,
    18,
    KING_CONFIG.citadelX,
    KING_CONFIG.citadelY,
    king.healingAuraRadius
  );
  auraGrad.addColorStop(0, 'rgba(34, 197, 94, 0.22)');
  auraGrad.addColorStop(0.75, 'rgba(34, 197, 94, 0.08)');
  auraGrad.addColorStop(1, 'rgba(34, 197, 94, 0.0)');
  ctx.fillStyle = auraGrad;
  ctx.beginPath();
  ctx.arc(KING_CONFIG.citadelX, KING_CONFIG.citadelY, king.healingAuraRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(74, 222, 128, 0.38)';
  ctx.lineWidth = 1.4;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.arc(KING_CONFIG.citadelX, KING_CONFIG.citadelY, king.healingAuraRadius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  // 5. Tactical Placement Grid (7 cols x 6 rows with dedicated Backline Corridor)
  for (let r = 0; r < ECONOMY_CONFIG.gridRows; r++) {
    for (let c = 0; c < ECONOMY_CONFIG.gridCols; c++) {
      const cx = GRID_LEFT + c * CELL_W;
      const cy = getRowCenterY(r);
      const left = cx - CELL_W / 2 + 2;
      const top = cy - CELL_H / 2 + 2;
      const w = CELL_W - 4;
      const h = CELL_H - 4;

      const isHovered = hoverCell?.gridX === c && hoverCell?.gridY === r;
      const isFrontline = r < 6;

      if (state.phase === 'BUILD') {
        ctx.fillStyle = isHovered
          ? 'rgba(245, 158, 11, 0.24)'
          : isFrontline
          ? 'rgba(30, 41, 59, 0.62)'
          : 'rgba(15, 23, 42, 0.68)';
        ctx.strokeStyle = isHovered
          ? '#F59E0B'
          : isFrontline
          ? 'rgba(148, 163, 184, 0.22)'
          : 'rgba(56, 189, 248, 0.18)';
        ctx.lineWidth = isHovered ? 1.8 : 1;
        ctx.beginPath();
        ctx.roundRect(left, top, w, h, 4);
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.07)';
        ctx.lineWidth = 1;
        ctx.strokeRect(left, top, w, h);
      }
    }
  }

  if (state.phase === 'BUILD') {
    ctx.fillStyle = 'rgba(148, 163, 184, 0.55)';
    ctx.font = '600 9px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('VANGUARD FRONTLINE (TANK / MELEE)', 20, GRID_TOP - 24);
    ctx.fillText(
      'ARTILLERY BACKLINE (RANGED / SUPPORT)',
      20,
      getRowCenterY(5) + CELL_H / 2 + 14
    );
  }

  // 6. Bottom Main Base / Citadel Core (Nhà Chính) at (KING_CONFIG.citadelX, KING_CONFIG.citadelY)
  const citadelGrad = ctx.createLinearGradient(0, KING_CONFIG.citadelY - 36, 0, BOARD_H - 12);
  citadelGrad.addColorStop(0, 'rgba(16, 185, 129, 0.12)');
  citadelGrad.addColorStop(1, 'rgba(30, 58, 138, 0.35)');
  ctx.fillStyle = citadelGrad;
  ctx.fillRect(14, KING_CONFIG.citadelY - 36, BOARD_W - 28, 72);

  const citX = KING_CONFIG.citadelX;
  const citY = KING_CONFIG.citadelY;

  // Octagonal Citadel Core Fortress Icon
  ctx.fillStyle = '#0F172A';
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI / 4) * i + Math.PI / 8;
    const px = citX + Math.cos(a) * 18;
    const py = citY + Math.sin(a) * 18;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#38BDF8';
  ctx.font = '700 8.5px "Cinzel", serif';
  ctx.textAlign = 'center';
  ctx.fillText('CITADEL', citX, citY + 3);

  // Citadel Core HP Bar & Healing Aura Label
  const citHpPct = Math.max(0, Math.min(1, king.citadelHp / king.citadelMaxHp));
  ctx.fillStyle = '#1E293B';
  ctx.fillRect(citX - 95, citY - 26, 190, 5);
  ctx.fillStyle = citHpPct > 0.4 ? '#38BDF8' : '#EF4444';
  ctx.fillRect(citX - 95, citY - 26, 190 * citHpPct, 5);

  ctx.fillStyle = '#4ADE80';
  ctx.font = '600 8.5px "JetBrains Mono", monospace';
  ctx.textAlign = 'right';
  ctx.fillText(`AURA +${king.healingAuraHps} HP/s`, BOARD_W - 22, citY + 22);

  // 7. Draw Placed Fighters in BUILD Phase
  if (state.phase === 'BUILD') {
    for (const placed of lane.placedFighters) {
      const cfg = FIGHTER_MAP[placed.fighterId];
      if (!cfg) continue;
      const ux = GRID_LEFT + placed.gridX * CELL_W;
      const uy = getRowCenterY(placed.gridY);
      const isSelected = uiState.selectedPlacedInstanceId === placed.instanceId;

      if (isSelected) {
        const rangePx = cfg.attackRange === 1 ? 42 : 45 + cfg.attackRange * 40;
        ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(ux, uy, rangePx, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      drawFighterToken(
        ctx,
        ux,
        uy,
        cfg.tier === 2 ? 13 : 10.5,
        cfg.color,
        cfg.accentColor,
        cfg.tier === 2,
        isSelected
      );

      ctx.fillStyle = '#F8FAFC';
      ctx.font = '600 8.5px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(cfg.name.split(' ')[0], ux, uy + 14);
    }

    if (hoverCell && uiState.selectedShopFighterId && lane.isHuman) {
      const shopCfg = FIGHTER_MAP[uiState.selectedShopFighterId];
      const occupied = lane.placedFighters.some(
        (p) => p.gridX === hoverCell.gridX && p.gridY === hoverCell.gridY
      );
      if (shopCfg && !occupied) {
        const gx = GRID_LEFT + hoverCell.gridX * CELL_W;
        const gy = getRowCenterY(hoverCell.gridY);
        const rangePx = shopCfg.attackRange === 1 ? 42 : 45 + shopCfg.attackRange * 40;
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(gx, gy, rangePx, 0, Math.PI * 2);
        ctx.stroke();

        ctx.globalAlpha = 0.65;
        drawFighterToken(ctx, gx, gy, 10.5, shopCfg.color, shopCfg.accentColor, false, true);
        ctx.globalAlpha = 1.0;
      }
    }
  } else {
    // Draw Active Combat Units
    for (const unit of lane.combatUnits) {
      if (unit.hasLeaked) continue;
      if (unit.isDead && unit.koTimer <= 0) continue;
      drawCombatUnit(ctx, unit);
    }

    for (const proj of lane.projectiles) {
      ctx.fillStyle = proj.color;
      ctx.beginPath();
      ctx.arc(proj.x, proj.y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 8. Draw King Skill Shockwave Effects
  if (lane.skillEffects) {
    for (const fx of lane.skillEffects) {
      const progress = 1 - fx.ttl / fx.maxTtl;
      const currentRadius = fx.radius * (0.35 + 0.65 * progress);
      ctx.save();
      ctx.globalAlpha = Math.max(0, fx.ttl / fx.maxTtl);
      ctx.strokeStyle = fx.color;
      ctx.fillStyle = fx.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(fx.x, fx.y, currentRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = Math.max(0, (fx.ttl / fx.maxTtl) * 0.18);
      ctx.fill();
      ctx.restore();
    }
  }

  // 9. Draw Freely Controllable HERO KING (or Respawn Countdown Seal when Dead)
  drawHeroKingOnBoard(ctx, king);

  // 10. Draw Floating Damage & Status Numbers
  for (const ft of lane.floatingTexts) {
    ctx.globalAlpha = Math.max(0, Math.min(1, ft.ttl / ft.maxTtl));
    ctx.fillStyle = ft.color;
    ctx.font = ft.isCrit
      ? '700 11.5px "JetBrains Mono", monospace'
      : '600 10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(ft.text, ft.x, ft.y);
    ctx.globalAlpha = 1.0;
  }
}

function drawHeroKingOnBoard(ctx: CanvasRenderingContext2D, king: MatchState['kings'][0]) {
  if (king.isDead || king.status === 'FALLEN') {
    const rx = KING_CONFIG.spawnX;
    const ry = KING_CONFIG.spawnY;
    const fx = king.fallenX ?? rx;
    const fy = king.fallenY ?? ry;

    // 1. If King fell away from spawn, draw Fallen Sovereign Kneeling Crest & Spirit Tether to Citadel
    if (Math.hypot(fx - rx, fy - ry) > 18) {
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.lineTo(rx, ry);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = 'rgba(124, 45, 18, 0.65)';
      ctx.strokeStyle = '#FB923C';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(fx, fy, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FDBA74';
      ctx.font = '700 8px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('FALLEN', fx, fy + 3);
    }

    // 2. Draw Rebirth Ritual Altar & Progress Ring at Spawn (215, 455)
    const progress = Math.max(
      0,
      Math.min(1, 1 - king.respawnTimer / Math.max(1, king.maxRespawnTime))
    );

    ctx.fillStyle = 'rgba(249, 115, 22, 0.18)';
    ctx.strokeStyle = 'rgba(249, 115, 22, 0.35)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(rx, ry, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Radial Rebirth Progress Arc
    ctx.strokeStyle = '#FACC15';
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.arc(rx, ry, 22, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
    ctx.stroke();

    ctx.fillStyle = '#FDE047';
    ctx.font = '700 9.5px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`FALLEN ${king.respawnTimer.toFixed(1)}s`, rx, ry + 3);

    // Hold-the-Base Garrison Alert Banner above Rebirth Seal
    ctx.fillStyle = '#4ADE80';
    ctx.font = '700 8.5px "JetBrains Mono", monospace';
    ctx.fillText('HOLD THE BASE (+20% DEF SPD)', rx, ry - 27);
    return;
  }

  // Waypoint guidance line if King is moving to a target
  if (king.targetX !== null && king.targetY !== null) {
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(king.x, king.y);
    ctx.lineTo(king.targetX, king.targetY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = '#FBBF24';
    ctx.beginPath();
    ctx.arc(king.targetX, king.targetY, 5, 0, Math.PI * 2);
    ctx.stroke();
  }

  const nowSec = performance.now() * 0.001;
  const isMoving = (king.moveAnimTimer ?? 0) > 0 || king.targetX !== null;
  const facing = king.facingAngle ?? Math.PI;
  const strideCycle = nowSec * (isMoving ? 11.0 : 2.8);
  const strideSin = Math.sin(strideCycle);
  const bobY = isMoving ? -Math.abs(Math.sin(strideCycle)) * 3.5 : Math.sin(strideCycle) * 1.0;

  // Animated Stride Wake Ring when Hero King is moving
  if (isMoving) {
    const ripple = (nowSec * 2.4) % 1;
    ctx.strokeStyle = `rgba(56, 189, 248, ${(1 - ripple) * 0.65})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(king.x, king.y, 14 + ripple * 12, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Subtle attack range ring around Hero King
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.24)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(king.x, king.y, king.attackRange, 0, Math.PI * 2);
  ctx.stroke();

  ctx.save();
  ctx.translate(king.x, king.y + bobY);

  // Directional Royal Cape & Striding Boots in local facing space
  ctx.save();
  ctx.rotate(-facing + Math.PI);

  // Flowing Royal Mantle / Cape behind King
  ctx.fillStyle = '#1D4ED8';
  ctx.beginPath();
  ctx.moveTo(-9, 4);
  ctx.lineTo(9, 4);
  ctx.lineTo(11 + strideSin * (isMoving ? 3.5 : 1), 18 + (isMoving ? 3 : 0));
  ctx.lineTo(-11 + strideSin * (isMoving ? 3.5 : 1), 18 + (isMoving ? 3 : 0));
  ctx.closePath();
  ctx.fill();

  // Alternating Left & Right Golden Sabaton War-Boots during movement
  const leftFootOffset = isMoving ? strideSin * 7.5 : 0;
  const rightFootOffset = isMoving ? -strideSin * 7.5 : 0;
  ctx.fillStyle = '#FDE047';
  ctx.strokeStyle = '#0F172A';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.roundRect(-9.5, -14 + leftFootOffset, 6, 8, 2);
  ctx.roundRect(3.5, -14 + rightFootOffset, 6, 8, 2);
  ctx.fill();
  ctx.stroke();

  // Swinging Sunfire Greatsword (Right) & Aegis Shield (Left)
  const armSwing = isMoving ? -strideSin * 5.5 : Math.sin(nowSec * 3) * 1.5;
  ctx.fillStyle = '#38BDF8';
  ctx.beginPath();
  ctx.moveTo(13, -4 + armSwing);
  ctx.lineTo(17, -18 + armSwing);
  ctx.lineTo(10, -14 + armSwing);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#F59E0B';
  ctx.strokeStyle = '#FEF08A';
  ctx.beginPath();
  ctx.roundRect(-17, -8 - armSwing * 0.7, 5, 13, 2);
  ctx.fill();
  ctx.stroke();

  ctx.restore();

  // Hero King Golden Sovereign Token
  ctx.fillStyle = '#F59E0B';
  ctx.strokeStyle = '#FEF08A';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, 0, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#090D16';
  ctx.font = '800 8.5px "Cinzel", serif';
  ctx.textAlign = 'center';
  ctx.fillText('KING', 0, 3);
  ctx.restore();

  // Hero King HP & Shield Bar
  const barW = 38;
  const barH = 4.5;
  const bx = king.x - barW / 2;
  const by = king.y - 26;

  ctx.fillStyle = '#0F172A';
  ctx.fillRect(bx, by, barW, barH);

  const hpPct = Math.max(0, Math.min(1, king.hp / king.maxHp));
  ctx.fillStyle = '#FBBF24';
  ctx.fillRect(bx, by, barW * hpPct, barH);

  if (king.shield > 0) {
    const shieldPct = Math.min(1, king.shield / king.maxHp);
    ctx.fillStyle = '#38BDF8';
    ctx.fillRect(bx, by - 3, barW * shieldPct, 2.5);
  }
}

function drawFighterToken(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  fill: string,
  stroke: string,
  isTier2: boolean,
  isSelected: boolean
) {
  if (isSelected) {
    ctx.strokeStyle = '#FBBF24';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(x, y, radius + 4, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = isTier2 ? 2.2 : 1.5;
  ctx.beginPath();
  if (isTier2) {
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
  } else {
    ctx.arc(x, y, radius, 0, Math.PI * 2);
  }
  ctx.fill();
  ctx.stroke();
}

function drawCombatUnit(ctx: CanvasRenderingContext2D, unit: CombatUnit) {
  ctx.save();
  if (unit.isDead && unit.koTimer > 0) {
    ctx.globalAlpha = Math.max(0.1, unit.koTimer / 0.35);
  }

  const fill = unit.hitFlashTimer > 0 ? '#FFFFFF' : unit.color;
  const stroke = unit.isMercenary
    ? '#C084FC'
    : unit.isBoss
    ? '#FACC15'
    : unit.accentColor;

  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = unit.isBoss ? 2.5 : 1.5;

  ctx.beginPath();
  ctx.arc(unit.x, unit.y, unit.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  const isStunned = unit.statusEffects.some((s) => s.type === 'Stun');
  const isBurning = unit.statusEffects.some((s) => s.type === 'Burn');
  if (isStunned || isBurning) {
    ctx.strokeStyle = isStunned ? '#38BDF8' : '#F97316';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(unit.x, unit.y, unit.radius + 3, 0, Math.PI * 2);
    ctx.stroke();
  }

  if (!unit.isDead) {
    const barW = unit.isBoss ? 38 : 26;
    const barH = 4;
    const bx = unit.x - barW / 2;
    const by = unit.y - unit.radius - 8;

    ctx.fillStyle = '#0F172A';
    ctx.fillRect(bx, by, barW, barH);

    const hpPct = Math.max(0, Math.min(1, unit.hp / unit.maxHp));
    ctx.fillStyle = unit.side === 'DEFENDER' ? '#22C55E' : '#EF4444';
    ctx.fillRect(bx, by, barW * hpPct, barH);

    if (unit.shield > 0) {
      const shieldPct = Math.min(1, unit.shield / unit.maxHp);
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(bx, by - 2.5, barW * shieldPct, 2);
    }
  }

  ctx.restore();
}
