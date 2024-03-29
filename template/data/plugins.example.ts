export default {
    seo: { enabled: true },
    placeholder: {
        enabled: true,
        config: {
            size: 10
        }
    },
    content: { enabled: true },
    navigation: { enabled: true },
    'slug-localization': {
        enabled: true
    },
    graphql: {
        enabled: true
    },
    webforms: { enabled: true },
    email: {
        enabled: true,
        config: {
            provider: 'sendmail',
            providerOptions: {},
            settings: {
                recipients: [],
                defaultFrom: 'Strapi <info@ef2.builders>',
                defaultReplyTo: 'Strapi <info@ef2.builders>',
                testAddress: 'Strapi <info@ef2.builders>'
            }
        }
    }
};
