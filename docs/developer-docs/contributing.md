# Contributing to Alfresco Front End Generators

Alfresco actively encourages external contributions to this project so that the project can move develop in such a way that benefits the wider community.

## Found a Bug? Missing a Feature?

If you find a bug in the source code, you can help us by submitting an issue to our [GitHub Repository](https://github.com/Alfresco/alfresco-front-end-generators/issues/new). You can also follow the same path to *request* a new feature. If you would like to *implement* a new feature, please submit an issue with a proposal for your work first, to be sure that we can use it.

## Local development
To locally test changes made in any plugin/generator setup a Verdaccio local instance and follow the instructions provided [here](./verdaccio.md)

## Submission Guidelines

Before you submit an issue, search the issue tracker, an issue for your problem may already exist
and the discussion might inform you of potential workarounds.

We want to fix all the issues as soon as possible, but before fixing a bug we need to reproduce and confirm it.
In order to reproduce bugs, we require you to provide a description of the problem, steps to reproduce and other supporting information that will help us recreate the problem you experianced.

You can file new issues by filling out our [new issue form](https://github.com/Alfresco/alfresco-front-end-generators/issues/new).

### Submitting a Pull Request (PR)

Before you submit your Pull Request (PR) consider the following guidelines:

1. Search [GitHub](https://github.com/Alfresco/alfresco-front-end-generators/pulls) for an open or closed PR
  that relates to your submission. You don't want to duplicate effort.
1. Fork the repository.
1. Make your changes in a new git branch based on **development**:

    ```shell
    git checkout -b my-fix-branch development
    ```

1. Create your patch, **including appropriate test cases**.
1. Commit your changes using a descriptive commit message.
1. Push your branch to GitHub:

    ```shell
    git push origin my-fix-branch
    ```

1. In GitHub, send a pull request to `alfresco-front-end-generators:develop`.
* If we suggest changes then:
  * Make the required updates.
  * Rebase your branch and force push to your GitHub repository (this will update your Pull Request):

That's it! Thank you for your contribution!
