using Sabio.Models.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services.Interfaces
{
    public interface IPostsService
    {
        string GetByPost(int id);
        string GetByUser(int userId, int page, int pageSize);
        int CreatePost(PostsCreateRequest req);
        void UpdatePost(PostsUpdateRequest req);
        void DeletePost(int id);
        Dictionary<int, List<PostTags>> GetPostTagsByIds(int[] ids);
        int CreatePostTag(PostTagsCreateRequest tag);
        void DeletePostTag(int id);
        Dictionary<int, List<PostLikes>> GetPostLikesByPostIds(int[] ids);
        int CreatePostLike(PostLikesCreateRequest like);
        void DeletePostLike(int UserId, int PostId);
       

    }
}
