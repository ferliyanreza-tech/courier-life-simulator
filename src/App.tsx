import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect } from 'react'
import World from './game/World'
import { useGameStore, type ControlKey } from './game/store'

const controls: { key: ControlKey; label: string; symbol: string }[] = [
  { key: 'forward', label: 'Maju', symbol: '↑' },
  { key: 'left', label: 'Kiri', symbol: '←' },
  { key: 'backward', label: 'Mundur', symbol: '↓' },
  { key: 'right', label: 'Kanan', symbol: '→' },
]

export default function App() {
  const stage = useGameStore((state) => state.missionStage)
  const money = useGameStore((state) => state.money)
  const deliveries = useGameStore((state) => state.deliveries)
  const canInteract = useGameStore((state) => state.canInteract)
  const setKey = useGameStore((state) => state.setKey)
  const interact = useGameStore((state) => state.interact)
  const resetMission = useGameStore((state) => state.resetMission)

  useEffect(() => {
    const map: Record<string, ControlKey> = {
      KeyW: 'forward', ArrowUp: 'forward',
      KeyS: 'backward', ArrowDown: 'backward',
      KeyA: 'left', ArrowLeft: 'left',
      KeyD: 'right', ArrowRight: 'right',
    }
    const down = (event: KeyboardEvent) => {
      const key = map[event.code]
      if (key) {
        event.preventDefault()
        setKey(key, true)
      }
    }
    const up = (event: KeyboardEvent) => {
      const key = map[event.code]
      if (key) setKey(key, false)
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      ;(['forward', 'backward', 'left', 'right'] as ControlKey[]).forEach((key) => setKey(key, false))
    }
  }, [setKey])

  const missionTitle = stage === 'pickup'
    ? 'Ambil paket di gudang'
    : stage === 'delivery'
      ? 'Antarkan paket ke pelanggan'
      : 'Pengiriman berhasil!'

  return (
    <main className="game-shell">
      <Canvas shadows camera={{ position: [0, 5.2, 13], fov: 55 }} dpr={[1, 1.7]}>
        <Suspense fallback={null}><World /></Suspense>
      </Canvas>

      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">CL</div>
          <div><strong>COURIER LIFE</strong><span>SIMULATOR 3D · PROTOTYPE</span></div>
        </div>
        <div className="wallet">
          <span>DOMPET</span><strong>Rp {money.toLocaleString('id-ID')}</strong>
        </div>
      </header>

      <section className="mission-card">
        <div className="eyebrow">MISI HARI INI · #{String(deliveries + 1).padStart(3, '0')}</div>
        <h1>{missionTitle}</h1>
        <p>{stage === 'pickup'
          ? 'Datangi gudang berwarna oranye, lalu tekan E untuk mengambil paket.'
          : stage === 'delivery'
            ? 'Ikuti penanda hijau menuju rumah pelanggan, lalu tekan E untuk menyelesaikan pengiriman.'
            : 'Paket berhasil diterima pelanggan. Kerja bagus, kurir!'}
        </p>
        {stage === 'complete' ? (
          <button className="action-button" onClick={resetMission}>Mulai misi berikutnya ↗</button>
        ) : (
          <div className="mission-hint">
            <kbd>E</kbd><span>{canInteract ? (stage === 'pickup' ? 'Ambil paket' : 'Serahkan paket') : 'Dekati penanda tujuan'}</span>
          </div>
        )}
      </section>

      <div className="objective-chip"><span className="live-dot" /> KOTA · AREA PERCOBAAN</div>

      <div className="controls-hint">
        <span><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> Berkendara</span>
        <span><kbd>E</kbd> Interaksi</span>
      </div>

      <div className="touch-controls" aria-label="Kontrol berkendara">
        {controls.map(({ key, label, symbol }) => (
          <button
            key={key}
            className={`touch-key ${key}`}
            aria-label={label}
            onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); setKey(key, true) }}
            onPointerUp={() => setKey(key, false)}
            onPointerCancel={() => setKey(key, false)}
            onContextMenu={(event) => event.preventDefault()}
          >{symbol}</button>
        ))}
        <button className="touch-interact" onClick={interact} disabled={!canInteract}>AKSI</button>
      </div>

      <footer className="footer-note">BUILD 0.1.0 <span>•</span> VERTICAL SLICE</footer>
    </main>
  )
}