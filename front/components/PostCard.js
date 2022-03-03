import { Avatar, Button, Card, Comment, List, Popover } from "antd";
import React, { useCallback, useState } from "react";
import {
    EllipsisOutlined,
    HeartOutlined,
    MessageOutlined,
    RetweetOutlined,
    HeartTwoTone,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import PostImages from "./PostImages";
import CommentForm from "./CommentForm";
import PostCardContent from "./PostCardContent";
import {
    REMOVE_POST_REQUEST,
    LIKE_POST_REQUEST,
    UNLIKE_POST_REQUEST,
    RETWEET_REQUEST,
} from "../reducers/post";
import FollowButton from "./FollowButton";
import Link from "next/link";
import moment from "moment";
import ModifyForm from "./ModifyForm";
import "moment/locale/ko";
moment.locale("ko");

const PostCard = ({ post }) => {
    const dispatch = useDispatch();
    const { removePostLoading } = useSelector((state) => state.post);
    const [commentFormOpened, setCommentFormOpened] = useState(false);
    const id = useSelector((state) => state.user.me?.id);
    const [modifyPost, setModifyPost] = useState("");

    const onLike = useCallback(() => {
        if (!id) {
            return alert("로그인이 필요합니다.");
        }
        return dispatch({
            type: LIKE_POST_REQUEST,
            data: post.id,
        });
    }, []);

    const onUnLike = useCallback(() => {
        if (!id) {
            return alert("로그인이 필요합니다.");
        }
        return dispatch({
            type: UNLIKE_POST_REQUEST,
            data: post.id,
        });
    }, []);

    const onToggleComment = useCallback(() => {
        setCommentFormOpened((prev) => !prev);
    }, []);

    const onRemovePost = useCallback(() => {
        if (!id) {
            return alert("로그인이 필요합니다.");
        }
        return dispatch({
            type: REMOVE_POST_REQUEST,
            data: post.id,
        });
    }, []);

    const onRetweet = useCallback(() => {
        if (!id) {
            return alert("로그인이 필요합니다.");
        }
        return dispatch({
            type: RETWEET_REQUEST,
            data: post.id,
        });
    }, [id]);

    const onClickModifyPost = useCallback((post) => {
        setModifyPost(post);
    }, []);

    if (modifyPost) {
        return <ModifyForm post={modifyPost} setModifyPost={setModifyPost} />;
    }

    const liked = post.Likers.find((v) => v.id === id);
    if (!modifyPost) {
        return (
            <div style={{ marginBottom: 20 }}>
                <Card
                    cover={
                        post.Images[0] && <PostImages images={post.Images} />
                    }
                    actions={[
                        <RetweetOutlined key="retweet" onClick={onRetweet} />,
                        liked ? (
                            <HeartTwoTone
                                twoToneColor="#eb2f96"
                                key="heart"
                                onClick={onUnLike}
                            />
                        ) : (
                            <HeartOutlined key="heart" onClick={onLike} />
                        ),
                        <MessageOutlined
                            key="comment"
                            onClick={onToggleComment}
                        />,
                        <Popover
                            key="more"
                            content={
                                <Button.Group>
                                    {id && post.User.id === id ? (
                                        <>
                                            {!post.RetweetId && (
                                                <Button
                                                    onClick={() =>
                                                        onClickModifyPost(post)
                                                    }
                                                >
                                                    수정
                                                </Button>
                                            )}
                                            <Button
                                                type="danger"
                                                loading={removePostLoading}
                                                onClick={onRemovePost}
                                            >
                                                삭제
                                            </Button>
                                        </>
                                    ) : (
                                        <Button>신고</Button>
                                    )}
                                </Button.Group>
                            }
                        >
                            <EllipsisOutlined />
                        </Popover>,
                    ]}
                    title={
                        post.RetweetId
                            ? `${post.User.nickname}님이 리트윗하셨습니다.`
                            : null
                    }
                    extra={id && <FollowButton post={post} />}
                >
                    {post.RetweetId && post.Retweet ? (
                        <Card
                            cover={
                                post.Retweet.Images[0] && (
                                    <PostImages images={post.Retweet.Images} />
                                )
                            }
                        >
                            <div style={{ float: "right" }}>
                                {moment(post.createdAt).fromNow()}
                            </div>
                            <Card.Meta
                                avatar={
                                    <Avatar>
                                        <Link
                                            href={`/user/${post.Retweet.User.id}`}
                                            prefetch={false}
                                        >
                                            <a style={{ color: "white" }}>
                                                {post.Retweet.User.nickname[0]}
                                            </a>
                                        </Link>
                                    </Avatar>
                                }
                                title={post.Retweet.User.nickname}
                                description={
                                    <PostCardContent
                                        postData={post.Retweet.content}
                                    />
                                }
                            />
                        </Card>
                    ) : (
                        <>
                            <div style={{ float: "right" }}>
                                {moment(post.createdAt).fromNow()}
                            </div>
                            <Card.Meta
                                avatar={
                                    <Avatar>
                                        <Link
                                            href={`/user/${post.User.id}`}
                                            prefetch={false}
                                        >
                                            <a style={{ color: "white" }}>
                                                {post.User.nickname[0]}
                                            </a>
                                        </Link>
                                    </Avatar>
                                }
                                title={post.User.nickname}
                                description={
                                    <PostCardContent postData={post.content} />
                                }
                            />
                        </>
                    )}
                </Card>
                {commentFormOpened && (
                    <div>
                        <CommentForm post={post} />
                        <List
                            header={`${post.Comments.length}개의 댓글`}
                            itemLayout="horizontal"
                            dataSource={post.Comments}
                            renderItem={(item) => (
                                <li>
                                    <Comment
                                        author={item.User.nickname}
                                        avatar={
                                            <Avatar>
                                                <Link
                                                    href={`/user/${item.User.id}`}
                                                    prefetch={false}
                                                >
                                                    <a
                                                        style={{
                                                            color: "white",
                                                        }}
                                                    >
                                                        {post.User.nickname[0]}
                                                    </a>
                                                </Link>
                                            </Avatar>
                                        }
                                        content={item.content}
                                    />
                                </li>
                            )}
                        />
                    </div>
                )}
            </div>
        );
    }
};
PostCard.propTypes = {
    post: PropTypes.shape({
        id: PropTypes.number,
        User: PropTypes.object,
        content: PropTypes.string,
        createdAt: PropTypes.string,
        Comments: PropTypes.arrayOf(PropTypes.object),
        Images: PropTypes.arrayOf(PropTypes.object),
        Likers: PropTypes.arrayOf(PropTypes.object),
        RetweetId: PropTypes.number,
        Retweet: PropTypes.objectOf(PropTypes.any),
    }).isRequired,
};

export default PostCard;
