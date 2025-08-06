import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  Tree,
} from '@nx/devkit';
import * as path from 'path';
import { TemplateAppGeneratorSchema } from './schema';
import { addCommonFiles } from '../shared/addCommonFiles';

export async function templateAppGenerator(
  tree: Tree,
  options: TemplateAppGeneratorSchema
) {
  const projectRoot = `${options.name}`;
  addProjectConfiguration(tree, options.name, {
    root: projectRoot,
    projectType: 'application',
    sourceRoot: `${projectRoot}/src`,
    targets: {},
  });

  addCommonFiles(tree, { projectName: options.name, projectRoot, template: options.template, authType: options.authType, provider: options.provider });
  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, options);

  if (options.template === 'acs') {
    tree.delete(path.join(__dirname, 'files/src/app/apps'));
    tree.delete(path.join(__dirname, 'files/src/app/start-process'));
    tree.delete(path.join(__dirname, 'files/src/app/stencils'));
    tree.delete(path.join(__dirname, 'files/src/app/task-details'));
    tree.delete(path.join(__dirname, 'files/src/app/tasks'));
  }

  if (options.template === 'aps') {
    tree.delete(path.join(__dirname, 'files/src/app/documents'));
  }

  await formatFiles(tree);
}

export default templateAppGenerator;
