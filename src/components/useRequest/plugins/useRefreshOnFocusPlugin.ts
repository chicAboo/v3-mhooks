import { onUnmounted } from 'vue-demi';
import limit from '../utils/limit';
import type { EventFunc, ListenerSet } from '../utils/subscriber';
import subscriber from '../utils/subscriber';
import { LISTENER_TYPE } from '../utils/constants';

type RefreshOnFocus = {
  refocusTimespan: number; // 重新聚焦的间隔时间
  refreshOnWindowFocus: boolean; // 聚焦时重新请求
  refresh: () => void; // 重新请求函数
};

/**
 * 浏览器窗口触发，focus和visiblechange时，会重新发起请求
 * @param param<RefreshOnFocus>
 * @returns
 */
const useRefreshOnFocusPlugin = ({
  refocusTimespan,
  refreshOnWindowFocus,
  refresh,
}: RefreshOnFocus) => {
  const unSubscribeList: ListenerSet = new Set();

  const addUnSubscribeList = (event?: EventFunc) => {
    event && unSubscribeList.add(event);
  };

  const limitTragger = limit(refresh, refocusTimespan);
  if (refreshOnWindowFocus) {
    addUnSubscribeList(subscriber(LISTENER_TYPE.VISIBLE_LISTENER, limitTragger));
    addUnSubscribeList(subscriber(LISTENER_TYPE.FOCUS_LISTENER, limitTragger));
  }

  onUnmounted(() => {
    unSubscribeList.forEach((event: EventFunc) => event());
  });

  return;
};

export default useRefreshOnFocusPlugin;
