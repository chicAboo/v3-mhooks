# useLockFn

useLockFn 用于给异步函数一个锁，防止并发执行，多用于保存、提交等操作，入参为一个异步函数。

## 用法

```vue
<template>
  <div class="box">
    <pre>{{ count }}</pre>

    <div class="op">
      <button @click="submit">submit</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useLockFn } from "v3-hooks";

const count = ref(0);

function mockApiPromise() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 4000);
  });
}

const submit = useLockFn(async () => {
  console.log("start to submit");
  await mockApiPromise();

  count.value += 1;
  console.log("submit finished");
});
</script>
```

### API

```typescript
function useLockFn<P extends any[] = any[]>(
  fn: (...args: P) => Promise<any>
): fn: (...args: P) => Promise<any>
```

### 返回值（Result）

| 参数 | 说明               | 类型                               |
| ---- | ------------------ | ---------------------------------- |
| fn   | 增加了竞态锁的函数 | `(...args: any[]) => Promise<any>` |

### 参数（Params）

| 参数 | 说明                 | 类型                               | 默认值 |
| ---- | -------------------- | ---------------------------------- | ------ |
| fn   | 需要增加竞态锁的函数 | `(...args: any[]) => Promise<any>` | -      |
