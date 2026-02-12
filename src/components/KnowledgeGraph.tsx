import { Card } from './ui/card';
import { KnowledgeGraphData } from '../lib/types';

interface KnowledgeGraphProps {
  graphData?: KnowledgeGraphData;
}

export function KnowledgeGraph({ graphData }: KnowledgeGraphProps) {
  // Default graph if no data provided
  const defaultNodes = [
    { id: 'disease', label: 'Unknown\\nsyndrome', x: 400, y: 250, type: 'disease' as const, size: 50 },
    { id: 'gene1', label: 'Gene 1', x: 250, y: 150, type: 'gene-primary' as const, size: 40 },
    { id: 'pheno1', label: 'Phenotype 1', x: 400, y: 350, type: 'phenotype' as const, size: 35 },
  ];

  const defaultEdges = [
    { from: 'gene1', to: 'disease', strength: 'strong' as const },
    { from: 'disease', to: 'pheno1', strength: 'medium' as const },
  ];

  const nodes = graphData?.nodes || defaultNodes;
  const edges = graphData?.edges || defaultEdges;

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'disease': return '#a855f7'; // purple-500
      case 'gene-primary': return '#9333ea'; // purple-600
      case 'gene-secondary': return '#c084fc'; // purple-400
      case 'gene-tertiary': return '#d8b4fe'; // purple-300
      case 'phenotype': return '#f59e0b'; // amber-500
      default: return '#94a3b8';
    }
  };

  const getEdgeStyle = (strength: string) => {
    switch (strength) {
      case 'strong': return { stroke: '#a855f7', strokeWidth: 3, opacity: 0.8 };
      case 'medium': return { stroke: '#c084fc', strokeWidth: 2, opacity: 0.5 };
      case 'weak': return { stroke: '#f59e0b', strokeWidth: 1.5, opacity: 0.4 };
      default: return { stroke: '#4b5563', strokeWidth: 1, opacity: 0.3 };
    }
  };

  return (
    <Card className="p-6 bg-card border-border h-full">
      <h3 className="mb-4 text-slate-100">Diagnostic Knowledge Graph</h3>

      <div className="bg-[#2d1b4e] rounded-lg p-6 h-[calc(100%-3rem)] flex flex-col">
        <svg width="100%" height="100%" viewBox="0 0 800 500" className="overflow-visible flex-1">
          {/* Edges */}
          {edges.map((edge, index) => {
            const fromNode = nodes.find(n => n.id === edge.from);
            const toNode = nodes.find(n => n.id === edge.to);
            if (!fromNode || !toNode) return null;

            const edgeStyle = getEdgeStyle(edge.strength);

            return (
              <line
                key={`edge-${index}`}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                {...edgeStyle}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r={node.size}
                fill={getNodeColor(node.type)}
                stroke="white"
                strokeWidth="3"
                className="drop-shadow-md"
              />
              <text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-white pointer-events-none select-none"
                style={{ fontSize: '11px', lineHeight: '1.2', fontWeight: 600 }}
              >
                {node.label.split('\\n').map((line, i) => (
                  <tspan
                    key={i}
                    x={node.x}
                    dy={i === 0 ? 0 : '1.2em'}
                  >
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          ))}
        </svg>

        {/* Legend */}
        <div className="flex gap-4 mt-4 justify-center flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="text-slate-300">Disease</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-600"></div>
            <span className="text-slate-300">Primary Gene</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-400"></div>
            <span className="text-slate-300">Secondary Genes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-300"></div>
            <span className="text-slate-300">Tertiary Genes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-slate-300">Phenotypes</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
