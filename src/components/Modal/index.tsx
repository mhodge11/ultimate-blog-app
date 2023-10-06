import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
};

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
}: React.PropsWithChildren<ModalProps>) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="transition ease-out duration-300"
          enterFrom="transition opacity-0"
          enterTo="transition opacity-100"
          leave="transition ease-in duration-200"
          leaveFrom="transition opacity-100"
          leaveTo="transition opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              enter="transition ease-out duration-300"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition ease-in duration-200"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Dialog.Panel className="w-full min-w-[400px] max-w-full transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  {title}
                </Dialog.Title>
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
