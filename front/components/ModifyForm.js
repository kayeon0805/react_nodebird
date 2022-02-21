import { Button, Card, Form, Input } from "antd";
import moment from "moment";
import React, { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import useInput from "../hooks/useInput";
import { MODIFY_POST_REQUEST, SHOW_IMAGE } from "../reducers/post";
import "moment/locale/ko";
moment.locale("ko");

const ModifyForm = ({ post, setModifyPost }) => {
    const { modifyImagePaths, modifyPostLoading } = useSelector(
        (state) => state.post
    );
    const [text, onChangeText, setText] = useInput(post.content);
    const dispatch = useDispatch();
    const inputRef = useRef(null);

    useEffect(() => {
        dispatch({
            type: SHOW_IMAGE,
            data: post.Images,
        });
    }, []);

    const onsubmit = useCallback(() => {
        if (!text || !text.trim()) {
            return alert("게시글을 작성하세요.");
        }
        const formData = new FormData();
        modifyImagePaths.forEach((p) => {
            formData.append("image", p);
        });
        formData.append("content", text);
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
            <Card>
                {modifyImagePaths.map((v, i) => (
                    <div key={v.src} style={{ display: "inline-block" }}>
                        <img
                            src={v.src}
                            style={{ width: "200px" }}
                            alt={v.src}
                        />
                    </div>
                ))}
                <div style={{ float: "right" }}>
                    {moment(post.createdAt).fromNow()}
                </div>
                <Card.Meta
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
