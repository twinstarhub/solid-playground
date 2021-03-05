# Solid Template Explorer

This is the source code of the [solid playground](https://playground.solidjs.com) website.
Through it you can quickly discover what the solid compiler will generate from your JSX templates.

There are 3 modes available:

- DOM: The classic SPA generation mechanism
- SSR: The server side generation mechanism
- HYDRATATION: The client side generation for hydratation

## Getting up and running

This project is built using the [pnpm](https://pnpm.js.org/) package manager.

Once you got it up and running you can follow these steps the have a fully working environement:

```bash
# Clone the project
$ git clone https://github.com/ryansolid/solid-playground

# cd into the project and install the dependencies
$ cd solid-playground && pnpm i

# Start the dev server, the address is available at http://localhost:3000
$ pnpm run dev

# Build the project
$ pnpm run build
```

## Credits / Technologies used

- [solid-js](https://github.com/ryansolid/solid/): The view library
- [@babel/standalone](https://babeljs.io/docs/en/babel-standalone): The in-browser compiler. Solid compiler relies on babel
- [monaco](https://microsoft.github.io/monaco-editor/): The in-browser code editor. This is the code editor that powers VS Code
- [tailwindcss](https://tailwindcss.com/): The CSS framework
- [vite](https://vitejs.dev/): The module bundler
- [workbox](https://developers.google.com/web/tools/workbox): The service worker generator
- [pnpm](https://pnpm.js.org/)
- [lz-string](https://github.com/pieroxy/lz-string): The string compression algorith used to share REPL
