import { formatFiles, generateFiles, Tree, updateJson } from '@nx/devkit';
import * as path from 'path';
import { AcaExtensionGeneratorSchema } from './schema';
import { libraryGenerator, UnitTestRunner } from '@nx/angular/generators';
import { TsCodeModifiersProject } from './ts-code-modifiers';

export async function acaExtensionGenerator(
  tree: Tree,
  options: AcaExtensionGeneratorSchema
) {
  const projectRoot = `projects/${options.directory}`;
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
    `provide${options.name}Extension`,
    `@alfresco/${options.directory}`
  );
  tsCodeModifiersProject.addElementToReturnArray(
    tsCodeModifiersProject.ts['extensionsModule'],
    'provideApplicationExtensions',
    `...provide${options.name}Extension()`
  );
  tsCodeModifiersProject.formatAndSave();

  updateJson(tree, 'app/project.json', (projectJson) => {
    const pluginConfig = {
      glob: 'mk-ext.json',
      input: 'projects/mk-ext/assets',
      output: './assets/plugins',
    };
    const i18nConfig = {
      glob: '**/*',
      input: 'projects/mk-ext/assets/i18n',
      output: './assets/mk-ext/i18n',
    };
    projectJson.targets.build.options.assets.push(pluginConfig);
    projectJson.targets.build.options.assets.push(i18nConfig);
    return projectJson;
  });

  updateJson(tree, `projects/${options.directory}/ng-package.json`, (ngPackage) => {
    ngPackage.dest = `../../dist/@alfresco/${options.directory}`;
    ngPackage.assets = ["assets"]
    return ngPackage;
  });

  updateJson(tree, `projects/${options.directory}/project.json`, (projectJson) => {
    projectJson.targets.build.outputs = [`{workspaceRoot}/dist/@alfresco/${options.directory}`];
    return projectJson;
  });

  await formatFiles(tree);
}

export default acaExtensionGenerator;
