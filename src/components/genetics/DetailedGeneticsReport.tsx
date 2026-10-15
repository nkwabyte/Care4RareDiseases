import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { AlertCircle, FileText, Dna } from "lucide-react";

export function DetailedGeneticsReport() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-slate-100">Detailed Genetics Report</CardTitle>
              <p className="text-slate-400 mt-1">Comprehensive analysis of identified gene candidates and variants</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-700">
            Generated Report
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Primary Gene Candidate */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Dna className="w-5 h-5 text-purple-400" />
            <h3 className="text-purple-300">Primary Gene Candidate: GATAD2B</h3>
          </div>
          <div className="bg-[#2d1b4e] rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 mb-1">Gene Location</p>
                <p className="text-slate-200">Chromosome 1p36.12</p>
              </div>
              <div>
                <p className="text-slate-400 mb-1">Gene Function</p>
                <p className="text-slate-200">Chromatin remodeling complex subunit</p>
              </div>
              <div>
                <p className="text-slate-400 mb-1">Inheritance Pattern</p>
                <p className="text-slate-200">Autosomal Dominant</p>
              </div>
              <div>
                <p className="text-slate-400 mb-1">Mutation Type</p>
                <p className="text-slate-200">Missense variant (de novo)</p>
              </div>
            </div>
            
            <Separator className="bg-purple-900/20" />
            
            <div>
              <p className="text-slate-400 mb-2">Variant Details</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">cDNA Change:</span>
                  <span className="font-mono text-slate-100 bg-[#1a0f2e] px-2 py-1 rounded border border-purple-900/20">c.1234G&gt;A</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Protein Change:</span>
                  <span className="font-mono text-slate-100 bg-[#1a0f2e] px-2 py-1 rounded border border-purple-900/20">p.Arg412His</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Zygosity:</span>
                  <span className="text-slate-200">Heterozygous (de novo)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Pathogenicity:</span>
                  <Badge className="bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border-amber-500/30">Likely Pathogenic</Badge>
                </div>
              </div>
            </div>

            <Separator className="bg-purple-900/20" />

            <div>
              <p className="text-slate-400 mb-2">Clinical Significance</p>
              <p className="text-slate-300 leading-relaxed">
                The identified variant in GATAD2B is associated with a neurodevelopmental disorder characterized by 
                intellectual disability, hypotonia progressing to hypertonia, and seizures. GATAD2B encodes a subunit 
                of the NuRD (nucleosome remodeling and deacetylase) chromatin remodeling complex, which plays a critical 
                role in gene expression regulation during neurodevelopment.
              </p>
            </div>
          </div>
        </div>

        {/* Associated Phenotypes */}
        <div>
          <h3 className="text-slate-100 mb-3">Associated Phenotypes</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
              <p className="text-slate-100 mb-1">Limb Hypertonia</p>
              <p className="text-slate-300">Increased muscle tone in limbs, consistent with GATAD2B-associated syndrome</p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
              <p className="text-slate-100 mb-1">Infantile Spasms</p>
              <p className="text-slate-300">Epileptic seizures typically occurring in the first year of life</p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
              <p className="text-slate-100 mb-1">Developmental Regression</p>
              <p className="text-slate-300">Loss of previously acquired developmental milestones</p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
              <p className="text-slate-100 mb-1">Cerebral Hypomyelination</p>
              <p className="text-slate-300">Deficient myelin formation in the central nervous system</p>
            </div>
          </div>
        </div>

        {/* Secondary Gene Candidates */}
        <div>
          <h3 className="text-slate-100 mb-3">Secondary Gene Candidates</h3>
          <div className="space-y-3">
            <div className="border border-purple-900/20 rounded-lg p-4 bg-[#2d1b4e]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-100">SMARCE1</span>
                  <Badge variant="outline" className="text-slate-300 border-purple-900/20">Confidence: 76%</Badge>
                </div>
                <span className="text-slate-400">Chromosome 17q21.2</span>
              </div>
              <p className="text-slate-300">
                SWI/SNF chromatin remodeling complex subunit. Associated with Coffin-Siris syndrome, 
                which shares overlapping features with the patient's phenotype.
              </p>
            </div>
            
            <div className="border border-purple-900/20 rounded-lg p-4 bg-[#2d1b4e]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-100">CHD8</span>
                  <Badge variant="outline" className="text-slate-300 border-purple-900/20">Confidence: 68%</Badge>
                </div>
                <span className="text-slate-400">Chromosome 14q11.2</span>
              </div>
              <p className="text-slate-300">
                Chromodomain helicase DNA binding protein. Implicated in autism spectrum disorder and 
                neurodevelopmental delay with similar clinical presentations.
              </p>
            </div>
          </div>
        </div>

        {/* ACMG Classification */}
        <div>
          <h3 className="text-slate-100 mb-3">ACMG Variant Classification</h3>
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <p className="text-slate-100">
                  <strong>Classification: Likely Pathogenic (Class 4)</strong>
                </p>
                <p className="text-slate-300">
                  The variant meets the following ACMG criteria:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-300 ml-2">
                  <li><strong>PS2:</strong> De novo variant (confirmed paternity and maternity)</li>
                  <li><strong>PM1:</strong> Located in a mutational hot spot and/or critical functional domain</li>
                  <li><strong>PM2:</strong> Absent from controls in population databases</li>
                  <li><strong>PP3:</strong> Multiple lines of computational evidence support a deleterious effect</li>
                  <li><strong>PP4:</strong> Patient's phenotype is highly specific for GATAD2B-associated disorder</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h3 className="text-slate-100 mb-3">Clinical Recommendations</h3>
          <div className="space-y-2">
            <div className="flex items-start gap-3 p-3 bg-[#2d1b4e] rounded-lg border border-purple-900/20">
              <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
              <p className="text-slate-300">
                Confirm variant through Sanger sequencing and perform parental testing to verify de novo occurrence
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-[#2d1b4e] rounded-lg border border-purple-900/20">
              <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
              <p className="text-slate-300">
                Genetic counseling for family regarding recurrence risk and implications of de novo mutation
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-[#2d1b4e] rounded-lg border border-purple-900/20">
              <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
              <p className="text-slate-300">
                Multidisciplinary management including neurology for seizure management, physical therapy, and developmental support
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-[#2d1b4e] rounded-lg border border-purple-900/20">
              <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">4</div>
              <p className="text-slate-300">
                Regular neurological monitoring and developmental assessments to track disease progression
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
