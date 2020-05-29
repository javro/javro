![Javro](https://javro.github.io/assets/images/demo.gif)

## Starting Development

Start the app in the `dev` environment. This starts the renderer process in [**hot-module-replacement**](https://webpack.js.org/guides/hmr-react/) mode and starts a webpack dev server that sends hot updates to the renderer process:

```bash
yarn dev
```

## Packaging for Production

To package apps for the local platform:

```bash
yarn package
```

## Debug

```bash
DEBUG_PROD=true yarn build && DEBUG_PROD=true yarn start
```

## Docs

See our [docs and guides here](https://electron-react-boilerplate.js.org/docs/installation)
