# Flyfish WPS Viewer Integration

Open integration SDK and Web Component for a **self-hosted, licensed** Flyfish
WPS Viewer runtime. It keeps application integration small while the WPS, ET,
and DPS parser and layout engine remain in the commercial core.

[中文说明](README.zh-CN.md) · [Online evaluation](https://wps.file-viewer.app) · [Commercial license](https://dev.flyfish.group/shop/detail/1016)

## Install

```bash
npm install github:flyfish-dev/wps-viewer-integration#v0.1.0
```

The same package tarball is attached to the GitHub v0.1.0 release. Publishing
under the `@flyfish-dev` npm scope is prepared but is not required for use.

## Web Component

```html
<flyfish-wps-viewer
  viewer-url="https://office.example.com/wps-viewer/"
  src="https://office.example.com/api/files/42/download"
  name="quarterly-report.et"
></flyfish-wps-viewer>

<script type="module">
  import { registerFlyfishWpsViewer } from '@flyfish-dev/wps-viewer-integration';
  registerFlyfishWpsViewer();
</script>
```

The viewer and document URL must use the same Origin. Put your existing auth,
permissions, signed download, and audit logic behind a same-origin route. The
file is fetched by the browser and is not uploaded to a conversion service by
this package.

## API

```ts
import { createWpsViewerUrl } from '@flyfish-dev/wps-viewer-integration';

const url = createWpsViewerUrl({
  viewerUrl: 'https://office.example.com/wps-viewer/',
  source: {
    url: 'https://office.example.com/api/files/42/download',
    name: 'project-plan.wps',
  },
});
```

The `<flyfish-wps-viewer>` element also exposes `open(source)` and `reload()`
and emits `viewerloadstart` and `viewerload` events. React and Vue examples are
included under `examples/`.

## Product boundary

This MIT-licensed repository contains only the host API, URL contract, Web
Component, types, and examples. It does not contain the parser, layout engine,
license verifier, signing material, private corpus, or commercial runtime.

The online deployment is for evaluation with local files. Production embedding
requires a self-hosted runtime and a valid Flyfish WPS Viewer license.
