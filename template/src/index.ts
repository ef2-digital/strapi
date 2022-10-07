export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    // Seed homepage:
    const homepage = await strapi.entityService.findOne('api::homepage.homepage', 1, {
      fields: ['title'],
    });

    if (!homepage) {
      strapi.entityService.create('api::homepage.homepage', {
        data: {
          title: 'Rediscover to renew',
        },
      });
    }
  },
};
