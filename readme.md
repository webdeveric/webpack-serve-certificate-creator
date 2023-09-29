# `WebpackServeCertificateCreator`

[![Node.js CI](https://github.com/webdeveric/webpack-serve-certificate-creator/actions/workflows/node.js.yml/badge.svg)](https://github.com/webdeveric/webpack-serve-certificate-creator/actions/workflows/node.js.yml)

## Install

```sh
pnpm add webpack-serve-certificate-creator -D
```

```sh
npm install webpack-serve-certificate-creator -D
```

## Usage

Import the plugin in your webpack config.

```ts
import { WebpackServeCertificateCreator } from 'webpack-serve-certificate-creator';
```

Add the plugin to your `plugins`.

```ts
{
  plugins: [
    new WebpackServeCertificateCreator({
      // This dir should be added to .gitignore
      outDir: '.certificate-cache',
      // Defaults to `localhost`
      commonName: 'your.hostname.example.com',
      options: {
        days: 365,
        keySize: 4096,
      },
    }),
  ];
}
```
