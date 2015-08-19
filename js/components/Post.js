import 'babel/polyfill';

class Post extends React.Component {
  render() {
    let {post} = this.props;
    return (
      <div>
        <h1>{post.title}</h1>
        <h3>By: {`${post.author.firstName} ${post.author.lastName}`}</h3>
        <div dangerouslySetInnerHTML={ { __html: post.body } } />
        <p>Published at: {post.publishedAt}</p>
      </div>
    );
  }
}

export default Relay.createContainer(Post, {
  fragments: {
    post: () => Relay.QL`
      fragment on Post {
        title
        author {
          firstName
          lastName
        }
        body
        publishedAt
      }
    `
  },
});
