import React, { Fragment, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../layout/Spinner';
import PostItem from '../posts/PostItem';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import { getPost } from '../../reducers/post';

const Post = () => {
  const { id } = useParams();
  console.log('🚀 ~ Post ~ id:', id);
  const dispatch = useDispatch();
  const PostData = useSelector((state) => state.Post);
  const { loading, post } = PostData;
  console.log('🚀 ~ Post ~ post:', post);
  useEffect(() => {
    dispatch(getPost(id));
  }, []);
  return loading || post === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <Link to='/posts' className='btn'>
        Back To Posts
      </Link>
      <PostItem post={post} showActions={false} />
      <CommentForm postId={post._id} dispatch={dispatch} />
      <div className='comments'>
        {post.comments.map((comment) => (
          <CommentItem key={comment._id} postId={post._id} comment={comment} />
        ))}
      </div>
    </Fragment>
  );
};

export default Post;
