import {MenuItem} from "./MenuItem";
import {Subscription} from "../entities/Subscription";
import {scrollToDrawerContentTop} from "../utilities/scrollToDrawerContentTop";

type LateralItemListProps = {
  subscriptions: Subscription[];
  setSelectedSubscription: (subscription: Subscription | undefined) => void;
  selectedSubscription: Subscription | undefined;
  searchValue: string;
}

const LateralSubscriptionList = (props: LateralItemListProps) => {
  const handleClick = (subscriptionId: string) => {
    const subscription = props.subscriptions.find((subscription) => subscription.uuid === subscriptionId);
    if (subscription) {
      props.setSelectedSubscription(subscription);
      scrollToDrawerContentTop();
    }
  }

  const items = props.subscriptions
    .filter((subscription) => {
      return subscription.name.toLowerCase().includes(props.searchValue.toLowerCase());
    })
    .map((subscription) => (
      <MenuItem
        title={subscription.name}
        key={subscription.uuid}
        onClick={() => handleClick(subscription.uuid)}
        selected={subscription.uuid === props.selectedSubscription?.uuid}
      />
    ))

  return (
    <nav className="flex-grow pb-4 px-4 md:block md:pb-0 md:overflow-y-auto">
      {items}
    </nav>
  )
}

export default LateralSubscriptionList;