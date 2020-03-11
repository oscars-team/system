import request from '@/utils/request';

export interface LoginParamsType {
  loginname: string;
  password: string;
}

export async function accountLogin(params: LoginParamsType) {
  return request('/api/signin', {
    method: 'POST',
    data: params,
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
