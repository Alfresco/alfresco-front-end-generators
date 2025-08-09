# Alfresco Front End Generators

Set of [NX based plugins with generators](https://nx.dev/features/generate-code) crafted for lightweight and fast ADF based application creation.

## Prerequisites
Before you start using this development framework and the generator, make sure you have installed all required software:

* Install [Node.js](https://nodejs.org/en/download/) version matching the one specified in `.nvmrc` file
* Make sure to globally install NX following this guide [NX installation guide](https://nx.dev/getting-started/installation)

## Installing the ADF generators plugin
Use the following command to install the ADF generators plugin:
```sh
nx add @alfresco-front-end-generators/adf-generators
```

## Generating new ADF based application
First, move in the folder where you want create your project. Select a generator you would like to use e.g. `template-app` and run:
```sh
nx generate @alfresco-front-end-generators/adf-generators:template-app
```
Answer couple of questions, choose the right template (ACS only, APS only or ACS and APS combined), authentication type and provider and the new app will be generated in folder with the same name as selected application name.

Next before running the application go to the generated folder, open `proxy.conf.js` file and verify if generated proxies are matching your ACS and/or APS instances. Once this is done you will need to run the following scripts:
```sh
npm install
npm start
```

## Next steps
To explore ADF based application features and potential check out the recipes we created for you in [Recipes page](./docs/recipes/recipes.md).

If you want to contribute to the project follow instructions specified [here](./docs/developer-docs/contributing.md).
