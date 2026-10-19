import test from "node:test";
import assert from "node:assert/strict";
import {
  isHorizontalSwipe,
  monthSwipeDirection,
  expenseSwipeTarget,
  shouldDismissSheet,
} from "../src/utils/motion.mjs";

test("vertical scroll and small drags do not become horizontal navigation", () => {
  assert.equal(isHorizontalSwipe({ dx: 16, dy: 0 }), false);
  assert.equal(isHorizontalSwipe({ dx: 45, dy: 100 }), false);
  assert.equal(monthSwipeDirection({ dx: 100, dy: 70 }), 0);
  assert.equal(monthSwipeDirection({ dx: -59, dy: 2 }), 0);
  assert.equal(monthSwipeDirection({ dx: -80, dy: 5 }), 1);
  assert.equal(monthSwipeDirection({ dx: 80, dy: 5 }), -1);
});
test("expense swipes reveal editing and can be closed by reversing direction", () => {
  assert.equal(expenseSwipeTarget(0, -20), 0);
  assert.equal(expenseSwipeTarget(0, -70), -84);
  assert.equal(expenseSwipeTarget(-84, 65), 0);
  assert.equal(expenseSwipeTarget(0, 100), 0);
});
test("sheet dismissal needs a deliberate downward gesture", () => {
  assert.equal(shouldDismissSheet({ dy: 10, vy: 2 }), false);
  assert.equal(shouldDismissSheet({ dy: -100, vy: 0 }), false);
  assert.equal(shouldDismissSheet({ dy: 40, vy: 0.2 }), false);
  assert.equal(shouldDismissSheet({ dy: 100, vy: 0.1 }), true);
  assert.equal(shouldDismissSheet({ dy: 30, vy: 1 }), true);
});
