import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppLayout from "../components/AppLayout";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import { LOAD_POSTS_REQUEST } from "../reducers/post";

// 어떤 Element가 화면(viewport)에 노출되었는지를 감지할 수 있는 API
import { useInView } from 'react-intersection-observer';

const Home = () => {
    const dispatch = useDispatch();
    const { me } = useSelector((state) => state.user);
    const { mainPosts, hasMorePosts, loadPostsLoading  } = useSelector((state) => state.post);
    const [ref, inView] = useInView();

    // 처음 게시물들 불러올 때
    useEffect(() => {
        dispatch({
            type: LOAD_POSTS_REQUEST,
        });
    }, []);

    useEffect(() => {
        if (inView && hasMorePosts && !loadPostsLoading) {
            // const lastId = mainPosts[mainPosts.length - 1]?.id;
            dispatch({
                type: LOAD_POSTS_REQUEST,
                // lastId,
            });
        }
    }, [inView, hasMorePosts, loadPostsLoading, mainPosts]);

    /*
        더 보여줄 게시물이 있고, 게시물을 보여주기 위한 로딩 중이 아닐 때
        + PostCard들 아래에 위치한 div가 화면에 보일 때(마지막 게시글을 봤다는 얘기)
        => inView가 true가 되면서 두 번째 useEffect가 작동함.
        => 마지막 게시글에 가까워질 때쯤 불러오도록 수정함.
    */
    return (
        <AppLayout>
            {me && <PostForm />}
            {mainPosts.map((post, i) => {
                    if (i === mainPosts.length - 3) {
                        return (
                            <>
                                <div ref={hasMorePosts && !loadPostsLoading ? ref : undefined} />
                                <PostCard key={post.id} post={post} />
                            </>
                        )
                    }
                    return <PostCard key={post.id} post={post} />
                })
            }
        </AppLayout>
    )
}

export default Home;