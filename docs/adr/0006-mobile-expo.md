# ADR-0006: Expo (React Native) cho app mobile

**Bối cảnh.** Làm app sau web, muốn tái dùng tối đa code và đội ngũ TypeScript/React.

**Quyết định.** Expo + expo-router, dùng lại `contracts`, `api-client`, `i18n`, `design-tokens`. EAS Build/Submit, Expo Push.

**Hệ quả.** (+) Một ngôn ngữ, chia sẻ 30–40% logic; OTA update. (−) UI phải viết lại cho native (không dùng chung component web).

**Đã cân nhắc.** Flutter (UI đẹp, nhưng không chia sẻ được TS); PWA-only (hạn chế GPS nền, push iOS, camera).
