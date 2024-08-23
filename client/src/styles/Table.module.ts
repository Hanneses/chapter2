import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { tableAnatomy } from '@chakra-ui/anatomy';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tableAnatomy.keys);

const baseStyle = definePartsStyle({
  th: {
    background: 'lightgrey',
  },
});

const variantTableList = definePartsStyle((props) => {
  const { colorScheme: cScheme, colorMode } = props;

  return {
    caption: {
      color: colorMode === 'light' ? `${cScheme}.600` : `${cScheme}.100`,
    },
    tbody: {
      tr: {
        '&:nth-of-type(even)': {
          td: {
            background: colorMode === 'light' ? `#555` : `#eee`,
          },
        },
      },
    },
  };
});

export const tableTheme = defineMultiStyleConfig({
  baseStyle: baseStyle,
  variants: { variantTableList },
});
