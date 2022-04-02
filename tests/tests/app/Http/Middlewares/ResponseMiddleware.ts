import { InterceptContextContract, MiddlewareContract } from '@athenna/http'
import { Container } from 'providers/Container'

export class ResponseMiddleware implements MiddlewareContract {
  /**
   * Use the constructor to resolve any dependency of the Ioc container
   *
   * @param _container
   * @return ResponseMiddleware
   */
  constructor(_container: Container) {}

  /**
   * Intercept method is executed before the response has been sent
   *
   * @param ctx
   * @return any
   */
  intercept({ request, body, status }: InterceptContextContract): any {
    const newBody: any = {
      code: 'RESPONSE',
      path: request.baseUrl,
      method: request.method,
      status: status,
      data: body,
    }

    if (body && body.meta) {
      newBody.meta = body.meta
      newBody.links = body.links
      newBody.data = body.data
    }

    return newBody
  }
}
