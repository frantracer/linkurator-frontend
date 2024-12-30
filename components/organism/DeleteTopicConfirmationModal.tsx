import Modal from "../atoms/Modal";
import FlexColumn from "../atoms/FlexColumn";
import FlexRow from "../atoms/FlexRow";
import Button from "../atoms/Button";
import {closeModal} from "../../utilities/modalAction";
import { useTranslations } from 'next-intl';

export const DeleteTopicConfirmationModalId = "delete-topic-confirmation-modal";

type DeleteTopicConfirmationModalProps = {
  onDeleteTopic: () => void;
}

const DeleteTopicConfirmationModal = (props: DeleteTopicConfirmationModalProps) => {
  const t = useTranslations("common");

  return (
    <Modal id={DeleteTopicConfirmationModalId}>
      <FlexColumn>
        <h1 className="font-bold text-xl w-full text-center">{t("delete_topic_confirmation")}</h1>
        <FlexRow position={"end"}>
          <Button clickAction={() => closeModal(DeleteTopicConfirmationModalId)}>
            <span>{t("cancel")}</span>
          </Button>
          <Button clickAction={async () => {
            props.onDeleteTopic();
            closeModal(DeleteTopicConfirmationModalId);
          }}>
            <span>{t("delete")}</span>
          </Button>
        </FlexRow>
      </FlexColumn>
    </Modal>
  )
}

export default DeleteTopicConfirmationModal;
