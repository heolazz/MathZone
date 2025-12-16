import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize the client
const ai = new GoogleGenAI({ apiKey });

export const generateMathResponse = async (
  prompt: string,
  history: { role: string; parts: { text: string }[] }[] = []
): Promise<string> => {
  if (!apiKey) {
    return "API Key hilang. Silakan periksa variabel lingkungan Anda.";
  }

  try {
    const model = 'gemini-2.5-flash';
    
    // Construct a specialized system instruction for the math tutor persona (Indonesian)
    const systemInstruction = `
      Anda adalah MathZone, tutor matematika 3D interaktif yang ramah. 
      Tujuan utama Anda adalah membantu siswa berlatih soal perhitungan (kalkulasi) dan memahami geometri.
      
      Pedoman:
      1. Selalu gunakan Bahasa Indonesia yang baik, benar, namun santai agar mudah dimengerti siswa.
      2. Fokus pada latihan soal hitungan. Jika siswa bertanya tentang bangun ruang, berikan rumus volume/luas permukaan dan contoh soal hitungan sederhana.
      3. Penjelasan harus ringkas (di bawah 100 kata) tetapi jelas langkah-langkahnya.
      4. Gunakan Markdown untuk format (tebalkan rumus atau angka penting, gunakan list).
      5. Jadilah penyemangat dan buat matematika terasa menyenangkan.
    `;

    const chat = ai.chats.create({
      model,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
      history: history.length > 0 ? history : undefined
    });

    const result = await chat.sendMessage({ message: prompt });
    return result.text || "Saya tidak dapat membuat respons saat ini.";

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return `Error: ${error.message || "Terjadi kesalahan saat menghubungkan ke MathZone AI."}`;
  }
};

export const generateQuizQuestion = async (shape: string): Promise<string> => {
  if (!apiKey) return "API Key hilang.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Buatlah satu soal pilihan ganda matematika perhitungan tentang ${shape} dalam Bahasa Indonesia. 
      Format harus JSON valid dengan field: 'question' (pertanyaan), 'options' (array berisi 4 jawaban string), 'correctIndex' (angka 0-3), dan 'explanation' (penjelasan jawaban dalam bahasa Indonesia).
      Jangan sertakan blok kode markdown, hanya JSON mentah.`,
      config: {
        responseMimeType: "application/json"
      }
    });
    
    return response.text || "{}";
  } catch (e) {
    console.error(e);
    return "{}";
  }
};