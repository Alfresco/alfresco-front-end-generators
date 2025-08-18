# Verdaccio

## What is Verdaccio 

Verdaccio is a private npm proxy registry built in Node.js. It can be used to securely publish npm packages to private registry locally in order to check proper installation and verify if package works as expected. You can find more info at [Verdaccio homepage](https://verdaccio.org/docs/what-is-verdaccio).

## Installation

First of all run:
```
npm i
```
in the repository to install all required dependencies.

Next, to install Verdacccio you need to use Node.js `v18` or higher. Verdaccio needs to be installed globally using one of the following commands:
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

***Be aware that every time you stop and restart the local vardaccio instance, you are starting with an empty npm registry! Meaning no previous releases will be persisted.***

***Another very important information is to keep in mind that as soon as you're finished working with generators and you will stop your local Verdaccio instance make sure to clean up the npm config by running:***
```
npm config delete registry
```

Now to test local changes done to any plugin you can build it, bump it's version if the same is already published and publish it to your local Verdaccio instance, for example for `adf-generators` you can do the following:

```
npx nx build adf-generators
npx nx release version x.y.z
npx nx release publish @alfresco-front-end-generators/adf-generators
```

or you can build and release all plugins at once: 

```
npx nx run-many --targets build
npx nx release version x.y.z
npx nx release publish --tag latest
```

Once the plugin gets published you can test any generator from any plugin for example `empty-app` from `adf-generators` using the following command:
```
nx generate @alfresco-front-end-generators/adf-generators:empty-app
```
