import React from "react";
import {CrossIcon} from "./Icons";

type ModalProps = {
  id: string;
  onClose?: () => void;
  children?: React.ReactNode;
}

const Modal = (props: ModalProps) => {
  return (
    <dialog id={props.id} className="bg-black/50 modal modal-bottom sm:modal-middle max-h-screen">
      <div className="modal-box overflow-y-visible">
        <form method="dialog">
          <button onClick={props.onClose} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            <CrossIcon/>
          </button>
        </form>
        {props.children}
      </div>
    </dialog>
  )
}

export default Modal;
