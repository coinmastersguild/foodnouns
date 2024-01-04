import Section from '../../layout/Section';
import { Col } from 'react-bootstrap';
import classes from './Documentation.module.css';
import Accordion from 'react-bootstrap/Accordion';
import Link from '../Link';


const Documentation = () => {
  const nounsdaoLink = (
    <Link text={<p>NounsDAO</p>} url="https://nouns.wtf" leavesPage={true} />
  );
  const foodproductionLink = (
    <Link
      text={<p>Food Production and Innovation</p>}
      url="https://foodnouns.notion.site/foodnouns/Food-Production-Innovation-5b226cd3e26e4d49821886877ff3f21d"
      leavesPage={true}
    />
  );
  const educationLink = (
    <Link
      text={<p>Education and Entertainment</p>}
      url="https://foodnouns.notion.site/foodnouns/Education-Entertainment-edc1b47424f44434840e6b35bdfe182b"
      leavesPage={true}
    />
  );
  const foodandbevLink = (
    <Link
      text={<p>Food and Beverage Industry Wellness</p>}
      url="https://foodnouns.notion.site/foodnouns/Food-Beverage-Industry-Wellness-a93e354112ea4a4e93e7f5395f354d3e"
      leavesPage={true}
    />
  );
  const funLink = (
    <Link
      text={<p>Fun</p>}
      url="https://foodnouns.notion.site/foodnouns/FUN-eeb648bdcbb74ad4afc405b6d6019b45"
      leavesPage={true}
    />
  );
  const foodnounsdaoLink = (
    <Link text={<p>FOODNOUNS DAO</p>} url="https://foodnouns.wtf/vote" leavesPage={true} />
  );
  const chefnotebookLink = (
    <Link
      text={<p>Chef Notebook</p>}
      url="https://foodnouns.notion.site/Explore-the-World-of-FOODNOUNS-4d4cf868455940b6bcb0243b45de615e"
      leavesPage={true}
    />
  );
  const testkitchenLink = (
    <Link
      text={<p>Test Kitchen</p>}
      url="https://www.foodnouns.wtf/testkitchen"
      leavesPage={true}
    />
  );
  const publicDomainLink = (
    <Link
      text={<p>public domain</p>}
      url="https://creativecommons.org/publicdomain/zero/1.0/"
      leavesPage={true}
    />
  );
  const compoundGovLink = (
    <Link
      text={<p>Compound Governance</p>}
      url="https://compound.finance/governance"
      leavesPage={true}
    />
  );
  return (
    <Section fullWidth={false}>
      <Col lg={{ span: 10, offset: 1 }}>
        <div className={classes.headerWrapper}>
          <h1>
            <p>A Tasty Fork!</p>
          </h1>
          <p className={classes.aboutText}>
            <p>
              FOODNOUNS is a tasty fork of the {nounsdaoLink}, an experimental on-chain avatar
              community bootstrapping digital community and identity. Proceeds from 3 FOODNOUNS
              auctions per day builds the Treasury that will fund on-chain Proposals with a focus on{' '}
              {foodproductionLink}, {educationLink}, {foodandbevLink} and {funLink}!
            </p>
          </p>
          <p className={classes.aboutText} style={{ paddingBottom: '4rem' }}>
            <p>
              Learn more about proposals and the {foodnounsdaoLink}, take part in longer form
              discussions in {chefnotebookLink} or start creating your own “off-chain” FOODNOUN
              using the {testkitchenLink}.
            </p>
          </p>
        </div>
        <Accordion flush>
          <Accordion.Item eventKey="0" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <p>Summary</p>
            </Accordion.Header>
            <Accordion.Body>
              <ul>
                <li>
                  <p>FOODNOUNS artwork is in the {publicDomainLink}.</p>
                </li>
                <li>
                  <p>One FOODNOUN is trustlessly auctioned every 8 hours, forever.</p>
                </li>
                <li>
                  <p>
                    50% of FOODNOUNS auction proceeds are trustlessly sent to the treasury.
                  </p>
                </li>
                <li>
                  <p>
                    25% of FOODNOUNS auction proceeds are trustlessly sent to the {nounsdaoLink}.
                  </p>
                </li>
                <li>
                  <p>
                    15% of FOODNOUNS auction proceeds are trustlessly sent to the Kitchen Nouncil.
                  </p>
                </li>
                <li>
                  <p>
                    10% of FOODNOUNS auction proceeds are trustlessly sent to the FOODNOUNDERS.
                  </p>
                </li>
                <li>
                  <p>Settlement of one auction kicks off the next.</p>
                </li>
                <li>
                  <p>All FOODNOUNS are members of FOODNOUNS DAO.</p>
                </li>
                <li>
                  <p>FOODNOUNS DAO uses a fork of {compoundGovLink}.</p>
                </li>
                <li>
                  <p>One FOODNOUN is equal to one vote.</p>
                </li>
                <li>
                  <p>The treasury is controlled exclusively by FOODNOUNS via governance.</p>
                </li>
                <li>
                  <p>Artwork is generative and stored directly on-chain (not IPFS).</p>
                </li>
                <li>
                  <p>
                    No explicit rules exist for attribute scarcity; all FOODNOUNS are equally rare.
                  </p>
                </li>
                <li>
                  <p>
                    FOODNOUNDERS receive rewards in the form of FOODNOUNS (10% of supply for first
                    year).
                  </p>
                </li>
                <li>
                  <p>
                    Kitchen Nouncillors receive rewards in the form of FOODNOUNS (10% of supply for
                    first 2 years).
                  </p>
                </li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <p>Daily Auctions</p>
            </Accordion.Header>
            <Accordion.Body>
              <p className={classes.aboutText}>
                <p>
                  The FOODNOUNS Auction Contract will act as a self-sufficient FOODNOUN generation
                  and distribution mechanism, auctioning one FOODNOUN every 8 hours, forever.
                  Auction proceeds (ETH) are automatically deposited in the following ways: 50% to
                  FOODNOUNS DAO treasury which is governed by FOODNOUN owners, 25% to the NounsDAO
                  Treasury, 15% to the Kitchen Nouncil and the final 10% to the FOODNOUNDERS.
                </p>
              </p>

              <p className={classes.aboutText}>
                <p>
                  Each time an auction is settled, the settlement transaction will also cause a new
                  FOODNOUN to be minted and a new 8 hour activation to begin.{' '}
                </p>
              </p>
              <p>
                <p>
                  While settlement is most heavily incentivized for the winning bidder, it can be
                  triggered by anyone, allowing the system to trustlessly auction FOODNOUNS as long
                  as Ethereum is operational and there are interested bidders.
                </p>
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <p>FOODNOUNS DAO</p>
            </Accordion.Header>
            <Accordion.Body>
              <p>
                The main governing body of the FOODNOUNS DAO ecosystem is a fork of{' '}
                {compoundGovLink}. Each FOODNOUN is an irrevocable member of FOODNOUNS DAO and
                entitled to one vote in all governance matters. FOODNOUN votes are non-transferable
                (if you sell your Noun the vote goes with it) but delegatable, which means you can
                assign your vote to someone else as long as you own your FOODNOUN.
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="3" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <p>Governance ‘Slow Start’</p>
            </Accordion.Header>
            <Accordion.Body>
              <p>
                <p>
                  In addition to the precautions taken by Compound Governance, FOODNOUNDERS have
                  given themselves a special veto right to ensure that no malicious proposals can be
                  passed while the FOODNOUN supply is low. This veto right will only be used if an
                  obviously harmful governance proposal has been passed, and is intended as a last
                  resort.
                </p>
              </p>
              <p>
                <p>
                  FOODNOUNDERS will probably revoke this veto right when they deem it safe to do so.
                  This decision will be based on a healthy FOODNOUN distribution and a community
                  that is engaged in the governance process.
                </p>
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="4" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <p>FOODNOUN Traits</p>
            </Accordion.Header>
            <Accordion.Body>
              <p>
                <p>
                  FOODNOUNS are generated randomly based Ethereum block hashes. There are no 'if'
                  statements or other rules governing Noun trait scarcity, which makes all FOODNOUNS
                  equally rare. As of this writing, FOODNOUNS are made up of:
                </p>
              </p>
              <ul>
                <li>
                  <p>backgrounds (2) </p>
                </li>
                <li>
                  <p>bodies (1)</p>
                </li>
                <li>
                  <p>accessories (19) </p>
                </li>
                <li>
                  <p>heads (76) </p>
                </li>
                <li>
                  <p>glasses (21)</p>
                </li>
              </ul>
              <p>
                You can experiment with off-chain FOODNOUN generation at the {testkitchenLink}.
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="5" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <p>On-Chain Artwork</p>
            </Accordion.Header>
            <Accordion.Body>
              <p>
                <p>
                  FOODNOUNS are stored directly on Ethereum and do not utilize pointers to other
                  networks such as IPFS. This is possible because Noun parts are compressed and
                  stored on-chain using a custom run-length encoding (RLE), which is a form of
                  lossless compression.
                </p>
              </p>

              <p>
                <p>
                  The compressed parts are efficiently converted into a single base64 encoded SVG
                  image on-chain. To accomplish this, each part is decoded into an intermediate
                  format before being converted into a series of SVG rects using batched, on-chain
                  string concatenation. Once the entire SVG has been generated, it is base64
                  encoded.
                </p>
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="6" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <p>FOODNOUN Seeder Contract</p>
            </Accordion.Header>
            <Accordion.Body>
              <p>
                <p>
                  The FOODNOUN Seeder contract is used to determine Noun traits during the minting
                  process. The seeder contract can be replaced to allow for future trait generation
                  algorithm upgrades. Additionally, it can be locked by the FOODNOUNS DAO to prevent
                  any future updates. Currently, Noun traits are determined using pseudo-random
                  number generation:
                </p>
              </p>
              <code>keccak256(abi.encodePacked(blockhash(block.number - 1), nounId))</code>
              <br />
              <br />
              <p>
                <p>
                  Trait generation is not truly random. Traits can be predicted when minting a
                  FOODNOUN on the pending block.
                </p>
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="7" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <p>FOODNOUNDER and Kitchen Nouncillor's Rewards</p>
            </Accordion.Header>
            <Accordion.Body>
              <p>
                <p>
                  'FOODNOUNDERS' are professional chefs turned degens who initiated FOODNOUNS. Here
                  are the FOODNOUNDERS:
                </p>
              </p>
              <ul>
                <li>
                  <Link
                    text="@artismyweapon_"
                    url="https://twitter.com/artismyweapon_"
                    leavesPage={true}
                  />
                </li>
                <li>
                  <Link text="@cheffo_nft" url="https://twitter.com/cheffo_nft" leavesPage={true} />
                </li>
              </ul>
              <p>
                <p>
                  Every 10th FOODNOUN for the first year of the project (FOODNOUN ids #0, #10, #20,
                  #30 and so on) will be automatically sent to the FOODNOUNER's multisig to be
                  vested and shared among the founding members of the project.
                </p>
              </p>
              <p>
                <p>
                  'Kitchen Nouncillors' are food, technology and human enthusiasts that advice and
                  assist FOODNOUNS DAO. Here the Kitchen Noucillors:
                </p>
              </p>
              <ul>
                <li>
                  <Link
                    text="@andrewladdusaw"
                    url="https://twitter.com/AndrewLaddusaw"
                    leavesPage={true}
                  />
                </li>
                <li>
                  <Link
                    text="@autoshi_nft"
                    url="https://twitter.com/aubtoshi_nft"
                    leavesPage={true}
                  />
                </li>
                <li>
                  <Link
                    text="@frankpepper12"
                    url="https://twitter.com/FrankPepper12"
                    leavesPage={true}
                  />
                </li>
                <li>
                  <Link text="@mamaxargs" url="https://twitter.com/mamaxargs" leavesPage={true} />
                </li>
                <li>
                  <Link
                    text="@nonodynamo_nft"
                    url="https://twitter.com/Nonodynamo_NFT"
                    leavesPage={true}
                  />
                </li>
                <li>
                  <Link
                    text="@reallyyummyfood"
                    url="https://twitter.com/reallyyummyfood"
                    leavesPage={true}
                  />
                </li>
                <li>
                  <Link
                    text="@robotfishgirl"
                    url="https://twitter.com/RobotFishGirl"
                    leavesPage={true}
                  />
                </li>
                <li>
                  <Link text="@yanzero_" url="https://twitter.com/yanzero_" leavesPage={true} />
                </li>
                <li>
                  <Link
                    text="@youtrusteth"
                    url="https://twitter.com/youtrusteth"
                    leavesPage={true}
                  />
                </li>
              </ul>
              <p>
                <p>
                  Every 11th FOODNOUN for the first 2 years of the project (FOODNOUN ids #1, #11,
                  #22, #33 and so on) will be automatically sent to the Kitchen Nouncil wallet to be
                  vested and shared among the Kitchen Nouncillors.
                </p>
              </p>
              <p>
                <p>
                  FOODNOUNDER and Kitchen Nouncil distributions don't interfere with the cadence of
                  24 hour auctions. FOODNOUNS are sent directly to the Nounder's Multisig and the
                  Kitchen Nouncil's Multisig, and auctions continue on schedule with the next
                  available FOODNOUN ID.
                </p>
              </p>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Col>
    </Section>
  );
};
export default Documentation;
