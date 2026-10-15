import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
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
import { Button } from './ui/button';

export function HelpScreen() {
  return (
    <div className="h-screen bg-background overflow-hidden flex flex-col flex-1">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-slate-100">Help & Documentation</h1>
              <p className="text-slate-400 mt-1">
                Learn how to prepare and upload patient genomic data for rare disease diagnosis
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-[#1a0f2e] border border-purple-900/20">
            <TabsTrigger 
              value="overview"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="file-formats"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              File Formats
            </TabsTrigger>
            <TabsTrigger 
              value="preparation"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              File Preparation
            </TabsTrigger>
            <TabsTrigger 
              value="examples"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Examples
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-slate-100 flex items-center gap-2">
                  <Dna className="w-5 h-5 text-purple-400" />
                  Getting Started
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-300 leading-relaxed">
                  Care for Rare uses advanced AI algorithms to analyze genomic data and identify potential 
                  rare genetic diseases. To get the most accurate results, it's important to prepare your 
                  patient files correctly.
                </p>

                <Separator className="bg-purple-900/20" />

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-[#1a0f2e] rounded-lg p-4 border border-purple-900/20">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-3">
                      <FileUp className="w-5 h-5 text-purple-400" />
                    </div>
                    <h3 className="text-slate-100 mb-2">1. Prepare Files</h3>
                    <p className="text-slate-300">
                      Format your genomic data according to our specifications
                    </p>
                  </div>

                  <div className="bg-[#1a0f2e] rounded-lg p-4 border border-purple-900/20">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-3">
                      <FileText className="w-5 h-5 text-purple-400" />
                    </div>
                    <h3 className="text-slate-100 mb-2">2. Upload Data</h3>
                    <p className="text-slate-300">
                      Upload VCF files and patient phenotype information
                    </p>
                  </div>

                  <div className="bg-[#1a0f2e] rounded-lg p-4 border border-purple-900/20">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-3">
                      <CheckCircle className="w-5 h-5 text-purple-400" />
                    </div>
                    <h3 className="text-slate-100 mb-2">3. Run Analysis</h3>
                    <p className="text-slate-300">
                      Let our AI analyze the data and identify candidate genes
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-slate-100">Supported Data Types</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-slate-100">Whole Exome Sequencing (WES) VCF Files</p>
                    <p className="text-slate-400">Variant Call Format files from exome sequencing</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-slate-100">Whole Genome Sequencing (WGS) VCF Files</p>
                    <p className="text-slate-400">Variant Call Format files from genome sequencing</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-slate-100">HPO Phenotype Terms</p>
                    <p className="text-slate-400">Human Phenotype Ontology standardized clinical observations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* File Formats Tab */}
          <TabsContent value="file-formats" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-slate-100 flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-purple-400" />
                  VCF File Format
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="bg-purple-500/10 border-purple-500/30">
                  <AlertCircle className="w-4 h-4 text-purple-400" />
                  <AlertDescription className="text-slate-300">
                    VCF (Variant Call Format) is the standard file format for storing gene sequence variations. 
                    Files must be properly formatted and include all required metadata fields.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <h4 className="text-slate-100">Required VCF Specifications:</h4>
                  
                  <div className="grid gap-3">
                    <div className="bg-[#1a0f2e] rounded-lg p-4 border border-purple-900/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-700">
                          Version
                        </Badge>
                        <span className="text-slate-100">VCF v4.2 or higher</span>
                      </div>
                      <p className="text-slate-300">Must include version specification in header</p>
                    </div>

                    <div className="bg-[#1a0f2e] rounded-lg p-4 border border-purple-900/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-700">
                          Reference
                        </Badge>
                        <span className="text-slate-100">GRCh37 (hg19) or GRCh38 (hg38)</span>
                      </div>
                      <p className="text-slate-300">Specify reference genome build in header</p>
                    </div>

                    <div className="bg-[#1a0f2e] rounded-lg p-4 border border-purple-900/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-700">
                          Compression
                        </Badge>
                        <span className="text-slate-100">.vcf, .vcf.gz, or .bcf</span>
                      </div>
                      <p className="text-slate-300">Uncompressed or bgzip-compressed files accepted</p>
                    </div>

                    <div className="bg-[#1a0f2e] rounded-lg p-4 border border-purple-900/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-700">
                          Annotations
                        </Badge>
                        <span className="text-slate-100">INFO fields with functional annotations</span>
                      </div>
                      <p className="text-slate-300">Include gene names, consequence predictions, allele frequencies</p>
                    </div>
                  </div>
                </div>

                <Separator className="bg-purple-900/20" />

                <div className="space-y-3">
                  <h4 className="text-slate-100">Sample VCF Header:</h4>
                  <div className="bg-[#0a0514] rounded-lg p-4 border border-purple-900/20 font-mono text-sm overflow-x-auto">
                    <pre className="text-slate-300">
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
                <CardTitle className="text-slate-100">HPO Phenotype Format</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-300 leading-relaxed">
                  Clinical phenotypes should be entered using standardized Human Phenotype Ontology (HPO) terms. 
                  Each phenotype should include the HPO ID and description.
                </p>

                <div className="space-y-2">
                  <h4 className="text-slate-100">Format Structure:</h4>
                  <div className="bg-[#0a0514] rounded-lg p-4 border border-purple-900/20">
                    <div className="space-y-2 font-mono text-sm">
                      <div className="flex items-start gap-3">
                        <span className="text-purple-400">HPO ID:</span>
                        <span className="text-slate-300">HP:0001234</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-purple-400">Term:</span>
                        <span className="text-slate-300">Phenotype Description</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-purple-400">Onset:</span>
                        <span className="text-slate-300">Age of onset (optional)</span>
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
                <CardTitle className="text-slate-100 flex items-center gap-2">
                  <Code className="w-5 h-5 text-purple-400" />
                  Step-by-Step File Preparation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center flex-shrink-0">
                      1
                    </div>
                    <h3 className="text-slate-100">Quality Control</h3>
                  </div>
                  <div className="ml-11 space-y-2">
                    <p className="text-slate-300">
                      Ensure your sequencing data has passed quality control metrics:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-slate-300 ml-2">
                      <li>Mean coverage depth ≥30x for WES, ≥15x for WGS</li>
                      <li>Base quality scores ≥Q30 for 90% of reads</li>
                      <li>Remove duplicate reads and low-quality variants</li>
                      <li>Verify sample identity and check for contamination</li>
                    </ul>
                  </div>
                </div>

                <Separator className="bg-purple-900/20" />

                {/* Step 2 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center flex-shrink-0">
                      2
                    </div>
                    <h3 className="text-slate-100">Variant Calling & Annotation</h3>
                  </div>
                  <div className="ml-11 space-y-3">
                    <p className="text-slate-300">
                      Call variants and add functional annotations using recommended tools:
                    </p>
                    
                    <div className="bg-[#1a0f2e] rounded-lg p-4 border border-purple-900/20">
                      <h4 className="text-slate-100 mb-2">Recommended Tools:</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-slate-300 border-purple-900/20">
                            GATK
                          </Badge>
                          <span className="text-slate-300">For variant calling</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-slate-300 border-purple-900/20">
                            VEP / SnpEff
                          </Badge>
                          <span className="text-slate-300">For variant annotation</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-slate-300 border-purple-900/20">
                            ANNOVAR
                          </Badge>
                          <span className="text-slate-300">For comprehensive annotation</span>
                        </div>
                      </div>
                    </div>

                    <Alert className="bg-purple-500/10 border-purple-500/30">
                      <AlertCircle className="w-4 h-4 text-purple-400" />
                      <AlertDescription className="text-slate-300">
                        Annotations should include gene symbols, transcript IDs, consequence predictions 
                        (missense, nonsense, etc.), and population frequencies (gnomAD, 1000 Genomes).
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>

                <Separator className="bg-purple-900/20" />

                {/* Step 3 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center flex-shrink-0">
                      3
                    </div>
                    <h3 className="text-slate-100">Filtering Variants</h3>
                  </div>
                  <div className="ml-11 space-y-2">
                    <p className="text-slate-300">
                      Apply appropriate filters to focus on clinically relevant variants:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-slate-300 ml-2">
                      <li>Filter by quality score (QUAL ≥30, GQ ≥20)</li>
                      <li>Remove common variants (MAF &gt; 0.01 in population databases)</li>
                      <li>Focus on coding regions for exome data</li>
                      <li>Prioritize variants with predicted functional impact</li>
                    </ul>
                  </div>
                </div>

                <Separator className="bg-purple-900/20" />

                {/* Step 4 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center flex-shrink-0">
                      4
                    </div>
                    <h3 className="text-slate-100">Prepare Phenotype Data</h3>
                  </div>
                  <div className="ml-11 space-y-3">
                    <p className="text-slate-300">
                      Collect and standardize clinical phenotype information:
                    </p>
                    
                    <div className="bg-[#1a0f2e] rounded-lg p-4 border border-purple-900/20">
                      <h4 className="text-slate-100 mb-3">HPO Term Selection:</h4>
                      <ol className="list-decimal list-inside space-y-2 text-slate-300 ml-2">
                        <li>Review patient clinical presentation</li>
                        <li>Search HPO database for matching terms</li>
                        <li>Select most specific terms available</li>
                        <li>Include both positive and negative findings</li>
                        <li>Record age of onset when applicable</li>
                      </ol>
                    </div>

                    <div className="bg-amber-500/10 rounded-lg p-4 border border-amber-500/30">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-amber-300 mb-1">Important:</h4>
                          <p className="text-slate-300">
                            Accurate phenotype data is crucial for diagnosis. Be as specific as possible 
                            and include all relevant clinical observations.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="bg-purple-900/20" />

                {/* Step 5 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center flex-shrink-0">
                      5
                    </div>
                    <h3 className="text-slate-100">Upload to Platform</h3>
                  </div>
                  <div className="ml-11 space-y-2">
                    <p className="text-slate-300">
                      Once your files are prepared:
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-slate-300 ml-2">
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
                  <CardTitle className="text-slate-100 flex items-center gap-2">
                    <Download className="w-5 h-5 text-purple-400" />
                    Sample Files
                  </CardTitle>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Download className="w-4 h-4 mr-2" />
                    Download All Samples
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Sample VCF */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-slate-100">Sample VCF File</h3>
                    <Button variant="outline" className="border-purple-900/20 text-slate-300 hover:bg-purple-900/30">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  <div className="bg-[#0a0514] rounded-lg p-4 border border-purple-900/20 overflow-x-auto">
                    <pre className="font-mono text-xs text-slate-300">
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
                  <p className="text-slate-400">
                    This example shows three variants with proper annotation including consequence predictions, 
                    gene symbols, and quality metrics.
                  </p>
                </div>

                <Separator className="bg-purple-900/20" />

                {/* Sample Phenotypes */}
                <div className="space-y-3">
                  <h3 className="text-slate-100">Sample Patient Phenotypes</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-[#1a0f2e] rounded-lg p-4 border border-purple-900/20">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-700">
                          HP:0001290
                        </Badge>
                        <span className="text-slate-100">Generalized hypotonia</span>
                      </div>
                      <p className="text-slate-300 mb-2">Onset: Infantile</p>
                      <p className="text-slate-400">
                        Reduced muscle tone affecting the whole body, typically observed in infancy
                      </p>
                    </div>

                    <div className="bg-[#1a0f2e] rounded-lg p-4 border border-purple-900/20">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-700">
                          HP:0001250
                        </Badge>
                        <span className="text-slate-100">Seizures</span>
                      </div>
                      <p className="text-slate-300 mb-2">Onset: Infantile</p>
                      <p className="text-slate-400">
                        Abnormal excessive or synchronous neuronal activity in the brain
                      </p>
                    </div>

                    <div className="bg-[#1a0f2e] rounded-lg p-4 border border-purple-900/20">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-700">
                          HP:0001263
                        </Badge>
                        <span className="text-slate-100">Global developmental delay</span>
                      </div>
                      <p className="text-slate-300 mb-2">Onset: Infantile</p>
                      <p className="text-slate-400">
                        Delay in achieving developmental milestones across multiple domains
                      </p>
                    </div>

                    <div className="bg-[#1a0f2e] rounded-lg p-4 border border-purple-900/20">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-700">
                          HP:0002188
                        </Badge>
                        <span className="text-slate-100">Delayed CNS myelination</span>
                      </div>
                      <p className="text-slate-300 mb-2">Onset: Infantile</p>
                      <p className="text-slate-400">
                        Deficient formation of myelin in the central nervous system
                      </p>
                    </div>
                  </div>
                </div>

                <Separator className="bg-purple-900/20" />

                {/* Complete Case Example */}
                <div className="space-y-3">
                  <h3 className="text-slate-100">Complete Case Example</h3>
                  
                  <div className="bg-[#1a0f2e] rounded-lg p-6 border border-purple-900/20 space-y-4">
                    <div>
                      <h4 className="text-slate-100 mb-2">Patient Demographics</h4>
                      <div className="grid grid-cols-2 gap-3 text-slate-300">
                        <div>
                          <span className="text-slate-400">Patient ID:</span> UDN-P001
                        </div>
                        <div>
                          <span className="text-slate-400">Age:</span> 18 months
                        </div>
                        <div>
                          <span className="text-slate-400">Sex:</span> Female
                        </div>
                        <div>
                          <span className="text-slate-400">Ethnicity:</span> Ghanaian
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-purple-900/20" />

                    <div>
                      <h4 className="text-slate-100 mb-2">Clinical Presentation</h4>
                      <p className="text-slate-300 leading-relaxed">
                        Patient presents with severe global developmental delay, hypotonia progressing to 
                        hypertonia in the limbs, infantile-onset seizures, and MRI findings showing cerebral 
                        hypomyelination. Family history is non-contributory.
                      </p>
                    </div>

                    <Separator className="bg-purple-900/20" />

                    <div>
                      <h4 className="text-slate-100 mb-2">Genomic Data</h4>
                      <p className="text-slate-300">
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
                <CardTitle className="text-slate-100">Quick Reference Checklist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="text-slate-100">Before Upload</h4>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-300">VCF file is properly formatted (v4.2+)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-300">Reference genome is specified</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-300">Variants are annotated with gene info</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-300">Quality metrics are included</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-300">File size is reasonable (&lt;500MB)</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-slate-100">Phenotype Data</h4>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-300">All HPO terms are valid and specific</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-300">Age of onset is recorded</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-300">Major symptoms are included</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-300">Negative findings are noted</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-300">Clinical summary is complete</span>
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
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-slate-100 mb-2">Need Additional Help?</h3>
                <p className="text-slate-300 mb-4">
                  If you have questions about file preparation or encounter any issues, our support team 
                  is here to help you get the most accurate diagnostic results.
                </p>
                <Button className="bg-purple-600 hover:bg-purple-700">
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
