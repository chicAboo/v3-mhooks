# useTimeout

用于处理 setTimeout 函数的 Hook，有两个参数：

> fn: 待执行函数；
> delay: 延迟时间，默认为 0

## 代码演示

### 基础用法

```vue
<template>
  <div class="box">
    <pre>{{ count }}</pre>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useTimeout } from 'vue3Hooks';

const count = ref(0);

useTimeout(() => {
  count.value += 1;
}, 2000);
```

## API

```typescript
useTimeout(
  fn: () => void,
  delay: number
);
```

### 参数（Params）

| 参数  | 说明                   | 类型         |
| ----- | ---------------------- | ------------ |
| fn    | 待执行函数             | `() => void` |
| delay | 定时时间（单位为毫秒） | `number`     |
