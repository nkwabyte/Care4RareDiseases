import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { useState, KeyboardEvent, type ReactNode } from 'react';
import { cn } from '@/components/ui/utils';
import { phenotypeFit } from '@/lib/evidence';

const SAMPLE_TERMS = [
  'Limb hypertonia',
  'Infantile spasms',
  'Developmental regression',
  'Microcephaly',
  'Seizures',
  'Intellectual disability',
  'Hypotonia',
  'Ataxia',
  'Global developmental delay',
  'Feeding difficulties',
  'Dystonia',
  'Muscle weakness',
];

interface ClinicalPhenotypesProps {
  initialPhenotypes?: string[];
  /** Phenotypes known to be produced by the primary variant's gene. */
  knownFeatures?: string[];
  gene?: string | null;
  /** Primary action shown directly under the phenotype list. */
  action?: ReactNode;
}

export function ClinicalPhenotypes({ initialPhenotypes = [], knownFeatures = [], gene, action }: ClinicalPhenotypesProps) {
  const [selectedTerms, setSelectedTerms] = useState<string[]>(initialPhenotypes);
  const [prevInitialPhenotypes, setPrevInitialPhenotypes] = useState<string[]>(initialPhenotypes);
  const [inputValue, setInputValue] = useState('');

  // Update selected terms when patient changes
  if (initialPhenotypes !== prevInitialPhenotypes) {
    setPrevInitialPhenotypes(initialPhenotypes);
    setSelectedTerms(initialPhenotypes);
  }

  const addTerm = (term: string) => {
    const trimmedTerm = term.trim();
    if (trimmedTerm && !selectedTerms.includes(trimmedTerm)) {
      setSelectedTerms([...selectedTerms, trimmedTerm]);
    }
  };

  const removeTerm = (termToRemove: string) => {
    setSelectedTerms(selectedTerms.filter(term => term !== termToRemove));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Check if user entered a comma
    if (value.includes(',')) {
      const terms = value.split(',');
      // Add all complete terms (before the last comma)
      terms.slice(0, -1).forEach(term => addTerm(term));
      // Keep the text after the last comma in the input
      setInputValue(terms[terms.length - 1]);
    } else {
      setInputValue(value);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addTerm(inputValue);
      setInputValue('');
    }
  };

  const handleSampleTermClick = (term: string) => {
    addTerm(term);
  };

  const fit = phenotypeFit(selectedTerms, knownFeatures);
  const known = fit.filter((f) => f.explained).length;

  return (
    <Card className="p-6 bg-card border-border gap-0">
      <h3 className="mb-4 text-[13px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
        Observed phenotypes · {known} of {fit.length} known features{gene ? ` of ${gene}` : ''}
      </h3>

      {fit.length === 0 ? (
        <p className="text-muted-foreground">No phenotypes recorded yet. Add them below.</p>
      ) : (
        <ul className="border-t border-border">
          {fit.map((f) => (
            <li key={f.term} className="flex items-center gap-3 py-2.5 border-b border-border">
              <span
                aria-hidden
                className={cn('size-3.5 shrink-0 border-2 border-primary', f.explained && 'bg-primary')}
              />
              <span className="text-foreground">{f.term}</span>
              <span className="ml-auto text-sm text-muted-foreground">
                {f.explained ? 'Known feature' : 'Not a known feature'}
              </span>
              <button
                type="button"
                onClick={() => removeTerm(f.term)}
                className="p-1 text-muted-foreground hover:bg-destructive-soft hover:text-destructive"
                aria-label={`Remove ${f.term}`}
              >
                <X size={14} aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}

      {action && <div className="mt-5">{action}</div>}

      <details className="group mt-5 border-t border-border pt-4">
        <summary className="cursor-pointer select-none font-semibold text-primary hover:underline">
          Add phenotypes
        </summary>
        <div className="mt-4">
          <Label htmlFor="hpo-terms" className="text-foreground mb-2 block">
            HPO term
          </Label>
          <Input
            id="hpo-terms"
            placeholder="Type a term and press Enter or comma"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="bg-card mb-4"
          />
          <p className="mb-2 text-sm text-muted-foreground">Common terms</p>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_TERMS.map((term) => {
              const added = selectedTerms.includes(term);
              return (
                <button
                  key={term}
                  type="button"
                  disabled={added}
                  onClick={() => handleSampleTermClick(term)}
                  className="border border-border bg-card px-2.5 py-1 text-sm text-body transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:hover:border-border"
                >
                  {term}
                </button>
              );
            })}
          </div>
        </div>
      </details>
    </Card>
  );
}
