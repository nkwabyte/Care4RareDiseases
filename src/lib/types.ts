export interface VariantInfo {
    gene: string;
    pathogenicity: string;
    chromosome: string;
    position: string;
    zygosity: string;
    variantType: string;
    inheritance: string;
    cdnaChange: string;
    proteinChange: string;
    affectedPhenotypes: string[];
}

export interface Node {
    id: string;
    label: string;
    x: number;
    y: number;
    type: 'disease' | 'gene-primary' | 'gene-secondary' | 'gene-tertiary' | 'phenotype';
    size: number;
}

export interface Edge {
    from: string;
    to: string;
    strength: 'strong' | 'medium' | 'weak';
}

export interface KnowledgeGraphData {
    nodes: Node[];
    edges: Edge[];
}

export interface Patient {
    id: string;
    age: number;
    sex: string;
    phenotypes: string[];
    clinicalNotes: string;
    variantInfo?: VariantInfo;
    knowledgeGraph?: KnowledgeGraphData;
}
