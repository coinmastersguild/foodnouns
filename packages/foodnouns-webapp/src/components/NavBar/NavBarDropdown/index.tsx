import clsx from 'clsx';
import classes from './NavBarDropdown.module.css';
import NavBarButton from '../../NavBarButton';
import { Nav } from 'react-bootstrap';
import { Trans } from '@lingui/macro';
import { useState } from 'react';
import { ExternalURL, externalURL } from '../../../utils/externalURL';



export enum NavBarButtonStyle {
  COOL_INFO,
  COOL_WALLET,
  WARM_INFO,
  WARM_WALLET,
  WHITE_INFO,
  WHITE_ACTIVE,
  WHITE_ACTIVE_VOTE_SUBMIT,
  WHITE_WALLET,
  DELEGATE_BACK,
  DELEGATE_PRIMARY,
  DELEGATE_SECONDARY,
  DELEGATE_DISABLED,
}

interface NavBarButtonProps {
  buttonText: React.ReactNode;
  buttonIcon?: React.ReactNode;
  buttonStyle?: NavBarButtonStyle;
  onClick?: (e?: any) => void;
  disabled?: boolean;
}

export const getNavBarButtonVariant = (buttonStyle?: NavBarButtonStyle) => {
  switch (buttonStyle) {
    case NavBarButtonStyle.COOL_INFO: {
      return classes.coolInfo;
    }
    case NavBarButtonStyle.COOL_WALLET: {
      return classes.coolWallet;
    }
    case NavBarButtonStyle.WARM_INFO: {
      return classes.warmInfo;
    }
    case NavBarButtonStyle.WARM_WALLET: {
      return classes.warmWallet;
    }
    case NavBarButtonStyle.WHITE_INFO: {
      return classes.whiteInfo;
    }
    case NavBarButtonStyle.WHITE_ACTIVE: {
      return classes.whiteActive;
    }
    case NavBarButtonStyle.WHITE_ACTIVE_VOTE_SUBMIT: {
      return classes.whiteActiveVoteSubmit;
    }
    case NavBarButtonStyle.WHITE_WALLET: {
      return classes.whiteWallet;
    }
    case NavBarButtonStyle.DELEGATE_BACK: {
      return classes.delegateBack;
    }
    case NavBarButtonStyle.DELEGATE_PRIMARY: {
      return classes.delegatePrimary;
    }
    case NavBarButtonStyle.DELEGATE_SECONDARY: {
      return classes.delegateSecondary;
    }
    case NavBarButtonStyle.DELEGATE_DISABLED: {
      return classes.delegateDisabled;
    }
    default: {
      return classes.info;
    }
  }
};



const NavBarDropdown: React.FC<NavBarButtonProps> = props => {
  const { buttonText, buttonIcon, buttonStyle, onClick, disabled } = props;
  const [ open, setOpen ] = useState<boolean>(false);
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const handleDropDownFocus = (state:boolean) => {
    setOpen(!state);
  };
  let isDisabled = disabled ?? false;
  const closeNav = () => setIsNavExpanded(false);
  
  return (
    <>
      <div 
        className={`${classes.wrapper} ${getNavBarButtonVariant(buttonStyle)}`}
        onClick={(e)=> handleDropDownFocus(open)}
      > 
        <div
          className={clsx(classes.button, isDisabled ? classes.btnDisabled : classes.btnEnabled)}
        >
          {buttonIcon && <div className={classes.icon}>{buttonIcon}</div>}
          <div>{buttonText}</div>
        </div>
        {open && (
          <div className="dropdownMenu">
            <Nav.Link
              href={externalURL(ExternalURL.discord)}
              className={classes.nounsNavLink}
              target="_blank"
              rel="noreferrer"
              onClick={closeNav}
            >
              <NavBarButton
                buttonText={<Trans>Discord</Trans>}
              />
            </Nav.Link>
            <Nav.Link
              href={externalURL(ExternalURL.twitter)}
              className={classes.nounsNavLink}
              target="_blank"
              rel="noreferrer"
              onClick={closeNav}
            >
              <NavBarButton
                buttonText={<Trans>Twitter</Trans>}
              />
            </Nav.Link>
          </div>
        )}
      </div>
    </>
  );
};

export default NavBarDropdown;
