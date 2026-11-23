import { useEffect, useMemo, useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Text } from '@react-three/drei'
import * as THREE from 'three'
import { deliveryStops, useGameStore } from './store'

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

function CourierBike({ bikeRef, hasParcel }: {
  bikeRef: RefObject<THREE.Group | null>
  hasParcel: boolean
}) {
  const velocity = useRef(0)
  const heading = useRef(0)
  const steerValue = useRef(0)
  const keys = useGameStore((state) => state.keys)

  useFrame((_, delta) => {
    const bike = bikeRef.current
    if (!bike) return
    const dt = Math.min(delta, 0.05)
    velocity.current = THREE.MathUtils.damp(
      velocity.current,
      keys.forward ? 8.5 : keys.backward ? -3 : 0,
      keys.forward || keys.backward ? 2.4 : 1.25,
      dt,
    )
    const steer = (keys.left ? 1 : 0) - (keys.right ? 1 : 0)
    steerValue.current = THREE.MathUtils.damp(steerValue.current, steer, 7, dt)
    if (Math.abs(velocity.current) > 0.12) {
      heading.current += steerValue.current * dt * 1.45 * Math.sign(velocity.current)
    }
    bike.rotation.y = heading.current
    bike.position.x += Math.sin(heading.current) * velocity.current * dt
    bike.position.z += Math.cos(heading.current) * velocity.current * dt
    bike.position.x = THREE.MathUtils.clamp(bike.position.x, -18, 18)
    bike.position.z = THREE.MathUtils.clamp(bike.position.z, -18, 18)
    bike.rotation.z = THREE.MathUtils.damp(bike.rotation.z, -steerValue.current * 0.12, 5, dt)
  })

  return (
    <group ref={bikeRef} position={[0, 0, 7]}>
      {/* Motorcycle frame and body */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[0.3, 0.25, 0.9]} />
        <meshStandardMaterial color="#263746" metalness={0.55} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.72, 0.04]} castShadow>
        <boxGeometry args={[0.42, 0.42, 0.62]} />
        <meshStandardMaterial color="#e84a35" metalness={0.18} roughness={0.42} />
      </mesh>
      <mesh position={[0, 0.94, -0.34]} castShadow>
        <boxGeometry args={[0.42, 0.18, 0.42]} />
        <meshStandardMaterial color="#202a33" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.84, 0.46]}>
        <sphereGeometry args={[0.13, 16, 12]} />
        <meshStandardMaterial color="#fff0b5" emissive="#f5c66a" emissiveIntensity={0.45} />
      </mesh>
      {/* Two wheels with visible tires and hubs */}
      {[-0.68, 0.68].map((z) => (
        <group key={z} position={[0, 0.34, z]} rotation={[0, Math.PI / 2, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <torusGeometry args={[0.255, 0.075, 10, 24]} />
            <meshStandardMaterial color="#171b20" roughness={0.95} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.16, 0.16, 0.13, 16]} />
            <meshStandardMaterial color="#aab4ba" metalness={0.72} roughness={0.3} />
          </mesh>
        </group>
      ))}
      {/* Front fork and handlebars */}
      <mesh position={[0, 0.61, 0.57]} rotation={[0.18, 0, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.62, 10]} />
        <meshStandardMaterial color="#aeb9c0" metalness={0.8} />
      </mesh>
      <mesh position={[0, 1.02, 0.48]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 0.72, 10]} />
        <meshStandardMaterial color="#20272d" metalness={0.55} />
      </mesh>
      {/* Courier rider: jacket, arms, legs and helmet */}
      <mesh position={[0, 1.22, -0.12]} rotation={[0.22, 0, 0]} castShadow>
        <capsuleGeometry args={[0.24, 0.42, 5, 10]} />
        <meshStandardMaterial color="#f0a52f" roughness={0.72} />
      </mesh>
      <mesh position={[0, 1.67, -0.16]} castShadow>
        <sphereGeometry args={[0.2, 16, 14]} />
        <meshStandardMaterial color="#273b4c" roughness={0.48} />
      </mesh>
      <mesh position={[0, 1.7, -0.015]}>
        <sphereGeometry args={[0.15, 16, 12]} />
        <meshStandardMaterial color="#dce8eb" metalness={0.22} roughness={0.3} />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * 0.28, 1.15, 0.2]} rotation={[0.8, 0, side * -0.55]} castShadow>
            <capsuleGeometry args={[0.075, 0.38, 4, 8]} />
            <meshStandardMaterial color="#e9a13a" />
          </mesh>
          <mesh position={[side * 0.16, 0.48, -0.38]} rotation={[0.7, 0, side * 0.18]} castShadow>
            <capsuleGeometry args={[0.09, 0.36, 4, 8]} />
            <meshStandardMaterial color="#263746" />
          </mesh>
        </group>
      ))}
      {hasParcel && (
        <group position={[0, 1.13, -0.56]}>
          <mesh castShadow>
            <boxGeometry args={[0.48, 0.42, 0.42]} />
            <meshStandardMaterial color="#c98b48" />
          </mesh>
          <mesh position={[0, 0, 0.214]}>
            <boxGeometry args={[0.1, 0.43, 0.012]} />
            <meshStandardMaterial color="#f5e5c5" />
          </mesh>
        </group>
      )}
    </group>
  )
}

export default function World() {
  const stage = useGameStore((state) => state.missionStage)
  const interact = useGameStore((state) => state.interact)
  const bikeRef = useRef<THREE.Group | null>(null)
  const pickup = useMemo(() => new THREE.Vector3(-7, 0, -5), [])
  const deliveries = useGameStore((state) => state.deliveries)
  const activeStop = deliveryStops[deliveries % deliveryStops.length]
  const dropoff = useMemo(() => new THREE.Vector3(...activeStop.position), [activeStop])

  useFrame(({ camera }, delta) => {
    const bike = bikeRef.current
    if (!bike) return
    const target = stage === 'pickup' ? pickup : dropoff
    const distance = bike.position.distanceTo(target)
    useGameStore.getState().setInteractEnabled(stage !== 'complete' && distance < 3.2)

    const heading = bike.rotation.y
    const desiredCamera = new THREE.Vector3(
      bike.position.x - Math.sin(heading) * 7,
      bike.position.y + 5.2,
      bike.position.z + Math.cos(heading) * 7,
    )
    camera.position.lerp(desiredCamera, 1 - Math.exp(-3 * delta))
    camera.lookAt(bike.position.x, bike.position.y + 0.7, bike.position.z)
  })

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
      {/* Sidewalks and small-town street details */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.015, 5.35]}>
        <planeGeometry args={[60, 1.1]} />
        <meshStandardMaterial color="#c8c2b3" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.015, -5.35]}>
        <planeGeometry args={[60, 1.1]} />
        <meshStandardMaterial color="#c8c2b3" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[5.35, -0.015, 0]}>
        <planeGeometry args={[1.1, 60]} />
        <meshStandardMaterial color="#c8c2b3" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-5.35, -0.015, 0]}>
        <planeGeometry args={[1.1, 60]} />
        <meshStandardMaterial color="#c8c2b3" />
      </mesh>
      {Array.from({ length: 9 }, (_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[-24 + i * 6, 0.008, 0]}>
          <planeGeometry args={[2.4, 0.16]} />
          <meshBasicMaterial color="#f4e8b9" />
        </mesh>
      ))}
      {[[ -17, -17], [17, -18], [-18, 17], [18, 18], [-22, -8], [22, 8], [-8, 22], [8, -22]].map(([x, z], index) => (
        <group key={index} position={[x, 0, z]}>
          <mesh position={[0, 1.15, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.13, 2.3, 7]} />
            <meshStandardMaterial color="#72563b" />
          </mesh>
          <mesh position={[0, 2.45, 0]} castShadow>
            <sphereGeometry args={[0.85, 10, 8]} />
            <meshStandardMaterial color={index % 2 ? '#39764b' : '#4b8953'} roughness={1} />
          </mesh>
        </group>
      ))}
      <group position={[4.6, 0, -4.6]}>
        <mesh position={[0, 2.1, 0]}>
          <cylinderGeometry args={[0.045, 0.07, 4.2, 8]} />
          <meshStandardMaterial color="#303b43" metalness={0.55} />
        </mesh>
        <mesh position={[-0.45, 4.05, 0]}>
          <boxGeometry args={[0.95, 0.12, 0.12]} />
          <meshStandardMaterial color="#303b43" metalness={0.55} />
        </mesh>
        <mesh position={[-0.85, 3.92, 0]}>
          <sphereGeometry args={[0.19, 10, 8]} />
          <meshStandardMaterial color="#fff0b5" emissive="#f8d78a" emissiveIntensity={0.7} />
        </mesh>
      </group>
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
      <Building position={activeStop.position} color="#9fb9d0" scale={[3.5, 2.8, 3.5]} />
      {stage === 'pickup' && <ParcelMarker position={[-7, 1.8, -5]} label="AMBIL PAKET" color="#f4b942" />}
      {stage === 'delivery' && <ParcelMarker position={[activeStop.position[0], 3.2, activeStop.position[2]]} label="TUJUAN PAKET" color="#48b889" />}
      <CourierBike bikeRef={bikeRef} hasParcel={stage === 'delivery'} />
    </>
  )
}