import { Card } from './ui/card';
import { Progress } from './ui/progress';

export function TopCandidateGenes() {
  const genes = [
    { name: 'GATAD2B', confidence: 88, color: 'purple' },
    { name: 'SMARCE1', confidence: 6, color: 'slate' },
    { name: 'NACCI', confidence: 3, color: 'slate' },
    { name: 'GRIN2B', confidence: 2, color: 'slate' },
  ];

  return (
    <Card className="p-5 bg-card border-border">
      <h3 className="mb-4 text-slate-100">Top Candidate Genes</h3>
      
      <div className="space-y-4">
        {genes.map((gene, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-2">
              <span className={`${gene.color === 'purple' ? 'text-purple-300' : 'text-slate-300'}`}>
                {gene.name}
              </span>
              <span className={`${gene.color === 'purple' ? 'text-purple-400' : 'text-slate-400'}`}>
                {gene.confidence}%
              </span>
            </div>
            <Progress 
              value={gene.confidence} 
              className={`h-2 ${gene.color === 'purple' ? 'bg-purple-900/30' : 'bg-slate-700'}`}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
