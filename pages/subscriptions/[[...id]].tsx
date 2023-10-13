import type {NextPage} from "next";
import Head from "next/head";
import React, {useEffect} from "react";
import "tailwindcss/tailwind.css";
import useSubscriptions from "../../hooks/useSubscriptions";
import useSubscriptionItems from "../../hooks/useSubscriptionItems";
import useProfile from "../../hooks/useProfile";
import SubscriptionVideoCardGrid from "../../components/SubscriptionVideoCardGrid";
import NewTopicModal from "../../components/NewTopicModal";
import {useTopics} from "../../hooks/useTopics";
import {LATERAL_MENU_ID} from "../../utilities/hideLateralMenu";
import FilterOptionsModal from "../../components/FilterOptionsModal";
import useFilters from "../../hooks/useFilters";
import {useRouter} from "next/router";
import SubscriptionsLateralMenu from "../../components/SubscriptionsLateralMenu";
import {paths} from "../../configuration";

const SubscriptionsPage: NextPage = () => {
  const router = useRouter()

  const profile = useProfile();
  const [subscriptions] = useSubscriptions(profile);
  const [subscriptionsItems, loadingSubscriptionItems, _, refreshSubscriptionItem,
    selectedSubscriptionId, setSelectedSubscriptionId, subscriptionIsFinished] = useSubscriptionItems();
  const [topics, refreshTopics] = useTopics(profile);
  const [filters, setFilters] = useFilters();

  if (selectedSubscriptionId === undefined && subscriptions.length > 0) {
    setSelectedSubscriptionId(subscriptions[0].uuid);
  }
  const selectedSubscription = subscriptions.find(subscription => subscription.uuid === selectedSubscriptionId);

  const refreshItem = (item_uuid: string) => {
    refreshSubscriptionItem(item_uuid)
  }

  useEffect(() => {
    console.log(profile)
    if (profile?.is_logged_in === false) {
      router.push(paths.LOGIN)
    }
  }, [router, profile]);

  return (
    <div>
      <Head>
        <title>Linkurator</title>
        <meta name="description" content="Linkurator"/>
        <link rel="icon" href="/logo_v1_fav.png"/>
      </Head>
      <main className="flex bg-gray-100">
        <NewTopicModal refreshTopics={refreshTopics} subscriptions={subscriptions}/>
        <FilterOptionsModal filters={filters} setFilters={setFilters}/>

        <div className="drawer drawer-mobile">
          <input id={LATERAL_MENU_ID} type="checkbox" className="drawer-toggle"/>
          <SubscriptionVideoCardGrid refreshItem={refreshItem}
                                     topics={topics}
                                     subscription={selectedSubscription}
                                     items={subscriptionsItems}
                                     filters={filters}
                                     isLoading={loadingSubscriptionItems}
                                     isFinished={subscriptionIsFinished}/>
          <div className="drawer-side">
            <label htmlFor={LATERAL_MENU_ID} className="drawer-overlay"></label>
            <SubscriptionsLateralMenu
              subscriptions={subscriptions}
              selectedSubscription={selectedSubscription}
              setSelectedSubscription={(subscription) => setSelectedSubscriptionId(subscription?.uuid)}
              profile={profile}/>
          </div>
        </div>
      </main>
    </div>

  );
};

export default SubscriptionsPage;
