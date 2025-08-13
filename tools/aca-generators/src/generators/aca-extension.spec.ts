import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { acaExtensionGenerator } from './aca-extension';
import { AcaExtensionGeneratorSchema } from './schema';

describe('aca-extension generator', () => {
  let tree: Tree;
  const options: AcaExtensionGeneratorSchema = { name: 'test' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await acaExtensionGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
