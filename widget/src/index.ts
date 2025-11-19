import { CommitLogWidget } from './widget';

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
