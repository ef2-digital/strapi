import { Flex, FocusTrap, IconButton, Menu } from '@strapi/design-system';
import { Check, Cross } from '@strapi/icons';
import { useIntl } from 'react-intl';

import { getTrad } from '../../../utils';

import { FocalActionRow } from './PreviewComponents';

interface CroppingActionsProps {
  onCancel: () => void;
  onValidate: () => void;
  onDuplicate?: () => void;
}

export const FocalActions = ({ onCancel, onValidate }: CroppingActionsProps) => {
  const { formatMessage } = useIntl();

  return (
    <FocusTrap onEscape={onCancel}>
      <FocalActionRow justifyContent="flex-end" paddingLeft={3} paddingRight={3}>
        <Flex gap={1}>
          <IconButton
            label={formatMessage({
              id: getTrad('control-card.stop-focal'),
              defaultMessage: 'Stop focal',
            })}
            onClick={onCancel}
          >
            <Cross />
          </IconButton>
          <IconButton
            label={formatMessage({
              id: getTrad('control-card.set-focal'),
              defaultMessage: 'Set focal point',
            })}
            onClick={onValidate}
          >
            <Check />
          </IconButton>
        </Flex>
      </FocalActionRow>
    </FocusTrap>
  );
};
