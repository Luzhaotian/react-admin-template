import InternalSearchGroup, { type SearchGroupProps } from './Group';
import SearchItem, { type SearchItemProps } from './Item';

export type { SearchGroupProps, SearchItemProps };

interface ExtendedSearchGroupComponent extends React.FC<SearchGroupProps> {
  Item: typeof SearchItem;
}

const SearchGroup = InternalSearchGroup as ExtendedSearchGroupComponent;

SearchGroup.Item = SearchItem;

export default SearchGroup;
