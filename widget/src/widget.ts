import { WidgetData } from './types';
import { fetchWidgetData, getApiUrl } from './api';
import { injectStyles } from './styles';
import { renderModalContent, renderButtonContent } from './render';

export class CommitLogWidget {
    private apiKey: string;
    private apiUrl: string;
    private data: WidgetData | null = null;
    private isOpen = false;
    private container: HTMLDivElement | null = null;
    private button: HTMLButtonElement | null = null;
    private modal: HTMLDivElement | null = null;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.apiUrl = getApiUrl();
        this.init();
    }

    private async init() {
        this.data = await fetchWidgetData(this.apiKey, this.apiUrl);
        if (this.data) {
            injectStyles(this.data);
            this.createWidget();
        }
    }

    private createWidget() {
        if (!this.data) return;

        this.container = document.createElement('div');
        this.container.className = 'commitlog-container';

        // Floating button
        this.button = document.createElement('button');
        this.button.className = 'commitlog-button';
        this.button.innerHTML = renderButtonContent(this.data);
        this.button.addEventListener('click', () => this.toggle());

        // Backdrop
        const backdrop = document.createElement('div');
        backdrop.className = 'commitlog-backdrop';
        backdrop.addEventListener('click', () => this.close());

        // Modal
        this.modal = document.createElement('div');
        this.modal.className = 'commitlog-modal';
        this.modal.innerHTML = renderModalContent(this.data);

        const closeBtn = this.modal.querySelector('.commitlog-close');
        closeBtn?.addEventListener('click', () => this.close());

        this.container.appendChild(this.button);
        this.container.appendChild(backdrop);
        this.container.appendChild(this.modal);

        document.body.appendChild(this.container);
    }

    private toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    private open() {
        this.isOpen = true;
        const backdrop = this.container?.querySelector('.commitlog-backdrop');
        backdrop?.classList.add('open');
        this.modal?.classList.add('open');
    }

    private close() {
        this.isOpen = false;
        const backdrop = this.container?.querySelector('.commitlog-backdrop');
        backdrop?.classList.remove('open');
        this.modal?.classList.remove('open');
    }
}
