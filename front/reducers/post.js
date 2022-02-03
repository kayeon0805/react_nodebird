export const initialState = {
    mainPosts: [{
        id: 1,
        User: {
            id: 1,
            nickname: '가연',
        },
        content: '첫 번째 게시글 #우리집 #쿠키',
        Images: [{
            src: 'https://ifh.cc/g/UMbsKT.jpg'
        },
        {
            src: 'https://ifh.cc/g/A8KWUg.jpg'
        },
        {
            src: 'https://ifh.cc/g/19GyQ3.jpg'
        }],
        Comments: [{
            User: {
                nickname: 'nero',
            },
            content: '너무 귀엽다~!!',
        },{
            User: {
                nickname: 'catLover',
            },
            content: 'so cute♥',
        }]
    }],
    imagePaths: [],
    postAdded: false,
};

const ADD_POST = 'ADD_POST';
export const addPost = {
    type: ADD_POST
};

const dummyPost = {
    id: 2,
    content: '더미데이터입니다.',
    User: {
        id: 1,
        nickname: 'kayeon',
    },
    Images: [],
    Comments: [],
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_POST:
            return {
                ...state,
                mainPosts: [dummyPost, ...state.mainPosts],
                postAdded: true
            };
        default: 
            return state;
    }
};

export default reducer;