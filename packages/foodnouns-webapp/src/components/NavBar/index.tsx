import { useState } from 'react';
import { useAppSelector } from '../../hooks/reduxHooks';
import classes from './NavBar.module.css';
import logo from '../../assets/logo192.png';
import { useEtherBalance } from '@usedapp/core';
import { Link, useNavigate } from 'react-router-dom';
import { Nav, Navbar, Container } from 'react-bootstrap';
import NavBarDropdown from './NavBarDropdown'
import testnetNoun from '../../assets/testnet-noun.png';
import config, { CHAIN_ID } from '../../config';
import { utils } from 'ethers';
import { buildEtherscanHoldingsLink } from '../../utils/etherscan';
import { ExternalURL, externalURL } from '../../utils/externalURL';
import useLidoBalance from '../../hooks/useLidoBalance';
import NavBarButton, { NavBarButtonStyle } from '../NavBarButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import NavBarTreasury from '../NavBarTreasury';
import NavWallet from '../NavWallet';

// import DarkModeToggle from '../../DarkModeToggle';

const NavBar = () => {
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const stateBgColor = useAppSelector(state => state.application.stateBackgroundColor);
  const isCool = useAppSelector(state => state.application.isCoolBackground);
  const navigate = useNavigate();
  const ethBalance = useEtherBalance(config.addresses.nounsDaoExecutor);
  const lidoBalanceAsETH = useLidoBalance();
  const treasuryBalance = ethBalance && lidoBalanceAsETH && ethBalance.add(lidoBalanceAsETH);
  const daoEtherscanLink = buildEtherscanHoldingsLink(config.addresses.nounsDaoExecutor);
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  const useStateBg =
    navigate.name === '/' ||
    navigate.name.includes('/noun/') ||
    navigate.name.includes('/auction/');

  const nonWalletButtonStyle = !useStateBg
    ? NavBarButtonStyle.WHITE_INFO
    : isCool
    ? NavBarButtonStyle.COOL_INFO
    : NavBarButtonStyle.WARM_INFO;

  const closeNav = () => setIsNavExpanded(false);

  return (
    <>
      <Navbar
        expand="xl"
        style={{ backgroundColor: `${useStateBg ? stateBgColor : 'white'}` }}
        className={classes.navBarCustom}
        expanded={isNavExpanded}
      >
        <Container style={{ maxWidth: 'unset' }}>
          <div className={classes.brandAndTreasuryWrapper}>
            <Navbar.Brand as={Link} to="/" className={classes.navBarBrand}>
              <img src={logo} className={classes.navBarLogo} alt="FoodNouns DAO logo" height='100px' width='auto' />
            </Navbar.Brand>
            {Number(CHAIN_ID) !== 1 && (
              <Nav.Item>
                <img className={classes.testnetImg} src={testnetNoun} alt="testnet noun" />
                TESTNET
              </Nav.Item>
            )}
            <Nav.Item>
              {treasuryBalance && (
                <Nav.Link
                  href={daoEtherscanLink}
                  className={classes.nounsNavLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  <NavBarTreasury
                    treasuryBalance={Number(utils.formatEther(treasuryBalance)).toFixed(3)}
                    treasuryStyle={nonWalletButtonStyle}
                  />
                </Nav.Link>
              )}
            </Nav.Item>
          </div>
          <Navbar.Toggle
            className={classes.navBarToggle}
            aria-controls="basic-navbar-nav"
            onClick={() => setIsNavExpanded(!isNavExpanded)}
          />
          <Navbar.Collapse className="justify-content-end">

            <Nav.Link as={Link} to="/vote" className={classes.nounsNavLink} onClick={closeNav}>
              <NavBarButton
                buttonText={<p>FOODNOUNS DAO</p>}
                buttonIcon={<FontAwesomeIcon icon={faUsers} />}
                buttonStyle={nonWalletButtonStyle}
              />
            </Nav.Link>

            <Nav.Link
              href={externalURL(ExternalURL.notion)}
              className={classes.nounsNavLink}
              target="_blank"
              rel="noreferrer"
              onClick={closeNav}
            >
              <NavBarButton
                buttonText={<p>Chef Notebook</p>}
                buttonIcon={<FontAwesomeIcon icon={faBookOpen} />}
                buttonStyle={nonWalletButtonStyle}
              />
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/playground"
              className={classes.nounsNavLink}
              onClick={closeNav}
            >
              <NavBarButton
                buttonText={<p>Test Kitchen</p>}
                buttonIcon={<FontAwesomeIcon icon={faPlay} />}
                buttonStyle={nonWalletButtonStyle}
              />
            </Nav.Link>

            <NavBarDropdown
              buttonText={<p>Links</p>}
              buttonIcon={<FontAwesomeIcon icon={faLink} />}
              buttonStyle={nonWalletButtonStyle}
            />
            <NavWallet address={activeAccount || '0'} buttonStyle={nonWalletButtonStyle} />{' '}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavBar;
