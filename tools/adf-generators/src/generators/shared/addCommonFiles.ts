
import { generateFiles, Tree } from '@nx/devkit';
import * as path from 'path';
import { CommonFilesSchema } from './common-files-schema';

export function addCommonFiles(tree: Tree, options: CommonFilesSchema) {
  const sharedFilesPath = path.join(__dirname, './files');
  generateFiles(tree, sharedFilesPath, options.projectRoot, {...options});
}
