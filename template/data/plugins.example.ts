export default {
    seo: { enabled: true },
    ckeditor: {
      enabled: true,
    },
    placeholder: {
      enabled: true,
      config: {
        size: 10,
      },
    },
    navigation: {
      enabled: true,
      config: {
        contentTypes: [
          "api::article-overview-page.article-overview-page",
          "api::article-page.article-page",
          "api::contact-page.contact-page",
          "api::content-page.content-page",
        ],
        contentTypesNameFields: {
          "api::article-overview-page.article-overview-page": ["title"],
          "api::article-page.article-page": ["title"],
          "api::contact-page.contact-page": ["title"],
          "api::content-page.content-page": ["title"],
        },
        pathDefaultFields: {
          "api::article-page.article-page": ["slug"],
          "api::content-page.content-page": ["slug"],
        },
        allowedLevels: 1,
      },
    },
    "slug-localization": {
      enabled: true,
    },
    graphql: {
      enabled: true,
    },
    email: {
      enabled: true,
      config: {
        provider: "sendmail",
        providerOptions: {},
        settings: {
          recipients: [],
          defaultFrom: "Strapi <info@ef2.builders>",
          defaultReplyTo: "Strapi <info@ef2.builders>",
          testAddress: "Strapi <info@ef2.builders>",
        },
      },
    },
    teaser: {
      enabled: true,
    },
  };
  