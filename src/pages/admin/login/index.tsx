import React, { useState } from 'react';
import styles from './style.less';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { Form, Tabs, Input, Button, Checkbox, Alert } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { AccountLoginDataType } from './data.d';
import { StateType } from '@/models/login';

interface LoginProps {
  dispatch: Dispatch<AnyAction>;
  userLogin: StateType;
  submitting?: boolean;
}
const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC<LoginProps> = props => {
  const [form] = Form.useForm();
  const { userLogin = {}, submitting } = props;
  const { status, type: loginType } = userLogin;
  //#region ========= Hooks =========

  //#endregion

  const handleSubmit = (values: any) => {
    const vals: AccountLoginDataType = { ...values };
    const { dispatch } = props;
    dispatch({
      type: 'login/login',
      payload: { ...vals },
    });
  }


  return (
    <div className={styles.main}>
      <Form
        form={form}
        onFinish={(handleSubmit)} >
        <Tabs size="large" defaultActiveKey="account">
          <Tabs.TabPane tab="账号密码登录" key="account" >
            {status === 'error' && !submitting && (
              <LoginMessage content="账户或密码错误" />
            )}
            <Form.Item name="loginname" rules={[{
              required: true,
              message: '请填写账号名称'
            }]}>
              <Input
                size="large"
                prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }}></UserOutlined>} allowClear
                placeholder="请输入账号"></Input>
            </Form.Item>
            <Form.Item name="password" rules={[{
              required: true,
              message: '请填写账号密码'
            }]}>
              <Input.Password
                size="large"
                prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }}></LockOutlined>} allowClear
                placeholder="请输入密码"></Input.Password>
            </Form.Item>
            <Form.Item name="autologin" valuePropName="checked">
              <>
                <Checkbox defaultChecked>自动登录</Checkbox>
                <a style={{ float: 'right' }}>忘记密码?</a>
              </>
            </Form.Item>
            <Button block type="primary" size="large" htmlType="submit" loading={submitting}>登录</Button>

          </Tabs.TabPane>
          <Tabs.TabPane tab="手机登录" disabled key="mobile">
          </Tabs.TabPane>
          <Tabs.TabPane tab="邮箱登录" disabled key="email">
          </Tabs.TabPane>
        </Tabs>
      </Form>
    </div>
  );
};

export default connect(({ login, loading }: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
