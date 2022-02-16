import { Avatar, Button, Card, Form, Input } from "antd";
import moment from "moment";
import Link from "next/link";
import router from "next/router";
import React, { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import useInput from "../hooks/useInput";
import { MODIFY_POST_REQUEST } from "../reducers/post";
import PostImages from "./PostImages";

const ModifyForm = ({ post, setModifyPost }) => {
    const { modifyPostLoading } = useSelector((state) => state.post);
    const [text, onChangeText, setText] = useInput(post.content);
    const dispatch = useDispatch();
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current.focus();
    }, [inputRef]);

    const onsubmit = useCallback(() => {
        if (!text || !text.trim()) {
            return alert("게시글을 작성하세요.");
        }
        dispatch({
            type: MODIFY_POST_REQUEST,
            data: {
                postId: post.id,
                content: text,
            },
        });
        setText("");
        setModifyPost("");
    }, [text, post]);

    return (
        <div style={{ marginBottom: 20 }}>
            <Card cover={post.Images[0] && <PostImages images={post.Images} />}>
                ,
                <div style={{ float: "right" }}>
                    {moment(post.createdAt).fromNow()}
                </div>
                <Card.Meta
                    avatar={
                        <Avatar>
                            <Link href={`/user/${post.User.id}`}>
                                <a>{post.User.nickname[0]}</a>
                            </Link>
                        </Avatar>
                    }
                    title={post.User.nickname}
                    description={
                        <Form
                            style={{ margin: "10px 0 20px" }}
                            encType="multipart/form-data"
                            onFinish={onsubmit}
                        >
                            <Input.TextArea
                                value={text}
                                onChange={onChangeText}
                                maxLength={140}
                                ref={inputRef}
                            />
                            <div style={{ marginBottom: 40 }}>
                                <Button
                                    type="primary"
                                    loading={modifyPostLoading}
                                    style={{ float: "right" }}
                                    htmlType="submit"
                                >
                                    짹
                                </Button>
                            </div>
                        </Form>
                    }
                />
            </Card>
        </div>
    );
};

export default ModifyForm;
