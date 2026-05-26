import type { ScrollbarProps } from 'react-custom-scrollbars-2';
import Scrollbars from 'react-custom-scrollbars-2';
import styles from './index.css';

const renderThumb = () => <div className={styles.thumb} />;

const Scrollbar: React.FC<ScrollbarProps> = ({ children, ...restProps }) => (
  <Scrollbars
    {...restProps}
    autoHideTimeout={1000}
    renderThumbVertical={renderThumb}
    renderThumbHorizontal={renderThumb}
  >
    {children}
  </Scrollbars>
);

export default Scrollbar;
