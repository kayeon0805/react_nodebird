import React, { useCallback, useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import Head from "next/head";
import { Form, Input, Checkbox, Button } from "antd";
import useInput from "../hooks/useInput";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { LOAD_MY_INFO_REQUEST, SIGN_UP_REQUEST } from "../reducers/user";
import Router from "next/router";
import wrapper from "../store/configureStore";
import axios from "axios";
import { END } from "redux-saga";

const ErrorMessage = styled.div`
    color: red;
`;

const Signup = () => {
    const [email, onChangeEmail] = useInput("");
    const [nickname, onChangeNickname] = useInput("");
    const [password, onChangePassword] = useInput("");
    const [passwordCheck, setPasswordCheck] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [term, setTerm] = useState("");
    const [termError, setTermError] = useState(false);
    const dispatch = useDispatch();

    const { signUpLoading, signUpDone, signUpError, me } = useSelector(
        (state) => state.user
    );

    useEffect(() => {
        if (me && me.id) {
            Router.replace("/");
        }
    }, [me && me.id]);

    useEffect(() => {
        if (signUpDone) {
            Router.replace("/");
        }
    }, [signUpDone]);

    useEffect(() => {
        if (signUpError) {
            alert(signUpError);
        }
    }, [signUpError]);

    const onChangePasswordCheck = useCallback(
        (e) => {
            setPasswordCheck(e.target.value);
            setPasswordError(e.target.value !== password);
        },
        [password]
    );

    const onChangeTerm = useCallback((e) => {
        setTerm(e.target.checked);
        setTermError(false);
    }, []);

    const onSubmit = useCallback(() => {
        if (password !== passwordCheck) {
            return setPasswordError(true);
        }
        if (!term) {
            return setTermError(true);
        }
        const idRegExp =
            /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

        const passwordRegExp =
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

        const nicknameRegExp = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]{2,20}$/;

        if (!idRegExp.test(email)) {
            return alert("아이디는 올바른 이메일 형식으로 입력해주세요");
        }
        if (!passwordRegExp.test(password)) {
            return alert(
                "비밀번호는 최소 8자, 영문 대소문자, 숫자, 특수문자 포함입니다"
            );
        }
        if (!nicknameRegExp.test(nickname)) {
            return alert(
                "닉네임은 한글과 영문 대 소문자, 숫자를 사용하세요. (2~20자리)"
            );
        }
        dispatch({
            type: SIGN_UP_REQUEST,
            data: { email, password, nickname },
        });
    }, [password, passwordCheck, term, email, nickname]);

    return (
        <>
            <AppLayout>
                <Head>
                    <title>회원가입 | NodeBird</title>
                </Head>
                <Form onFinish={onSubmit}>
                    <div>
                        <label htmlFor="user-email">아이디</label>
                        <br />
                        <Input
                            name="user-email"
                            type="email"
                            value={email}
                            required
                            placeholder="이메일을 입력해주세요"
                            onChange={onChangeEmail}
                            autoFocus
                        />
                    </div>
                    <div>
                        <label htmlFor="user-nickname">닉네임</label>
                        <br />
                        <Input
                            name="user-nickname"
                            value={nickname}
                            required
                            placeholder="한글과 영문 대 소문자, 숫자를 사용하세요. (2~20자리)"
                            onChange={onChangeNickname}
                        />
                    </div>
                    <div>
                        <label htmlFor="user-password">비밀번호</label>
                        <br />
                        <Input
                            name="user-password"
                            type="password"
                            value={password}
                            required
                            placeholder="최소 8자, 영문 대소문자, 숫자, 특수문자 포함"
                            onChange={onChangePassword}
                        />
                    </div>
                    <div>
                        <label htmlFor="user-password">비밀번호체크</label>
                        <br />
                        <Input
                            name="user-password-check"
                            type="password"
                            value={passwordCheck}
                            required
                            placeholder="비밀번호와 동일하게 입력해주세요."
                            onChange={onChangePasswordCheck}
                        />
                        {passwordError && (
                            <ErrorMessage>
                                비밀번호가 일치하지 않습니다.
                            </ErrorMessage>
                        )}
                    </div>
                    <div>
                        <Checkbox
                            name="user-term"
                            checked={term}
                            onChange={onChangeTerm}
                        >
                            개인정보 수집 및 이용에 동의합니다.
                        </Checkbox>
                        {termError && (
                            <ErrorMessage>
                                약관에 동의하셔야 합니다.
                            </ErrorMessage>
                        )}
                    </div>
                    <div style={{ marginTop: 10 }}>
                        <Button
                            type="primary"
                            loading={signUpLoading}
                            htmlType="submit"
                        >
                            가입하기
                        </Button>
                    </div>
                </Form>
            </AppLayout>
        </>
    );
};

export const getServerSideProps = wrapper.getServerSideProps(
    async (context) => {
        const cookie = context.req ? context.req.headers.cookie : "";
        axios.defaults.headers.Cookie = "";
        if (context.req && cookie) {
            axios.defaults.headers.Cookie = cookie;
        }

        context.store.dispatch({
            type: LOAD_MY_INFO_REQUEST,
        });
        context.store.dispatch(END);
        await context.store.sagaTask.toPromise();
    }
);

export default Signup;
