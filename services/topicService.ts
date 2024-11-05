import {Topic} from "../entities/Topic";
import {configuration} from "../configuration";
import axios from "axios";
import {SubscriptionItem} from "../entities/SubscriptionItem";
import {replaceBaseUrl} from "../utilities/replaceBaseUrl";
import {ITEMS_PER_PAGE} from "../utilities/constants";
import {InteractionFilter} from "./common";
import {isBeingScanned} from "../entities/Subscription";

export type TopicResponse = {
  elements: Topic[];
  next_page: URL | undefined;
}

export type TopicItemsResponse = {
  elements: SubscriptionItem[];
  nextPage: URL | undefined;
}


export async function getTopics(): Promise<Topic[]> {
  let topics: Topic[] = []
  let nextPage = configuration.TOPICS_URL;
  while (nextPage !== "") {
    const {data, status} = await axios.get(nextPage, {withCredentials: true});
    if (status === 200) {
      const response = mapJsonToTopicResponse(data);
      topics = topics.concat(response.elements);
      nextPage = response.next_page?.toString() || "";
    } else {
      console.error("Error retrieving topics", data);
      nextPage = "";
    }
  }
  return topics
}

export async function getTopic(uuid: string): Promise<Topic | null> {
  const {data, status} = await axios.get(
    configuration.TOPICS_URL + uuid,
    {withCredentials: true});
  if (status === 200) {
    return {
      uuid: data.uuid,
      name: data.name,
      subscriptions_ids: data.subscriptions_ids,
      is_owner: data.is_owner,
      followed: data.followed,
      curator: {
        id: data.curator.id,
        username: data.curator.username,
        avatar_url: data.curator.avatar_url,
        followed: data.curator.followed,
      }
    };
  } else {
    console.error("Error retrieving topic", data);
    return null;
  }
}

export async function getTopicsByName(name: string): Promise<Topic[]> {
  let topics: Topic[] = []
  let nextPage = configuration.TOPICS_URL + "name/" + name;
  while (nextPage !== "") {
    const {data, status} = await axios.get(nextPage, {withCredentials: true});
    if (status === 200) {
      const response = mapJsonToTopicResponse(data);
      topics = topics.concat(response.elements);
      nextPage = response.next_page?.toString() || "";
    } else {
      console.error("Error retrieving topics", data);
      nextPage = "";
    }
  }
  return topics
}

export async function createTopic(uuid: string, name: string, subscriptions: string[]) {
  const {data, status} = await axios.post(
    configuration.TOPICS_URL,
    {uuid: uuid, name: name, subscriptions_ids: subscriptions},
    {withCredentials: true});
  if (status === 201) {
    return data;
  } else {
    console.error("Error creating topic", data);
  }
}

export async function updateTopic(uuid: string, name: string | undefined, subscriptions: string[] | undefined) {
  const {data, status} = await axios.patch(
    configuration.TOPICS_URL + uuid,
    {
      name: name,
      subscriptions_ids: subscriptions
    },
    {withCredentials: true});
  if (status !== 204) {
    console.error("Error updating topic", data);
  }
}

export async function deleteTopic(uuid: string) {
  const {data, status} = await axios.delete(
    configuration.TOPICS_URL + uuid, {withCredentials: true});
  if (status === 204) {
    return data;
  } else {
    console.error("Error deleting topic", data);
  }
}

export async function getTopicItems(
  uuid: string,
  minDuration: number,
  maxDuration: number,
  searchText: string = "",
  interactionsToInclude: InteractionFilter[] = [],
  excludedSubscriptions: string[] = []
): Promise<TopicItemsResponse> {
  let items: SubscriptionItem[] = []
  let nextPage = undefined;
  try {
    const searchParam = searchText ? "&search=" + searchText : "";
    const interactionsParam = interactionsToInclude.length > 0 ? "&include_interactions=" + interactionsToInclude.join(",") : "";
    const minDurationParam = "&min_duration=" + minDuration;
    const maxDurationParam = "&max_duration=" + maxDuration;
    const excludedSubscriptionsParam = excludedSubscriptions.length > 0 ? "&excluded_subscriptions=" + excludedSubscriptions.join(",") : "";
    const url = configuration.TOPICS_URL + uuid + "/items?page_size=" + ITEMS_PER_PAGE + searchParam +
      interactionsParam + minDurationParam + maxDurationParam + excludedSubscriptionsParam;
    const {data, status} = await axios.get(url, {withCredentials: true});
    if (status === 200) {
      const response = mapJsonToTopicItemsResponse(data);
      items = response.elements;
      nextPage = response.nextPage;
    }
  } catch (error: any) {
    console.error("Error retrieving topic items", error);
  }
  return {elements: items, nextPage: nextPage};
}

export async function getTopicItemsFromUrl(url: string): Promise<TopicItemsResponse> {
  let items: SubscriptionItem[] = []
  let nextPage = undefined;
  try {
    const {data, status} = await axios.get(url, {withCredentials: true});
    if (status === 200) {
      const response = mapJsonToTopicItemsResponse(data);
      items = response.elements;
      nextPage = response.nextPage;
    }
  } catch (error: any) {
    console.error("Error retrieving topic items from url", error);
  }
  return {elements: items, nextPage: nextPage};
}

export async function assignSubscriptionToTopic(topic_uuid: string, subscription_uuid: string): Promise<void> {
  const {data, status} = await axios.post(
    configuration.TOPICS_URL + topic_uuid + "/subscriptions/" + subscription_uuid,
    {},
    {withCredentials: true});
  if (status !== 201) {
    throw ("Error assigning subscription to topic " + data);
  }
}

export async function unassignSubscriptionToTopic(topic_uuid: string, subscription_uuid: string): Promise<void> {
  const {data, status} = await axios.delete(
    configuration.TOPICS_URL + topic_uuid + "/subscriptions/" + subscription_uuid,
    {withCredentials: true});
  if (status !== 204) {
    throw ("Error unassigning subscription from topic " + data);
  }
}

export async function followTopic(uuid: string): Promise<void> {
  const {data, status} = await axios.post(
    configuration.TOPICS_URL + uuid + "/follow",
    {},
    {withCredentials: true});
  if (status !== 201) {
    throw ("Error following topic " + data);
  }
}

export async function unfollowTopic(uuid: string): Promise<void> {
  const {data, status} = await axios.delete(
    configuration.TOPICS_URL + uuid + "/follow",
    {withCredentials: true});
  if (status !== 204) {
    throw ("Error unfollowing topic " + data);
  }
}

const mapJsonToTopicResponse = (json: Record<string, any>): TopicResponse => {
  let nextPage: URL | undefined = undefined;
  if (json.next_page) {
    nextPage = replaceBaseUrl(new URL(json.next_page), new URL(configuration.API_BASE_URL));
  }

  return {
    elements: json.elements.map((element: Record<string, any>) => {
      return {
        uuid: element.uuid,
        name: element.name,
        subscriptions_ids: element.subscriptions_ids,
        is_owner: element.is_owner,
        followed: element.followed,
        curator: {
          id: element.curator.id,
          username: element.curator.username,
          avatar_url: element.curator.avatar_url,
          followed: element.curator.followed,
        }
      };
    }),
    next_page: nextPage,
  };
}

const mapJsonToTopicItemsResponse = (json: Record<string, any>): TopicItemsResponse => {
  let nextPage: URL | undefined = undefined;
  if (json.next_page) {
    nextPage = replaceBaseUrl(new URL(json.next_page), new URL(configuration.API_BASE_URL));
  }

  return {
    elements: json.elements.map((element: Record<string, any>) => {
      const published_at = new Date(element.published_at);
      if (isNaN(published_at.getTime())) {
        throw new Error("Published at is not a valid date");
      }
      return {
        uuid: element.uuid,
        name: element.name,
        url: element.url,
        thumbnail: element.thumbnail,
        published_at: new Date(element.published_at),
        subscription_uuid: element.subscription_uuid,
        subscription: {
          uuid: element.subscription.uuid,
          name: element.subscription.name,
          url: element.subscription.url,
          thumbnail: element.subscription.thumbnail,
          topicUuid: element.subscription.topic_uuid,
          followed: element.subscription.followed,
          isBeingScanned: isBeingScanned(element.subscription.scanned_at),
        },
        recommended: element.recommended,
        discouraged: element.discouraged,
        viewed: element.viewed,
        hidden: element.hidden,
        duration: element.duration,
      };
    }),
    nextPage: nextPage,
  };
}
