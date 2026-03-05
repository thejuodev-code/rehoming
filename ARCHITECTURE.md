# Rehoming Center - WordPress 백엔드 연결 아키텍처

## 전체 구조

```
Next.js 14 (Netlify)  ←→  WordPress (Cafe24 호스팅)
       │                          │
       ├─ Apollo Client            ├─ WPGraphQL 플러그인 (쿼리/뮤테이션)
       ├─ AJAX (fetch)             ├─ ACF Pro (커스텀 필드)
       └─ JWT (localStorage)       ├─ WPGraphQL JWT Auth (인증)
                                   └─ functions.php (커스텀 AJAX 핸들러)
```

| 구분 | 기술 | 비고 |
|------|------|------|
| 프론트엔드 | Next.js 14, TypeScript, Apollo Client | Netlify 배포 |
| 백엔드/CMS | WordPress | Cafe24 호스팅 |
| 데이터 통신 | WPGraphQL (`/graphql` 엔드포인트) | 읽기/쓰기 모두 |
| 커스텀 필드 | ACF Pro | ACF 필드 키 기반 저장 |
| 인증 | JWT (WPGraphQL JWT Authentication) | localStorage 저장 |
| 이미지 업로드 | 커스텀 AJAX 핸들러 | Authorization 헤더 차단 우회 |

---

## 환경 변수

```env
NEXT_PUBLIC_WORDPRESS_API_URL=https://lovejuo123.mycafe24.com/graphql
```

---

## 핵심 제약사항 (Cafe24)

### 1. Authorization 헤더 차단
Cafe24 서버가 HTTP `Authorization` 헤더를 차단함. 따라서:
- GraphQL 인증 쿼리는 작동하지만, REST API/이미지 업로드는 불가
- **모든 AJAX 요청은 JWT 토큰을 POST body의 `token` 필드로 전달**

### 2. WPGraphQL Mutation의 한계
WPGraphQL의 `create/update` mutation은 표준 WordPress 필드만 처리:
- `title`, `content`, `excerpt`, `status` (표준 WP 필드)
- 택소노미 (카테고리/태그 등)

**ACF 커스텀 필드는 WPGraphQL mutation으로 저장 불가** (animal CPT의 `animalFields`만 예외 — PHP 훅으로 처리됨)

### 3. featuredImageId 미지원
커스텀 포스트 타입에서 `featuredImageId`를 GraphQL mutation input으로 넣어도 무시됨.
**반드시 AJAX로 별도 처리.**

---

## 커스텀 포스트 타입 (CPT) 4종

| CPT (WP) | GraphQL 단수 | GraphQL 복수 | 용도 |
|-----------|-------------|-------------|------|
| `animal` | `animal` | `animals` | 입양 동물 |
| `project` | `project` | `projects` | 지원사업/활동 |
| `review` | `review` | `reviews` | 입양 후기 |
| `support_post` | `supportPost` | `supportPosts` | 후원/봉사 게시판 |

---

## 데이터 흐름: 조회 (Read)

```
React 컴포넌트 → useQuery(GraphQL) → Apollo Client → WPGraphQL → WordPress DB
```

- Apollo Client 설정: `src/lib/apollo-client.ts`
- 쿼리 정의: `src/lib/queries.ts`
- 인증 링크가 `/admin` 경로에서만 JWT 헤더 추가
- 공개 페이지는 인증 없이 조회

### 쿼리 패턴

```typescript
// 목록 조회
const { data, loading, error } = useQuery<GetAnimalsData>(GET_ANIMALS, {
  variables: { first: 100 },
  fetchPolicy: 'network-only',      // 항상 서버에서 최신 데이터
  nextFetchPolicy: 'cache-first',   // 이후에는 캐시 사용
});

// 단건 조회 (slug 기반)
const { data } = useQuery(GET_ANIMAL_BY_SLUG, {
  variables: { id: slug },  // slug를 id로 전달, idType: SLUG 사용
});
```

### 한국어 slug 주의
URL 파라미터에서 한국어 slug를 받을 때 반드시 디코딩:
```typescript
const slug = decodeURIComponent(String(params.id || ''));
```

---

## 데이터 흐름: 쓰기 (Create/Update) — 3단계 AJAX 패턴

**모든 CPT의 생성/수정은 동일한 3단계 패턴을 따름:**

```
1단계: GraphQL Mutation  → 표준 WP 필드 + 택소노미 저장
2단계: AJAX 호출         → ACF 커스텀 필드 저장
3단계: AJAX 호출         → 대표 이미지(썸네일) 연결 (필요시)
```

### 왜 3단계인가?
- WPGraphQL mutation은 title/content/status/택소노미만 처리
- ACF 필드(isNotice, authorName 등)는 WPGraphQL mutation hook으로 전달 불가
  - animal CPT만 예외: `graphql_post_object_mutation_update_additional_data` PHP 훅으로 처리
  - 나머지 CPT(review, project, support_post)는 AJAX로 처리
- featuredImageId는 커스텀 CPT에서 GraphQL로 설정 불가 → AJAX 필요

---

## CPT별 상세 연결 방식

### 1. Animal (입양 동물)

#### GraphQL Mutation (1단계)

```graphql
mutation CreateAnimal(
  $title: String!
  $content: String
  $excerpt: String
  $status: PostStatusEnum
  $animalTypes: AnimalAnimalTypesInput        # 택소노미
  $animalStatuses: AnimalAnimalStatusesInput   # 택소노미
  $animalFields: AnimalFieldsInput             # ACF (PHP 훅으로 처리)
) {
  createAnimal(input: { ... }) {
    animal { databaseId, slug }
  }
}
```

**특이사항:** Animal만 `animalFields`를 GraphQL mutation input으로 전달 가능.
`functions.php`의 `graphql_post_object_mutation_update_additional_data` 훅이 처리.

하지만 이미지 관련 필드와 일부 필드는 여전히 AJAX로 처리.

#### AJAX — ACF 필드 저장 (2단계)

```
POST /wp-admin/admin-ajax.php
action: rehoming_save_animal_fields
token: (JWT)
post_id: (생성된 동물 ID)
age, breed, gender, weight, personality, medicalHistory, hashtags
```

**PHP 핸들러:** `functions.php` — `rehoming_handle_save_animal_fields`

**ACF 필드 키 맵:**
```php
$field_map = [
    'age'            => 'field_6990fde08c38e',
    'breed'          => 'field_6990fe378c38f',
    'gender'         => 'field_6990fe618c390',
    'weight'         => 'field_6990fe818c391',
    'personality'    => 'field_6990fea48c392',
    'medicalHistory' => 'field_6990febe8c393',
    'hashtags'       => 'field_6990fee18c394',
];
```

#### AJAX — 썸네일 연결 (3단계)

```
POST /wp-admin/admin-ajax.php
action: rehoming_set_thumbnail
token: (JWT)
post_id: (동물 ID)
attachment_id: (업로드된 이미지 ID)
```

#### 택소노미 입력 형식
```typescript
// 동물 타입/상태는 id 기반 (base64 인코딩된 WP global ID)
animalTypes: { nodes: [{ id: "dGVybTo1" }] }       // AnimalAnimalTypesInput
animalStatuses: { nodes: [{ id: "dGVybTo4" }] }     // AnimalAnimalStatusesInput
```

#### 프론트엔드 파일
- 목록: `src/app/admin/animals/page.tsx`
- 생성: `src/app/admin/animals/new/page.tsx`
- 수정: `src/app/admin/animals/[id]/page.tsx`

---

### 2. Review (입양 후기)

#### GraphQL Mutation (1단계)

```graphql
mutation CreateReview(
  $title: String!
  $content: String
  $excerpt: String
  $status: PostStatusEnum
) {
  createReview(input: { ... }) {
    review { databaseId, slug }
  }
}
```

**택소노미 없음.** title/content/excerpt/status만 전달.

#### AJAX — ACF 필드 저장 (2단계)

```
POST /wp-admin/admin-ajax.php
action: rehoming_save_review_fields
token: (JWT)
post_id: (생성된 후기 ID)
authorName, animalName, animalType, adoptionDate, quote, isPinned
```

**PHP 핸들러:** `rehoming_handle_save_review_fields`

**ACF 필드 키 맵:**
```php
$field_map = [
    'authorName'   => 'field_69a0dd92528b3',
    'animalName'   => 'field_69a0ddb1528b4',
    'animalType'   => 'field_69a0ddc1528b5',
    'adoptionDate' => 'field_69a0dde6528b6',
    'quote'        => 'field_69a0df04528b7',
    'isPinned'     => 'field_69a0df35528b8',
];
```

**불리언 필드 변환:**
```php
// isPinned은 PHP에서 불리언으로 변환
$value = ($value === 'true' || $value === '1') ? true : false;
```

#### AJAX — 썸네일 연결 (3단계)

```
POST /wp-admin/admin-ajax.php
action: rehoming_set_thumbnail
token: (JWT)
post_id: (후기 ID)
attachment_id: (업로드된 이미지 ID)
```

#### 프론트엔드 파일
- 목록: `src/app/admin/reviews/page.tsx`
- 생성: `src/app/admin/reviews/new/page.tsx`
- 수정: `src/app/admin/reviews/[id]/page.tsx`
- 폼 컴포넌트: `src/app/admin/reviews/_components/ReviewForm.tsx`

---

### 3. Activity/Project (지원사업/활동)

#### GraphQL Mutation (1단계)

```graphql
mutation CreateActivity(
  $title: String!
  $content: String
  $excerpt: String
  $status: PostStatusEnum
  $projectCategories: ProjectProjectCategoriesInput   # 택소노미
) {
  createProject(input: { ... }) {
    project { databaseId, slug }
  }
}
```

#### 택소노미 입력 형식
```typescript
// slug 기반
projectCategories: {
  nodes: [{ slug: "education" }, { slug: "rescue" }]
}
```

**카테고리 목록:**
| 이름 | slug |
|------|------|
| 교육 | education |
| 구조 | rescue |
| 의료 | medical |
| 캠페인 | campaign |
| 파트너쉽 | partnership |
| 후원 | donation |

#### AJAX — ACF 필드 저장 (2단계)

```
POST /wp-admin/admin-ajax.php
action: rehoming_save_activity_fields
token: (JWT)
post_id: (생성된 활동 ID)
type, impactSummary, pintoimpact
```

**PHP 핸들러:** `rehoming_handle_save_activity_fields`

**ACF 필드 키 맵:**
```php
$field_map = [
    'type'          => 'field_699cfe2652940',
    'impactSummary' => 'field_699cfe6f52941',
    'pintoimpact'   => 'field_699d2b1f76e18',
];
```

#### AJAX — 썸네일 연결 (3단계)

동일: `rehoming_set_thumbnail`

#### 프론트엔드 파일
- 목록: `src/app/admin/activities/page.tsx`
- 생성: `src/app/admin/activities/new/page.tsx`
- 수정: `src/app/admin/activities/[id]/page.tsx`
- 폼 컴포넌트: `src/app/admin/activities/_components/ActivityForm.tsx`

---

### 4. Support Post (후원/봉사 게시판)

#### GraphQL Mutation (1단계)

```graphql
mutation CreateSupportPost(
  $title: String!
  $content: String
  $status: PostStatusEnum
  $supportCategories: SupportPostSupportCategoriesInput   # 택소노미
) {
  createSupportPost(input: { ... }) {
    supportPost { databaseId, slug }
  }
}
```

#### 택소노미 입력 형식
```typescript
// slug 기반
supportCategories: {
  nodes: [{ slug: "notice" }]
}
```

**카테고리 목록:**
| 이름 | slug |
|------|------|
| 공지 | notice |
| 봉사 | volunteer |
| 소식 | news |
| 후원 | support |

#### AJAX — ACF 필드 저장 (2단계)

```
POST /wp-admin/admin-ajax.php
action: rehoming_save_support_fields
token: (JWT)
post_id: (생성된 게시글 ID)
isNotice, viewCount, attachedFile
```

**PHP 핸들러:** `rehoming_handle_save_support_fields`

**ACF 필드 키 맵:**
```php
$field_map = [
    'attachedFile' => 'field_69a10302926e5',
    'isNotice'     => 'field_69a10356926e6',
    'viewCount'    => 'field_69a10388926e7',
];
```

#### 프론트엔드 파일
- 목록: `src/app/admin/support/page.tsx`
- 생성: `src/app/admin/support/new/page.tsx`
- 수정: `src/app/admin/support/[id]/page.tsx`
- 폼 컴포넌트: `src/app/admin/support/_components/SupportPostForm.tsx`

---

## 이미지 업로드 시스템

### 업로드 엔드포인트 (공통)

```
POST /wp-admin/admin-ajax.php
Content-Type: multipart/form-data

FormData:
  action: "rehoming_upload_image"
  file: (파일)
  token: (JWT — POST body로!)
```

**응답:**
```json
{ "success": true, "data": { "id": 115, "url": "https://..." } }
```

**프론트엔드 컴포넌트:**
- `src/components/admin/ui/ImageUpload.tsx` — 대표 이미지/첨부파일 업로드
- `src/components/admin/ui/RichEditor.tsx` — 본문 내 이미지 업로드 (TipTap 에디터)

### 썸네일 연결 엔드포인트 (공통)

```
POST /wp-admin/admin-ajax.php
FormData:
  action: "rehoming_set_thumbnail"
  token: (JWT)
  post_id: (게시물 databaseId)
  attachment_id: (업로드된 이미지 id)
```

### URL https 강제 변환
Cafe24 WP가 `http://` URL을 반환하는 경우가 있어, 프론트에서 강제 변환:
```typescript
const safeUrl = data.url.replace(/^http:\/\//, 'https://');
```

### ImageUpload 컴포넌트의 onUploadComplete 콜백
이미지 업로드 완료 시 `(id: number, url: string)` 반환.
생성/수정 페이지에서 이 ID를 저장해뒀다가 3단계에서 `rehoming_set_thumbnail`에 전달.

```typescript
<ImageUpload
  value={formData.featuredImageUrl}
  onChange={(url) => handleChange('featuredImageUrl', url)}
  onUploadComplete={(id, url) => {
    handleChange('featuredImageId', id);   // attachment_id 저장
    handleChange('featuredImageUrl', url); // 미리보기용 URL 저장
  }}
/>
```

---

## 생성 페이지 전체 흐름 (코드 예시)

```typescript
const handleSubmit = async (formData) => {
  setIsSubmitting(true);
  try {
    // 1단계: GraphQL Mutation — 표준 필드 + 택소노미
    const result = await createMutation({
      variables: {
        title: formData.title,
        content: formData.content,
        status: 'PUBLISH',
        // 택소노미 (CPT마다 다름)
        projectCategories: {
          nodes: formData.categorySlugs.map(slug => ({ slug })),
        },
      },
    });

    const newPostId = result.data?.createProject?.project?.databaseId;
    if (!newPostId) throw new Error('생성 실패');

    const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace('/graphql', '');
    const token = (await import('@/lib/auth')).getAuthToken() || '';

    // 2단계: AJAX — ACF 필드 저장
    const fieldsForm = new FormData();
    fieldsForm.append('action', 'rehoming_save_activity_fields'); // CPT별 action명
    fieldsForm.append('token', token);
    fieldsForm.append('post_id', String(newPostId));
    fieldsForm.append('impactSummary', formData.impactSummary);
    fieldsForm.append('pintoimpact', formData.pintoimpact ? 'true' : 'false');
    await fetch(`${wpUrl}/wp-admin/admin-ajax.php`, { method: 'POST', body: fieldsForm });

    // 3단계: AJAX — 썸네일 연결 (이미지가 있을 때만)
    if (formData.featuredImageId) {
      const thumbForm = new FormData();
      thumbForm.append('action', 'rehoming_set_thumbnail');
      thumbForm.append('token', token);
      thumbForm.append('post_id', String(newPostId));
      thumbForm.append('attachment_id', String(formData.featuredImageId));
      await fetch(`${wpUrl}/wp-admin/admin-ajax.php`, { method: 'POST', body: thumbForm });
    }

    toast.success('등록되었습니다.');
    router.push('/admin/activities');
  } catch (error) {
    console.error(error);
    setIsSubmitting(false);
  }
};
```

---

## 삭제 흐름

삭제는 단순 GraphQL Mutation:
```graphql
mutation DeleteAnimal($id: ID!) {
  deleteAnimal(input: { id: $id }) { deletedId }
}
```

모든 CPT 동일 패턴. `id`는 `databaseId.toString()`.

---

## 인증 시스템

### 로그인
```graphql
mutation Login($username: String!, $password: String!) {
  login(input: { username: $username, password: $password }) {
    authToken
    refreshToken
    user { id, name, email, username }
  }
}
```

### 토큰 저장
- `localStorage.wordpress_auth_token` — JWT 액세스 토큰
- `localStorage.wordpress_refresh_token` — 리프레시 토큰
- `localStorage.wordpress_user` — 사용자 정보 JSON

### 토큰 만료 처리
`src/lib/auth.ts`의 `getAuthToken()`이 JWT payload의 `exp`를 확인하여 만료 시 자동 삭제.

### Apollo Client 인증 링크
`src/lib/apollo-client.ts`에서 `/admin` 경로일 때만 Authorization 헤더 추가:
```typescript
const authLink = setContext((_, { headers, skipAuth }) => {
  const isPublicRoute = !window.location.pathname.startsWith('/admin');
  if (skipAuth || isPublicRoute) return { headers };
  const token = getAuthToken();
  return {
    headers: { ...headers, ...(token ? { authorization: `Bearer ${token}` } : {}) }
  };
});
```

---

## WordPress functions.php 섹션 구조

| 섹션 | 내용 |
|------|------|
| 1 | CORS 헤더 설정 |
| 2 | CPT 등록 (animal, project, review, support_post) |
| 3 | 택소노미 등록 (animal_type, animal_status, project_category, support_category) |
| 4 | ACF 필드 그룹 등록 |
| 5-6 | WPGraphQL에 ACF 필드 노출 설정 |
| 7 | Animal용 GraphQL mutation 훅 (animalFields 처리) |
| 8 | AJAX: `rehoming_upload_image` (이미지 업로드) |
| 9 | AJAX: `rehoming_set_thumbnail` (썸네일 연결) |
| 10 | AJAX: `rehoming_save_animal_fields` (동물 ACF 필드) |
| 11 | AJAX: `rehoming_save_review_fields` (후기 ACF 필드) |
| 12 | AJAX: `rehoming_save_activity_fields` (활동 ACF 필드) |
| 13 | AJAX: `rehoming_save_support_fields` (게시판 ACF 필드) |

### AJAX 핸들러 등록 패턴 (functions.php)
```php
// 로그인/비로그인 모두 처리 (JWT로 자체 인증)
add_action('wp_ajax_rehoming_save_review_fields', 'rehoming_handle_save_review_fields');
add_action('wp_ajax_nopriv_rehoming_save_review_fields', 'rehoming_handle_save_review_fields');

function rehoming_handle_save_review_fields() {
    // CORS 헤더
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Content-Type: application/json');

    // JWT 토큰 검증
    $token = isset($_POST['token']) ? sanitize_text_field($_POST['token']) : '';
    // ... JWT 디코딩 및 사용자 확인 ...

    // post_type 검증
    $post_id = intval($_POST['post_id']);
    if (get_post_type($post_id) !== 'review') {
        wp_send_json_error(['message' => 'Invalid post type']);
    }

    // ACF 필드 저장 (필드 키 사용)
    $field_map = [
        'authorName'   => 'field_69a0dd92528b3',
        'animalName'   => 'field_69a0ddb1528b4',
        // ...
    ];

    foreach ($field_map as $param => $field_key) {
        if (isset($_POST[$param])) {
            $value = sanitize_text_field($_POST[$param]);
            // 불리언 변환 (isPinned 등)
            if ($param === 'isPinned') {
                $value = ($value === 'true' || $value === '1') ? true : false;
            }
            update_field($field_key, $value, $post_id);
        }
    }

    wp_send_json_success(['message' => 'Fields saved']);
}
```

---

## 택소노미 입력 타입 정리

| CPT | 택소노미 | GraphQL Input 타입 | 입력 형식 |
|-----|---------|-------------------|-----------|
| animal | animal_type | `AnimalAnimalTypesInput` | `{ nodes: [{ id: "base64ID" }] }` |
| animal | animal_status | `AnimalAnimalStatusesInput` | `{ nodes: [{ id: "base64ID" }] }` |
| project | project_category | `ProjectProjectCategoriesInput` | `{ nodes: [{ slug: "education" }] }` |
| support_post | support_category | `SupportPostSupportCategoriesInput` | `{ nodes: [{ slug: "notice" }] }` |

**주의:** Animal 택소노미만 `id`(base64) 사용, 나머지는 `slug` 사용.

---

## 새로운 CPT 추가 시 체크리스트

1. **WordPress (functions.php)**
   - [ ] CPT 등록 (`register_post_type`)
   - [ ] 택소노미 등록 (`register_taxonomy`) — 필요시
   - [ ] ACF 필드 그룹 생성 (WP 관리자 > Custom Fields)
   - [ ] WPGraphQL에 ACF 필드 노출 (`register_graphql_field`)
   - [ ] AJAX 핸들러 추가 (`wp_ajax_` + `wp_ajax_nopriv_`)
   - [ ] ACF 필드 키 확인 (WP 관리자 > Custom Fields > 필드 그룹 > 화면 옵션 > 필드 키 표시)

2. **Next.js (프론트엔드)**
   - [ ] `src/lib/queries.ts` — 목록/단건 쿼리 추가
   - [ ] `src/lib/mutations.ts` — create/update/delete mutation + TypeScript 인터페이스
   - [ ] `src/types/graphql.ts` — 응답 타입 정의
   - [ ] 어드민 페이지 생성 (목록/생성/수정)
   - [ ] 3단계 패턴 적용: GraphQL → AJAX (ACF) → AJAX (썸네일)

---

## 핵심 파일 맵

| 파일 | 역할 |
|------|------|
| `src/lib/apollo-client.ts` | Apollo Client 설정 (인증 링크 포함) |
| `src/lib/auth.ts` | JWT 토큰 CRUD (localStorage) |
| `src/lib/queries.ts` | 모든 GraphQL Query 정의 |
| `src/lib/mutations.ts` | 모든 GraphQL Mutation + TypeScript 인터페이스 |
| `src/types/graphql.ts` | GraphQL 응답 타입 |
| `src/types/admin.ts` | 어드민 폼 입력 타입 |
| `src/types/support.ts` | Support 관련 타입 |
| `src/components/common/Providers.tsx` | ApolloProvider 래퍼 |
| `src/components/admin/ui/ImageUpload.tsx` | 이미지/파일 업로드 (AJAX) |
| `src/components/admin/ui/RichEditor.tsx` | TipTap 리치 에디터 (본문 내 이미지 업로드 포함) |
| WordPress `functions.php` | CORS, CPT, 택소노미, ACF 훅, AJAX 핸들러 전부 |

---

## ACF 필드 키 디버깅 방법

새로운 CPT를 연결하거나 ACF 필드 키를 모를 때, **임시 디버그 AJAX 핸들러**를 WordPress에 등록하여 필드 키를 조회할 수 있다.

### 1단계: functions.php에 디버그 핸들러 추가

```php
// 디버그용 — ACF 필드 키 조회 (작업 완료 후 반드시 삭제)
add_action('wp_ajax_rehoming_debug_fields', 'rehoming_handle_debug_fields');
add_action('wp_ajax_nopriv_rehoming_debug_fields', 'rehoming_handle_debug_fields');

function rehoming_handle_debug_fields() {
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');

    $post_id = intval($_POST['post_id'] ?? $_GET['post_id'] ?? 0);
    if (!$post_id) {
        wp_send_json_error(['message' => 'post_id required']);
    }

    $post_type = get_post_type($post_id);

    // 방법 1: ACF get_fields()로 해당 포스트의 모든 ACF 필드 조회
    $acf_fields = [];
    if (function_exists('get_fields')) {
        $acf_fields = get_fields($post_id);
    }

    // 방법 2: ACF get_field_objects()로 필드 키까지 포함해서 조회
    $field_objects = [];
    if (function_exists('get_field_objects')) {
        $raw = get_field_objects($post_id);
        if ($raw) {
            foreach ($raw as $name => $obj) {
                $field_objects[$name] = [
                    'key'   => $obj['key'],     // ← 이게 field_xxxxxxx 형태의 ACF 필드 키
                    'label' => $obj['label'],
                    'type'  => $obj['type'],
                    'value' => $obj['value'],
                ];
            }
        }
    }

    // 방법 3: wp_postmeta에서 직접 조회 (ACF 없이도 가능)
    global $wpdb;
    $meta = $wpdb->get_results(
        $wpdb->prepare("SELECT meta_key, meta_value FROM {$wpdb->postmeta} WHERE post_id = %d", $post_id),
        ARRAY_A
    );

    wp_send_json_success([
        'post_id'       => $post_id,
        'post_type'     => $post_type,
        'acf_fields'    => $acf_fields,
        'field_objects'  => $field_objects,  // 필드 키 포함
        'all_meta'      => $meta,            // 전체 메타 (ACF 내부 키 '_field_name' 포함)
    ]);
}
```

### 2단계: 프론트엔드 또는 브라우저에서 호출

```javascript
// 브라우저 콘솔 또는 Next.js에서
const wpUrl = 'https://lovejuo123.mycafe24.com';
const formData = new FormData();
formData.append('action', 'rehoming_debug_fields');
formData.append('post_id', '123'); // 조회할 게시물 ID

fetch(`${wpUrl}/wp-admin/admin-ajax.php`, { method: 'POST', body: formData })
  .then(r => r.json())
  .then(console.log);
```

또는 Next.js debug 페이지(`src/app/(main)/debug/page.tsx`)에서 호출.

### 3단계: 응답에서 필드 키 확인

```json
{
  "success": true,
  "data": {
    "post_type": "review",
    "field_objects": {
      "author_name": {
        "key": "field_69a0dd92528b3",   // ← 이 값을 field_map에 사용
        "label": "작성자명",
        "type": "text",
        "value": "홍길동"
      },
      "is_pinned": {
        "key": "field_69a0df35528b8",
        "label": "상단 고정",
        "type": "true_false",
        "value": true
      }
    }
  }
}
```

### 4단계: 필드 키로 AJAX 핸들러 작성

`field_objects`에서 얻은 `key` 값을 `$field_map`에 매핑:

```php
$field_map = [
    'authorName' => 'field_69a0dd92528b3',  // ← field_objects에서 확인한 키
    'isPinned'   => 'field_69a0df35528b8',
];
```

### 5단계: 디버그 핸들러 삭제

작업이 끝나면 `rehoming_handle_debug_fields` 함수와 `add_action` 2줄을 **반드시 삭제**할 것.
프로덕션에 메타 데이터 전체를 노출하면 보안 위험.

### 대안: WP 관리자 화면에서 확인

WordPress 관리자 > Custom Fields > 필드 그룹 선택 > 우측 상단 **화면 옵션** > **필드 키 표시** 체크.
각 필드 이름 아래에 `field_xxxxxxx` 형태로 키가 표시됨.
(단, Cafe24 환경에서 WP 관리자 접근이 어려운 경우 위 디버그 방법 사용)

---

## 자주 겪는 문제와 해결

| 문제 | 원인 | 해결 |
|------|------|------|
| `Unknown type 'XxxFieldsInput'` | GraphQL mutation에 ACF 필드 input을 넣으려 함 | ACF 필드는 AJAX로 처리. mutation에서 제거 |
| 이미지 업로드 시 401 | Authorization 헤더 차단 | token을 POST body로 전달 |
| 카테고리/택소노미 적용 안됨 | mutation에서 택소노미 변수를 빠뜨림 | `projectCategories`/`supportCategories` 확인 |
| 폼 버튼 클릭 시 폼이 제출됨 | `<button>`의 기본 type이 `submit` | `type="button"` 명시 |
| 이미지 업로드 클릭이 안됨 | `e.preventDefault()` 사용 | `e.stopPropagation()` 사용 |
| AJAX 응답이 `0` | `wp_ajax_nopriv_` action 미등록 | 두 action 모두 등록 |
| Mixed Content 에러 | WP가 http:// URL 반환 | `.replace(/^http:\/\//, 'https://')` |
| `params.id`가 Promise | Next.js 15 변경사항 착각 | Next.js 14에서는 `params`가 동기 객체 |
