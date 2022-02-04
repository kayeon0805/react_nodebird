import React from "react";
import PropTypes from 'prop-types';
import Link from 'next/link';

const PostCardContent = ({ postData }) => {
    return (
        <div>
            {postData.split(/(#[^\s#]+)/g).map((v, i) => {
                // 해시태그일 경우 링크로 리턴
                if (v.match(/(#[^\s#]+)/)) {
                    return <Link href={`/hashtag/${v.slice(1)}`} key={i}><a>{v}</a></Link>
                }
                // 아닐 경우엔 그냥 리턴
                return v;
            })}
        </div>
    )
}

PostCardContent.propTypes = {
    postData: PropTypes.string.isRequired
};

export default PostCardContent;