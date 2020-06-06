![Javro](https://javro.github.io/assets/images/demo.gif)

## Install CLI

> You must have installed Javro first: https://javro.github.io

`npm i -g javro`

## Usage

`javro ~/Workspace/avro.json`

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

### Mac workaround

> https://github.com/electron-userland/electron-builder/issues/4299 > https://snippets.cacher.io/snippet/354a3eb7b0dcbe711383

1. Delete latest-mac.yml and Mac build from Github
2. Build for mac locally: `yarn package-mac`
3. Go in `release/mac` and zip it manually
4. Generate zip information: `./node_modules/app-builder-bin/mac/app-builder blockmap -i release/Javro-x.x.x-mac.zip`
5. Check if it's okay: `shasum -a 512 release/Javro-x.x.x-mac.zip | awk '{print $1}' | xxd -r -p | base64`

## Debug

```bash
DEBUG_PROD=true yarn build && DEBUG_PROD=true yarn start
```

## Publish

To publish CLI, go in `bin` folder, then `npm publish`

## Auto updater

`git clone https://github.com/zeit/hazel`

cd `hazel`

`vercel -e ACCOUNT="javro" -e REPOSITORY="javro" --prod`
