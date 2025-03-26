import React, { useState } from 'react';

interface Post {
  id: number;
  author: string;
  content: string;
  likes: number;
  comments: number;
  timestamp: string;
}

const Community: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: '啤酒爱好者',
      content: '今天尝试了Freedom，口感清爽，非常适合夏天饮用！',
      likes: 12,
      comments: 3,
      timestamp: '2024-03-21 14:30',
    },
    {
      id: 2,
      author: '精酿达人',
      content: 'YUZU的柚子香气非常浓郁，推荐给喜欢果味啤酒的朋友。',
      likes: 8,
      comments: 2,
      timestamp: '2024-03-21 13:15',
    },
    // 更多示例帖子...
  ]);

  const [newPost, setNewPost] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    const post: Post = {
      id: posts.length + 1,
      author: '当前用户',
      content: newPost.trim(),
      likes: 0,
      comments: 0,
      timestamp: new Date().toLocaleString(),
    };

    setPosts([post, ...posts]);
    setNewPost('');
  };

  const handleLike = (id: number) => {
    setPosts(posts.map(post =>
      post.id === id
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* 发帖表单 */}
      <form onSubmit={handleSubmit} className="mb-8">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="分享您的品酒体验..."
          className="input h-32 mb-4"
        />
        <button type="submit" className="btn btn-primary">
          发布
        </button>
      </form>

      {/* 帖子列表 */}
      <div className="space-y-6">
        {posts.map(post => (
          <div key={post.id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold">{post.author}</h3>
                <p className="text-sm text-gray-500">{post.timestamp}</p>
              </div>
              <button
                onClick={() => handleLike(post.id)}
                className="text-gray-500 hover:text-accent"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>
            <p className="text-gray-800 mb-4">{post.content}</p>
            <div className="flex space-x-4 text-sm text-gray-500">
              <span>{post.likes} 赞</span>
              <span>{post.comments} 评论</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community; 