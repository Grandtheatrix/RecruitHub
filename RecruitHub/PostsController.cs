using Sabio.Models.Domain;
using Sabio.Models.Responses;
using Sabio.Services.Interfaces;
using Sabio.Services.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Sabio.Web.Controllers.Api
{
    public class PostsController : ApiController
    {
        readonly IPostsService postsService;

        public PostsController(IPostsService postsService)
        {
            this.postsService = postsService;
        }

        [Route("api/posts/{id:int}"), HttpGet]
        public HttpResponseMessage GetByPost(int id)
        {
            string post = postsService.GetByPost(id);

            ItemResponse<string> itemResponse = new ItemResponse<string>();
            itemResponse.Item = post;

            return Request.CreateResponse(HttpStatusCode.OK, itemResponse);
        }

        [Route("api/posts/current-user"), HttpGet]
        public HttpResponseMessage GetByUser(int page, int pageSize)
        {
            int userId = User.Identity.GetId().Value;

            string posts = postsService.GetByUser(userId, page, pageSize);

            ItemResponse<string> itemResponse = new ItemResponse<string>();
            itemResponse.Item = posts;

            return Request.CreateResponse(HttpStatusCode.OK, itemResponse);
        }

        [Route("api/posts"), HttpPost]
        public HttpResponseMessage CreatePost(PostsCreateRequest req)
        {
            req.UserId = User.Identity.GetId().Value;

            if (req == null)
            {
                ModelState.AddModelError("", "You did not send any body data");
            }

            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            int id = postsService.CreatePost(req);
            ItemResponse<int> itemResponse = new ItemResponse<int>();
            itemResponse.Item = id;

            return Request.CreateResponse(HttpStatusCode.Created, itemResponse);
        }

        [Route("api/posts/{id:int}"), HttpPut]
        public HttpResponseMessage UpdatePost(PostsUpdateRequest req, int id)
        {
            if (req == null)
            {
                ModelState.AddModelError("", "You did not add any body data!");
            }

            if (req.Id != id)
            {
                ModelState.AddModelError("Id", "Id in the URL does not match the Id in the body.");
            }

            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            postsService.UpdatePost(req);

            return Request.CreateResponse(HttpStatusCode.OK, new SuccessResponse());
        }
        [Route("api/posts/{id:int}"), HttpDelete]
        public HttpResponseMessage DeletePost(int id)
        {
            postsService.DeletePost(id);

            return Request.CreateResponse(HttpStatusCode.OK, new SuccessResponse());
        }

        [Route("api/posts/tags/ids"), HttpPost]
        public HttpResponseMessage GetPostTagsByIds(PostTagsLikesMultiplexGetRequest req)
        {
            var result = postsService.GetPostTagsByIds(req.Ids);

            var itemResponse = new ItemResponse<Dictionary<int, List<PostTags>>>();
            itemResponse.Item = result;

            return Request.CreateResponse(HttpStatusCode.OK, itemResponse);
        }


        [Route("api/posts/tags"), HttpPost]
        public HttpResponseMessage CreatePostTag(PostTagsCreateRequest req)
        {

            if (req == null)
            {
                ModelState.AddModelError("", "You did not send any body data");
            }

            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            int id = postsService.CreatePostTag(req);
            ItemResponse<int> itemResponse = new ItemResponse<int>();
            itemResponse.Item = id;

            return Request.CreateResponse(HttpStatusCode.Created, itemResponse);
        }

        [Route("api/posts/tags/{id:int}"), HttpDelete]
        public HttpResponseMessage DeletePostTag(int id)
        {
            postsService.DeletePostTag(id);

            return Request.CreateResponse(HttpStatusCode.OK, new SuccessResponse());
        }


        [Route("api/posts/likes/ids"), HttpPost]
        public HttpResponseMessage GetPostLikesByPostIds(PostTagsLikesMultiplexGetRequest req)
        {
            var result = postsService.GetPostLikesByPostIds(req.Ids);

            var itemResponse = new ItemResponse<Dictionary<int, List<PostLikes>>>();
            itemResponse.Item = result;

            return Request.CreateResponse(HttpStatusCode.OK, itemResponse);
        }

        [Route("api/posts/likes"), HttpPost]
        public HttpResponseMessage CreatePostLike(PostLikesCreateRequest req)
        {
            req.UserId = User.Identity.GetId().Value;

            if (req == null)
            {
                ModelState.AddModelError("", "You did not send any body data");
            }

            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            int id = postsService.CreatePostLike(req);
            ItemResponse<int> itemResponse = new ItemResponse<int>();
            itemResponse.Item = id;

            return Request.CreateResponse(HttpStatusCode.Created, itemResponse);
        }

        [Route("api/posts/likes/{PostId:int}"), HttpDelete]
        public HttpResponseMessage DeletePostLike(int PostId)
        {
             int UserId = User.Identity.GetId().Value;

            postsService.DeletePostLike(UserId,PostId);

            return Request.CreateResponse(HttpStatusCode.OK, new SuccessResponse());
        }
    }
}
