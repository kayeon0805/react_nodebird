import React, { useCallback, useState } from "react";
import PropTypes from 'prop-types';
import { PlusOutlined } from "@ant-design/icons";
import ImagesZoom from "./ImagesZoom";

const PostImages = ({ images }) => {
    const [showImagesZoom, setShowImagesZoom] = useState(false);
    // 이미지를 클릭하면 ImagesZoom
    const onZoom = useCallback(() => {
        setShowImagesZoom(true);
    }, []);
    // props로 onClose 함수를 넘겨 ImagesZoom에서 X 버튼을 누를 경우 다시 돌아옴.
    const onClose = useCallback(() => {
        setShowImagesZoom(false);
    }, []);
    // 이미지가 1개일 때
    if (images.length === 1) {
        return (
            <>
                <img role="presentation" src={`http://localhost:3065/${images[0].src}`} alt={images[0].src} onClick={onZoom} />
                {showImagesZoom && <ImagesZoom images={images} onClose={onClose} /> }
            </>
        )
    }
    // 이미지가 2개일 때
    if (images.length === 2) {
        return (
            <>
                <img role="presentation" style={{ width: "50%", display: "inline-block" }} src={`http://localhost:3065/${images[0].src}`} alt={images[0].src} onClick={onZoom} />
                <img role="presentation" style={{ width: "50%", display: "inline-block" }} src={`http://localhost:3065/${images[1].src}`} alt={images[1].src} onClick={onZoom} />
                {showImagesZoom && <ImagesZoom images={images} onClose={onClose} /> }
            </>
        )
    }
    // 이미지가 3개 이상일 때 더보기 버튼
    return (
        <div>
            <img role="presentation" style={{ width: "50%" }} src={`http://localhost:3065/${images[0].src}`} alt={images[0].src} onClick={onZoom} />
            <div
                role="presentation"
                style={{ display: 'inline-block', width:"50%", textAlign: "center", verticalAlign: "middle" }}
                onClick={onZoom}
            >
                <PlusOutlined />
                <br />
                {images.length - 1}
                개의 사진 더보기
            </div>
            {showImagesZoom && <ImagesZoom images={images} onClose={onClose} /> }
        </div>
    )
}

PostImages.propTypes = {
    images: PropTypes.arrayOf(PropTypes.object)
};

export default PostImages;