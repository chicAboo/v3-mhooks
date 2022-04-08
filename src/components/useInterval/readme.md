# useInterval

useInterval 是用来处理 setInterval 函数的 Hook，有三个参数：

> fn: 待运行的函数；
> delay: 延迟的时间，可以是 ref 声明的响应式 number，如果是响应式数据可动态改变 delay 时间；
> options: options.immediate 是否立即执行；

## 用法

```vue
<template>
  <div class="box">
    <pre>{{ count }}</pre>

    <div class="op">
      <button @click="reset">reset</button>
      <button @click="setDelay">clear</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useInterval } from "vue3Hooks";

const count = ref(0);
const delay = ref(1000);

const clear = useInterval(
  () => {
    count.value += 1;
  },
  delay,
  { immediate: true },
);

function setDelay() {
  clear();
}

function reset() {
  delay.value = 2000;
}
</script>
```

## API

```typescript
useInterval(
  fn: () => void,
  delay: number,
  options?: Options
);
```

### 参数（Params）

| 参数    | 说明             | 类型         |
| ------- | ---------------- | ------------ |
| fn      | 要定时调用的函数 | `() => void` |
| delay   | 间隔时间         | `number`     |
| options | 配置计时器的行为 | `Options`    |

### 条件（Options）

| 参数      | 说明                     | 类型      | 默认值  |
| --------- | ------------------------ | --------- | ------- |
| immediate | 是否在首次渲染时立即执行 | `boolean` | `false` |

### 返回值（results）

| 参数  | 说明       | 默认值       |
| ----- | ---------- | ------------ |
| clear | 清除定时器 | `() => void` |
