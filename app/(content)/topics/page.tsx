'use client';

import {useTranslations} from "next-intl";
import React, {useState} from "react";
import {useRouter} from "next/navigation";
import Button from "../../../components/atoms/Button";
import {AddIcon} from "../../../components/atoms/Icons";
import SearchBar from "../../../components/molecules/SearchBar";
import CreateFirstTopicHero from "../../../components/organism/CreateFirstTopicHero";
import NewTopicModal, {NewTopicModalId} from "../../../components/organism/NewTopicModal";
import {paths} from "../../../configuration";
import useProfile from "../../../hooks/useProfile";
import useSubscriptions from "../../../hooks/useSubscriptions";
import {useTopics} from "../../../hooks/useTopics";
import useFindTopics from "../../../hooks/useFindTopics";
import {useFavoriteTopicsItems} from "../../../hooks/useFavoriteTopicsItems";
import {useDebounce} from "../../../hooks/useDebounce";
import {openModal} from "../../../utilities/modalAction";
import TopTitle from "../../../components/molecules/TopTitle";
import {Spinner} from "../../../components/atoms/Spinner";
import {InfoBanner} from "../../../components/atoms/InfoBanner";
import {Topic} from "../../../entities/Topic";
import Miniature from "../../../components/atoms/Miniature";
import TopicVideoCardGrid from "../../../components/organism/TopicVideoCardGrid";
import {Filters} from "../../../entities/Filters";

const TopicsHomePage = () => {
  const t = useTranslations("common");
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

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

  const noFilter: Filters = {
    displayWithoutInteraction: true,
    displayHidden: true,
    displayViewed: true,
    displayDiscouraged: true,
    displayRecommended: true,
    textSearch: "",
    durationGroup: "all",
    minDuration: 0,
    maxDuration: 0,
    excludedSubscriptions: [],
  }

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
    <div>
      <TopTitle>
        <div className="overflow-hidden">
          <div className="flex flex-row items-center">
            <div className="flex-grow items-center gap-2">
              <h1 className="text-xl text-center font-bold whitespace-nowrap truncate">
                {t("topics")}
              </h1>
            </div>
          </div>
          {/* Search and Create Topic Section */}
          <div className="flex flex-row items-center justify-center p-2">
            <div className="flex-1 mr-4 max-w-96">
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
                <AddIcon/>
                <span>{t("create_topic")}</span>
              </Button>
            )}
          </div>
        </div>
      </TopTitle>

      <div className="p-4 space-y-6 overflow-y-auto">

        {/* Search Results */}
        {showSearchResults && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">{t("search_results")}</h2>
            {searchLoading && (
              <div className="flex justify-center py-4">
                <Spinner/>
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
                <Spinner/>
              </div>
            )}
            {!favoriteItemsLoading && favoriteItems.length > 0 && (
              <TopicVideoCardGrid
                fetchMoreItems={() => {
                }}
                refreshItem={handleVideoRefresh}
                title={t("latest_from_favorites")}
                items={favoriteItems}
                subscriptions={subscriptions}
                filters={noFilter}
                isLoading={favoriteItemsLoading}
                topicIsFinished={true}
                handleScroll={() => {
                }}
                isTopicBeingScanned={false}
                displayInteractions={true}
              />
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
    </div>
  );
};

export default TopicsHomePage;