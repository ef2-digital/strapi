//@ts-nocheck
export default {
    /**
     * An asynchronous register function that runs before
     * your application is initialized.
     *
     * This gives you an opportunity to extend code.
     */
    register({ strapi }) {
        strapi.config.set('plugin.graphql', {
            endpoint: '/graphql',
            shadowCRUD: true,
            playgroundAlways: false,
            depthLimit: 100,
            amountLimit: 100,
            apolloServer: {
                tracing: true
            }
        });
    },

    /**
     * An asynchronous bootstrap function that runs before
     * your application gets started.
     *
     * This gives you an opportunity to set up your data model,
     * run jobs, or perform some special logic.
     */
    async bootstrap({ strapi }) {
        await strapi.admin.services.role.createRolesIfNoneExist();

        const findPublicRole = async () => {
            const result = await strapi.service('plugin::users-permissions.role').find({});

            return Object.values(result)
                .filter((role) => role.type === 'public')
                .pop().id;
        };

        const publicRole = await strapi.service('plugin::users-permissions.role').findOne(await findPublicRole(), {});

        for (const permission of Object.keys(publicRole.permissions)) {
            if (permission.startsWith('api')) {
                for (const controller of Object.keys(publicRole.permissions[permission].controllers)) {
                    publicRole.permissions[permission].controllers[controller].find.enabled = true;
                }
            }
        }

        await strapi.service('plugin::users-permissions.role').updateRole(publicRole.id, publicRole);
    }
};
