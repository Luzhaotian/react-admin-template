import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/vars.css';
import './styles/global.css';

dayjs.locale('zh-cn');

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
