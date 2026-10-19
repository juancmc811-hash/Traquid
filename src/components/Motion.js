import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AccessibilityInfo,
  Animated,
  Easing,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  isHorizontalSwipe,
  monthSwipeDirection,
  expenseSwipeTarget,
  shouldDismissSheet,
} from "../utils/motion.mjs";

const MotionContext = createContext(true);
export function MotionProvider({ children }) {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => {
        if (active) setReduced(value);
      })
      .catch(() => {});
    const listener = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduced,
    );
    return () => {
      active = false;
      listener.remove();
    };
  }, []);
  return (
    <MotionContext.Provider value={reduced}>{children}</MotionContext.Provider>
  );
}
export const useReducedMotion = () => useContext(MotionContext);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function MotionPressable({ style, onPressIn, onPressOut, ...props }) {
  const [pressed, setPressed] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;
  const reduced = useReducedMotion();
  const animate = (value) => {
    scale.stopAnimation();
    if (reduced) scale.setValue(1);
    else
      Animated.timing(scale, {
        toValue: value,
        duration: value < 1 ? 70 : 140,
        easing: Easing.out(Easing.cubic),
        isInteraction: false,
        useNativeDriver: true,
      }).start();
  };
  return (
    <AnimatedPressable
      {...props}
      onPressIn={(event) => {
        if (typeof style === "function") setPressed(true);
        animate(0.985);
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        if (typeof style === "function") setPressed(false);
        animate(1);
        onPressOut?.(event);
      }}
      style={[
        typeof style === "function" ? style({ pressed }) : style,
        {
          transform: [
            ...(StyleSheet.flatten(
              typeof style === "function" ? style({ pressed }) : style,
            )?.transform || []),
            { scale },
          ],
        },
      ]}
    />
  );
}

export function EnterView({ children, trigger, style, delay = 0 }) {
  const progress = useRef(new Animated.Value(1)).current;
  const reduced = useReducedMotion();
  useEffect(() => {
    progress.stopAnimation();
    if (reduced) {
      progress.setValue(1);
      return;
    }
    progress.setValue(0);
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: 160,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
      isInteraction: false,
    });
    animation.start();
    return () => animation.stop();
  }, [trigger, reduced, progress, delay]);
  return (
    <Animated.View
      style={[
        style,
        {
          opacity: progress,
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [4, 0],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

export function SwipeSurface({ children, onSwipe, style }) {
  const x = useRef(new Animated.Value(0)).current;
  const callback = useRef(onSwipe);
  callback.current = onSwipe;
  const reduced = useReducedMotion();
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;
  const reset = () =>
    Animated.spring(x, {
      toValue: 0,
      stiffness: 320,
      damping: 30,
      useNativeDriver: true,
    }).start();
  const responder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => isHorizontalSwipe(gesture),
      onPanResponderMove: (_, gesture) => {
        if (!reducedRef.current)
          x.setValue(Math.max(-38, Math.min(38, gesture.dx * 0.3)));
      },
      onPanResponderRelease: (_, gesture) => {
        reset();
        const direction = monthSwipeDirection(gesture);
        if (direction) callback.current(direction);
      },
      onPanResponderTerminate: reset,
    }),
  ).current;
  return (
    <Animated.View
      {...responder.panHandlers}
      style={[style, { transform: [{ translateX: x }] }]}
    >
      {children}
    </Animated.View>
  );
}

export function SwipeExpense({ children, onEdit }) {
  const x = useRef(new Animated.Value(0)).current;
  const [open, setOpen] = useState(false);
  const offset = useRef(0);
  const reduced = useReducedMotion();
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;
  const settle = (value) => {
    offset.current = value;
    setOpen(value !== 0);
    if (reducedRef.current) x.setValue(value);
    else
      Animated.spring(x, {
        toValue: value,
        stiffness: 350,
        damping: 32,
        useNativeDriver: true,
      }).start();
  };
  const responder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => isHorizontalSwipe(gesture),
      onPanResponderGrant: () =>
        x.stopAnimation((value) => {
          offset.current = value;
        }),
      onPanResponderMove: (_, gesture) =>
        x.setValue(Math.max(-84, Math.min(0, offset.current + gesture.dx))),
      onPanResponderRelease: (_, gesture) =>
        settle(expenseSwipeTarget(offset.current, gesture.dx)),
      onPanResponderTerminate: () => settle(0),
    }),
  ).current;
  return (
    <View style={{ overflow: "hidden", borderRadius: 12 }}>
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            alignItems: "flex-end",
            justifyContent: "center",
            backgroundColor: "#E0EAD8",
          },
        ]}
        pointerEvents={open ? "auto" : "none"}
        accessibilityElementsHidden={!open}
        importantForAccessibility={open ? "auto" : "no-hide-descendants"}
      >
        <MotionPressable
          accessibilityRole="button"
          accessibilityLabel="Editar este gasto"
          onPress={() => {
            settle(0);
            onEdit();
          }}
          style={{
            width: 84,
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#245C43", fontSize: 12, fontWeight: "600" }}>
            Editar
          </Text>
        </MotionPressable>
      </View>
      <Animated.View
        {...responder.panHandlers}
        style={{ backgroundColor: "#F8FAF2", transform: [{ translateX: x }] }}
      >
        {children}
      </Animated.View>
    </View>
  );
}

export function BottomSheet({ children, style, onClose }) {
  const y = useRef(new Animated.Value(0)).current;
  const reduced = useReducedMotion();
  const latest = useRef({ onClose, reduced });
  latest.current = { onClose, reduced };
  useEffect(() => {
    y.setValue(reduced ? 0 : 24);
    const animation = Animated.timing(y, {
      toValue: 0,
      duration: reduced ? 0 : 180,
      easing: Easing.out(Easing.cubic),
      isInteraction: false,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [y, reduced]);
  const close = () => {
    if (latest.current.reduced) latest.current.onClose();
    else
      Animated.timing(y, {
        toValue: 600,
        duration: 180,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) latest.current.onClose();
      });
  };
  const responder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        gesture.dy > 8 && Math.abs(gesture.dy) > Math.abs(gesture.dx),
      onPanResponderMove: (_, gesture) => y.setValue(Math.max(0, gesture.dy)),
      onPanResponderRelease: (_, gesture) => {
        if (shouldDismissSheet(gesture)) close();
        else
          Animated.spring(y, {
            toValue: 0,
            damping: 30,
            stiffness: 300,
            useNativeDriver: true,
          }).start();
      },
      onPanResponderTerminate: () => y.setValue(0),
    }),
  ).current;
  return (
    <Animated.View style={[style, { transform: [{ translateY: y }] }]}>
      <View
        {...responder.panHandlers}
        style={{ height: 28, alignItems: "center", justifyContent: "center" }}
      >
        <View
          style={{
            width: 38,
            height: 4,
            borderRadius: 4,
            backgroundColor: "#B4C2AA",
          }}
        />
      </View>
      {children}
    </Animated.View>
  );
}
