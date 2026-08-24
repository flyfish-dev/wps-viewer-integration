# Security

Report vulnerabilities privately to `admin@flyfish.dev`.

The integration package intentionally enforces a same-origin document route.
Do not weaken that check to load arbitrary third-party URLs. Keep file access,
authentication, authorization, and audit decisions in the host application.
