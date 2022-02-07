import { all, fork } from 'redux-saga/effects';

import postSaga from './post';
import userSaga from './user';

export default function* rootSaga() {
    // all은 배열을 받고 fork는 실행한다(call도 가능) => 배열 안을 한 번에 실행한다.
    yield all([
        fork(postSaga),
        fork(userSaga),
    ]);
}