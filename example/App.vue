<template>
  <div class="box">
    <!-- <span>{{ loading ? '正在请求中...' : '' }}</span> -->
    <p>{{ `${isModal}` }}</p>

    <div class="op">
      <button @click="toggle">请求</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useBoolean } from 'v3-mhooks';

const [isModal, { toggle }] = useBoolean();
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
