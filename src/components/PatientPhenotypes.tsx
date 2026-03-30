import { Card } from './ui/card';
import { Badge } from './ui/badge';

export function PatientPhenotypes() {
  const phenotypes = [
    'Profound global developmental delay',
    'Cerebral hypomyelination',
    'Limb hypertonia',
    'Infantile spasms',
  ];

  return (
    <Card className="p-5 bg-card border-border">
      <h3 className="mb-4 text-slate-100">Patient Phenotypes (Input)</h3>
      
      <div className="flex flex-wrap gap-2">
        {phenotypes.map((phenotype, index) => (
          <Badge 
            key={index}
            variant="secondary"
            className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 px-3 py-1.5"
          >
            {phenotype}
          </Badge>
        ))}
      </div>
    </Card>
  );
}
