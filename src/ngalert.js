/* NGAlert v0.1.0 - Lightweight Global Alert Library
 * https://github.com/YOUR_USERNAME/ngalert
 * MIT License
 */
(function (global) {
  'use strict';

  var VERSION = '0.1.0';
  var DEFAULTS = {
    duration: 5000,
    closeOnOverlay: true,
    closeOnEsc: true,
    labels: {
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Info'
    }
  };

  var currentInstance = null;
  var _idCounter = 0;

  var ICONS = {
    success: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm-1.06 14.27-3.2-3.2 1.42-1.41 1.78 1.78 4.91-4.91 1.42 1.41Z"/></svg>',
    error:   '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2Zm3.36 12.3c.29.29.29.77 0 1.06-.15.15-.34.22-.53.22s-.38-.07-.53-.22l-2.3-2.3-2.3 2.3c-.15.15-.34.22-.53.22s-.38-.07-.53-.22a.754.754 0 0 1 0-1.06l2.3-2.3-2.3-2.3a.754.754 0 0 1 0-1.06c.29-.29.77-.29 1.06 0l2.3 2.3 2.3-2.3c.29-.29.77-.29 1.06 0 .29.29.29.77 0 1.06l-2.3 2.3 2.3 2.3Z" fill="#ffffff"></path></svg>',
    warning: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="m19.51 5.85-5.94-3.43c-.97-.56-2.17-.56-3.15 0L4.49 5.85a3.15 3.15 0 0 0-1.57 2.73v6.84c0 1.12.6 2.16 1.57 2.73l5.94 3.43c.97.56 2.17.56 3.15 0l5.94-3.43a3.15 3.15 0 0 0 1.57-2.73V8.58a3.192 3.192 0 0 0-1.58-2.73Zm-8.26 1.9c0-.41.34-.75.75-.75s.75.34.75.75V13c0 .41-.34.75-.75.75s-.75-.34-.75-.75V7.75Zm1.67 8.88c-.05.12-.12.23-.21.33a.99.99 0 0 1-1.09.21c-.13-.05-.23-.12-.33-.21-.09-.1-.16-.21-.22-.33a.986.986 0 0 1-.07-.38c0-.26.1-.52.29-.71.1-.09.2-.16.33-.21.37-.16.81-.07 1.09.21.09.1.16.2.21.33.05.12.08.25.08.38s-.03.26-.08.38Z" ></path></svg>',
    info:    '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm1 15h-2v-6h2Zm-1-8.2a1.2 1.2 0 1 1 1.2-1.2A1.2 1.2 0 0 1 12 8.8Z"/></svg>'
  };

  /* ── Helpers ─────────────────────────────────────────── */

  function sanitize(text) {
    var node = document.createElement('div');
    node.textContent = text == null ? '' : String(text);
    return node.innerHTML;
  }

  /* ── Config ──────────────────────────────────────────── */

  function init(custom) {
    if (!custom || typeof custom !== 'object') return;
    if (typeof custom.duration === 'number' && custom.duration > 0) {
      DEFAULTS.duration = custom.duration;
    }
    if (typeof custom.closeOnOverlay === 'boolean') {
      DEFAULTS.closeOnOverlay = custom.closeOnOverlay;
    }
    if (typeof custom.closeOnEsc === 'boolean') {
      DEFAULTS.closeOnEsc = custom.closeOnEsc;
    }
    if (custom.labels && typeof custom.labels === 'object') {
      DEFAULTS.labels = Object.assign({}, DEFAULTS.labels, custom.labels);
    }
  }

  /* ── Dismiss (public) ────────────────────────────────── */

  function dismiss() {
    if (!currentInstance) return;
    currentInstance.dismiss();
  }

  /* ── Core show ───────────────────────────────────────── */

  function show(message, type, options) {
    var safeType = ['success', 'error', 'warning', 'info'].indexOf(type) >= 0 ? type : 'info';
    var opts = options || {};
    var title        = typeof opts.title === 'string' && opts.title.trim() ? opts.title.trim() : DEFAULTS.labels[safeType];
    var duration     = typeof opts.duration === 'number' && opts.duration > 0 ? opts.duration : DEFAULTS.duration;
    var closeOnOverlay = typeof opts.closeOnOverlay === 'boolean' ? opts.closeOnOverlay : DEFAULTS.closeOnOverlay;
    var closeOnEsc   = typeof opts.closeOnEsc === 'boolean' ? opts.closeOnEsc : DEFAULTS.closeOnEsc;

    // Dismiss any existing alert cleanly before showing a new one
    dismiss();

    var uid          = 'nga-' + (++_idCounter);
    var titleId      = uid + '-title';
    var msgId        = uid + '-msg';
    var prevFocused  = document.activeElement;

    var root = document.createElement('div');
    root.className = 'nga-root';
    root.setAttribute('role', 'alertdialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-labelledby', titleId);
    root.setAttribute('aria-describedby', msgId);

    root.innerHTML =
      '<div class="nga-overlay" data-nga-overlay="1"></div>' +
      '<div class="nga-panel type-' + safeType + '">' +
      '  <div class="nga-content">' +
      '    <div class="nga-icon">' + ICONS[safeType] + '</div>' +
      '    <div class="nga-text">' +
      '      <h3 id="' + titleId + '" class="nga-title">' + sanitize(title) + '</h3>' +
      '      <p id="' + msgId + '" class="nga-message">' + sanitize(message || '') + '</p>' +
      '    </div>' +
      '    <button class="nga-close" type="button" aria-label="Close">' +
      '      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '        <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
      '      </svg>' +
      '    </button>' +
      '  </div>' +
      '  <div class="nga-progress" style="animation-duration:' + duration + 'ms"></div>' +
      '</div>';

    document.body.appendChild(root);

    /* -- Internal state -- */
    var closed = false;
    var timer  = null;
    var instance;

    function cleanupAndDismiss() {
      if (closed) return;
      closed = true;
      if (timer) clearTimeout(timer);
      document.removeEventListener('keydown', onKeydown);
      if (currentInstance === instance) currentInstance = null;
      root.classList.remove('is-visible');
      // Restore focus to the element that was active before the alert opened
      if (prevFocused && typeof prevFocused.focus === 'function') {
        try { prevFocused.focus(); } catch (e) { /* ignore */ }
      }
      window.setTimeout(function () {
        if (root.parentNode) root.parentNode.removeChild(root);
      }, 280);
    }

    function onKeydown(e) {
      if (closeOnEsc && (e.key === 'Escape' || e.keyCode === 27)) {
        cleanupAndDismiss();
      }
    }

    root.querySelector('.nga-close').addEventListener('click', cleanupAndDismiss);

    if (closeOnOverlay) {
      root.querySelector('[data-nga-overlay="1"]').addEventListener('click', cleanupAndDismiss);
    }

    if (closeOnEsc) {
      document.addEventListener('keydown', onKeydown);
    }

    instance = { element: root, dismiss: cleanupAndDismiss };
    currentInstance = instance;

    requestAnimationFrame(function () {
      root.classList.add('is-visible');
      // Move focus into the dialog for accessibility
      var closeBtn = root.querySelector('.nga-close');
      if (closeBtn) closeBtn.focus();
    });

    timer = window.setTimeout(cleanupAndDismiss, duration);

    return instance;
  }

  /* ── Shorthand methods ───────────────────────────────── */

  function success(message, options) { return show(message, 'success', options); }
  function error(message, options)   { return show(message, 'error',   options); }
  function warning(message, options) { return show(message, 'warning', options); }
  function info(message, options)    { return show(message, 'info',    options); }

  /* ── Public API ──────────────────────────────────────── */

  var api = {
    version: VERSION,
    init:    init,
    show:    show,
    success: success,
    error:   error,
    warning: warning,
    info:    info,
    dismiss: dismiss
  };

  global.NGAlert = api;
  global.ngAlert = api; // lowercase alias

})(window);
