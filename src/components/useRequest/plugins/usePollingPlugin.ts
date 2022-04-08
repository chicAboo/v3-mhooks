import type { Ref } from 'vue';
import { onUnmounted } from 'vue';
import type { EventFunc, ListenerSet } from '../utils/subscriber';
import subscriber from '../utils/subscriber';
import { isNil, isDocumentVisibility, isOnline } from '../utils';
import { LISTENER_TYPE } from '../utils/constants';

type Polling = {
  error: Ref<boolean>;
  retryCount: number;
  pollingInterval: number; // 轮询的间隔毫秒值
  pollingWhenHidden: boolean; // 屏幕不可见时，会暂停轮询，值为true，不可见时仍然轮询
  pollingWhenOffline: boolean; // 网络不可用时，暂停轮询，值为true，网络不可用仍然轮询
  stopPollingWhenHiddenOrOffline: Ref<boolean>;
  refresh: () => void;
};

/**
 * 轮询
 * @param param
 * @param pollingFunc
 * @returns
 */
const usePollingPlugin = ({
  error,
  retryCount,
  pollingInterval,
  pollingWhenHidden,
  pollingWhenOffline,
  stopPollingWhenHiddenOrOffline,
  refresh,
}: Polling) => {
  const unSubscribeList: ListenerSet = new Set();

  // 轮询
  const polling = (pollingFunc: () => void) => {
    if (error.value && retryCount !== 0) {
      return;
    }
    let timerId: number;
    if (!isNil(pollingInterval) && pollingInterval! >= 0) {
      if ((pollingWhenHidden || isDocumentVisibility()) && (pollingWhenOffline || isOnline())) {
        timerId = setTimeout(pollingFunc, pollingInterval);
      } else {
        stopPollingWhenHiddenOrOffline.value = true;
        return;
      }
    }

    return () => timerId && clearTimeout(timerId);
  };

  // 重新开始轮询
  const rePolling = () => {
    if (
      stopPollingWhenHiddenOrOffline.value &&
      (pollingWhenHidden || isDocumentVisibility()) &&
      (pollingWhenOffline || isOnline())
    ) {
      refresh();
      stopPollingWhenHiddenOrOffline.value = false;
    }
  };

  const addUnSubscribeList = (event?: EventFunc) => {
    event && unSubscribeList.add(event);
  };

  if (!pollingWhenHidden) {
    addUnSubscribeList(subscriber(LISTENER_TYPE.VISIBLE_LISTENER, rePolling));
  }

  if (!pollingWhenOffline) {
    addUnSubscribeList(subscriber(LISTENER_TYPE.RECONNECT_LISTENER, rePolling));
  }

  onUnmounted(() => {
    unSubscribeList.forEach((event: EventFunc) => event());
  });

  return { polling, rePolling };
};

export default usePollingPlugin;
