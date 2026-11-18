import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export function TopCandidateGenes() {
  const genes = [
    { name: 'GATAD2B', confidence: 88, color: 'purple' },
    { name: 'SMARCE1', confidence: 6, color: 'slate' },
    { name: 'NACCI', confidence: 3, color: 'slate' },
    { name: 'GRIN2B', confidence: 2, color: 'slate' },
  ];

  return (
    <Card className="p-5 bg-card border-border">
      <h3 className="mb-4 text-foreground">Top Candidate Genes</h3>
      
      <div className="space-y-4">
        {genes.map((gene, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-2">
              <span className={`${gene.color === 'purple' ? 'text-primary' : 'text-body'}`}>
                {gene.name}
              </span>
              <span className={`${gene.color === 'purple' ? 'text-primary' : 'text-muted-foreground'}`}>
                {gene.confidence}%
              </span>
            </div>
            <Progress 
              value={gene.confidence} 
              className={`h-2 ${gene.color === 'purple' ? 'bg-muted' : 'bg-muted'}`}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
