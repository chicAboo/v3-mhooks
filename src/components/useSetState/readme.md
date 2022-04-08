# useSetState

useSetState 管理 object 类型 state 的 Hook，入参只能是一个 Object，若参数为空，默认无{}.

## 用法

```vue
<template>
  <div class="box">
    <div>{{ state }}</div>

    <button
      @click="setState({ sex: 'mail', show: () => console.log('hello') })"
    >
      setState({a: 1})
    </button>
    <button @click="setState({ count: state.count + 1 })">count +1</button>
  </div>
</template>

<script lang="ts" setup>
import { useSetState } from "vue3Hooks";
const [state, setState] = useSetState({ name: "zhutao", age: 31, count: 0 });
</script>
```

## API

```typescript
const [state, setState] = useSetState<T extends Record<string, any>>(
  initialState: T = {} as T
): [T, (patch: Partial<T> | ((prevState: T) => Partial<T>)) => void]
```

### 参数（Params）

| 参数         | 说明                     | 类型 | 默认值         |
| ------------ | ------------------------ | ---- | -------------- |
| defaultValue | 可选项，传入默认的状态值 | `T`  | `{key: value}` |

### 返回值（Result）

| 参数     | 说明   | 类型                                   |
| -------- | ------ | -------------------------------------- |
| state    | 状态值 | -                                      |
| setState | 操作   | ((prevState: T) => Partial<T>) => void |
