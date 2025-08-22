import { SyntaxKind, IndentationText, Project as TSMorphProject, QuoteKind, SourceFile, NamedImports, ClassDeclaration, ObjectLiteralElementLike, ObjectLiteralExpression } from 'ts-morph';
import { Tree } from '@nx/devkit';

const tsSourceFilePaths: { [key: string]: string } = {
  extensionsModule: '/apps/content-ee/src/app/extensions.module.ts'
};

type SourceFiles<T extends Record<string, any>, S> = {
  [key in keyof T]: S;
};

type TsSourceFiles = SourceFiles<Record<string, any>, SourceFile>;
export type ModuleDecoratorProperty = 'providers' | 'imports';

export class TsCodeModifiersProject {
  private tsMorphProject: TSMorphProject;
  public readonly ts: TsSourceFiles = {};

  constructor(private tree: Tree, private appFolder: string) {
    this.tsMorphProject = this.createProject();
    this.load();
  }

  load(): void {
    Object.entries(tsSourceFilePaths).forEach(([key, value]) => {
      const tsSourceFile = this.tree.read(`${this.appFolder}${value}`);
      if (tsSourceFile) {
        if (this.tsMorphProject.getSourceFile(`${this.appFolder}${value}`)) {
          this.ts[key] = this.tsMorphProject.getSourceFileOrThrow(`${this.appFolder}${value}`);
        } else {
          this.ts[key] = this.tsMorphProject.createSourceFile(`${this.appFolder}${value}`, tsSourceFile.toString(), {
            overwrite: true
          });
        }
      }
    });
  }

  formatAndSave() {
    for (const key of Object.keys(this.ts)) {
      const sourceFile = this.ts[key];
      sourceFile.formatText();
      sourceFile.saveSync();

      this.tree.write(tsSourceFilePaths[key], sourceFile.getText());
    }
  }

  addNamedImport(sourceFile: SourceFile, namedImport: string, importSourcePath: string) {
    const fileImports = sourceFile.getImportDeclarations();

    const importSourceDeclaration = fileImports.find((fielImport) => {
      const currentImportSource = fielImport.getModuleSpecifierValue();
      return currentImportSource === importSourcePath;
    });

    if (importSourceDeclaration) {
      // We are already importing something from the source path
      const importsClause = importSourceDeclaration.getImportClause();
      const namedBindings = importsClause?.getNamedBindings() as NamedImports;
      const namedBindingsElements = namedBindings.getElements();

      const hasElementAlreadyImported = namedBindingsElements.some((binding) => binding.getName() === namedImport);

      if (!hasElementAlreadyImported) {
        importSourceDeclaration.addNamedImport(namedImport);
      }
    } else {
      sourceFile.insertStatements(sourceFile.getImportDeclarations().length, `import { ${namedImport} } from '${importSourcePath}'`);
    }
  }

  findClassWithDecorator(sourceFile: SourceFile, decoratorName: string): ClassDeclaration {
    const classes = sourceFile.getClasses();

    const moduleClass = classes.find((classInModule) => {
      const decorator = classInModule.getDecorator(decoratorName);
      return !!decorator;
    });

    if (moduleClass === undefined) {
      throw new Error(`Class with decorator ${decoratorName} was not found in the source file!`);
    } else {
      return moduleClass;
    }
  }

  addImportToModule(sourceFile: SourceFile, importName: string): this {
    return this.addElementToNgModule(sourceFile, 'imports', importName);
  }

  hasNgModuleImport(sourceFile: SourceFile, importName: string): boolean {
    return this.hasNgModuleElement(sourceFile, 'imports', importName);
  }

  getNgModuleClass(sourceFile: SourceFile): ClassDeclaration {
    return this.findClassWithDecorator(sourceFile, 'NgModule');
  }

  private getNgModuleInput(moduleClass: ClassDeclaration): ObjectLiteralExpression {
    const ngModuleDecorator = moduleClass.getDecorator('NgModule');
    const decoratorArguments = ngModuleDecorator?.getArguments() as ObjectLiteralExpression[];
    return decoratorArguments[0];
  }

  private getNgModuleImportsProperty(sourceFile: SourceFile): ObjectLiteralElementLike {
    return this.getNgModuleInput(this.getNgModuleClass(sourceFile)).getPropertyOrThrow('imports');
  }

  private getNgModuleProvidersProperty(sourceFile: SourceFile): ObjectLiteralElementLike {
    return this.getNgModuleInput(this.getNgModuleClass(sourceFile)).getPropertyOrThrow('providers');
  }

  private addElementToNgModule(sourceFile: SourceFile, propertyName: ModuleDecoratorProperty, elementName: string): this {
    let property: ObjectLiteralElementLike;

    switch (propertyName) {
      case 'providers':
        property = this.getNgModuleProvidersProperty(sourceFile);
        break;
      case 'imports':
        property = this.getNgModuleImportsProperty(sourceFile);
        break;
    }

    // NgModule is missing selected property, e.g. is missing the 'declarations' property
    if (!property) {
      this.getNgModuleInput(this.getNgModuleClass(sourceFile)).addProperty(`${propertyName}: [${elementName}]`);

      return this;
    }

    const propertyValue = property.getFirstChildByKind(SyntaxKind.ArrayLiteralExpression);
    const allImportedElements = propertyValue?.getElements();
    const isElementAlreadyAdded = allImportedElements?.some((element) => {
      return element.getText() === elementName;
    });

    // e.g. we are missing our element in 'declarations' array
    if (!isElementAlreadyAdded) {
      propertyValue?.addElement(elementName);
    }

    return this;
  }

  private hasNgModuleElement(sourceFile: SourceFile, propertyName: ModuleDecoratorProperty, elementName: string): boolean {
    let property: ObjectLiteralElementLike;

    switch (propertyName) {
      case 'providers':
        property = this.getNgModuleProvidersProperty(sourceFile);
        break;
      case 'imports':
        property = this.getNgModuleImportsProperty(sourceFile);
        break;
    }

    if (!property) {
      return false;
    }

    const propertyValue = property.getFirstChildByKind(SyntaxKind.ArrayLiteralExpression);
    const allImportedElements = propertyValue?.getElements();
    if (allImportedElements) {
      return allImportedElements?.some((element) => {
        return element.getText() === elementName;
      });
    } else {
      return false;
    }
  }

  private createProject(): TSMorphProject {
    const project = new TSMorphProject({
      manipulationSettings: {
        quoteKind: QuoteKind.Single,
        indentationText: IndentationText.TwoSpaces,
        insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces: true
      }
    });
    return project;
  }
}
