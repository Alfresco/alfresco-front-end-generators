import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { adwExtensionGenerator } from './adw-extension';
import { AdwExtensionGeneratorSchema } from './schema';

describe('adw-extension generator', () => {
  let tree: Tree;
  const options: AdwExtensionGeneratorSchema = { name: 'test' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await adwExtensionGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
