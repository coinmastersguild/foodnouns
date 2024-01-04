import classes from './NounDivider.module.css';
import Section from '../../layout/Section';
import { Col } from 'react-bootstrap';
import calendar_noun from '../../assets/calendar_noun.png';
import Noun from '../Noun';


const NounDivider = () => {
    return (
        <div className={classes.wrapper}>
            <p>FOODNOUNS is a tasty spork of Nouns. Bid on the current NounsDAO auction below! Learn more at <a href="https://nouns.wtf/">nouns.wtf</a> ⌐◨-◨</p>
        </div>
    );
};

export default NounDivider;
