---
title: CVNSS4 Trace Learning Pro v4 Pedagogy
emoji: 🇻🇳
colorFrom: blue
colorTo: orange
sdk: static
app_file: index.html
pinned: false
license: mit
---

# CVNSS4.0 Trace Learning Pro v4 — Pedagogy Edition

Gói học online dành cho **bình dân học vụ số**: mở trình duyệt là học, tra cứu, chuyển đổi 2 chiều và xem trace 4 làn cho từng từ.

## Thành phần

- `index.html` — UI/UX học online responsive, hỗ trợ điện thoại, máy tính bảng, desktop.
- `cvnss40_converter_pro_v4_trace.js` — core Pro v4 có `convert`, `convertWord`, `explainWord`, `trace`, `PModule`, `selfTest`.
- `test_node.js` — kiểm thử nhanh bằng Node.js.
- `sample_input.txt` — dữ liệu mẫu.
- `deploy_huggingface.md` — hướng dẫn công bố lên Hugging Face Spaces.
- `run_local_windows.bat`, `run_test_windows.bat` — chạy offline trên Windows.

## Công thức học

> CQN → CVN + KHD + P? = CVNSS4.0

Bố cục sư phạm gồm 5 vùng: Nhập liệu, Kết quả 3 cột, Trace 4 làn, Bảng tuần hoàn quy tắc, Luyện tập.

## Công bố trên Hugging Face Spaces

Tạo Space mới, chọn **Static HTML**, upload toàn bộ file trong gói này vào root. `README.md` đã khai báo:

```yaml
sdk: static
app_file: index.html
```

Nguồn phiên bản: **CVNSS4.0 Trace Learning Pro v4 — Pedagogy Edition, Long Ngo 2025**.
