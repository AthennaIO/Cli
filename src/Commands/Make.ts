/**
 * @athenna/cli
 *
 * (c) Victor Tesoura Júnior <txsoura@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import ejs from 'ejs'
import chalk from 'chalk'
import { Logger } from '../Utils/Logger'
import { File, Folder, Path, String } from '@secjs/utils'

export class Make {
  private readonly logger: Logger
  private readonly clientFolder: string
  private readonly templatesFolder: Folder

  public constructor(clientFolder: string) {
    this.clientFolder = clientFolder

    this.logger = new Logger()

    this.templatesFolder = new Folder(Path.pwd('templates')).loadSync()
  }

  async controller(name: string, options: any): Promise<void> {
    this.logger.success.bold.log('[ MAKING CONTROLLER ]\n')

    if (name.includes('Controller') || name.includes('Controllers')) {
      name = name.split('Controller')[0]
    }

    const template = this.getTemplate('__name__Controller', options)

    if (!template) {
      // TODO Log error instead of throw
      throw new Error('File not found')
    }

    // TODO Resolve the path always looking to his project root
    // TODO Maybe find for the package.json file in getConcretePath
    const path = this.getConcretePath(name, template.base)
    const content = this.normalizeTemplate(name, template.getContentSync())

    const concreteController = await new File(path, content).create()

    console.log(
      `\n${chalk.bold.green('[ success ]')} Controller ${
        concreteController.name
      } successfully created inside app/Http/Controllers`,
    )
  }

  private getTemplate(templateName: string, options: any): File {
    templateName = `${templateName}.${options.extension}.ejs`

    return this.templatesFolder.files.find(f => f.base === templateName) as File
  }

  private getConcretePath(name: string, baseTemplateName: string) {
    const normalizedName = this.normalizeName(name, baseTemplateName)

    return `${this.clientFolder}/app/Http/Controllers/${normalizedName}`
  }

  private normalizeName(name: string, baseTemplateName: string): string {
    return baseTemplateName
      .replace('.ejs', '')
      .replace('__name__', name)
      .replace('__name_low__', name.toLowerCase())
      .replace('__name_plural__', String.pluralize(name))
      .replace('__name_plural_low__', String.pluralize(name).toLowerCase())
  }

  private normalizeTemplate(name: string, templateContent: Buffer): Buffer {
    const templateString = ejs.render(templateContent.toString(), {
      nameUp: name.toUpperCase(),
      nameCamel: String.toCamelCase(name),
      namePlural: String.pluralize(name),
      namePascal: String.toPascalCase(name),
      namePluralCamel: String.toCamelCase(String.pluralize(name)),
      namePluralPascal: String.toPascalCase(String.pluralize(name)),
    })

    return Buffer.from(templateString)
  }
}
