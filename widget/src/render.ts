import { WidgetData, ChangelogLog } from './types';

function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function renderLog(log: ChangelogLog): string {
    const typeClass = `commitlog-badge-${log.type}`;
    const typeLabel = log.type === 'feat' ? 'Новое' : log.type === 'fix' ? 'Исправлено' : 'Улучшено';

    return `
      <div class="commitlog-item">
        <div class="commitlog-item-header">
          <span class="commitlog-badge-type ${typeClass}">${typeLabel}</span>
          <span class="commitlog-item-date">${log.date}</span>
        </div>
        <div class="commitlog-item-title">${escapeHtml(log.title)}</div>
        ${log.description ? `<div class="commitlog-item-description">${escapeHtml(log.description)}</div>` : ''}
      </div>
    `;
}

export function renderModalContent(data: WidgetData): string {
    const logsHtml = data.logs.length > 0
        ? data.logs.map(log => renderLog(log)).join('')
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
      ${data.showBranding ? `
        <div class="commitlog-footer">
          <div class="commitlog-branding">
            Powered by <a href="https://commitlog.io" target="_blank">CommitLog</a>
          </div>
        </div>
      ` : ''}
    `;
}

export function renderButtonContent(data: WidgetData): string {
    return `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
      </svg>
      ${data.logs.length > 0 ? `<span class="commitlog-badge">${data.logs.length}</span>` : ''}
    `;
}
