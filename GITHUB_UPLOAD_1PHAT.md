# Upload “1 phát ăn ngay” lên GitHub org CVNSS

## Cách nhanh nhất trên Windows CMD

1. Giải nén gói này.
2. Mở thư mục vừa giải nén.
3. Double click:

```bat
publish_to_github.bat
```

Mặc định script sẽ upload lên:

```text
https://github.com/CVNSS/cvnss40-trace-learning-pro-v4
```

## Chọn tên repo khác

```bat
publish_to_github.bat CVNSS ten-repo-moi public
```

Repo private:

```bat
publish_to_github.bat CVNSS ten-repo-moi private
```

## Yêu cầu máy tính

- Git for Windows: https://git-scm.com/download/win
- GitHub CLI: https://cli.github.com/
- Tài khoản có quyền tạo repo trong tổ chức `CVNSS`

Nếu chưa đăng nhập GitHub CLI, script sẽ tự gọi:

```bat
gh auth login
```

## Chuẩn MIT

Gói đã có `LICENSE` MIT. Nếu thiếu, script sẽ tự tạo lại file MIT License trước khi commit/push.
