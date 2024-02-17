import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../layout/Spinner';
import PostItem from './PostItem';
import PostForm from './PostForm';
import { getAllPosts } from '../../reducers/post';

const Posts = () => {
  const dispatch = useDispatch();
  const PostData = useSelector((state) => state.Post);
  const { posts, loading } = PostData;
  console.log('🚀 ~ Posts ~ PostData:', PostData);
  useEffect(() => {
    dispatch(getAllPosts());
  }, []);
  return loading ? (
    <Spinner />
  ) : (
    <>
      <h1 className='large text-primary'>Posts</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Welcome to the community!
      </p>
      <PostForm />
      <div className='posts'>
        {posts.map((post) => (
          <PostItem key={post._id} post={post} showActions={true} />
        ))}
      </div>
    </>
  );
};

export default Posts;
