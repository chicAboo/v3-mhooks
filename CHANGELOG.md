# 发布日志

## [v0.1.0] - 2022-04-15

- 修改：发包的入口文件更改为打包后的路径；
- 修改：缺少@babel/runtime-corejs3 包，在使用过程中会报错；
- 修改：缺少@babel/runtime-corejs3 包使用最新版本在下载时，找不到 babel 的版本，使用老版本号；
- 修改：useRequest 返回值的 data 和 params ts 验证不正确修改；
- 修改：因 ts 文件名设置的是 type.d.ts，配置原因没被打包到 dist 文件里面，已更改；

## [v0.0.2] - 2022-04-02

- 文档: 修复地址

## [v0.0.1] - 2022-04-02

- 新增: useToggle：管理两个状态值间切换的 Hook
- 新增: useBoolean：管理 boolean 状态的 Hook
- 新增: useSetState：管理 object 类型 state 的 Hook
- 新增: useDebounce：管理防抖值的 Hook
- 新增: useDebounceFn：管理防抖函数的 Hook
- 新增: useThrottle：管理节流值的 Hook
- 新增: useThrottleFn：管理节流函数的 Hook
- 新增: useLockFn：给异步函数一个锁，防止并发执行
- 新增: useTimeout：管理 setTimeout 函数的 Hook
- 新增: useInterval：管理 setInterval 函数的 Hook
- 新增: useRequest：一个强大的异步数据管理 Hook
