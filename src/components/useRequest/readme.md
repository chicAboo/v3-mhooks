# useRequest

useRequest 是一个强大的异步数据管理 hooks，在 vue3 项目中的网络请求，使用 useRequest 就够了。目前已有能力包括：

- 全局配置
- 所有数据都是响应式
- 自动请求/手动请求
- 轮询请求
- 缓存和 SWR
- 防抖和节流请求
- 屏幕聚焦重新请求
- 错误重试
- loading delay
- 数据更改
- 依赖刷新

## API

### 全局配置

通过导出的 setGlobalOptions()方法，可以控制一些配置，避免频繁配置相同的参数。全局配置参数如下：

| 参数                 | 说明                                                                                                                                             | 类型                                | 默认值    |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------- | --------- |
| loadingDelay         | 延迟加载的毫秒数，可通过设置 loadingdelay 为 true，防止请求过快，造成的屏幕闪烁                                                                  | `number`                            | 0         |
| pollingInterval      | 轮询间隔的毫秒数                                                                                                                                 | `number`                            | undefined |
| pollingWhenHidden    | pollingInterval 大于 0 时，屏幕不可见时，会暂停轮询，当设置 pollingWhenHidden 为 true 时，屏幕不可见仍会执行轮询任务                             | `boolean`                           | false     |
| pollingWhenOffline   | pollingInterval 大于 0 时，网络不可用时，会暂停轮询，当设置 pollingWhenOffline 为 true 时，断网后仍会执行轮询任务                                | `boolean`                           | false     |
| debounce             | 是否启用防抖模式                                                                                                                                 | `boolean`                           | false     |
| debounceOptions      | 是否启用防抖模式                                                                                                                                 | [DebounceOptions](#debounceoptions) | {}        |
| throttle             | 是否启用节流模式                                                                                                                                 | `boolean`                           | false     |
| throttleOptions      | 是否启用节流模式                                                                                                                                 | [ThrottleOptions](#throttleoptions) | {}        |
| refreshOnWindowFocus | 设置 refreshOnWindowFocus 为 true ，当屏幕发生 focus 和 visiblechange 事件时，会重新发起请求                                                     | `boolean`                           | false     |
| refocusTimespan      | refreshOnWindowFocus 为 true 时，可以设置间隔执行的毫秒数                                                                                        | `number`                            | 5000      |
| cacheTime            | 设置缓存的毫秒数                                                                                                                                 | `number`                            | 60000     |
| manual               | 手动请求                                                                                                                                         | `boolean`                           | false     |
| retryCount           | 错误重试最大次数                                                                                                                                 | `number`                            | 0         |
| retryInterval        | 错误重试间隔毫秒数，若不设置会采用指数退避算法，取`1000 * 2 ** retryCount`，也就是第一次 2s，第二次 4s，第三次 8s，如果大于 30s，取 30s          | `number`                            | 0         |
| staleTime            | 如果能确定缓存下来的数据在一定时间内不会有任何更新，可以设置一个合理的毫秒数，默认为 0，表示不保鲜，每次都需要发请求；设置为-1，表示缓存永不过期 | `number`                            | 0         |

#### DebounceOptions

| 参数     | 说明                     | 类型      | 默认值  |
| -------- | ------------------------ | --------- | ------- |
| wait     | 等待时间，单位为毫秒     | `number`  | `1000`  |
| leading  | 是否在延迟开始前调用函数 | `boolean` | `false` |
| trailing | 是否在延迟开始后调用函数 | `boolean` | `true`  |
| maxWait  | 最大等待时间，单位为毫秒 | `number`  | -       |

#### ThrottleOptions

| 参数     | 说明                     | 类型      | 默认值  |
| -------- | ------------------------ | --------- | ------- |
| wait     | 等待时间，单位为毫秒     | `number`  | `1000`  |
| leading  | 是否在延迟开始前调用函数 | `boolean` | `false` |
| trailing | 是否在延迟开始后调用函数 | `boolean` | `true`  |

### 其他配置

每个独立的请求，除了可以配置`globalOptions`的配置之外，还可以单独配置如下属性：

| 参数          | 说明                                                                                                                                           | 类型                             | 默认值    |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | --------- |
| defaultParams | 如果 manual 设为 false，在自动执行 run 方法时，会将 defaultParams 作为请求参数                                                                 | `P[]`                            | []        |
| refreshDeps   | 依赖刷新，refreshDeps 变化，会触发 refresh 方法的重新执行                                                                                      | `WatchSource<any>[]`             | []        |
| cacheKey      | 缓存，设置 cacheKey 后，useRequest 会将请求的数据缓存起来，当下次初始化时，会将缓存的数据返回渲染，再重新请求，更新缓存数据，这就是`SWR`的能力 | `string`                         | undefined |
| onSuccess     | 请求成功的回调                                                                                                                                 | `(data: R, params: P[]) => void` | undefined |
| onError       | 请求失败的回调                                                                                                                                 | `(data: R, params: P[]) => void` | undefined |
| onBefore      | 请求执行前的回调                                                                                                                               | `(params: P[]) => void`          | undefined |
| onAfter       | 请求执行后的回调，无论成功还是失败                                                                                                             | `(params: P[]) => void`          | undefined |

## 文档

### 全局配置

通过导出的 `setGlobalOptions()`方法，可以控制一些配置，避免频繁配置相同的参数。在每个项目的入口处进行配置，如下：

```ts
import { createApp } from "vue";
import App from "./App.vue";

import { setGlobalOptions } from "vue3Hooks";

setGlobalOptions({
  manual: true,
});

createApp(App).mount("#app");
```

### 数据请求

```ts
const { loading, data, error } = useRequest(service, options);
```

上面的 service 可以表示一个请求接口的，`字符串`、`对象`或`函数`，当请求完成后，会返回 loading、data、error 等数据。

#### 字符串

如果请求的接口足够简单，可以传一个接口字符串，后台会使用 axios 进行 get 请求

```ts
const { loading, data } = useRequest("api/simple-api");
```

#### 对象

当然，也可以传入一个对象，配置 URL 相关属性，后台也会自动处理，请参考[axios config](https://www.kancloud.cn/yunye/axios/234845)

```ts
const { loading, data } = useRequest({
  url: "http://www.tianqiapi.com/api",
  method: "GET",
  params: {
    version: "v9",
    appid: "23035354",
    appsecret: "8YvlPNrz",
  },
});
```

#### 函数（推荐）

我们可以定义好请求的函数，请求方法可以是 Ajax，可以是 axios，可以是 fetch 等库，封装好请求函数传入 useRequest，该函数返回一个 Promise 对象，最终如果成功则将值传给 data，如果失败传给 error，如下：

```ts
import { useRequest } from "vue3Hooks";
import axios from "axios";

function getMockData() {
  return axios.get("http://www.tianqiapi.com/api", {
    params: {
      version: "v9",
      appid: "23035354",
      appsecret: "8YvlPNrz",
    },
  });
}

const { loading, data } = useRequest(getMockData);
```

### 手动触发请求

默认情况下，组件挂载时，会自动触发绑定的请求，如果你想要手动控制触发时机，可通过在 options 中配置 manual 为 true，会禁止默认触发请求，只有调用返回的 run 方法，才会执行绑定的请求，如下：

```vue
<template>
  <div class="box">
    <span>{{ loading ? "正在请求中..." : "" }}</span>
    <p>{{ data }}</p>

    <div class="op">
      <button @click="run()">请求</button>
    </div>
  </div>
</template>

<script lang="ts">
import { useRequest } from "vue3Hooks";
import axios from "axios";

function getMockData() {
  return axios.get("http://www.tianqiapi.com/api", {
    params: {
      version: "v9",
      appid: "23035354",
      appsecret: "8YvlPNrz",
    },
  });
}

const { loading, data } = useRequest(getMockData, { manual: true });
</script>
```

### 数据更改

当请求回来的数据需要更改时，可以使用 `mutate()`方法直接修改 data，如下

```vue
<template>
  <div class="box">
    <span>{{ loading ? "正在请求中..." : "" }}</span>
    <p>{{ data }}</p>

    <div class="op">
      <button @click="run()">请求</button>
      <button @click="onChangeName">改变名称为李四</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRequest } from "vue3Hooks";

function getMockData() {
  return new Promise((resolve) => {
    resolve("张三");
  });
}

const { loading, data, mutate, run } = useRequest(getMockData, {
  manual: true,
});

const onChangeName = () => {
  mutate("李四");
};
</script>
```

### 轮询

通过设置`options.pollingInterval`，进入轮询模式，pollingInterval 是轮询的间隔毫秒数，如下：

```vue
<template>
  <div class="box">
    <p>{{ data }}</p>
  </div>
</template>

<script lang="ts" setup>
import { useRequest } from "vue3Hooks";

function getMockData() {
  return new Promise((resolve) => {
    resolve(+new Date());
  });
}

const { loading, data, run } = useRequest(getMockData, {
  pollingInterval: 1000,
});
</script>
```

#### 屏幕不可见时轮询

默认情况，屏幕不可见时会暂停轮询，当屏幕聚焦时，重新激活轮询。如果想在屏幕不可见时也执行轮询，则设置 pollingWhenHidden 为 true，如下所示：

```ts
import { useRequest } from "vue3Hooks";

function getMockData() {
  return new Promise((resolve) => {
    resolve(+new Date());
  });
}

const { loading, data, run } = useRequest(getMockData, {
  pollingInterval: 1000,
  pollingWhenHidden: true,
});
```

#### 断网时轮询

默认情况，在断网时会停止轮询，当网络恢复正常时，重新激活轮询。如果需要在断网时也发起轮询，设置 pollingWhenOffline 为 true，如下所示：

```ts
import { useRequest } from "vue3Hooks";

function getMockData() {
  return new Promise((resolve) => {
    resolve(+new Date());
  });
}

const { loading, data, run } = useRequest(getMockData, {
  pollingInterval: 1000,
  pollingWhenOffline: true,
});
```

### 聚焦时重新请求

当设置`refreshOnWindowFocus`为 true 时，当浏览器聚焦时，会重新发起请求，如下：

```ts
import { useRequest } from "vue3Hooks";

function getMockData() {
  return new Promise((resolve) => {
    resolve(+new Date());
  });
}

const { loading, data, run } = useRequest(getMockData, {
  refreshOnWindowFocus: true,
});
```

为了防止频繁切换聚焦，频繁请求，设置了间隔大于 5000ms 时，会重新发起请求。我们还可以通过设置`refocusTimespan`来自定义间隔的毫秒数，如下：

```ts
import { useRequest } from "vue3Hooks";

function getMockData() {
  return new Promise((resolve) => {
    resolve(+new Date());
  });
}

const { loading, data, run } = useRequest(getMockData, {
  refreshOnWindowFocus: true,
  refocusTimespan: 10000,
});
```

上面设置了，当屏幕失去焦点 10s，在聚焦时，会重新发送请求。

注：重新请求监听的浏览器事件为`visibilitychange`和`focus`。

### 防抖

useRequest 提供了防抖请求，当频繁触发请求时，可以设置 debouce 为 true，在指定时间内会将其合成一次执行，默认是 1s。如下：

```ts
import { useRequest } from "vue3Hooks";

function getMockData() {
  return new Promise((resolve) => {
    resolve(+new Date());
  });
}

const { loading, data, run } = useRequest(getMockData, {
  debounce: true,
  debounceOptions: { wait: 500, maxWait: 2000 },
});
```

上面代码中的`debounceOptions`的属性，参考[debounceOptions](#debounceoptions)

### 节流

useRequest 提供了节流请求，如果频繁触发 run 方法，则可以通过设置 throttle 为 true，将开启节流，如下：

```ts
import { useRequest } from "vue3Hooks";

function getMockData() {
  return new Promise((resolve) => {
    resolve(+new Date());
  });
}

const { loading, data, run } = useRequest(getMockData, {
  throttle: true,
  throttleOptions: { wait: 500 },
});
```

如果频繁触发 run 方法，间隔 500ms 会执行一次，throttleOptions 还有其他参数，可以参考：[ThrottleOptions](#throttleoptions)

### 依赖刷新

有时候需要依赖某个变量的值，当值改变时重新请求，可以通过`refreshDeps`设置依赖项，本质是对`watch`的封装，如下：

```vue
<template>
  <div class="box">
    <span>{{ loading ? "正在请求中..." : "" }}</span>
    <p>{{ data }}</p>
    <input @blur="onBlur" />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { useRequest } from "vue3Hooks";

function getMockData() {
  return new Promise((resolve) => {
    resolve(+new Date());
  });
}

const depsValue = ref();

const { loading, data, run } = useRequest(getMockData, {
  refreshDeps: [depsValue],
});

const onBlur = (evt: any) => {
  depsValue.value = evt.target.value;
};
</script>
```

### 延迟状态加载

当请求足够快的时候，loading 会在短时间内从`false -> true -> false`状态切换，这时候加载动画会有闪烁的情况，这对用户来说是很糟糕的体验。避免这种情况，可以设置延迟值，当等待时间大于延迟值时，loading 才会被设置成 true，如下所示：

```vue
<template>
  <div class="box">
    <span>{{ loading ? "正在请求中..." : "" }}</span>
    <p>{{ data }}</p>

    <div class="op">
      <button @click="run()">请求</button>
      <button @click="onChangeName">改变名称为李四</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { useRequest } from "vue3Hooks";

function getMockData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(+new Date());
    }, 1000);
  });
}

const depsValue = ref();

const { loading, data, run } = useRequest(getMockData, {
  loadingDelay: 500,
});
</script>
```

模拟一个接口需要 1000ms 才能请求成功，设置`loadingDelay`为 500ms，当 500ms 请求还未成功时，设置 loading 为 true，如果 500ms 请求成功，则 loading 状态不变。

### 缓存 和 SWR

可以设置`cacheKey`来启用缓存功能，当启用后，后台会将请求出的数据缓存下来。当下次请求时，如果有缓存数据，会优先返回缓存的数据，然后再背后发起新的请求，也就是 预加载(SWR) 的能力。如下所示：

```vue
<template>
  <div class="box">
    <span>{{ loading ? "正在请求中..." : "" }}</span>
    <p>{{ data }}</p>

    <div class="op">
      <button @click="run()">请求</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { useRequest } from "vue3Hooks";

function getMockData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(+new Date());
    }, 1000);
  });
}

const { loading, data, run } = useRequest(getMockData, {
  cacheKey: "date",
});
</script>
```

上面的代码，默认请求后回拿到一个时间戳返回，后台会将返回的时间戳记录在缓存中，当点击请求时，后台会查找缓存中是否有 key 为 date 的缓存，如果有，会先返回缓存值，然后再请求接口。

#### 缓存时间

可以设置缓存时间`cacheTime`（默认为 600000ms，即 10 分钟），如果超过缓存时间，等下次发起请求时，会重新请求数据，如下：

```vue
<template>
  <div class="box">
    <span>{{ loading ? "正在请求中..." : "" }}</span>
    <p>{{ data }}</p>

    <div class="op">
      <button @click="run()">请求</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { useRequest } from "vue3Hooks";

function getMockData() {
  return new Promise((resolve) => {
    resolve(+new Date());
  });
}

const { loading, data, run } = useRequest(getMockData, {
  cacheKey: "date",
  cacheTime: 10000,
});
</script>
```

上面将缓存时间设置为 10s，当下次请求的时间在 10s 内，会丢弃缓存的数据，重新请求。

#### 保鲜时间

如果缓存下来的数据在一段时间内不会有任何更新，可以设置一个保鲜时间`staleTime`（默认为 0， 即不保鲜），当设置保鲜时间后，在这个期间内，不会发起请求，返回的是缓存中的值。如下：

```vue
<template>
  <div class="box">
    <span>{{ loading ? "正在请求中..." : "" }}</span>
    <p>{{ data }}</p>

    <div class="op">
      <button @click="run()">请求</button>
      <button @click="onChangeName">改变名称为李四</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { useRequest } from "vue3Hooks";

function getMockData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(+new Date());
    }, 1000);
  });
}

const { loading, data, run } = useRequest(getMockData, {
  cacheKey: "date",
  staleTime: 10000,
});

watch(data, (newData) => {
  console.log("test", newData);
});
</script>
```

上面设置了保鲜时间为 10s，在 10s 内，点请求按钮，都回拿缓存的数据返回。
