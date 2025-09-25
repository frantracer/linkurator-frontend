'use client';

import {useTranslations} from "next-intl";
import React from "react";
import Drawer from "../../../components/molecules/Drawer";
import CreateFirstTopicHero from "../../../components/organism/CreateFirstTopicHero";
import {TOPIC_DETAILS_ID} from "../../../components/organism/TopicDetails";
import useProfile from "../../../hooks/useProfile";
import useSubscriptions from "../../../hooks/useSubscriptions";
import {useTopics} from "../../../hooks/useTopics";
import TopTitle from "../../../components/molecules/TopTitle";

const TopicsHomePage = () => {
  const t = useTranslations("common");

  const {profile, profileIsLoading} = useProfile();
  const {subscriptions} = useSubscriptions(profile);
  const {topics, topicsAreLoading} = useTopics(profile, profileIsLoading);

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
      {
        !topicsAreLoading &&
          <CreateFirstTopicHero numberOfTopics={topics.length} numberOfSubscriptions={subscriptions.length}/>
      }
    </Drawer>
  );
};

export default TopicsHomePage;