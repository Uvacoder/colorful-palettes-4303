import { Styles } from '@chakra-ui/theme-tools';

const styles: Styles = {
  global: props => ({
    '::selection': {
      backgroundColor: '#0070f3',
      color: '#fff',
    },
    'body, html, #__next': {
      width: '100%',
      height: '100%',
      // backgroundColor: 'hsl(244, 48%, 9%)'
    },
    body: {},
  }),
};

export default styles;