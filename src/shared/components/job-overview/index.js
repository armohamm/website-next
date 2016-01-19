import React from 'react';
import styles from './style.css';
import HtmlToReact from 'html-to-react';

export default function JobOverview ({href, title, body}) {
  const htmlToReactParser = new HtmlToReact.Parser(React);
  const paragraphs = htmlToReactParser.parse('<div>' + body + '</div>');
  return (
    <div className={styles.note}>
      <a className={styles.title} href={href}>{title}<span className={styles.icon}></span></a>
      {paragraphs}
    </div>
  );
}

JobOverview.propTypes = {
  body: React.PropTypes.string.isRequired,
  href: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired
};
