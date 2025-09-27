
"use server";

// This is a mock in-memory store.
// In a real application, you would use a persistent database like Firestore or Redis.

export type ResultStatus = 'processing' | 'success' | 'error';

export interface Result {
    id: string;
    status: ResultStatus;
    data?: any;
    error?: string;
    createdAt: Date;
    updatedAt: Date;
}

const resultMap = new Map<string, Omit<Result, 'id'>>();

export async function createResult(id: string) {
    if (resultMap.has(id)) {
        console.warn(`Result with ID ${id} already exists. Overwriting.`);
    }
    console.log(`Creating result for jobId: ${id}`);
    resultMap.set(id, { status: 'processing', createdAt: new Date(), updatedAt: new Date() });
}

export async function updateResult(id:string, data: Partial<Omit<Result, 'id'>>) {
    const existing = resultMap.get(id);
    if (!existing) {
         console.warn(`Result for jobId: ${id} not found. Creating a new one from update.`);
         resultMap.set(id, {
             status: 'processing',
             createdAt: new Date(),
             ...data,
             updatedAt: new Date(),
         });
    } else {
        console.log(`Updating result for jobId: ${id} with status: ${data.status}`);
        resultMap.set(id, { ...existing, ...data, updatedAt: new Date() });
    }
}

export async function getResult(id: string): Promise<Result | null> {
    const result = resultMap.get(id);
    if (!result) {
        return null;
    }
    console.log(`Getting result for jobId: ${id}, status: ${result.status}`);
    return { id, ...result };
}
