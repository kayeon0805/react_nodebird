import produce from "../util/produce";

export const initialState = {
    mainPosts: [],
    searchPosts: [],
    imagePaths: [],
    modifyImagePaths: [],
    singlePost: null,
    hasMorePosts: true,
    uploadImagesLoading: false,
    uploadImagesDone: false,
    uploadImagesError: null,
    unlikePostLoading: false,
    unlikePostDone: false,
    unlikePostError: null,
    likePostLoading: false,
    likePostDone: false,
    likePostError: null,
    loadPostLoading: false,
    loadPostDone: false,
    loadPostError: null,
    loadPostsLoading: false,
    loadPostsDone: false,
    loadPostsError: null,
    addPostLoading: false,
    addPostDone: false,
    addPostError: null,
    addCommentLoading: false,
    addCommentDone: false,
    addCommentError: null,
    removePostLoading: false,
    removePostDone: false,
    removePostError: null,
    modifyPostLoading: false,
    modifyPostDone: false,
    modifyPostError: null,
    retweetLoading: false,
    retweetDone: false,
    retweetError: null,
    searchInputLoading: false,
    searchInputDone: false,
    searchInputError: null,
};

export const UPLOAD_IMAGES_REQUEST = "UPLOAD_IMAGES_REQUEST";
export const UPLOAD_IMAGES_SUCCESS = "UPLOAD_IMAGES_SUCCESS";
export const UPLOAD_IMAGES_FAILURE = "UPLOAD_IMAGES_FAILURE";

export const LIKE_POST_REQUEST = "LIKE_POST_REQUEST";
export const LIKE_POST_SUCCESS = "LIKE_POST_SUCCESS";
export const LIKE_POST_FAILURE = "LIKE_POST_FAILURE";

export const UNLIKE_POST_REQUEST = "UNLIKE_POST_REQUEST";
export const UNLIKE_POST_SUCCESS = "UNLIKE_POST_SUCCESS";
export const UNLIKE_POST_FAILURE = "UNLIKE_POST_FAILURE";

export const LOAD_USER_POSTS_REQUEST = "LOAD_USER_POSTS_REQUEST";
export const LOAD_USER_POSTS_SUCCESS = "LOAD_USER_POSTS_SUCCESS";
export const LOAD_USER_POSTS_FAILURE = "LOAD_USER_POSTS_FAILURE";

export const LOAD_HASHTAG_POSTS_REQUEST = "LOAD_HASHTAG_POSTS_REQUEST";
export const LOAD_HASHTAG_POSTS_SUCCESS = "LOAD_HASHTAG_POSTS_SUCCESS";
export const LOAD_HASHTAG_POSTS_FAILURE = "LOAD_HASHTAG_POSTS_FAILURE";

export const LOAD_POSTS_REQUEST = "LOAD_POSTS_REQUEST";
export const LOAD_POSTS_SUCCESS = "LOAD_POSTS_SUCCESS";
export const LOAD_POSTS_FAILURE = "LOAD_POSTS_FAILURE";

export const LOAD_POST_REQUEST = "LOAD_POST_REQUEST";
export const LOAD_POST_SUCCESS = "LOAD_POST_SUCCESS";
export const LOAD_POST_FAILURE = "LOAD_POST_FAILURE";

export const ADD_POST_REQUEST = "ADD_POST_REQUEST";
export const ADD_POST_SUCCESS = "ADD_POST_SUCCESS";
export const ADD_POST_FAILURE = "ADD_POST_FAILURE";

export const ADD_COMMENT_REQUEST = "ADD_COMMENT_REQUEST";
export const ADD_COMMENT_SUCCESS = "ADD_COMMENT_SUCCESS";
export const ADD_COMMENT_FAILURE = "ADD_COMMENT_FAILURE";

export const REMOVE_POST_REQUEST = "REMOVE_POST_REQUEST";
export const REMOVE_POST_SUCCESS = "REMOVE_POST_SUCCESS";
export const REMOVE_POST_FAILURE = "REMOVE_POST_FAILURE";

export const MODIFY_POST_REQUEST = "MODIFY_POST_REQUEST";
export const MODIFY_POST_SUCCESS = "MODIFY_POST_SUCCESS";
export const MODIFY_POST_FAILURE = "MODIFY_POST_FAILURE";

export const RETWEET_REQUEST = "RETWEET_REQUEST";
export const RETWEET_SUCCESS = "RETWEET_SUCCESS";
export const RETWEET_FAILURE = "RETWEET_FAILURE";

export const SEARCH_INPUT_REQUEST = "SEARCH_INPUT_REQUEST";
export const SEARCH_INPUT_SUCCESS = "SEARCH_INPUT_SUCCESS";
export const SEARCH_INPUT_FAILURE = "SEARCH_INPUT_FAILURE";

export const REMOVE_IMAGE = "REMOVE_IMAGE";

export const SHOW_IMAGE = "SHOW_IMAGE";

export const addComment = (data) => ({
    type: ADD_COMMENT_REQUEST,
    data,
});

const reducer = (state = initialState, action) => {
    return produce(state, (draft) => {
        switch (action.type) {
            case SHOW_IMAGE:
                draft.modifyImagePaths = action.data;
                break;
            case REMOVE_IMAGE:
                draft.imagePaths = draft.imagePaths.filter(
                    (v, i) => i !== action.data
                );
                break;
            case SEARCH_INPUT_REQUEST:
                draft.searchInputLoading = true;
                draft.searchInputDone = false;
                draft.searchInputError = null;
                break;
            case SEARCH_INPUT_SUCCESS: {
                draft.searchPosts = action.data;
                draft.searchInputLoading = false;
                draft.searchInputDone = true;
                break;
            }
            case SEARCH_INPUT_FAILURE:
                draft.searchInputLoading = false;
                draft.searchInputError = action.error;
                break;
            case RETWEET_REQUEST:
                draft.retweetLoading = true;
                draft.retweetDone = false;
                draft.retweetError = null;
                break;
            case RETWEET_SUCCESS: {
                draft.mainPosts.unshift(action.data);
                draft.retweetLoading = false;
                draft.retweetDone = true;
                break;
            }
            case RETWEET_FAILURE:
                draft.retweetLoading = false;
                draft.retweetError = action.error;
                break;
            case UPLOAD_IMAGES_REQUEST:
                draft.uploadImagesLoading = true;
                draft.uploadImagesDone = false;
                draft.uploadImagesError = null;
                break;
            case UPLOAD_IMAGES_SUCCESS: {
                draft.imagePaths = draft.imagePaths.concat(action.data);
                draft.uploadImagesLoading = false;
                draft.uploadImagesDone = true;
                break;
            }
            case UPLOAD_IMAGES_FAILURE:
                draft.uploadImagesLoading = false;
                draft.uploadImagesError = action.error;
                break;
            case LIKE_POST_REQUEST:
                draft.likePostLoading = true;
                draft.likePostDone = false;
                draft.likePostError = null;
                break;
            case LIKE_POST_SUCCESS: {
                const post = draft.mainPosts.find(
                    (v) => v.id === action.data.postId
                );
                post.Likers.push({ id: action.data.UserId });
                draft.likePostLoading = false;
                draft.likePostDone = true;
                break;
            }
            case LIKE_POST_FAILURE:
                draft.likePostLoading = false;
                draft.likePostError = action.error;
                break;
            case UNLIKE_POST_REQUEST:
                draft.unlikePostLoading = true;
                draft.unlikePostDone = false;
                draft.unlikePostError = null;
                break;
            case UNLIKE_POST_SUCCESS: {
                const post = draft.mainPosts.find(
                    (v) => v.id === action.data.postId
                );
                post.Likers = post.Likers.filter(
                    (v) => v.id !== action.data.UserId
                );
                draft.unlikePostLoading = false;
                draft.unlikePostDone = true;
                break;
            }
            case UNLIKE_POST_FAILURE:
                draft.unlikePostLoading = false;
                draft.unlikePostError = action.error;
                break;
            case LOAD_POST_REQUEST:
                draft.loadPostLoading = true;
                draft.loadPostDone = false;
                draft.loadPostError = null;
                break;
            case LOAD_POST_SUCCESS:
                draft.loadPostLoading = false;
                draft.loadPostDone = true;
                draft.singlePost = action.data;
                console.log(draft.singlePost);
                break;
            case LOAD_POST_FAILURE:
                draft.loadPostLoading = false;
                draft.loadPostError = action.error;
                break;
            case LOAD_HASHTAG_POSTS_REQUEST:
            case LOAD_USER_POSTS_REQUEST:
            case LOAD_POSTS_REQUEST:
                draft.loadPostsLoading = true;
                draft.loadPostsDone = false;
                draft.loadPostsError = null;
                break;
            case LOAD_USER_POSTS_SUCCESS:
            case LOAD_HASHTAG_POSTS_SUCCESS:
            case LOAD_POSTS_SUCCESS:
                draft.loadPostsLoading = false;
                draft.loadPostsDone = true;
                draft.mainPosts = draft.mainPosts.concat(action.data);
                draft.hasMorePosts = action.data.length === 10;
                break;
            case LOAD_USER_POSTS_FAILURE:
            case LOAD_HASHTAG_POSTS_FAILURE:
            case LOAD_POSTS_FAILURE:
                draft.loadPostsLoading = false;
                draft.loadPostsError = action.error;
                break;
            case ADD_POST_REQUEST:
                draft.addPostLoading = true;
                draft.addPostDone = false;
                draft.addPostError = null;
                break;
            case ADD_POST_SUCCESS:
                draft.mainPosts.unshift(action.data);
                draft.imagePaths = [];
                draft.addPostLoading = false;
                draft.addPostDone = true;
                break;
            case ADD_POST_FAILURE:
                draft.addPostLoading = false;
                draft.addPostError = action.error;
                break;
            case REMOVE_POST_REQUEST:
                draft.removePostLoading = true;
                draft.removePostDone = false;
                draft.removePostError = null;
                break;
            case REMOVE_POST_SUCCESS:
                draft.removePostLoading = false;
                draft.removePostDone = true;
                draft.mainPosts = draft.mainPosts.filter(
                    (v) => v.id !== action.data.PostId
                );
                break;
            case REMOVE_POST_FAILURE:
                draft.removePostLoading = false;
                draft.removePostError = action.error;
                break;
            case MODIFY_POST_REQUEST:
                draft.modifyPostLoading = true;
                draft.modifyPostDone = false;
                draft.modifyPostError = null;
                break;
            case MODIFY_POST_SUCCESS: {
                const index = draft.mainPosts.findIndex(
                    (v) => v.id === action.data.id
                );
                draft.modifyPostLoading = false;
                draft.modifyPostDone = true;
                draft.mainPosts[index] = action.data;
                break;
            }
            case MODIFY_POST_FAILURE:
                draft.modifyPostLoading = false;
                draft.modifyPostError = action.error;
                break;
            case ADD_COMMENT_REQUEST:
                draft.addCommentLoading = true;
                draft.addCommentDone = false;
                draft.addCommentError = null;
                break;
            case ADD_COMMENT_SUCCESS: {
                // 댓글을 단 게시물을 찾음.
                const post = draft.mainPosts.find(
                    (v) => v.id === action.data.PostId
                );
                post.Comments.unshift(action.data);
                draft.addCommentLoading = false;
                draft.addCommentDone = true;
                break;
            }
            case ADD_COMMENT_FAILURE:
                draft.addCommentLoading = false;
                draft.addCommentError = action.error;
                break;
            default:
                break;
        }
    });
};

export default reducer;
