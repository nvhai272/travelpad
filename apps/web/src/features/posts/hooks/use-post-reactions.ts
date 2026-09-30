'use client';

import { useState } from 'react';
import type { PostSummary } from '@travelpad/contracts';
import { useApp } from '@/features/app/app-provider';
import { browserApi } from '@/lib/browser-api';

/** Thả tim / lưu bài – cập nhật lạc quan, lỗi thì hoàn tác; khách → mời đăng nhập (BR-POST-03). */
export function usePostReactions(post: PostSummary) {
  const { requireAuth } = useApp();
  const [liked, setLiked] = useState(post.viewer.liked);
  const [saved, setSaved] = useState(post.viewer.saved);
  const [likes, setLikes] = useState(post.likeCount);

  const toggleLike = () => requireAuth(() => {
    const next = !liked;
    setLiked(next);
    setLikes((n) => n + (next ? 1 : -1));
    (next ? browserApi.posts.like(post.id) : browserApi.posts.unlike(post.id)).catch(() => {
      setLiked(!next);
      setLikes((n) => n + (next ? -1 : 1));
    });
  });

  const toggleSave = () => requireAuth(() => {
    const next = !saved;
    setSaved(next);
    (next ? browserApi.posts.save(post.id) : browserApi.posts.unsave(post.id)).catch(() => setSaved(!next));
  });

  return { liked, saved, likes, toggleLike, toggleSave };
}
