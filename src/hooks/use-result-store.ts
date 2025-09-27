
import { create } from 'zustand';
import { getResult } from '@/lib/supabase-store';

export type ResultStatus = 'processing' | 'success' | 'error';

export interface Result {
    id: string;
    status: ResultStatus;
    data?: any;
    error?: string;
    created_at: string;
    updated_at: string;
}

interface ResultState {
    result: Result | null;
    fetchResult: () => Promise<void>;
    setResultId: (id: string) => void;
}

export const useResult = create<ResultState>((set, get) => ({
    result: null,
    setResultId: (id: string) => {
        if (get().result?.id === id) return;
        set({ result: { id, status: 'processing', created_at: new Date().toISOString(), updated_at: new Date().toISOString() } });
        get().fetchResult();
    },
    fetchResult: async () => {
        const currentResult = get().result;
        if (!currentResult?.id) return;

        try {
            const fetchedResult = await getResult(currentResult.id);
            if (fetchedResult) {
                set({ result: fetchedResult as Result });
            }
        } catch (error) {
            console.error('Failed to fetch result:', error);
            const err = error instanceof Error ? error.message : 'Failed to fetch status.';
            set(state => state.result ? { result: { ...state.result, status: 'error', error: err } } : state);
        }
    },
}));
