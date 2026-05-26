import classNames from 'classnames';
import styles from './index.css';

export interface TextButtonProps extends React.ButtonHTMLAttributes<any> {
  htmlType?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
  danger?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const TextButton: React.FC<TextButtonProps> & {
  __ANT_BUTTON: true;
} = ({ children, htmlType = 'button', className = '', icon, danger, ...restProps }) => (
  <button
    {...restProps}
    // eslint-disable-next-line react/button-has-type
    type={htmlType}
    className={classNames(styles.button, danger ? styles.dangerous : '', className)}
  >
    {icon && <span style={{ marginRight: 5 }}>{icon}</span>}
    {children}
  </button>
);

// eslint-disable-next-line no-underscore-dangle
TextButton.__ANT_BUTTON = true;

export default TextButton;
