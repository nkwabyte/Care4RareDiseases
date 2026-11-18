import { Card } from '@/components/ui/card';

export function DiagnosticSummary() {
  return (
    <Card className="p-5 bg-card border-border">
      <h3 className="mb-4 text-foreground">Diagnostic Summary</h3>
      
      <div className="space-y-3">
        <div>
          <div className="text-muted-foreground mb-1">Predicted Disease</div>
          <div className="text-foreground">GATAD2B-associated syndrome</div>
        </div>
        
        <div>
          <div className="text-muted-foreground mb-1">Causal Gene</div>
          <div className="text-foreground">GATAD2B</div>
        </div>
        
        <div>
          <div className="text-muted-foreground mb-1">Confidence</div>
          <div className="text-primary">High (88%)</div>
        </div>
      </div>
    </Card>
  );
}
