
export const CHARACTERS = [
  {
    name: "Kaira",
    image: "https://xxglwevjclidblnuqgdd.supabase.co/storage/v1/object/public/voice/ENHANCED%20KAIRA%20NEW%20(1)%20(1).jpg",
    preview: "https://xxglwevjclidblnuqgdd.supabase.co/storage/v1/object/public/voice/ENHANCED%20KAIRA%20NEW%20(1)%20(1).jpg",
    persona: "A friendly and professional virtual assistant.",
    "data-ai-hint": "professional woman",
  },
  {
    name: "Aisha",
    image: "https://xxglwevjclidblnuqgdd.supabase.co/storage/v1/object/public/voice/Aisha%20Enhanced.jpeg",
    preview: "https://xxglwevjclidblnuqgdd.supabase.co/storage/v1/object/public/voice/Aisha%20Enhanced.jpeg",
    persona: "An energetic and engaging content creator.",
    "data-ai-hint": "energetic creator",
  },
  {
    name: "Mayra",
    image: "https://xxglwevjclidblnuqgdd.supabase.co/storage/v1/object/public/voice/Mayra%20Enhanced.png",
    preview: "https://xxglwevjclidblnuqgdd.supabase.co/storage/v1/object/public/voice/Mayra%20Enhanced.png",
    persona: "A calm and knowledgeable educational guide.",
    "data-ai-hint": "calm teacher",
  },
  {
    name: "Bailey",
    image: "https://xxglwevjclidblnuqgdd.supabase.co/storage/v1/object/public/voice/Bailey.png",
    preview: "https://xxglwevjclidblnuqgdd.supabase.co/storage/v1/object/public/voice/Bailey.png",
    persona: "A warm and empathetic customer support specialist.",
    "data-ai-hint": "warm support",
  },
] as const;

export type CharacterName = (typeof CHARACTERS)[number]["name"];

export const DEMO_SCRIPTS: Record<CharacterName, string> = {
    Kaira: "Hello, I'm Kaira. I can help you create professional video presentations and tutorials. Let's get started on your next project.",
    Aisha: "What's up, everyone! It's Aisha. Ready to make some awesome, viral content? Let's bring your ideas to life with a spark of energy!",
    Mayra: "Greetings. I am Mayra. I am here to guide you through complex topics with clarity and patience. What shall we learn about today?",
    Bailey: "Hi there, I'm Bailey. I understand you have a question, and I'm here to help find a solution with a friendly and supportive approach.",
};

export const SCRIPT_PLACEHOLDER = "Welcome to ClipForge AI! Type or paste your script here. Aim for clarity and a natural speaking pace. You can use up to 2,000 characters to bring your avatar to life.";

export const MAX_SCRIPT_LENGTH = 2000;
export const MIN_SCRIPT_LENGTH = 2;

export const MAX_FILE_SIZE_MB = 8;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
