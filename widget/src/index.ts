interface ChangelogLog {
    id: string;
    type: string;
    title: string;
    description: string | null;
    date: string;
}

interface WidgetData {
    color: string;
    position: string;
    showBranding: boolean;
    logs: ChangelogLog[];
}

class CommitLogWidget {
    private apiKey: string;
    private apiUrl: string;
    private data: WidgetData | null = null;
    private isOpen = false;
    private container: HTMLDivElement | null = null;
    private button: HTMLButtonElement | null = null;
    private modal: HTMLDivElement | null = null;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.apiUrl = this.getApiUrl();
        this.init();
    }

    private getApiUrl(): string {
        const script = document.currentScript as HTMLScriptElement;
        if (script && script.src) {
            const url = new URL(script.src);
            return `${url.origin}/api/v1/logs`;
        }
        return 'http://localhost:3000/api/v1/logs';
    }

    private async init() {
        await this.fetchData();
        if (this.data) {
            this.injectStyles();
            this.createWidget();
        }
    }

    private async fetchData() {
        try {
            const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`);
            if (response.ok) {
                this.data = await response.json();
            } else {
                console.error('CommitLog: Failed to fetch data');
            }
        } catch (error) {
            console.error('CommitLog: Error fetching data', error);
        }
    }

    private injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
      .commitlog-container * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      .commitlog-button {
        position: fixed;
        ${this.data!.position === 'bottom-left' ? 'left: 20px;' : 'right: 20px;'}
        bottom: 20px;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: ${this.data!.color};
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999999;
        transition: transform 0.2s, box-shadow 0.2s;
      }

      .commitlog-button:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
      }

      .commitlog-button svg {
        width: 24px;
        height: 24px;
        fill: white;
      }

      .commitlog-badge {
        position: absolute;
        top: -4px;
        right: -4px;
        background: #ef4444;
        color: white;
        border-radius: 10px;
        padding: 2px 6px;
        font-size: 11px;
        font-weight: bold;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }

      .commitlog-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1000000;
        opacity: 0;
        transition: opacity 0.3s;
        display: none;
      }

      .commitlog-backdrop.open {
        display: block;
        opacity: 1;
      }

      .commitlog-modal {
        position: fixed;
        ${this.data!.position === 'bottom-left' ? 'left: 20px;' : 'right: 20px;'}
        bottom: 90px;
        width: 380px;
        max-width: calc(100vw - 40px);
        max-height: 600px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        z-index: 1000001;
        transform: translateY(20px);
        opacity: 0;
        transition: transform 0.3s, opacity 0.3s;
        display: none;
        flex-direction: column;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }

      .commitlog-modal.open {
        display: flex;
        transform: translateY(0);
        opacity: 1;
      }

      .commitlog-header {
        padding: 20px;
        border-bottom: 1px solid #e5e7eb;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .commitlog-header h3 {
        font-size: 18px;
        font-weight: 600;
        color: #111827;
      }

      .commitlog-close {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        color: #6b7280;
        transition: color 0.2s;
      }

      .commitlog-close:hover {
        color: #111827;
      }

      .commitlog-content {
        flex: 1;
        overflow-y: auto;
        padding: 16px 20px;
      }

      .commitlog-item {
        margin-bottom: 16px;
        padding-bottom: 16px;
        border-bottom: 1px solid #f3f4f6;
      }

      .commitlog-item:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
      }

      .commitlog-item-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
      }

      .commitlog-badge-type {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
      }

      .commitlog-badge-feat {
        background: #d1fae5;
        color: #065f46;
      }

      .commitlog-badge-fix {
        background: #dbeafe;
        color: #1e40af;
      }

      .commitlog-badge-improvement {
        background: #f3f4f6;
        color: #374151;
      }

      .commitlog-item-date {
        font-size: 12px;
        color: #6b7280;
      }

      .commitlog-item-title {
        font-size: 14px;
        font-weight: 500;
        color: #111827;
        margin-bottom: 4px;
      }

      .commitlog-item-description {
        font-size: 13px;
        color: #6b7280;
        line-height: 1.5;
      }

      .commitlog-footer {
        padding: 12px 20px;
        border-top: 1px solid #e5e7eb;
        text-align: center;
      }

      .commitlog-branding {
        font-size: 12px;
        color: #9ca3af;
      }

      .commitlog-branding a {
        color: ${this.data!.color};
        text-decoration: none;
        font-weight: 500;
      }

      .commitlog-branding a:hover {
        text-decoration: underline;
      }

      @media (max-width: 480px) {
        .commitlog-modal {
          left: 10px !important;
          right: 10px !important;
          width: calc(100vw - 20px);
          bottom: 80px;
        }

        .commitlog-button {
          left: 10px !important;
          right: 10px !important;
        }
      }
    `;
        document.head.appendChild(style);
    }

    private createWidget() {
        this.container = document.createElement('div');
        this.container.className = 'commitlog-container';

        // Floating button
        this.button = document.createElement('button');
        this.button.className = 'commitlog-button';
        this.button.innerHTML = `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
      </svg>
      ${this.data!.logs.length > 0 ? `<span class="commitlog-badge">${this.data!.logs.length}</span>` : ''}
    `;
        this.button.addEventListener('click', () => this.toggle());

        // Backdrop
        const backdrop = document.createElement('div');
        backdrop.className = 'commitlog-backdrop';
        backdrop.addEventListener('click', () => this.close());

        // Modal
        this.modal = document.createElement('div');
        this.modal.className = 'commitlog-modal';
        this.modal.innerHTML = this.renderModal();

        const closeBtn = this.modal.querySelector('.commitlog-close');
        closeBtn?.addEventListener('click', () => this.close());

        this.container.appendChild(this.button);
        this.container.appendChild(backdrop);
        this.container.appendChild(this.modal);

        document.body.appendChild(this.container);
    }

    private renderModal(): string {
        const logsHtml = this.data!.logs.length > 0
            ? this.data!.logs.map(log => this.renderLog(log)).join('')
            : '<p style="text-align: center; color: #9ca3af; padding: 40px 20px;">Нет обновлений</p>';

        return `
      <div class="commitlog-header">
        <h3>Что нового</h3>
        <button class="commitlog-close">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
          </svg>
        </button>
      </div>
      <div class="commitlog-content">
        ${logsHtml}
      </div>
      ${this.data!.showBranding ? `
        <div class="commitlog-footer">
          <div class="commitlog-branding">
            Powered by <a href="https://commitlog.io" target="_blank">CommitLog</a>
          </div>
        </div>
      ` : ''}
    `;
    }

    private renderLog(log: ChangelogLog): string {
        const typeClass = `commitlog-badge-${log.type}`;
        const typeLabel = log.type === 'feat' ? 'Новое' : log.type === 'fix' ? 'Исправлено' : 'Улучшено';

        return `
      <div class="commitlog-item">
        <div class="commitlog-item-header">
          <span class="commitlog-badge-type ${typeClass}">${typeLabel}</span>
          <span class="commitlog-item-date">${log.date}</span>
        </div>
        <div class="commitlog-item-title">${this.escapeHtml(log.title)}</div>
        ${log.description ? `<div class="commitlog-item-description">${this.escapeHtml(log.description)}</div>` : ''}
      </div>
    `;
    }

    private escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
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

// Auto-initialize
(function () {
    const script = document.currentScript as HTMLScriptElement;
    const apiKey = script?.getAttribute('data-id');

    if (apiKey) {
        new CommitLogWidget(apiKey);
    } else {
        console.error('CommitLog: data-id attribute is required');
    }
})();
