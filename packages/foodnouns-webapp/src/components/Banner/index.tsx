import classes from './Banner.module.css';
import Section from '../../layout/Section';
import { Col } from 'react-bootstrap';
import calendar_noun from '../../assets/calendar_noun.png';
import Noun from '../Noun';


const Banner = () => {
  return (
    <Section fullWidth={false} className={classes.bannerSection}>
      <Col lg={6}>
        <div className={classes.wrapper}>
          <h1>
            <p>ONE FOODNOUN,</p>
            <br />
            <p>EVERY BREAKFAST, LUNCH & DINNER</p>
            <br />
            <p>FOREVER.</p>
          </h1>
        </div>
      </Col>
      <Col lg={6}>
        <div style={{ padding: '2rem' }}>
          <Noun imgPath={calendar_noun} alt="noun" />
        </div>
      </Col>
    </Section>
  );
};

export default Banner;
