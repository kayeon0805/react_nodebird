import React, { useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { Input, Menu, Row, Col } from "antd";
import LoginForm from "./LoginForm";
import UserProfile from "./UserProfile";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { createGlobalStyle } from "styled-components";
import useInput from "../hooks/useInput";
import { SEARCH_INPUT_REQUEST } from "../reducers/post";

const Global = createGlobalStyle`
    .ant-row {
        margin-right: 0 !important;
        margin-left: 0 !important;
    }

    .ant-col::first-child {
        padding-left:  0 !important;
    }

    .ant-col::last-child {
        padding-right:  0 !important;
    }
`;

const SearchInput = styled(Input.Search)`
    vertical-align: middle;
`;

const AppLayout = ({ children }) => {
    const [searchInput, onChangeSearchInput] = useInput("");
    const { me } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const { searchInputLoading } = useSelector((state) => state.post);

    const onSearch = useCallback(() => {
        if (!searchInput) {
            return alert("검색할 게시글 내용을 입력해주세요.");
        }
        dispatch({
            type: SEARCH_INPUT_REQUEST,
            data: searchInput,
        });
    }, [searchInput]);

    return (
        <div>
            <Global />
            <Menu mode="horizontal">
                <Menu.Item>
                    <Link href="/">
                        <a>노드버드</a>
                    </Link>
                </Menu.Item>
                <Menu.Item>
                    <Link href="/profile">
                        <a>프로필</a>
                    </Link>
                </Menu.Item>
                <Menu.Item>
                    <SearchInput
                        enterButton
                        value={searchInput}
                        onChange={onChangeSearchInput}
                        onSearch={onSearch}
                        loading={searchInputLoading}
                    />
                </Menu.Item>
            </Menu>
            <Row gutter={8}>
                <Col xs={24} md={6}>
                    {me ? <UserProfile /> : <LoginForm />}
                </Col>
                <Col xs={24} md={12}>
                    {children}
                </Col>
                <Col xs={24} md={6}>
                    <a
                        href="https://github.com/kayeon0805"
                        target="_blank"
                        rel="noreferrer"
                    >
                        kayeon&apos;s GitHub
                    </a>
                </Col>
            </Row>
        </div>
    );
};

AppLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AppLayout;
