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

import { parse } from 'path'
import { existsSync } from 'fs'
import { Logger } from '@athenna/logger'
import { runCommand } from '../Utils/runCommand'
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
    console.log(chalk.bold.green('[ MAKING CONTROLLER ]\n'))

    if (name.includes('Controller') || name.includes('Controllers')) {
      name = name.split('Controller')[0]
    }

    const template = this.getTemplate('__name__Controller', options)

    if (!template) {
      this.logger.error(
        `Template for extension ({yellow} "${options.extension}") has not been found.`,
      )

      return
    }

    // TODO Resolve the path always looking to his project root
    // TODO Maybe find for the package.json file in getConcretePath
    const normalizedName = this.normalizeName(name, template.base)
    const path = this.getConcretePath(`app/Http/Controllers/${normalizedName}`)
    const content = this.normalizeTemplate(name, template.getContentSync())

    if (existsSync(path)) {
      this.logger.error(
        `The controller ({yellow} "${
          parse(path).name
        }") already exists. Try using another name.`,
      )

      return
    }

    const controller = await new File(path, content).create()

    this.logger.success(
      `Controller ({yellow} "${controller.name}") successfully created.`,
    )

    if (options.lint) {
      await this.runEslintOnFile('Controller', controller.path)
    }
  }

  async middleware(name: string, options: any): Promise<void> {
    console.log(chalk.bold.green('[ MAKING MIDDLEWARE ]\n'))

    if (name.includes('Middleware') || name.includes('Middlewares')) {
      name = name.split('Middleware')[0]
    }

    const template = this.getTemplate('__name__Middleware', options)

    if (!template) {
      this.logger.error(
        `Template for extension ({yellow} "${options.extension}") has not been found.`,
      )

      return
    }

    // TODO Resolve the path always looking to his project root
    // TODO Maybe find for the package.json file in getConcretePath
    const normalizedName = this.normalizeName(name, template.base)
    const path = this.getConcretePath(`app/Http/Middlewares/${normalizedName}`)
    const content = this.normalizeTemplate(name, template.getContentSync())

    if (existsSync(path)) {
      this.logger.error(
        `The middleware ({yellow} "${
          parse(path).name
        }") already exists. Try using another name.`,
      )

      return
    }

    const middleware = await new File(path, content).create()

    this.logger.success(
      `Middleware ({yellow} "${middleware.name}") successfully created.`,
    )

    if (options.lint) {
      await this.runEslintOnFile('Middleware', middleware.path)
    }
  }

  private async runEslintOnFile(resource: string, filePath: string) {
    const { name } = parse(filePath)

    try {
      await runCommand(`npm run eslint ${filePath} -- --fix --quiet`)
      this.logger.success(
        `${resource} ({yellow} "${name}") successfully linted.`,
      )
    } catch (error) {
      this.logger.error(
        `Failed to lint ${resource} ({yellow} "${name}"). Please check your eslint configurations.`,
      )
    }
  }

  private getTemplate(templateName: string, options: any): File {
    templateName = `${templateName}.${options.extension}.ejs`

    return this.templatesFolder.files.find(f => f.base === templateName) as File
  }

  private getConcretePath(normalizedPath: string) {
    return `${this.clientFolder}/${normalizedPath}`
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
