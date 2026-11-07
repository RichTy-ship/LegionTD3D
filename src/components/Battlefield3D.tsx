import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  AnimState3D,
  animateAsset3DModel,
  createAstralAnomalyOrPortal3DModel,
  createBattlefieldProp3DModel,
  createBreachGate3DModel,
  createCampaignOrCommander3DModel,
  createCelestialWonderOrPantheon3DModel,
  createCitadel3DModel,
  createCitadelArmoryOrRoyalRelic3DModel,
  createCitadelSuperweaponOrApex420Model,
  createCompanionSpiritOrBallistic3DModel,
  createCounterMatrixOrRole3DModel,
  createEconomyOrFinale3DModel,
  createElementalTitanOrSovereignAvatar3DModel,
  createEnemyOrMerc3DModel,
  createFactionSanctum3DModel,
  createFighter3DModel,
  createHeroKing3DModel,
  createKingSkillOrUpgrade3DModel,
  createLegionSpell3DModel,
  createMythiumQuarry3DModel,
  createMythiumWorker3DModel,
  createSynergyOrStatus3DModel,
  createTacticalOrdnance3DModel,
  createTier2AscensionOrWatchtower3DModel,
  createWarBannerRadarOrFlak3DModel,
  createWarMachineOrConvoyEngine3DModel,
  createWaveEnemy3DModel,
  getFastPart,
  getRunicAuraTexture,
  sculptAndSmoothAssetGroup,
} from '../game/assets3d';
import { ECONOMY_CONFIG, FIGHTER_MAP, getWaveConfig, KING_CONFIG } from '../game/config';
import { collectLootDrop } from '../game/engine';
import { MatchState } from '../game/types';

interface Battlefield3DProps {
  matchRef: React.MutableRefObject<MatchState>;
  selectedShopFighterId: string | null;
  selectedPlacedInstanceId: string | null;
  isMoveMode: boolean;
  onSelectPlacedFighter: (instanceId: string | null) => void;
  onTileClick: (gridX: number, gridY: number) => void;
  onMoveKingTo: (targetX: number, targetY: number) => void;
  onOpenAssetStudio: () => void;
}

type CameraPreset =
  | 'ISOMETRIC'
  | 'AUTO_ACTION'
  | 'KING_FOLLOW'
  | 'TOP_TACTICAL'
  | 'CITADEL_CLOSE';

const BOARD_W = 430;
const BOARD_H = 1100; // Doubled map length (550 -> 1100 board units = 71.5 3D world units)
const GRID_LEFT = 45;
const GRID_TOP = 340;
const CELL_W = 55;
const CELL_H = 42;
const BACKLINE_GAP = 28;
const WORLD_SCALE = 0.065; // Maps 430x1100 board into ~28 x 71.5 3D world units

function boardToWorld(bx: number, by: number): { wx: number; wz: number } {
  return {
    wx: (bx - BOARD_W / 2) * WORLD_SCALE,
    wz: (by - BOARD_H / 2) * WORLD_SCALE,
  };
}

function worldToBoard(wx: number, wz: number): { bx: number; by: number } {
  return {
    bx: wx / WORLD_SCALE + BOARD_W / 2,
    by: wz / WORLD_SCALE + BOARD_H / 2,
  };
}

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

// Pre-allocated math helpers outside render loop (Zero GC)
const _camTargetPos = new THREE.Vector3();
const _camLookTarget = new THREE.Vector3();
const _rayMouse = new THREE.Vector2();
const _planeIntersect = new THREE.Vector3();

export const Battlefield3D: React.FC<Battlefield3DProps> = ({
  matchRef,
  selectedShopFighterId,
  selectedPlacedInstanceId,
  isMoveMode,
  onSelectPlacedFighter,
  onTileClick,
  onMoveKingTo,
  onOpenAssetStudio,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('ISOMETRIC');
  const presetRef = useRef<CameraPreset>('ISOMETRIC');
  const [fpsDisplay, setFpsDisplay] = useState<number>(60);
  const [zoomPercent, setZoomPercent] = useState<number>(100);
  const [fpsBoostMode, setFpsBoostMode] = useState<boolean>(false);
  const fpsBoostRef = useRef<boolean>(false);
  const targetZoomRef = useRef<number>(1.0);
  const currentZoomRef = useRef<number>(1.0);
  const panOffsetRef = useRef<{ x: number; z: number }>({ x: 0, z: 0 });

  const propsRef = useRef({
    selectedShopFighterId,
    selectedPlacedInstanceId,
    isMoveMode,
    onSelectPlacedFighter,
    onTileClick,
    onMoveKingTo,
  });
  propsRef.current = {
    selectedShopFighterId,
    selectedPlacedInstanceId,
    isMoveMode,
    onSelectPlacedFighter,
    onTileClick,
    onMoveKingTo,
  };

  const handleSelectCameraPreset = (preset: CameraPreset) => {
    setCameraPreset(preset);
    presetRef.current = preset;
    panOffsetRef.current = { x: 0, z: 0 };
  };

  const handleStepZoom = (delta: number) => {
    const next = Math.max(0.55, Math.min(1.6, targetZoomRef.current + delta));
    targetZoomRef.current = next;
    setZoomPercent(Math.round((1 / next) * 100));
  };

  const handleResetCamera = () => {
    targetZoomRef.current = 1.0;
    panOffsetRef.current = { x: 0, z: 0 };
    setZoomPercent(100);
  };

  const handleToggleFpsBoost = () => {
    setFpsBoostMode((prev) => {
      const next = !prev;
      fpsBoostRef.current = next;
      return next;
    });
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Software WebGL Detection (SwiftShader / llvmpipe / Basic Render)
    const isSoftwareGl = (() => {
      const probeCanvas = document.createElement('canvas');
      const gl = probeCanvas.getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const initRect = container.getBoundingClientRect();
    renderer.setSize(Math.max(300, initRect.width), Math.max(300, initRect.height));
    renderer.domElement.dataset.testid = 'battlefield-canvas';
    renderer.domElement.setAttribute('aria-label', '3D Tactical Battlefield Arena');
    renderer.domElement.className = 'w-full h-full block cursor-crosshair';

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#070B14');
    scene.fog = new THREE.FogExp2('#070B14', 0.0085);

    // 2. Studio Environment Map via RoomEnvironment + PMREMGenerator
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 3. Camera & OrbitControls
    const camera = new THREE.PerspectiveCamera(
      42,
      Math.max(1, initRect.width) / Math.max(1, initRect.height),
      0.5,
      260
    );
    camera.position.set(0, 38, 40);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2 - 0.08;
    controls.minDistance = 10;
    controls.maxDistance = 95;
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN,
    };
    controls.enabled = false; // Preset camera smooth damping handles framing; middle-wheel zooms

    // 4. 3-Point Warm/Cool Studio Lighting Rig
    const hemiLight = new THREE.HemisphereLight('#38BDF8', '#0F172A', 0.85);
    hemiLight.position.set(0, 36, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight('#FFFBEB', 2.2);
    keyLight.position.set(16, 36, 16);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.left = -22;
    keyLight.shadow.camera.right = 22;
    keyLight.shadow.camera.top = 42;
    keyLight.shadow.camera.bottom = -42;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight('#60A5FA', 1.1);
    rimLight.position.set(-18, 22, -26);
    scene.add(rimLight);

    // Dynamic PointLight tracking Hero King & Active Skills
    const kingPointLight = new THREE.PointLight('#FBBF24', 2.4, 18, 1.5);
    kingPointLight.position.set(0, 3.2, 16);
    scene.add(kingPointLight);

    // 5. Natural Canyon Bridge Terrain & Instanced Crystal Outcrops
    const terrainGroup = new THREE.Group();
    scene.add(terrainGroup);

    // Abyssal Lava/Void Floor below Bridge
    const abyssGeo = new THREE.PlaneGeometry(150, 190);
    const abyssMat = new THREE.MeshStandardMaterial({
      color: '#050811',
      roughness: 0.9,
      metalness: 0.1,
    });
    const abyssMesh = new THREE.Mesh(abyssGeo, abyssMat);
    abyssMesh.rotation.x = -Math.PI / 2;
    abyssMesh.position.y = -1.2;
    terrainGroup.add(abyssMesh);

    // Phase-Reactive Glowing Magma / Aether Veins in the Canyon Abyss
    const lavaVeinMat = new THREE.MeshStandardMaterial({
      color: '#EA580C',
      emissive: '#EA580C',
      emissiveIntensity: 1.35,
      roughness: 0.35,
      metalness: 0.2,
      transparent: true,
      opacity: 0.85,
    });
    const lavaVeinGeo = new THREE.PlaneGeometry(3.2, 76);
    for (const side of [-1, 1]) {
      const vein = new THREE.Mesh(lavaVeinGeo, lavaVeinMat);
      vein.rotation.x = -Math.PI / 2;
      vein.position.set(side * 16.8, -1.12, 0);
      terrainGroup.add(vein);
    }

    // Main Bastion Stone Bridge Causeway
    const bridgeW = BOARD_W * WORLD_SCALE;
    const bridgeH = BOARD_H * WORLD_SCALE;
    const bridgeGeo = new THREE.BoxGeometry(bridgeW, 1.2, bridgeH);
    const bridgeMat = new THREE.MeshStandardMaterial({
      color: '#0F172A',
      roughness: 0.72,
      metalness: 0.25,
    });
    const bridgeMesh = new THREE.Mesh(bridgeGeo, bridgeMat);
    bridgeMesh.position.y = -0.6;
    bridgeMesh.receiveShadow = true;
    terrainGroup.add(bridgeMesh);

    // Golden Bridge Side Curbs
    const curbGeo = new THREE.BoxGeometry(0.45, 0.35, bridgeH);
    const curbMat = new THREE.MeshStandardMaterial({
      color: '#334155',
      roughness: 0.45,
      metalness: 0.65,
    });
    for (const side of [-1, 1]) {
      const curb = new THREE.Mesh(curbGeo, curbMat);
      curb.position.set(side * (bridgeW / 2 + 0.2), 0.12, 0);
      curb.receiveShadow = true;
      terrainGroup.add(curb);
    }

    // Natural Outer Canyon Basalt Rocks & Crystal Outcrops (InstancedMesh > 20 items across doubled 71.5-unit canyon)
    const rockCount = 64;
    const rockGeo = new THREE.DodecahedronGeometry(1.1, 0);
    const rockMat = new THREE.MeshStandardMaterial({
      color: '#1E293B',
      roughness: 0.78,
      metalness: 0.22,
    });
    const rockInstanced = new THREE.InstancedMesh(rockGeo, rockMat, rockCount);
    const dummy = new THREE.Object3D();
    const rockColor = new THREE.Color();
    for (let i = 0; i < rockCount; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const zSpread = ((i / rockCount) - 0.5) * (bridgeH + 10);
      const xOffset = side * (bridgeW / 2 + 2.4 + (i % 3) * 1.4);
      const scaleVar = 0.85 + ((i * 7) % 5) * 0.12;
      dummy.position.set(xOffset, -0.3 + scaleVar * 0.35, zSpread);
      dummy.rotation.set((i * 0.5) % Math.PI, (i * 1.1) % Math.PI, 0);
      dummy.scale.set(scaleVar, scaleVar * 1.35, scaleVar);
      dummy.updateMatrix();
      rockInstanced.setMatrixAt(i, dummy.matrix);
      rockColor.setHSL(0.6, 0.25, 0.12 + (i % 4) * 0.03);
      rockInstanced.setColorAt(i, rockColor);
    }
    rockInstanced.instanceMatrix.needsUpdate = true;
    if (rockInstanced.instanceColor) rockInstanced.instanceColor.needsUpdate = true;
    rockInstanced.computeBoundingSphere();
    terrainGroup.add(rockInstanced);
    sculptAndSmoothAssetGroup(terrainGroup);

    // 6. Tactical 7x6 Placement Grid Tiles (Shared Materials for Zero Per-Frame Material Mutation)
    const gridGroup = new THREE.Group();
    scene.add(gridGroup);
    const tileMeshes: { mesh: THREE.Mesh; gx: number; gy: number; isFrontline: boolean }[] = [];

    const tileGeo = new THREE.PlaneGeometry(
      (CELL_W - 5) * WORLD_SCALE,
      (CELL_H - 4) * WORLD_SCALE
    );
    const frontlineTileMat = new THREE.MeshStandardMaterial({
      color: '#1E293B',
      emissive: '#1E3A8A',
      emissiveIntensity: 0.18,
      roughness: 0.55,
      metalness: 0.35,
      transparent: true,
      opacity: 0.88,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    const backlineTileMat = new THREE.MeshStandardMaterial({
      color: '#172554',
      emissive: '#0369A1',
      emissiveIntensity: 0.24,
      roughness: 0.55,
      metalness: 0.35,
      transparent: true,
      opacity: 0.88,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    const hoveredTileMat = new THREE.MeshStandardMaterial({
      color: '#F59E0B',
      roughness: 0.4,
      metalness: 0.5,
      transparent: true,
      opacity: 0.92,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });

    for (let r = 0; r < ECONOMY_CONFIG.gridRows; r++) {
      for (let c = 0; c < ECONOMY_CONFIG.gridCols; c++) {
        const bx = GRID_LEFT + c * CELL_W;
        const by = getRowCenterY(r);
        const { wx, wz } = boardToWorld(bx, by);
        const isFrontline = r < 6;
        const tileMesh = new THREE.Mesh(
          tileGeo,
          isFrontline ? frontlineTileMat : backlineTileMat
        );
        tileMesh.rotation.x = -Math.PI / 2;
        tileMesh.position.set(wx, 0.02, wz);
        tileMesh.receiveShadow = true;
        tileMesh.matrixAutoUpdate = false;
        tileMesh.updateMatrix();
        gridGroup.add(tileMesh);
        tileMeshes.push({ mesh: tileMesh, gx: c, gy: r, isFrontline });
      }
    }

    // 7. Permanent 3D Monuments: Breach Gate (North) & Citadel Sanctuary Core (South)
    const gatePos = boardToWorld(BOARD_W / 2, 26);
    const breachGate3D = createBreachGate3DModel();
    breachGate3D.position.set(gatePos.wx, 0, gatePos.wz);
    scene.add(breachGate3D);

    const citadelPos = boardToWorld(KING_CONFIG.citadelX, KING_CONFIG.citadelY);
    const citadel3D = createCitadel3DModel(0);
    citadel3D.position.set(citadelPos.wx, 0, citadelPos.wz);
    scene.add(citadel3D);

    // 7b. Mythium Crystal Quarry & 3D Automaton Workers on West Sanctuary Flank
    const quarryPos = { wx: -8.6, wz: citadelPos.wz - 1.4 };
    const mythiumQuarry3D = createMythiumQuarry3DModel();
    mythiumQuarry3D.position.set(quarryPos.wx, 0, quarryPos.wz);
    scene.add(mythiumQuarry3D);

    const maxVisibleWorkers = 8;
    const worker3DPool: THREE.Group[] = [];
    for (let i = 0; i < maxVisibleWorkers; i++) {
      const wModel = createMythiumWorker3DModel();
      wModel.scale.setScalar(0.85);
      wModel.visible = false;
      scene.add(wModel);
      worker3DPool.push(wModel);
    }

    // 7c. Batch 6 Active Legion Spell Shrine on East Sanctuary Flank
    const spellShrinePos = { wx: 8.6, wz: citadelPos.wz - 1.4 };
    const spellShrine3D = createLegionSpell3DModel('spell_golden_age');
    spellShrine3D.position.set(spellShrinePos.wx, 0, spellShrinePos.wz);
    scene.add(spellShrine3D);

    // 7d. Batch 7 Perimeter Flame Brazier Towers & Hold-the-Base Garrison War Totem (Distributed along the doubled 71.5-unit causeway)
    const brazierPositions = [
      { wx: -12.6, wz: -24.5 },
      { wx: 12.6, wz: -24.5 },
      { wx: -12.6, wz: -11.5 },
      { wx: 12.6, wz: -11.5 },
      { wx: -12.6, wz: 3.5 },
      { wx: 12.6, wz: 3.5 },
      { wx: -12.6, wz: 17.5 },
      { wx: 12.6, wz: 17.5 },
    ];
    const brazierFlames: THREE.Object3D[] = [];
    for (const bp of brazierPositions) {
      const brazier = createBattlefieldProp3DModel('prop_brazier_pyre');
      brazier.position.set(bp.wx, 0, bp.wz);
      scene.add(brazier);
      const flame = getFastPart(brazier, 'weaponArm');
      if (flame) brazierFlames.push(flame);
    }

    const garrisonTotem3D = createBattlefieldProp3DModel('prop_garrison_totem');
    garrisonTotem3D.position.set(0, 0, 2.2);
    garrisonTotem3D.visible = false;
    scene.add(garrisonTotem3D);

    // 7e. Batch 8 Faction Elemental Sanctum Monument on West Tactical Flank
    const factionSanctumHolder = new THREE.Group();
    factionSanctumHolder.position.set(-12.6, 0, 2.2);
    factionSanctumHolder.scale.setScalar(0.82);
    scene.add(factionSanctumHolder);
    let currentSanctumFaction = 'Inferno';
    let activeFactionSanctum3D = createFactionSanctum3DModel(currentSanctumFaction);
    factionSanctumHolder.add(activeFactionSanctum3D);

    // 7f. Batch 9 2v2 Ally Reinforcement Warp Gate on East Tactical Flank
    const allyWarpGate3D = createKingSkillOrUpgrade3DModel('vfx_ally_reinforce_gate');
    allyWarpGate3D.position.set(12.6, 0, 2.2);
    allyWarpGate3D.scale.setScalar(0.82);
    scene.add(allyWarpGate3D);

    // 7g. Batch 10 Mythium Mercenary Rift Pod beside Northern Breach Gate (East Side)
    const mercRiftPod3D = createTacticalOrdnance3DModel('ord_merc_droppod');
    mercRiftPod3D.position.set(gatePos.wx + 5.2, 0, gatePos.wz + 1.2);
    mercRiftPod3D.scale.setScalar(0.9);
    scene.add(mercRiftPod3D);

    // 7h. Batch 13 Active Lane Commander Statue beside Northern Breach Gate (West Side)
    const commanderStatueHolder = new THREE.Group();
    commanderStatueHolder.position.set(gatePos.wx - 5.2, 0, gatePos.wz + 1.2);
    commanderStatueHolder.scale.setScalar(0.88);
    scene.add(commanderStatueHolder);
    let currentCommanderLaneId = 0;
    let activeCommanderStatue3D = createCampaignOrCommander3DModel('cmd_statue_player');
    commanderStatueHolder.add(activeCommanderStatue3D);

    // 7i. Batch 12 Faction Synergy Totem Banner on Frontline West Guard Post
    const synergyBannerHolder = new THREE.Group();
    synergyBannerHolder.position.set(-12.6, 0, -14.8);
    synergyBannerHolder.scale.setScalar(0.85);
    scene.add(synergyBannerHolder);
    let currentSynergyRefId = 'syn_inferno';
    let activeSynergyBanner3D = createSynergyOrStatus3DModel(currentSynergyRefId);
    synergyBannerHolder.add(activeSynergyBanner3D);

    // 7j. Batch 15 Wave Phase Herald Monument on Frontline East Guard Post
    const waveHeraldHolder = new THREE.Group();
    waveHeraldHolder.position.set(12.6, 0, -14.8);
    waveHeraldHolder.scale.setScalar(0.82);
    scene.add(waveHeraldHolder);
    let currentWaveHeraldRef = 'phase_herald_early';
    let activeWaveHerald3D = createEconomyOrFinale3DModel(currentWaveHeraldRef);
    waveHeraldHolder.add(activeWaveHerald3D);

    // 7k. Batch 14 Wave Defense-Type Armor Bastion on South-East Guard Post
    const waveDefenseBastionHolder = new THREE.Group();
    waveDefenseBastionHolder.position.set(12.6, 0, 21.5);
    waveDefenseBastionHolder.scale.setScalar(0.8);
    scene.add(waveDefenseBastionHolder);
    let currentDefenseRef = 'def_bastion_light';
    let activeDefenseBastion3D = createCounterMatrixOrRole3DModel(currentDefenseRef);
    waveDefenseBastionHolder.add(activeDefenseBastion3D);

    // 7l. Batch 15 Economy Worker Tier Forge on South-West Guard Post
    const econForgeHolder = new THREE.Group();
    econForgeHolder.position.set(-12.6, 0, 21.5);
    econForgeHolder.scale.setScalar(0.8);
    scene.add(econForgeHolder);
    let currentEconForgeRef = 'econ_tier_1_camp';
    let activeEconForge3D = createEconomyOrFinale3DModel(currentEconForgeRef);
    econForgeHolder.add(activeEconForge3D);

    // 7m. Batch 16 Faction Bastion Watchtower on North-Mid West Bastion Ridge
    const watchtowerHolder = new THREE.Group();
    watchtowerHolder.position.set(-12.6, 0, -21.2);
    watchtowerHolder.scale.setScalar(0.78);
    scene.add(watchtowerHolder);
    let currentWatchtowerRef = 'watchtower_inferno';
    let activeWatchtower3D = createTier2AscensionOrWatchtower3DModel(currentWatchtowerRef);
    watchtowerHolder.add(activeWatchtower3D);

    // 7n. Batch 17 Astral Rift Portal on North-Mid East Bastion Ridge
    const astralPortalHolder = new THREE.Group();
    astralPortalHolder.position.set(12.6, 0, -21.2);
    astralPortalHolder.scale.setScalar(0.78);
    scene.add(astralPortalHolder);
    let currentAstralRef = 'astral_rift_aether';
    let activeAstralPortal3D = createAstralAnomalyOrPortal3DModel(currentAstralRef);
    astralPortalHolder.add(activeAstralPortal3D);

    // 7o. Batch 18 Citadel Royal Siege Ballista & Sanctuary Fountain flanking the Citadel Core
    const citadelBallista3D = createCitadelArmoryOrRoyalRelic3DModel('citadel_armory_ballista');
    citadelBallista3D.position.set(citadelPos.wx - 4.4, 0, citadelPos.wz + 0.6);
    citadelBallista3D.scale.setScalar(0.78);
    citadelBallista3D.rotation.y = Math.PI;
    scene.add(citadelBallista3D);

    const citadelFountain3D = createCitadelArmoryOrRoyalRelic3DModel(
      'citadel_armory_healing_fountain'
    );
    citadelFountain3D.position.set(citadelPos.wx + 4.4, 0, citadelPos.wz + 0.6);
    citadelFountain3D.scale.setScalar(0.78);
    scene.add(citadelFountain3D);

    // 7p. Batch 19 Faction War-Chariot & Royal Guardian Mech flanking Sanctuary Inner Ring
    const convoyChariotHolder = new THREE.Group();
    convoyChariotHolder.position.set(-8.6, 0, citadelPos.wz - 5.2);
    convoyChariotHolder.scale.setScalar(0.75);
    scene.add(convoyChariotHolder);
    let currentConvoyRef = 'convoy_chariot_inferno';
    let activeConvoyChariot3D = createWarMachineOrConvoyEngine3DModel(currentConvoyRef);
    convoyChariotHolder.add(activeConvoyChariot3D);

    const royalMech3D = createWarMachineOrConvoyEngine3DModel('royal_mech_vanguard');
    royalMech3D.position.set(8.6, 0, citadelPos.wz - 5.2);
    royalMech3D.scale.setScalar(0.75);
    royalMech3D.rotation.y = Math.PI;
    scene.add(royalMech3D);

    // 7q. Batch 20 Primordial Genesis Idol & #300 Supreme Pantheon Monument on Northern Citadel Overlook
    const primordialIdolHolder = new THREE.Group();
    primordialIdolHolder.position.set(-8.8, 0, gatePos.wz + 1.2);
    primordialIdolHolder.scale.setScalar(0.76);
    scene.add(primordialIdolHolder);
    let currentPrimordialRef = 'primordial_idol_inferno';
    let activePrimordialIdol3D = createCelestialWonderOrPantheon3DModel(currentPrimordialRef);
    primordialIdolHolder.add(activePrimordialIdol3D);

    const supremePantheon3D = createCelestialWonderOrPantheon3DModel(
      'celestial_wonder_300_supreme_pantheon'
    );
    supremePantheon3D.position.set(8.8, 0, gatePos.wz + 1.2);
    supremePantheon3D.scale.setScalar(0.74);
    scene.add(supremePantheon3D);

    // 7r. Batch 21 Scrying Radar Array & Quad-Barrel Flak Battery on Tactical Grid Mid-Flanks
    const radarArrayHolder = new THREE.Group();
    radarArrayHolder.position.set(-12.6, 0, -6.2);
    radarArrayHolder.scale.setScalar(0.74);
    scene.add(radarArrayHolder);
    let currentRadarRef = 'radar_array_inferno';
    let activeRadarArray3D = createWarBannerRadarOrFlak3DModel(currentRadarRef);
    radarArrayHolder.add(activeRadarArray3D);

    const flakBatteryHolder = new THREE.Group();
    flakBatteryHolder.position.set(12.6, 0, -6.2);
    flakBatteryHolder.scale.setScalar(0.74);
    scene.add(flakBatteryHolder);
    let currentFlakRef = 'flak_battery_inferno';
    let activeFlakBattery3D = createWarBannerRadarOrFlak3DModel(currentFlakRef);
    flakBatteryHolder.add(activeFlakBattery3D);

    // 7s. Batch 22 Faction Elemental Avatar & #360 Eternal Sovereign Shrine on Southern Sanctuary Flanks
    const elementalAvatarHolder = new THREE.Group();
    elementalAvatarHolder.position.set(-12.6, 0, 9.8);
    elementalAvatarHolder.scale.setScalar(0.74);
    scene.add(elementalAvatarHolder);
    let currentAvatarRef = 'elemental_avatar_inferno';
    let activeElementalAvatar3D = createElementalTitanOrSovereignAvatar3DModel(currentAvatarRef);
    elementalAvatarHolder.add(activeElementalAvatar3D);

    const eternalSovereign3D = createElementalTitanOrSovereignAvatar3DModel(
      'sovereign_avatar_360_eternal_bastion'
    );
    eternalSovereign3D.position.set(12.6, 0, 9.8);
    eternalSovereign3D.scale.setScalar(0.72);
    scene.add(eternalSovereign3D);

    // 7t. Batch 23 Companion Spirit Familiar & Batch 24 Citadel Superweapon + #420 Omniverse Sanctuary
    const spiritFamiliarHolder = new THREE.Group();
    spiritFamiliarHolder.scale.setScalar(0.55);
    scene.add(spiritFamiliarHolder);
    let currentSpiritRef = 'spirit_familiar_inferno';
    let activeSpiritFamiliar3D = createCompanionSpiritOrBallistic3DModel(currentSpiritRef);
    spiritFamiliarHolder.add(activeSpiritFamiliar3D);

    const citadelSuperweaponHolder = new THREE.Group();
    citadelSuperweaponHolder.position.set(-12.6, 0, 15.2);
    citadelSuperweaponHolder.scale.setScalar(0.72);
    scene.add(citadelSuperweaponHolder);
    let currentSuperweaponRef = 'citadel_superweapon_inferno';
    let activeSuperweapon3D = createCitadelSuperweaponOrApex420Model(currentSuperweaponRef);
    citadelSuperweaponHolder.add(activeSuperweapon3D);

    const omniverseApex420 = createCitadelSuperweaponOrApex420Model(
      'apex_420_omniverse_bastion_citadel'
    );
    omniverseApex420.position.set(12.6, 0, 15.2);
    omniverseApex420.scale.setScalar(0.7);
    scene.add(omniverseApex420);

    // Citadel Healing Aura Ground Disc
    const auraDiscGeo = new THREE.PlaneGeometry(1, 1);
    const auraDiscMat = new THREE.MeshBasicMaterial({
      map: getRunicAuraTexture(),
      transparent: true,
      depthWrite: false,
      opacity: 0.85,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    });
    const auraDiscMesh = new THREE.Mesh(auraDiscGeo, auraDiscMat);
    auraDiscMesh.rotation.x = -Math.PI / 2;
    auraDiscMesh.position.set(citadelPos.wx, 0.04, citadelPos.wz);
    scene.add(auraDiscMesh);

    // 8. Hero King 3D Model, Stride Wake Ring, Waypoint Beacon & Fallen Rebirth Ring
    const heroKing3D = createHeroKing3DModel(0);
    heroKing3D.rotation.y = Math.PI;
    scene.add(heroKing3D);

    let prevKingX = matchRef.current.kings[0].x;
    let prevKingY = matchRef.current.kings[0].y;
    let kingWalkHoldTimer = 0;
    let currentKingYaw = Math.PI;

    const strideWakeGeo = new THREE.RingGeometry(0.95, 1.38, 28);
    const strideWakeMat = new THREE.MeshBasicMaterial({
      color: '#38BDF8',
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.72,
    });
    const kingStrideWakeRing = new THREE.Mesh(strideWakeGeo, strideWakeMat);
    kingStrideWakeRing.rotation.x = -Math.PI / 2;
    kingStrideWakeRing.visible = false;
    scene.add(kingStrideWakeRing);

    const kingWaypointBeacon3D = new THREE.Group();
    const wpRingMesh = new THREE.Mesh(
      new THREE.RingGeometry(0.45, 0.72, 24),
      new THREE.MeshBasicMaterial({
        color: '#FBBF24',
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
      })
    );
    wpRingMesh.rotation.x = -Math.PI / 2;
    wpRingMesh.position.y = 0.06;
    const wpCrystalMesh = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.26, 0),
      new THREE.MeshBasicMaterial({ color: '#FEF08A' })
    );
    wpCrystalMesh.position.y = 0.65;
    kingWaypointBeacon3D.add(wpRingMesh, wpCrystalMesh);
    kingWaypointBeacon3D.visible = false;
    scene.add(kingWaypointBeacon3D);

    const rebirthRingGeo = new THREE.RingGeometry(1.1, 1.45, 32);
    const rebirthRingMat = new THREE.MeshBasicMaterial({
      color: '#F97316',
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    const rebirthRingMesh = new THREE.Mesh(rebirthRingGeo, rebirthRingMat);
    rebirthRingMesh.rotation.x = -Math.PI / 2;
    rebirthRingMesh.position.set(citadelPos.wx, 0.08, citadelPos.wz - 3.5);
    rebirthRingMesh.visible = false;
    scene.add(rebirthRingMesh);

    // 9. Dynamic Unit & VFX Containers (Object-Pooled by ID for Zero GC)
    const unitsRoot = new THREE.Group();
    scene.add(unitsRoot);
    const unitMeshMap = new Map<
      string,
      {
        group: THREE.Group;
        defId: string;
        bodyPivot?: THREE.Object3D;
        weaponArm?: THREE.Object3D;
      }
    >();

    const vfxRoot = new THREE.Group();
    scene.add(vfxRoot);
    const skillMeshMap = new Map<string, THREE.Group>();
    const lootMeshMap = new Map<string, THREE.Group>();
    const projMeshMap = new Map<string, THREE.Mesh>();
    const projLastPosMap = new Map<string, { wx: number; wz: number; color: string }>();
    const projPool: THREE.Mesh[] = [];
    const sharedProjGeo = new THREE.ConeGeometry(0.18, 0.56, 14);
    sharedProjGeo.rotateX(Math.PI / 2);
    const projMatCache = new Map<string, THREE.MeshBasicMaterial>();
    const getProjMat = (color: string) => {
      let m = projMatCache.get(color);
      if (!m) {
        m = new THREE.MeshBasicMaterial({ color });
        projMatCache.set(color, m);
      }
      return m;
    };

    // Pooled 3D Volumetric Particle Burst System (Zero GC in Combat Loop)
    const maxParticles = 72;
    const sharedParticleGeo = new THREE.OctahedronGeometry(0.13, 0);
    const particlePool: {
      mesh: THREE.Mesh;
      vx: number;
      vy: number;
      vz: number;
      ttl: number;
      maxTtl: number;
    }[] = [];
    for (let i = 0; i < maxParticles; i++) {
      const pMesh = new THREE.Mesh(sharedParticleGeo, getProjMat('#FBBF24'));
      pMesh.visible = false;
      vfxRoot.add(pMesh);
      particlePool.push({ mesh: pMesh, vx: 0, vy: 0, vz: 0, ttl: 0, maxTtl: 0.45 });
    }
    let particleCursor = 0;
    const spawnParticleBurst = (
      wx: number,
      wy: number,
      wz: number,
      color: string,
      count: number,
      speedScale = 1.0
    ) => {
      if (fpsBoostRef.current) return;
      const mat = getProjMat(color);
      for (let i = 0; i < count; i++) {
        const p = particlePool[particleCursor % maxParticles];
        particleCursor++;
        const angle = (Math.PI * 2 * i) / count + (particleCursor % 5) * 0.2;
        const speed = (1.8 + (i % 3) * 1.1) * speedScale;
        p.mesh.material = mat;
        p.mesh.position.set(wx, wy, wz);
        p.mesh.scale.setScalar(1.0);
        p.mesh.visible = true;
        p.vx = Math.cos(angle) * speed;
        p.vy = (2.2 + (i % 4) * 0.7) * speedScale;
        p.vz = Math.sin(angle) * speed;
        p.maxTtl = 0.38 + (i % 3) * 0.08;
        p.ttl = p.maxTtl;
      }
    };

    // Pre-warm shaders on GPU
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // 10. Raycasting, Mouse-Wheel Zoom & Middle/Alt-Drag Camera Panning
    const raycaster = new THREE.Raycaster();
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    let hoveredGrid: { gx: number; gy: number } | null = null;
    let isPanning = false;
    let panStartX = 0;
    let panStartY = 0;

    const getBoardCoordsFromEvent = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      _rayMouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      _rayMouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(_rayMouse, camera);
      const hit = raycaster.ray.intersectPlane(groundPlane, _planeIntersect);
      if (!hit) return null;
      return worldToBoard(hit.x, hit.z);
    };

    const onPointerMove = (e: MouseEvent) => {
      if (isPanning) {
        const dx = e.clientX - panStartX;
        const dy = e.clientY - panStartY;
        panStartX = e.clientX;
        panStartY = e.clientY;
        panOffsetRef.current.x = Math.max(-14, Math.min(14, panOffsetRef.current.x - dx * 0.038));
        panOffsetRef.current.z = Math.max(-32, Math.min(32, panOffsetRef.current.z - dy * 0.042));
        return;
      }

      const coords = getBoardCoordsFromEvent(e.clientX, e.clientY);
      if (!coords) {
        hoveredGrid = null;
        return;
      }
      const gx = Math.floor((coords.bx - GRID_LEFT + CELL_W / 2) / CELL_W);
      const gy = getRowFromBoardY(coords.by);
      if (
        gx >= 0 &&
        gx < ECONOMY_CONFIG.gridCols &&
        gy >= 0 &&
        gy < ECONOMY_CONFIG.gridRows
      ) {
        hoveredGrid = { gx, gy };
      } else {
        hoveredGrid = null;
      }
    };

    const onPointerDown = (e: MouseEvent) => {
      if (e.button === 1 || (e.button === 0 && e.altKey)) {
        e.preventDefault();
        isPanning = true;
        panStartX = e.clientX;
        panStartY = e.clientY;
        return;
      }

      const state = matchRef.current;
      const lane = state.lanes[state.activeViewedLaneId] ?? state.lanes[0];
      const coords = getBoardCoordsFromEvent(e.clientX, e.clientY);
      if (!coords) return;

      const { bx, by } = coords;

      // Click on any nearby 3D Loot Chest / Boss Relic to collect it immediately
      if (lane.lootDrops && lane.lootDrops.length > 0) {
        const clickedDrop = lane.lootDrops.find(
          (d) => Math.hypot(d.x - bx, d.y - by) <= 44
        );
        if (clickedDrop) {
          collectLootDrop(state, lane.laneId, clickedDrop.id);
          return;
        }
      }

      if (e.button === 2 || e.shiftKey) {
        e.preventDefault();
        if (bx >= 10 && bx <= BOARD_W - 10 && by >= 15 && by <= BOARD_H - 15) {
          propsRef.current.onMoveKingTo(bx, by);
        }
        return;
      }

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
        propsRef.current.onMoveKingTo(bx, by);
      }
    };

    const onPointerUp = () => {
      isPanning = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.08 : -0.08;
      const next = Math.max(0.45, Math.min(1.85, targetZoomRef.current + delta));
      targetZoomRef.current = next;
      setZoomPercent(Math.round((1 / next) * 100));
    };

    const onContextMenu = (e: MouseEvent) => e.preventDefault();

    renderer.domElement.addEventListener('mousemove', onPointerMove);
    renderer.domElement.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mouseup', onPointerUp);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });
    renderer.domElement.addEventListener('contextmenu', onContextMenu);

    const ro = new ResizeObserver(() => {
      const r = container.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        camera.aspect = r.width / r.height;
        camera.updateProjectionMatrix();
        renderer.setSize(r.width, r.height);
      }
    });
    ro.observe(container);

    // 11. Render Loop with Software-WebGL `afterDraw` Pacing (per threejs/SKILL.md)
    const clock = new THREE.Clock();
    let frameId = 0;
    let cancelled = false;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
      if (gl.flush) gl.flush();
      if (!sync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const poll = () => {
        if (cancelled) return;
        const status = gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (status === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    let frameCounter = 0;
    let fpsAccumFrames = 0;
    let fpsAccumTime = 0;

    function syncSceneWithMatch(elapsed: number, dt: number) {
      frameCounter++;
      fpsAccumFrames++;
      fpsAccumTime += dt;
      if (fpsAccumTime >= 0.5) {
        const measured = Math.min(60, Math.max(24, Math.round(fpsAccumFrames / fpsAccumTime)));
        setFpsDisplay(measured);
        fpsAccumFrames = 0;
        fpsAccumTime = 0;
      }

      const state = matchRef.current;
      const lane = state.lanes[state.activeViewedLaneId] ?? state.lanes[0];
      const king = state.kings[lane.teamId];

      // Toggle shadows dynamically when FPS Boost Mode is active
      const wantShadows = !isSoftwareGl && !fpsBoostRef.current;
      if (renderer.shadowMap.enabled !== wantShadows) {
        renderer.shadowMap.enabled = wantShadows;
        keyLight.castShadow = wantShadows;
      }

      // O(1) Animate Citadel Crystal & Gimbal Rings
      const crystal = getFastPart(citadel3D, 'citadelCrystal');
      const gimbal = getFastPart(citadel3D, 'citadelGimbal');
      const innerRing = getFastPart(citadel3D, 'citadelInnerRing');
      if (crystal) {
        crystal.position.y = 2.85 + Math.sin(elapsed * 2.2) * 0.18;
        crystal.rotation.y = elapsed * 0.8;
      }
      if (gimbal) gimbal.rotation.z = elapsed * 1.1;
      if (innerRing) innerRing.rotation.x = elapsed * -1.4;

      // Scale Citadel Healing Aura Disc
      const auraWorldDiameter = king.healingAuraRadius * 2 * WORLD_SCALE;
      auraDiscMesh.scale.set(auraWorldDiameter, auraWorldDiameter, 1);
      auraDiscMesh.rotation.z = elapsed * 0.25;

      // O(1) Animate Northern Breach Vortex
      const vortex = getFastPart(breachGate3D, 'portalVortex');
      if (vortex) vortex.rotation.z = -elapsed * 1.5;

      // Fast Shared-Material Grid Tile Highlights (Zero Material Color Allocation)
      gridGroup.visible = state.phase === 'BUILD';
      if (state.phase === 'BUILD') {
        for (const item of tileMeshes) {
          const isHovered =
            hoveredGrid?.gx === item.gx && hoveredGrid?.gy === item.gy;
          const targetMat = isHovered
            ? hoveredTileMat
            : item.isFrontline
            ? frontlineTileMat
            : backlineTileMat;
          if (item.mesh.material !== targetMat) {
            item.mesh.material = targetMat;
          }
        }
      }

      // Update 3D Hero King Position, Pose, Relics & Fallen State
      const kPos = boardToWorld(
        king.isDead ? king.fallenX : king.x,
        king.isDead ? king.fallenY : king.y
      );
      heroKing3D.position.set(kPos.wx, 0, kPos.wz);

      // Sync Live 3D Relic Attachments on Hero King when Citadel Items are purchased
      const relicAnkh = getFastPart(heroKing3D, 'relicAnkh');
      const relicBanner = getFastPart(heroKing3D, 'relicBanner');
      const kingSwordBlade = getFastPart(heroKing3D, 'kingSwordBlade');
      if (relicAnkh) {
        relicAnkh.visible =
          king.inventory.includes('item_phoenix_ankh') ||
          king.inventory.includes('item_crown_of_haste') ||
          king.inventory.length >= 2;
        relicAnkh.rotation.z = elapsed * 1.8;
      }
      if (relicBanner) {
        relicBanner.visible =
          king.inventory.includes('item_bastion_banner') ||
          king.inventory.includes('item_sanctuary_core') ||
          king.inventory.length >= 3;
      }
      if (kingSwordBlade) {
        const hasUpgradedWeapon =
          king.inventory.includes('item_sunfire_blade') ||
          king.inventory.includes('item_soulreaver_scepter');
        kingSwordBlade.scale.set(
          hasUpgradedWeapon ? 1.35 : 1.0,
          hasUpgradedWeapon ? 1.25 : 1.0,
          0.35
        );
      }

      // Animate 3D Mythium Quarry & Automaton Workers proportional to lane.workers
      animateAsset3DModel(mythiumQuarry3D, 'IDLE', elapsed, { phaseOffset: 0.4 });
      const visibleWorkerCount = Math.min(maxVisibleWorkers, Math.max(1, lane.workers));
      for (let i = 0; i < maxVisibleWorkers; i++) {
        const wMesh = worker3DPool[i];
        if (i < visibleWorkerCount) {
          wMesh.visible = true;
          const orbitAngle = (Math.PI * 2 * i) / visibleWorkerCount + elapsed * 0.45;
          const radius = 2.45;
          wMesh.position.set(
            quarryPos.wx + Math.cos(orbitAngle) * radius,
            0,
            quarryPos.wz + Math.sin(orbitAngle) * radius
          );
          wMesh.rotation.y = -orbitAngle + Math.PI / 2;
          // Alternate between WALK and mining ATTACK swing per worker phase
          const workerAnimState: AnimState3D =
            Math.sin(elapsed * 2.2 + i * 1.4) > 0.15 ? 'ATTACK' : 'WALK';
          animateAsset3DModel(wMesh, workerAnimState, elapsed, {
            phaseOffset: i * 1.35,
            speed: 1.25,
          });
        } else {
          wMesh.visible = false;
        }
      }

      // Multi-Joint Procedural Animation & Directional Turning for 3D Hero King
      const kingDx = king.x - prevKingX;
      const kingDy = king.y - prevKingY;
      const kingStepDist = Math.hypot(kingDx, kingDy);
      prevKingX = king.x;
      prevKingY = king.y;

      let desiredKingYaw = king.facingAngle ?? currentKingYaw;
      if (kingStepDist > 0.03) {
        kingWalkHoldTimer = 0.25;
        desiredKingYaw = Math.atan2(kingDx, kingDy);
      } else if ((king.moveAnimTimer ?? 0) > 0 || king.targetX !== null) {
        kingWalkHoldTimer = Math.max(kingWalkHoldTimer, 0.18);
      } else {
        kingWalkHoldTimer = Math.max(0, kingWalkHoldTimer - dt);
      }

      const isKingMoving =
        kingWalkHoldTimer > 0 || (king.moveAnimTimer ?? 0) > 0 || king.targetX !== null;

      // Shortest-arc smooth yaw interpolation so Hero King turns naturally toward movement direction
      const yawDiff =
        ((desiredKingYaw - currentKingYaw + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      currentKingYaw += yawDiff * Math.min(1, dt * 14);
      heroKing3D.rotation.y = currentKingYaw;

      const hasActiveKingSkill = (lane.skillEffects?.length ?? 0) > 0;
      if (king.isDead || king.status === 'FALLEN') {
        animateAsset3DModel(heroKing3D, 'FALLEN', elapsed);
        kingStrideWakeRing.visible = false;
        kingWaypointBeacon3D.visible = false;

        rebirthRingMesh.visible = true;
        const spawnW = boardToWorld(KING_CONFIG.spawnX, KING_CONFIG.spawnY);
        rebirthRingMesh.position.set(spawnW.wx, 0.08, spawnW.wz);
        rebirthRingMesh.rotation.z = elapsed * 2.5;

        garrisonTotem3D.visible = true;
        animateAsset3DModel(garrisonTotem3D, 'SKILL', elapsed, { phaseOffset: 0.9 });
      } else {
        rebirthRingMesh.visible = false;
        garrisonTotem3D.visible = false;

        const atkCycleDuration = 1 / Math.max(0.3, king.attackSpeed);
        const isActivelySwinging =
          state.phase === 'BATTLE' &&
          king.attackCooldownTimer > atkCycleDuration * 0.48 &&
          !isKingMoving;

        let kingAnimState: AnimState3D = 'IDLE';
        if (state.phase === 'VICTORY') {
          kingAnimState = 'VICTORY';
        } else if (hasActiveKingSkill) {
          kingAnimState = 'SKILL';
        } else if (isKingMoving) {
          kingAnimState = 'WALK';
        } else if (isActivelySwinging || (state.phase === 'BATTLE' && king.attackCooldownTimer > 0)) {
          kingAnimState = 'ATTACK';
        }

        animateAsset3DModel(heroKing3D, kingAnimState, elapsed, {
          speed: kingAnimState === 'WALK' ? 1.38 : state.phase === 'BATTLE' ? 1.22 : 1.0,
        });

        // Animated 3D Stride Wake Ring under Hero King's boots while moving
        if (isKingMoving) {
          kingStrideWakeRing.visible = true;
          kingStrideWakeRing.position.set(kPos.wx, 0.05, kPos.wz);
          const pulse = 0.88 + ((elapsed * 2.6) % 1) * 0.65;
          kingStrideWakeRing.scale.setScalar(pulse);
          strideWakeMat.opacity = Math.max(0.15, (1 - ((elapsed * 2.6) % 1)) * 0.78);
        } else {
          kingStrideWakeRing.visible = false;
        }

        // Animated 3D Waypoint Target Beacon on the battlefield when Click-to-Move is active
        if (king.targetX !== null && king.targetY !== null) {
          const wpWorld = boardToWorld(king.targetX, king.targetY);
          kingWaypointBeacon3D.visible = true;
          kingWaypointBeacon3D.position.set(wpWorld.wx, 0, wpWorld.wz);
          wpRingMesh.scale.setScalar(0.85 + Math.sin(elapsed * 8) * 0.18);
          wpCrystalMesh.position.y = 0.58 + Math.sin(elapsed * 7) * 0.14;
          wpCrystalMesh.rotation.y = elapsed * 4.2;
        } else {
          kingWaypointBeacon3D.visible = false;
        }
      }

      // Determine Active Faction for Dynamic Monuments
      const shopFighterCfg = propsRef.current.selectedShopFighterId
        ? FIGHTER_MAP[propsRef.current.selectedShopFighterId]
        : null;
      const desiredFaction = shopFighterCfg?.faction ?? lane.selectedFaction ?? 'Inferno';

      // Batch 23 Companion Spirit Familiar Orbiting Hero King
      const desiredSpiritRef = `spirit_familiar_${desiredFaction.toLowerCase()}`;
      if (desiredSpiritRef !== currentSpiritRef) {
        currentSpiritRef = desiredSpiritRef;
        spiritFamiliarHolder.remove(activeSpiritFamiliar3D);
        activeSpiritFamiliar3D = createCompanionSpiritOrBallistic3DModel(currentSpiritRef);
        spiritFamiliarHolder.add(activeSpiritFamiliar3D);
      }
      spiritFamiliarHolder.position.set(
        kPos.wx + Math.cos(elapsed * 2.2) * 1.45,
        0.55 + Math.sin(elapsed * 3.6) * 0.18,
        kPos.wz + Math.sin(elapsed * 2.2) * 1.45
      );
      animateAsset3DModel(
        activeSpiritFamiliar3D,
        hasActiveKingSkill ? 'SKILL' : state.phase === 'BATTLE' ? 'ATTACK' : 'IDLE',
        elapsed,
        { phaseOffset: 0.7 }
      );

      // Batch 24 Faction Citadel Superweapon Turret & #420 Omniverse Sanctuary
      const desiredSuperweaponRef = `citadel_superweapon_${desiredFaction.toLowerCase()}`;
      if (desiredSuperweaponRef !== currentSuperweaponRef) {
        currentSuperweaponRef = desiredSuperweaponRef;
        citadelSuperweaponHolder.remove(activeSuperweapon3D);
        activeSuperweapon3D = createCitadelSuperweaponOrApex420Model(currentSuperweaponRef);
        citadelSuperweaponHolder.add(activeSuperweapon3D);
      }
      const monumentCombatState: AnimState3D = state.phase === 'BATTLE' ? 'ATTACK' : 'IDLE';
      animateAsset3DModel(activeSuperweapon3D, monumentCombatState, elapsed, { phaseOffset: 1.1 });
      animateAsset3DModel(
        omniverseApex420,
        state.phase === 'BATTLE' ? 'SKILL' : 'IDLE',
        elapsed,
        { phaseOffset: 2.2 }
      );

      // Secondary Perimeter Monument Animations (Throttled on alternate frames in FPS Boost Mode)
      const updatePerimeter = !fpsBoostRef.current || frameCounter % 2 === 0;
      if (updatePerimeter) {
        animateAsset3DModel(
          spellShrine3D,
          lane.activeSpellTimer > 0 ? 'SKILL' : 'IDLE',
          elapsed,
          { phaseOffset: 0.5 }
        );
        for (let i = 0; i < brazierFlames.length; i++) {
          const fl = brazierFlames[i];
          fl.rotation.y = elapsed * 2.2 + i;
          fl.position.y = 2.42 + Math.sin(elapsed * 6 + i * 1.5) * 0.08;
        }

        if (desiredFaction !== currentSanctumFaction) {
          currentSanctumFaction = desiredFaction;
          factionSanctumHolder.remove(activeFactionSanctum3D);
          activeFactionSanctum3D = createFactionSanctum3DModel(currentSanctumFaction);
          factionSanctumHolder.add(activeFactionSanctum3D);
        }
        animateAsset3DModel(activeFactionSanctum3D, 'IDLE', elapsed, { phaseOffset: 1.3 });

        const desiredSynergyRef = `syn_${desiredFaction.toLowerCase()}`;
        if (desiredSynergyRef !== currentSynergyRefId) {
          currentSynergyRefId = desiredSynergyRef;
          synergyBannerHolder.remove(activeSynergyBanner3D);
          activeSynergyBanner3D = createSynergyOrStatus3DModel(currentSynergyRefId);
          synergyBannerHolder.add(activeSynergyBanner3D);
        }
        animateAsset3DModel(activeSynergyBanner3D, 'IDLE', elapsed, { phaseOffset: 1.8 });

        if (state.activeViewedLaneId !== currentCommanderLaneId) {
          currentCommanderLaneId = state.activeViewedLaneId;
          const cmdRefMap: Record<number, string> = {
            0: 'cmd_statue_player',
            1: 'cmd_statue_ally',
            2: 'cmd_statue_kael',
            3: 'cmd_statue_vex',
          };
          commanderStatueHolder.remove(activeCommanderStatue3D);
          activeCommanderStatue3D = createCampaignOrCommander3DModel(
            cmdRefMap[currentCommanderLaneId] ?? 'cmd_statue_player'
          );
          commanderStatueHolder.add(activeCommanderStatue3D);
        }
        animateAsset3DModel(activeCommanderStatue3D, monumentCombatState, elapsed, {
          phaseOffset: 2.1,
        });

        const currentWaveCfg = getWaveConfig(state.waveNumber);
        const desiredWaveHerald =
          currentWaveCfg.category === 'Boss'
            ? 'phase_herald_boss'
            : state.waveNumber >= 14
            ? 'phase_herald_late'
            : state.waveNumber >= 7
            ? 'phase_herald_mid'
            : 'phase_herald_early';

        // Phase-Reactive Canyon Abyssal Lava / Aether Veins
        const veinHex = state.endlessMode
          ? '#A855F7'
          : currentWaveCfg.category === 'Boss'
          ? '#EF4444'
          : state.waveNumber >= 14
          ? '#F97316'
          : state.waveNumber >= 7
          ? '#06B6D4'
          : '#3B82F6';
        lavaVeinMat.color.set(veinHex);
        lavaVeinMat.emissive.set(veinHex);
        lavaVeinMat.emissiveIntensity = 1.15 + Math.sin(elapsed * 2.8) * 0.35;
        if (desiredWaveHerald !== currentWaveHeraldRef) {
          currentWaveHeraldRef = desiredWaveHerald;
          waveHeraldHolder.remove(activeWaveHerald3D);
          activeWaveHerald3D = createEconomyOrFinale3DModel(currentWaveHeraldRef);
          waveHeraldHolder.add(activeWaveHerald3D);
        }
        animateAsset3DModel(activeWaveHerald3D, 'IDLE', elapsed, { phaseOffset: 2.5 });

        const desiredDefRef = `def_bastion_${currentWaveCfg.defenseType.toLowerCase()}`;
        if (desiredDefRef !== currentDefenseRef) {
          currentDefenseRef = desiredDefRef;
          waveDefenseBastionHolder.remove(activeDefenseBastion3D);
          activeDefenseBastion3D = createCounterMatrixOrRole3DModel(desiredDefRef);
          waveDefenseBastionHolder.add(activeDefenseBastion3D);
        }
        animateAsset3DModel(activeDefenseBastion3D, 'IDLE', elapsed, { phaseOffset: 2.9 });

        const desiredEconRef =
          lane.workers >= 14
            ? 'econ_tier_4_nexus'
            : lane.workers >= 10
            ? 'econ_tier_3_refinery'
            : lane.workers >= 7
            ? 'econ_tier_2_foundry'
            : 'econ_tier_1_camp';
        if (desiredEconRef !== currentEconForgeRef) {
          currentEconForgeRef = desiredEconRef;
          econForgeHolder.remove(activeEconForge3D);
          activeEconForge3D = createEconomyOrFinale3DModel(currentEconForgeRef);
          econForgeHolder.add(activeEconForge3D);
        }
        animateAsset3DModel(activeEconForge3D, 'IDLE', elapsed, { phaseOffset: 3.2 });

        const desiredWatchtowerRef = `watchtower_${desiredFaction.toLowerCase()}`;
        if (desiredWatchtowerRef !== currentWatchtowerRef) {
          currentWatchtowerRef = desiredWatchtowerRef;
          watchtowerHolder.remove(activeWatchtower3D);
          activeWatchtower3D = createTier2AscensionOrWatchtower3DModel(desiredWatchtowerRef);
          watchtowerHolder.add(activeWatchtower3D);
        }
        animateAsset3DModel(activeWatchtower3D, monumentCombatState, elapsed, {
          phaseOffset: 3.6,
        });

        const desiredAstralRef =
          currentWaveCfg.category === 'Boss'
            ? 'astral_rift_crimson'
            : state.waveNumber >= 14
            ? 'astral_gravity_well'
            : state.waveNumber >= 7
            ? 'astral_eclipse_engine'
            : 'astral_rift_aether';
        if (desiredAstralRef !== currentAstralRef) {
          currentAstralRef = desiredAstralRef;
          astralPortalHolder.remove(activeAstralPortal3D);
          activeAstralPortal3D = createAstralAnomalyOrPortal3DModel(currentAstralRef);
          astralPortalHolder.add(activeAstralPortal3D);
        }
        animateAsset3DModel(
          activeAstralPortal3D,
          state.phase === 'BATTLE' ? 'SKILL' : 'IDLE',
          elapsed,
          { phaseOffset: 4.0 }
        );

        animateAsset3DModel(citadelBallista3D, monumentCombatState, elapsed, { phaseOffset: 4.3 });
        animateAsset3DModel(citadelFountain3D, 'IDLE', elapsed, { phaseOffset: 4.7 });

        const desiredConvoyRef = `convoy_chariot_${desiredFaction.toLowerCase()}`;
        if (desiredConvoyRef !== currentConvoyRef) {
          currentConvoyRef = desiredConvoyRef;
          convoyChariotHolder.remove(activeConvoyChariot3D);
          activeConvoyChariot3D = createWarMachineOrConvoyEngine3DModel(currentConvoyRef);
          convoyChariotHolder.add(activeConvoyChariot3D);
        }
        animateAsset3DModel(
          activeConvoyChariot3D,
          state.phase === 'BATTLE' ? 'WALK' : 'IDLE',
          elapsed,
          { phaseOffset: 5.1 }
        );
        animateAsset3DModel(royalMech3D, monumentCombatState, elapsed, { phaseOffset: 5.4 });

        const desiredPrimordialRef = `primordial_idol_${desiredFaction.toLowerCase()}`;
        if (desiredPrimordialRef !== currentPrimordialRef) {
          currentPrimordialRef = desiredPrimordialRef;
          primordialIdolHolder.remove(activePrimordialIdol3D);
          activePrimordialIdol3D = createCelestialWonderOrPantheon3DModel(currentPrimordialRef);
          primordialIdolHolder.add(activePrimordialIdol3D);
        }
        animateAsset3DModel(activePrimordialIdol3D, 'IDLE', elapsed, { phaseOffset: 5.8 });
        animateAsset3DModel(supremePantheon3D, 'IDLE', elapsed, { phaseOffset: 6.1 });

        const desiredRadarRef = `radar_array_${desiredFaction.toLowerCase()}`;
        if (desiredRadarRef !== currentRadarRef) {
          currentRadarRef = desiredRadarRef;
          radarArrayHolder.remove(activeRadarArray3D);
          activeRadarArray3D = createWarBannerRadarOrFlak3DModel(currentRadarRef);
          radarArrayHolder.add(activeRadarArray3D);
        }
        animateAsset3DModel(activeRadarArray3D, 'IDLE', elapsed, { phaseOffset: 6.4 });

        const desiredFlakRef = `flak_battery_${desiredFaction.toLowerCase()}`;
        if (desiredFlakRef !== currentFlakRef) {
          currentFlakRef = desiredFlakRef;
          flakBatteryHolder.remove(activeFlakBattery3D);
          activeFlakBattery3D = createWarBannerRadarOrFlak3DModel(currentFlakRef);
          flakBatteryHolder.add(activeFlakBattery3D);
        }
        animateAsset3DModel(activeFlakBattery3D, monumentCombatState, elapsed, {
          phaseOffset: 6.8,
        });

        const desiredAvatarRef = `elemental_avatar_${desiredFaction.toLowerCase()}`;
        if (desiredAvatarRef !== currentAvatarRef) {
          currentAvatarRef = desiredAvatarRef;
          elementalAvatarHolder.remove(activeElementalAvatar3D);
          activeElementalAvatar3D = createElementalTitanOrSovereignAvatar3DModel(currentAvatarRef);
          elementalAvatarHolder.add(activeElementalAvatar3D);
        }
        animateAsset3DModel(activeElementalAvatar3D, monumentCombatState, elapsed, {
          phaseOffset: 7.2,
        });
        animateAsset3DModel(eternalSovereign3D, 'IDLE', elapsed, { phaseOffset: 7.6 });
        animateAsset3DModel(
          allyWarpGate3D,
          state.phase === 'BATTLE' ? 'SKILL' : 'IDLE',
          elapsed,
          { phaseOffset: 8.0 }
        );

        const hasMercActivity =
          (lane.outboundMercenaries?.length ?? 0) > 0 ||
          (lane.inboundMercenaries?.length ?? 0) > 0;
        animateAsset3DModel(mercRiftPod3D, hasMercActivity ? 'SKILL' : 'IDLE', elapsed, {
          phaseOffset: 8.4,
        });
        mercRiftPod3D.position.y = hasMercActivity
          ? Math.abs(Math.sin(elapsed * 5)) * 0.35
          : 0;
      }

      // Sync Active Units (Build Phase Placed Fighters vs Battle Phase CombatUnits) with Multi-Joint Animation
      const activeIds = new Set<string>();
      let battleCenterZ = 1.5;
      let battleUnitCount = 0;

      if (state.phase === 'BUILD') {
        for (const placed of lane.placedFighters) {
          activeIds.add(placed.instanceId);
          let entry = unitMeshMap.get(placed.instanceId);
          if (!entry || entry.defId !== placed.fighterId) {
            if (entry) unitsRoot.remove(entry.group);
            const group = createFighter3DModel(placed.fighterId);
            unitsRoot.add(group);
            entry = {
              group,
              defId: placed.fighterId,
              bodyPivot: getFastPart(group, 'bodyPivot'),
              weaponArm: getFastPart(group, 'weaponArm'),
            };
            unitMeshMap.set(placed.instanceId, entry);
          }
          const bx = GRID_LEFT + placed.gridX * CELL_W;
          const by = getRowCenterY(placed.gridY);
          const { wx, wz } = boardToWorld(bx, by);
          entry.group.position.set(wx, 0, wz);
          entry.group.rotation.y = Math.PI;
          entry.group.rotation.x = 0;

          const isSelectedUnit = propsRef.current.selectedPlacedInstanceId === placed.instanceId;
          animateAsset3DModel(
            entry.group,
            isSelectedUnit ? 'VICTORY' : 'IDLE',
            elapsed,
            {
              phaseOffset: placed.gridX * 0.95 + placed.gridY * 1.4,
            }
          );
        }
      } else {
        let sumZ = 0;
        for (const unit of lane.combatUnits) {
          if (unit.hasLeaked || (unit.isDead && unit.koTimer <= 0)) continue;
          activeIds.add(unit.instanceId);
          let entry = unitMeshMap.get(unit.instanceId);
          if (!entry || entry.defId !== unit.definitionId) {
            if (entry) unitsRoot.remove(entry.group);
            const group =
              unit.side === 'DEFENDER'
                ? createFighter3DModel(unit.definitionId)
                : unit.isMercenary || unit.isBoss
                ? createEnemyOrMerc3DModel({
                    isBoss: unit.isBoss,
                    isMercenary: unit.isMercenary,
                    mercenaryId: unit.isMercenary ? unit.definitionId : undefined,
                    color: unit.color,
                  })
                : createWaveEnemy3DModel(state.waveNumber);
            unitsRoot.add(group);
            entry = {
              group,
              defId: unit.definitionId,
              bodyPivot: getFastPart(group, 'bodyPivot'),
              weaponArm: getFastPart(group, 'weaponArm'),
            };
            unitMeshMap.set(unit.instanceId, entry);
          }

          const { wx, wz } = boardToWorld(unit.x, unit.y);
          entry.group.position.set(wx, 0, wz);
          entry.group.rotation.y = unit.side === 'DEFENDER' ? Math.PI : 0;
          entry.group.rotation.x = 0;

          if (!unit.isDead) {
            sumZ += wz;
            battleUnitCount++;
          }

          let unitAnimState: AnimState3D = 'WALK';
          if (unit.isDead && unit.koTimer > 0) {
            unitAnimState = 'FALLEN';
          } else if (unit.hitFlashTimer > 0.06) {
            unitAnimState = 'HIT';
          } else if (
            unit.ability &&
            unit.ability.cooldown > 0 &&
            unit.abilityCooldownTimer > unit.ability.cooldown - 0.55
          ) {
            unitAnimState = 'SKILL';
          } else if (unit.targetId !== null && unit.attackCooldownTimer > 0) {
            unitAnimState = 'ATTACK';
          }

          animateAsset3DModel(entry.group, unitAnimState, elapsed, {
            phaseOffset: (unit.x * 0.13 + unit.y * 0.07) % 6.28,
            speed: Math.max(0.8, Math.min(1.6, unit.attackSpeed || 1.0)),
          });
        }
        if (battleUnitCount > 0) {
          battleCenterZ = sumZ / battleUnitCount;
        }
      }

      // Prune removed units
      for (const [id, entry] of unitMeshMap.entries()) {
        if (!activeIds.has(id)) {
          unitsRoot.remove(entry.group);
          unitMeshMap.delete(id);
        }
      }

      // Sync Batch 9 Volumetric 3D Hero King Active Skills ([Q], [E], [R]) + Dynamic PointLight
      kingPointLight.position.set(heroKing3D.position.x, 3.2, heroKing3D.position.z);
      kingPointLight.intensity = hasActiveKingSkill ? 4.2 : 2.1 + Math.sin(elapsed * 3.5) * 0.3;
      kingPointLight.color.set(
        hasActiveKingSkill ? '#38BDF8' : state.endlessMode ? '#C084FC' : '#FBBF24'
      );

      const activeSkillIds = new Set<string>();
      for (const fx of lane.skillEffects ?? []) {
        activeSkillIds.add(fx.id);
        let skillGroup = skillMeshMap.get(fx.id);
        if (!skillGroup) {
          const refId =
            fx.radius <= 115
              ? 'skill_q_royal_cleave'
              : fx.radius <= 140
              ? 'skill_e_sovereign_aegis'
              : 'skill_r_cataclysm_judgment';
          skillGroup = createKingSkillOrUpgrade3DModel(refId);
          vfxRoot.add(skillGroup);
          skillMeshMap.set(fx.id, skillGroup);
          const sPos = boardToWorld(fx.x, fx.y);
          spawnParticleBurst(sPos.wx, 0.6, sPos.wz, fx.color || '#38BDF8', 14, 1.35);
        }
        const { wx, wz } = boardToWorld(fx.x, fx.y);
        const progress = 1 - fx.ttl / fx.maxTtl;
        const scaleWorld = Math.max(0.55, (fx.radius * WORLD_SCALE * (0.4 + 0.6 * progress)) / 2.2);
        skillGroup.position.set(wx, 0.05, wz);
        skillGroup.scale.setScalar(scaleWorld);
        skillGroup.rotation.y = elapsed * 3.5;
      }
      for (const [id, skillGroup] of skillMeshMap.entries()) {
        if (!activeSkillIds.has(id)) {
          vfxRoot.remove(skillGroup);
          skillMeshMap.delete(id);
        }
      }

      // Sync 3D Monster Loot Chests & Boss Relic Drops on the Battlefield
      const activeLootIds = new Set<string>();
      for (const drop of lane.lootDrops ?? []) {
        activeLootIds.add(drop.id);
        let lootGroup = lootMeshMap.get(drop.id);
        if (!lootGroup) {
          lootGroup =
            drop.type === 'BOSS_RELIC'
              ? createCitadelArmoryOrRoyalRelic3DModel('royal_relic_aegis_grail')
              : createBattlefieldProp3DModel('prop_bounty_chest');
          vfxRoot.add(lootGroup);
          lootMeshMap.set(drop.id, lootGroup);
          const dPos = boardToWorld(drop.x, drop.y);
          spawnParticleBurst(dPos.wx, 0.5, dPos.wz, drop.color, 10, 1.1);
        }
        const { wx, wz } = boardToWorld(drop.x, drop.y);
        lootGroup.position.set(wx, 0.12 + Math.abs(Math.sin(elapsed * 4.2)) * 0.22, wz);
        lootGroup.scale.setScalar(drop.type === 'BOSS_RELIC' ? 0.95 : 0.78);
        lootGroup.rotation.y = elapsed * 2.4;
      }
      for (const [id, lootGroup] of lootMeshMap.entries()) {
        if (!activeLootIds.has(id)) {
          spawnParticleBurst(
            lootGroup.position.x,
            0.6,
            lootGroup.position.z,
            '#FDE047',
            8,
            1.15
          );
          vfxRoot.remove(lootGroup);
          lootMeshMap.delete(id);
        }
      }

      // Sync 3D Projectiles (Zero-Allocation Object Pool + Directional Trajectory & Impact Bursts)
      const activeProjIds = new Set<string>();
      for (const proj of lane.projectiles ?? []) {
        activeProjIds.add(proj.id);
        let mesh = projMeshMap.get(proj.id);
        const { wx, wz } = boardToWorld(proj.x, proj.y);
        if (!mesh) {
          mesh = projPool.pop() ?? new THREE.Mesh(sharedProjGeo, getProjMat(proj.color));
          mesh.material = getProjMat(proj.color);
          mesh.visible = true;
          vfxRoot.add(mesh);
          projMeshMap.set(proj.id, mesh);
        } else {
          const prev = projLastPosMap.get(proj.id);
          if (prev && (Math.abs(wx - prev.wx) > 0.01 || Math.abs(wz - prev.wz) > 0.01)) {
            mesh.rotation.y = Math.atan2(wx - prev.wx, wz - prev.wz);
          }
        }
        mesh.position.set(wx, 1.15, wz);
        projLastPosMap.set(proj.id, { wx, wz, color: proj.color });
      }
      for (const [id, mesh] of projMeshMap.entries()) {
        if (!activeProjIds.has(id)) {
          const lastPos = projLastPosMap.get(id);
          if (lastPos) {
            spawnParticleBurst(lastPos.wx, 1.05, lastPos.wz, lastPos.color, 5, 0.85);
            projLastPosMap.delete(id);
          }
          mesh.visible = false;
          vfxRoot.remove(mesh);
          projPool.push(mesh);
          projMeshMap.delete(id);
        }
      }

      // Tick Pooled 3D Volumetric Particle Bursts
      for (let i = 0; i < maxParticles; i++) {
        const p = particlePool[i];
        if (p.ttl > 0) {
          p.ttl -= dt;
          if (p.ttl <= 0) {
            p.mesh.visible = false;
          } else {
            p.mesh.position.x += p.vx * dt;
            p.mesh.position.y = Math.max(0.05, p.mesh.position.y + p.vy * dt);
            p.mesh.position.z += p.vz * dt;
            p.vy -= 6.5 * dt;
            p.mesh.rotation.x += dt * 8;
            p.mesh.rotation.y += dt * 10;
            p.mesh.scale.setScalar(Math.max(0.15, p.ttl / p.maxTtl));
          }
        }
      }

      // Smooth Exponential Camera Damping + Mouse-Wheel Zoom + Free Pan + Auto Action Framing
      currentZoomRef.current += (targetZoomRef.current - currentZoomRef.current) * Math.min(1, dt * 10);
      const zScale = currentZoomRef.current;
      const panX = panOffsetRef.current.x;
      const panZ = panOffsetRef.current.z;

      const preset = presetRef.current;
      if (preset === 'ISOMETRIC') {
        _camTargetPos.set(panX, 45.0 * zScale, 12.5 + 41.5 * zScale + panZ);
        _camLookTarget.set(panX, 0, 7.5 + panZ);
      } else if (preset === 'AUTO_ACTION') {
        const focusZ = state.phase === 'BATTLE' && battleUnitCount > 0 ? battleCenterZ : 6.0;
        _camTargetPos.set(panX, 32.0 * zScale, focusZ + 28.5 * zScale + panZ);
        _camLookTarget.set(panX, 0.5, focusZ + panZ);
      } else if (preset === 'KING_FOLLOW') {
        _camTargetPos.set(
          heroKing3D.position.x * 0.7 + panX,
          17.5 * zScale,
          heroKing3D.position.z + 15.5 * zScale + panZ
        );
        _camLookTarget.set(
          heroKing3D.position.x * 0.6 + panX,
          1.0,
          heroKing3D.position.z - 2.0 + panZ
        );
      } else if (preset === 'TOP_TACTICAL') {
        _camTargetPos.set(panX, 64.0 * zScale, 5.5 + 10.5 * zScale + panZ);
        _camLookTarget.set(panX, 0, 4.5 + panZ);
      } else if (preset === 'CITADEL_CLOSE') {
        _camTargetPos.set(panX, 15.5 * zScale, citadelPos.wz + 13.5 * zScale + panZ);
        _camLookTarget.set(panX, 1.5, citadelPos.wz - 2.5 + panZ);
      }

      const dampFactor = Math.min(1, dt * 7.5);
      camera.position.lerp(_camTargetPos, dampFactor);
      controls.target.lerp(_camLookTarget, dampFactor);
      camera.lookAt(controls.target);
    }

    function tick() {
      if (cancelled) return;
      const dt = Math.min(0.1, clock.getDelta());
      const elapsed = clock.getElapsedTime();

      syncSceneWithMatch(elapsed, dt);
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      ro.disconnect();
      renderer.domElement.removeEventListener('mousemove', onPointerMove);
      renderer.domElement.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mouseup', onPointerUp);
      renderer.domElement.removeEventListener('wheel', onWheel);
      renderer.domElement.removeEventListener('contextmenu', onContextMenu);
      controls.dispose();
      renderer.dispose();
    };
  }, [matchRef]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#070B14]">
      {/* Dedicated WebGL Mount Container */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Ultra-Compact Top-Left Camera Pill (~210px wide, zero collision on 900px screens) */}
      <div className="absolute top-1.5 left-1.5 z-20 flex items-center gap-0.5 bg-[#0C161E]/92 backdrop-blur-xs border border-[#243B4A] px-1 py-0.5 rounded shadow">
        {(
          [
            { id: 'ISOMETRIC', label: '3D' },
            { id: 'AUTO_ACTION', label: 'Auto' },
            { id: 'KING_FOLLOW', label: 'King' },
            { id: 'TOP_TACTICAL', label: 'Grid' },
            { id: 'CITADEL_CLOSE', label: 'Base' },
          ] as const
        ).map((cam) => (
          <button
            key={cam.id}
            type="button"
            data-testid={`cam-preset-${cam.id}`}
            onClick={(e) => {
              e.currentTarget.blur();
              handleSelectCameraPreset(cam.id);
            }}
            className={`px-1 py-0.5 rounded text-[9px] font-bold transition-colors whitespace-nowrap cursor-pointer ${
              cameraPreset === cam.id
                ? 'bg-[#D99B26] text-slate-950'
                : 'text-slate-300 hover:bg-[#192C38]'
            }`}
          >
            {cam.label}
          </button>
        ))}

        <button
          type="button"
          title="Reset Camera Zoom & Pan (Scroll wheel to zoom)"
          onClick={handleResetCamera}
          className="px-1 py-0.5 text-[9px] font-mono text-[#EAB308] cursor-pointer"
        >
          {zoomPercent}%
        </button>

        <button
          type="button"
          data-testid="toggle-fps-boost-btn"
          title="Toggle High-FPS Performance Mode"
          onClick={handleToggleFpsBoost}
          className={`px-1 py-0.5 rounded text-[9px] font-mono font-bold transition-colors whitespace-nowrap cursor-pointer ${
            fpsBoostMode
              ? 'bg-emerald-500 text-slate-950'
              : 'text-emerald-400 hover:bg-[#192C38]'
          }`}
        >
          {fpsDisplay}fps
        </button>

        <button
          type="button"
          data-testid="open-3d-forge-btn"
          onClick={(e) => {
            e.currentTarget.blur();
            onOpenAssetStudio();
          }}
          className="px-1.5 py-0.5 rounded bg-[#1D6B87] hover:bg-[#2584A6] text-white font-bold text-[9px] whitespace-nowrap cursor-pointer"
          title="Open 3D Asset Forge (420 Models)"
        >
          Forge
        </button>
      </div>
    </div>
  );
};
