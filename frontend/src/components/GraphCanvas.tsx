import { useRef, useMemo } from "react";
import ForceGraph3D from "react-force-graph-3d";

const statusColor: Record<string, string> = {
  active: "#00F2FE",
  dormant: "#5B6472",
  gap: "#FF5D73",
};

interface Props {
  nodes: any[];
  edges: any[];
  onNodeClick: (id: number) => void;
}

// The hero element: a 3D force-directed graph. Node color encodes
// activity status (active / dormant / knowledge-gap); clicking a node
// zooms in and opens the Knowledge Cluster panel.
export default function GraphCanvas({ nodes, edges, onNodeClick }: Props) {
  const fgRef = useRef<any>();

  const graphData = useMemo(
    () => ({
      nodes: nodes.map((n) => ({ id: n.id, name: n.title, status: n.status, type: n.type })),
      links: edges.map((e) => ({ source: e.source_node_id, target: e.target_node_id })),
    }),
    [nodes, edges]
  );

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden">
      <ForceGraph3D
        ref={fgRef}
        graphData={graphData}
        backgroundColor="rgba(0,0,0,0)"
        nodeLabel={(n: any) => `${n.name} (${n.status})`}
        nodeColor={(n: any) => statusColor[n.status] || "#00F2FE"}
        nodeOpacity={0.9}
        linkColor={() => "rgba(0, 242, 254, 0.25)"}
        linkWidth={1}
        linkDirectionalParticles={1}
        linkDirectionalParticleColor={() => "#8A2387"}
        onNodeClick={(node: any) => {
          onNodeClick(node.id);
          if (fgRef.current) {
            const distance = 120;
            const ratio = 1 + distance / Math.hypot(node.x, node.y, node.z || 1);
            fgRef.current.cameraPosition(
              { x: node.x * ratio, y: node.y * ratio, z: (node.z || 1) * ratio },
              node,
              600
            );
          }
        }}
      />
    </div>
  );
}
