# useDebounce

useDebounce 是用来处理防抖值的 Hook，参数有两个：

> 第一个参数是通过 ref 声明的响应式数据；
> 第二个参数是`Options`对象，具体参考下面 api；

该方法底层的是使用 lodash 的 debounce 函数。

## 基础用法

```vue
<template>
  <div class="box">
    <pre>{{ debounceValue }}</pre>

    <div class="op">
      <button @click="setCount(1)">count + 1</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useDebounce } from "v3-hooks";
const count = ref(0);
const debounceValue = useDebounce(count, { wait: 3000 });

function setCount(gap: number) {
  count.value += gap;
}
</script>
```

## API

```typescript
const debouncedValue = useDebounce(
  value: any,
  options?: Options
);
```

### 参数（Params）

| 参数    | 说明                                                                | 类型       | 默认值 |
| ------- | ------------------------------------------------------------------- | ---------- | ------ |
| value   | 需要防抖的值，因 vue3 中的特殊性，该值只能兼容通过 ref 声明出来的值 | `Ref<any>` | -      |
| options | 配置防抖的行为                                                      | `Options`  | -      |

### 条件（Options）

| 参数     | 说明                     | 类型      | 默认值  |
| -------- | ------------------------ | --------- | ------- |
| wait     | 超时时间，单位为毫秒     | `number`  | `1000`  |
| leading  | 是否在延迟开始前调用函数 | `boolean` | `false` |
| trailing | 是否在延迟开始后调用函数 | `boolean` | `true`  |
| maxWait  | 最大等待时间，单位为毫秒 | `number`  | -       |
