import React, { useState } from 'react';
import { MatchState } from '../game/types';
import { sound } from '../game/audio';

interface StatusModalProps {
  modalType: 'PAUSED' | 'VICTORY' | 'DEFEAT';
  state: MatchState;
  onResume: () => void;
  onRestart: () => void;
  onReturnToTitle: () => void;
}

export const StatusModal: React.FC<StatusModalProps> = ({
  modalType,
  state,
  onResume,
  onRestart,
  onReturnToTitle,
}) => {
  const playerLane = state.lanes[0];
  const westKing = state.kings[0];
  const eastKing = state.kings[1];

  const [sfxVol, setSfxVol] = useState(Math.round(sound.sfxVolume * 100));
  const [musicVol, setMusicVol] = useState(Math.round(sound.musicVolume * 100));
  const [musicEnabled, setMusicEnabled] = useState(sound.musicEnabled);
  const [muted, setMuted] = useState(sound.muted);

  const handleSfxChange = (val: number) => {
    setSfxVol(val);
    sound.setSfxVolume(val / 100);
  };

  const handleMusicChange = (val: number) => {
    setMusicVol(val);
    sound.setMusicVolume(val / 100);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={
        modalType === 'PAUSED'
          ? 'Game Paused'
          : modalType === 'VICTORY'
          ? 'Victory Summary'
          : 'Defeat Summary'
      }
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#040710]/85 backdrop-blur-sm p-4 select-none"
    >
      <div className="w-full max-w-lg rounded-xl bg-[#0A1120] border border-slate-700/90 shadow-[0_28px_80px_rgba(0,0,0,0.85)] overflow-hidden">
        <div
          className={`h-1 w-full ${
            modalType === 'VICTORY'
              ? 'bg-emerald-400'
              : modalType === 'DEFEAT'
              ? 'bg-rose-500'
              : 'bg-amber-400'
          }`}
        />

        <div className="p-6 space-y-5">
          <div className="text-center space-y-1">
            <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-amber-400">
              {modalType === 'PAUSED'
                ? 'Tactical Command Paused'
                : modalType === 'VICTORY'
                ? 'Enemy Citadel Core Shattered'
                : state.winnerTeam === 'DRAW'
                ? 'Simultaneous Citadel Collapse'
                : 'West Citadel Core Fallen'}
            </div>
            <h2 className="text-3xl font-extrabold font-display text-white">
              {modalType === 'PAUSED'
                ? 'TẠM DỪNG CHIẾN THUẬT'
                : modalType === 'VICTORY'
                ? 'CHIẾN THẮNG (VICTORY)'
                : state.winnerTeam === 'DRAW'
                ? 'HÒA CHIẾN THUẬT'
                : 'THẤT THỦ (DEFEAT)'}
            </h2>
          </div>

          {/* 3 Tabular-Nums Mastery / Progress Stat Tiles */}
          <div className="grid grid-cols-3 gap-2.5 font-mono tabular-nums text-center">
            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">ĐỢT QUÁI (WAVE)</div>
              <div className="text-lg font-bold text-amber-300 mt-0.5">
                {state.waveNumber} / 21
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">GIÁ TRỊ ĐỘI HÌNH</div>
              <div className="text-lg font-bold text-emerald-400 mt-0.5">
                {playerLane.fighterValue}g
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">CITADEL ĐỊCH</div>
              <div className="text-lg font-bold text-rose-400 mt-0.5">
                {Math.max(0, Math.round((eastKing.citadelHp / eastKing.citadelMaxHp) * 100))}%
              </div>
            </div>
          </div>

          {/* Detailed Telemetry Summary */}
          <div className="text-xs text-slate-300 font-mono tabular-nums bg-slate-900/70 border border-slate-800/80 rounded-lg p-3.5 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Lợi tức Vàng mỗi đợt:</span>
              <span className="text-amber-300 font-bold">+{playerLane.income}g / wave</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Số công nhân mỏ Mythium:</span>
              <span className="text-sky-300 font-bold">{playerLane.workers} Workers</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Trang bị Thánh Vật Hero King:</span>
              <span className="text-amber-300 font-bold">{westKing.inventory.length} / 6</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Độ bền Lõi West Citadel:</span>
              <span className="text-emerald-300 font-bold">
                {Math.round(westKing.citadelHp)} / {westKing.citadelMaxHp}
              </span>
            </div>
          </div>

          {/* Studio Audio Mixer Section */}
          <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Bàn Trộn Âm Thanh (Studio Audio Mixer)
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    const next = sound.toggleMusic();
                    setMusicEnabled(next);
                    sound.playUiClick();
                  }}
                  className={`px-2 py-1 rounded text-[11px] font-semibold border cursor-pointer ${
                    musicEnabled && !muted
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  {musicEnabled ? 'Nhạc nền: BẬT' : 'Nhạc nền: TẮT'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const next = sound.toggleMute();
                    setMuted(next);
                    if (!next) sound.playUiClick();
                  }}
                  className={`px-2 py-1 rounded text-[11px] font-semibold border cursor-pointer ${
                    muted
                      ? 'bg-rose-950/60 border-rose-700/60 text-rose-300'
                      : 'bg-emerald-950/50 border-emerald-700/50 text-emerald-300'
                  }`}
                >
                  {muted ? '🔇 Đã tắt' : '🔊 Đang bật'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <label className="space-y-1 block">
                <div className="flex justify-between text-slate-400 font-mono text-[11px]">
                  <span>Hiệu ứng (SFX)</span>
                  <span className="text-amber-300">{sfxVol}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={sfxVol}
                  onChange={(e) => handleSfxChange(Number(e.target.value))}
                  onMouseUp={() => sound.playPlaceFighter()}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </label>

              <label className="space-y-1 block">
                <div className="flex justify-between text-slate-400 font-mono text-[11px]">
                  <span>Nhạc nền (Ambient)</span>
                  <span className="text-sky-300">{musicVol}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={musicVol}
                  onChange={(e) => handleMusicChange(Number(e.target.value))}
                  className="w-full accent-sky-400 cursor-pointer"
                />
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-1">
            {modalType === 'PAUSED' ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    sound.playUiClick();
                    onResume();
                  }}
                  className="w-full py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs tracking-wide transition-colors cursor-pointer"
                >
                  TIẾP TỤC TRẬN ĐẤU [Esc / P]
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    data-start="true"
                    onClick={() => {
                      sound.playWaveStart();
                      onRestart();
                    }}
                    className="w-full py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Chơi Lại Từ Đầu
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playUiClick();
                      onReturnToTitle();
                    }}
                    className="w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs transition-colors cursor-pointer"
                  >
                    Về Màn Hình Chính
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  type="button"
                  data-start="true"
                  onClick={() => {
                    sound.playWaveStart();
                    onRestart();
                  }}
                  className="w-full py-3 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs tracking-wide transition-colors cursor-pointer"
                >
                  {modalType === 'VICTORY' ? 'CHƠI TRẬN MỚI (PLAY AGAIN)' : 'THỬ LẠI (TRY AGAIN)'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playUiClick();
                    onReturnToTitle();
                  }}
                  className="w-full py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Về Màn Hình Chính
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
