import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { VariantInfo } from '../lib/data/patientData';

interface DNAStructureVisualizationProps {
  variantInfo?: VariantInfo;
}

export function DNAStructureVisualization({ variantInfo }: DNAStructureVisualizationProps) {
  if (!variantInfo) {
    return (
      <Card className="p-5 bg-card border-border">
        <h3 className="mb-4 text-slate-100">Variant Information</h3>
        <div className="bg-[#2d1b4e] rounded-lg p-6 text-center text-slate-400">
          No variant data available for this patient
        </div>
      </Card>
    );
  }

  const getPathogenicityColor = (pathogenicity: string) => {
    if (pathogenicity.toLowerCase().includes('pathogenic')) {
      return 'bg-red-500/20 text-red-300 border-red-500/30';
    }
    if (pathogenicity.toLowerCase().includes('likely pathogenic')) {
      return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
    }
    return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
  };

  return (
    <Card className="p-5 bg-card border-border">
      <h3 className="mb-4 text-slate-100">Variant Information</h3>

      {/* Variant Details Grid */}
      <div className="bg-[#2d1b4e] rounded-lg p-5 space-y-4">
        {/* Top Row - Gene and Pathogenicity */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="text-slate-400 mb-1">Gene</div>
            <div className="text-purple-300">{variantInfo.gene}</div>
          </div>
          <div>
            <Badge className={`${getPathogenicityColor(variantInfo.pathogenicity)} border`}>
              {variantInfo.pathogenicity}
            </Badge>
          </div>
        </div>

        {/* Location and Zygosity */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-slate-400 mb-1">Chromosomal Location</div>
            <div className="text-slate-200">Chr {variantInfo.chromosome} ({variantInfo.position})</div>
          </div>
          <div>
            <div className="text-slate-400 mb-1">Zygosity</div>
            <div className="text-slate-200">{variantInfo.zygosity}</div>
          </div>
        </div>

        {/* Variant Type and Inheritance */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-slate-400 mb-1">Variant Type</div>
            <div className="text-slate-200">{variantInfo.variantType}</div>
          </div>
          <div>
            <div className="text-slate-400 mb-1">Inheritance Pattern</div>
            <div className="text-slate-200">{variantInfo.inheritance}</div>
          </div>
        </div>

        {/* Molecular Changes */}
        <div className="border-t border-purple-900/20 pt-4">
          <div className="text-slate-400 mb-2">Molecular Changes</div>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-slate-400 min-w-[80px]">cDNA:</span>
              <span className="text-slate-200 font-mono">{variantInfo.cdnaChange}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-slate-400 min-w-[80px]">Protein:</span>
              <span className="text-slate-200 font-mono">{variantInfo.proteinChange}</span>
            </div>
          </div>
        </div>

        {/* Affected Phenotypes */}
        <div className="border-t border-purple-900/20 pt-4">
          <div className="text-slate-400 mb-3">Affected Phenotypes</div>
          <div className="flex flex-wrap gap-2">
            {variantInfo.affectedPhenotypes.map((phenotype, index) => (
              <Badge
                key={index}
                variant="outline"
                className="bg-purple-900/30 border-purple-700 text-purple-300"
              >
                {phenotype}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
