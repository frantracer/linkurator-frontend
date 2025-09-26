'use client';

import {useTranslations} from "next-intl";
import React, {useState} from "react";
import {useRouter} from "next/navigation";
import Button from "../../../components/atoms/Button";
import FlexRow from "../../../components/atoms/FlexRow";
import Grid from "../../../components/atoms/Grid";
import {AddIcon} from "../../../components/atoms/Icons";
import Drawer from "../../../components/molecules/Drawer";
import SearchBar from "../../../components/molecules/SearchBar";
import CreateFirstTopicHero from "../../../components/organism/CreateFirstTopicHero";
import NewTopicModal, {NewTopicModalId} from "../../../components/organism/NewTopicModal";
import VideoCard from "../../../components/organism/VideoCard";
import {TOPIC_DETAILS_ID} from "../../../components/organism/TopicDetails";
import {paths} from "../../../configuration";
import useProfile from "../../../hooks/useProfile";
import useSubscriptions from "../../../hooks/useSubscriptions";
import {useTopics} from "../../../hooks/useTopics";
import useFindTopics from "../../../hooks/useFindTopics";
import {useFavoriteTopicsItems} from "../../../hooks/useFavoriteTopicsItems";
import {useDebounce} from "../../../hooks/useDebounce";
import {openModal} from "../../../utilities/modalAction";
import TopTitle from "../../../components/molecules/TopTitle";
import useSet from "../../../hooks/useSet";
import {Spinner} from "../../../components/atoms/Spinner";
import {InfoBanner} from "../../../components/atoms/InfoBanner";
import {Topic} from "../../../entities/Topic";
import Miniature from "../../../components/atoms/Miniature";

const TopicsHomePage = () => {
  const t = useTranslations("common");
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const {set: invalidCards, add: addInvalidCard} = useSet<string>();

  const {profile, profileIsLoading} = useProfile();
  const {subscriptions} = useSubscriptions(profile);
  const {topics, topicsAreLoading, refreshTopics} = useTopics(profile, profileIsLoading);
  const {topics: searchResults, topicsAreLoading: searchLoading} = useFindTopics(profile, debouncedSearchQuery);
  const {items: favoriteItems, isLoading: favoriteItemsLoading} = useFavoriteTopicsItems(topics);

  const isUserLogged = !!profile;
  const hasTopics = topics.length > 0;
  const hasFavoriteTopics = topics.some(topic => topic.is_favorite);
  const showSearchResults = searchQuery.length > 0;
  const displayedTopics = showSearchResults ? searchResults : [];

  const handleCreateTopic = () => {
    openModal(NewTopicModalId);
  };

  const handleTopicClick = (topicId: string) => {
    router.push(paths.TOPICS + "/" + topicId);
  };

  const handleVideoRefresh = (itemId: string) => {
    // Placeholder for video refresh functionality
    console.log('Refreshing video:', itemId);
  };

  return (
    <Drawer id={TOPIC_DETAILS_ID} right={true} alwaysOpenOnDesktop={false}>
      <TopTitle>
        <div className="flex flex-row items-center overflow-visible">
          <div className="flex-grow"/>
          <div className="flex-grow items-center gap-2 overflow-hidden">
            <div className="flex flex-col gap-2">
              <h1 className="text-xl text-center font-bold whitespace-nowrap truncate">
                {t("topics")}
              </h1>
            </div>
          </div>
          <div className="flex-grow"/>
        </div>
      </TopTitle>

      <div className="p-4 space-y-6">
        {/* Search and Create Topic Section */}
        <FlexRow position="between">
          <div className="flex-1 mr-4">
            <SearchBar
              placeholder={t("search_topic_placeholder")}
              value={searchQuery}
              handleChange={setSearchQuery}
            />
          </div>
          {isUserLogged && (
            <Button
              primary={true}
              clickAction={handleCreateTopic}
            >
              <AddIcon />
              <span>{t("create_topic")}</span>
            </Button>
          )}
        </FlexRow>

        {/* Search Results */}
        {showSearchResults && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">{t("search_results")}</h2>
            {searchLoading && (
              <div className="flex justify-center py-4">
                <Spinner />
              </div>
            )}
            {!searchLoading && displayedTopics.length === 0 && debouncedSearchQuery.length > 0 && (
              <InfoBanner>{t("no_topics_found")}: {debouncedSearchQuery}</InfoBanner>
            )}
            {!searchLoading && displayedTopics.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedTopics.map((topic: Topic) => (
                  <div
                    key={topic.uuid}
                    className="p-4 border rounded-lg cursor-pointer hover:bg-base-200"
                    onClick={() => handleTopicClick(topic.uuid)}
                  >
                    <div className="flex items-center space-x-3">
                      <Miniature
                        src={topic.curator.avatar_url}
                        alt={topic.curator.username}
                      />
                      <div className="flex-1">
                        <h3 className="font-medium truncate">{topic.name}</h3>
                        <p className="text-sm text-gray-500">@{topic.curator.username}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Latest Videos from Favorite Topics */}
        {!showSearchResults && hasFavoriteTopics && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">{t("latest_from_favorites")}</h2>
            {favoriteItemsLoading && (
              <div className="flex justify-center py-4">
                <Spinner />
              </div>
            )}
            {!favoriteItemsLoading && favoriteItems.length > 0 && (
              <Grid>
                {favoriteItems
                  .filter(item => !invalidCards.has(item.uuid))
                  .map(item => (
                    <div className="m-4" key={item.uuid}>
                      <VideoCard
                        item={item}
                        onChange={() => handleVideoRefresh(item.uuid)}
                        withInteractions={isUserLogged}
                        addInvalidCard={addInvalidCard}
                      />
                    </div>
                  ))
                }
              </Grid>
            )}
            {!favoriteItemsLoading && favoriteItems.length === 0 && (
              <InfoBanner>{t("no_videos_from_favorites")}</InfoBanner>
            )}
          </div>
        )}

        {/* Create First Topic Hero - only show when no search and no topics */}
        {!showSearchResults && !hasTopics && !topicsAreLoading && (
          <CreateFirstTopicHero
            numberOfTopics={topics.length}
            numberOfSubscriptions={subscriptions.length}
          />
        )}

        {/* No favorite topics message */}
        {!showSearchResults && hasTopics && !hasFavoriteTopics && (
          <div className="text-center py-8">
            <InfoBanner>
              {t("no_favorite_topics_message")}
            </InfoBanner>
          </div>
        )}
      </div>

      {/* New Topic Modal */}
      {isUserLogged && (
        <NewTopicModal
          subscriptions={subscriptions}
          refreshTopics={refreshTopics}
        />
      )}
    </Drawer>
  );
};

export default TopicsHomePage;