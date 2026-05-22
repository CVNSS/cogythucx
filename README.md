Pedagogy Edition (Pro v4)
title: CVNSS4.0 Trace Learning Pro v4
emoji: 📘
colorFrom: blue
colorTo: green
sdk: static
app_file: index.html
pinned: false
license: mit
---

# CVNSS4.0 Trace Learning Pro v4 — Pedagogy Edition  
## Bảng tuần hoàn quy tắc CVNSS4.0 + Trace 4 làn học online

**Website:** https://cvnss.github.io/cogythucx/  
**Repository:** https://github.com/CVNSS/cogythucx  
**License:** MIT  
**Phiên bản:** Pro v4 Pedagogy Edition  
**Thiết kế & đóng gói học online:** Long Ngo, 2026  

---

## 🇻🇳 Giới thiệu

**CVNSS4.0 Trace Learning Pro v4 — Pedagogy Edition** là một website học online dành cho **bình dân học vụ**, giáo viên, học sinh, sinh viên, người nghiên cứu tiếng Việt, công nghệ giáo dục và các nhà phát triển muốn học **Chữ VN Song Song 4.0 (CVNSS4.0)** theo cách trực quan, dễ hiểu và có thể kiểm chứng từng bước.

Dự án kết hợp:

1. **Bảng tuần hoàn quy tắc CVNSS4.0**  
   Các quy tắc được trình bày thành bản đồ học nhanh, có nhóm màu, thẻ quy tắc, ví dụ và phân vùng trực quan.

2. **Bộ chuyển đổi CVNSS4.0 Pro v4**  
   Hỗ trợ chuyển đổi hai chiều giữa **Chữ Quốc ngữ (CQN)** và **CVNSS4.0**.

3. **Trace 4 làn cho từng từ**  
   Mỗi từ được diễn giải theo công thức học:

```text
CQN → CVN + KHD + P? = CVNSS4.0
```

Mục tiêu của dự án là biến một hệ quy tắc tương đối phức tạp thành một công cụ học tập **bình dân, hiện đại, trực quan, dễ dùng trên mọi thiết bị**.

---

## 🌐 Truy cập nhanh

| Nội dung | Đường dẫn |
|---|---|
| Website học online | https://cvnss.github.io/cogythucx/ |
| Repository GitHub | https://github.com/CVNSS/cogythucx |
| Tên repo cũ trong giai đoạn phát triển | `cvnss40-trace-learning-pro-v4` |
| Công nghệ triển khai | Static HTML, CSS, JavaScript |
| Giấy phép | MIT License |

---

## 🧭 Triết lý thiết kế sư phạm

Dự án được thiết kế theo hướng:

- **Bình dân học vụ:** dễ tiếp cận, dễ học, không đòi hỏi nền tảng kỹ thuật.
- **Sư phạm trực quan:** học bằng màu sắc, nhóm quy tắc, ví dụ, bảng tra cứu và phản hồi tức thời.
- **4 làn tư duy:** mỗi từ được tách thành từng bước xử lý rõ ràng.
- **Tương thích đa nền tảng:** dùng tốt trên điện thoại, máy tính bảng, laptop và desktop.
- **Không cần backend:** chạy hoàn toàn bằng Static HTML/CSS/JavaScript.
- **Có thể học offline:** tải về là mở được bằng trình duyệt.
- **Dễ công bố:** phù hợp GitHub Pages và Hugging Face Spaces.

---

## 🧩 Mô hình học 4 làn

| Làn | Thành phần | Vai trò |
|---|---|---|
| 1 | **CQN** | Chữ Quốc ngữ đầu vào |
| 2 | **CVN** | Chữ Việt Nhanh, bước rút gọn trung gian |
| 3 | **KHD** | Ký hiệu dấu, mã hóa dấu thanh và dấu phụ |
| 4 | **P?** | Ký hiệu chống nhập nhằng khi cần |
| Kết quả | **CVNSS4.0** | Dạng không dấu hoàn chỉnh |

Công thức học:

```text
CQN → CVN + KHD + P? = CVNSS4.0
```

---

## 🔎 Ví dụ chuyển đổi có trace

| CQN | CVN | CVNSS4.0 | Diễn giải ngắn |
|---|---|---|---|
| `tuyết` | `tyd` | `tydb` | UYÊ→Y, T→D, ê sắc nón → B |
| `nguyễn` | `wỹl` | `wylg` | NG/NGH→W, UYÊN→YL, dấu ngã nón → G |
| `long` | `log` | `logp` | NG cuối→G, thêm P để tránh nhầm với `lỗ` |
| `lỗ` | `lỗ` | `log` | ô ngã → G |
| `xoay` | `xaj` | `xajp` | OAY→AJ, thêm P chống nhập nhằng |
| `thúy` | `thý` | `thyj` | UY→Y, sắc trơn → J |
| `quỷ` | `qỷ` / quy tắc trung gian | `qyz` | QU→Q, UY nhóm Y, hỏi trơn → Z |
| `quý` | `qý` / quy tắc trung gian | `qyj` | QU→Q, UY nhóm Y, sắc trơn → J |

---

## ✨ Tính năng chính

- Chuyển đổi **CQN → CVNSS4.0**.
- Chuyển đổi **CVNSS4.0 → CQN**.
- Hiển thị song song **CQN / CVN / CVSS**.
- Trace 4 làn cho từng từ.
- Bảng tuần hoàn quy tắc theo nhóm:
  - Phụ âm đầu.
  - Phụ âm cuối.
  - 56 vần dài.
  - Hệ KHD.
  - P chống nhập nhằng.
- Giao diện responsive cho điện thoại, tablet, laptop và desktop.
- Chạy offline sau khi tải về.
- Có kiểm thử lõi chuyển đổi bằng `selfTest()`.
- Có thể triển khai lên GitHub Pages và Hugging Face Spaces.

---

## 🧠 API JavaScript chính

Core JavaScript cung cấp các hàm:

```js
CVNSSConverter.convert(text, mode)
CVNSSConverter.convertWord(word, mode)
CVNSSConverter.explainWord(word, mode)
CVNSSConverter.trace(text, mode)
CVNSSConverter.selfTest()
```

### 1. `convert(text, mode)`

Chuyển đổi toàn văn bản.

```js
CVNSSConverter.convert("tuyết long", "cqn")
```

Kết quả mẫu:

```js
{
  cqn: "tuyết long",
  cvn: "tyd log",
  cvss: "tydb logp"
}
```

### 2. `convertWord(word, mode)`

Chuyển đổi một từ.

```js
CVNSSConverter.convertWord("long", "cqn")
```

### 3. `explainWord(word, mode)`

Diễn giải một từ theo 4 làn học.

```js
CVNSSConverter.explainWord("long", "cqn")
```

Kết quả dùng cho giao diện học:

```js
{
  input: "long",
  mode: "cqn",
  output: {
    cqn: "long",
    cvn: "log",
    cvss: "logp"
  },
  lanes: [
    { name: "CQN", value: "long", note: "Chữ Quốc ngữ đầu vào" },
    { name: "CVN", value: "log", note: "Rút gọn theo quy tắc CVN" },
    { name: "KHD", value: "thanh ngang", note: "Không có dấu thanh/dấu phụ đặc biệt" },
    { name: "P?", value: "+P", note: "Thêm P để chống nhập nhằng: logp = long, log = lỗ" }
  ]
}
```

### 4. `trace(text, mode)`

Trace nhiều token trong đoạn văn.

```js
CVNSSConverter.trace("tuyết long", "cqn")
```

### 5. `selfTest()`

Kiểm thử nhanh các ca quan trọng.

```js
CVNSSConverter.selfTest()
```

---

## 🏗️ Cấu trúc thư mục

```text
.
├── index.html
├── cvnss40_converter_pro_v4_trace.js
├── README.md
├── LICENSE
├── sample_input.txt
├── test_node.js
├── run_local_windows.bat
├── run_test_windows.bat
└── deploy_huggingface.md
```

---

## 🚀 Chạy offline trên Windows

Mở CMD tại thư mục dự án:

```bat
run_local_windows.bat
```

Hoặc mở trực tiếp:

```bat
index.html
```

Chạy kiểm thử:

```bat
run_test_windows.bat
```

Hoặc:

```bat
node test_node.js
```

---

## 🌍 Triển khai lên GitHub Pages

Sau khi chỉnh sửa file, chạy:

```bat
git add .
git commit -m "Update CVNSS4.0 Trace Learning Pro v4 website"
git push
```

Nếu cần cấu hình GitHub Pages từ CMD:

```bat
gh api --method PUT /repos/CVNSS/cogythucx/pages -f source[branch]=main -f source[path]=/
```

Nếu Pages chưa tồn tại:

```bat
gh api --method POST /repos/CVNSS/cogythucx/pages -f source[branch]=main -f source[path]=/
```

Mở website:

```bat
start https://cvnss.github.io/cogythucx/
```

---

## 🤗 Triển khai lên Hugging Face Spaces

Tạo Space mới trên Hugging Face với cấu hình:

- SDK: **Static HTML**
- App file: **index.html**
- License: **MIT**

Upload toàn bộ nội dung thư mục dự án lên Space.

YAML ở đầu README đã chuẩn bị sẵn:

```yaml
---
title: CVNSS4.0 Trace Learning Pro v4
emoji: 📘
colorFrom: blue
colorTo: green
sdk: static
app_file: index.html
pinned: false
license: mit
---
```

---

## 📜 Giấy phép

Dự án được phát hành theo giấy phép **MIT License**.

Bạn được phép:

- Sử dụng.
- Sao chép.
- Chỉnh sửa.
- Phân phối.
- Tích hợp vào sản phẩm khác.

Với điều kiện giữ lại thông báo bản quyền và giấy phép MIT.

---

## 🙏 Ghi nhận

Nền tảng nội dung dựa trên công thức **Chữ VN Song Song 4.0 (CVNSS4.0)** của các tác giả **Kiều Trường Lâm** và **Trần Tư Bình**.

Phiên bản UI/UX, Trace Learning, Pro v4 Pedagogy Edition và đóng gói triển khai online:

**Long Ngo, 2025**

---

# English Version

## Overview

**CVNSS4.0 Trace Learning Pro v4 — Pedagogy Edition** is an online learning website designed for public literacy education, teachers, students, Vietnamese language researchers, educational technologists and developers interested in learning **Chữ VN Song Song 4.0 (CVNSS4.0)** through a visual, systematic and beginner-friendly interface.

The project combines:

1. **A periodic-table-style rule map**  
   CVNSS4.0 rules are organised into visual groups, colour-coded cards and examples.

2. **The CVNSS4.0 Pro v4 converter core**  
   The website supports bidirectional conversion between **Vietnamese Quốc Ngữ (CQN)** and **CVNSS4.0**.

3. **Four-lane word tracing**  
   Each word is explained through the learning model:

```text
CQN → CVN + KHD + P? = CVNSS4.0
```

The goal is to turn a complex rule system into an accessible, interactive and verifiable learning tool.

---

## Website

| Item | URL |
|---|---|
| Online website | https://cvnss.github.io/cogythucx/ |
| GitHub repository | https://github.com/CVNSS/cogythucx |
| Previous development repository | `cvnss40-trace-learning-pro-v4` |
| Technology | Static HTML, CSS, JavaScript |
| License | MIT License |

---

## Design Philosophy

The project is designed around:

- **Public literacy education:** easy to access and easy to use.
- **Visual pedagogy:** colour, grouping, examples and instant feedback.
- **Four-lane reasoning:** each conversion step is made explicit.
- **Cross-device compatibility:** mobile, tablet, laptop and desktop.
- **No backend required:** pure Static HTML, CSS and JavaScript.
- **Offline-friendly usage:** download and open directly in a browser.
- **Easy deployment:** GitHub Pages and Hugging Face Spaces.

---

## Four-Lane Learning Model

| Lane | Component | Role |
|---|---|---|
| 1 | **CQN** | Original Vietnamese Quốc Ngữ input |
| 2 | **CVN** | Intermediate shortened Vietnamese form |
| 3 | **KHD** | Final sign code for tones and diacritics |
| 4 | **P?** | Optional disambiguation marker |
| Output | **CVNSS4.0** | Final unaccented representation |

Learning formula:

```text
CQN → CVN + KHD + P? = CVNSS4.0
```

---

## Key Features

- Convert **CQN to CVNSS4.0**.
- Convert **CVNSS4.0 to CQN**.
- Display **CQN / CVN / CVSS** side by side.
- Explain each word through four-lane tracing.
- Provide a searchable rule map:
  - Initial consonants.
  - Final consonants.
  - 56 long rimes.
  - KHD sign system.
  - P disambiguation marker.
- Responsive UI for mobile, tablet and desktop.
- Works offline.
- Includes `selfTest()` for core validation.
- Deployable to GitHub Pages and Hugging Face Spaces.

---

## Main JavaScript APIs

```js
CVNSSConverter.convert(text, mode)
CVNSSConverter.convertWord(word, mode)
CVNSSConverter.explainWord(word, mode)
CVNSSConverter.trace(text, mode)
CVNSSConverter.selfTest()
```

Example:

```js
CVNSSConverter.convert("tuyết long", "cqn")
```

Expected structure:

```js
{
  cqn: "tuyết long",
  cvn: "tyd log",
  cvss: "tydb logp"
}
```

---

## Deployment

### GitHub Pages

```bat
git add .
git commit -m "Update CVNSS4.0 Trace Learning Pro v4 documentation"
git push
```

Then configure Pages:

```bat
gh api --method PUT /repos/CVNSS/cogythucx/pages -f source[branch]=main -f source[path]=/
```

Open:

```text
https://cvnss.github.io/cogythucx/
```

### Hugging Face Spaces

Create a new **Static HTML Space**, then upload all project files.

The required metadata is already included at the top of this README:

```yaml
sdk: static
app_file: index.html
license: mit
```

---

## License

This project is released under the **MIT License**.

You may use, copy, modify, merge, publish, distribute and sublicense the software, provided that the MIT copyright and license notice are retained.

---

## Acknowledgement

The rule foundation is based on **Chữ VN Song Song 4.0 (CVNSS4.0)** by **Kiều Trường Lâm** and **Trần Tư Bình**.

UI/UX design, Trace Learning model, Pro v4 Pedagogy Edition and online deployment package:

**Long Ngo, 2026**
