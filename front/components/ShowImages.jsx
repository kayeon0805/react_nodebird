import { Button } from "antd";
import axios from "axios";
import React, { useCallback } from "react";
import { backUrl } from "../config/config";

const ShowImages = ({ image, postId, removeModifyImagePaths }) => {
    const onDeleteImage = useCallback(async () => {
        await axios
            .post(`${backUrl}/post/image/${postId}?image=${image}`)
            .then((response) => {
                if (response) {
                    // 이미 게시글에 추가된 이미지를 삭제할 경우
                    axios.post(`${backUrl}/post/image`, {
                        image: image,
                        postId: postId,
                    });
                } else {
                    // 아직 게시글에 추가되지 않은 이미지를 삭제할 경우
                    removeModifyImagePaths(image);
                }
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
