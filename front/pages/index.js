import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppLayout from "../components/AppLayout";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import { LOAD_POSTS_REQUEST } from "../reducers/post";
import { useInView } from 'react-intersection-observer';

const Home = () => {
    const dispatch = useDispatch();
    const { me } = useSelector((state) => state.user);
    const { mainPosts, hasMorePost, loadPostsLoading  } = useSelector((state) => state.post);
    const [ref, inView] = useInView();

    useEffect(() => {
        dispatch({
            type: LOAD_POSTS_REQUEST,
        })
    }, []);
    
    useEffect(() => {
        if (inView && hasMorePost && !loadPostsLoading) {
            const lastId = mainPosts[mainPosts.length - 1]?.id;
            dispatch({
                type: LOAD_POSTS_REQUEST,
                lastId,
            });
        }
    }, [inView, hasMorePost, loadPostsLoading, mainPosts]);

    return (
        <AppLayout>
            {me && <PostForm />}
            {mainPosts.map((post) => <PostCard key={post.id} post={post} />)}
            <div ref={hasMorePost && !loadPostsLoading ? ref : undefined} />
        </AppLayout>
    )
}

export default Home;