import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  FileUp, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Code, 
  Download,
  BookOpen,
  Dna,
  FileCode,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HelpScreen() {
  return (
    <div className="h-screen bg-background overflow-hidden flex flex-col flex-1">
      <header className="bg-card border-b border-border px-6 py-4">
        <h1 className="text-2xl font-bold tracking-[-0.01em] text-foreground">Help & documentation</h1>
        <p className="text-muted-foreground">How to prepare and upload patient genomic data</p>
      </header>
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">
              Overview
            </TabsTrigger>
            <TabsTrigger value="file-formats">
              File Formats
            </TabsTrigger>
            <TabsTrigger value="preparation">
              File Preparation
            </TabsTrigger>
            <TabsTrigger value="examples">
              Examples
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Dna className="w-5 h-5 text-primary" />
                  Getting Started
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-body leading-relaxed">
                  Care for Rare uses advanced AI algorithms to analyze genomic data and identify potential 
                  rare genetic diseases. To get the most accurate results, it's important to prepare your 
                  patient files correctly.
                </p>

                <Separator className="bg-muted" />

                <ol className="border-t border-border">
                  {[
                    ['Prepare files', 'Format genomic data to the specifications under File formats.'],
                    ['Upload data', 'Attach the VCF file and the patient’s phenotype terms to the case.'],
                    ['Run analysis', 'Review the candidate genes and phenotype fit the analysis returns.'],
                  ].map(([title, text], i) => (
                    <li key={title} className="grid grid-cols-[2.5rem_1fr] gap-x-3 py-3 border-b border-border">
                      <span className="text-lg font-bold text-foreground tabular-nums">{i + 1}</span>
                      <span>
                        <span className="block font-semibold text-foreground">{title}</span>
                        <span className="block text-body">{text}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Supported Data Types</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-foreground">Whole Exome Sequencing (WES) VCF Files</p>
                    <p className="text-muted-foreground">Variant Call Format files from exome sequencing</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-foreground">Whole Genome Sequencing (WGS) VCF Files</p>
                    <p className="text-muted-foreground">Variant Call Format files from genome sequencing</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-foreground">HPO Phenotype Terms</p>
                    <p className="text-muted-foreground">Human Phenotype Ontology standardized clinical observations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* File Formats Tab */}
          <TabsContent value="file-formats" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-primary" />
                  VCF File Format
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="bg-muted border-border">
                  <AlertCircle className="w-4 h-4 text-primary" />
                  <AlertDescription className="text-body">
                    VCF (Variant Call Format) is the standard file format for storing gene sequence variations. 
                    Files must be properly formatted and include all required metadata fields.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <h4 className="text-foreground">Required VCF Specifications:</h4>
                  
                  <div className="grid gap-3">
                    <div className="bg-popover rounded-lg p-4 border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="bg-muted text-primary border-primary">
                          Version
                        </Badge>
                        <span className="text-foreground">VCF v4.2 or higher</span>
                      </div>
                      <p className="text-body">Must include version specification in header</p>
                    </div>

                    <div className="bg-popover rounded-lg p-4 border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="bg-muted text-primary border-primary">
                          Reference
                        </Badge>
                        <span className="text-foreground">GRCh37 (hg19) or GRCh38 (hg38)</span>
                      </div>
                      <p className="text-body">Specify reference genome build in header</p>
                    </div>

                    <div className="bg-popover rounded-lg p-4 border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="bg-muted text-primary border-primary">
                          Compression
                        </Badge>
                        <span className="text-foreground">.vcf, .vcf.gz, or .bcf</span>
                      </div>
                      <p className="text-body">Uncompressed or bgzip-compressed files accepted</p>
                    </div>

                    <div className="bg-popover rounded-lg p-4 border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="bg-muted text-primary border-primary">
                          Annotations
                        </Badge>
                        <span className="text-foreground">INFO fields with functional annotations</span>
                      </div>
                      <p className="text-body">Include gene names, consequence predictions, allele frequencies</p>
                    </div>
                  </div>
                </div>

                <Separator className="bg-muted" />

                <div className="space-y-3">
                  <h4 className="text-foreground">Sample VCF Header:</h4>
                  <div className="bg-background rounded-lg p-4 border border-border font-mono text-sm overflow-x-auto">
                    <pre className="text-body">
{`##fileformat=VCFv4.2
##reference=GRCh38
##INFO=<ID=DP,Number=1,Type=Integer,Description="Total Depth">
##INFO=<ID=AF,Number=A,Type=Float,Description="Allele Frequency">
##INFO=<ID=CSQ,Number=.,Type=String,Description="Consequence annotations">
##FORMAT=<ID=GT,Number=1,Type=String,Description="Genotype">
##FORMAT=<ID=GQ,Number=1,Type=Integer,Description="Genotype Quality">
#CHROM	POS	ID	REF	ALT	QUAL	FILTER	INFO	FORMAT	SAMPLE`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">HPO Phenotype Format</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-body leading-relaxed">
                  Clinical phenotypes should be entered using standardized Human Phenotype Ontology (HPO) terms. 
                  Each phenotype should include the HPO ID and description.
                </p>

                <div className="space-y-2">
                  <h4 className="text-foreground">Format Structure:</h4>
                  <div className="bg-background rounded-lg p-4 border border-border">
                    <div className="space-y-2 font-mono text-sm">
                      <div className="flex items-start gap-3">
                        <span className="text-primary">HPO ID:</span>
                        <span className="text-body">HP:0001234</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-primary">Term:</span>
                        <span className="text-body">Phenotype Description</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-primary">Onset:</span>
                        <span className="text-body">Age of onset (optional)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preparation Tab */}
          <TabsContent value="preparation" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Code className="w-5 h-5 text-primary" />
                  Step-by-Step File Preparation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 border-[1.5px] border-foreground text-foreground font-bold flex items-center justify-center flex-shrink-0">
                      1
                    </div>
                    <h3 className="text-foreground">Quality Control</h3>
                  </div>
                  <div className="ml-11 space-y-2">
                    <p className="text-body">
                      Ensure your sequencing data has passed quality control metrics:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-body ml-2">
                      <li>Mean coverage depth ≥30x for WES, ≥15x for WGS</li>
                      <li>Base quality scores ≥Q30 for 90% of reads</li>
                      <li>Remove duplicate reads and low-quality variants</li>
                      <li>Verify sample identity and check for contamination</li>
                    </ul>
                  </div>
                </div>

                <Separator className="bg-muted" />

                {/* Step 2 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 border-[1.5px] border-foreground text-foreground font-bold flex items-center justify-center flex-shrink-0">
                      2
                    </div>
                    <h3 className="text-foreground">Variant Calling & Annotation</h3>
                  </div>
                  <div className="ml-11 space-y-3">
                    <p className="text-body">
                      Call variants and add functional annotations using recommended tools:
                    </p>
                    
                    <div className="bg-popover rounded-lg p-4 border border-border">
                      <h4 className="text-foreground mb-2">Recommended Tools:</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-body border-border">
                            GATK
                          </Badge>
                          <span className="text-body">For variant calling</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-body border-border">
                            VEP / SnpEff
                          </Badge>
                          <span className="text-body">For variant annotation</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-body border-border">
                            ANNOVAR
                          </Badge>
                          <span className="text-body">For comprehensive annotation</span>
                        </div>
                      </div>
                    </div>

                    <Alert className="bg-muted border-border">
                      <AlertCircle className="w-4 h-4 text-primary" />
                      <AlertDescription className="text-body">
                        Annotations should include gene symbols, transcript IDs, consequence predictions 
                        (missense, nonsense, etc.), and population frequencies (gnomAD, 1000 Genomes).
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>

                <Separator className="bg-muted" />

                {/* Step 3 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 border-[1.5px] border-foreground text-foreground font-bold flex items-center justify-center flex-shrink-0">
                      3
                    </div>
                    <h3 className="text-foreground">Filtering Variants</h3>
                  </div>
                  <div className="ml-11 space-y-2">
                    <p className="text-body">
                      Apply appropriate filters to focus on clinically relevant variants:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-body ml-2">
                      <li>Filter by quality score (QUAL ≥30, GQ ≥20)</li>
                      <li>Remove common variants (MAF &gt; 0.01 in population databases)</li>
                      <li>Focus on coding regions for exome data</li>
                      <li>Prioritize variants with predicted functional impact</li>
                    </ul>
                  </div>
                </div>

                <Separator className="bg-muted" />

                {/* Step 4 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 border-[1.5px] border-foreground text-foreground font-bold flex items-center justify-center flex-shrink-0">
                      4
                    </div>
                    <h3 className="text-foreground">Prepare Phenotype Data</h3>
                  </div>
                  <div className="ml-11 space-y-3">
                    <p className="text-body">
                      Collect and standardize clinical phenotype information:
                    </p>
                    
                    <div className="bg-popover rounded-lg p-4 border border-border">
                      <h4 className="text-foreground mb-3">HPO Term Selection:</h4>
                      <ol className="list-decimal list-inside space-y-2 text-body ml-2">
                        <li>Review patient clinical presentation</li>
                        <li>Search HPO database for matching terms</li>
                        <li>Select most specific terms available</li>
                        <li>Include both positive and negative findings</li>
                        <li>Record age of onset when applicable</li>
                      </ol>
                    </div>

                    <div className="bg-warning-soft rounded-lg p-4 border border-warning/30">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-warning mb-1">Important:</h4>
                          <p className="text-body">
                            Accurate phenotype data is crucial for diagnosis. Be as specific as possible 
                            and include all relevant clinical observations.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="bg-muted" />

                {/* Step 5 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 border-[1.5px] border-foreground text-foreground font-bold flex items-center justify-center flex-shrink-0">
                      5
                    </div>
                    <h3 className="text-foreground">Upload to Platform</h3>
                  </div>
                  <div className="ml-11 space-y-2">
                    <p className="text-body">
                      Once your files are prepared:
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-body ml-2">
                      <li>Create a new patient record in the system</li>
                      <li>Enter patient demographics and case information</li>
                      <li>Add clinical phenotypes using HPO terms</li>
                      <li>Upload the annotated VCF file</li>
                      <li>Run the AI analysis</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Examples Tab */}
          <TabsContent value="examples" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Download className="w-5 h-5 text-primary" />
                    Sample Files
                  </CardTitle>
                  <Button className="bg-primary hover:bg-primary-hover">
                    <Download className="w-4 h-4 mr-2" />
                    Download All Samples
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Sample VCF */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-foreground">Sample VCF File</h3>
                    <Button variant="outline" className="border-border text-body hover:bg-muted">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  <div className="bg-background rounded-lg p-4 border border-border overflow-x-auto">
                    <pre className="font-mono text-xs text-body">
{`##fileformat=VCFv4.2
##reference=GRCh38
##INFO=<ID=DP,Number=1,Type=Integer,Description="Total Depth">
##INFO=<ID=AF,Number=A,Type=Float,Description="Allele Frequency">
##INFO=<ID=CSQ,Number=.,Type=String,Description="Consequence annotations from VEP">
##FORMAT=<ID=GT,Number=1,Type=String,Description="Genotype">
##FORMAT=<ID=GQ,Number=1,Type=Integer,Description="Genotype Quality">
##FORMAT=<ID=AD,Number=R,Type=Integer,Description="Allelic depths">
#CHROM	POS	ID	REF	ALT	QUAL	FILTER	INFO	FORMAT	PATIENT_001
chr1	1234567	.	A	G	850.77	PASS	DP=89;AF=0.5;CSQ=G|missense_variant|MODERATE|GATAD2B|ENSG00000123456	GT:GQ:AD	0/1:99:45,44
chr2	9876543	rs123456	C	T	1250.45	PASS	DP=105;AF=0.48;CSQ=T|stop_gained|HIGH|SMARCE1|ENSG00000234567	GT:GQ:AD	0/1:99:53,52
chr14	1122334	.	G	A	920.33	PASS	DP=78;AF=0.51;CSQ=A|missense_variant|MODERATE|CHD8|ENSG00000345678	GT:GQ:AD	0/1:99:38,40`}
                    </pre>
                  </div>
                  <p className="text-muted-foreground">
                    This example shows three variants with proper annotation including consequence predictions, 
                    gene symbols, and quality metrics.
                  </p>
                </div>

                <Separator className="bg-muted" />

                {/* Sample Phenotypes */}
                <div className="space-y-3">
                  <h3 className="text-foreground">Sample Patient Phenotypes</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-popover rounded-lg p-4 border border-border">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-muted text-primary border-primary">
                          HP:0001290
                        </Badge>
                        <span className="text-foreground">Generalized hypotonia</span>
                      </div>
                      <p className="text-body mb-2">Onset: Infantile</p>
                      <p className="text-muted-foreground">
                        Reduced muscle tone affecting the whole body, typically observed in infancy
                      </p>
                    </div>

                    <div className="bg-popover rounded-lg p-4 border border-border">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-muted text-primary border-primary">
                          HP:0001250
                        </Badge>
                        <span className="text-foreground">Seizures</span>
                      </div>
                      <p className="text-body mb-2">Onset: Infantile</p>
                      <p className="text-muted-foreground">
                        Abnormal excessive or synchronous neuronal activity in the brain
                      </p>
                    </div>

                    <div className="bg-popover rounded-lg p-4 border border-border">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-muted text-primary border-primary">
                          HP:0001263
                        </Badge>
                        <span className="text-foreground">Global developmental delay</span>
                      </div>
                      <p className="text-body mb-2">Onset: Infantile</p>
                      <p className="text-muted-foreground">
                        Delay in achieving developmental milestones across multiple domains
                      </p>
                    </div>

                    <div className="bg-popover rounded-lg p-4 border border-border">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-muted text-primary border-primary">
                          HP:0002188
                        </Badge>
                        <span className="text-foreground">Delayed CNS myelination</span>
                      </div>
                      <p className="text-body mb-2">Onset: Infantile</p>
                      <p className="text-muted-foreground">
                        Deficient formation of myelin in the central nervous system
                      </p>
                    </div>
                  </div>
                </div>

                <Separator className="bg-muted" />

                {/* Complete Case Example */}
                <div className="space-y-3">
                  <h3 className="text-foreground">Complete Case Example</h3>
                  
                  <div className="bg-popover rounded-lg p-6 border border-border space-y-4">
                    <div>
                      <h4 className="text-foreground mb-2">Patient Demographics</h4>
                      <div className="grid grid-cols-2 gap-3 text-body">
                        <div>
                          <span className="text-muted-foreground">Patient ID:</span> UDN-P001
                        </div>
                        <div>
                          <span className="text-muted-foreground">Age:</span> 18 months
                        </div>
                        <div>
                          <span className="text-muted-foreground">Sex:</span> Female
                        </div>
                        <div>
                          <span className="text-muted-foreground">Ethnicity:</span> Ghanaian
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-muted" />

                    <div>
                      <h4 className="text-foreground mb-2">Clinical Presentation</h4>
                      <p className="text-body leading-relaxed">
                        Patient presents with severe global developmental delay, hypotonia progressing to 
                        hypertonia in the limbs, infantile-onset seizures, and MRI findings showing cerebral 
                        hypomyelination. Family history is non-contributory.
                      </p>
                    </div>

                    <Separator className="bg-muted" />

                    <div>
                      <h4 className="text-foreground mb-2">Genomic Data</h4>
                      <p className="text-body">
                        Whole exome sequencing (WES) performed with 95x mean coverage. 
                        VCF file contains 45,238 variants after quality filtering.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Reference */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Quick Reference Checklist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="text-foreground">Before Upload</h4>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-body">VCF file is properly formatted (v4.2+)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-body">Reference genome is specified</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-body">Variants are annotated with gene info</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-body">Quality metrics are included</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-body">File size is reasonable (&lt;500MB)</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-foreground">Phenotype Data</h4>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-body">All HPO terms are valid and specific</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-body">Age of onset is recorded</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-body">Major symptoms are included</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-body">Negative findings are noted</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-body">Clinical summary is complete</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Contact Support */}
        <Card className="bg-card border-border mt-6">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div>
                <h3 className="text-foreground mb-2">Need Additional Help?</h3>
                <p className="text-body mb-4">
                  If you have questions about file preparation or encounter any issues, our support team 
                  is here to help you get the most accurate diagnostic results.
                </p>
                <Button className="bg-primary hover:bg-primary-hover">
                  Contact Support
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}
