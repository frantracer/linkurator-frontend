import VideoCard from "./VideoCard";
import {Topic} from "../entities/Topic";
import CustomButton, {IconForButton} from "./CustomButton";
import {deleteTopic} from "../services/topicService";
import {EditTopicModalId} from "./EditTopicModal";
import React from "react";
import {SubscriptionItem} from "../entities/SubscriptionItem";
import {Subscription} from "../entities/Subscription";
import {LATERAL_MENU_ID} from "../utilities/hideLateralMenu";

type TopicVideoCardGridProps = {
  refreshItems: () => void,
  refreshTopics: () => void,
  setSelectedTopicId: (topicId: string | undefined) => void,
  topic: Topic | undefined;
  items: SubscriptionItem[];
  subscriptions: Subscription[];
}

const TopicVideoCardGrid = (props: TopicVideoCardGridProps) => {
  const cards = [];

  let subscriptionTags;
  if (props.topic) {
    const current_topic = props.topic;
    subscriptionTags = props.subscriptions
      .filter(subscription => {
        return current_topic.subscriptions_ids.includes(subscription.uuid)
      })
      .map(subscription => {
        return <div key={subscription.uuid} className="badge badge-outline mx-2">
          <img className="w-4 h-4 inline-block mx-1 rounded" src={subscription.thumbnail} alt={subscription.name}/>
          <p>{subscription.name}</p>
        </div>
      });
  }

  if (props.topic) {
    for (let i = 0; i < props.items.length; i++) {
      const item = props.items[i];
      cards.push(
        <div className="m-4" key={item.uuid}>
          <VideoCard
            item={item}
            subscription={props.subscriptions.find((s) => s.uuid == item.subscription_uuid)}
            onChange={() => props.refreshItems()}
          />
        </div>
      );

    }
  }

  let topicGrid = <div></div>
  if (props.topic) {
    const topic = props.topic;

    topicGrid = (
      <div className="w-full">
        <div className="sticky top-0 z-10 bg-white flex flex-row justify-center items-center">
          <div className="flex-none">
            <CustomButton
              text={""}
              icon={IconForButton.menu}
              relatedModalId={LATERAL_MENU_ID}
              showOnlyOnMobile={true}
              clickAction={() => {
              }}/>
          </div>
          <div className="flex-auto">
            <h1 className="text-2xl md:text-4xl font-bold text-center text-gray-800">{topic.name}</h1>
          </div>
          <div className="flex-none">
            <CustomButton
              text={""}
              icon={IconForButton.pencil}
              relatedModalId={EditTopicModalId}
              clickAction={() => {
              }}/>
            <CustomButton
              text={""}
              icon={IconForButton.trash}
              relatedModalId={undefined}
              clickAction={async () => {
                await deleteTopic(topic.uuid);
                props.refreshTopics();
                props.setSelectedTopicId(undefined);
              }}/>
          </div>
        </div>
        {subscriptionTags}
        <div className="flex flex-row flex-wrap m-6">
          {cards}
        </div>
      </div>
    )
  }

  return topicGrid
}

export default TopicVideoCardGrid;