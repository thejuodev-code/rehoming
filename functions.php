<?php
add_action( 'after_setup_theme', 'blankslate_setup' );
function blankslate_setup() {
    load_theme_textdomain( 'blankslate', get_template_directory() . '/languages' );
    add_theme_support( 'title-tag' );
    add_theme_support( 'automatic-feed-links' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'custom-logo' );
    add_theme_support( 'html5', array( 'search-form', 'comment-list', 'comment-form', 'gallery', 'caption', 'style', 'script', 'navigation-widgets' ) );
    add_theme_support( 'responsive-embeds' );
    add_theme_support( 'align-wide' );
    add_theme_support( 'wp-block-styles' );
    add_theme_support( 'editor-styles' );
    add_editor_style( 'editor-style.css' );
    add_theme_support( 'appearance-tools' );
    add_theme_support( 'woocommerce' );
    global $content_width;
    if ( !isset( $content_width ) ) {
        $content_width = 1920;
    }
    register_nav_menus( array( 'main-menu' => esc_html__( 'Main Menu', 'blankslate' ) ) );
}

add_action( 'admin_notices', 'blankslate_notice' );
function blankslate_notice() {
    $user_id = get_current_user_id();
    if ( !$user_id || !current_user_can( 'manage_options' ) || get_user_meta( $user_id, 'blankslate_notice_dismissed_2026', true ) ) {
        return;
    }
    $dismiss_url = add_query_arg( array( 'blankslate_dismiss' => '1', 'blankslate_nonce' => wp_create_nonce( 'blankslate_dismiss_notice' ) ), admin_url() );
    echo '<div class="notice notice-info"><p><a href="' . esc_url( $dismiss_url ) . '" class="alignright" style="text-decoration:none"><big>' . esc_html__( '×', 'blankslate' ) . '</big></a><big><strong>' . esc_html__( '📝 Thank you for using BlankSlate!', 'blankslate' ) . '</strong></big><p>' . esc_html__( 'Powering over 10k websites! Buy me a sandwich! 🥪', 'blankslate' ) . '</p><a href="https://github.com/webguyio/blankslate/issues/57" class="button-primary" target="_blank" rel="noopener noreferrer"><strong>' . esc_html__( 'How do you use BlankSlate?', 'blankslate' ) . '</strong></a> <a href="https://opencollective.com/blankslate" class="button-primary" style="background-color:green;border-color:green" target="_blank" rel="noopener noreferrer"><strong>' . esc_html__( 'Donate', 'blankslate' ) . '</strong></a> <a href="https://wordpress.org/support/theme/blankslate/reviews/#new-post" class="button-primary" style="background-color:purple;border-color:purple" target="_blank" rel="noopener noreferrer"><strong>' . esc_html__( 'Review', 'blankslate' ) . '</strong></a> <a href="https://github.com/webguyio/blankslate/issues" class="button-primary" style="background-color:orange;border-color:orange" target="_blank" rel="noopener noreferrer"><strong>' . esc_html__( 'Support', 'blankslate' ) . '</strong></a></p></div>';
}

add_action( 'admin_init', 'blankslate_notice_dismissed' );
function blankslate_notice_dismissed() {
    $user_id = get_current_user_id();
    if ( isset( $_GET['blankslate_dismiss'], $_GET['blankslate_nonce'] ) && wp_verify_nonce( $_GET['blankslate_nonce'], 'blankslate_dismiss_notice' ) && current_user_can( 'manage_options' ) ) {
        add_user_meta( $user_id, 'blankslate_notice_dismissed_2026', 'true', true );
    }
}

add_action( 'wp_enqueue_scripts', 'blankslate_enqueue' );
function blankslate_enqueue() {
    wp_enqueue_style( 'blankslate-style', get_stylesheet_uri() );
    wp_enqueue_script( 'jquery' );
}

add_action( 'wp_footer', 'blankslate_footer' );
function blankslate_footer() {
    ?>
    <script>
    (function() {
        const ua = navigator.userAgent.toLowerCase();
        const html = document.documentElement;
        if (/(iphone|ipod|ipad)/.test(ua)) {
            html.classList.add('ios', 'mobile');
        }
        else if (/android/.test(ua)) {
            html.classList.add('android', 'mobile');
        }
        else {
            html.classList.add('desktop');
        }
        if (/chrome/.test(ua) && !/edg|brave/.test(ua)) {
            html.classList.add('chrome');
        }
        else if (/safari/.test(ua) && !/chrome/.test(ua)) {
            html.classList.add('safari');
        }
        else if (/edg/.test(ua)) {
            html.classList.add('edge');
        }
        else if (/firefox/.test(ua)) {
            html.classList.add('firefox');
        }
        else if (/brave/.test(ua)) {
            html.classList.add('brave');
        }
        else if (/opr|opera/.test(ua)) {
            html.classList.add('opera');
        }
    })();
    </script>
    <?php
}

add_filter( 'document_title_separator', 'blankslate_document_title_separator' );
function blankslate_document_title_separator( $sep ) {
    $sep = esc_html( '|' );
    return $sep;
}

add_filter( 'the_title', 'blankslate_title' );
function blankslate_title( $title ) {
    if ( $title == '' ) {
        return esc_html( '...' );
    } else {
        return wp_kses_post( $title );
    }
}

function blankslate_schema_type() {
    $schema = 'https://schema.org/';
    if ( is_single() ) {
        $type = "Article";
    } elseif ( is_author() ) {
        $type = 'ProfilePage';
    } elseif ( is_search() ) {
        $type = 'SearchResultsPage';
    } else {
        $type = 'WebPage';
    }
    echo 'itemscope itemtype="' . esc_url( $schema ) . esc_attr( $type ) . '"';
}

add_filter( 'nav_menu_link_attributes', 'blankslate_schema_url', 10 );
function blankslate_schema_url( $atts ) {
    $atts['itemprop'] = 'url';
    return $atts;
}

if ( !function_exists( 'blankslate_wp_body_open' ) ) {
    function blankslate_wp_body_open() {
        do_action( 'wp_body_open' );
    }
}

add_action( 'wp_body_open', 'blankslate_skip_link', 5 );
function blankslate_skip_link() {
    echo '<a href="#content" class="skip-link screen-reader-text">' . esc_html__( 'Skip to the content', 'blankslate' ) . '</a>';
}

add_filter( 'the_content_more_link', 'blankslate_read_more_link' );
function blankslate_read_more_link() {
    if ( !is_admin() ) {
        return ' <a href="' . esc_url( get_permalink() ) . '" class="more-link">' . sprintf( __( '...%s', 'blankslate' ), '<span class="screen-reader-text">  ' . esc_html( get_the_title() ) . '</span>' ) . '</a>';
    }
}

add_filter( 'excerpt_more', 'blankslate_excerpt_read_more_link' );
function blankslate_excerpt_read_more_link( $more ) {
    if ( !is_admin() ) {
        global $post;
        return ' <a href="' . esc_url( get_permalink( $post->ID ) ) . '" class="more-link">' . sprintf( __( '...%s', 'blankslate' ), '<span class="screen-reader-text">  ' . esc_html( get_the_title() ) . '</span>' ) . '</a>';
    }
}

add_filter( 'big_image_size_threshold', '__return_false' );
add_filter( 'intermediate_image_sizes_advanced', 'blankslate_image_insert_override' );
function blankslate_image_insert_override( $sizes ) {
    unset( $sizes['medium_large'] );
    unset( $sizes['1536x1536'] );
    unset( $sizes['2048x2048'] );
    return $sizes;
}

add_action( 'widgets_init', 'blankslate_widgets_init' );
function blankslate_widgets_init() {
    register_sidebar( array(
        'name' => esc_html__( 'Sidebar Widget Area', 'blankslate' ),
        'id' => 'primary-widget-area',
        'before_widget' => '<li id="%1$s" class="widget-container %2$s">',
        'after_widget' => '</li>',
        'before_title' => '<h3 class="widget-title">',
        'after_title' => '</h3>',
    ) );
}

add_action( 'wp_head', 'blankslate_pingback_header' );
function blankslate_pingback_header() {
    if ( is_singular() && pings_open() ) {
        printf( '<link rel="pingback" href="%s">' . "\n", esc_url( get_bloginfo( 'pingback_url' ) ) );
    }
}

add_action( 'comment_form_before', 'blankslate_enqueue_comment_reply_script' );
function blankslate_enqueue_comment_reply_script() {
    if ( get_option( 'thread_comments' ) ) {
        wp_enqueue_script( 'comment-reply' );
    }
}

function blankslate_custom_pings( $comment ) {
    ?>
    <li <?php comment_class(); ?> id="li-comment-<?php comment_ID(); ?>"><?php comment_author_link(); ?></li>
    <?php
}

add_filter( 'get_comments_number', 'blankslate_comment_count', 0 );
function blankslate_comment_count( $count ) {
    if ( !is_admin() ) {
        global $id;
        $get_comments = get_comments( 'status=approve&post_id=' . $id );
        $comments_by_type = separate_comments( $get_comments );
        return count( $comments_by_type['comment'] );
    } else {
        return $count;
    }
}

/**
 * 1. Headless WordPress를 위한 CORS 허용 설정 (로컬 & 실서버 대응)
 */
add_action( 'init', function() {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    // 허용할 주소 리스트
    $allowed_origins = [
        'http://localhost:3000',
        'https://rehoming.netlify.app'
    ];

    if ( in_array( $origin, $allowed_origins ) ) {
        header( "Access-Control-Allow-Origin: " . $origin );
    } else {
        // 기본값은 실서버 주소로 설정
        header( "Access-Control-Allow-Origin: https://rehoming.netlify.app" );
    }

    header( "Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE" );

    // 🔥 여기가 핵심! 커스텀 우회 헤더(X-GraphQL-Token) 당당하게 패스 목록에 추가 🔥
    header( "Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-GraphQL-Token" );
    header( "Access-Control-Allow-Credentials: true" );

    if ( isset($_SERVER['REQUEST_METHOD']) && 'OPTIONS' == $_SERVER['REQUEST_METHOD'] ) {
        status_header( 200 );
        exit();
    }
} );


/**
 * 2. 메인 페이지 접속 시 상황에 맞는 리다이렉트
 */
add_action( 'template_redirect', function() {
    $is_graphql = (strpos($_SERVER['REQUEST_URI'], 'graphql') !== false);

    if ( !is_admin() && !is_user_logged_in() && !$is_graphql ) {
        // 기본적으로는 실서버로 보내주되, 로컬 테스트 환경을 구분하고 싶다면 하드코딩된 주소를 사용합니다.
        // 현재 운영 중인 실서버 주소로 설정하는 것이 안전합니다.
        wp_redirect( 'https://rehoming.netlify.app' );
        exit;
    }
} );

/**
 * 3. 커스텀 게시물 유형 및 택소노미 등록
 */
add_action( 'init', function() {
    // 지원사업(Project) CPT
    register_post_type( 'project', [
        'labels' => [
            'name' => '지원사업',
            'singular_name' => '지원사업',
        ],
        'public'      => true,
        'has_archive' => true,
        'show_in_rest' => true,
        'menu_icon'   => 'dashicons-portfolio',
        'supports'    => [ 'title', 'editor', 'thumbnail', 'excerpt' ],
        'show_in_graphql' => true,
        'graphql_single_name' => 'project',
        'graphql_plural_name' => 'projects',
        'show_in_graphql_mutations' => true, // Mutation 허용 추가
    ]);

    // 지원사업 카테고리
    register_taxonomy( 'project_cat', 'project', [
        'labels' => [
            'name' => '사업 분류',
            'singular_name' => '사업 분류',
        ],
        'hierarchical' => true,
        'show_in_rest' => true,
        'show_admin_column' => true,
        'show_in_graphql' => true,
        'graphql_single_name' => 'projectCategory',
        'graphql_plural_name' => 'projectCategories',
    ]);
});
/**
 * 4. 입양 동물(Animal) 커스텀 게시물 및 택소노미 등록
 */
add_action( 'init', function() {
    // 입양 동물(Animal) CPT
    register_post_type( 'animal', [
        'labels' => [
            'name' => '입양 동물',
            'singular_name' => '입양 동물',
            'add_new' => '새 동물 추가',
            'edit_item' => '동물 정보 수정',
        ],
        'public'      => true,
        'has_archive' => true,
        'show_in_rest' => true,
        'menu_icon'   => 'dashicons-pets', // 귀여운 발바닥 아이콘
        'supports'    => [ 'title', 'editor', 'thumbnail', 'excerpt' ], // 본문, 썸네일, 요약 지원
        'show_in_graphql' => true,
        'graphql_single_name' => 'animal',
        'graphql_plural_name' => 'animals',
        'show_in_graphql_mutations' => true, // Mutation 허용 추가 (에러 해결 핵심)
    ]);

    // 동물 종류 (강아지, 고양이) 택소노미
    register_taxonomy( 'animal_type', 'animal', [
        'labels' => [
            'name' => '동물 종류',
            'singular_name' => '동물 종류',
        ],
        'hierarchical' => true,
        'show_in_rest' => true,
        'show_admin_column' => true,
        'show_in_graphql' => true,
        'graphql_single_name' => 'animalType',
        'graphql_plural_name' => 'animalTypes',
    ]);

    // 입양 상태 (입양가능, 임보중, 긴급 등) 택소노미
    register_taxonomy( 'animal_status', 'animal', [
        'labels' => [
            'name' => '입양 상태',
            'singular_name' => '입양 상태',
        ],
        'hierarchical' => true,
        'show_in_rest' => true,
        'show_admin_column' => true,
        'show_in_graphql' => true,
        'graphql_single_name' => 'animalStatus',
        'graphql_plural_name' => 'animalStatuses',
    ]);
});
/**
 * 5. 입양 후기(Review) 커스텀 게시물 및 ACF 필드 등록
 */
add_action( 'init', function() {
    // 입양 후기(Review) CPT
    register_post_type( 'review', [
        'labels' => [
            'name'          => '입양 후기',
            'singular_name' => '입양 후기',
            'add_new'       => '새 후기 추가',
            'edit_item'     => '후기 수정',
        ],
        'public'              => true,
        'has_archive'         => true,
        'show_in_rest'        => true,
        'menu_icon'           => 'dashicons-heart', // ♥ 아이콘
        'supports'            => [ 'title', 'editor', 'thumbnail', 'excerpt' ],
        'show_in_graphql'     => true,
        'graphql_single_name' => 'review',
        'graphql_plural_name' => 'reviews',
        'show_in_graphql_mutations' => true, // Mutation 허용 추가
    ]);
});
/**
 * 6. 후원/봉사 안내 게시판(Support) 커스텀 게시물 및 택소노미 등록
 */
add_action( 'init', function() {
    // 후원/봉사 안내 게시판(Support) CPT
    register_post_type( 'support', [
        'labels' => [
            'name'          => '후원/봉사 게시판',
            'singular_name' => '후원/봉사 게시물',
            'add_new'       => '새 게시글 추가',
            'edit_item'     => '게시글 수정',
            'search_items'  => '게시글 검색',
        ],
        'public'              => true,
        'has_archive'         => true,
        'show_in_rest'        => true,
        'menu_icon'           => 'dashicons-clipboard', // 클립보드(게시판) 느낌의 아이콘
        'supports'            => [ 'title', 'editor', 'thumbnail', 'excerpt', 'author' ], // 제목, 본문, 썸네일, 요약, 작성자
        'show_in_graphql'     => true,
        'graphql_single_name' => 'supportPost',
        'graphql_plural_name' => 'supportPosts',
        'show_in_graphql_mutations' => true, // Mutation 허용 추가
    ]);

    // 게시판 분류 (공지, 후원, 봉사, 소식 등) 택소노미
    register_taxonomy( 'support_category', 'support', [
        'labels' => [
            'name'          => '게시글 분류',
            'singular_name' => '게시글 분류',
            'search_items'  => '분류 검색',
            'all_items'     => '모든 분류',
            'edit_item'     => '분류 수정',
            'add_new_item'  => '새 분류 추가',
        ],
        'hierarchical'        => true, // 카테고리처럼 체크박스 형태로 사용
        'show_in_rest'        => true,
        'show_admin_column'   => true, // 글 목록에서 카테고리 기둥 표시
        'show_in_graphql'     => true,
        'graphql_single_name' => 'supportCategory',
        'graphql_plural_name' => 'supportCategories',
    ]);
});
// -------------------------------------------------------------
// * ACF 필드 Mutation 지원을 위한 필수 옵션 필터 (WPGraphQL-ACF 설정 활성화용)
// ACF 필드 그룹 등 무료 버전 한계로 안보이는 Mutation 강제 켜기
add_filter( 'wpgraphql_acf_register_graphql_field', function( $field_config, $type_name, $field_name, $field_object ) {
    return $field_config;
}, 10, 4);

// =========================================================================
// 7. WPGraphQL 커스텀 Input 수동 등록 (animalFields만!)
// =========================================================================
add_action( 'graphql_register_types', function() {
    register_graphql_input_type( 'AnimalFieldsInput', [
        'fields' => [
            'age'            => [ 'type' => 'String' ],
            'breed'          => [ 'type' => 'String' ],
            'gender'         => [ 'type' => 'String' ],
            'weight'         => [ 'type' => 'String' ],
            'personality'    => [ 'type' => 'String' ],
            'medicalHistory' => [ 'type' => 'String' ],
            'hashtags'       => [ 'type' => 'String' ],
        ]
    ] );

    register_graphql_field( 'CreateAnimalInput', 'animalFields', [ 'type' => 'AnimalFieldsInput' ] );
    register_graphql_field( 'UpdateAnimalInput', 'animalFields', [ 'type' => 'AnimalFieldsInput' ] );
} );

// =========================================================================
// 10. ACF 필드 저장 전용 AJAX 핸들러 (GraphQL 훅이 커스텀 input을 전달하지 않으므로 AJAX 우회)
// =========================================================================
add_action('wp_ajax_rehoming_save_animal_fields', 'rehoming_handle_save_animal_fields');
add_action('wp_ajax_nopriv_rehoming_save_animal_fields', 'rehoming_handle_save_animal_fields');

function rehoming_handle_save_animal_fields() {
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : 'https://rehoming.netlify.app';
    header("Access-Control-Allow-Origin: " . $origin);
    header("Access-Control-Allow-Credentials: true");

    // 토큰 검증
    $token = isset($_POST['token']) ? sanitize_text_field($_POST['token']) : '';
    if (empty($token) || !class_exists('\WPGraphQL\JWT_Authentication\Auth')) {
        wp_send_json_error(['message' => '인증 토큰이 없습니다.']);
    }

    try {
        $decoded = \WPGraphQL\JWT_Authentication\Auth::validate_token($token);
        if (is_wp_error($decoded) || !isset($decoded->data->user->id)) {
            wp_send_json_error(['message' => '유효하지 않은 토큰입니다.']);
        }
        wp_set_current_user($decoded->data->user->id);
    } catch (\Exception $e) {
        wp_send_json_error(['message' => '토큰 검증 오류']);
    }

    $post_id = isset($_POST['post_id']) ? intval($_POST['post_id']) : 0;
    if (!$post_id || get_post_type($post_id) !== 'animal') {
        wp_send_json_error(['message' => '유효하지 않은 동물 게시물 ID입니다.']);
    }

    // GraphQL camelCase → ACF 필드키 매핑
    $field_map = [
        'age'            => 'field_699e45779ad56',
        'gender'         => 'field_699e45819ad57',
        'breed'          => 'field_699e45e89ad58',
        'hashtags'       => 'field_699e5384d787c',
        'weight'         => 'field_699e5caed36d3',
        'personality'    => 'field_699e5cb9d36d6',
        'medicalHistory' => 'field_699e5cbad36d7',
    ];

    $saved = [];
    foreach ($field_map as $input_key => $field_key) {
        if (isset($_POST[$input_key]) && $_POST[$input_key] !== '') {
            update_field($field_key, sanitize_text_field($_POST[$input_key]), $post_id);
            $saved[] = $input_key;
        }
    }

    wp_send_json_success(['message' => 'ACF 필드 저장 완료', 'post_id' => $post_id, 'saved_fields' => $saved]);
}



// =========================================================================
// 8. 카페24 완전 회피용: 커스텀 AJAX 이미지 업로드 핸들러
// 헤더 차단, REST API 차단을 모두 피해 본문에 담긴 토큰을 직접 검사합니다.
// =========================================================================
add_action('wp_ajax_rehoming_upload_image', 'rehoming_handle_ajax_upload');
add_action('wp_ajax_nopriv_rehoming_upload_image', 'rehoming_handle_ajax_upload');

function rehoming_handle_ajax_upload() {
    // 1) CORS 허용 (프론트엔드 요청 수락)
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : 'https://rehoming.netlify.app';
    header("Access-Control-Allow-Origin: " . $origin);
    header("Access-Control-Allow-Credentials: true");

    // 2) 토큰 유효성 검사 (본문 POST로 직접 전달받은 토큰)
    $token = isset($_POST['token']) ? sanitize_text_field($_POST['token']) : '';
    if (empty($token) || !class_exists('\WPGraphQL\JWT_Authentication\Auth')) {
        wp_send_json_error(['message' => '인증 토큰이 없습니다. 다시 로그인해 주세요.']);
    }

    try {
        $decoded = \WPGraphQL\JWT_Authentication\Auth::validate_token($token);
        if (is_wp_error($decoded) || !isset($decoded->data->user->id)) {
            wp_send_json_error(['message' => '유효하지 않은 토큰입니다. (권한 없음)']);
        }

        // 정상적인 로그인 토큰이라면, 해당 유저로 권한을 강제 적용합니다.
        wp_set_current_user($decoded->data->user->id);
    } catch (\Exception $e) {
        wp_send_json_error(['message' => '토큰 검증 오류가 발생했습니다.']);
    }

    // 3) 파일 업로드 처리
    if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
        wp_send_json_error(['message' => '파일이 없거나 업로드 중 오류가 발생했습니다.']);
    }

    require_once(ABSPATH . 'wp-admin/includes/image.php');
    require_once(ABSPATH . 'wp-admin/includes/file.php');
    require_once(ABSPATH . 'wp-admin/includes/media.php');

    $attachment_id = media_handle_upload('file', 0); // 특정 포스트에 종속되지 않은(0) 미디어로 업로드

    if (is_wp_error($attachment_id)) {
        wp_send_json_error(['message' => '워드프레스 이미지 저장 실패: ' . $attachment_id->get_error_message()]);
    }

    // 업로드 성공 시, 첨부파일 ID와 이미지 주소를 프론트엔드로 반환합니다.
$url = set_url_scheme(wp_get_attachment_url($attachment_id), 'https');
    wp_send_json_success([
        'id' => $attachment_id,
        'url' => $url
    ]);
}

// =========================================================================
// 9. 썸네일 연결 전용 AJAX 핸들러
// =========================================================================
add_action('wp_ajax_rehoming_set_thumbnail', 'rehoming_handle_set_thumbnail');
add_action('wp_ajax_nopriv_rehoming_set_thumbnail', 'rehoming_handle_set_thumbnail');

function rehoming_handle_set_thumbnail() {
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : 'https://rehoming.netlify.app';
    header("Access-Control-Allow-Origin: " . $origin);
    header("Access-Control-Allow-Credentials: true");

    $token = isset($_POST['token']) ? sanitize_text_field($_POST['token']) : '';
    if (empty($token) || !class_exists('\WPGraphQL\JWT_Authentication\Auth')) {
        wp_send_json_error(['message' => '인증 토큰이 없습니다.']);
    }

    try {
        $decoded = \WPGraphQL\JWT_Authentication\Auth::validate_token($token);
        if (is_wp_error($decoded) || !isset($decoded->data->user->id)) {
            wp_send_json_error(['message' => '유효하지 않은 토큰입니다.']);
        }
        wp_set_current_user($decoded->data->user->id);
    } catch (\Exception $e) {
        wp_send_json_error(['message' => '토큰 검증 오류']);
    }

    $post_id = isset($_POST['post_id']) ? intval($_POST['post_id']) : 0;
    $attachment_id = isset($_POST['attachment_id']) ? intval($_POST['attachment_id']) : 0;

    if (!$post_id || !$attachment_id) {
        wp_send_json_error(['message' => 'post_id 또는 attachment_id가 없습니다.']);
    }

    $result = set_post_thumbnail($post_id, $attachment_id);
    if ($result) {
        wp_send_json_success(['message' => '썸네일이 연결되었습니다.', 'post_id' => $post_id, 'attachment_id' => $attachment_id]);
    } else {
        wp_send_json_error(['message' => '썸네일 연결에 실패했습니다.']);
    }
}

// =========================================================================
// 11. 입양 후기 ACF 필드 저장 전용 AJAX 핸들러
// =========================================================================
add_action('wp_ajax_rehoming_save_review_fields', 'rehoming_handle_save_review_fields');
add_action('wp_ajax_nopriv_rehoming_save_review_fields', 'rehoming_handle_save_review_fields');

function rehoming_handle_save_review_fields() {
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : 'https://rehoming.netlify.app';
    header("Access-Control-Allow-Origin: " . $origin);
    header("Access-Control-Allow-Credentials: true");

    $token = isset($_POST['token']) ? sanitize_text_field($_POST['token']) : '';
    if (empty($token) || !class_exists('\WPGraphQL\JWT_Authentication\Auth')) {
        wp_send_json_error(['message' => '인증 토큰이 없습니다.']);
    }

    try {
        $decoded = \WPGraphQL\JWT_Authentication\Auth::validate_token($token);
        if (is_wp_error($decoded) || !isset($decoded->data->user->id)) {
            wp_send_json_error(['message' => '유효하지 않은 토큰입니다.']);
        }
        wp_set_current_user($decoded->data->user->id);
    } catch (\Exception $e) {
        wp_send_json_error(['message' => '토큰 검증 오류']);
    }

    $post_id = isset($_POST['post_id']) ? intval($_POST['post_id']) : 0;
    if (!$post_id || get_post_type($post_id) !== 'review') {
        wp_send_json_error(['message' => '유효하지 않은 후기 게시물 ID입니다.']);
    }

    $field_map = [
        'authorName'   => 'field_69a0dd92528b3',
        'animalName'   => 'field_69a0ddb1528b4',
        'animalType'   => 'field_69a0ddc1528b5',
        'adoptionDate' => 'field_69a0dde6528b6',
        'quote'        => 'field_69a0df04528b7',
        'isPinned'     => 'field_69a0df35528b8',
    ];

    $saved = [];
    foreach ($field_map as $input_key => $field_key) {
        if (isset($_POST[$input_key])) {
            $value = sanitize_text_field($_POST[$input_key]);
            if ($input_key === 'isPinned') {
                $value = ($value === 'true' || $value === '1') ? true : false;
            }
            update_field($field_key, $value, $post_id);
            $saved[] = $input_key;
        }
    }

    wp_send_json_success(['message' => '후기 ACF 필드 저장 완료', 'post_id' => $post_id, 'saved_fields' => $saved]);
}

// =========================================================================
// 12. 활동/프로젝트 ACF 필드 저장 전용 AJAX 핸들러
// =========================================================================
add_action('wp_ajax_rehoming_save_activity_fields', 'rehoming_handle_save_activity_fields');
add_action('wp_ajax_nopriv_rehoming_save_activity_fields', 'rehoming_handle_save_activity_fields');

function rehoming_handle_save_activity_fields() {
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : 'https://rehoming.netlify.app';
    header("Access-Control-Allow-Origin: " . $origin);
    header("Access-Control-Allow-Credentials: true");

    $token = isset($_POST['token']) ? sanitize_text_field($_POST['token']) : '';
    if (empty($token) || !class_exists('\WPGraphQL\JWT_Authentication\Auth')) {
        wp_send_json_error(['message' => '인증 토큰이 없습니다.']);
    }

    try {
        $decoded = \WPGraphQL\JWT_Authentication\Auth::validate_token($token);
        if (is_wp_error($decoded) || !isset($decoded->data->user->id)) {
            wp_send_json_error(['message' => '유효하지 않은 토큰입니다.']);
        }
        wp_set_current_user($decoded->data->user->id);
    } catch (\Exception $e) {
        wp_send_json_error(['message' => '토큰 검증 오류']);
    }

    $post_id = isset($_POST['post_id']) ? intval($_POST['post_id']) : 0;
    if (!$post_id || get_post_type($post_id) !== 'project') {
        wp_send_json_error(['message' => '유효하지 않은 활동 게시물 ID입니다.']);
    }

    $field_map = [
        'type'          => 'field_699cfe2652940',
        'impactSummary' => 'field_699cfe6f52941',
        'pintoimpact'   => 'field_699d2b1f76e18',
    ];

    $saved = [];
    foreach ($field_map as $input_key => $field_key) {
        if (isset($_POST[$input_key])) {
            $value = sanitize_text_field($_POST[$input_key]);
            if ($input_key === 'pintoimpact') {
                $value = ($value === 'true' || $value === '1') ? true : false;
            }
            update_field($field_key, $value, $post_id);
            $saved[] = $input_key;
        }
    }

    wp_send_json_success(['message' => '활동 ACF 필드 저장 완료', 'post_id' => $post_id, 'saved_fields' => $saved]);
}

// =========================================================================
// 13. 후원/봉사 게시판 ACF 필드 저장 전용 AJAX 핸들러
// =========================================================================
add_action('wp_ajax_rehoming_save_support_fields', 'rehoming_handle_save_support_fields');
add_action('wp_ajax_nopriv_rehoming_save_support_fields', 'rehoming_handle_save_support_fields');

function rehoming_handle_save_support_fields() {
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : 'https://rehoming.netlify.app';
    header("Access-Control-Allow-Origin: " . $origin);
    header("Access-Control-Allow-Credentials: true");

    $token = isset($_POST['token']) ? sanitize_text_field($_POST['token']) : '';
    if (empty($token) || !class_exists('\WPGraphQL\JWT_Authentication\Auth')) {
        wp_send_json_error(['message' => '인증 토큰이 없습니다.']);
    }

    try {
        $decoded = \WPGraphQL\JWT_Authentication\Auth::validate_token($token);
        if (is_wp_error($decoded) || !isset($decoded->data->user->id)) {
            wp_send_json_error(['message' => '유효하지 않은 토큰입니다.']);
        }
        wp_set_current_user($decoded->data->user->id);
    } catch (\Exception $e) {
        wp_send_json_error(['message' => '토큰 검증 오류']);
    }

    $post_id = isset($_POST['post_id']) ? intval($_POST['post_id']) : 0;
    if (!$post_id || get_post_type($post_id) !== 'support') {
        wp_send_json_error(['message' => '유효하지 않은 게시물 ID입니다.']);
    }

    $field_map = [
        'attachedFile' => 'field_69a10302926e5',
        'isNotice'     => 'field_69a10356926e6',
        'viewCount'    => 'field_69a10388926e7',
    ];

    $saved = [];
    foreach ($field_map as $input_key => $field_key) {
        if (isset($_POST[$input_key])) {
            $value = sanitize_text_field($_POST[$input_key]);
            if ($input_key === 'isNotice') {
                $value = ($value === 'true' || $value === '1') ? true : false;
            }
            if ($input_key === 'viewCount') {
                $value = intval($value);
            }
            update_field($field_key, $value, $post_id);
            $saved[] = $input_key;
        }
    }

    wp_send_json_success(['message' => '게시판 ACF 필드 저장 완료', 'post_id' => $post_id, 'saved_fields' => $saved]);
}

// ==========================================
// 14. 미디어 사용처 검색 AJAX 핸들러
// ==========================================
add_action('wp_ajax_rehoming_find_media_usage', 'rehoming_handle_find_media_usage');
add_action('wp_ajax_nopriv_rehoming_find_media_usage', 'rehoming_handle_find_media_usage');

function rehoming_handle_find_media_usage() {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Content-Type: application/json');

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }

    // JWT 토큰 검증
    $token = isset($_POST['token']) ? sanitize_text_field($_POST['token']) : '';
    if (empty($token)) {
        wp_send_json_error(['message' => '토큰이 필요합니다.']);
    }

    try {
        $decoded = \WPGraphQL\JWT_Authentication\Auth::validate_token($token);
        if (is_wp_error($decoded) || !isset($decoded->data->user->id)) {
            wp_send_json_error(['message' => '유효하지 않은 토큰입니다.']);
        }
        wp_set_current_user($decoded->data->user->id);
    } catch (\Exception $e) {
        wp_send_json_error(['message' => '토큰 검증 오류']);
    }

    $attachment_id = isset($_POST['attachment_id']) ? intval($_POST['attachment_id']) : 0;
    if (!$attachment_id || get_post_type($attachment_id) !== 'attachment') {
        wp_send_json_error(['message' => '유효하지 않은 미디어 ID입니다.']);
    }

    $usage = [];

    // 1) 대표이미지(썸네일)로 사용 중인 글 검색
    global $wpdb;
    $thumbnail_posts = $wpdb->get_results(
        $wpdb->prepare(
            "SELECT p.ID, p.post_title, p.post_type
             FROM {$wpdb->postmeta} pm
             JOIN {$wpdb->posts} p ON pm.post_id = p.ID
             WHERE pm.meta_key = '_thumbnail_id'
               AND pm.meta_value = %s
               AND p.post_status IN ('publish','draft','pending','private')",
            $attachment_id
        ),
        ARRAY_A
    );

    foreach ($thumbnail_posts as $post) {
        $usage[] = [
            'postId'    => (int) $post['ID'],
            'title'     => $post['post_title'],
            'postType'  => $post['post_type'],
            'usageType' => 'thumbnail',
        ];
    }

    // 2) 본문 내 이미지 URL로 사용 중인 글 검색
    $attachment_url = wp_get_attachment_url($attachment_id);
    if ($attachment_url) {
        // URL에서 도메인 부분 제거하여 상대 경로로 검색 (http/https 모두 매칭)
        $parsed = parse_url($attachment_url);
        $path_part = isset($parsed['path']) ? $parsed['path'] : '';

        if ($path_part) {
            $content_posts = $wpdb->get_results(
                $wpdb->prepare(
                    "SELECT ID, post_title, post_type
                     FROM {$wpdb->posts}
                     WHERE post_content LIKE %s
                       AND post_type IN ('animal','project','review','support','post','page')
                       AND post_status IN ('publish','draft','pending','private')",
                    '%' . $wpdb->esc_like($path_part) . '%'
                ),
                ARRAY_A
            );

            foreach ($content_posts as $post) {
                // 중복 제거 (이미 thumbnail로 등록된 것 제외)
                $already = false;
                foreach ($usage as $u) {
                    if ($u['postId'] === (int) $post['ID']) {
                        $already = true;
                        break;
                    }
                }
                if (!$already) {
                    $usage[] = [
                        'postId'    => (int) $post['ID'],
                        'title'     => $post['post_title'],
                        'postType'  => $post['post_type'],
                        'usageType' => 'content',
                    ];
                }
            }
        }
    }

    // 3) ACF 필드(image 타입)에서 사용 중인지 검색
    $acf_posts = $wpdb->get_results(
        $wpdb->prepare(
            "SELECT pm.post_id, p.post_title, p.post_type
             FROM {$wpdb->postmeta} pm
             JOIN {$wpdb->posts} p ON pm.post_id = p.ID
             WHERE pm.meta_value = %s
               AND pm.meta_key NOT LIKE '\_%%'
               AND p.post_type IN ('animal','project','review','support','post','page')
               AND p.post_status IN ('publish','draft','pending','private')",
            $attachment_id
        ),
        ARRAY_A
    );

    foreach ($acf_posts as $post) {
        $already = false;
        foreach ($usage as $u) {
            if ($u['postId'] === (int) $post['post_id']) {
                $already = true;
                break;
            }
        }
        if (!$already) {
            $usage[] = [
                'postId'    => (int) $post['post_id'],
                'title'     => $post['post_title'],
                'postType'  => $post['post_type'],
                'usageType' => 'acf_field',
            ];
        }
    }

    wp_send_json_success([
        'attachmentId' => $attachment_id,
        'usageCount'   => count($usage),
        'usage'        => $usage,
    ]);
}

// ==========================================
// 15. 미디어 사용 여부 벌크 체크 AJAX 핸들러
// ==========================================
add_action('wp_ajax_rehoming_check_media_usage_bulk', 'rehoming_handle_check_media_usage_bulk');
add_action('wp_ajax_nopriv_rehoming_check_media_usage_bulk', 'rehoming_handle_check_media_usage_bulk');

function rehoming_handle_check_media_usage_bulk() {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Content-Type: application/json');

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }

    $token = isset($_POST['token']) ? sanitize_text_field($_POST['token']) : '';
    if (empty($token)) {
        wp_send_json_error(['message' => '토큰이 필요합니다.']);
    }

    try {
        $decoded = \WPGraphQL\JWT_Authentication\Auth::validate_token($token);
        if (is_wp_error($decoded) || !isset($decoded->data->user->id)) {
            wp_send_json_error(['message' => '유효하지 않은 토큰입니다.']);
        }
        wp_set_current_user($decoded->data->user->id);
    } catch (\Exception $e) {
        wp_send_json_error(['message' => '토큰 검증 오류']);
    }

    $ids_raw = isset($_POST['attachment_ids']) ? sanitize_text_field($_POST['attachment_ids']) : '';
    if (empty($ids_raw)) {
        wp_send_json_error(['message' => 'attachment_ids가 필요합니다.']);
    }

    $ids = array_map('intval', explode(',', $ids_raw));
    $ids = array_filter($ids, function($id) { return $id > 0; });
    if (empty($ids)) {
        wp_send_json_success(['usage' => []]);
    }

    global $wpdb;
    $result = [];

    // 1) 대표이미지로 사용 중인 ID 수집
    $placeholders = implode(',', array_fill(0, count($ids), '%s'));
    $thumb_query = $wpdb->prepare(
        "SELECT DISTINCT meta_value AS attachment_id
         FROM {$wpdb->postmeta} pm
         JOIN {$wpdb->posts} p ON pm.post_id = p.ID
         WHERE pm.meta_key = '_thumbnail_id'
           AND pm.meta_value IN ($placeholders)
           AND p.post_status IN ('publish','draft','pending','private')",
        ...$ids
    );
    $thumb_ids = $wpdb->get_col($thumb_query);
    foreach ($thumb_ids as $tid) {
        $result[(int)$tid] = true;
    }

    // 2) 본문 내 URL로 사용 중인 ID 수집
    $remaining = array_diff($ids, array_map('intval', $thumb_ids));
    if (!empty($remaining)) {
        foreach ($remaining as $att_id) {
            if (isset($result[$att_id])) continue;
            $url = wp_get_attachment_url($att_id);
            if (!$url) continue;
            $parsed = parse_url($url);
            $path_part = isset($parsed['path']) ? $parsed['path'] : '';
            if (!$path_part) continue;

            $found = $wpdb->get_var(
                $wpdb->prepare(
                    "SELECT COUNT(*) FROM {$wpdb->posts}
                     WHERE post_content LIKE %s
                       AND post_type IN ('animal','project','review','support','post','page')
                       AND post_status IN ('publish','draft','pending','private')
                     LIMIT 1",
                    '%' . $wpdb->esc_like($path_part) . '%'
                )
            );
            if ((int)$found > 0) {
                $result[$att_id] = true;
            }
        }
    }

    // 3) ACF 필드에서 사용 중인 ID 수집
    $remaining2 = array_diff($ids, array_keys($result));
    if (!empty($remaining2)) {
        $placeholders2 = implode(',', array_fill(0, count($remaining2), '%s'));
        $acf_query = $wpdb->prepare(
            "SELECT DISTINCT pm.meta_value AS attachment_id
             FROM {$wpdb->postmeta} pm
             JOIN {$wpdb->posts} p ON pm.post_id = p.ID
             WHERE pm.meta_value IN ($placeholders2)
               AND pm.meta_key NOT LIKE '\_%%'
               AND p.post_type IN ('animal','project','review','support','post','page')
               AND p.post_status IN ('publish','draft','pending','private')",
            ...$remaining2
        );
        $acf_ids = $wpdb->get_col($acf_query);
        foreach ($acf_ids as $aid) {
            $result[(int)$aid] = true;
        }
    }

    // 사용 중인 ID 목록만 반환
    wp_send_json_success([
        'usedIds' => array_map('intval', array_keys($result)),
    ]);
}
