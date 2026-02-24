import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface ReportData {
  title: string;
  subtitle: string;
  summary: string;
  sections: {
    title: string;
    content: string;
    icon?: string;
  }[];
  metrics: {
    label: string;
    value: string | number;
    trend?: "up" | "down" | "neutral";
    date?: string;
    icon?: string;
  }[];
  chartData: {
    name: string;
    value: number;
  }[];
  recommendations: string[];
  aiInsights: string[];
}

export async function generateReport(prompt: string, modelName: string = "gemini-3-flash-preview"): Promise<ReportData> {
  const response = await ai.models.generateContent({
    model: modelName,
    contents: `Gere um relatório executivo de performance operacional detalhado sobre: "${prompt}". 
    O relatório deve seguir um padrão corporativo de alto nível em Português do Brasil.
    Inclua métricas realistas, insights acionáveis e recomendações estratégicas.
    Para cada seção e métrica, sugira um ícone da biblioteca Lucide (ex: activity, target, zap, shield, globe, cpu, layers, users, clock, database, alert-circle).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          subtitle: { type: Type.STRING },
          summary: { type: Type.STRING },
          sections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                content: { type: Type.STRING },
                icon: { type: Type.STRING, description: "Nome do ícone Lucide em kebab-case" },
              },
              required: ["title", "content"],
            },
          },
          metrics: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                value: { type: Type.STRING },
                trend: { type: Type.STRING, description: "up, down, or neutral" },
                date: { type: Type.STRING, description: "Ex: DEZ/25" },
                icon: { type: Type.STRING, description: "Nome do ícone Lucide em kebab-case" },
              },
              required: ["label", "value"],
            },
          },
          chartData: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                value: { type: Type.NUMBER },
              },
              required: ["name", "value"],
            },
          },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          aiInsights: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ["title", "subtitle", "summary", "sections", "metrics", "chartData", "recommendations", "aiInsights"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
}
