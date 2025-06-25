import React, { useState } from 'react';
import Modal from '../atoms/Modal';
import Box from '../atoms/Box';
import Menu from '../atoms/Menu';
import { MenuItem } from '../atoms/MenuItem';
import FlexColumn from '../atoms/FlexColumn';
import FlexRow from '../atoms/FlexRow';
import Miniature from '../atoms/Miniature';
import SearchBar from '../molecules/SearchBar';
import useProfile from '../../hooks/useProfile';
import { useTopics } from '../../hooks/useTopics';
import useSubscriptions from '../../hooks/useSubscriptions';
import { useCurators } from '../../hooks/useCurators';
import { useDebounce } from '../../hooks/useDebounce';
import { Topic } from '../../entities/Topic';
import { Subscription } from '../../entities/Subscription';
import { Curator } from '../../entities/Curators';

export const SearchModalId = 'search-modal';

interface SearchModalProps {
  onClose?: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ onClose }) => {
  const { profile, profileIsLoading } = useProfile();
  const { topics } = useTopics(profile, profileIsLoading);
  const { subscriptions } = useSubscriptions(profile);
  const { curators } = useCurators(profile, profileIsLoading);

  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebounce(searchValue, 300);

  const filteredTopics = (topics || []).filter((t: any) => t.name.toLowerCase().includes(debouncedSearch.toLowerCase()));
  const filteredSubscriptions = (subscriptions || []).filter((s: any) => s.name.toLowerCase().includes(debouncedSearch.toLowerCase()));
  const filteredCurators = (curators || []).filter((c: any) => c.username.toLowerCase().includes(debouncedSearch.toLowerCase()));

  return (
    <Modal id={SearchModalId} onClose={onClose}>

      <FlexColumn>
        <h1 className="font-bold text-xl w-full text-center">Search</h1>
        <SearchBar
          placeholder="Search topics, subscriptions, curators..."
          value={searchValue}
          handleChange={setSearchValue}
        />
        <div className={"max-h-96 overflow-y-auto p-1"}>
          <FlexColumn>
          {filteredTopics.length > 0 &&
            <Box title={`Topics (${filteredTopics.length})`}>
              <div className={"max-h-60 overflow-y-auto"}>
                <Menu>
                  {filteredTopics.map((topic: Topic) => (
                    <MenuItem key={topic.uuid}>
                      <FlexRow position="start">
                        <Miniature src={topic.curator.avatar_url} alt={topic.curator.username} />
                        <span>{topic.name}</span>
                      </FlexRow>
                    </MenuItem>
                  ))}
                </Menu>
              </div>
            </Box>
          }
          {filteredSubscriptions.length > 0 &&
            <Box title={`Subscriptions (${filteredSubscriptions.length})`}>
              <div className={"max-h-60 overflow-y-auto"}>
                <Menu>
                  {filteredSubscriptions.map((sub: Subscription) => (
                    <MenuItem key={sub.uuid}>
                      <FlexRow position="start">
                        <Miniature src={sub.thumbnail} alt={sub.name} />
                        <span>{sub.name}</span>
                      </FlexRow>
                    </MenuItem>
                  ))}
                </Menu>

              </div>
            </Box>
          }
          {filteredCurators.length > 0 &&
            <Box title={`Curators (${filteredCurators.length})`}>
              <div className={"max-h-60 overflow-y-auto"}>
                <Menu>
                  {filteredCurators.map((curator: Curator) => (
                    <MenuItem key={curator.id}>
                      <FlexRow position="start">
                        <Miniature src={curator.avatar_url} alt={curator.username} />
                        <span>{curator.username}</span>
                      </FlexRow>
                    </MenuItem>
                  ))}
                </Menu>
              </div>
            </Box>
          }
          </FlexColumn>
        </div>
      </FlexColumn>
    </Modal>
  );
};

export default SearchModal;
