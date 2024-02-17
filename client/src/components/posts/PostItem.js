import React from 'react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { likePost, unlikePost, deletePost } from '../../reducers/post';
import { useDispatch, useSelector } from 'react-redux';
import { FaRegThumbsUp, FaRegThumbsDown, FaTimes } from 'react-icons/fa';

const PostItem = (props) => {
  const {
    showActions,
    post: { _id, text, name, avatar, user, likes, comments, date },
  } = props;
  console.log('🚀 ~ PostItem ~ likes:', likes);
  const dispatch = useDispatch();
  const AuthData = useSelector((state) => state.Auth);
  console.log('🚀 ~ PostItem ~ AuthData:', AuthData);
  return (
    <div className='post bg-white p-1 my-1'>
      <div>
        <Link to={`/profile/${user}`}>
          <img className='round-img' src={avatar} alt='' />
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        <p className='my-1'>{text}</p>
        <p className='post-date'>
          Posted on <Moment format='DD/MM/YYYY HH:MM'>{date}</Moment>
        </p>
        {showActions && (
          <>
            <button
              type='button'
              onClick={() => dispatch(likePost(_id))}
              className='btn btn-light'
            >
              <FaRegThumbsUp />
              {likes.length > 0 && <span> {likes.length}</span>}
            </button>
            <button
              type='button'
              className='btn btn-light'
              onClick={() => dispatch(unlikePost(_id))}
            >
              <FaRegThumbsDown />
            </button>
            <Link to={`/posts/${_id}`} className='btn btn-primary'>
              Discussion{' '}
              {comments.length > 0 && (
                <span className='comment-count'>{comments.length}</span>
              )}
            </Link>
            {!AuthData.loading && user === AuthData.user.user._id && (
              <button
                type='button'
                className='btn btn-danger'
                onClick={() => dispatch(deletePost(_id))}
              >
                <FaTimes />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PostItem;
