import { Button, Card, Form, Input } from "antd";
import moment from "moment";
import React, { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import useInput from "../hooks/useInput";
import { MODIFY_POST_REQUEST, UPLOAD_IMAGES_REQUEST } from "../reducers/post";
import Slider from "react-slick";
import "moment/locale/ko";
import ShowImages from "./ShowImages.jsx";
moment.locale("ko");

const ModifyForm = ({ post, setModifyPost }) => {
    const { imagePaths, modifyPostLoading } = useSelector(
        (state) => state.post
    );
    const [text, onChangeText, setText] = useInput(post.content);
    const dispatch = useDispatch();
    const imageInput = useRef();

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

    const onsubmit = useCallback(() => {
        if (!text || !text.trim()) {
            return alert("게시글을 작성하세요.");
        }
        const formData = new FormData();
        imagePaths.forEach((p) => {
            formData.append("image", p);
        });
        formData.append("content", text);
        dispatch({
            type: MODIFY_POST_REQUEST,
            data: {
                postId: post.id,
                data: formData,
            },
        });
        setText("");
        setModifyPost("");
    }, [text, post]);

    const settings = {
        // 캐러셀의 점을 보여줄 것인지
        dots: true,
        // 마지막 장 다음에 첫번째가 나오게 할 것인지
        infinite: true,
        // 넘어가는 속도는 몇으로 할 것인지
        speed: 500,
        arrows: true,
        vertical: false,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <div style={{ marginBottom: 20 }}>
            <Card>
                <Slider {...settings}>
                    {imagePaths[0] &&
                        imagePaths.map((v, i) => (
                            <ShowImages
                                key={v.src}
                                image={v}
                                postId={post.id}
                            />
                        ))}
                </Slider>
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
                            />
                            <input
                                type="file"
                                name="image"
                                multiple
                                hidden
                                ref={imageInput}
                                onChange={onchangeImages}
                                accept="image/*"
                            />
                            <Button onClick={onClickImageUpload}>
                                이미지 업로드
                            </Button>
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
