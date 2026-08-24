export interface WpsViewerSource {
  url: string | URL;
  name?: string;
  type?: string;
}

export interface WpsViewerUrlOptions {
  viewerUrl: string | URL;
  source?: WpsViewerSource;
}

export interface NormalizedWpsViewerSource {
  url: URL;
  name?: string;
  type?: string;
}

const supportedExtensions = new Set(['wps', 'wpt', 'et', 'ett', 'dps', 'dpt']);

export function createWpsViewerUrl(options: WpsViewerUrlOptions): URL {
  const viewerUrl = absoluteHttpUrl(options.viewerUrl, 'viewerUrl');
  if (!options.source) return viewerUrl;

  const source = normalizeViewerSource(options.source, viewerUrl);
  viewerUrl.searchParams.set('file', source.url.href);
  if (source.name) viewerUrl.searchParams.set('name', source.name);
  if (source.type) viewerUrl.searchParams.set('type', source.type);
  viewerUrl.searchParams.set('preview', '1');
  return viewerUrl;
}

export function normalizeViewerSource(source: WpsViewerSource, viewerUrl: URL): NormalizedWpsViewerSource {
  const url = absoluteHttpUrl(source.url, 'source.url');
  if (url.origin !== viewerUrl.origin) {
    throw new TypeError('The document URL must share the viewer Origin. Use a same-origin proxy or signed download route.');
  }
  url.hash = '';

  const name = normalizeName(source.name || decodeURIComponent(url.pathname.split('/').pop() || ''));
  const extension = name.split('.').pop()?.toLowerCase();
  if (!extension || !supportedExtensions.has(extension)) {
    throw new TypeError('The document name must use .wps, .wpt, .et, .ett, .dps, or .dpt.');
  }
  const type = source.type?.trim().toLowerCase() || undefined;
  return { url, name, type };
}

function absoluteHttpUrl(value: string | URL, field: string): URL {
  const url = value instanceof URL ? new URL(value.href) : new URL(value);
  if (!['http:', 'https:'].includes(url.protocol)) throw new TypeError(`${field} must use HTTP or HTTPS.`);
  return url;
}

function normalizeName(value: string): string {
  const name = value.replace(/[\\/\u0000-\u001f\u007f]/g, '_').trim();
  if (!name) throw new TypeError('source.name could not be inferred from the URL.');
  if (name.length > 240) throw new TypeError('source.name must be 240 characters or fewer.');
  return name;
}
