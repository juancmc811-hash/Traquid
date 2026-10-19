const { spawn } = require("node:child_process");
const path = require("node:path");
const child = spawn(
  process.execPath,
  [require.resolve("expo/bin/cli"), ...process.argv.slice(2)],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      EXPO_NO_TELEMETRY: "1",
      __UNSAFE_EXPO_HOME_DIRECTORY: path.join(process.cwd(), ".expo-home"),
      DOTSLASH_CACHE: path.join(process.cwd(), ".dotslash"),
    },
  },
);
child.on("exit", (code) => process.exit(code ?? 1));
