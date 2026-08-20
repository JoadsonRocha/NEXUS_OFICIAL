/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Este módulo foi atualizado para consumir a API de Inteligência Artificial de forma segura
// através do backend (server.ts), não expondo mais a GEMINI_API_KEY no cliente.

export async function processarCaos(textoBruto: string) {
  if (!textoBruto || textoBruto.trim().length === 0) {
    return {
      tarefas_logistica: [],
      acoes_politicas: [],
      alertas_crise: [],
      sugestoes_agenda: []
    };
  }

  try {
    const response = await fetch('/api/ai/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: textoBruto, type: 'caos' })
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    console.warn('Fallback em processarCaos:', e);
  }

  return {
    tarefas_logistica: [],
    acoes_politicas: [textoBruto],
    alertas_crise: [],
    sugestoes_agenda: []
  };
}

export async function processarNotaAudio(textoBruto: string): Promise<string> {
  if (!textoBruto || textoBruto.trim().length === 0) {
    return "";
  }

  try {
    const response = await fetch('/api/ai/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: textoBruto, type: 'nota' })
    });

    if (response.ok) {
      const data = await response.json();
      if (data?.text) return data.text;
    }
  } catch (e) {
    console.warn('Fallback em processarNotaAudio:', e);
  }

  // Fallback: Retorna o próprio texto transcrito/digitado para nunca impedir o salvamento da anotação
  return textoBruto;
}

export async function gerarBriefingCandidato(municipio: string, demandas: any[]): Promise<string> {
  if (!municipio) {
    return "Município não especificado.";
  }

  try {
    const response = await fetch('/api/ai/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: '', type: 'briefing', context: { municipio, demandas } })
    });

    if (response.ok) {
      const data = await response.json();
      if (data?.text) return data.text;
    }
  } catch (e) {
    console.warn('Fallback em gerarBriefingCandidato:', e);
  }

  return `Briefing Estratégico - ${municipio}\n\n• Foco: Alinhamento de demandas prioritárias com lideranças da região.\n• Pautas: Atenção às necessidades comunitárias mapeadas.`;
}
