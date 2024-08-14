# Local Package Tool - Force-Local Packages with Yarn Workspaces!

If you remember `lerna bootstrap --force-local`, this is your tool! It brings back it's functionality to plain yarn workspaces.
This tool creates the ability to develop and maintain packages within yarn workspaces as symlinks, while being able to reference them as:

```jsonc
{
  "name": "app",
  "dependencies": {
    "my-lib": "^1.42.3"
  }
}
```

## Usage

```sh
yarn add -D @codewyre/localpackage
```

Add two scripts to your dependants `package.json`:

```jsonc
// package.json of "app"
{
  "name": "app",
  "scripts": {
    "preinstall": "cw-localpackage preinstall",
    "postinstall": "cw-localpackage postinstall"
  },
  "dependencies": {
    "my-lib": "^1.42.3"
  }
}
```

You can now run the added `--force-local` switch, using `yarn --force-local` in your workspace. If you need to enforce reinstalling, remember to also add the `--force` flag which comes with yarn out of the box:

```sh
yarn --force --force-local
```

### Skipping --force-local flag

#### Environment variable

To always install packages locally, provide an environment variable:

```sh
export CW_LOCALPACKAGE_ALWAYS_FORCE_LOCAL=1
```

#### Setting force-local in config file

You can also create a `.localpackage.js` file in your workspace root to configure the enforcing.
**Pro-Tip: Add the `.localpackage.js` file to your `.gitignore`, so your CI would build the project with public references instead of local ones.**

```js
// [yarn-workspace-root]/.localpackage.js

// Use these lines for without having "type": "module" in workspace's package.json
module.exports = {
  alwaysForceLocal: true
}

// Use these lines for WITH having "type": "module" in workspace's package.json
export default {
  alwaysForceLocal: true
}
```

## Details

If you would have a situation like above, meaning you have a local library that you actively develop and e.g. an application that references it - Then you would have to `yarn link` here and `yarn link` there, always causing manual effort when building, installing the workspace, etc.

To be more detailed, this would be the situation:

```jsonc
// [root]/package.json
{
  "name": "my-workspace",
  "workspaces": [
    "app/*",
    "library/*"
  ]
}
```

```jsonc
// [root]/app/web/package.json
{
  "name": "my-app",
  "dependencies": {
    "my-lib": "^1.42.3"
  }
}
```

```jsonc
// [root]/library/core/package.json
{
  "name": "my-library",
  "version": "1.42.3"
}
```

### Problems
- This would cause yarn to install the package from a public repository.
- On initial development, this even means the installation will fail. You though do not want to publish the lib yet, because it is not finished.
- After installation, you always have to manually run `yarn link [libname]` to have the symlink active.
- `yarn link` is a global utility, polluting your global yarn folders with unnecessary symlinks
- Having the lib in two versions (e.g in 2 workspaces) is not possible, because one link overrides the other.

### How this package solves the issue

- It is hooking into the pre- and postinstall scripts of your dependants `package.json` with just one command.
- It is scoped to the workspace, so having two workspaces cloned, including both having the dependency on your machine is possible!
- You can develop locally before you actively publish the package to an NPM registry.

## Example

See [./example](./example/) for a test project. After running `yarn --force --force-local`, you will receive:

```sh
┐
├─> /app
│    ├─> /node_modules
│    │      └─> /@codewyre
│    │            └─> /localpackage-example-lib (SYMLINK)
│    │                       ║
│    └─> /package.json       ║
│                            ║
├─> /lib      ◁◁◁════════════╝
│    │
│    └─> /package.json
│
└─> package.json (workspace)
```
