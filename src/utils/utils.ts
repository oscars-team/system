import { parse } from 'querystring';
import pathRegexp from 'path-to-regexp';
import { Route } from '@/models/connect';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */
export const getAuthorityFromRouter = <T extends Route>(
  router: T[] = [],
  pathname: string,
): T | undefined => {
  const authority = router.find(
    ({ routes, path = '/' }) =>
      (path && pathRegexp(path).exec(pathname)) ||
      (routes && getAuthorityFromRouter(routes, pathname)),
  );
  if (authority) return authority;
  return undefined;
};

export const getRouteAuthority = (path: string, routeData: Route[]) => {
  let authorities: string[] | string | undefined;
  routeData.forEach(route => {
    // match prefix
    if (pathRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
      if (route.authority) {
        authorities = route.authority;
      }
      // exact match
      if (route.path === path) {
        authorities = route.authority || authorities;
      }
      // get children authority recursively
      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities;
      }
    }
  });
  return authorities;
};

/**
 * 将数组根据父子关系重新组合
 * @param array 重组集合
 * @param key 主键字段名称
 * @param parentKey 父级字段名称
 * @param rootValue 根字段值
 * @param childrenName 子集字段名称
 */
export const treeSet = <T>(array: T[], key: string, parentKey: string, rootValue = undefined, childrenName: string = 'children') => {
  const tree: T[] = [];
  const getChildren = (root: any) => {
    if (root === rootValue)
      return array.filter(p => p[parentKey] === rootValue);
    return array.filter(p => p[parentKey] === root[key]);
  }
  const search = (root: any) => {
    let subs = getChildren(root);
    for (var i in subs) {
      search(subs[i]);

      if (root != rootValue) {
        if (!root[childrenName]) root[childrenName] = [];
        root[childrenName].push(subs[i]);
      } else {
        tree.push(subs[i]);
      }
    }
  }
  search(rootValue);
  return tree;
}

/**
 * 将一个整数解构成满足二进制规则的数组
 * 例: 7 => [1,2,4]
 * @param value 一个整数
 */
export const deconstructInt = (value: number) => {
  if (!value) return 0;
  return Math.abs(value).toString(2).split('').reverse().map((e, i) => parseInt(e) * Math.pow(2, i)).filter(p => p > 0);
}