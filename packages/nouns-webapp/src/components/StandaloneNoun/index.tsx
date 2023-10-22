import { ImageData as foodNoundata, getNounData as getFoodNounData } from '@nouns/assets';
import { ImageData as nounData, getNounData } from '@nouns/assets-latest';
import { buildSVG as buildFoodNounSVG } from '@nouns/sdk';
import { buildSVG as buildNounSVG } from '@nouns/sdk-latest';
import { BigNumber as EthersBN } from 'ethers';
import { INounSeed, useNounSeed } from '../../wrappers/nounToken';
import Noun from '../Noun';
import { Link } from 'react-router-dom';
import classes from './StandaloneNoun.module.css';
import { useDispatch } from 'react-redux';
import { setOnDisplayAuctionNounId } from '../../state/slices/onDisplayNounAuction';
import nounClasses from '../Noun/Noun.module.css';

interface StandaloneNounProps {
  nounId: EthersBN;
  nounAuction: boolean;
}
interface StandaloneCircularNounProps {
  nounId: EthersBN;
  border?: boolean;
  nounAuction: boolean;
}

interface StandaloneNounWithSeedProps {
  nounId: EthersBN;
  onLoadSeed?: (seed: INounSeed) => void;
  shouldLinkToProfile: boolean;
  nounAuction: boolean;
}

export const getNoun = (nounId: string | EthersBN, seed: INounSeed, nounAuction: boolean) => {
  const id = nounId.toString();
  const name = (nounAuction ? 'Noun' : 'Foodnoun') + ` ${id}`;
  const description = `Foodnoun ${id} is a member of the Foodnouns DAO`;
  const { parts, background } = nounAuction ? getNounData(seed) : getFoodNounData(seed);
  const image = `data:image/svg+xml;base64,${btoa(nounAuction ? buildNounSVG(parts,
    nounData.palette, "d5d7e1") : buildFoodNounSVG(parts, foodNoundata.palette, "d5d7e1"))}`;

  return {
    name,
    description,
    image,
    parts,
  };
};

const StandaloneNoun: React.FC<StandaloneNounProps> = (props: StandaloneNounProps) => {
  const { nounId, nounAuction } = props;
  const seed = useNounSeed(nounId, nounAuction);
  const noun = seed && getNoun(nounId, seed, nounAuction);

  const dispatch = useDispatch();

  const onClickHandler = () => {
    dispatch(setOnDisplayAuctionNounId(nounId.toNumber()));
  };

  return (
    <Link
      to={'/noun/' + nounId.toString()}
      className={classes.clickableNoun}
      onClick={onClickHandler}
    >
      <Noun imgPath={noun ? noun.image : ''} alt={noun ? noun.description : 'Noun'} />
    </Link>
  );
};

export const StandaloneNounCircular: React.FC<StandaloneCircularNounProps> = (
  props: StandaloneCircularNounProps,
) => {
  const { nounId, border, nounAuction } = props;
  const seed = useNounSeed(nounId, nounAuction);
  const noun = seed && getNoun(nounId, seed, nounAuction);

  const dispatch = useDispatch();
  const onClickHandler = () => {
    dispatch(setOnDisplayAuctionNounId(nounId.toNumber()));
  };

  if (!seed || !nounId) return <Noun imgPath="" alt="Noun" />;

  return (
    <Link
      to={'/noun/' + nounId.toString()}
      className={classes.clickableNoun}
      onClick={onClickHandler}
    >
      <Noun
        imgPath={noun ? noun.image : ''}
        alt={noun ? noun.description : 'Noun'}
        wrapperClassName={nounClasses.circularNounWrapper}
        className={border ? nounClasses.circleWithBorder : nounClasses.circular}
      />
    </Link>
  );
};

export const StandaloneNounRoundedCorners: React.FC<StandaloneNounProps> = (
  props: StandaloneNounProps,
) => {
  const { nounId, nounAuction } = props;
  const seed = useNounSeed(nounId, nounAuction);
  const noun = seed && getNoun(nounId, seed, nounAuction);

  const dispatch = useDispatch();
  const onClickHandler = () => {
    dispatch(setOnDisplayAuctionNounId(nounId.toNumber()));
  };

  return (
    <Link
      to={'/noun/' + nounId.toString()}
      className={classes.clickableNoun}
      onClick={onClickHandler}
    >
      <Noun
        imgPath={noun ? noun.image : ''}
        alt={noun ? noun.description : 'Noun'}
        className={nounClasses.rounded}
      />
    </Link>
  );
};

export const StandaloneNounWithSeed: React.FC<StandaloneNounWithSeedProps> = (
  props: StandaloneNounWithSeedProps,
) => {
  const { nounId, onLoadSeed, shouldLinkToProfile, nounAuction } = props;

  const dispatch = useDispatch();
  const seed = useNounSeed(nounId, nounAuction);
  const seedIsInvalid = Object.values(seed || {}).every(v => v === 0);

  if (!seed || seedIsInvalid || !nounId || !onLoadSeed) return <Noun imgPath="" alt="Noun" />;

  onLoadSeed(seed);

  const onClickHandler = () => {
    dispatch(setOnDisplayAuctionNounId(nounId.toNumber()));
  };

  const { image, description, parts } = getNoun(nounId, seed, nounAuction);

  const noun = <Noun imgPath={image} alt={description} parts={parts} />;
  const nounWithLink = (
    <Link
      to={'/noun/' + nounId.toString()}
      className={classes.clickableNoun}
      onClick={onClickHandler}
    >
      {noun}
    </Link>
  );
  return shouldLinkToProfile ? nounWithLink : noun;
};

export default StandaloneNoun;
