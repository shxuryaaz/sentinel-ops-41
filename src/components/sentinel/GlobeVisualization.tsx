import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
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
// All routes will converge into India (New Delhi) to make the "target"
// of the misinformation visually obvious.
interface EventNodeData {
  lat: number;
  lng: number;
  label: string;
  intensity: number;
  claim: string;
  description: string;
}

const EVENT_NODES: EventNodeData[] = [
  {
    lat: 40.7,
    lng: -74,
    label: "New York",
    intensity: 0.9,
    claim: "Viral tweet misstates WHO guidance on vaccine safety.",
    description: "High-engagement social thread originating from U.S. accounts, amplified by anonymous networks.",
  },
  {
    lat: 51.5,
    lng: -0.12,
    label: "London",
    intensity: 0.8,
    claim: "Blog post claims new variant is 'engineered' without evidence.",
    description: "Long-form article circulated via fringe blogs and reposted into mainstream timelines.",
  },
  {
    lat: 48.85,
    lng: 2.35,
    label: "Paris",
    intensity: 0.75,
    claim: "Mistranslated press quote suggests complete travel shutdown.",
    description: "Translation artifacts misrepresented as official French government policy.",
  },
  {
    lat: 34.05,
    lng: -118.24,
    label: "Los Angeles",
    intensity: 0.7,
    claim: "Influencer video promotes unproven 'natural cure'.",
    description: "Short-form video content with sponsored boosts and undisclosed financial interests.",
  },
  {
    lat: -23.55,
    lng: -46.63,
    label: "São Paulo",
    intensity: 0.6,
    claim: "Local radio clip taken out of context, implying hospital collapse.",
    description: "Spliced audio segments shared without the original broadcast metadata.",
  },
  {
    lat: 35.68,
    lng: 139.69,
    label: "Tokyo",
    intensity: 0.7,
    claim: "Forum posts allege data fabrication in case reporting.",
    description: "Anonymous imageboard narratives with unverifiable 'insider' screenshots.",
  },
  {
    lat: 39.9,
    lng: 116.4,
    label: "Beijing",
    intensity: 0.75,
    claim: "Unverified memo claims cross-border information blackout.",
    description: "Circulating PDF documents with no cryptographic signatures or verifiable authorship.",
  },
  {
    lat: 1.35,
    lng: 103.8,
    label: "Singapore",
    intensity: 0.6,
    claim: "Messaging app forwards warn of 'imminent shutdown' of payment rails.",
    description: "Heavily forwarded chain messages with identical phrasing across multiple groups.",
  },
  {
    lat: 55.75,
    lng: 37.61,
    label: "Moscow",
    intensity: 0.85,
    claim: "Coordinated narratives question integrity of satellite data.",
    description: "Synchronized posts across multiple outlets with reused imagery and talking points.",
  },
  {
    lat: 51.51,
    lng: -0.13,
    label: "Dublin",
    intensity: 0.65,
    claim: "Rumors exaggerate impact of new content regulations.",
    description: "Speculative opinion pieces framed as confirmed legislative outcomes.",
  },
  // Target node: India (New Delhi)
  {
    lat: 28.61,
    lng: 77.2,
    label: "New Delhi",
    intensity: 1.0,
    claim: "Composite misinformation narrative targeting Indian news feeds.",
    description: "Aggregated downstream effect of upstream campaigns, localized via regional pages and groups.",
  },
];

// Every international node routes into New Delhi (index 10)
const TARGET_INDEX = 10;
const PROPAGATION_ROUTES = EVENT_NODES.slice(0, TARGET_INDEX).map((_, idx) => [idx, TARGET_INDEX] as [number, number]);

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function EventNode({ node, onSelect }: { node: EventNodeData; onSelect: (node: EventNodeData) => void }) {
  const ref = useRef<THREE.Mesh>(null);
  const pos = latLngToVector3(node.lat, node.lng, 2.02);

  useFrame(({ clock }) => {
    if (ref.current) {
      const scale = 1 + Math.sin(clock.elapsedTime * 2 + node.intensity * 10) * 0.3;
      ref.current.scale.setScalar(scale);
    }
  });

  return (
    <mesh
      ref={ref}
      position={pos}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "default";
      }}
    >
      <sphereGeometry args={[0.04, 12, 12]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={Math.max(0.6, node.intensity)} />
    </mesh>
  );
}

function PropagationLine({
  from,
  to,
  onSelect,
}: {
  from: EventNodeData;
  to: EventNodeData;
  onSelect: (from: EventNodeData, to: EventNodeData) => void;
}) {
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
      color="#ffffff"
      lineWidth={1}
      transparent
      opacity={0.6}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(from, to);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "default";
      }}
    />
  );
}

function GlobeMesh({ onSelectNode }: { onSelectNode: (node: EventNodeData) => void }) {
  const globeRef = useRef<THREE.Group>(null);
  const [earthTexture, setEarthTexture] = useState<THREE.Texture | null>(null);

  // Try to load earth texture, but fall back gracefully if missing
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      "/textures/earth-dark.jpg",
      (tex) => {
        setEarthTexture(tex);
      },
      undefined,
      () => {
        setEarthTexture(null);
      }
    );
  }, []);

  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.0012;
    }
  });

  return (
    <group ref={globeRef}>
      {/* Base textured earth (or solid fallback if texture missing) */}
      <Sphere args={[2, 64, 64]}>
        {earthTexture ? (
          <meshStandardMaterial
            map={earthTexture}
            color="#ffffff"
            roughness={0.9}
            metalness={0.05}
          />
        ) : (
          <meshBasicMaterial color="#111111" />
        )}
      </Sphere>

      {/* Event nodes */}
      {EVENT_NODES.map((node, i) => (
        <EventNode key={i} node={node} onSelect={onSelectNode} />
      ))}

      {/* Propagation lines (select the source node when clicked) */}
      {PROPAGATION_ROUTES.map(([fromIdx, toIdx], i) => (
        <PropagationLine
          key={i}
          from={EVENT_NODES[fromIdx]}
          to={EVENT_NODES[toIdx]}
          onSelect={(fromNode) => onSelectNode(fromNode)}
        />
      ))}
    </group>
  );
}

function CameraController({ zoom }: { zoom: number }) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.z = zoom;
  }, [zoom, camera]);

  return null;
}

const GlobeVisualization = () => {
  const [activeNode, setActiveNode] = useState<EventNodeData | null>(null);
  const [zoom, setZoom] = useState(5);

  return (
    <div className="w-full h-full min-h-[520px] relative bg-black">
      <Canvas camera={{ position: [0, 0, zoom], fov: 45 }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-5, -5, -5]} intensity={0.6} />
        <CameraController zoom={zoom} />
        <GlobeMesh onSelectNode={(node) => setActiveNode(node)} />
        <OrbitControls
          enableZoom
          enablePan={false}
          rotateSpeed={0.15}
          autoRotate
          autoRotateSpeed={0.15}
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

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-6 flex flex-col gap-1">
        <button
          className="w-8 h-8 flex items-center justify-center border border-border bg-card/80 text-xs text-foreground hover:bg-secondary/40 transition-colors"
          onClick={() => setZoom((z) => Math.max(3, z - 0.5))}
        >
          +
        </button>
        <button
          className="w-8 h-8 flex items-center justify-center border border-border bg-card/80 text-xs text-foreground hover:bg-secondary/40 transition-colors"
          onClick={() => setZoom((z) => Math.min(8, z + 0.5))}
        >
          -
        </button>
      </div>

      {/* Active node detail panel */}
      {activeNode && (
        <div className="absolute top-16 right-6 w-80 rounded-md border border-border bg-black/80 backdrop-blur-sm p-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-mono tracking-wide uppercase text-sentinel-cyan">
              Misinformation Vector
            </p>
            <p className="text-[10px] text-sentinel-text-dim">{activeNode.label}</p>
          </div>
          <p className="text-[11px] text-foreground mb-1">{activeNode.claim}</p>
          <p className="text-[10px] text-sentinel-text-dim leading-snug">{activeNode.description}</p>
        </div>
      )}
    </div>
  );
};

export default GlobeVisualization;
