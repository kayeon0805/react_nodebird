import { createWrapper } from "next-redux-wrapper";
import { applyMiddleware, compose, createStore } from "redux";
import rootReducer from "../reducers";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";
import rootSaga from "../sagas";

const loggerMiddleware =
    ({ dispatch, getState }) =>
    (next) =>
    (action) => {
        console.log(action);
        return next(action);
    };

const configureStore = () => {
    const sagaMiddleware = createSagaMiddleware();
    const middlewares = [sagaMiddleware, loggerMiddleware];
    const enhancer =
        process.env.NODE_ENV === "production"
            ? //                      배열 그대로 넣으면 X
              compose(applyMiddleware(sagaMiddleware)) // 배포용
            : composeWithDevTools(applyMiddleware(...middlewares)); // 개발용
    const store = createStore(rootReducer, enhancer); // store: state, reducer를 포함
    store.sagaTask = sagaMiddleware.run(rootSaga);
    return store;
};

const wrapper = createWrapper(configureStore, {
    debug: process.env.NODE_ENV === "development",
});

export default wrapper;

/*
    컴포넌트들의 공통적인 데이터 부분 (로그인한 유저의 정보, 로그인 여부 등)
    컴포넌트가 분리되어 있으면 위 데이터가 흩어져있는데 부모 컴포넌트를 두면 좋다
    부모 컴포넌트에서 데이터를 받아와 데이터를 보내줘야 하는데
    그 과정들을 중앙 데이터 저장소 역할을 하는 리덕스가 함.
*/
