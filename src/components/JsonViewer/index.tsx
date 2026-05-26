import type { ReactJsonViewProps } from '@textea/json-viewer';
import ReactJson from '@textea/json-viewer';

interface JsonViewerProps extends Omit<ReactJsonViewProps, 'src'> {
  data?: object | null;
}

const JsonViewer: React.FC<JsonViewerProps> = function ({ data, ...restProps }) {
  if (!data) {
    return null;
  }

  return (
    <ReactJson
      name={false}
      collapseStringsAfterLength={20}
      displayDataTypes={false}
      enableClipboard={false}
      indentWidth={2}
      iconStyle="square"
      style={{
        fontSize: 12,
        maxHeight: '300px',
        width: '100%',
        overflow: 'auto',
        border: '1px solid #ddd',
        padding: 10,
      }}
      {...restProps}
      src={data}
    />
  );
};

export default JsonViewer;
