import assert from 'node:assert/strict';
import test from 'node:test';
import { createWpsViewerUrl, normalizeViewerSource } from '../dist/index.js';

test('builds a same-origin viewer URL', () => {
  const url = createWpsViewerUrl({
    viewerUrl: 'https://office.example.com/wps-viewer/',
    source: {
      url: 'https://office.example.com/api/files/42',
      name: 'report.et',
    },
  });
  assert.equal(url.origin, 'https://office.example.com');
  assert.equal(url.searchParams.get('file'), 'https://office.example.com/api/files/42');
  assert.equal(url.searchParams.get('name'), 'report.et');
  assert.equal(url.searchParams.get('preview'), '1');
});

test('rejects a cross-origin document URL', () => {
  assert.throws(() => normalizeViewerSource(
    { url: 'https://files.example.net/report.wps' },
    new URL('https://office.example.com/wps-viewer/'),
  ), /same-origin proxy/);
});

test('rejects unsupported document names', () => {
  assert.throws(() => normalizeViewerSource(
    { url: 'https://office.example.com/report.pdf' },
    new URL('https://office.example.com/wps-viewer/'),
  ), /must use/);
});
