import { Button, Input } from "antd";
import Form from "antd/lib/form/Form";
import router from "next/router";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useInput from "../hooks/useInput";
import { MODIFY_POST_REQUEST } from "../reducers/post";

const ModifyForm = ({ post, setModifyPost }) => {
    const { modifyPostLoading } = useSelector((state) => state.post);
    const [text, onChangeText, setText] = useInput(post.content);
    const dispatch = useDispatch();

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
        <Form
            style={{ margin: "10px 0 20px" }}
            encType="multipart/form-data"
            onFinish={onsubmit}
        >
            <Input.TextArea
                value={text}
                onChange={onChangeText}
                maxLength={140}
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
    );
};

export default ModifyForm;
