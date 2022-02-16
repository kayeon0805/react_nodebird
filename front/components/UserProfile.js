import React, { useCallback } from "react";
import { Avatar, Button, Card } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { logoutRequestAction } from "../reducers/user";
import Link from "next/link";

const UserProfile = () => {
    const dispatch = useDispatch();
    const { me, logOutLoading } = useSelector((state) => state.user);

    const onLogout = useCallback(() => {
        dispatch(logoutRequestAction());
    }, []);
    return (
        <Card
            actions={[
                <div key="twit">
                    <Link href={`/user/${me.id}`}>
                        <a>
                            짹짹
                            <br />
                            {me.Posts.length}
                        </a>
                    </Link>
                </div>,
                <div key="followings">
                    <Link href="/profile">
                        <a>
                            팔로잉
                            <br />
                            {me.Followings.length}
                        </a>
                    </Link>
                </div>,
                <div key="followers">
                    <Link href="/profile">
                        <a>
                            팔로워
                            <br />
                            {me.Followers.length}
                        </a>
                    </Link>
                </div>,
            ]}
        >
            <Card.Meta
                avatar={
                    <Avatar>
                        <Link href={`/user/${me.id}`}>
                            <a style={{ color: "white" }}>{me.nickname[0]}</a>
                        </Link>
                    </Avatar>
                }
                title={me.nickname}
            />
            <Button onClick={onLogout} loading={logOutLoading}>
                로그아웃
            </Button>
        </Card>
    );
};

export default UserProfile;
