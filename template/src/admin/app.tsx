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
        theme: {
            colors: {
                alternative100: '#f6ecfc',
                alternative200: '#e0c1f4',
                alternative500: '#ac73e6',
                alternative600: '#9736e8',
                alternative700: '#020617',
                buttonNeutral0: '#ffffff',
                buttonPrimary500: '#171717',
                buttonPrimary600: '#020617',
                danger100: '#fcecea',
                danger200: '#f5c0b8',
                danger500: '#ee5e52',
                danger600: '#d02b20',
                danger700: '#b72b1a',
                neutral0: '#ffffff',
                neutral100: '#f6f6f9',
                neutral1000: '#181826',
                neutral150: '#eaeaef',
                neutral200: '#dcdce4',
                neutral300: '#c0c0cf',
                neutral400: '#a5a5ba',
                neutral500: '#8e8ea9',
                neutral600: '#666687',
                neutral700: '#4a4a6a',
                neutral800: '#32324d',
                neutral900: '#212134',
                primary100: '#fff',
                primary200: '#eaeaef',
                primary500: '#dcdce4',
                primary600: '#171717',
                primary700: '#020617',
                secondary100: '#eaf5ff',
                secondary200: '#b8e1ff',
                secondary500: '#66b7f1',
                secondary600: '#0c75af',
                secondary700: '#006096',
                success100: '#eafbe7',
                success200: '#c6f0c2',
                success500: '#5cb176',
                success600: '#328048',
                success700: '#2f6846',
                warning100: '#fcd34d',
                warning200: '#fbbf24',
                warning500: '#f59e0b',
                warning600: '#d97706',
                warning700: '#b45309'
            }
        },
        // Disable video tutorials
        tutorials: false,
        // Disable notifications about new Strapi releases
        notifications: { release: false }
    },
    bootstrap(app) {}
};
