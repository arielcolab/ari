
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dd_CommunityPost } from '@/api/entities';
import { User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Plus, Heart, MessageCircle, MapPin, Clock, DollarSign, BookOpen, Gift, Users, X } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { useTranslation } from '../components/utils/translations';
import { showToast } from '../components/common/ErrorBoundary';
import { FeatureFlag } from '../components/dd_FeatureFlag';

const PostCard = ({ post, onLike, onComment }) => {
  const navigate = useNavigate();
  const getPostIcon = () => {
    const icons = {
      recipe: BookOpen,
      free_food: Gift,
      class: Users,
      tip: Users,
      story: MessageCircle
    };
    return icons[post.type] || MessageCircle;
  };

  const PostIcon = getPostIcon();

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
      <div className="flex items-start gap-3 mb-3">
        <div className={`p-2 rounded-full ${
          post.type === 'recipe' ? 'bg-green-100' :
          post.type === 'free_food' ? 'bg-orange-100' :
          post.type === 'class' ? 'bg-blue-100' :
          'bg-gray-100'
        }`}>
          <PostIcon className={`w-4 h-4 ${
            post.type === 'recipe' ? 'text-green-600' :
            post.type === 'free_food' ? 'text-orange-600' :
            post.type === 'class' ? 'text-blue-600' :
            'text-gray-600'
          }`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900">{post.author_name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              post.type === 'recipe' ? 'bg-green-100 text-green-800' :
              post.type === 'free_food' ? 'bg-orange-100 text-orange-800' :
              post.type === 'class' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {post.type.replace('_', ' ')}
            </span>
            {post.is_featured && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Featured
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mb-2">
            {new Date(post.created_date).toLocaleDateString()}
          </p>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h2>
      <p className="text-gray-700 mb-3">{post.body}</p>

      {post.media_url && (
        <img 
          src={post.media_url} 
          alt={post.title}
          className="w-full h-48 object-cover rounded-lg mb-3"
        />
      )}

      {post.type === 'free_food' && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-3">
          <div className="flex items-center gap-2 text-orange-800 mb-1">
            <MapPin className="w-4 h-4" />
            <span className="font-medium">{post.location}</span>
          </div>
          {post.available_until && (
            <div className="flex items-center gap-2 text-orange-700">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Available until {new Date(post.available_until).toLocaleString()}</span>
            </div>
          )}
        </div>
      )}

      {post.type === 'class' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-800">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{new Date(post.class_date).toLocaleDateString()}</span>
            </div>
            {post.class_price && (
              <div className="flex items-center gap-1 text-blue-800">
                <DollarSign className="w-4 h-4" />
                <span className="font-semibold">{post.class_price}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onLike(post.id)}
            className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors"
          >
            <Heart className="w-4 h-4" />
            <span className="text-sm">{post.likes_count}</span>
          </button>
          <button 
            onClick={() => onComment(post.id)}
            className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">{post.comments_count}</span>
          </button>
        </div>

        {(post.type === 'free_food' || post.type === 'class') && (
          <Button size="sm" className="bg-red-500 hover:bg-red-600">
            {post.type === 'class' ? 'Book Now' : 'Get Food'}
          </Button>
        )}
      </div>
    </div>
  );
};

const CreatePostModal = ({ isOpen, onClose, onSubmit }) => {
  const [postData, setPostData] = useState({
    type: 'story',
    title: '',
    body: '',
    location: '',
    available_until: '',
    class_date: '',
    class_price: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(postData);
    setPostData({
      type: 'story',
      title: '',
      body: '',
      location: '',
      available_until: '',
      class_date: '',
      class_price: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:w-96 max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Create Post</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Post Type</label>
            <select 
              value={postData.type}
              onChange={(e) => setPostData({...postData, type: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="story">Story/Tip</option>
              <option value="recipe">Recipe</option>
              <option value="free_food">Free Food</option>
              <option value="class">Cooking Class</option>
            </select>
          </div>

          <Input
            placeholder="Title"
            value={postData.title}
            onChange={(e) => setPostData({...postData, title: e.target.value})}
            required
          />

          <Textarea
            placeholder="What's on your mind?"
            value={postData.body}
            onChange={(e) => setPostData({...postData, body: e.target.value})}
            required
            className="h-24"
          />

          {postData.type === 'free_food' && (
            <>
              <Input
                placeholder="Location"
                value={postData.location}
                onChange={(e) => setPostData({...postData, location: e.target.value})}
              />
              <Input
                type="datetime-local"
                placeholder="Available until"
                value={postData.available_until}
                onChange={(e) => setPostData({...postData, available_until: e.target.value})}
              />
            </>
          )}

          {postData.type === 'class' && (
            <>
              <Input
                type="datetime-local"
                placeholder="Class date"
                value={postData.class_date}
                onChange={(e) => setPostData({...postData, class_date: e.target.value})}
              />
              <Input
                type="number"
                placeholder="Price"
                value={postData.class_price}
                onChange={(e) => setPostData({...postData, class_price: e.target.value})}
              />
            </>
          )}

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-red-500 hover:bg-red-600">
              Post
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function CommunityPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadPostsAndUser();
  }, [filter]);

  const loadPostsAndUser = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);

      let allPosts = await dd_CommunityPost.list('-created_date');
      
      if (filter !== 'all') {
        allPosts = allPosts.filter(post => post.type === filter);
      }
      
      setPosts(allPosts);
    } catch (error) {
      console.error('Error loading community data:', error);
    }
    setIsLoading(false);
  };

  const handleCreatePost = async (postData) => {
    try {
      await dd_CommunityPost.create({
        ...postData,
        author_id: user.id,
        author_name: user.full_name,
        likes_count: 0,
        comments_count: 0
      });
      
      setShowCreateModal(false);
      loadPostsAndUser();
      showToast('Post created successfully!', 'success');
    } catch (error) {
      console.error('Error creating post:', error);
      showToast('Failed to create post', 'error');
    }
  };

  const handleLike = async (postId) => {
    // Implement like functionality
    const post = posts.find(p => p.id === postId);
    if (post) {
      try {
        await dd_CommunityPost.update(postId, {
          likes_count: post.likes_count + 1
        });
        loadPostsAndUser();
      } catch (error) {
        console.error('Error liking post:', error);
      }
    }
  };

  const handleComment = (postId) => {
    // Navigate to post details with comments
    navigate(createPageUrl(`CommunityPost?id=${postId}`));
  };

  const filterOptions = [
    { value: 'all', label: 'All Posts', icon: Users },
    { value: 'recipe', label: 'Recipes', icon: BookOpen },
    { value: 'free_food', label: 'Free Food', icon: Gift },
    { value: 'class', label: 'Classes', icon: Users },
    { value: 'story', label: 'Stories', icon: MessageCircle }
  ];

  return (
    <FeatureFlag flag="ff_community">
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="sticky top-0 bg-white/90 backdrop-blur-sm px-4 py-4 z-10 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">Community</h1>
            </div>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-red-500 hover:bg-red-600"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Post
            </Button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {filterOptions.map(option => (
              <Button
                key={option.value}
                variant={filter === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(option.value)}
                className={filter === option.value ? "bg-red-500 hover:bg-red-600" : ""}
              >
                <option.icon className="w-4 h-4 mr-1" />
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="p-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-500 mb-6">Be the first to share something with the community!</p>
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="bg-red-500 hover:bg-red-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Post
              </Button>
            </div>
          ) : (
            posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onComment={handleComment}
              />
            ))
          )}
        </div>

        <CreatePostModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreatePost}
        />
      </div>
    </FeatureFlag>
  );
}
