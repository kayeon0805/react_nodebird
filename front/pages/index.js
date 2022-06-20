import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppLayout from "../components/AppLayout";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import { LOAD_POSTS_REQUEST } from "../reducers/post";
import { LOAD_MY_INFO_REQUEST } from "../reducers/user";
import wrapper from "../store/configureStore";
import { END } from "redux-saga";
import styled from "styled-components";

// 어떤 Element가 화면(viewport)에 노출되었는지를 감지할 수 있는 API
import { useInView } from "react-intersection-observer";
import axios from "axios";

const Message = styled.div`
    border: 1px solid black;
    height: 100;
    line-height: 7;
    text-align: center;
`;

const Home = () => {
    const dispatch = useDispatch();
    const { me } = useSelector((state) => state.user);
    const {
        mainPosts,
        hasMorePosts,
        loadPostsLoading,
        retweetError,
        searchInputDone,
        searchPosts,
    } = useSelector((state) => state.post);
    const [ref, inView] = useInView();

    useEffect(() => {
        if (retweetError) {
            alert(retweetError);
        }
    }, [retweetError]);

    useEffect(() => {
        if (inView && hasMorePosts && !loadPostsLoading) {
            const lastId = mainPosts[mainPosts.length - 1]?.id;
            dispatch({
                type: LOAD_POSTS_REQUEST,
                lastId,
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
            {searchInputDone && searchPosts.length < 1 && (
                <Message>게시글이 존재하지 않습니다.</Message>
            )}
            {searchInputDone
                ? searchPosts.map((post, i) => {
                      <PostCard key={post.id} post={post} />;
                  })
                : mainPosts.map((post, i) => {
                      if (i === mainPosts.length - 3) {
                          return (
                              <>
                                  <div
                                      ref={
                                          hasMorePosts && !loadPostsLoading
                                              ? ref
                                              : undefined
                                      }
                                  />

                                  <PostCard key={post.id} post={post} />
                              </>
                          );
                      }
                      return <PostCard key={post.id} post={post} />;
                  })}
        </AppLayout>
    );
};

// Home보다 먼저 실행하는 부분
export const getServerSideProps = wrapper.getServerSideProps(
    // context: 요청/응답과 SSR에 관련된 정보가 들어있는 객체
    async (context) => {
        // 서버쪽으로 쿠키 전달
        const cookie = context.req ? context.req.headers.cookie : "";
        // 직전에 로그인한 사용자의 쿠키가 프론트 서버에 남아있음
        // 다른 사람이 새롭게 요청을 하기 전에 초기화
        axios.defaults.headers.Cookie = "";
        if (context.req && cookie) {
            axios.defaults.headers.Cookie = cookie;
        }

        context.store.dispatch({
            type: LOAD_MY_INFO_REQUEST,
        });
        context.store.dispatch({
            type: LOAD_POSTS_REQUEST,
        });
        // REQUEST가 SUCCESS로 바뀔 때까지 기다려줌.
        context.store.dispatch(END);
        await context.store.sagaTask.toPromise();
    }
);

export default Home;
