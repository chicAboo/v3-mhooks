# vue3Hooks

vue3Hooks 是一套高质量可靠的 vue3 hooks 库，在当前 vue3 生态中，还未有 hooks 相关的库，而一套好的 hooks 库对开发人员来说必不可少，希望 vue3Hooks 能成为您的选择。

## 安装

```ts
npm install --save vue3Hooks
# or
yarn add vue3Hooks
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
} from "vue3Hooks";
```

## hooks 列表

- [useToggle](/src/components/useToggle)：管理两个状态值间切换的 Hook
- [useBoolean](/src/components/useBoolean)：管理 boolean 状态的 Hook
- [useSetState](/src/components/useSetState)：管理 object 类型 state 的 Hook
- [useDebounce](/src/components/useDebounce)：管理防抖值的 Hook
- [useDebounceFn](/src/components/useDebounceFn)：管理防抖函数的 Hook
- [useThrottle](/src/components/useThrottle)：管理节流值的 Hook
- [useThrottleFn](/src/components/useThrottleFn)：管理节流函数的 Hook
- [useLockFn](/src/components/useLockFn)：给异步函数一个锁，防止并发执行
- [useTimeout](/src/components/useTimeout)：管理 setTimeout 函数的 Hook
- [useInterval](/src/components/useInterval)：管理 setInterval 函数的 Hook
- [useRequest](/src/components/useRequest)：一个强大的异步数据管理 Hooks

## 致谢

感谢他们提供灵感

- [alibaba/hooks](https://github.com/alibaba/hooks)
- [vercel/swr](https://github.com/vercel/swr)
- [attojs/vue-request](https://github.com/attojs/vue-request)
