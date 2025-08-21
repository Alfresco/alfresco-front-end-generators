import { SyntaxKind, IndentationText, Project as TSMorphProject, QuoteKind, SourceFile, NamedImports, ReturnStatement } from 'ts-morph';
import { Tree } from '@nx/devkit';

const tsSourceFilePaths: { [key: string]: string } = {
  extensionsModule: '/app/src/app/extensions.module.ts'
};

type SourceFiles<T extends Record<string, any>, S> = {
  [key in keyof T]: S;
};

type TsSourceFiles = SourceFiles<Record<string, any>, SourceFile>;

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

  getReturnStatement(sourceFile: SourceFile, functionName: string): ReturnStatement {
    const functionDeclaration = sourceFile.getFunction(functionName);
    return functionDeclaration.getBody().getFirstChildByKind(SyntaxKind.ReturnStatement);
  }

  addElementToReturnArray(sourceFile: SourceFile, functionName: string, element: string): void {
    const returnStatement = this.getReturnStatement(sourceFile, functionName);
    const arrayLiteral = returnStatement?.getFirstChildByKind(SyntaxKind.ArrayLiteralExpression);
    arrayLiteral?.addElement(element, { useNewLines: true });
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
