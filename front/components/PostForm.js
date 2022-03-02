import React, { useCallback, useEffect, useRef } from "react";
import { Button, Form, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import useInput from "../hooks/useInput";
import {
    UPLOAD_IMAGES_REQUEST,
    REMOVE_IMAGE,
    ADD_POST_REQUEST,
} from "../reducers/post";

const PostForm = () => {
    const { imagePaths, addPostDone, addPostLoading } = useSelector(
        (state) => state.post
    );
    const [text, onChangeText, setText] = useInput("");
    const imageInput = useRef();
    const dispatch = useDispatch();

    useEffect(() => {
        if (addPostDone) {
            setText("");
        }
    }, [addPostDone]);

    const onSubmit = useCallback(() => {
        if (!text || !text.trim()) {
            return alert("게시글을 작성하세요.");
        }
        const formData = new FormData();
        imagePaths.forEach((p) => {
            formData.append("image", p);
        });
        formData.append("content", text);
        return dispatch({
            type: ADD_POST_REQUEST,
            data: formData,
        });
    }, [text, imagePaths]);

    const onClickImageUpload = useCallback(() => {
        imageInput.current.click();
    }, [imageInput.current]);

    const onchangeImages = useCallback((e) => {
        const imageFormData = new FormData();
        // FormData를 배열로 만들기 위함.
        // e.target.files => 유사배열 / f => 배열의 원소
        [].forEach.call(e.target.files, (f) => {
            // routes/post => upload.array('image') 이름 맞춰줘야 함.
            imageFormData.append("image", f);
        });
        dispatch({
            type: UPLOAD_IMAGES_REQUEST,
            data: imageFormData,
        });
    }, []);

    const onRemoveImage = useCallback(
        (index) => () => {
            dispatch({
                type: REMOVE_IMAGE,
                data: index,
            });
        },
        []
    );

    return (
        <Form
            style={{ margin: "10px 0 20px" }}
            encType="multipart/form-data"
            onFinish={onSubmit}
        >
            <Input.TextArea
                value={text}
                onChange={onChangeText}
                maxLength={140}
                placeholder="어떤 신기한 일이 있었나요?"
            />
            <div>
                <input
                    type="file"
                    name="image"
                    multiple
                    hidden
                    ref={imageInput}
                    onChange={onchangeImages}
                    accept="image/*"
                />
                <Button onClick={onClickImageUpload}>이미지 업로드</Button>
                <Button
                    type="primary"
                    loading={addPostLoading}
                    style={{ float: "right" }}
                    htmlType="submit"
                >
                    짹짹
                </Button>
            </div>
            <div>
                {imagePaths.map((v, i) => (
                    <div key={v} style={{ display: "inline-block" }}>
                        <img
                            src={v.replace(/\/thumb\//, "/original/")}
                            style={{ width: "200px" }}
                            alt={v}
                        />
                        <div>
                            <Button onClick={onRemoveImage(i)}>제거</Button>
                        </div>
                    </div>
                ))}
            </div>
        </Form>
    );
};

export default PostForm;
