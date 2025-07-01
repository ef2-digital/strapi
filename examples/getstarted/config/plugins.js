'use strict';

module.exports = ({ env }) => ({
  graphql: {
    enabled: true,
    config: {
      endpoint: '/graphql',

      defaultLimit: 25,
      maxLimit: 100,

      apolloServer: {
        tracing: true,
      },

      v4CompatibilityMode: true,
    },
  },
  documentation: {
    config: {
      info: {
        version: '1.0.0',
      },
    },
  },
  myplugin: {
    enabled: true,
    resolve: `./src/plugins/local-plugin`, // From the root of the project
    config: {
      testConf: 3,
    },
  },
  // NOTE: set enabled:true to test with a pre-built plugin. Make sure to run yarn build in the plugin folder first
  todo: {
    enabled: false,
    resolve: `../plugins/todo-example`, // From the /examples/plugins folder
  },
  upload: {
    enabled: true,
    config: {
      breakpoints: {
        xxlarge: 2560,
        xlarge: 1920,
        large: 1440,
        medium: 1024,
        small: 768,
        social: 1200,
      },
      provider: 'aws-s3',
      providerOptions: {
        s3Options: {
          credentials: {
            accessKeyId: env('AWS_ACCESS_KEY_ID'),
            secretAccessKey: env('AWS_ACCESS_SECRET'),
          },
          region: 'eu-central-1',
          params: {
            ACL: env('AWS_ACL', ''),
            signedUrlExpires: env('AWS_SIGNED_URL_EXPIRES', 15 * 60),
            Bucket: env('AWS_BUCKET'),
          },
        },
      },
      actionOptions: {
        upload: {
          CacheControl: 'max-age=31536000',
        },
        uploadStream: {
          CacheControl: 'max-age=31536000',
        },
        delete: {},
      },
    },
  },
});
