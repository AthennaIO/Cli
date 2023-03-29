import { Folder } from '@athenna/common'
import { AfterEach, BeforeEach, ExitFaker } from '@athenna/test'

export class BaseE2ETest {
  @BeforeEach()
  public async beforeEach() {
    ExitFaker.fake()
  }

  @AfterEach()
  public async afterEach() {
    ExitFaker.release()

    await Folder.safeRemove(Path.storage())
    await Folder.safeRemove(Path.pwd('project'))
  }
}
