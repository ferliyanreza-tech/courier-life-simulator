import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Text } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore } from './store'

function Building({ position, color, scale = [1, 1, 1] }: {
  position: [number, number, number]
  color: string
  scale?: [number, number, number]
}) {
  return (
    <group position={position}>
      <mesh position={[0, scale[1] / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={scale} />
        <meshStandardMaterial color={color} roughness={0.88} />
      </mesh>
      <mesh position={[0, scale[1] + 0.08, 0]}>
        <boxGeometry args={[scale[0] * 1.08, 0.16, scale[2] * 1.08]} />
        <meshStandardMaterial color="#263746" />
      </mesh>
      {[-0.28, 0.28].map((x) => (
        <mesh key={x} position={[x * scale[0], scale[1] * 0.62, scale[2] / 2 + 0.006]}>
          <boxGeometry args={[0.28, 0.36, 0.025]} />
          <meshStandardMaterial color="#a9d9e8" emissive="#284d5b" />
        </mesh>
      ))}
    </group>
  )
}

function ParcelMarker({ position, label, color }: {
  position: [number, number, number]
  label: string
  color: string
}) {
  return (
    <Float speed={2} floatIntensity={0.18}>
      <group position={position}>
        <mesh position={[0, 0.28, 0]} castShadow>
          <boxGeometry args={[0.48, 0.48, 0.48]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0, 0.28, 0.245]}>
          <boxGeometry args={[0.09, 0.49, 0.012]} />
          <meshStandardMaterial color="#f6e6bf" />
        </mesh>
        <Text position={[0, 1.15, 0]} fontSize={0.28} color="white" outlineWidth={0.035} outlineColor="#14212b">
          {label}
        </Text>
      </group>
    </Float>
  )
}

function CourierBike() {
  const group = useRef<THREE.Group>(null)
  const velocity = useRef(0)
  const heading = useRef(0)
  const keys = useGameStore((state) => state.keys)

  useFrame((_, delta) => {
    if (!group.current) return
    const dt = Math.min(delta, 0.05)
    const accelerating = keys.forward
    const braking = keys.backward
    velocity.current = THREE.MathUtils.damp(
      velocity.current,
      accelerating ? 7 : braking ? -2.5 : 0,
      2.2,
      dt,
    )
    const steer = (keys.left ? 1 : 0) - (keys.right ? 1 : 0)
    if (Math.abs(velocity.current) > 0.12) {
      heading.current += steer * dt * 1.65 * Math.sign(velocity.current)
    }
    group.current.rotation.y = heading.current
    group.current.position.x += Math.sin(heading.current) * velocity.current * dt
    group.current.position.z += Math.cos(heading.current) * velocity.current * dt
    group.current.position.x = THREE.MathUtils.clamp(group.current.position.x, -18, 18)
    group.current.position.z = THREE.MathUtils.clamp(group.current.position.z, -18, 18)
  })

  return (
    <group ref={group} position={[0, 0, 7]}>
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[0.38, 0.48, 1.05]} />
        <meshStandardMaterial color="#e84a35" metalness={0.2} roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.05, -0.12]} castShadow>
        <boxGeometry args={[0.48, 0.52, 0.48]} />
        <meshStandardMaterial color="#f0a52f" />
      </mesh>
      {[[-0.25, 0.34, 0.55], [0.25, 0.34, 0.55], [-0.25, 0.34, -0.55], [0.25, 0.34, -0.55]].map(([x, y, z], index) => (
        <mesh key={index} position={[x, y, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.23, 0.23, 0.12, 16]} />
          <meshStandardMaterial color="#20252a" />
        </mesh>
      ))}
      <mesh position={[0, 0.96, 0.2]} castShadow>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#273b4c" />
      </mesh>
    </group>
  )
}

function FollowCamera() {
  const bike = useRef<THREE.Group>(null)
  // The camera follows a stable chase position while the bike moves around the test block.
  useFrame(({ camera }, delta) => {
    const target = new THREE.Vector3(0, 5.2, 13)
    camera.position.lerp(target, 1 - Math.exp(-2 * delta))
    camera.lookAt(0, 0, 0)
  })
  return <group ref={bike} />
}

export default function World() {
  const stage = useGameStore((state) => state.missionStage)
  const interact = useGameStore((state) => state.interact)
  const bikePosition = useRef(new THREE.Vector3(0, 0, 7))
  const pickup = useMemo(() => new THREE.Vector3(-7, 0, -5), [])
  const dropoff = useMemo(() => new THREE.Vector3(8, 0, -8), [])

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.code === 'KeyE' && !event.repeat) interact()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [interact])

  return (
    <>
      <color attach="background" args={['#9bc7d8']} />
      <fog attach="fog" args={['#9bc7d8', 22, 52]} />
      <ambientLight intensity={1.35} />
      <directionalLight position={[8, 14, 6]} intensity={2.2} castShadow shadow-mapSize={[1024, 1024]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#6e9c69" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.035, 0]}>
        <planeGeometry args={[9, 60]} />
        <meshStandardMaterial color="#414a52" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 0]}>
        <planeGeometry args={[60, 9]} />
        <meshStandardMaterial color="#414a52" />
      </mesh>
      {Array.from({ length: 10 }, (_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, -27 + i * 6]}>
          <planeGeometry args={[0.16, 2.4]} />
          <meshBasicMaterial color="#f4e8b9" />
        </mesh>
      ))}
      <Building position={[-10, 0, -10]} color="#e8c49a" scale={[5, 3.4, 5]} />
      <Building position={[10, 0, -13]} color="#d9a68e" scale={[5, 4.6, 4]} />
      <Building position={[-12, 0, 9]} color="#d6d2b8" scale={[4, 2.8, 5]} />
      <Building position={[12, 0, 10]} color="#b9c9b5" scale={[5, 3.2, 4]} />
      <group position={[-7, 0, -5]}>
        <mesh position={[0, 0.65, 0]} castShadow>
          <boxGeometry args={[3.6, 1.3, 3]} />
          <meshStandardMaterial color="#e8a33c" />
        </mesh>
        <Text position={[0, 1.55, 1.56]} fontSize={0.32} color="#25313b" anchorX="center">GUDANG KURIR</Text>
      </group>
      <Building position={[8, 0, -8]} color="#9fb9d0" scale={[3.5, 2.8, 3.5]} />
      {stage === 'pickup' && <ParcelMarker position={[-7, 1.8, -5]} label="AMBIL PAKET" color="#f4b942" />}
      {stage === 'delivery' && <ParcelMarker position={[8, 3.2, -8]} label="TUJUAN PAKET" color="#48b889" />}
      <CourierBike />
      <FollowCamera />
    </>
  )
}