import classes from './Footer.module.css';
import { Container } from 'react-bootstrap';
import { buildEtherscanAddressLink } from '../../utils/etherscan';
import { externalURL, ExternalURL } from '../../utils/externalURL';
import config from '../../config';
import Link from '../Link';


const Footer = () => {
  const twitterURL = externalURL(ExternalURL.twitter);
  const discordURL = externalURL(ExternalURL.discord);
  const etherscanURL = buildEtherscanAddressLink(config.addresses.nounsToken);

  return (
    <div className={classes.wrapper}>
      <Container className={classes.container}>
        <footer className={classes.footerSignature}>
          <Link text={<p>Discord</p>} url={discordURL} leavesPage={true} />
          <Link text={<p>Twitter</p>} url={twitterURL} leavesPage={true} />
          <Link text={<p>Etherscan</p>} url={etherscanURL} leavesPage={true} />
        </footer>
      </Container>
    </div>
  );
};
export default Footer;
