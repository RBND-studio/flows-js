import type { UserConfig } from "@commitlint/types";

const Configuration: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [2, "always", ["js", "react", "react-components"]],
  },
  ignores: [(message) => message.startsWith("@flows/")],
};

export default Configuration;
