# apps/mobile – Phase 3 (chưa khởi tạo)

App iOS/Android bằng **Expo + expo-router** (ADR-0006). Khởi tạo ở sprint S8 (task TL-801):

```bash
./dev sh
pnpm create expo-app apps/mobile --template tabs   # rồi đổi name thành @travelpad/mobile
```

Dùng lại: `@travelpad/contracts`, `@travelpad/api-client` (gửi header `X-Client: mobile`), `@travelpad/i18n`, `@travelpad/design-tokens`.
Bản đồ: `@maplibre/maplibre-react-native`. Lưu token: `expo-secure-store`. Push: Expo Notifications.
