import axios from "axios";
import { all, delay, fork, put, takeLatest } from "redux-saga/effects";
import { 
    LOG_IN_FAILURE, LOG_IN_REQUEST, LOG_IN_SUCCESS, 
    LOG_OUT_FAILURE, LOG_OUT_REQUEST, LOG_OUT_SUCCESS, 
    SIGN_UP_FAILURE, SIGN_UP_REQUEST, SIGN_UP_SUCCESS 
} from "../reducers/user";

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
            type: LOG_IN_SUCCESS,
            data: action.data,
        });
    } catch (err) {
        yield put({
            type: LOG_IN_FAILURE,
            error: err.response.data,
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
            type: LOG_OUT_SUCCESS,
        });
    } catch (err) {
        yield put({
            type: LOG_OUT_FAILURE,
            error: err.response.data,
        })
    }
}

function signUpAPI() {
    return axios.post('/api/logout');
}

function* signUp() {
    try {
        // const result = yield call(logoutAPI);
        yield delay(1000);
        yield put({
            type: SIGN_UP_SUCCESS,
        });
    } catch (err) {
        yield put({
            type: SIGN_UP_FAILURE,
            error: err.response.data,
        })
    }
}

function* watchLogin() {
    // LOG_IN_REQUEST가 실행될 때까지 기다리다가 실행되면 logIn을 실행한다.
    yield takeLatest(LOG_IN_REQUEST, logIn);
}

function* watchLogOut() {
    yield takeLatest(LOG_OUT_REQUEST, logOut);
}

function* watchSignUp() {
    yield takeLatest(SIGN_UP_REQUEST, signUp);
}

export default function* userSaga() {
    yield all([
        fork(watchLogin),
        fork(watchLogOut),
        fork(watchSignUp),
    ]);
}