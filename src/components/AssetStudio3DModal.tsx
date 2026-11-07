import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  ASSET_3D_CATALOG,
  AnimRig3D,
  AnimState3D,
  AssetBatchItem,
  animateAsset3DModel,
  createCatalogAsset3D,
} from '../game/assets3d';

interface AssetStudio3DModalProps {
  onClose: () => void;
}

type AnimPreviewMode = AnimState3D | 'AUTO';

const AUTO_CYCLE_STATES: AnimState3D[] = [
  'IDLE',
  'WALK',
  'ATTACK',
  'SKILL',
  'HIT',
  'VICTORY',
];

type BatchFilter =
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
  | 24
  | 'ALL';

export const AssetStudio3DModal: React.FC<AssetStudio3DModalProps> = ({ onClose }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<BatchFilter>('ALL');
  const [selectedAsset, setSelectedAsset] = useState<AssetBatchItem>(ASSET_3D_CATALOG[0]);
  const [explodedRatio, setExplodedRatio] = useState<number>(0);
  const [animMode, setAnimMode] = useState<AnimPreviewMode>('WALK');
  const [animSpeed, setAnimSpeed] = useState<number>(1.0);
  const [activeJoints, setActiveJoints] = useState<number>(10);
  const [dockCollapsed, setDockCollapsed] = useState<boolean>(false);

  const [selectedFaction, setSelectedFaction] = useState<string>('ALL');

  const stateRef = useRef({
    selectedAsset,
    explodedRatio,
    animMode,
    animSpeed,
  });
  stateRef.current = {
    selectedAsset,
    explodedRatio,
    animMode,
    animSpeed,
  };

  const syncAssetImmediateRef = useRef<((asset: AssetBatchItem) => void) | null>(null);

  useEffect(() => {
    syncAssetImmediateRef.current?.(selectedAsset);
  }, [selectedAsset]);

  const filteredAssets = ASSET_3D_CATALOG.filter((a) => {
    if (selectedBatch !== 'ALL' && a.batchNumber !== selectedBatch) return false;
    if (
      (selectedBatch === 2 || selectedBatch === 8 || selectedBatch === 12) &&
      selectedFaction !== 'ALL' &&
      a.faction !== selectedFaction
    ) {
      return false;
    }
    return true;
  });

  const handleSelectBatch = (batch: BatchFilter) => {
    setSelectedBatch(batch);
    setSelectedFaction('ALL');
    const first = ASSET_3D_CATALOG.find((a) => batch === 'ALL' || a.batchNumber === batch);
    if (first) setSelectedAsset(first);
  };

  const handleSelectFactionFilter = (fac: string) => {
    setSelectedFaction(fac);
    const first = ASSET_3D_CATALOG.find(
      (a) =>
        (selectedBatch === 'ALL' || a.batchNumber === selectedBatch) &&
        (fac === 'ALL' || a.faction === fac)
    );
    if (first) setSelectedAsset(first);
  };

  const handleStepAsset = (dir: -1 | 1) => {
    if (filteredAssets.length === 0) return;
    const idx = filteredAssets.findIndex((a) => a.id === selectedAsset.id);
    const nextIdx = (idx + dir + filteredAssets.length) % filteredAssets.length;
    setSelectedAsset(filteredAssets[nextIdx]);
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
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
    renderer.toneMappingExposure = 1.2;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const rect = container.getBoundingClientRect();
    renderer.setSize(Math.max(400, rect.width), Math.max(350, rect.height));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#070B14');
    scene.fog = new THREE.FogExp2('#070B14', 0.035);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(
      40,
      Math.max(1, rect.width) / Math.max(1, rect.height),
      0.1,
      100
    );
    camera.position.set(4.2, 3.6, 5.8);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1.3, 0);
    controls.enableDamping = !isSoftwareGl;
    controls.autoRotate = !isSoftwareGl;
    controls.autoRotateSpeed = 1.6;
    controls.maxPolarAngle = Math.PI / 2 - 0.04;
    controls.minDistance = 2.5;
    controls.maxDistance = 16;
    controls.update();

    // 3-Point Studio Lighting Rig
    const hemi = new THREE.HemisphereLight('#38BDF8', '#0F172A', 0.9);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight('#FFFBEB', 2.4);
    keyLight.position.set(6, 10, 6);
    keyLight.castShadow = !isSoftwareGl;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight('#F59E0B', 1.35);
    rimLight.position.set(-6, 5, -6);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight('#93C5FD', 0.95);
    fillLight.position.set(-5, 4, 6);
    scene.add(fillLight);

    // Turntable Studio Floor Plinth (High-Segment Smooth Pedestal)
    const floorGeo = new THREE.CylinderGeometry(3.8, 4.2, 0.24, 64);
    const floorMat = new THREE.MeshPhysicalMaterial({
      color: '#0F172A',
      roughness: 0.42,
      metalness: 0.48,
      clearcoat: 0.35,
      clearcoatRoughness: 0.2,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.y = -0.12;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    const subjectHolder = new THREE.Group();
    scene.add(subjectHolder);

    let currentAssetId = '';
    let activeModel: THREE.Group | null = null;
    let currentExploded = 0;

    function rebuildAssetModel(asset: AssetBatchItem) {
      if (activeModel) {
        subjectHolder.remove(activeModel);
      }
      activeModel = createCatalogAsset3D(asset);
      subjectHolder.add(activeModel);
      const rig = activeModel.userData.animRig as AnimRig3D | undefined;
      if (rig) {
        setActiveJoints(rig.activeJointCount);
      }
    }

    syncAssetImmediateRef.current = (asset: AssetBatchItem) => {
      if (asset.id !== currentAssetId) {
        currentAssetId = asset.id;
        rebuildAssetModel(asset);
        controls.update();
        renderer.render(scene, camera);
      }
    };

    const clock = new THREE.Clock();
    let frameId = 0;
    let cancelled = false;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
      if (gl.flush) gl.flush();
      if (!sync) {
        frameId = window.setTimeout(cb, 25);
        return;
      }
      const poll = () => {
        if (cancelled) return;
        const status = gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (status === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 25);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (cancelled) return;
      const dt = Math.min(0.1, clock.getDelta());
      const elapsed = clock.getElapsedTime();

      const {
        selectedAsset: asset,
        explodedRatio: targetExplode,
        animMode: mode,
        animSpeed: speed,
      } = stateRef.current;

      if (asset.id !== currentAssetId) {
        currentAssetId = asset.id;
        rebuildAssetModel(asset);
      }

      currentExploded = THREE.MathUtils.damp(currentExploded, targetExplode, 8, dt);

      if (activeModel) {
        const effectiveState: AnimState3D =
          mode === 'AUTO'
            ? AUTO_CYCLE_STATES[Math.floor(elapsed / 2.6) % AUTO_CYCLE_STATES.length]
            : mode;

        animateAsset3DModel(activeModel, effectiveState, elapsed, {
          speed,
          explodedRatio: currentExploded,
        });

        if (isSoftwareGl) {
          activeModel.rotation.y += dt * 0.5;
        }
      }

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    const ro = new ResizeObserver(() => {
      const r = container.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        camera.aspect = r.width / r.height;
        camera.updateProjectionMatrix();
        renderer.setSize(r.width, r.height);
      }
    });
    ro.observe(container);

    return () => {
      cancelled = true;
      syncAssetImmediateRef.current = null;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      ro.disconnect();
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="3D Asset Forge & Batch Showcase"
      className="fixed inset-0 z-50 bg-[#070B14] select-none overflow-hidden"
    >
      {/* Full-Viewport 3D Turntable Stage (100% Unobstructed Center) */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Top-Left Minimal Spec & Title Badge */}
      <div className="absolute top-5 left-6 z-10 bg-[#0B111E] border border-slate-700 rounded-lg px-4 py-3 shadow-2xl max-w-md space-y-1.5">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold">
            Đợt {selectedAsset.batchNumber}/24 · {selectedAsset.category}
          </span>
          <span className="text-[11px] font-mono text-emerald-400 font-bold">
            {selectedAsset.partsCount} Parts · {activeJoints} Active Anim Joints
          </span>
        </div>
        <h2 className="text-xl font-extrabold font-display text-white">
          {selectedAsset.name}
        </h2>
        <div className="text-[11px] font-mono text-sky-300">
          {selectedAsset.polyStyle} · 7-State Multi-Joint Rig
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {selectedAsset.description}
        </p>
        <div className="pt-1 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => handleStepAsset(-1)}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 cursor-pointer"
          >
            ◀ Prev 3D Model
          </button>
          <span className="text-[11px] font-mono text-slate-400">
            {filteredAssets.findIndex((a) => a.id === selectedAsset.id) + 1} / {filteredAssets.length} in View
          </span>
          <button
            type="button"
            onClick={() => handleStepAsset(1)}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 cursor-pointer"
          >
            Next 3D Model ▶
          </button>
        </div>
      </div>

      {/* Top-Right Close Button */}
      <button
        type="button"
        data-testid="close-3d-forge-btn"
        onClick={onClose}
        className="absolute top-5 right-6 z-10 px-4 py-2 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg cursor-pointer"
      >
        Return to Battle [Esc]
      </button>

      {/* Unified Collapsible Bottom Dock (per threejs/SKILL.md §5) */}
      <div
        style={{
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          maxWidth: 'min(1260px, 96vw)',
        }}
        className="fixed z-10 w-full flex flex-col items-center"
      >
        <button
          type="button"
          onClick={() => setDockCollapsed((c) => !c)}
          className="px-3.5 py-1 rounded-t bg-[#0B111E] border border-b-0 border-slate-700 text-[11px] font-bold text-slate-300 hover:text-white cursor-pointer"
        >
          {dockCollapsed ? '▴ Show 3D Batch Controls (420 Assets · 24/24 Đợt)' : '▾ Hide Controls (Zen Mode)'}
        </button>

        {!dockCollapsed && (
          <div className="w-full bg-[#0B111E] border border-slate-700 rounded-lg p-3.5 shadow-2xl space-y-2.5">
            {/* Row 1: 24 Production Batches Filter + Animation State + Exploded View Slider */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
              {/* Batch Selector */}
              <div className="flex items-center gap-1 flex-wrap">
                {(
                  [
                    { id: 'ALL', label: `All (${ASSET_3D_CATALOG.length})` },
                    { id: 1, label: 'Đợt 1: King & Base (6)' },
                    { id: 2, label: 'Đợt 2: Quân Đoàn (39)' },
                    { id: 3, label: 'Đợt 3: Mercs & Boss (16)' },
                    { id: 4, label: 'Đợt 4: Vũ Khí & VFX (10)' },
                    { id: 5, label: 'Đợt 5: 21 Waves (21)' },
                    { id: 6, label: 'Đợt 6: 12 Phép 3D (12)' },
                    { id: 7, label: 'Đợt 7: Kiến Trúc (6)' },
                    { id: 8, label: 'Đợt 8: Thánh Điện Tộc (8)' },
                    { id: 9, label: 'Đợt 9: Kỹ Năng King (8)' },
                    { id: 10, label: 'Đợt 10: Đạn & Cúp 3D (10)' },
                    { id: 11, label: 'Đợt 11: Kỹ Năng Quân (16)' },
                    { id: 12, label: 'Đợt 12: Tộc Hệ & Trạng Thái (14)' },
                    { id: 13, label: 'Đợt 13: Chiến Dịch & Tượng (8)' },
                    { id: 14, label: 'Đợt 14: Khắc Chế & Vai Trò (14)' },
                    { id: 15, label: 'Đợt 15: Kinh Tế & Đỉnh Cao (12)' },
                    { id: 16, label: 'Đợt 16: Tháp Canh & Tiến Hóa (16)' },
                    { id: 17, label: 'Đợt 17: Cổng Không Gian (12)' },
                    { id: 18, label: 'Đợt 18: Khí Tài & Kỳ Quan #240 (12)' },
                    { id: 19, label: 'Đợt 19: Chiến Xa & Thiết Giáp (30)' },
                    { id: 20, label: 'Đợt 20: Kỳ Quan Vũ Trụ #300 (30)' },
                    { id: 21, label: 'Đợt 21: Quân Kỳ, Radar & Pháo (30)' },
                    { id: 22, label: 'Đợt 22: Hộ Pháp & Đỉnh Cao #360 (30)' },
                    { id: 23, label: 'Đợt 23: Tinh Linh & Đạn 3D (30)' },
                    { id: 24, label: 'Đợt 24: Thần Khí & Đỉnh Cao #420 (30)' },
                  ] as const
                ).map((b) => (
                  <button
                    key={String(b.id)}
                    type="button"
                    data-testid={`batch-tab-${b.id}`}
                    onClick={() => handleSelectBatch(b.id)}
                    className={`px-2 py-1 rounded text-[11px] font-bold transition-colors whitespace-nowrap cursor-pointer ${
                      selectedBatch === b.id
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>

              {/* Full 7-State Animation Rig Preview + Auto Cycle + Speed */}
              <div className="flex items-center gap-1 flex-wrap">
                {(
                  [
                    { id: 'IDLE', label: 'IDLE' },
                    { id: 'WALK', label: 'WALK' },
                    { id: 'ATTACK', label: 'ATTACK' },
                    { id: 'SKILL', label: 'SKILL' },
                    { id: 'HIT', label: 'HIT' },
                    { id: 'VICTORY', label: 'VICTORY' },
                    { id: 'FALLEN', label: 'FALLEN' },
                    { id: 'AUTO', label: '⟳ AUTO' },
                  ] as const
                ).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    data-testid={`anim-mode-${m.id}`}
                    onClick={() => setAnimMode(m.id)}
                    className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                      animMode === m.id
                        ? 'bg-sky-500 text-slate-950'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}

                <div className="h-3.5 w-px bg-slate-700 mx-0.5" />

                {([0.5, 1, 2] as const).map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => setAnimSpeed(spd)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer ${
                      animSpeed === spd
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>

              {/* Exploded View Slider */}
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-400">Exploded View:</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={explodedRatio}
                  onChange={(e) => setExplodedRatio(Number(e.target.value))}
                  className="w-24 accent-amber-500 cursor-pointer"
                />
                <span className="text-amber-300 w-9 text-right">
                  {Math.round(explodedRatio * 100)}%
                </span>
              </div>
            </div>

            {/* Optional Faction Filter Row when Batch 2, 8, or 12 is selected */}
            {(selectedBatch === 2 || selectedBatch === 8 || selectedBatch === 12) && (
              <div className="flex items-center gap-1.5 flex-wrap pb-1 border-b border-slate-800/80">
                <span className="text-[11px] font-semibold text-slate-400 mr-1">
                  Lọc Quân Đoàn (8 Factions):
                </span>
                {(
                  [
                    'ALL',
                    'Inferno',
                    'Mechanic',
                    'Divine',
                    'Undead',
                    'Nature',
                    'Abyss',
                    'Wild',
                    'Arcane',
                  ] as const
                ).map((fac) => (
                  <button
                    key={fac}
                    type="button"
                    onClick={() => handleSelectFactionFilter(fac)}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                      selectedFaction === fac
                        ? 'bg-sky-500 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {fac === 'ALL' ? 'All Factions' : fac}
                  </button>
                ))}
              </div>
            )}

            {/* Row 2: Horizontal Scrollable 3D Model Selector Strip */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {filteredAssets.map((item) => {
                const isSelected = selectedAsset.id === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedAsset(item)}
                    className={`px-3 py-1.5 rounded border text-left shrink-0 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 text-white'
                        : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="text-xs font-bold whitespace-nowrap">{item.name}</div>
                    <div className="text-[10px] font-mono text-amber-300">
                      Đợt {item.batchNumber} · {item.partsCount} Parts
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
