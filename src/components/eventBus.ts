// eventBus.ts
type MessageEventDetail = {
  name: string;
  path: string;
  message: string;
};
type MessageType = "modal" | "alert";

const eventBus = new EventTarget();

export function emitMessage(msgType:MessageType, detail: unknown) {
  eventBus.dispatchEvent(
    new CustomEvent<unknown>(msgType, { detail })
  );
}

export function onMessage(msgType:MessageType, handler: (detail: unknown) => void) {
  const wrapped = (e: Event) =>
    handler((e as CustomEvent<MessageEventDetail>).detail);
  eventBus.addEventListener(msgType, wrapped);
  return () => eventBus.removeEventListener(msgType, wrapped);
}

export default eventBus;


/*
export function emitMessage(detail: MessageEventDetail) {
  eventBus.dispatchEvent(
    new CustomEvent<MessageEventDetail>("message", { detail })
  );
}

export function onMessage(handler: (detail: MessageEventDetail) => void) {
  const wrapped = (e: Event) =>
    handler((e as CustomEvent<MessageEventDetail>).detail);
  eventBus.addEventListener("message", wrapped);
  return () => eventBus.removeEventListener("message", wrapped);
}


*/