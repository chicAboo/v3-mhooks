# useDebounceFn

useDebounceFn 是用来处理防抖函数的 Hook，有两个参数：

> 参数 1：fn，需要防抖执行的函数；
> 参数 2：options，执行防抖函数的条件，参考下面 API Options；

## 用法

```vue
<template>
  <div class="box">
    <pre>{{ state }}</pre>

    <div class="op">
      <button @click="run">count + 1</button>
      <button @click="flush">flush</button>
      <button @click="cancel">cancel</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useSetState, useDebounceFn } from 'v3-mhooks';
const [state, setState] = useSetState({ count: 0 });
const { run, flush, cancel } = useDebounceFn(
  () => {
    setState({ count: state.value.count + 1 });
  },
  { wait: 500, maxWait: 2000 }
);
</script>
```

## API

```typescript
const {
  run,
  cancel,
  flush
} = useDebounceFn(
  fn: (...args: any[]) => any,
  options?: Options
);
```

### 参数（Params）

| 参数    | 说明               | 类型                      | 默认值 |
| ------- | ------------------ | ------------------------- | ------ |
| fn      | 需要防抖执行的函数 | `(...args: any[]) => any` | -      |
| options | 配置防抖的行为     | `Options`                 | -      |

### 条件（Options）

| 参数     | 说明                     | 类型      | 默认值  |
| -------- | ------------------------ | --------- | ------- |
| wait     | 等待时间，单位为毫秒     | `number`  | `1000`  |
| leading  | 是否在延迟开始前调用函数 | `boolean` | `false` |
| trailing | 是否在延迟开始后调用函数 | `boolean` | `true`  |
| maxWait  | 最大等待时间，单位为毫秒 | `number`  | -       |

### 返回值（Methods）

| 参数   | 说明                               | 类型                      |
| ------ | ---------------------------------- | ------------------------- |
| run    | 触发执行 fn，函数参数将会传递给 fn | `(...args: any[]) => any` |
| cancel | 取消当前防抖                       | `() => void`              |
| flush  | 立即调用当前防抖函数               | `() => void`              |
