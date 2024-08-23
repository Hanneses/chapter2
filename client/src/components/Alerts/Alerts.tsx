import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  CloseButton,
  Wrap,
} from '@chakra-ui/react';
import { useContext } from 'react';
import { AlertContext } from './AlertContext';

export const Alerts = () => {
  const { alertList, removeAlert } = useContext(AlertContext);

  return (
    <>
      {alertList.map(
        ({
          alertId,
          status,
          title,
          closeButtonProps,
          description,
          descriptionProps,
          iconProps,
          titleProps,
          ...rest
        }) => {
          // hide alert automatically after 5 sec
          setTimeout(() => removeAlert(alertId), 5000);

          return (
            <Alert
              key={alertId}
              status={status}
              variant="top-accent"
              justifyContent="space-between"
              {...rest}
            >
              <Wrap>
                <AlertIcon {...iconProps} />
                <AlertTitle {...titleProps}>{title}</AlertTitle>
                {description && (
                  <AlertDescription {...descriptionProps}>
                    {description}
                  </AlertDescription>
                )}
              </Wrap>
              <CloseButton
                onClick={() => removeAlert(alertId)}
                {...closeButtonProps}
              />
            </Alert>
          );
        },
      )}
    </>
  );
};
