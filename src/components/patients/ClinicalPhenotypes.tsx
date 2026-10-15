import { Card } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { X } from 'lucide-react';
import { useState, KeyboardEvent, useEffect } from 'react';

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
}

export function ClinicalPhenotypes({ initialPhenotypes = [] }: ClinicalPhenotypesProps) {
  const [selectedTerms, setSelectedTerms] = useState<string[]>(initialPhenotypes);
  const [inputValue, setInputValue] = useState('');

  // Update selected terms when patient changes
  useEffect(() => {
    setSelectedTerms(initialPhenotypes);
  }, [initialPhenotypes]);

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

  return (
    <Card className="p-5 bg-card border-border">
      <h3 className="mb-4 text-slate-100">Clinical Phenotypes (HPO Terms)</h3>
      
      <div>
        <Label htmlFor="hpo-terms" className="text-slate-200 mb-2 block">
          HPO Terms
        </Label>
        
        {/* Selected Terms as Chips */}
        {selectedTerms.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3 p-3 bg-[#2d1b4e] rounded-md border border-purple-900/20">
            {selectedTerms.map((term, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 pr-1 gap-1"
              >
                {term}
                <button
                  onClick={() => removeTerm(term)}
                  className="ml-1 hover:bg-purple-600 rounded-full p-0.5"
                  aria-label={`Remove ${term}`}
                >
                  <X size={12} />
                </button>
              </Badge>
            ))}
          </div>
        )}
        
        {/* Input Field */}
        <Input 
          id="hpo-terms"
          placeholder="Type terms and press comma or Enter..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="bg-[#2d1b4e] border-purple-900/20 text-slate-200 placeholder:text-slate-500 mb-3"
        />
        
        {/* Sample Terms */}
        <div className="space-y-2">
          <p className="text-slate-400">HPO terms (click to add):</p>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_TERMS.map((term, index) => (
              <Badge
                key={index}
                variant="outline"
                className={`cursor-pointer transition-colors ${
                  selectedTerms.includes(term)
                    ? 'bg-slate-700 text-slate-500 border-slate-600 cursor-not-allowed'
                    : 'hover:bg-purple-900/30 hover:border-purple-700 hover:text-purple-300 text-slate-300 border-purple-900/20'
                }`}
                onClick={() => !selectedTerms.includes(term) && handleSampleTermClick(term)}
              >
                {term}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
