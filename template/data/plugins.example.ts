export default {
  slugify: {
    enabled: true,
    config: {
      contentTypes: {
        page: {
          field: 'slug',
          references: 'title',
        },
      },
    },
  },
  navigation: {
    enabled: true,
    config: {
      contentTypes: ['api::homepage.homepage', 'api::page.page'],
      contentTypesNameFields: {
        'api::homepage.homepage': ['title'],
        'api::page.page': ['title'],
      },
      allowedLevels: 1,
    },
  },
  graphql: { enabled: true },
};
