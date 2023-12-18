import classes from './Link.module.css';

const Link = (props: {
  text: any;
  url: any;
  leavesPage: any;
}) => {
  const { text, url, leavesPage } = props;
  return (
    <a
      className={classes.link}
      href={url}
      target={leavesPage ? '_blank' : '_self'}
      rel="noreferrer"
    >
      {text}
    </a>
  );
};

export default Link;
