export class ResponseMiddleware {
  /**
   * Use the constructor to resolve any dependency of the Ioc container.
   */
  constructor() {}

  /**
   * Intercept method is executed before the response has been sent.
   *
   * @param {import('@athenna/http').InterceptContextContract} InterceptContextContract
   */
  intercept({ request, body, status }) {
    const newBody = {
      code: body.code || 'RESPONSE',
      path: request.baseUrl,
      method: request.method,
      status: status <= 399 ? 'SUCCESS' : 'ERROR',
      statusCode: status,
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
