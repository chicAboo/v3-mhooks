# v3-mhooks

v3-mhooks 是一套高质量可靠的 vue3 hooks 库，在当前 vue3 生态中，还未有 hooks 相关的库，而一套好的 hooks 库对开发人员来说必不可少，希望 v3-mhooks 能成为您的选择。

## 安装

```ts
mnpm install --save v3-mhooks
```

## 使用

```ts
import {
  useToggle,
  useBoolean,
  useSetState,
  useDebounce,
  useDebounceFn,
  useThrottle,
  useThrottleFn,
  useLockFn,
  useTimeout,
  useInterval,
  useRequest,
} from 'v3-mhooks';
```

## hooks 列表

- [useToggle](https://km.sankuai.com/page/1302016626)：管理两个状态值间切换的 Hook
- [useBoolean](https://km.sankuai.com/page/1284383221)：管理 boolean 状态的 Hook
- [useSetState](https://km.sankuai.com/page/1302052010)：管理 object 类型 state 的 Hook
- [useDebounce](https://km.sankuai.com/page/1302080975)：管理防抖值的 Hook
- [useDebounceFn](https://km.sankuai.com/page/1301986745)：管理防抖函数的 Hook
- [useThrottle](https://km.sankuai.com/page/1301996624)：管理节流值的 Hook
- [useThrottleFn](https://km.sankuai.com/page/1301987169)：管理节流函数的 Hook
- [useLockFn](https://km.sankuai.com/page/1302061643)：给异步函数一个锁，防止并发执行
- [useTimeout](https://km.sankuai.com/page/1302052141)：管理 setTimeout 函数的 Hook
- [useInterval](https://km.sankuai.com/page/1302006451)：管理 setInterval 函数的 Hook
- [useRequest](https://km.sankuai.com/page/1301996517)：一个强大的异步数据管理 Hooks

## 致谢

感谢他们提供灵感

- [alibaba/hooks](https://github.com/alibaba/hooks)
- [vercel/swr](https://github.com/vercel/swr)
- [attojs/vue-request](https://github.com/attojs/vue-request)
