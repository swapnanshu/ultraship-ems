import { GoogleGenAI, Type } from "@google/genai";
import { Employee, Department, Status } from "../types";

// Fallback data in case Gemini is not available or fails
const FALLBACK_DATA: Employee[] = Array.from({ length: 25 }).map((_, i) => ({
  id: `EMP-${1000 + i}`,
  name: `Employee ${i + 1}`,
  age: 20 + Math.floor(Math.random() * 40),
  role: "Software Engineer",
  department: Department.ENGINEERING,
  email: `employee${i + 1}@ultraship.com`,
  phone: "555-0123",
  location: "New York, NY",
  joinDate: "2023-01-15",
  status: Math.random() > 0.8 ? Status.ON_LEAVE : Status.ACTIVE,
  subjects: ["React", "Node.js", "GraphQL"],
  avatar: `https://ui-avatars.com/api/?name=Employee+${i+1}&background=random`,
  isFlagged: false
}));

export const fetchInitialData = async (): Promise<Employee[]> => {
  if (!process.env.API_KEY) {
    console.warn("No API Key found. Using fallback data.");
    return FALLBACK_DATA;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // We request a specific JSON structure to match our TypeScript interface
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate a realistic dataset of 30 employees for a tech company. Include varied names, ages (22-60), realistic roles, departments, emails, phone numbers, locations (global cities), join dates (2018-2024), statuses, and skills (as subjects). Do not include attendance.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              age: { type: Type.NUMBER },
              role: { type: Type.STRING },
              department: { type: Type.STRING },
              email: { type: Type.STRING },
              phone: { type: Type.STRING },
              location: { type: Type.STRING },
              joinDate: { type: Type.STRING },
              status: { type: Type.STRING },
              subjects: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
          },
        },
      },
    });

    const rawData = JSON.parse(response.text || "[]");
    
    // Map and sanitize to ensure it matches our strict Enums where possible, or defaults
    return rawData.map((item: any, index: number) => ({
      ...item,
      id: item.id || `GEN-${index}`,
      // Normalize department
      department: Object.values(Department).includes(item.department) 
        ? item.department 
        : Department.ENGINEERING,
      // Normalize status
      status: Object.values(Status).includes(item.status)
        ? item.status
        : Status.ACTIVE,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=random`,
      isFlagged: false
    }));

  } catch (error) {
    console.error("Gemini data generation failed:", error);
    return FALLBACK_DATA;
  }
};