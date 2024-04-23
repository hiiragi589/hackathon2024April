import { Dimensions } from 'react-native';

const window = Dimensions.get('window');
const screen = Dimensions.get('screen');

const Layout = {
  window: {
    width: window.width,
    height: window.height,
  },
  screen: {
    width: screen.width,
    height: screen.height,
  },
};

export default Layout;