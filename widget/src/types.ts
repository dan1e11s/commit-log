export interface ChangelogLog {
    id: string;
    type: string;
    title: string;
    description: string | null;
    date: string;
}

export interface WidgetData {
    color: string;
    position: string;
    showBranding: boolean;
    logs: ChangelogLog[];
}
