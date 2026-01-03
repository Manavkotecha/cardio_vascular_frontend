// src/lib/storage.ts - IndexedDB wrapper for persistent data storage

import { PredictionResult } from '../types';

const DB_NAME = 'cardiopredict_db';
const DB_VERSION = 1;
const STORE_PREDICTIONS = 'predictions';
const STORE_SETTINGS = 'settings';

let dbInstance: IDBDatabase | null = null;

// Initialize the database
async function initDB(): Promise<IDBDatabase> {
    if (dbInstance) return dbInstance;

    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
            console.error('[Storage] IndexedDB error:', request.error);
            reject(request.error);
        };

        request.onsuccess = () => {
            dbInstance = request.result;
            console.log('[Storage] IndexedDB initialized');
            resolve(request.result);
        };

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;

            // Create predictions store
            if (!db.objectStoreNames.contains(STORE_PREDICTIONS)) {
                const predictionsStore = db.createObjectStore(STORE_PREDICTIONS, { keyPath: 'id' });
                predictionsStore.createIndex('createdAt', 'createdAt', { unique: false });
                predictionsStore.createIndex('riskLevel', 'riskLevel', { unique: false });
            }

            // Create settings store
            if (!db.objectStoreNames.contains(STORE_SETTINGS)) {
                db.createObjectStore(STORE_SETTINGS, { keyPath: 'key' });
            }

            console.log('[Storage] Database upgraded');
        };
    });
}

// Save a prediction
export async function savePrediction(prediction: PredictionResult): Promise<void> {
    try {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_PREDICTIONS], 'readwrite');
            const store = transaction.objectStore(STORE_PREDICTIONS);
            const request = store.put(prediction);

            request.onsuccess = () => {
                console.log('[Storage] Prediction saved:', prediction.id);
                resolve();
            };
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.error('[Storage] Failed to save prediction:', error);
        // Fallback to localStorage
        fallbackSavePrediction(prediction);
    }
}

// Get all predictions
export async function getAllPredictions(): Promise<PredictionResult[]> {
    try {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_PREDICTIONS], 'readonly');
            const store = transaction.objectStore(STORE_PREDICTIONS);
            const index = store.index('createdAt');
            const request = index.getAll();

            request.onsuccess = () => {
                // Sort by createdAt descending (newest first)
                const predictions = (request.result as PredictionResult[]).sort(
                    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                resolve(predictions);
            };
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.error('[Storage] Failed to get predictions:', error);
        // Fallback to localStorage
        return fallbackGetPredictions();
    }
}

// Get a single prediction by ID
export async function getPrediction(id: string): Promise<PredictionResult | null> {
    try {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_PREDICTIONS], 'readonly');
            const store = transaction.objectStore(STORE_PREDICTIONS);
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.error('[Storage] Failed to get prediction:', error);
        return null;
    }
}

// Delete a prediction
export async function deletePrediction(id: string): Promise<void> {
    try {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_PREDICTIONS], 'readwrite');
            const store = transaction.objectStore(STORE_PREDICTIONS);
            const request = store.delete(id);

            request.onsuccess = () => {
                console.log('[Storage] Prediction deleted:', id);
                resolve();
            };
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.error('[Storage] Failed to delete prediction:', error);
    }
}

// Clear all predictions
export async function clearAllPredictions(): Promise<void> {
    try {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_PREDICTIONS], 'readwrite');
            const store = transaction.objectStore(STORE_PREDICTIONS);
            const request = store.clear();

            request.onsuccess = () => {
                console.log('[Storage] All predictions cleared');
                resolve();
            };
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.error('[Storage] Failed to clear predictions:', error);
    }
}

// Migrate data from localStorage to IndexedDB (run on first load)
export async function migrateFromLocalStorage(): Promise<void> {
    if (typeof window === 'undefined') return;

    const localData = localStorage.getItem('predictionHistory');
    if (!localData) return;

    try {
        const predictions: PredictionResult[] = JSON.parse(localData);
        if (predictions.length === 0) return;

        console.log('[Storage] Migrating', predictions.length, 'predictions from localStorage');

        for (const prediction of predictions) {
            await savePrediction(prediction);
        }

        // Clear localStorage after successful migration
        localStorage.removeItem('predictionHistory');
        console.log('[Storage] Migration complete');
    } catch (error) {
        console.error('[Storage] Migration failed:', error);
    }
}

// Fallback functions for localStorage (when IndexedDB is unavailable)
function fallbackSavePrediction(prediction: PredictionResult): void {
    if (typeof window === 'undefined') return;
    const history = JSON.parse(localStorage.getItem('predictionHistory') || '[]');
    history.unshift(prediction);
    localStorage.setItem('predictionHistory', JSON.stringify(history.slice(0, 50)));
}

function fallbackGetPredictions(): PredictionResult[] {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem('predictionHistory') || '[]');
}

// Save a setting
export async function saveSetting(key: string, value: any): Promise<void> {
    try {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_SETTINGS], 'readwrite');
            const store = transaction.objectStore(STORE_SETTINGS);
            const request = store.put({ key, value });

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.error('[Storage] Failed to save setting:', error);
    }
}

// Get a setting
export async function getSetting<T>(key: string): Promise<T | null> {
    try {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_SETTINGS], 'readonly');
            const store = transaction.objectStore(STORE_SETTINGS);
            const request = store.get(key);

            request.onsuccess = () => {
                resolve(request.result?.value || null);
            };
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.error('[Storage] Failed to get setting:', error);
        return null;
    }
}

// Check if IndexedDB is available
export function isIndexedDBAvailable(): boolean {
    return typeof window !== 'undefined' && 'indexedDB' in window;
}
