import { stringify } from 'qs';
import { useForm, useQueryParams, useTracking } from '@strapi/admin/strapi-admin';
import { useLocation, useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { useGetPreviewUrlQuery } from '../services/preview';

import type { DocumentActionComponent } from '@strapi/content-manager/strapi-admin';
import type { UID } from '@strapi/types';

const PreviewAction: DocumentActionComponent = ({ model, documentId, document }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { trackUsage } = useTracking();
  const { formatMessage } = useIntl();
  const [{ query }] = useQueryParams();
  const isModified = useForm('PreviewAction', (state) => state.modified);

  const { data, error } = useGetPreviewUrlQuery({
    params: { contentType: model as UID.ContentType },
    query: { documentId, locale: document?.locale, status: document?.status },
  });

  if (!data?.data?.url || error) {
    return null;
  }

  const trackNavigation = () => {
    const destinationPathname = pathname.replace(/\/$/, '') + '/preview';
    trackUsage('willNavigate', { from: pathname, to: destinationPathname });
  };

  return {
    label: formatMessage({
      id: 'content-manager.preview.header.preview',
      defaultMessage: 'Live editor',
    }),
    onClick: (e) => {
      e.preventDefault();
      trackNavigation();
      navigate('preview?' + stringify(query, { encode: false }), { replace: false });
    },
    disabled: isModified,
    variant: 'tertiary', // outlined button
    position: 'header',
    type: 'preview',
  };
};

PreviewAction.type = 'preview';
PreviewAction.position = 'header';

export { PreviewAction };
