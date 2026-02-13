'use server';

import { GoogleGenAI } from "@google/genai";
import { getPatientByIdAction } from './patients';

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.error('GEMINI_API_KEY is missing in environment variables');
}

const ai = new GoogleGenAI({ apiKey: API_KEY || '' });

const DEFAULT_MODEL = 'gemini-2.5-pro';
const MODEL_NAME = 'gemini-2.5-pro';

export async function generateReportAction(patientId: string): Promise<{ success: boolean; report?: string; error?: string }> {
    try {
        if (!API_KEY) {
            return { success: false, error: 'API key not configured' };
        }

        const patientResult = await getPatientByIdAction(patientId);
        if (!patientResult.success || !patientResult.patient) {
            return { success: false, error: patientResult.error || 'Patient not found' };
        }

        const patient = patientResult.patient;

        const prompt = `
Generate a comprehensive medical report for the following patient based on their genomic and clinical data.
Use Markdown formatting for the report. Structure it clearly with headings.

Patient ID: ${patient.id}
Age: ${patient.age}
Sex: ${patient.sex}
Clinical Notes: ${patient.clinicalNotes || 'None'}
Phenotypes: ${JSON.stringify(patient.phenotypes || [])}
Variant Info: ${JSON.stringify(patient.variantInfo || {})}
Knowledge Graph Nodes: ${JSON.stringify(patient.knowledgeGraph?.nodes || [])}

The report should include:
1. Patient Summary
2. Phenotypic Analysis
3. Genetic Variant Assessment
4. Potential Diagnosis & Confidence
5. Recommended Next Steps

Keep the tone professional and clinical.
`;

        const result = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: [{ role: 'user', parts: [{ text: prompt }] }]
        });

        const response = result.text;
        const text = response;

        return { success: true, report: text };
    } catch (error) {
        console.error('Generate report error:', error);
        return { success: false, error: 'Failed to generate report' };
    }
}

export async function chatWithAIAction(history: { role: 'user' | 'model'; parts: string }[], message: string, patientContext?: string): Promise<{ success: boolean; reply?: string; error?: string }> {
    try {
        if (!API_KEY) {
            return { success: false, error: 'API key not configured' };
        }

        let msgToSend = message;
        if (patientContext && history.length === 0) {
            msgToSend = `Context: ${patientContext}\n\nUser Question: ${message}`;
        }

        const contents = [
            ...history.map(h => ({
                role: h.role,
                parts: [{ text: h.parts }]
            })),
            {
                role: 'user',
                parts: [{ text: msgToSend }]
            }
        ];

        const result = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: contents,
        });

        const text = result.text;

        return { success: true, reply: text };
    } catch (error) {
        console.error('Chat error:', error);
        return { success: false, error: 'Failed to process message' };
    }
}

export async function generateGenotypePhenotypeAnalysis(patientData: any): Promise<{ success: boolean; analysis?: string; error?: string }> {
    try {
        if (!API_KEY) {
            return { success: false, error: 'API key not configured' };
        }

        const prompt = `
Analyze the relationship between the following patient's genotype and phenotype.
Using the Gemini 2.5 Pro model, provide a detailed explanation of how the specific genetic variants likely contribute to the observed clinical phenotypes.

Patient Data:
- Gene: ${patientData.variantInfo?.gene || 'Unknown'}
- Variant: ${patientData.variantInfo?.cdnaChange || 'Unknown'} (${patientData.variantInfo?.proteinChange || 'Unknown'})
- Pathogenicity: ${patientData.variantInfo?.pathogenicity || 'Unknown'}
- Inheritance: ${patientData.variantInfo?.inheritance || 'Unknown'}
- Phenotypes: ${JSON.stringify(patientData.phenotypes || [])}
- Clinical Notes: ${patientData.clinicalNotes || 'None'}

Please structure your response with the following sections using Markdown:
1. **Genotype-Phenotype Correlation**: Explain the mechanism by which the gene defect leads to the symptoms.
2. **Variant Impact**: Specific impact of this variant (e.g., loss of function, gain of function).
3. **Consistency**: Are the observed phenotypes consistent with this gene's known spectrum?
4. **References**: Cite relevant medical literature or databases if applicable (e.g., OMIM, ClinVar).

Keep the analysis clinical and precise.
`;

        const result = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: [{ role: 'user', parts: [{ text: prompt }] }]
        });
        const text = result.text;

        return { success: true, analysis: text };
    } catch (error) {
        console.error('Genotype-Phenotype Analysis error:', error);
        return { success: false, error: 'Failed to generate analysis' };
    }
}
