# Verdaccio

## What is Verdaccio 

Verdaccio is a private npm proxy registry built in Node.js. It can be used to securely publish npm packages to private registry locally in order to check proper installation and verify if package works as expected. You can find more info at [Verdaccio homepage](https://verdaccio.org/docs/what-is-verdaccio).

## Installation

To install Verdacccio you need to use Node.js `v18` or higher. Verdaccio needs to be installed globally using one of the following commands:
```
npm install -g verdaccio
````
or 
```
yarn global add verdaccio
```


## How to use

After installing Verdaccio to initialize it run:
```
npx nx local-registry
```

a local instance of Verdaccio will be launched at `http://localhost:4873` and the NPM, Yarn and PNPM registries will be configured to point to it.

Next bump plugin version, build it and publish:
```
npx nx run-many --targets build
npx nx release version x.y.z
npx nx release publish --tag latest
```

Once the plugin gets published you can test any generator from any plugin for example `empty-app` from `adf-generators` using the following command:
```
nx generate @alfresco-front-end-generators/adf-generators:empty-app
```
