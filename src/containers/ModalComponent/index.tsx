import React, { useState } from "react";
import { Button, Divider, Modal } from "antd";

interface IProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: () => void;
  children?: React.ReactNode;
  title: string;
}

const ModalComponent: React.FC<IProps> = ({
  open,
  setOpen,
  onSubmit,
  children,
  title,
}) => {
  return (
    <>
      <Modal
        title={title}
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
