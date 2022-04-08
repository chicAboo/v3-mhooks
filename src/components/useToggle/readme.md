# useToggle

useToggle 是用于在两个状态值间切换的 Hook，参数可以为 0 个，1 个和 2 个：

> 参数只有 0 个时：在 true 和 false 来回切换；
> 参数只有 1 个时：在入参和 false 之间来回切换；
> 参数有 2 个时：在第一个参数和第二个参数之间来回切换；

## 用法

```vue
<template>
  <div class="box">
    <div>{{ toggleValue }}</div>

    <button @click="toggle">toggle</button>
    <button @click="setDefaultValue">setDefaultValue</button>
    <button @click="setReverseValue">setReverseValue</button>
    <button @click="set('useToggle set function')">set1</button>
    <button @click="set('useToggle set is good')">set2</button>
  </div>
</template>

<script lang="ts" setup>
import { useToggle } from "vue3Hooks";
const [toggleValue, { toggle, set, setDefaultValue, setReverseValue }] =
  useToggle("first", "last");
</script>
```

## API

```typescript
const [state, { toggle, set, setDefaultValue, setReverseValue }] = useToggle(defaultValue?: boolean);

const [state, { toggle, set, setDefaultValue, setReverseValue }] = useToggle<T>(defaultValue: T);

const [state, { toggle, set, setDefaultValue, setReverseValue }] = useToggle<T, U>(defaultValue: T, reverseValue: U);
```

### 参数（Params）

| 参数         | 说明                     | 类型 | 默认值  |
| ------------ | ------------------------ | ---- | ------- |
| defaultValue | 可选项，传入默认的状态值 | `T`  | `false` |
| reverseValue | 可选项，传入取反的状态值 | `U`  | -       |

### 返回值（Result）

| 参数    | 说明     | 类型      |
| ------- | -------- | --------- |
| state   | 状态值   | -         |
| methods | 操作集合 | `Methods` |

### 方法（Methods）

| 参数            | 说明                                                                           | 类型                      |
| --------------- | ------------------------------------------------------------------------------ | ------------------------- |
| toggle          | 切换 state                                                                     | `() => void`              |
| set             | 修改 state                                                                     | `(state: T \| U) => void` |
| setDefaultValue | 设置为 defaultValue                                                            | `() => void`              |
| setReverseValue | 如果传入了 reverseValue, 则设置为 reverseValue。 否则设置为 defautValue 的反值 | `() => void`              |
