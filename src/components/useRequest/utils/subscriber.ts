import { isDocumentVisibility, isServer } from './index';
import { LISTENER_TYPE } from './constants';

export type EventFunc = () => void;
export type ListenerSet = Set<EventFunc>;
type ListenerType =
  | LISTENER_TYPE.FOCUS_LISTENER
  | LISTENER_TYPE.VISIBLE_LISTENER
  | LISTENER_TYPE.RECONNECT_LISTENER;

export const focusListeners: ListenerSet = new Set();
export const visibleListeners: ListenerSet = new Set();
export const reconnectListeners: ListenerSet = new Set();

const subscriber = (type: ListenerType, event: EventFunc) => {
  let listeners: ListenerSet;

  switch (type) {
    case LISTENER_TYPE.FOCUS_LISTENER:
      listeners = focusListeners;
      break;
    case LISTENER_TYPE.VISIBLE_LISTENER:
      listeners = visibleListeners;
      break;
    case LISTENER_TYPE.RECONNECT_LISTENER:
      listeners = reconnectListeners;
      break;
  }

  if (listeners.has(event)) return;
  listeners.add(event);

  return () => listeners.delete(event);
};

const observer = (listeners: ListenerSet) => {
  listeners.forEach((listener) => {
    listener();
  });
};

if (!isServer && window?.addEventListener) {
  window.addEventListener(
    'visibilitychange',
    () => {
      if (isDocumentVisibility()) {
        observer(visibleListeners);
      }
    },
    false
  );

  window.addEventListener('focus', () => observer(focusListeners), false);
  window.addEventListener('online', () => observer(reconnectListeners), false);
}

export default subscriber;
