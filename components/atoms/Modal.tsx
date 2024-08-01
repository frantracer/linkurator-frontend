import React from "react";
import {CrossIcon} from "./Icons";

type ModalProps = {
  id: string;
  children?: React.ReactNode;
}

const Modal = (props: ModalProps) => {
  return (
    <dialog id={props.id} className="bg-black/50 modal modal-bottom sm:modal-middle max-h-screen">
      <div className="modal-box">
        <form tabIndex={0} method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"><CrossIcon/></button>
        </form>
        {props.children}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}

export default Modal;
