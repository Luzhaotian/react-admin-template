import { useState, useEffect } from 'react';
import { Tooltip } from 'antd';
import classNames from 'classnames';
import styles from './Sorter.css';

export type SortOrder = 'ascend' | 'descend' | null;

interface SorterProps {
  sortOrder?: SortOrder;
  onChange?: (order: SortOrder) => void;
  className?: string;
}

const Sorter: React.FC<SorterProps> = ({ sortOrder, onChange, className }) => {
  const [hoverAscend, setHoverAscend] = useState(false);
  const [hoverDescend, setHoverDescend] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<SortOrder>(sortOrder ?? null);

  useEffect(() => {
    if (sortOrder !== undefined) {
      setConfirmedOrder(sortOrder);
    }
  }, [sortOrder]);

  const handleAscendClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextOrder: SortOrder = confirmedOrder === 'ascend' ? null : 'ascend';
    setConfirmedOrder(nextOrder);
    onChange?.(nextOrder);
  };

  const handleDescendClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextOrder: SortOrder = confirmedOrder === 'descend' ? null : 'descend';
    setConfirmedOrder(nextOrder);
    onChange?.(nextOrder);
  };

  const isAscend = confirmedOrder === 'ascend';
  const isDescend = confirmedOrder === 'descend';

  return (
    <div className={classNames(styles.sorterContainer, className)}>
      <Tooltip title="仅排序当前页" trigger="hover">
        <button
          type="button"
          className={classNames(styles.sorterIcon, styles.ascend, {
            [styles.active]: isAscend,
            [styles.hover]: hoverAscend && !isAscend,
            [styles.inactive]: isDescend,
          })}
          onClick={handleAscendClick}
          onMouseEnter={() => setHoverAscend(true)}
          onMouseLeave={() => setHoverAscend(false)}
          aria-label="升序排序"
        >
          ▲
        </button>
      </Tooltip>
      <Tooltip title="仅排序当前页" trigger="hover">
        <button
          type="button"
          className={classNames(styles.sorterIcon, styles.descend, {
            [styles.active]: isDescend,
            [styles.hover]: hoverDescend && !isDescend,
            [styles.inactive]: isAscend,
          })}
          onClick={handleDescendClick}
          onMouseEnter={() => setHoverDescend(true)}
          onMouseLeave={() => setHoverDescend(false)}
          aria-label="降序排序"
        >
          ▼
        </button>
      </Tooltip>
    </div>
  );
};

export default Sorter;
