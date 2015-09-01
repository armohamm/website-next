import 'babel/polyfill';
import {Link} from 'react-router';
import styles from './style.css';
import DateStamp from '../dateStamp';

class PostPreview extends React.Component {
  render() {
    let {post} = this.props;
    return (
      <div>
        <DateStamp post={post} />
        <h3 className={styles.titleHeading}>
          <Link className={styles.titleAnchor} to={`/blog/${post.id}`}>
            {post.title}
          </Link>
        </h3>
        <p>
          {'by '}
          <Link className={styles.author} to={'/#'}>
           {`${post.author.firstName} ${post.author.lastName}`}
          </Link>
        </p>
        <p dangerouslySetInnerHTML={{__html: post.preview}}/>
        <Link className={styles.titleAnchor} to={`/blog/${post.id}`}>
          Read more...
        </Link>
      </div>
    );
  }
}

export default Relay.createContainer(PostPreview, {
  fragments: {
    post: () => Relay.QL`
      fragment on Post {
        id
        slug
        title
        author {
          firstName
          lastName
        }
        preview
        ${DateStamp.getFragment('post')}
      }
    `
  },
});
