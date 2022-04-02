import { Http } from '@athenna/http'
import { File, Path } from '@secjs/utils'
import { Ignite } from '@athenna/core/src/Ignite'

describe('\n[E2E] Welcome', () => {
  let app: Http

  beforeAll(async () => {
    new File(Path.pwd('.env.example')).loadSync().copySync(Path.pwd('.env.test'))

    app = await new Ignite(__filename).httpServer()
  })

  it('should return welcome payload from API', async () => {
    const status = 200
    const method = 'GET'
    const path = '/api/welcome'

    const { json } = await app.request({ path, method })

    const body = json()

    expect(body.method).toBe(method)
    expect(body.status).toBe(status)
    expect(body.data.branch).toBeTruthy()
    expect(body.data.commit).toBeTruthy()
    expect(body.data.name).toBe('Athenna')
    expect(body.data.domain).toBe('http://localhost:1335')
    expect(body.data.version).toBe('1.0.0')
    expect(body.data.description).toBe('Athenna Framework')
    expect(body.data.source).toBe('https://github.com/AthennaIO')
  })

  afterAll(async () => {
    await app.close()
    await File.safeRemove(Path.pwd('.env.test'))
  })
})
