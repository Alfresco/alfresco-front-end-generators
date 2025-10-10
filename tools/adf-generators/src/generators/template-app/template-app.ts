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
    if (tree.exists(`${projectRoot}/src/app/apps`)) {
      tree.delete(`${projectRoot}/src/app/apps`);
    }
    if (tree.exists(`${projectRoot}/src/app/start-process`)) {
      tree.delete(`${projectRoot}/src/app/start-process`);
    }
    if (tree.exists(`${projectRoot}/src/app/stencils`)) {
      tree.delete(`${projectRoot}/src/app/stencils`);
    }
    if (tree.exists(`${projectRoot}/src/app/task-details`)) {
      tree.delete(`${projectRoot}/src/app/task-details`);
    }
    if (tree.exists(`${projectRoot}/src/app/tasks`)) {
      tree.delete(`${projectRoot}/src/app/tasks`);
    }
  }

  if (options.template === 'aps' || options.template === 'apa' || options.template === 'automate') {
    if (tree.exists(`${projectRoot}/src/app/documents`)) {
      tree.delete(`${projectRoot}/src/app/documents`);
    }
  }

  if (options.template === 'apa' || options.template === 'acs-apa' || options.template === 'automate') {
    if (tree.exists(`${projectRoot}/src/app/apps`)) {
      tree.delete(`${projectRoot}/src/app/apps`);
    }
    if (tree.exists(`${projectRoot}/src/app/start-process`)) {
      tree.delete(`${projectRoot}/src/app/start-process`);
    }
    if (tree.exists(`${projectRoot}/src/app/task-details`)) {
      tree.delete(`${projectRoot}/src/app/task-details`);
    }
    if (tree.exists(`${projectRoot}/src/app/tasks`)) {
      tree.delete(`${projectRoot}/src/app/tasks`);
    }
    if (tree.exists(`${projectRoot}/src/app/file-view`)) {
      tree.delete(`${projectRoot}/src/app/file-view`);
    }
    if (tree.exists(`${projectRoot}/src/app/services/preview.service.ts`)) {
      tree.delete(`${projectRoot}/src/app/services/preview.service.ts`);
    }
  }

  if (options.template !== 'apa' && options.template !== 'acs-apa' && options.template !== 'automate') {
    if (tree.exists(`${projectRoot}/src/app/apps-cloud`)) {
      tree.delete(`${projectRoot}/src/app/apps-cloud`);
    }
    if (tree.exists(`${projectRoot}/src/app/start-process-cloud`)) {
      tree.delete(`${projectRoot}/src/app/start-process-cloud`);
    }
    if (tree.exists(`${projectRoot}/src/app/task-details-cloud`)) {
      tree.delete(`${projectRoot}/src/app/task-details-cloud`);
    }
    if (tree.exists(`${projectRoot}/src/app/tasks-cloud`)) {
      tree.delete(`${projectRoot}/src/app/tasks-cloud`);
    }
  }

  await formatFiles(tree);
}

export default templateAppGenerator;
