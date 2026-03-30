import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Users, TrendingUp, AlertCircle, CheckCircle2, ExternalLink, AlertTriangle, XCircle } from "lucide-react";
import { Button } from "./ui/button";

interface PatientLikeMeComparisonProps {
  gene?: string;
}

// Database configurations for different genes
const geneDatabase: Record<string, any> = {
  'GATAD2B': {
    status: 'match',
    diseaseName: 'GATAD2B-associated neurodevelopmental disorder',
    totalCases: 127,
    similarPhenotype: 43,
    ageRange: '2-34 years',
    ageMedian: '9 years',
    deNovoPercent: 89,
    deNovoCount: '113 of 127',
    characteristics: [
      { name: 'Intellectual Disability', percent: 95 },
      { name: 'Seizures/Epilepsy', percent: 82 },
      { name: 'Hypotonia', percent: 78 },
      { name: 'Speech Delay', percent: 91 },
      { name: 'Autism Spectrum', percent: 67 },
      { name: 'Motor Delay', percent: 85 },
    ],
    treatments: [
      { title: 'Anti-epileptic medications (most commonly reported)', description: 'Valproic acid, Levetiracetam showing positive response in 71% of cases' },
      { title: 'Multidisciplinary therapy approach', description: 'Physical, occupational, and speech therapy showing developmental improvements' },
      { title: 'Behavioral interventions for autism spectrum features', description: 'Applied Behavior Analysis (ABA) and social skills training commonly utilized' },
    ],
  },
  'ASPM': {
    status: 'match',
    diseaseName: 'Primary autosomal recessive microcephaly type 5',
    totalCases: 89,
    similarPhenotype: 31,
    ageRange: '1-28 years',
    ageMedian: '11 years',
    deNovoPercent: 8,
    deNovoCount: '7 of 89',
    characteristics: [
      { name: 'Microcephaly', percent: 100 },
      { name: 'Intellectual Disability', percent: 97 },
      { name: 'Seizures', percent: 45 },
      { name: 'Simplified Gyral Pattern', percent: 62 },
      { name: 'Speech Delay', percent: 88 },
      { name: 'Motor Delay', percent: 73 },
    ],
    treatments: [
      { title: 'Special education and cognitive support programs', description: 'Individualized education plans tailored to cognitive level showing benefits' },
      { title: 'Anti-epileptic therapy for seizure management', description: 'Varied responses with 60% achieving seizure control' },
      { title: 'Early intervention services', description: 'Speech, occupational, and physical therapy from infancy' },
    ],
  },
  'DYRK1A': {
    status: 'limited',
    diseaseName: 'DYRK1A-related intellectual disability syndrome',
    totalCases: 52,
    similarPhenotype: 18,
    ageRange: '6 months-19 years',
    ageMedian: '7 years',
    deNovoPercent: 94,
    deNovoCount: '49 of 52',
    characteristics: [
      { name: 'Global Developmental Delay', percent: 98 },
      { name: 'Hypotonia', percent: 85 },
      { name: 'Feeding Difficulties', percent: 73 },
      { name: 'Microcephaly', percent: 58 },
      { name: 'Autism Features', percent: 41 },
      { name: 'Speech Delay', percent: 92 },
    ],
    treatments: [
      { title: 'Feeding therapy and nutritional support', description: 'G-tube placement in 35% of cases improving growth outcomes' },
      { title: 'Intensive developmental therapies', description: 'Physical, occupational, and speech therapy with gradual progress' },
      { title: 'Behavioral interventions', description: 'ABA and social skills training for autism spectrum features' },
    ],
  },
  'MT-TK': {
    status: 'match',
    diseaseName: 'MERRF syndrome (Myoclonic epilepsy with ragged red fibers)',
    totalCases: 234,
    similarPhenotype: 67,
    ageRange: '3-62 years',
    ageMedian: '16 years',
    deNovoPercent: 15,
    deNovoCount: '35 of 234',
    characteristics: [
      { name: 'Myoclonus', percent: 91 },
      { name: 'Ataxia', percent: 87 },
      { name: 'Muscle Weakness', percent: 79 },
      { name: 'Seizures', percent: 84 },
      { name: 'Exercise Intolerance', percent: 71 },
      { name: 'Hearing Loss', percent: 63 },
    ],
    treatments: [
      { title: 'CoQ10 and L-carnitine supplementation', description: 'Reported symptomatic improvements in 58% of patients' },
      { title: 'Anti-myoclonic medications', description: 'Levetiracetam, valproic acid, and clonazepam commonly used' },
      { title: 'Exercise modification and physical therapy', description: 'Low-intensity aerobic exercise programs showing benefits' },
    ],
  },
  'SCN1A': {
    status: 'match',
    diseaseName: 'Dravet syndrome',
    totalCases: 412,
    similarPhenotype: 156,
    ageRange: '6 months-34 years',
    ageMedian: '12 years',
    deNovoPercent: 91,
    deNovoCount: '375 of 412',
    characteristics: [
      { name: 'Multiple Seizure Types', percent: 100 },
      { name: 'Intellectual Disability', percent: 89 },
      { name: 'Hypotonia', percent: 76 },
      { name: 'Developmental Regression', percent: 82 },
      { name: 'Ataxia', percent: 71 },
      { name: 'Sleep Disturbances', percent: 68 },
    ],
    treatments: [
      { title: 'Multi-drug anti-epileptic regimen', description: 'Valproate, clobazam, stiripentol combination showing best outcomes' },
      { title: 'Cannabidiol (Epidiolex) therapy', description: 'FDA-approved treatment reducing seizure frequency in 43% of patients' },
      { title: 'Dietary interventions', description: 'Modified Atkins diet and ketogenic diet showing promise in some cases' },
    ],
  },
  'ARX': {
    status: 'limited',
    diseaseName: 'ARX-related infantile spasms',
    totalCases: 64,
    similarPhenotype: 22,
    ageRange: '3 months-11 years',
    ageMedian: '4 years',
    deNovoPercent: 45,
    deNovoCount: '29 of 64',
    characteristics: [
      { name: 'Infantile Spasms', percent: 100 },
      { name: 'Intellectual Disability', percent: 96 },
      { name: 'Microcephaly', percent: 81 },
      { name: 'Developmental Delay', percent: 98 },
      { name: 'Dystonia', percent: 53 },
      { name: 'Vision Problems', percent: 47 },
    ],
    treatments: [
      { title: 'ACTH and vigabatrin for spasms', description: 'First-line treatments with 65% showing initial response' },
      { title: 'Ketogenic diet', description: 'Adjunctive therapy showing seizure reduction in select cases' },
      { title: 'Developmental support services', description: 'Early intervention critical for maximizing developmental potential' },
    ],
  },
  'MECP2': {
    status: 'match',
    diseaseName: 'Rett syndrome',
    totalCases: 523,
    similarPhenotype: 198,
    ageRange: '1-45 years',
    ageMedian: '14 years',
    deNovoPercent: 99,
    deNovoCount: '518 of 523',
    characteristics: [
      { name: 'Developmental Regression', percent: 100 },
      { name: 'Hand Stereotypies', percent: 94 },
      { name: 'Ataxia/Apraxia', percent: 89 },
      { name: 'Breathing Irregularities', percent: 78 },
      { name: 'Seizures', percent: 71 },
      { name: 'Scoliosis', percent: 85 },
    ],
    treatments: [
      { title: 'Music and hydrotherapy', description: 'Non-pharmacological interventions improving mood and engagement' },
      { title: 'Trofinetide (FDA-approved)', description: 'New treatment showing improvements in communication and daily functioning' },
      { title: 'Multidisciplinary symptom management', description: 'Physical therapy, orthotics, nutritional support, and anti-epileptic medications' },
    ],
  },
  'PLA2G6': {
    status: 'limited',
    diseaseName: 'Infantile neuroaxonal dystrophy (INAD)',
    totalCases: 47,
    similarPhenotype: 16,
    ageRange: '6 months-14 years',
    ageMedian: '5 years',
    deNovoPercent: 0,
    deNovoCount: '0 of 47',
    characteristics: [
      { name: 'Progressive Motor Decline', percent: 100 },
      { name: 'Dystonia', percent: 91 },
      { name: 'Spasticity', percent: 87 },
      { name: 'Vision Loss', percent: 73 },
      { name: 'Seizures', percent: 58 },
      { name: 'Cognitive Decline', percent: 82 },
    ],
    treatments: [
      { title: 'Symptomatic dystonia management', description: 'Baclofen, trihexyphenidyl with variable responses' },
      { title: 'Supportive and palliative care', description: 'Focus on quality of life, comfort, and symptom management' },
      { title: 'Multidisciplinary team approach', description: 'Neurology, orthopedics, nutrition, and palliative care coordination' },
    ],
  },
  'RYR1': {
    status: 'match',
    diseaseName: 'RYR1-related congenital myopathy',
    totalCases: 178,
    similarPhenotype: 54,
    ageRange: 'Birth-38 years',
    ageMedian: '13 years',
    deNovoPercent: 22,
    deNovoCount: '39 of 178',
    characteristics: [
      { name: 'Hypotonia', percent: 97 },
      { name: 'Muscle Weakness', percent: 100 },
      { name: 'Motor Delay', percent: 88 },
      { name: 'Scoliosis', percent: 64 },
      { name: 'Respiratory Complications', percent: 41 },
      { name: 'Malignant Hyperthermia Risk', percent: 73 },
    ],
    treatments: [
      { title: 'Malignant hyperthermia precautions', description: 'Medical alert identification and anesthesia planning essential' },
      { title: 'Physical therapy and assistive devices', description: 'Maintaining mobility and preventing contractures' },
      { title: 'Respiratory monitoring and support', description: 'Sleep studies and ventilation support when needed' },
    ],
  },
};

export function PatientLikeMeComparison({ gene = 'GATAD2B' }: PatientLikeMeComparisonProps) {
  const data = geneDatabase[gene];

  // If no data for this gene, show "no match" status
  if (!data) {
    return (
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <CardTitle className="text-slate-100">PatientsLikeMe Database Comparison</CardTitle>
                <p className="text-slate-400 mt-1">Community-driven rare disease registry insights</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-slate-500/20 text-slate-300 border-slate-500/30">
              <XCircle className="w-3 h-3 mr-1" />
              No Match Found
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-[#2d1b4e] border border-purple-900/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-slate-100 mb-2">
                  <strong>{gene}</strong>-related conditions have not been documented in the PatientsLikeMe community database.
                </p>
                <p className="text-slate-300">
                  This may indicate an ultra-rare condition with limited reported cases. Consider consulting with disease-specific registries or international rare disease databases for additional patient data.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-purple-900/20">
            <p className="text-slate-300">
              Last database update: <span className="text-slate-100">October 2025</span>
            </p>
            <Button variant="outline" className="gap-2 border-purple-900/20 text-slate-200 hover:bg-purple-900/30">
              Search Other Registries
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const statusConfig = {
    match: {
      icon: <CheckCircle2 className="w-3 h-3 mr-1" />,
      text: 'Match Found',
      bgColor: 'bg-green-500/20',
      textColor: 'text-green-300',
      borderColor: 'border-green-500/30',
      alertBg: 'bg-purple-500/20',
      alertBorder: 'border-purple-500/30',
      alertIcon: 'text-purple-400',
      alertText: 'text-slate-100',
      alertSubText: 'text-slate-300',
    },
    limited: {
      icon: <AlertTriangle className="w-3 h-3 mr-1" />,
      text: 'Limited Data',
      bgColor: 'bg-amber-500/20',
      textColor: 'text-amber-300',
      borderColor: 'border-amber-500/30',
      alertBg: 'bg-amber-500/20',
      alertBorder: 'border-amber-500/30',
      alertIcon: 'text-amber-400',
      alertText: 'text-slate-100',
      alertSubText: 'text-slate-300',
    },
  };

  const config = statusConfig[data.status as 'match' | 'limited'];

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-slate-100">PatientsLikeMe Database Comparison</CardTitle>
              <p className="text-slate-400 mt-1">Community-driven rare disease registry insights</p>
            </div>
          </div>
          <Badge variant="outline" className={`${config.bgColor} ${config.textColor} ${config.borderColor}`}>
            {config.icon}
            {config.text}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Match Summary */}
        <div className={`${config.alertBg} border ${config.alertBorder} rounded-lg p-4`}>
          <div className="flex items-start gap-3">
            <AlertCircle className={`w-5 h-5 ${config.alertIcon} mt-0.5 flex-shrink-0`} />
            <div className="flex-1">
              <p className={`${config.alertText} mb-2`}>
                <strong>{data.diseaseName}</strong> has {data.status === 'limited' ? 'limited documentation' : 'been previously identified'} in the PatientsLikeMe community database.
              </p>
              <p className={config.alertSubText}>
                {data.status === 'limited' 
                  ? `This rare disease has a small number of documented cases. Data may be preliminary and should be interpreted with caution.`
                  : `This rare disease has documented cases with similar genetic profiles and phenotypic presentations, providing validation for the current diagnosis.`
                }
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-[#2d1b4e] border border-purple-900/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-slate-400" />
              <p className="text-slate-400">Total Cases</p>
            </div>
            <p className="text-slate-100">{data.totalCases}</p>
            <p className="text-slate-400 mt-1">Globally registered</p>
          </div>

          <div className="bg-[#2d1b4e] border border-purple-900/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-slate-400" />
              <p className="text-slate-400">Similar Phenotype</p>
            </div>
            <p className="text-slate-100">{data.similarPhenotype} patients</p>
            <p className="text-slate-400 mt-1">Match ≥75%</p>
          </div>

          <div className="bg-[#2d1b4e] border border-purple-900/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-slate-400" />
              <p className="text-slate-400">Age Range</p>
            </div>
            <p className="text-slate-100">{data.ageRange}</p>
            <p className="text-slate-400 mt-1">Median: {data.ageMedian}</p>
          </div>

          <div className="bg-[#2d1b4e] border border-purple-900/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-slate-400" />
              <p className="text-slate-400">De Novo Cases</p>
            </div>
            <p className="text-slate-100">{data.deNovoPercent}%</p>
            <p className="text-slate-400 mt-1">{data.deNovoCount}</p>
          </div>
        </div>

        {/* Common Characteristics */}
        <div>
          <h3 className="text-slate-100 mb-3">Most Reported Characteristics in Community</h3>
          <div className="grid grid-cols-2 gap-3">
            {data.characteristics.map((char: any, index: number) => (
              <div key={index} className="bg-[#2d1b4e] border border-purple-900/20 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-100">{char.name}</span>
                  <Badge variant="outline" className="text-slate-300 border-purple-900/20">{char.percent}%</Badge>
                </div>
                <div className="w-full bg-purple-900/30 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${char.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community Insights */}
        <div>
          <h3 className="text-slate-100 mb-3">Community Treatment Insights</h3>
          <div className="space-y-2">
            {data.treatments.map((treatment: any, index: number) => (
              <div key={index} className="bg-[#2d1b4e] border border-purple-900/20 rounded-lg p-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-100 mb-1">{treatment.title}</p>
                    <p className="text-slate-300">{treatment.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-4 border-t border-purple-900/20">
          <p className="text-slate-300">
            Last database update: <span className="text-slate-100">October 2025</span>
          </p>
          <Button variant="outline" className="gap-2 border-purple-900/20 text-slate-200 hover:bg-purple-900/30">
            View Full Community Data
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
