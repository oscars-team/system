import { IConfig, IPlugin } from 'umi-types';
import defaultSettings from './defaultSettings'; // https://umijs.org/config/

import slash from 'slash2';
import themePluginConfig from './themePluginConfig';
import proxy from './proxy';
import webpackPlugin from './plugin.config';
const { pwa } = defaultSettings; // preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION, REACT_APP_ENV } = process.env;
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';
const plugins: IPlugin[] = [
  ['umi-plugin-antd-icon-config', {}],
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        // default false
        enable: true,
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      pwa: pwa
        ? {
          workboxPluginMode: 'InjectManifest',
          workboxOptions: {
            importWorkboxFrom: 'local',
          },
        }
        : false, // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      // dll: {
      //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
];

if (isAntDesignProPreview) {
  // 针对 preview.pro.ant.design 的 GA 统计代码
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
  plugins.push(['umi-plugin-antd-theme', themePluginConfig]);
}

export default {
  plugins,
  hash: true,
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [
    {
      path: '/',
      routes: [
        // 自动跳转
        {
          path: '/',
          redirect: '/admin',
        },
        // 前台页面
        {
          path: '/feature/post/:any',
          component: './feature/post',
          // routes: [
          //   {
          //     path: '/feature/post/:any',
          //     component: './feature/post',
          //     hideInMenu: true
          //   }
          // ]
        },
        // 登录页面
        {
          path: '/admin/login',
          component: '../layouts/UserLayout',
          routes: [
            {
              path: '/admin/login',
              component: './admin/login',
            },
          ],
        },
        // /admin路径使用后台SecurityLayout
        {
          path: '/admin',
          component: '../layouts/SecurityLayout',
          routes: [
            {
              path: '/admin',
              component: '../layouts/BasicLayout',
              routes: [
                {
                  path: '/admin',
                  redirect: '/admin/welcome',
                },
                {
                  path: '/admin/welcome',
                  icon: 'smile',
                  name: 'welcome',
                  component: './admin/welcome',
                },
                // 内容管理页面
                {
                  path: '/admin/content',
                  icon: 'smile',
                  name: 'content',
                  routes: [
                    {
                      path: '/admin/content/article',
                      name: 'article',
                      icon: 'smile',
                      component: './admin/content/article'
                    },
                    {
                      path: '/admin/content/publish',
                      name: 'publish',
                      icon: 'smile',
                      component: './admin/content/publish'
                    },
                    {
                      path: '/admin/content/list',
                      name: 'list',
                      icon: 'smile',
                      component: './admin/content/list'
                    },
                  ]
                },
                // 微信管理页面
                {
                  path: '/admin/wechat',
                  name: 'wechat',
                  routes: [{
                    path: '/admin/wechat/platform',
                    name: 'platform',
                    component: './admin/wechat/platform',
                  }, {
                    path: '/admin/wechat/platform/create',
                    name: 'platform.create',
                    component: './admin/wechat/platform/components/create',
                  }, {
                    path: '/admin/wechat/platform/edit',
                    name: 'platform.edit',
                    component: './admin/wechat/platform/components/edit',
                  }]
                },
                // 系统管理页面
                {
                  path: '/admin/system',
                  icon: 'smile',
                  name: 'system',
                  routes: [
                    {
                      path: '/admin/system/user',
                      name: 'user',
                      icon: 'smile',
                      component: './admin/system/user',
                    },
                    {
                      path: '/admin/system/permission',
                      name: 'permission',
                      icon: 'smile',
                      component: './admin/system/permission',
                    },
                    {
                      path: '/admin/system/role',
                      name: 'role',
                      icon: 'smile',
                      component: './admin/system/role',
                    },
                  ],
                },
                // 推广管理
                {
                  path: '/admin/campaign',
                  name: 'campaign',
                  icon: 'smile',
                  routes: [
                    {
                      path: '/admin/campaign/voucher',
                      name: 'voucher',
                      icon: 'smile',
                      component: './admin/campaign/voucher'
                    },
                    {
                      path: '/admin/campaign/voucher/edit',
                      name: 'edit',
                      icon: 'smile',
                      component: './admin/campaign/voucher/components/editform'
                    }
                  ]
                }
              ],
            },
          ],
        },
        // 根目录下不存在的页面404
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
  },
  define: {
    REACT_APP_ENV: REACT_APP_ENV || false,
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (
      context: {
        resourcePath: string;
      },
      _: string,
      localName: string
    ) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map((a: string) => a.replace(/([A-Z])/g, '-$1'))
          .map((a: string) => a.toLowerCase());
        // return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
        return `rs${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/app',
  },
  proxy: proxy[REACT_APP_ENV || 'dev'],
  chainWebpack: webpackPlugin,
} as IConfig;
