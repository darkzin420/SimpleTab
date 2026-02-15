
import { GoogleGenAI, Type } from "@google/genai";
import { GenerationConfig, RiffData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateRiffTab = async (config: GenerationConfig): Promise<RiffData> => {
  const model = 'gemini-3-pro-preview';
  
  const levelDescriptions = {
    'Melody': 'Apenas a melodia principal nota por nota, usando o mínimo de cordas possível.',
    'PowerChord': 'Versão simplificada usando power chords de 2 notas ou apenas as tônicas.',
    'OneFinger': 'Arranjo adaptado para ser tocado preferencialmente com um ou dois dedos no máximo.'
  };

  const prompt = `Você é um instrutor de guitarra para iniciantes absolutos. 
  Sua tarefa é criar a versão MAIS FÁCIL POSSÍVEL do riff principal de "${config.song}"${config.artist ? ` do artista ${config.artist}` : ''}.
  
  REGRAS DE OURO PARA FACILIDADE:
  1. FOCO NO INICIANTE: O riff deve ser "nível 1". Use cordas soltas sempre que possível.
  2. QUALQUER CORDA: Você pode usar de 1 a 6 cordas, mas use o mínimo necessário para manter a simplicidade.
  3. EVITE SALTOS: Tente manter as notas próximas umas das outras no braço da guitarra (preferencialmente casas 0 a 5).
  4. ALINHAMENTO: Todas as linhas da tablatura retornadas no array 'tab' DEVEM ter exatamente o mesmo comprimento (mesmo número de hífens/caracteres).
  5. ESTILO: Use o padrão ASCII tradicional.
  
  CONTEXTO DO NÍVEL: ${levelDescriptions[config.level]}
  
  Retorne um JSON com: 
  - songTitle
  - artist
  - tuning (ex: Standard)
  - difficultyLabel (ex: "Ultra Fácil", "Nível Zero", "Para Crianças")
  - tab (array de objetos {string: "E", notes: "---0-2-3---"}) - inclua apenas as cordas usadas no arranjo.
  - explanation: Uma dica pedagógica curta em português focada em como posicionar os dedos para facilitar ainda mais.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          songTitle: { type: Type.STRING },
          artist: { type: Type.STRING },
          tuning: { type: Type.STRING },
          difficultyLabel: { type: Type.STRING },
          tab: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                string: { type: Type.STRING },
                notes: { type: Type.STRING }
              },
              required: ["string", "notes"]
            }
          },
          explanation: { type: Type.STRING }
        },
        required: ["songTitle", "artist", "tuning", "difficultyLabel", "tab", "explanation"]
      },
      thinkingConfig: { thinkingBudget: 2500 }
    }
  });

  const result = JSON.parse(response.text || '{}');
  return result as RiffData;
};
