"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import BaseImage from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import { getAuthToken } from "@/lib/auth";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Unlink,
  Loader2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Quote,
  Minus,
  Undo2,
  Redo2,
  Code,
  Highlighter,
  Palette,
  RectangleHorizontal,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface RichEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
  disabled?: boolean;
  error?: string;
}

// TipTap Image 확장: style 속성을 스키마에 추가하여 크기 조절 지원
const ResizableImage = BaseImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('style'),
        renderHTML: (attributes: Record<string, string>) => {
          if (!attributes.style) return {};
          return { style: attributes.style };
        },
      },
    };
  },
});

// 이미지 크기 프리셋
const IMAGE_SIZES = [
  { label: "S", width: "25%", title: "작게 (25%)" },
  { label: "M", width: "50%", title: "중간 (50%)" },
  { label: "L", width: "75%", title: "크게 (75%)" },
  { label: "Full", width: "100%", title: "원본 (100%)" },
];

// 색상 프리셋
const TEXT_COLORS = [
  { label: "기본", color: "inherit" },
  { label: "빨강", color: "#ef4444" },
  { label: "주황", color: "#f97316" },
  { label: "노랑", color: "#eab308" },
  { label: "초록", color: "#22c55e" },
  { label: "파랑", color: "#3b82f6" },
  { label: "보라", color: "#a855f7" },
  { label: "회색", color: "#6b7280" },
];

const HIGHLIGHT_COLORS = [
  { label: "노랑", color: "#fef08a" },
  { label: "초록", color: "#bbf7d0" },
  { label: "파랑", color: "#bfdbfe" },
  { label: "분홍", color: "#fbcfe8" },
  { label: "주황", color: "#fed7aa" },
];

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL을 입력하세요", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor || isUploading) return;
    fileInputRef.current?.click();
  }, [editor, isUploading]);

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!editor) return;
      const file = e.target.files?.[0];
      if (!file) return;
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (!file.type.startsWith("image/")) return;
      if (file.size > 5 * 1024 * 1024) {
        alert("이미지 크기는 5MB를 초과할 수 없습니다.");
        return;
      }

      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("action", "rehoming_upload_image");
        formData.append("file", file);
        formData.append("token", getAuthToken() || "");
        const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace(
          "/graphql",
          ""
        );
        const res = await fetch(`${wpUrl}/wp-admin/admin-ajax.php`, {
          method: "POST",
          body: formData,
        });
        const json = await res.json();
        if (json.success && json.data?.url) {
          const safeUrl = json.data.url.replace(/^http:\/\//, "https://");
          editor.chain().focus().setImage({ src: safeUrl }).run();
        } else {
          alert(json.data?.message || "이미지 업로드에 실패했습니다.");
        }
      } catch {
        alert("이미지 업로드 중 오류가 발생했습니다.");
      } finally {
        setIsUploading(false);
      }
    },
    [editor]
  );

  if (!editor) return null;

  const ToolbarButton = ({
    onClick,
    isActive = false,
    disabled = false,
    title,
    children,
    className = "",
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    title: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <Button
      type="button"
      variant={isActive ? "secondary" : "ghost"}
      size="sm"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`h-8 w-8 p-0 ${isActive ? "" : "text-muted-foreground"} ${className}`}
    >
      {children}
    </Button>
  );

  const Separator = () => <div className="w-px h-6 bg-border mx-0.5" />;

  return (
    <div className="flex flex-wrap items-center gap-0.5 p-2 border-b bg-muted/50 sticky top-0 z-10 rounded-t-md">
      {/* Undo / Redo */}
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        title="실행 취소 (Ctrl+Z)"
      >
        <Undo2 size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        title="다시 실행 (Ctrl+Y)"
      >
        <Redo2 size={16} />
      </ToolbarButton>

      <Separator />

      {/* Text formatting */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        title="굵게 (Ctrl+B)"
      >
        <Bold size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        title="기울임 (Ctrl+I)"
      >
        <Italic size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        isActive={editor.isActive("underline")}
        title="밑줄 (Ctrl+U)"
      >
        <UnderlineIcon size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        isActive={editor.isActive("strike")}
        title="취소선"
      >
        <Strikethrough size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        isActive={editor.isActive("code")}
        title="인라인 코드"
      >
        <Code size={16} />
      </ToolbarButton>

      <Separator />

      {/* Text color */}
      <div className="relative">
        <ToolbarButton
          onClick={() => {
            setShowColorPicker(!showColorPicker);
            setShowHighlightPicker(false);
          }}
          isActive={showColorPicker}
          title="글자 색상"
        >
          <Palette size={16} />
        </ToolbarButton>
        {showColorPicker && (
          <div className="absolute top-full left-0 mt-1 p-1.5 bg-popover border rounded-lg shadow-lg z-50 flex gap-1">
            {TEXT_COLORS.map((c) => (
              <button
                type="button"
                key={c.color}
                title={c.label}
                className="w-6 h-6 rounded-full border border-border hover:scale-110 transition-transform"
                style={{ backgroundColor: c.color === "inherit" ? "#fff" : c.color }}
                onClick={() => {
                  if (c.color === "inherit") {
                    editor.chain().focus().unsetColor().run();
                  } else {
                    editor.chain().focus().setColor(c.color).run();
                  }
                  setShowColorPicker(false);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Highlight */}
      <div className="relative">
        <ToolbarButton
          onClick={() => {
            setShowHighlightPicker(!showHighlightPicker);
            setShowColorPicker(false);
          }}
          isActive={showHighlightPicker || editor.isActive("highlight")}
          title="형광펜"
        >
          <Highlighter size={16} />
        </ToolbarButton>
        {showHighlightPicker && (
          <div className="absolute top-full left-0 mt-1 p-1.5 bg-popover border rounded-lg shadow-lg z-50 flex gap-1">
            {HIGHLIGHT_COLORS.map((c) => (
              <button
                type="button"
                key={c.color}
                title={c.label}
                className="w-6 h-6 rounded-full border border-border hover:scale-110 transition-transform"
                style={{ backgroundColor: c.color }}
                onClick={() => {
                  editor
                    .chain()
                    .focus()
                    .toggleHighlight({ color: c.color })
                    .run();
                  setShowHighlightPicker(false);
                }}
              />
            ))}
            <button
              type="button"
              title="형광펜 제거"
              className="w-6 h-6 rounded-full border border-border bg-white hover:scale-110 transition-transform flex items-center justify-center text-xs text-red-400"
              onClick={() => {
                editor.chain().focus().unsetHighlight().run();
                setShowHighlightPicker(false);
              }}
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <Separator />

      {/* Headings */}
      <ToolbarButton
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
        isActive={editor.isActive("heading", { level: 1 })}
        title="제목 1"
      >
        <Heading1 size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
        isActive={editor.isActive("heading", { level: 2 })}
        title="제목 2"
      >
        <Heading2 size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
        isActive={editor.isActive("heading", { level: 3 })}
        title="제목 3"
      >
        <Heading3 size={16} />
      </ToolbarButton>

      <Separator />

      {/* Lists */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
        title="글머리 기호"
      >
        <List size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
        title="번호 매기기"
      >
        <ListOrdered size={16} />
      </ToolbarButton>

      {/* Blockquote */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive("blockquote")}
        title="인용문"
      >
        <Quote size={16} />
      </ToolbarButton>

      {/* Horizontal Rule */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="구분선"
      >
        <Minus size={16} />
      </ToolbarButton>

      <Separator />

      {/* Text alignment */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        isActive={editor.isActive({ textAlign: "left" })}
        title="왼쪽 정렬"
      >
        <AlignLeft size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        isActive={editor.isActive({ textAlign: "center" })}
        title="가운데 정렬"
      >
        <AlignCenter size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        isActive={editor.isActive({ textAlign: "right" })}
        title="오른쪽 정렬"
      >
        <AlignRight size={16} />
      </ToolbarButton>

      <Separator />

      {/* Link */}
      <ToolbarButton
        onClick={setLink}
        isActive={editor.isActive("link")}
        title="링크 추가"
      >
        <LinkIcon size={16} />
      </ToolbarButton>
      {editor.isActive("link") && (
        <ToolbarButton
          onClick={() => editor.chain().focus().unsetLink().run()}
          title="링크 제거"
        >
          <Unlink size={16} />
        </ToolbarButton>
      )}

      {/* Image Upload */}
      <ToolbarButton
        onClick={addImage}
        title="이미지 업로드"
        disabled={isUploading}
      >
        {isUploading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <ImageIcon size={16} />
        )}
      </ToolbarButton>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
};

// 이미지 선택 시 뜨는 크기 조절 팝오버 (커스텀 구현)
const ImageResizeBar = ({ editor }: { editor: Editor | null }) => {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editor) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' && target.closest('.ProseMirror')) {
        const rect = target.getBoundingClientRect();
        const editorEl = target.closest('.ProseMirror')?.parentElement;
        const editorRect = editorEl?.getBoundingClientRect();
        if (editorRect) {
          setPosition({
            top: rect.top - editorRect.top - 40,
            left: rect.left - editorRect.left + rect.width / 2 - 120,
          });
        }
        setShow(true);
      } else if (!barRef.current?.contains(target)) {
        setShow(false);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [editor]);

  if (!show || !editor || !editor.isActive('image')) return null;

  return (
    <div
      ref={barRef}
      className="absolute z-50 flex items-center gap-1 px-2 py-1.5 bg-white border rounded-lg shadow-xl"
      style={{ top: Math.max(0, position.top), left: Math.max(0, position.left) }}
    >
      {IMAGE_SIZES.map((size) => (
        <button
          type="button"
          key={size.width}
          title={size.title}
          className="px-2 py-1 text-xs font-medium rounded hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
          onClick={() => {
            editor
              .chain()
              .focus()
              .updateAttributes('image', {
                style: `width: ${size.width}; height: auto;`,
              })
              .run();
          }}
        >
          {size.label}
        </button>
      ))}
      <div className="w-px h-5 bg-border mx-0.5" />
      <button
        type="button"
        title="가운데 정렬"
        className="px-2 py-1 text-xs font-medium rounded hover:bg-slate-100 transition-colors"
        onClick={() => {
          editor
            .chain()
            .focus()
            .updateAttributes('image', {
              style: `width: 75%; height: auto; display: block; margin: 0 auto;`,
            })
            .run();
        }}
      >
        <AlignCenter size={14} />
      </button>
      <button
        type="button"
        title="삭제"
        className="px-2 py-1 text-xs font-medium rounded hover:bg-red-50 text-red-500 transition-colors"
        onClick={() => {
          editor.chain().focus().deleteSelection().run();
          setShow(false);
        }}
      >
        ✕
      </button>
    </div>
  );
};

export const RichEditor: React.FC<RichEditorProps> = ({
  value,
  onChange,
  placeholder = "내용을 입력하세요...",
  minHeight = "200px",
  disabled = false,
  error,
}) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline cursor-pointer",
        },
      }),
      ResizableImage.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-md my-4 cursor-pointer",
        },
        allowBase64: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass:
          "cursor-text before:content-[attr(data-placeholder)] before:absolute before:text-slate-400 before:pointer-events-none",
      }),
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm sm:prose-base max-w-none focus:outline-none p-4`,
        style: `min-height: ${minHeight};`,
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [disabled, editor]);

  return (
    <div className="w-full flex flex-col">
      <div
        className={`
          flex flex-col border rounded-md bg-background overflow-hidden transition-colors
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${error ? "border-destructive" : "border-input"}
          focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2
        `}
      >
        <MenuBar editor={editor} />
        <div className="relative flex-1 overflow-y-auto">
          <ImageResizeBar editor={editor} />
          <EditorContent editor={editor} />
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default RichEditor;
