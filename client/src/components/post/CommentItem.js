import React from 'react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCommentPost } from '../../reducers/post';
import { FaTimes } from 'react-icons/fa';

const CommentItem = ({
  postId,
  comment: { _id, text, avatar, name, user, date },
}) => {
  const dispatch = useDispatch();
  const AuthData = useSelector((state) => state.Auth);
  console.log('🚀 ~ AuthData:', AuthData);
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
          Commented on <Moment format='DD/MM/YYYY HH:MM'>{date}</Moment>
        </p>
        {!AuthData.loading && AuthData.user.user._id === user && (
          <button
            type='button'
            className='btn btn-danger'
            onClick={(e) => dispatch(deleteCommentPost(postId, _id))}
          >
            <FaTimes />
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
