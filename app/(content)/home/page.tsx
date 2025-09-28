'use client';

import {useTranslations} from "next-intl";
import {useRouter} from "next/navigation";
import React, {useEffect} from "react";
import SynchronizeSubscriptionsHero from "../../../components/organism/SynchronizeSubscriptionsHero";
import TopTitle from "../../../components/molecules/TopTitle";
import Button from "../../../components/atoms/Button";
import {paths} from "../../../configuration";
import useProfile from "../../../hooks/useProfile";
import useSubscriptions from "../../../hooks/useSubscriptions";
import {useTopics} from "../../../hooks/useTopics";
import useFilters from "../../../hooks/useFilters";
import ItemCarousel from "../../../components/molecules/ItemCarousel";
import useLatestSubscriptionItems from "../../../hooks/useLatestSubscriptionItems";
import useLatestFavoriteTopicItems from "../../../hooks/useLatestFavoriteTopicItems";
import useLatestFollowedCuratorItems from "../../../hooks/useLatestFollowedCuratorItems";
import {useCurators} from "../../../hooks/useCurators";
import {openModal} from "../../../utilities/modalAction";
import {FollowCuratorModalId} from "../../../components/organism/FollowCuratorModal";

const HomePageComponent = () => {
  const t = useTranslations("common");
  const router = useRouter();

  const {profile, profileIsLoading} = useProfile();
  const {subscriptions} = useSubscriptions(profile);
  const {topics} = useTopics(profile, profileIsLoading);
  const {filters} = useFilters();
  const {latestItems, isLoading: latestItemsLoading} = useLatestSubscriptionItems(subscriptions, 10, filters);
  const {latestFavoriteItems, isLoading: latestFavoriteItemsLoading} = useLatestFavoriteTopicItems(topics, 10, filters);
  const {curators} = useCurators(profile, profileIsLoading);
  const {
    latestCuratorItems,
    isLoading: latestCuratorItemsLoading
  } = useLatestFollowedCuratorItems(curators, 10, filters);

  // Get favorite topics and followed curators
  const hasSubscriptions = subscriptions.length > 0;
  const hasTopics = topics.length > 0;
  const favoriteTopics = topics.filter(topic => topic.is_favorite);
  const hasFavoriteTopics = favoriteTopics.length > 0;
  const hasFollowedCurators = curators.length > 0;

  const goToTopics = () => {
    window.location.href = paths.TOPICS;
  }

  const goToChats = () => {
    window.location.href = paths.CHATS;
  }

  useEffect(() => {
    if (!profileIsLoading && !profile) {
      router.push(paths.LOGIN);
    }
  }, [router, profile, profileIsLoading]);

  if (profileIsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      <TopTitle>
        <div className="flex flex-row items-center justify-center h-full w-full">
          <h1 className="text-xl font-bold">{t("home")}</h1>
        </div>
      </TopTitle>

      {!hasSubscriptions &&
          <SynchronizeSubscriptionsHero/>
      }

      {hasSubscriptions &&
          <div className="flex-1 overflow-y-auto p-4 space-y-8">
            {/* Curator Items Carousel */}
            {hasFollowedCurators &&
                <ItemCarousel
                    items={latestCuratorItems}
                    title={t("latest_from_followed_curators")}
                    isLoading={latestCuratorItemsLoading}
                    collapsible={false}
                    defaultExpanded={true}
                />
            }

            {/* Favorite Topics Carousel */}
            {hasTopics && hasFavoriteTopics &&
                <ItemCarousel
                    items={latestFavoriteItems}
                    title={t("latest_from_favorite_topics")}
                    isLoading={latestFavoriteItemsLoading}
                    collapsible={false}
                    defaultExpanded={true}
                />
            }

            {/* Subscriptions Carousel */}
              <ItemCarousel
                  items={latestItems}
                  title={t("latest_from_subscriptions")}
                  isLoading={latestItemsLoading}
                  collapsible={false}
                  defaultExpanded={true}
              />

            {/* Suggestions when no followed curators or no topics */}
            {!hasTopics && hasSubscriptions && (
              <div className="bg-base-200 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">{t("organize_subscriptions_title")}</h3>
                <p className="text-base-content/70 mb-4">{t("organize_subscriptions_description")}</p>
                <Button
                  clickAction={() => goToChats()}
                  primary={false}
                  fitContent={true}
                >
                  {t("try_chatbot")}
                </Button>
              </div>
            )}

            {!hasFollowedCurators &&
                <div className="bg-base-200 rounded-lg p-6 text-center">
                    <h3 className="text-lg font-semibold mb-2">{t("no_followed_curators_title")}</h3>
                    <p className="text-base-content/70 mb-4">{t("no_followed_curators_message")}</p>
                    <Button
                        clickAction={() => openModal(FollowCuratorModalId)}
                        primary={false}
                        fitContent={true}
                    >
                      {t("browse_curators")}
                    </Button>
                </div>
            }

            {hasTopics && !hasFavoriteTopics && (
              <div className="bg-base-200 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">{t("no_favorite_topics_title")}</h3>
                <p className="text-base-content/70 mb-4">{t("no_favorite_topics_message")}</p>
                <Button
                  clickAction={() => goToTopics()}
                  primary={false}
                  fitContent={true}
                >
                  {t("browse_topics")}
                </Button>
              </div>
            )}
          </div>
      }
    </div>
  );
};

export default HomePageComponent;