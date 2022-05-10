import { Button } from "antd";
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { MODIFY_POST_REMOVE_IMAGE_REQUEST } from "../reducers/post";

const ShowImages = ({ src, postId }) => {
    const dispatch = useDispatch();
    const onDeleteImage = useCallback(() => {
        dispatch({
            type: MODIFY_POST_REMOVE_IMAGE_REQUEST,
            data: {
                src,
                postId,
            },
        });
        window.location.reload();
    }, []);

    return (
        <div style={{ marginTop: 20 }}>
            <img
                style={{ height: 300 }}
                src={`${src.replace(/\/thumb\//, "/original/")}`}
            />
            <div style={{ textAlign: "right" }}>
                <Button onClick={onDeleteImage}>사진 삭제</Button>
            </div>
        </div>
    );
};

export default ShowImages;
