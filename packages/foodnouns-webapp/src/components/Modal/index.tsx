import classes from './Modal.module.css';
import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import ReactModal from 'react-modal';
import ReactDOM from 'react-dom';
import xIcon from '../../assets/x-icon.png';
// import { isMobile } from 'web3modal';

export const Backdrop: React.FC<{ onDismiss: () => void }> = props => {

  return <div className={classes.backdrop} onClick={props.onDismiss} />;
};

export interface ModalOverlayProps {
  title?: React.ReactNode;
  content?: React.ReactNode;
  onDismiss: () => void;
}

const ModalOverlay: React.FC<{
  modalOverlayProps: ModalOverlayProps;
}> = props => {
  const { title, content, onDismiss } = props.modalOverlayProps;
  return (
    <div className={classes.modal}>
      <button className={classes.closeButton} onClick={onDismiss}>
        <img src={xIcon} alt="Button to close modal" />
      </button>
      <h3>{title}</h3>
      <div className={classes.content}>{content}</div>
    </div>
  );
};

export interface ModalProps {
  title?: React.ReactNode;
  content?: React.ReactNode;
  onDismiss: () => void;
}


const Modal: React.FC<{
 modalProps: ModalProps;
}> = props => {
  const { title, content, onDismiss } = props.modalProps;
  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop onDismiss={onDismiss} />,
        document.getElementById('backdrop-root')!,
      )}
      {ReactDOM.createPortal(
        <ModalOverlay modalOverlayProps={{
          title,
          content,
          onDismiss,
        }}/>,
        document.getElementById('overlay-root')!,
      )}
    </>
  );
};

export default Modal;
