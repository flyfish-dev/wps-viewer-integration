import { createWpsViewerUrl, type WpsViewerSource } from './url.js';

export interface WpsViewerLoadEventDetail {
  url: string;
}

const observedAttributes = ['viewer-url', 'src', 'name', 'type', 'title', 'loading'];
const HTMLElementBase = globalThis.HTMLElement ?? class HTMLElementFallback {} as typeof HTMLElement;

export class FlyfishWpsViewerElement extends HTMLElementBase {
  static get observedAttributes(): string[] {
    return observedAttributes;
  }

  readonly frame: HTMLIFrameElement;
  private scheduled = false;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = ':host{display:block;min-height:480px}iframe{display:block;width:100%;height:100%;min-height:inherit;border:0;background:#f4f6f8}';
    this.frame = document.createElement('iframe');
    this.frame.setAttribute('allow', 'fullscreen');
    this.frame.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    this.frame.addEventListener('load', () => {
      this.dispatchEvent(new CustomEvent<WpsViewerLoadEventDetail>('viewerload', {
        detail: { url: this.frame.src },
      }));
    });
    root.append(style, this.frame);
  }

  connectedCallback(): void {
    this.render();
  }

  attributeChangedCallback(): void {
    this.queueRender();
  }

  open(source: WpsViewerSource): void {
    const viewerUrl = this.requireViewerUrl();
    this.frame.src = createWpsViewerUrl({ viewerUrl, source }).href;
    this.dispatchEvent(new CustomEvent<WpsViewerLoadEventDetail>('viewerloadstart', {
      detail: { url: this.frame.src },
    }));
  }

  reload(): void {
    this.render();
  }

  private queueRender(): void {
    if (!this.isConnected || this.scheduled) return;
    this.scheduled = true;
    queueMicrotask(() => {
      this.scheduled = false;
      this.render();
    });
  }

  private render(): void {
    const viewerUrl = this.requireViewerUrl();
    const sourceUrl = this.getAttribute('src')?.trim();
    const source = sourceUrl ? {
      url: sourceUrl,
      name: this.getAttribute('name') || undefined,
      type: this.getAttribute('type') || undefined,
    } : undefined;
    const nextUrl = createWpsViewerUrl({ viewerUrl, source }).href;
    this.frame.title = this.getAttribute('title') || 'WPS document preview';
    this.frame.loading = this.getAttribute('loading') === 'eager' ? 'eager' : 'lazy';
    if (this.frame.src !== nextUrl) this.frame.src = nextUrl;
  }

  private requireViewerUrl(): string {
    const viewerUrl = this.getAttribute('viewer-url')?.trim();
    if (!viewerUrl) throw new TypeError('flyfish-wps-viewer requires a viewer-url attribute.');
    return viewerUrl;
  }
}

export function registerFlyfishWpsViewer(tagName = 'flyfish-wps-viewer'): void {
  if (!globalThis.customElements) throw new TypeError('Custom Elements are not available in this environment.');
  if (!customElements.get(tagName)) customElements.define(tagName, FlyfishWpsViewerElement);
}
