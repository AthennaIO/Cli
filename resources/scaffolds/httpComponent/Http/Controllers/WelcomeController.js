export class WelcomeController {
  /** @type {import('#app/Services/WelcomeService')} */
  #welcomeService

  /**
   * Use the constructor to resolve any dependency of the Ioc container.
   *
   * @param {any} welcomeService
   */
  constructor(welcomeService) {
    this.#welcomeService = welcomeService
  }

  /**
   * Return the welcome payload.
   *
   * @param {import('@athenna/http').ContextContract} ctx
   */
  async show({ response }) {
    const data = await this.#welcomeService.findOne()

    return response.status(200).send(data)
  }
}
