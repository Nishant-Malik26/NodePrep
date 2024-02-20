import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAlertWithRemove } from './removeAlert';

const initialState = {
  post: null,
  posts: [],
  loading: true,
  error: {},
};

const Post = createSlice({
  name: 'post',
  initialState,
  reducers: {
    getPostSuccess: (state, action) => {
      return { ...state, post: action.payload, loading: false };
    },
    addPost: (state, action) => {
      return {
        ...state,
        posts: [action.payload, ...state.posts],
        loading: false,
      };
    },
    addComment: (state, action) => {
      return {
        ...state,
        post: {
          ...state.post,
          comments: [...state.post.comments, action.payload],
        },
        loading: false,
      };
    },
    deleteComment: (state, action) => {
      return {
        ...state,
        post: {
          ...state.post,
          comments: state.post.comments.filter(
            (comment) => comment._id !== action.payload
          ),
        },
        loading: false,
      };
    },

    getAllPostsSuccess: (state, action) => {
      return { ...state, posts: action.payload, loading: false };
    },
    updateLikes: (state, action) => {
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === action.payload.id
            ? { ...post, likes: action.payload.likes }
            : post
        ),
        loading: false,
      };
    },
    deletePostById: (state, action) => {
      return {
        ...state,
        posts: state.posts.filter((post) => post._id !== action.payload),
        loading: false,
      };
    },

    getPostFail: (state, action) => {
      return { ...state, error: action.payload, loading: false };
    },
  },
});

export default Post.reducer;
export const {
  getPostSuccess,
  getPostFail,
  updateLikes,
  deletePostById,
  addPost,
  getAllPostsSuccess,
  addComment,
  deleteComment,
} = Post.actions;

export const getPost = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`https://node-prep.vercel.app/api/posts/${id}`);
    dispatch(getPostSuccess(res.data));
  } catch (error) {
    dispatch(
      getPostFail({
        msg: error?.response?.statusText,
        status: error?.response?.status,
      })
    );
  }
};

export const getAllPosts = () => async (dispatch) => {
  try {
    const res = await axios.get('https://node-prep.vercel.app/api/posts');
    dispatch(getAllPostsSuccess(res.data));
  } catch (error) {
    dispatch(
      getPostFail({
        msg: error?.response?.statusText,
        status: error?.response?.status,
      })
    );
  }
};

export const likePost = (id) => async (dispatch) => {
  try {
    const res = await axios.put(
      `https://node-prep.vercel.app/api/posts/like/${id}`
    );
    dispatch(updateLikes({ id, likes: res.data }));
  } catch (error) {
    dispatch(
      getPostFail({
        msg: error?.response?.statusText,
        status: error?.response?.status,
      })
    );
  }
};

export const unlikePost = (id) => async (dispatch) => {
  try {
    const res = await axios.put(
      `https://node-prep.vercel.app/api/posts/unlike/${id}`
    );
    dispatch(updateLikes({ id, likes: res.data }));
  } catch (error) {
    dispatch(
      getPostFail({
        msg: error?.response?.statusText,
        status: error?.response?.status,
      })
    );
  }
};

export const deletePost = (id) => async (dispatch) => {
  try {
    await axios.delete(`https://node-prep.vercel.app/api/posts/${id}`);
    console.log('🚀 ~ deletePost ~ id:', id);
    dispatch(deletePostById(id));
  } catch (error) {
    dispatch(
      getPostFail({
        msg: error?.response?.statusText,
        status: error?.response?.status,
      })
    );
  }
};

export const createPost = (formData) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const res = await axios.post(
      'https://node-prep.vercel.app/api/posts',
      formData,
      config
    );
    dispatch(addPost(res.data));
    dispatch(setAlertWithRemove('Post Created Successfully', 'success'));
  } catch (error) {
    const errors = error.response.data.errors;
    if (errors) {
      errors.forEach((element) => {
        dispatch(setAlertWithRemove({ msg: element.msg, alertType: 'danger' }));
      });
    }
    dispatch(
      getPostFail({
        msg: error?.response?.statusText,
        status: error?.response?.status,
      })
    );
  }
};

export const addCommentPost = (postId, formData) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const res = await axios.post(
      `https://node-prep.vercel.app/api/posts/comment/${postId}`,
      formData,
      config
    );
    dispatch(addComment(res.data));
    dispatch(setAlertWithRemove('Comment Added Successfully', 'success'));
  } catch (error) {
    dispatch(
      getPostFail({
        msg: error?.response?.statusText,
        status: error?.response?.status,
      })
    );
  }
};

export const deleteCommentPost = (postId, commentId) => async (dispatch) => {
  try {
    await axios.delete(
      `https://node-prep.vercel.app/api/posts/comment/${postId}/${commentId}`
    );
    dispatch(deleteComment(commentId));
    dispatch(setAlertWithRemove('Comment Deleted Successfully', 'success'));
  } catch (error) {
    dispatch(
      getPostFail({
        msg: error?.response?.statusText,
        status: error?.response?.status,
      })
    );
  }
};
