import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function PatientPhenotypes() {
  const phenotypes = [
    'Profound global developmental delay',
    'Cerebral hypomyelination',
    'Limb hypertonia',
    'Infantile spasms',
  ];

  return (
    <Card className="p-5 bg-card border-border">
      <h3 className="mb-4 text-foreground">Patient Phenotypes (Input)</h3>
      
      <div className="flex flex-wrap gap-2">
        {phenotypes.map((phenotype, index) => (
          <Badge 
            key={index}
            variant="secondary"
            className="bg-muted text-primary hover:bg-muted px-3 py-1.5"
          >
            {phenotype}
          </Badge>
        ))}
      </div>
    </Card>
  );
}
