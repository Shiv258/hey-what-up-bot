import { z } from "zod";
import { MAX_SCRIPT_LENGTH, MIN_SCRIPT_LENGTH, MAX_FILE_SIZE_BYTES } from "@/lib/constants";
import { CharacterSchema } from "@/ai/schemas/character";

export const GeneratorSchema = z.object({
  character: CharacterSchema.nullable(),
  inputImageUrl: z.string().url().nullable(),
  script: z.string().min(MIN_SCRIPT_LENGTH, {
    message: `Script must be at least ${MIN_SCRIPT_LENGTH} characters.`,
  }).max(MAX_SCRIPT_LENGTH, {
    message: `Script cannot exceed ${MAX_SCRIPT_LENGTH} characters.`,
  }),
  imageFile: z.instanceof(File).optional()
    .refine(
        (file) => !file || file.size <= MAX_FILE_SIZE_BYTES,
        `Max file size is ${MAX_FILE_SIZE_BYTES / 1024 / 1024}MB.`
    )
    .refine(
        (file) => !file || ["image/jpeg", "image/png"].includes(file.type),
        "Only .jpg and .png files are accepted."
    ),
}).refine(data => data.character || data.inputImageUrl, {
  message: "Please select a character or upload an image.",
  path: ["character"],
});

export type GeneratorFormValues = z.infer<typeof GeneratorSchema>;
