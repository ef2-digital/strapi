import * as React from 'react';
import { useQueryParams, SubNav } from '@strapi/admin/strapi-admin';
import { Divider } from '@strapi/design-system';
import { useIntl } from 'react-intl';

import { useContentTypeSchema } from '../hooks/useContentTypeSchema';
import { getTranslation } from '../utils/translations';

import type { ContentManagerLink } from '../hooks/useContentManagerInitData';
import { InjectionZone } from './InjectionZone';

const LeftMenu = () => {
  const [{ query }] = useQueryParams<{ plugins?: object }>();
  const { formatMessage } = useIntl();
  const { schemas } = useContentTypeSchema();
  const label = formatMessage({
    id: getTranslation('header.name'),
    defaultMessage: 'Content Manager',
  });

  const getPluginsParamsForLink = (link: ContentManagerLink) => {
    const schema = schemas.find((schema) => schema.uid === link.uid);
    const isI18nEnabled = Boolean((schema?.pluginOptions?.i18n as any)?.localized);

    // The search params have the i18n plugin
    if (query.plugins && 'i18n' in query.plugins) {
      // Prepare removal of i18n from the plugins search params
      const { i18n, ...restPlugins } = query.plugins;

      // i18n is not enabled, remove it from the plugins search params
      if (!isI18nEnabled) {
        return restPlugins;
      }

      // i18n is enabled, put the plugins search params back together
      return { i18n, ...restPlugins };
    }

    return query.plugins;
  };

  return (
    <SubNav.Main aria-label={label}>
      <SubNav.Header label={label} />
      <Divider background="neutral150" marginBottom={4} />
      <InjectionZone area="menu.left-menu" props={{ schemas, getPluginsParamsForLink }} />
    </SubNav.Main>
  );
};

export { LeftMenu };
