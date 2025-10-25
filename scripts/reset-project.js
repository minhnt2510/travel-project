const fs = require("fs");
const path = require("path");
const readline = require("readline");

const root = process.cwd();
const THIS_FILE = path.resolve(process.argv[1]);
const THIS_DIR = path.dirname(THIS_FILE);

const TARGET_DIRS = ["app", "components", "hooks", "constants"];
const EXAMPLE_DIR = "app-example";
const NEW_APP_DIR = "app";
const indexContent = `import { Text, View } from "react-native";

export default function Index() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
`;
const layoutContent = `import { Stack } from "expo-router";
export default function RootLayout() { return <Stack />; }
`;

const DRY_RUN = process.argv.includes("--dry");
const FORCE = process.argv.includes("--force");

async function exists(p) {
  try {
    await fs.promises.stat(p);
    return true;
  } catch {
    return false;
  }
}
async function ensureDir(p) {
  if (DRY_RUN) return;
  await fs.promises.mkdir(p, { recursive: true });
}
async function rmrf(p) {
  if (DRY_RUN) {
    console.log(`[dry] rm -rf ${path.relative(root, p)}`);
    return;
  }
  await fs.promises.rm(p, { recursive: true, force: true });
}
async function writeFile(p, content) {
  if (DRY_RUN) {
    console.log(`[dry] write ${path.relative(root, p)}`);
    return;
  }
  await fs.promises.writeFile(p, content);
}
async function safeMove(src, dst) {
  if (DRY_RUN) {
    console.log(`[dry] move ${src} -> ${dst}`);
    return;
  }
  await fs.promises.mkdir(path.dirname(dst), { recursive: true });
  try {
    await fs.promises.rename(src, dst);
  } catch (err) {
    if (err.code === "EXDEV") {
      await fs.promises.cp(src, dst, { recursive: true });
      await fs.promises.rm(src, { recursive: true, force: true });
    } else {
      throw err;
    }
  }
}

async function run(mode) {
  const exampleDirPath = path.join(root, EXAMPLE_DIR);
  if (mode === "move") {
    if (await exists(exampleDirPath)) {
      if (!FORCE) {
        const postfix = new Date().toISOString().replace(/[:.]/g, "-");
        const renamed = `${EXAMPLE_DIR}-${postfix}`;
        console.log(`⚠️  /${EXAMPLE_DIR} đã tồn tại → đổi thành /${renamed}`);
        if (!DRY_RUN)
          await fs.promises.rename(exampleDirPath, path.join(root, renamed));
      } else {
        console.log(`⚠️  /${EXAMPLE_DIR} đã tồn tại → ghi đè (--force)`);
        await rmrf(exampleDirPath);
      }
    }
    await ensureDir(exampleDirPath);
    console.log(
      `📁 ${DRY_RUN ? "[dry] would create" : "created"} /${EXAMPLE_DIR}`
    );
  }

  // 2) Move or delete target dirs
  for (const dir of TARGET_DIRS) {
    const oldDirPath = path.join(root, dir);
    if (!(await exists(oldDirPath))) {
      console.log(`➡️  /${dir} không tồn tại, bỏ qua.`);
      continue;
    }
    // Đừng đụng thư mục chứa chính script (an toàn)
    if (path.resolve(oldDirPath) === THIS_DIR) {
      console.log(`⛔ Bỏ qua /${dir} (đang chạy từ đây).`);
      continue;
    }

    if (mode === "move") {
      const newDirPath = path.join(exampleDirPath, dir);
      await safeMove(oldDirPath, newDirPath);
      console.log(`➡️  /${dir} → /${EXAMPLE_DIR}/${dir}`);
    } else {
      await rmrf(oldDirPath);
      console.log(`❌  /${dir} đã xoá.`);
    }
  }

  // 3) Create fresh /app
  const newAppDirPath = path.join(root, NEW_APP_DIR);
  if (await exists(newAppDirPath)) {
    if (!FORCE) {
      console.log(
        `⚠️  /${NEW_APP_DIR} đã tồn tại. Dùng --force để ghi đè, hoặc xoá thủ công rồi chạy lại.`
      );
      return;
    }
    await rmrf(newAppDirPath);
  }
  await ensureDir(newAppDirPath);
  await writeFile(path.join(newAppDirPath, "index.tsx"), indexContent);
  await writeFile(path.join(newAppDirPath, "_layout.tsx"), layoutContent);

  console.log("\n✅ Hoàn tất reset. Next steps:");
  console.log("1) npx expo start");
  console.log(
    `2) Chỉnh /${NEW_APP_DIR}/index.tsx theo nhu cầu.${
      mode === "move" ? `\n3) Tham khảo bản backup: /${EXAMPLE_DIR}` : ""
    }`
  );
}

(async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question(
    "Move các thư mục cũ vào /app-example thay vì xoá? (Y/n): ",
    async (answer) => {
      const a = (answer || "y").trim().toLowerCase();
      if (a !== "y" && a !== "n") {
        console.log("❌ Input không hợp lệ. Vui lòng nhập Y hoặc N.");
        rl.close();
        return;
      }
      try {
        await run(a === "y" ? "move" : "delete");
      } catch (e) {
        console.error(`❌ Lỗi: ${e.message}`);
      } finally {
        rl.close();
      }
    }
  );
})();
