<template>
  <div class="box">
    <!-- <span>{{ loading ? '正在请求中...' : '' }}</span> -->
    <p>{{ data }}</p>

    <div class="op">
      <button @click="run()">请求</button>
      <button @click="onChangeName">改变名称为李四</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRequest } from 'v3-mhooks';

function getMockData(count: number) {
  return new Promise((resolve) => {
    // setTimeout(() => {
    resolve(count);
    // }, 1000);
  });
}
let count = 0;
const { loading, data, run } = useRequest(() => getMockData((count += 1)), {
  throttle: true,
  manual: true,
});

watch(data, (newData) => {
  console.log('test', newData);
});
</script>

<style>
.box {
  width: 600px;
  height: 200px;
  border: 1px solid #ebedf1;
  margin: 50px auto;
  padding: 10px;
}
.box > div,
.box > p,
.box > pre {
  padding: 10px 0;
  border-bottom: 1px solid #ebedf1;
}
.box .op {
  border: none;
}
.box button {
  margin-right: 10px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  color: rgba(0, 0, 0, 0.84);
  background: #fff;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}
.box button:hover {
  border-color: #2a8efe;
  color: #2a8efe;
}
</style>
