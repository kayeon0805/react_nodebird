import { Button } from "antd";
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { MODIFY_POST_REMOVE_IMAGE_REQUEST } from "../reducers/post";

const ShowImages = ({ image, postId }) => {
    const dispatch = useDispatch();
    const onDeleteImage = useCallback(() => {
        dispatch({
            type: MODIFY_POST_REMOVE_IMAGE_REQUEST,
            data: {
                image: image,
                postId: postId,
            },
        });
    }, [image, postId]);

    return (
        <div
            style={{
                marginTop: 20,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <img style={{ width: 200 }} src={image} />
            <div style={{ display: "flex", alignSelf: "flex-end" }}>
                <Button onClick={onDeleteImage}>사진 삭제</Button>
            </div>
        </div>
    );
};

export default ShowImages;
