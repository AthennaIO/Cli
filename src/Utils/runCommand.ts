/**
 * @athenna/cli
 *
 * (c) Victor Tesoura Júnior <txsoura@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import ora from 'ora'
import { promisify } from 'util'
import { exec as ChildProcessExec } from 'child_process'
import { NodeExecException } from '../Exceptions/NodeExecException'

const exec = promisify(ChildProcessExec)

export async function runCommand(command: string, log?: string) {
  const spinner = ora(log)

  if (log) {
    spinner.color = 'yellow'

    spinner.start()
  }

  try {
    await exec(command)

    if (log) spinner.succeed(log)
  } catch (err) {
    // console.log(err)
    if (log) spinner.fail(log)

    throw new NodeExecException(command)
  }
}
