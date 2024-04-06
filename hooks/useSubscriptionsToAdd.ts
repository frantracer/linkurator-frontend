import {useState} from "react";
import {Topic} from "../entities/Topic";
import {Subscription} from "../entities/Subscription";

function useSubscriptionsToAdd(subscriptions: Subscription[], topic: Topic | undefined = undefined):
  [
    Subscription[],
    (subscription: Subscription) => void,
    (subscription: Subscription) => void,
    () => void,
    (subscriptions: Subscription[]) => void
  ] {
  const filteredSubscriptions: Subscription[] = []
  if (topic) {
    for (let i = 0; i < topic.subscriptions_ids.length; i++) {
      const subscription = subscriptions.find(s => s.uuid === topic.subscriptions_ids[i]);
      if (subscription) {
        filteredSubscriptions.push(subscription);
      }
    }
  }

  const [subscriptionsToAdd, setSubscriptionsToAdd] = useState<Subscription[]>(filteredSubscriptions);

  const addSubscription = (subscription: Subscription) => {
    setSubscriptionsToAdd([...subscriptionsToAdd, subscription]);
  }
  const removeSubscription = (subscription: Subscription) => {
    setSubscriptionsToAdd(subscriptionsToAdd.filter(s => s.uuid !== subscription.uuid));
  }
  const clearSubscriptions = () => {
    setSubscriptionsToAdd([]);
  }
  const setSubscriptions = (subscriptions: Subscription[]) => {
    setSubscriptionsToAdd(subscriptions)
  }

  return [subscriptionsToAdd, addSubscription, removeSubscription, clearSubscriptions, setSubscriptions];
}

export default useSubscriptionsToAdd;
