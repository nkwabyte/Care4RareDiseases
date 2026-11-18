import { Card } from '@/components/ui/card';
import { KnowledgeGraphData } from '@/lib/types';

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
      case 'disease': return 'var(--pathogenic)';
      case 'gene-primary': return 'var(--primary)';
      case 'gene-secondary': return '#2f6b55';
      case 'gene-tertiary': return '#5e7f70';
      case 'phenotype': return 'var(--gold)';
      default: return 'var(--uncertain)';
    }
  };

  const getEdgeStyle = (strength: string) => {
    switch (strength) {
      case 'strong': return { stroke: 'var(--primary)', strokeWidth: 3, opacity: 0.85 };
      case 'medium': return { stroke: '#5e7f70', strokeWidth: 2, opacity: 0.7 };
      case 'weak': return { stroke: 'var(--gold)', strokeWidth: 1.5, opacity: 0.8, strokeDasharray: '4 4' };
      default: return { stroke: 'var(--input)', strokeWidth: 1, opacity: 0.6 };
    }
  };

  return (
    <Card className="p-6 bg-card border-border h-full">
      <h3 className="mb-4 text-foreground">Diagnostic Knowledge Graph</h3>

      <div className="bg-surface rounded-lg p-6 h-[calc(100%-3rem)] flex flex-col">
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
                stroke="var(--card)"
                strokeWidth="3"
              />
              <text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className={`${node.type === 'phenotype' ? 'fill-foreground' : 'fill-primary-foreground'} pointer-events-none select-none`}
                style={{ fontSize: '12px', lineHeight: '1.2', fontWeight: 600 }}
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
        <ul className="flex gap-x-5 gap-y-2 mt-4 justify-center flex-wrap text-sm">
          {[
            ['var(--pathogenic)', 'Disease'],
            ['var(--primary)', 'Primary gene'],
            ['#2f6b55', 'Secondary genes'],
            ['#5e7f70', 'Tertiary genes'],
            ['var(--gold)', 'Phenotypes'],
          ].map(([color, label]) => (
            <li key={label} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} aria-hidden />
              <span className="text-body">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
