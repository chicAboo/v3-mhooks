# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### 0.0.4 (2022-04-15)


### Features

* add vue3 hooks ([64799f2](https://github.com/chicAboo/v3-mhooks/commit/64799f268f77317a6fa75d6d917396673ffb97e6))


### Bug Fixes

* change main index ([fee4dab](https://github.com/chicAboo/v3-mhooks/commit/fee4dab16d7a8f55016e2282445ecfd5b2ce2d34))
* change package name ([a22318a](https://github.com/chicAboo/v3-mhooks/commit/a22318ab452c7c5ccba5c5ce861d5eb3963f3d52))
* change package name ([5e8554d](https://github.com/chicAboo/v3-mhooks/commit/5e8554dc438f27682793730dfe448896f944df4c))
* change package name ([313f88a](https://github.com/chicAboo/v3-mhooks/commit/313f88a44a62e862b59b6f6fcc2ed42525542ec2))
* change package name ([4dde01e](https://github.com/chicAboo/v3-mhooks/commit/4dde01e1ff017ba4967affb9fde3fd115eb1ec18))

# 发布日志

## [v0.0.3] - 2022-04-12

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
