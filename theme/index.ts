import { extendTheme } from '@chakra-ui/react';

import styles from './globalStyles';
import config from './config';
import foundations from './foundation';
import components from './components';

const theme = extendTheme({
  styles,
  config,
  components,
  ...foundations,
});

export default theme;