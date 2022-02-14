import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { END } from "redux-saga";
import Head from "next/head";
import { useRouter } from "next/router";
import { Card } from "antd";
import Avatar from "antd/lib/avatar/avatar";
import axios from "axios";
import { useInView } from "react-intersection-observer";
import { LOAD_HASHTAG_POSTS_REQUEST } from "../../reducers/post";
import AppLayout from "../../components/AppLayout";
import PostCard from "../../components/PostCard";
import wrapper from "../../store/configureStore";
import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";

const Hashtag = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { tag } = router.query;
    const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector(
        (state) => state.post
    );
    const { userInfo, me } = useSelector((state) => state.user);
    const [ref, inView] = useInView();

    useEffect(() => {
        if (inView && hasMorePosts && !loadPostsLoading) {
            const lastId = mainPosts[mainPosts.length - 1]?.id;
            dispatch({
                type: LOAD_HASHTAG_POSTS_REQUEST,
                lastId,
                data: tag,
            });
        }
    }, [inView, hasMorePosts, loadPostsLoading, mainPosts, tag]);

    return (
        <AppLayout>
            {mainPosts.map((c) => (
                <PostCard key={c.id} post={c} />
            ))}
        </AppLayout>
    );
};

export const getServerSideProps = wrapper.getServerSideProps(
    async (context) => {
        const cookie = context.req ? context.req.headers.cookie : "";
        axios.defaults.headers.Cookie = "";
        if (context.req && cookie) {
            axios.defaults.headers.Cookie = cookie;
        }

        context.store.dispatch({
            type: LOAD_MY_INFO_REQUEST,
        });
        context.store.dispatch({
            type: LOAD_HASHTAG_POSTS_REQUEST,
            data: context.params.tag,
        });
        context.store.dispatch(END);
        await context.store.sagaTask.toPromise();
    }
);

export default Hashtag;
