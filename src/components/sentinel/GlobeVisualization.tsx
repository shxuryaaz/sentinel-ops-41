import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Line, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// Generate continent-like wireframe points on a sphere
function generateWireframePoints(count: number, radius: number) {
  const points: [number, number, number][] = [];
  for (let i = 0; i < count; i++) {
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    points.push([
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi),
    ]);
  }
  return points;
}

// Misinformation event nodes
const EVENT_NODES = [
  { lat: 51.5, lng: -0.12, label: "London", intensity: 0.8 },
  { lat: 40.7, lng: -74, label: "New York", intensity: 0.9 },
  { lat: 19.07, lng: 72.87, label: "Mumbai", intensity: 0.6 },
  { lat: 1.35, lng: 103.8, label: "Singapore", intensity: 0.5 },
  { lat: 35.68, lng: 139.69, label: "Tokyo", intensity: 0.7 },
  { lat: -33.86, lng: 151.2, label: "Sydney", intensity: 0.4 },
  { lat: 55.75, lng: 37.61, label: "Moscow", intensity: 0.85 },
  { lat: 39.9, lng: 116.4, label: "Beijing", intensity: 0.75 },
  { lat: -23.55, lng: -46.63, label: "São Paulo", intensity: 0.55 },
  { lat: 48.85, lng: 2.35, label: "Paris", intensity: 0.65 },
  { lat: 34.05, lng: -118.24, label: "Los Angeles", intensity: 0.7 },
  { lat: 28.61, lng: 77.2, label: "New Delhi", intensity: 0.8 },
];

const PROPAGATION_ROUTES = [
  [0, 1], [1, 2], [2, 3], // London→NY→Mumbai→Singapore
  [6, 7], [7, 3], // Moscow→Beijing→Singapore
  [1, 10], // NY→LA
  [9, 0], // Paris→London
  [8, 1], // São Paulo→NY
  [11, 2], // Delhi→Mumbai
];

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function EventNode({ lat, lng, intensity }: { lat: number; lng: number; intensity: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const pos = latLngToVector3(lat, lng, 2.02);

  useFrame(({ clock }) => {
    if (ref.current) {
      const scale = 1 + Math.sin(clock.elapsedTime * 2 + intensity * 10) * 0.3;
      ref.current.scale.setScalar(scale);
    }
  });

  return (
    <mesh ref={ref} position={pos}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshBasicMaterial color="#4dd8c0" transparent opacity={intensity} />
    </mesh>
  );
}

function PropagationLine({ from, to }: { from: typeof EVENT_NODES[0]; to: typeof EVENT_NODES[0] }) {
  const points = useMemo(() => {
    const start = latLngToVector3(from.lat, from.lng, 2.02);
    const end = latLngToVector3(to.lat, to.lng, 2.02);
    const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(2.4);
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    return curve.getPoints(30);
  }, [from, to]);

  return (
    <Line
      points={points}
      color="#4dd8c0"
      lineWidth={0.5}
      transparent
      opacity={0.25}
    />
  );
}

function GlobeMesh() {
  const globeRef = useRef<THREE.Group>(null);
  const wirePoints = useMemo(() => generateWireframePoints(800, 2), []);

  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={globeRef}>
      {/* Base sphere */}
      <Sphere args={[2, 64, 64]}>
        <meshBasicMaterial color="#0a0a0a" transparent opacity={0.95} />
      </Sphere>

      {/* Wireframe overlay */}
      <Sphere args={[2.005, 32, 32]}>
        <meshBasicMaterial color="#1a1a2e" wireframe transparent opacity={0.3} />
      </Sphere>

      {/* Grid lines */}
      <Sphere args={[2.01, 24, 24]}>
        <meshBasicMaterial color="#222233" wireframe transparent opacity={0.15} />
      </Sphere>

      {/* Scatter points for continents */}
      {wirePoints.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.008, 4, 4]} />
          <meshBasicMaterial color="#333355" transparent opacity={0.4} />
        </mesh>
      ))}

      {/* Event nodes */}
      {EVENT_NODES.map((node, i) => (
        <EventNode key={i} {...node} />
      ))}

      {/* Propagation lines */}
      {PROPAGATION_ROUTES.map(([fromIdx, toIdx], i) => (
        <PropagationLine key={i} from={EVENT_NODES[fromIdx]} to={EVENT_NODES[toIdx]} />
      ))}
    </group>
  );
}

const GlobeVisualization = () => {
  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.1} />
        <GlobeMesh />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.3}
          autoRotate
          autoRotateSpeed={0.3}
        />
      </Canvas>

      {/* Overlay label */}
      <div className="absolute bottom-4 left-4">
        <p className="sentinel-text-label">Global Propagation Map</p>
        <p className="text-[10px] text-sentinel-text-dim mt-1">
          {EVENT_NODES.length} active misinformation vectors detected
        </p>
      </div>

      {/* Claim input */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-96">
        <div className="flex items-center border border-border rounded-sm bg-card/80 backdrop-blur-sm">
          <input
            type="text"
            placeholder="Enter claim to investigate ..."
            className="flex-1 bg-transparent text-xs text-foreground px-3 py-2.5 placeholder:text-sentinel-text-dim focus:outline-none font-mono"
          />
          <button className="px-3 py-2.5 text-[10px] text-sentinel-cyan border-l border-border hover:bg-secondary/30 transition-colors">
            Analyze
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobeVisualization;
