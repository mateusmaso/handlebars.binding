import Observe from "observe-js";

export default function update() {
  Platform.performMicrotaskCheckpoint();
};
