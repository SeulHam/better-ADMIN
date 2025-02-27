import React, {useEffect, useState} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import './App.less';
import AppLayout from "./components/layout/AppLayout";
import {adminConfig} from "./config/admin.config";
import {Modal, notification} from "antd";
import {
  EventBroadcaster,
  SHOW_ERROR_MESSAGE_EVENT_TOPIC,
  SHOW_WEB_HOOK_MESSAGE_EVENT_TOPIC
} from "./event/event.broadcaster";
import {ExclamationCircleOutlined, NotificationTwoTone} from "@ant-design/icons";
import OAuthLoginResult from "./components/templates/login/OAuthLoginResult";
import ProtectedRoute from "./components/router/ProtectedRoute";
import {AuthService} from "./auth/auth.service";
import Login from "./components/templates/login/Login";

const App = () => {
  const [silentRefreshCompleted, setSilentRefreshCompleted] = useState(false);

  useEffect(() => {
    AuthService.silentRefresh().then().finally(() => setSilentRefreshCompleted(true));

    EventBroadcaster.on(SHOW_ERROR_MESSAGE_EVENT_TOPIC, (msg) => {
      Modal.confirm({
        icon: <ExclamationCircleOutlined/>,
        content: msg,
        okText: '확인',
        cancelText: null,
        cancelButtonProps: {style: {display: 'none'}},
      });
    });

    EventBroadcaster.on(SHOW_WEB_HOOK_MESSAGE_EVENT_TOPIC, (msg) => {
      notification.open({
        message: msg.title,
        description: msg.text,
        icon: <NotificationTwoTone/>,
      });
    });
  }, []);

  return (<>
    <BrowserRouter>
      <Routes>
        <Route path={adminConfig.authentication.loginUrl} element={<Login/>}/>
        <Route path={adminConfig.authentication.oauthLoginResultUrl} element={<OAuthLoginResult/>}/>
        <Route path="/*" element={
          <ProtectedRoute silentRefreshCompleted={silentRefreshCompleted}>
            <AppLayout/>
          </ProtectedRoute>
        }/>
      </Routes>
    </BrowserRouter>
  </>)
};

export default App;
