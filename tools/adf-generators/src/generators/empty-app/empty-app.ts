import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  Tree,
} from '@nx/devkit';
import * as path from 'path';
import { EmptyAppGeneratorSchema } from './schema';
import { addCommonFiles } from '../shared/addCommonFiles';

export async function emptyAppGenerator(
  tree: Tree,
  options: EmptyAppGeneratorSchema
) {
  const projectRoot = `${options.name}`;
  addProjectConfiguration(tree, options.name, {
    root: projectRoot,
    projectType: 'application',
    sourceRoot: `${projectRoot}/src`,
    targets: {},
  });
  addCommonFiles(tree, { projectName: options.name, projectRoot });
  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, options);
  await formatFiles(tree);
}

export default emptyAppGenerator;
