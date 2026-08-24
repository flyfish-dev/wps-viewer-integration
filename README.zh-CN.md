# Flyfish WPS Viewer 接入组件

这是 Flyfish WPS Viewer 的开放接入层，包含 TypeScript API、Web Component
以及 React、Vue 示例。WPS、ET、DPS 的解析与高保真排版核心仍属于商业交付。

## 快速接入

```bash
npm install @flyfish-dev/wps-viewer-integration
```

```html
<flyfish-wps-viewer
  viewer-url="https://office.example.com/wps-viewer/"
  src="https://office.example.com/api/files/42/download"
  name="季度报表.et"
></flyfish-wps-viewer>
```

预览页与文件下载地址必须同源。现有系统继续负责登录、权限、文件列表、
签名下载和审计，只需把 Office 文件下载能力代理到同源地址。文件由浏览器
直接读取，本组件不会把文件上传到格式转换服务。

## 开放与商业边界

本仓库采用 MIT License，开放宿主组件、稳定参数、类型和示例；不包含解析器、
版式引擎、授权校验、签发密钥、私有测试语料或商业运行时。线上 Demo 仅用于
本地文件效果评估，生产接入需要自托管运行时与有效商业授权。
