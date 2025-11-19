import { WidgetData } from './types';

export function getApiUrl(): string {
    const script = document.currentScript as HTMLScriptElement;
    if (script && script.src) {
        const url = new URL(script.src);
        return `${url.origin}/api/v1/logs`;
    }
    return 'http://localhost:3000/api/v1/logs';
}

export async function fetchWidgetData(apiKey: string, apiUrl: string): Promise<WidgetData | null> {
    try {
        const response = await fetch(`${apiUrl}?key=${apiKey}`);
        if (response.ok) {
            return await response.json();
        } else {
            console.error('CommitLog: Failed to fetch data');
            return null;
        }
    } catch (error) {
        console.error('CommitLog: Error fetching data', error);
        return null;
    }
}
