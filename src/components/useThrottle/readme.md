# useThrottle

useThrottle 是用来处理节流值的 Hook，有两个参数：

> 参数 1：value，使用 ref 声明的响应式数据；
> 参数 2：options，执行节流值调用节流函数的条件，参考 Options

## 基础用法

```vue
<template>
  <div class="box">
    <pre>{{ throttleValue }}</pre>

    <div class="op">
      <input @input="onChange" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useThrottle } from "v3-mhooks";

const inputValue = ref("");

const throttleValue = useThrottle(inputValue, { wait: 1000 });

const onChange = (e: any) => {
  inputValue.value = e.target.value;
};
</script>
```

## API

```typescript
const debouncedValue = useThrottle(
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
