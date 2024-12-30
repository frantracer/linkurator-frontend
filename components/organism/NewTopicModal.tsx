import { useRouter } from "next/navigation";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { paths } from "../../configuration";
import { Subscription, subscriptionSorting } from "../../entities/Subscription";
import { Topic } from "../../entities/Topic";
import { useDebounce } from "../../hooks/useDebounce";
import useFindTopics from "../../hooks/useFindTopics";
import useProfile from "../../hooks/useProfile";
import useSubscriptionsToAdd from "../../hooks/useSubscriptionsToAdd";
import { createTopic, followTopic, unfollowTopic } from "../../services/topicService";
import { closeModal } from "../../utilities/modalAction";
import ALink from "../atoms/ALink";
import Box from "../atoms/Box";
import Button from "../atoms/Button";
import Collapse from "../atoms/Collapse";
import Dropdown from "../atoms/Dropdown";
import { ErrorBanner } from "../atoms/ErrorBanner";
import FlexColumn from "../atoms/FlexColumn";
import FlexItem from "../atoms/FlexItem";
import FlexRow from "../atoms/FlexRow";
import { AddIcon, CheckCircleIcon, CircleIcon, MinusIcon } from "../atoms/Icons";
import InputText from "../atoms/InputText";
import Menu from "../atoms/Menu";
import { MenuItem } from "../atoms/MenuItem";
import Miniature from "../atoms/Miniature";
import Modal from "../atoms/Modal";
import { Tabs } from "../atoms/Tabs";
import Tag from "../atoms/Tag";
import SearchBar from "../molecules/SearchBar";
import { useTranslations } from 'next-intl';

export const NewTopicModalId = "new-topic-modal";

type TopicsGroupedByCurator = {
  [curatorId: string]: Topic[];
};

type CuratorsIndexedById = {
  [curatorId: string]: {
    id: string;
    username: string;
    avatar_url: string;
    followed: boolean;
  };
};

type NewTopicModalProps = {
  subscriptions: Subscription[];
  refreshTopics: () => void;
}

const NewTopicModal = (props: NewTopicModalProps) => {
  const router = useRouter();
  const t = useTranslations("common");

  const NEW_TOPIC_TAB = t("new_topic_tab");
  const FOLLOW_TOPIC_TAB = t("follow_topic_tab");

  const {profile} = useProfile()

  const tabsText = [NEW_TOPIC_TAB, FOLLOW_TOPIC_TAB];
  const [selectedTab, setSelectedTab] = useState(NEW_TOPIC_TAB);
  const [searchValue, setSearchValue] = useState("");

  const [topicSearch, setTopicSearch] = useState("");
  const debouncedTopicSearch = useDebounce(topicSearch, 500);

  const {topics, topicsAreLoading, refreshTopics} = useFindTopics(profile, debouncedTopicSearch);
  const topicsGroupedByCurator = topics.reduce((acc, topic) => {
    if (!acc[topic.curator.id]) {
      acc[topic.curator.id] = [];
    }
    acc[topic.curator.id].push(topic);
    return acc;
  }, {} as TopicsGroupedByCurator);
  const curatorsIndexedById = topics.reduce((acc, topic) => {
    acc[topic.curator.id] = topic.curator;
    return acc;
  }, {} as CuratorsIndexedById);

  const CollapsableMenuItems = Object.keys(topicsGroupedByCurator).map(curatorId => {
    const curator = curatorsIndexedById[curatorId];
    const titleElement = (
      <FlexRow position={"start"}>
        <Miniature src={curator.avatar_url} alt={curator.username}/>
        <span>{curator.username}</span>
      </FlexRow>
    );
    const contentElement = topicsGroupedByCurator[curatorId].map(topic =>
      <MenuItem key={topic.uuid} selected={false} onClick={() => handleClickCuratorTopic(topic.uuid)}>
        <FlexRow position={"start"}>
          <FlexItem grow={true}>
            <span>{topic.name}</span>
          </FlexItem>
          {!topic.followed &&
              <Button clickAction={() => handleFollowTopic(topic.uuid)} disabled={topic.is_owner}>
                  <AddIcon/>
                  <span>{t("follow")}</span>
              </Button>
          }
          {topic.followed &&
              <Button clickAction={() => handleUnfollowTopic(topic.uuid)} disabled={topic.is_owner}>
                  <MinusIcon/>
                  <span>{t("unfollow")}</span>
              </Button>
          }
        </FlexRow>
      </MenuItem>
    )

    return <Collapse title={titleElement} content={contentElement} key={curatorId} isOpen={true}/>
  });

  const [newTopicName, setNewTopicName] = useState("");
  const {
    subscriptionsToAdd,
    addSubscription,
    removeSubscription,
    clearSubscriptions
  } = useSubscriptionsToAdd([], undefined)

  const handleFollowTopic = (topicId: string) => {
    followTopic(topicId).then(() => {
      refreshTopics();
      props.refreshTopics()
    });
  }

  const handleUnfollowTopic = (topicId: string) => {
    unfollowTopic(topicId).then(() => {
      refreshTopics();
      props.refreshTopics();
    });
  }

  const handleClickCuratorTopic = (topicId: string) => {
    router.push(paths.TOPICS + "/" + topicId);
    handleClose();
  }

  const handleClose = () => {
    setNewTopicName("");
    setSearchValue("");
    setTopicSearch("");
    clearSubscriptions();
    closeModal(NewTopicModalId);
  }

  const subscriptionsMenuItems = props.subscriptions
    .filter(subscription => subscription.name.toLowerCase().includes(searchValue.toLowerCase()))
    .sort(subscriptionSorting)
    .map(subscription => {
      const isSelected = subscriptionsToAdd.map(s => s.uuid).includes(subscription.uuid);
      const handleClick = () => {
        if (isSelected) {
          removeSubscription(subscription);
        } else {
          addSubscription(subscription);
        }
      }
      return <MenuItem key={subscription.uuid}
                       selected={false}
                       onClick={handleClick}>
        <FlexRow position={"start"}>
          <Miniature src={subscription.thumbnail} alt={subscription.name}/>
          {subscription.name}
          <FlexItem grow={true}/>
          {isSelected && <FlexItem><CheckCircleIcon/></FlexItem>}
          {!isSelected && <FlexItem><CircleIcon/></FlexItem>}
        </FlexRow>
      </MenuItem>
    })

  const subscriptionTags = subscriptionsToAdd
    .sort(subscriptionSorting)
    .map(subscription => {
      return (
        <ALink key={subscription.uuid} href={paths.SUBSCRIPTIONS + "/" + subscription.uuid}
               onClick={handleClose}>
          <Tag>
            <Miniature src={subscription.thumbnail} alt={subscription.name}/>
            {subscription.name}
          </Tag>
        </ALink>)
    })

  return (
    <Modal id={NewTopicModalId} onClose={handleClose}>
      <h1 className="font-bold text-xl w-full text-center">{t("topics")}</h1>
      <Tabs tabsText={tabsText} selectedTab={selectedTab} onTabSelected={setSelectedTab}/>
      {selectedTab === NEW_TOPIC_TAB &&
          <FlexColumn>
              <InputText placeholder={t("enter_new_topic_name")} value={newTopicName}
                         onChange={(value) => setNewTopicName(value)}/>
              <Box title={t("subscriptions") + " (" + subscriptionsToAdd.length + ")"}>
                  <div className={"h-60 overflow-y-auto"}>
                      <FlexRow wrap={true}>
                        {subscriptionTags.length === 0 &&
                            <span>{t("no_subscriptions")}</span>
                        }
                        {subscriptionTags.length > 0 &&
                          subscriptionTags
                        }
                      </FlexRow>
                  </div>
              </Box>
              <FlexRow hideOverflow={false} position={"between"}>
                  <Dropdown start={true} bottom={false}
                            button={<FlexRow><span>{t("add_or_remove_subscriptions")}</span></FlexRow>}>
                      <div className={"h-60"}>
                          <Menu>
                            {subscriptionsMenuItems.length === 0 &&
                                <MenuItem>{t("no_subscriptions")}</MenuItem>
                            }
                            {subscriptionsMenuItems.length > 0 && subscriptionsMenuItems}
                          </Menu>
                      </div>
                      <SearchBar value={searchValue} placeholder={t("search_placeholder")} handleChange={(value) => setSearchValue(value)}/>
                  </Dropdown>
                  <Button clickAction={async () => {
                    createTopic(uuidv4(), newTopicName, subscriptionsToAdd.map(s => s.uuid)).then(
                      () => {
                        handleClose();
                        props.refreshTopics();
                      }
                    )
                  }}>
                      <span>{t("create")}</span>
                  </Button>
              </FlexRow>
          </FlexColumn>
      }
      {selectedTab === FOLLOW_TOPIC_TAB &&
          <FlexColumn>
              <FlexItem grow={true}>
                  <SearchBar placeholder={t("search_topic_placeholder")} value={topicSearch}
                             handleChange={setTopicSearch}/>
              </FlexItem>
              <Box title={t("topics")}>
                  <div className={"h-72 overflow-y-auto"}>
                      <FlexColumn>
                        {debouncedTopicSearch === "" &&
                            <span>{t("search_topic_prompt")}</span>
                        }
                        {topics.length === 0 && !topicsAreLoading && debouncedTopicSearch !== "" &&
                            <ErrorBanner>{t("no_topics_found") + ": " + debouncedTopicSearch}</ErrorBanner>
                        }
                        {topicsAreLoading && <span>{t("loading")}</span>}
                        {topics.length > 0 &&
                            <div className={"max-h-72 overflow-y-auto w-full"}>
                                <Menu isFullHeight={true}>
                                  {CollapsableMenuItems}
                                </Menu>
                            </div>
                        }
                      </FlexColumn>
                  </div>
              </Box>
          </FlexColumn>}
    </Modal>
  )
}

export default NewTopicModal;
