import { Card } from './ui/card';

export function DiagnosticSummary() {
  return (
    <Card className="p-5 bg-card border-border">
      <h3 className="mb-4 text-slate-100">Diagnostic Summary</h3>
      
      <div className="space-y-3">
        <div>
          <div className="text-slate-400 mb-1">Predicted Disease</div>
          <div className="text-slate-100">GATAD2B-associated syndrome</div>
        </div>
        
        <div>
          <div className="text-slate-400 mb-1">Causal Gene</div>
          <div className="text-slate-100">GATAD2B</div>
        </div>
        
        <div>
          <div className="text-slate-400 mb-1">Confidence</div>
          <div className="text-purple-400">High (88%)</div>
        </div>
      </div>
    </Card>
  );
}
