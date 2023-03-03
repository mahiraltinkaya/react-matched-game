import React, { useState } from "react";
import { Button, Divider, Modal } from "antd";

interface IProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: () => void;
  children?: React.ReactNode;
}

const ModalComponent: React.FC<IProps> = ({
  open,
  setOpen,
  onSubmit,
  children,
}) => {
  return (
    <>
      <Modal
        title="Player Nicname"
        open={open}
        onOk={() => {
          onSubmit();
        }}
        onCancel={() => {
          setOpen(false);
        }}
      >
        <Divider></Divider>
        {children}
      </Modal>
    </>
  );
};

export default ModalComponent;
