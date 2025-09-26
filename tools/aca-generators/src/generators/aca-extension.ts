import { formatFiles, generateFiles, Tree, updateJson } from '@nx/devkit';
import * as path from 'path';
import { AcaExtensionGeneratorSchema } from './schema';
import { TsCodeModifiersProject } from './ts-code-modifiers';

export async function acaExtensionGenerator(
  tree: Tree,
  options: AcaExtensionGeneratorSchema
) {
  const projectRoot = `projects/${options.directory}`;
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
      glob: `${options.directory}.json`,
      input: `projects/${options.directory}/assets`,
      output: './assets/plugins',
    };
    const i18nConfig = {
      glob: '**/*',
      input: `projects/${options.directory}/assets/i18n`,
      output: `./assets/${options.directory}/i18n`,
    };
    projectJson.targets.build.options.assets.push(pluginConfig);
    projectJson.targets.build.options.assets.push(i18nConfig);
    return projectJson;
  });

  updateJson(tree, 'tsconfig.json', (tsConfig) => {
    if (!tsConfig.compilerOptions.paths) {
      tsConfig.compilerOptions.paths = {};
    }
    tsConfig.compilerOptions.paths[`@alfresco/${options.directory}`] = [
      `projects/${options.directory}/src/index.ts`,
    ];
    return tsConfig;
  });

  await formatFiles(tree);
}

export default acaExtensionGenerator;
