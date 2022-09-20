import VideoCard from "./VideoCard";
import {Subscription} from "../entities/Subscription";
import {SubscriptionItem} from "../entities/SubscriptionItem";
import {Topic} from "../entities/Topic";
import React from "react";
import CustomButton, {IconForButton} from "./CustomButton";
import {AssignTopicModalId} from "./AssignTopicModal";
import {LATERAL_MENU_ID} from "../utilities/hideLateralMenu";
import {Filters, isItemShown} from "../entities/Filters";
import {FilterOptionsModalId} from "./FilterOptionsModal";

type SubscriptionVideoCardGridProps = {
  refreshItem: (itemId: string) => void,
  topics: Topic[];
  subscription: Subscription | undefined;
  items: SubscriptionItem[];
  filters: Filters;
  isLoading: boolean;
  isFinished: boolean;
}

const SubscriptionVideoCardGrid = (props: SubscriptionVideoCardGridProps) => {
  const cards = [];

  if (props.subscription) {
    for (let i = 0; i < props.items.length; i++) {
      const item = props.items[i];
      if (isItemShown(item, props.filters)) {
        cards.push(
          <div className="m-4" key={item.uuid}>
            <VideoCard
              item={item}
              subscription={undefined}
              onChange={() => props.refreshItem(item.uuid)}
            />
          </div>
        );
      }
    }
  }

  let content = <div></div>
  if (props.subscription) {
    const current_subscription = props.subscription;
    const topicTags = props.topics
      .filter(topic => {
        return topic.subscriptions_ids.includes(current_subscription.uuid)
      })
      .map(topic => {
        return <div key={topic.uuid} className="badge badge-outline mx-2">
          {topic.name}
        </div>
      });

    content =
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
            <h1 onClick={() => window.open(current_subscription.url, "_blank")}
                className="text-2xl md:text-4xl font-bold text-center text-gray-800 cursor-pointer hover:underline">
              {current_subscription.name}
            </h1>
          </div>
          <div className="flex-none">
            <div className="dropdown dropdown-end">
              <CustomButton
                text={""}
                icon={IconForButton.options}
                relatedModalId={undefined}
                clickAction={() => {
                }}/>
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                <CustomButton
                  text={"Add to Topic"}
                  icon={IconForButton.add}
                  relatedModalId={AssignTopicModalId}
                  clickAction={() => {
                  }}/>
                <CustomButton
                  text={"Filter items"}
                  icon={IconForButton.funnel}
                  relatedModalId={FilterOptionsModalId}
                  clickAction={async () => {
                  }}/>
              </ul>
            </div>
          </div>
        </div>
        {topicTags}
        <div className="flex flex-row flex-wrap m-6">
          {cards}
        </div>
        {props.isLoading &&
            <div className="flex justify-center items-center">
                <button className="btn btn-sm btn-ghost loading">loading</button>
            </div>
        }
        {props.isFinished &&
            <div className="flex justify-center items-center">
                <button className="btn btn-sm btn-ghost">No more items to show</button>
            </div>
        }
      </div>
  }

  return content;
}

export default SubscriptionVideoCardGrid;