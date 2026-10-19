export const isHorizontalSwipe = ({ dx, dy }) =>
  Math.abs(dx) > 22 && Math.abs(dx) > Math.abs(dy) * 2.5;
export const monthSwipeDirection = ({ dx, dy }) =>
  isHorizontalSwipe({ dx, dy }) && Math.abs(dx) > 60 ? (dx < 0 ? 1 : -1) : 0;
export const expenseSwipeTarget = (offset, dx) => (offset + dx < -38 ? -84 : 0);
export const shouldDismissSheet = ({ dy, vy }) =>
  dy > 85 || (dy > 25 && vy > 0.8);
