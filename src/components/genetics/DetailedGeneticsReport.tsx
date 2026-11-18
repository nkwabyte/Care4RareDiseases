import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, FileText, Dna } from "lucide-react";

export function DetailedGeneticsReport() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-foreground">Detailed Genetics Report</CardTitle>
              <p className="text-muted-foreground mt-1">Comprehensive analysis of identified gene candidates and variants</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-muted text-primary border-primary">
            Generated Report
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Primary Gene Candidate */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Dna className="w-5 h-5 text-primary" />
            <h3 className="text-primary">Primary Gene Candidate: GATAD2B</h3>
          </div>
          <div className="bg-surface rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground mb-1">Gene Location</p>
                <p className="text-foreground">Chromosome 1p36.12</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Gene Function</p>
                <p className="text-foreground">Chromatin remodeling complex subunit</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Inheritance Pattern</p>
                <p className="text-foreground">Autosomal Dominant</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Mutation Type</p>
                <p className="text-foreground">Missense variant (de novo)</p>
              </div>
            </div>
            
            <Separator className="bg-muted" />
            
            <div>
              <p className="text-muted-foreground mb-2">Variant Details</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">cDNA Change:</span>
                  <span className="font-mono text-foreground bg-popover px-2 py-1 rounded border border-border">c.1234G&gt;A</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Protein Change:</span>
                  <span className="font-mono text-foreground bg-popover px-2 py-1 rounded border border-border">p.Arg412His</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Zygosity:</span>
                  <span className="text-foreground">Heterozygous (de novo)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Pathogenicity:</span>
                  <Badge className="bg-warning-soft text-warning hover:bg-warning-soft border-warning/30">Likely Pathogenic</Badge>
                </div>
              </div>
            </div>

            <Separator className="bg-muted" />

            <div>
              <p className="text-muted-foreground mb-2">Clinical Significance</p>
              <p className="text-body leading-relaxed">
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
          <h3 className="text-foreground mb-3">Associated Phenotypes</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted border border-border rounded-lg p-3">
              <p className="text-foreground mb-1">Limb Hypertonia</p>
              <p className="text-body">Increased muscle tone in limbs, consistent with GATAD2B-associated syndrome</p>
            </div>
            <div className="bg-muted border border-border rounded-lg p-3">
              <p className="text-foreground mb-1">Infantile Spasms</p>
              <p className="text-body">Epileptic seizures typically occurring in the first year of life</p>
            </div>
            <div className="bg-muted border border-border rounded-lg p-3">
              <p className="text-foreground mb-1">Developmental Regression</p>
              <p className="text-body">Loss of previously acquired developmental milestones</p>
            </div>
            <div className="bg-muted border border-border rounded-lg p-3">
              <p className="text-foreground mb-1">Cerebral Hypomyelination</p>
              <p className="text-body">Deficient myelin formation in the central nervous system</p>
            </div>
          </div>
        </div>

        {/* Secondary Gene Candidates */}
        <div>
          <h3 className="text-foreground mb-3">Secondary Gene Candidates</h3>
          <div className="space-y-3">
            <div className="border border-border rounded-lg p-4 bg-surface">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-foreground">SMARCE1</span>
                  <Badge variant="outline" className="text-body border-border">Confidence: 76%</Badge>
                </div>
                <span className="text-muted-foreground">Chromosome 17q21.2</span>
              </div>
              <p className="text-body">
                SWI/SNF chromatin remodeling complex subunit. Associated with Coffin-Siris syndrome, 
                which shares overlapping features with the patient's phenotype.
              </p>
            </div>
            
            <div className="border border-border rounded-lg p-4 bg-surface">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-foreground">CHD8</span>
                  <Badge variant="outline" className="text-body border-border">Confidence: 68%</Badge>
                </div>
                <span className="text-muted-foreground">Chromosome 14q11.2</span>
              </div>
              <p className="text-body">
                Chromodomain helicase DNA binding protein. Implicated in autism spectrum disorder and 
                neurodevelopmental delay with similar clinical presentations.
              </p>
            </div>
          </div>
        </div>

        {/* ACMG Classification */}
        <div>
          <h3 className="text-foreground mb-3">ACMG Variant Classification</h3>
          <div className="bg-warning-soft border border-warning/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <p className="text-foreground">
                  <strong>Classification: Likely Pathogenic (Class 4)</strong>
                </p>
                <p className="text-body">
                  The variant meets the following ACMG criteria:
                </p>
                <ul className="list-disc list-inside space-y-1 text-body ml-2">
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
          <h3 className="text-foreground mb-3">Clinical Recommendations</h3>
          <div className="space-y-2">
            <div className="flex items-start gap-3 p-3 bg-surface rounded-lg border border-border">
              <div className="w-6 h-6 border-[1.5px] border-foreground text-foreground text-[13px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
              <p className="text-body">
                Confirm variant through Sanger sequencing and perform parental testing to verify de novo occurrence
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-surface rounded-lg border border-border">
              <div className="w-6 h-6 border-[1.5px] border-foreground text-foreground text-[13px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
              <p className="text-body">
                Genetic counseling for family regarding recurrence risk and implications of de novo mutation
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-surface rounded-lg border border-border">
              <div className="w-6 h-6 border-[1.5px] border-foreground text-foreground text-[13px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
              <p className="text-body">
                Multidisciplinary management including neurology for seizure management, physical therapy, and developmental support
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-surface rounded-lg border border-border">
              <div className="w-6 h-6 border-[1.5px] border-foreground text-foreground text-[13px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">4</div>
              <p className="text-body">
                Regular neurological monitoring and developmental assessments to track disease progression
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
