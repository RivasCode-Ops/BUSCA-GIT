export function buildAnalysisPrompt(metadata: string, files: string): string {
  return `
## Metadados do Repositório
${metadata}

## Arquivos importantes detectados
${files}

Com base nas informações acima, analise o repositório e responda:
1. Qual o propósito principal do projeto?
2. Quais os principais diferenciais?
3. Quais as limitações óbvias?
4. Vale a pena estudar, reaproveitar em produção ou descartar?

Responda em português claro e direto.
`
}
