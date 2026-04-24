export interface SymptomAnalysis {
  predictedDisease: string;
  severity: "Low" | "Moderate" | "High" | "Emergency";
  severityKey: "low" | "moderate" | "high" | "emergency";
}

export const analyzeSymptoms = (symptoms: string): SymptomAnalysis => {
  const s = symptoms.toLowerCase();

  if (/blood.*vomit|vomit.*blood|coughing blood|chest pain|stroke|unconscious|seizure/.test(s)) {
    return { predictedDisease: "Possible internal bleeding / cardiac event", severity: "Emergency", severityKey: "emergency" };
  }
  if (/headache|migraine/.test(s)) {
    return { predictedDisease: "Tension headache or migraine", severity: "Moderate", severityKey: "moderate" };
  }
  if (/fever|temperature/.test(s)) {
    return { predictedDisease: "Viral infection or flu", severity: "Moderate", severityKey: "moderate" };
  }
  if (/cough|cold|sore throat/.test(s)) {
    return { predictedDisease: "Upper respiratory infection", severity: "Low", severityKey: "low" };
  }
  if (/dizziness|vertigo|faint/.test(s)) {
    return { predictedDisease: "Vertigo or low blood pressure", severity: "Moderate", severityKey: "moderate" };
  }
  if (/stomach|abdominal|diarrhea|loose motion/.test(s)) {
    return { predictedDisease: "Gastroenteritis or indigestion", severity: "Moderate", severityKey: "moderate" };
  }
  if (/rash|itch|skin/.test(s)) {
    return { predictedDisease: "Allergic reaction or dermatitis", severity: "Low", severityKey: "low" };
  }
  return { predictedDisease: "Unspecified condition — clinical review needed", severity: "Low", severityKey: "low" };
};