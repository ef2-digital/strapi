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
          content: [
            {
              __component: 'content.image-texts',
              direction: 'odd',
              images: [
                {
                  __component: 'content.image-text',
                  title: 'Waar ga jij beginnen?',
                  subtitle: 'Creative Digital Agency',
                  description:
                    'EF2 maakt jouw verbeterslag realiteit. Wij helpen je op een pragmatische manier, met een compleet plan. Gebaseerd op eenvoud. Eerst kijken wat er goed gaat. Kansen inventariseren. Dan maken we een sprong vooruit. Zo kun jij groeien vanuit je bestaande, solide basis. Dat is Rediscover to Renew!',
                },
              ],
            },
          ],
        },
      });
    }
  },
};
