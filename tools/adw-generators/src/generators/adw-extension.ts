import { formatFiles, generateFiles, Tree, updateJson } from '@nx/devkit';
import * as path from 'path';
import { AdwExtensionGeneratorSchema } from './schema';
import { TsCodeModifiersProject } from './ts-code-modifiers';

export async function adwExtensionGenerator(
  tree: Tree,
  options: AdwExtensionGeneratorSchema
) {
  const projectRoot = `libs/content-ee/${options.directory}`;
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

  updateJson(tree, 'tsconfig.base.json', (tsConfig) => {
    if (!tsConfig.compilerOptions.paths) {
      tsConfig.compilerOptions.paths = {};
    }
    tsConfig.compilerOptions.paths[`@alfresco/${options.directory}`] = [
      `libs/content-ee/${options.directory}/src/index.ts`,
    ];
    return tsConfig;
  });

  await formatFiles(tree);
}

export default adwExtensionGenerator;
