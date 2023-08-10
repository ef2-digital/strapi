//@ts-ignore
import EF2Logo from './extensions/ef2-logo.svg';
//@ts-ignore
import favicon from './extensions/favicon.ico';

export default {
    config: {
        auth: {
            logo: EF2Logo
        },
        head: {
            favicon: favicon
        },
        menu: {
            logo: EF2Logo
        },
        locales: ['nl'],
        translations: {
            nl: {
                'app.components.LeftMenu.navbrand.title': 'CMS',
                'app.components.LeftMenu.navbrand.workplace': 'Beheer je content'
            }
        },
        // Disable video tutorials
        tutorials: false,
        // Disable notifications about new Strapi releases
        notifications: { release: false }
    },
    bootstrap() {}
};
