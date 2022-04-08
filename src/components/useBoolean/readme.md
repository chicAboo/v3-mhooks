# useBoolean

useBoolean 用于管理 boolean 状态的 Hook，若不传参，默认值为 false

## 用法

```vue
<template>
  <div class="box">
    <div>{{ toggleValue }}</div>
    <div>{{ state }}</div>

    <button @click="toggle">toggle</button>
    <button @click="setTrue">setTrue</button>
    <button @click="setFalse">setFalse</button>
    <button @click="set(true)">set true</button>
    <button @click="set(false)">set false</button>
  </div>
</template>

<script lang="ts" setup>
import { useBoolean } from "vue3Hooks";
const [toggleValue, { toggle, set, setTrue, setFalse }] = useBoolean();
</script>
```

## API

```typescript
const [ state, { toggle, set, setTrue, setFalse }] = useBoolean(
  defaultValue?: boolean,
);
```

### 参数（Params）

| 参数         | 说明                     | 类型      | 默认值  |
| ------------ | ------------------------ | --------- | ------- |
| defaultValue | 可选项，传入默认的状态值 | `boolean` | `false` |

### 返回值（Result）

| 参数    | 说明     | 类型      |
| ------- | -------- | --------- |
| state   | 状态值   | `boolean` |
| methods | 操作集合 | `Methods` |

### 方法（Methods）

| 参数     | 说明         | 类型                       |
| -------- | ------------ | -------------------------- |
| toggle   | 切换 state   | `() => void`               |
| set      | 设置 state   | `(value: boolean) => void` |
| setTrue  | 设置为 true  | `() => void`               |
| setFalse | 设置为 false | `() => void`               |
