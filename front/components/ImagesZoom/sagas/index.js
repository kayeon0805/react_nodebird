import { all, fork, call, put, takeLatest, delay } from 'redux-saga/effects';
import axios from 'axios';

// generator X
function loginAPI(data) {
    return axios.post('/api/login');
}

function* logIn(action) {
    // 요청이 실패할 경우를 대비해 try-catch로 감싼다.
    try {
        // loginAPI를 실행하고 리턴값을 받는다.
        // const result = yield call(loginAPI, action.data);
        yield delay(1000);
        // put => dispatch 같은 개념
        yield put({
            type: "LOG_IN_SUCCESS",
            // data: result.data,
        });
    } catch (err) {
        yield put({
            type: "LOG_IN_FAILURE",
            data: err.response.data,
        })
    }
}

function logoutAPI() {
    return axios.post('/api/logout');
}

function* logOut() {
    try {
        // const result = yield call(logoutAPI);
        yield delay(1000);
        yield put({
            type: "LOG_OUT_SUCCESS",
        });
    } catch (err) {
        yield put({
            type: "LOG_OUT_FAILURE",
            data: err.response.data,
        })
    }
}

function addPostAPI(data) {
    return axios.post('/api/post');
}

function* addPost(action) {
    try {
        // const result = yield call(addPostAPI, action.data);
        yield delay(1000);
        yield put({
            type: "ADD_POST_SUCCESS",
            // data: result.data,
        });
    } catch (err) {
        yield put({
            type: "ADD_POST_FAILURE",
            data: err.response.data,
        })
    }
}

function* watchLogin() {
    // LOG_IN_REQUEST가 실행될 때까지 기다리다가 실행되면 logIn을 실행한다.
    yield takeLatest('LOG_IN_REQUEST', logIn);
}

function* watchLogOut() {
    yield takeLatest('LOG_OUT_REQUEST', logOut);
}

function* watchAddPost() {
    yield takeLatest('ADD_POST_REQUEST', addPost);
}

export default function* rootSaga() {
    // all은 배열을 받고 fork는 실행한다(call도 가능) => 배열 안을 한 번에 실행한다.
    yield all([
        fork(watchLogin),
        fork(watchLogOut),
        fork(watchAddPost),
    ]);
}