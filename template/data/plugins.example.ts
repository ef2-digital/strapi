export default {
    seo: {
        enabled: true
    },
    placeholder: {
        enabled: true,
        config: {
            size: 10
        }
    },
    content: { enabled: true },
    slugify: {
        enabled: true
        // config: {
        //     contentTypes: {
        //         page: {
        //             field: 'slug',
        //             references: 'title'
        //         }
        //     }
        // }
    },
    navigation: { enabled: true },
    graphql: { enabled: true }
};
