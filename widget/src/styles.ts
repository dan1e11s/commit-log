import { WidgetData } from './types';

export function injectStyles(data: WidgetData) {
    const style = document.createElement('style');
    style.textContent = `
      .commitlog-container * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      .commitlog-button {
        position: fixed;
        ${data.position === 'bottom-left' ? 'left: 20px;' : 'right: 20px;'}
        bottom: 20px;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: ${data.color};
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
        ${data.position === 'bottom-left' ? 'left: 20px;' : 'right: 20px;'}
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
        color: ${data.color};
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
