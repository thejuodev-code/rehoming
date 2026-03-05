# 🏗️ 프로젝트 아키텍처: Headless WordPress + Next.js

## 기본 구조

| 구분 | 기술 | 위치 |
|------|------|------|
| **프론트엔드** | Next.js 14 (React, TypeScript) | `d:\rehoming_center` |
| **백엔드/CMS** | WordPress (Cafe24 호스팅) | `https://lovejuo123.mycafe24.com` |
| **데이터 통신** | WPGraphQL 플러그인 (GraphQL API) | `/graphql` 엔드포인트 |
| **인증** | JWT (WPGraphQL JWT Authentication 플러그인) | `localStorage` → `wordpress_auth_token` |

---

## 환경 변수

```env
NEXT_PUBLIC_WORDPRESS_API_URL=https://lovejuo123.mycafe24.com/graphql
```

---

## 데이터 조회 (GraphQL Query)

- **Apollo Client**로 WPGraphQL 엔드포인트에 Query 전송
- 쿼리 정의: `src/lib/queries.ts`
- 토큰 관리: `src/lib/auth.ts` → `getAuthToken()` 함수

---

## 데이터 쓰기 (GraphQL Mutation)

Mutation 정의: `src/lib/mutations.ts`

### Animal (입양 동물)

```graphql
mutation CreateAnimal($title, $content, $excerpt, $status, $animalTypes, $animalStatuses, $animalFields) {
  createAnimal(input: { ... }) {
    animal { databaseId, title, slug, featuredImage { node { sourceUrl } }, animalFields { ... } }
  }
}

mutation UpdateAnimal($id, $title, $content, $excerpt, $status, $animalTypes, $animalStatuses, $animalFields) {
  updateAnimal(input: { id: $id, ... }) {
    animal { databaseId, ... }
  }
}

mutation DeleteAnimal($id) {
  deleteAnimal(input: { id: $id }) { ... }
}
```

> **⚠️ 중요: `featuredImageId`는 WPGraphQL이 커스텀 포스트 타입에 자동 등록하지 않음!**
> 이미지는 GraphQL Mutation이 아닌 별도 AJAX 호출로 처리 (아래 이미지 업로드 섹션 참조)

### ACF 커스텀 필드 처리

GraphQL Mutation에 `animalFields` 입력을 보내면, `functions.php`의 PHP 훅이 DB에 저장:

```php
// functions.php - 섹션 7
add_action('graphql_post_object_mutation_update_additional_data', function($post_id, $input, $post_type) {
    if ($post_type !== 'animal') return;
    if (isset($input['animalFields'])) {
        // age, breed, gender, weight, personality, medicalHistory, hashtags 저장
        foreach ($allowed as $key) {
            update_field($key, $fields[$key], $post_id);
        }
    }
}, 10, 3);
```

---

## ⚠️ 이미지 업로드 (특수 구조 — AJAX 우회)

**Cafe24 서버가 `Authorization` HTTP 헤더를 차단**하기 때문에 WP REST API와 GraphQL Mutation 모두 이미지 업로드에 사용 불가.

### 해결: 커스텀 AJAX 엔드포인트 2개

#### 1. `rehoming_upload_image` — 이미지 파일 업로드

```
POST /wp-admin/admin-ajax.php
Content-Type: multipart/form-data

FormData:
  action: "rehoming_upload_image"
  file: (이미지 파일)
  token: (JWT 토큰 — 헤더가 아닌 POST body로 전달!)
```

**응답:** `{ success: true, data: { id: 115, url: "https://..." } }`

**프론트엔드**: `src/components/admin/ui/ImageUpload.tsx`, `src/components/admin/ui/RichEditor.tsx`
**백엔드 PHP**: `functions.php` 섹션 8

#### 2. `rehoming_set_thumbnail` — 게시물에 썸네일 연결

동물 등록(GraphQL Mutation) 성공 후, **두 번째 AJAX 호출**로 썸네일 연결:

```
POST /wp-admin/admin-ajax.php
FormData:
  action: "rehoming_set_thumbnail"
  token: (JWT 토큰)
  post_id: (생성된 게시물 ID)
  attachment_id: (업로드된 이미지 ID)
```

**프론트엔드**: `src/app/admin/animals/new/page.tsx`, `src/app/admin/animals/[id]/page.tsx`
**백엔드 PHP**: `functions.php` 섹션 9

### 이미지 업로드 흐름 요약

```
1. 사용자가 이미지 선택
2. AJAX → rehoming_upload_image → 이미지 업로드 → attachment_id + url 반환
3. GraphQL Mutation → createAnimal → 텍스트 데이터만 저장 → databaseId 반환
4. AJAX → rehoming_set_thumbnail(post_id, attachment_id) → 썸네일 연결 완료
```

---

## 커스텀 게시물 유형 (CPT)

| CPT | GraphQL 이름 | 설명 |
|-----|-------------|------|
| `animal` | `animal` / `animals` | 입양 동물 |
| `project` | `project` / `projects` | 지원사업 |
| `review` | `review` / `reviews` | 입양 후기 |
| `support` | `supportPost` / `supportPosts` | 후원/봉사 게시판 |

---

## 핵심 파일 맵

| 파일 | 역할 |
|------|------|
| `src/lib/auth.ts` | JWT 토큰 관리 (getAuthToken, setAuthToken 등) |
| `src/lib/queries.ts` | 모든 GraphQL Query 정의 |
| `src/lib/mutations.ts` | 모든 GraphQL Mutation 정의 |
| `src/lib/apollo.ts` | Apollo Client 설정 |
| `src/components/admin/ui/ImageUpload.tsx` | 대표 이미지 업로드 (AJAX) |
| `src/components/admin/ui/RichEditor.tsx` | TipTap 에디터 (본문 내 이미지 업로드 포함) |
| `src/app/admin/animals/new/page.tsx` | 동물 등록 (Mutation + AJAX 썸네일) |
| `src/app/admin/animals/[id]/page.tsx` | 동물 수정 (Mutation + AJAX 썸네일) |
| `src/app/(main)/adopt/[slug]/page.tsx` | 입양 동물 상세 페이지 (Query) |
| WordPress `functions.php` | CORS, CPT 등록, ACF 훅, AJAX 핸들러 전부 |

---

## 주의사항

1. **URL은 반드시 `https://`** — Cafe24 서버가 `http://` URL을 반환하므로 프론트에서 강제 변환
2. **토큰은 POST body로** — `Authorization` 헤더는 Cafe24에서 차단됨
3. **`featuredImageId`는 GraphQL에 넣지 말 것** — 커스텀 CPT에서는 지원 안 됨, AJAX로 처리
4. **ACF 필드는 PHP 훅** — `graphql_post_object_mutation_update_additional_data` 훅에서 `update_field()` 사용
