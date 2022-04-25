# react_nodebird

## Description

트위터와 유사한 SNS 서비스입니다.

**기능 소개**

-   로그인
-   게시글 작성
-   이미지 업로드
-   좋아요
-   댓글
-   리트윗
-   인피니트 스크롤링
-   팔로우
-   언팔로우

### Frontend

-   <img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=React&logoColor=white"/>
-   <img src="https://img.shields.io/badge/Redux-764ABC?style=flat&logo=Redux&logoColor=white"/>

    -   <img src="https://img.shields.io/badge/Redux Saga-999999?style=flat&logo=Redux-Saga&logoColor=white"/>

-   <img src="https://img.shields.io/badge/Next-000000?style=flat&logo=Next.js&logoColor=white"/>
-   <img src="https://img.shields.io/badge/Express-000000?style=flat&logo=Express&logoColor=white"/>
-   <img src="https://img.shields.io/badge/styled components-DB7093?style=flat&logo=styled-components&logoColor=white"/>
-   <img src="https://img.shields.io/badge/Ant Design-0170FE?style=flat&logo=Ant Design&logoColor=white"/>

### Backend

-   <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=Node.js&logoColor=white"/>
-   <img src="https://img.shields.io/badge/Express-000000?style=flat&logo=Express&logoColor=white"/>
-   <img src="https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=MySQL&logoColor=white"/>
-   <img src="https://img.shields.io/badge/Sequelize-52B0E7?style=flat&logo=Sequelize&logoColor=white"/>

## Dependincies

### back

-   _aws-sdk_
    > aws에 연결하는 용도로 사용됩니다.
-   _bcrypt_
    > 비밀번호를 암호화하기 위해 사용됩니다.
-   _cookie-parser_
    > 요청된 쿠키를 쉽게 추출할 수 있도록 해주는 미들웨어입니다.
-   _cors_
    > 브라우저 간에 데이터를 공유할 때 도메인이 달라 cors 정책을  
    > 위반하게 되는 문제를 내부에서 처리해주는 데에 사용됩니다.
-   _cross-env_
    > 운영체제나 플랫폼에 맞게 환경 변수를 설정하기 위해 사용됩니다.
-   _dotenv_
    > .env 확장자 파일을 통해 환경 변수를 설정할 수 있는 라이브러리입니다.
-   _express_
    > 웹 애플리케이션을 위한 기능들을 제공하는 프레임워크입니다.
-   _express-session_
    > 세션 관리용 미들웨어입니다.
-   _helmet, hpp_
    > 서버의 각종 취약점을 보완해주는 패키지들입니다.
-   _morgan_
    > 서버에 로그를 남길 수 있도록 해주는 미들웨어입니다.
-   _multer, multer-s3_
    > 이미지를 업로드할 때 사용되는 미들웨어입니다.
-   _mysql2_
    > mysql용 드라이버입니다.
-   _passport, passport-local_
    > 로그인 관리를 쉽게 처리할 수 있게 도와주는 미들웨어입니다.
-   _pm2_
    > Node.js 프로세스 관리로 애플리케이션을 중단 없이 실행할 수 있게 해줍니다.
-   _sequelize_
    > ORM의 일종으로 Node.js에서 MySQL 작업을 쉽게 할 수 있도록 사용됩니다.
-   _sequelize-cli_
    > sequelize 명령어를 실행하기 위해 사용됩니다.

### front

-   _antd_
    > React UI 라이브러리입니다,
-   _axios_
    > 서버와 통신하기 위해 사용되는 HTTP 통신 라이브러리입니다.
-   _cross-env_
    > 운영체제나 플랫폼에 맞게 환경 변수를 설정하기 위해 사용됩니다.
-   _faker_
    > 더미 데이터를 만들기 위해 사용됩니다.
-   _immer_
    > 불변성 관리를 위해 사용됩니다.
-   _moment_
    > 날짜 관련 작업 시 사용됩니다.
-   _next_
    > 서버사이드 렌더링 프레인 워크입니다.
-   _next-redux-wrapper_
    > Next.js에서 Redux 사용을 쉽게 해주는 데에 사용됩니다.
-   _pm2_
    > Node.js 프로세스 관리로 애플리케이션을 중단 없이 실행할 수 있게 해줍니다.
-   _prop-types_
    > 컴포넌트에 전달된 props의 타입을 검사하기 위해 사용됩니다.
-   _react, react-dom_
    > React.js를 시용합니다.
-   _react-intersection-observer_
    > 인피니트 스크롤에 사용됩니다.
-   _react-redux, redux, redux-devtools-extension, redux-saga_
    > React.js와 Redux를 함께 쓰기 위해 사용됩니다.
-   _react-slick_
    > 캐러셀을 쉽게 구현하기 위해 사용됩니다.
-   _shortid_
    > 더미 데이터의 아이디를 랜덤하게 만들어주는 라이브러리입니다.
-   _styled-components_
    > Javascript 파일 내에서 CSS를 사용할 수 있게 돕는 라이브러리입니다.
-   _swr_
    > React Hooks로 Data Fetching을 할 수 있게 해줍니다.
