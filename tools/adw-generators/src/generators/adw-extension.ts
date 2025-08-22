import { formatFiles, generateFiles, Tree, updateJson } from '@nx/devkit';
import * as path from 'path';
import { AdwExtensionGeneratorSchema } from './schema';
import { libraryGenerator, UnitTestRunner } from '@nx/angular/generators';
import { TsCodeModifiersProject } from './ts-code-modifiers';

export async function adwExtensionGenerator(
  tree: Tree,
  options: AdwExtensionGeneratorSchema
) {
  const projectRoot = `libs/content-ee/${options.directory}`;
  await libraryGenerator(tree, {
    directory: projectRoot,
    name: options.directory,
    buildable: true,
    publishable: true,
    importPath: `@alfresco/${options.directory}`,
    style: 'scss',
    prefix: 'aca',
    unitTestRunner: UnitTestRunner.None,
    viewEncapsulation: 'None',
  });
  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, options);

  const tsCodeModifiersProject = new TsCodeModifiersProject(tree, '.');
  tsCodeModifiersProject.addNamedImport(
    tsCodeModifiersProject.ts['extensionsModule'],
    `${options.name}Module`,
    `@alfresco/${options.directory}`
  );
  tsCodeModifiersProject.addImportToModule(tsCodeModifiersProject.ts['extensionsModule'], `${options.name}Module`);
  tsCodeModifiersProject.formatAndSave();

  updateJson(tree, 'apps/content-ee/project.json', (projectJson) => {
    const pluginConfig = {
      glob: `${options.directory}.json`,
      input: `libs/content-ee/${options.directory}/assets`,
      output: './assets/plugins',
    };
    const i18nConfig = {
      glob: '**/*',
      input: `libs/content-ee/${options.directory}/assets/i18n`,
      output: `./assets/${options.directory}/i18n`,
    };
    projectJson.targets.build.options.assets.push(pluginConfig);
    projectJson.targets.build.options.assets.push(i18nConfig);
    return projectJson;
  });

  updateJson(tree, `libs/content-ee/${options.directory}/ng-package.json`, (ngPackage) => {
    ngPackage.dest = `../../dist/alfresco-digital-workspace/${options.directory}`;
    ngPackage.assets = ["assets"]
    return ngPackage;
  });

  updateJson(tree, `libs/content-ee/${options.directory}/project.json`, (projectJson) => {
    projectJson.targets.build.outputs = [`{workspaceRoot}/dist/alfresco-digital-workspace/${options.directory}`];
    return projectJson;
  });

  await formatFiles(tree);
}

export default adwExtensionGenerator;
