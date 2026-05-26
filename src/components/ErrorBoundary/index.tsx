import { Component } from 'react';
import { Result, Button } from 'antd';

interface ErrorBoundaryProps {
  pathname?: string;
  children?: React.ReactElement;
}

interface ErrorBoundaryState {
  hasError: boolean;
  isNetworkError: boolean;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      isNetworkError: false,
    };
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (prevProps.pathname !== this.props.pathname && this.state.hasError) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        hasError: false,
        isNetworkError: false,
      });
    }
  }

  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      isNetworkError:
        error != null && /Loading\s(?:[^\s]*\s)?chunk\s(?:[^\s]*\s)?failed/i.test(error.message),
    };
  }

  getResultProps() {
    const { isNetworkError } = this.state;

    if (isNetworkError) {
      return {
        title: '页面加载异常，请刷新重试',
        extra: (
          <Button
            type="primary"
            size="middle"
            onClick={() => {
              window.location.reload();
            }}
          >
            点击刷新
          </Button>
        ),
      };
    }

    return {
      title: '系统故障，请联系网站管理员',
      extra: (
        <Button
          type="primary"
          onClick={() => {
            window.location.href = '/';
          }}
        >
          回到首页
        </Button>
      ),
    };
  }

  render() {
    const { hasError } = this.state;

    if (hasError) {
      return <Result status="500" {...this.getResultProps()} />;
    }

    return this.props.children;
  }
}
