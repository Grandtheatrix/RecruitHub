using Newtonsoft.Json;
using Sabio.Data.Providers;
using Sabio.Models.Domain;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class PostsService : IPostsService
    {
        readonly IDataProvider dataProvider;

        public PostsService(IDataProvider dataProvider)
        {
            this.dataProvider = dataProvider;
        }

        public string GetByPost(int id)
        {
            var json = new StringBuilder();

            dataProvider.ExecuteCmd(
                "Posts_GetById",
                inputParamMapper: (parameters) =>
                {
                    parameters.AddWithValue("@Id", id);
                },
                singleRecordMapper: (reader, resultSetNumber) =>
                {
                    json.Append(reader.GetString(0));
                }
                );
            return json.ToString();
        }
        public string GetByUser(int userId, int page, int pageSize)
        {
            var json = new StringBuilder();

            dataProvider.ExecuteCmd(
                "Posts_GetByUserPaged",
                inputParamMapper: (parameters) =>
                {
                    parameters.AddWithValue("@UserId", userId);
                    parameters.AddWithValue("@PageNum", page);
                    parameters.AddWithValue("@RowCount", pageSize);
                },
                singleRecordMapper: (reader, resultSetNumber) =>
                {
                    json.Append(reader.GetString(0));
                }
                );

            return json.ToString();
        }

        public int CreatePost(PostsCreateRequest req)
        {
            int newId = 0;

            dataProvider.ExecuteNonQuery(
                "Posts_Create",
                inputParamMapper: (parameters) =>
                {
                    parameters.AddWithValue("@UserId", req.UserId);
                    parameters.AddWithValue("@Location", req.Location);
                    parameters.AddWithValue("@Lat", req.Lat);
                    parameters.AddWithValue("@Long", req.Long);
                    parameters.AddWithValue("@EventDate", req.EventDate);
                    parameters.AddWithValue("@PostText", req.PostText);
                    parameters.AddWithValue("@PostItemsJSON", req.PostItemsJSON);

                    parameters.Add("@Id", SqlDbType.Int).Direction = ParameterDirection.Output;
                },
                returnParameters: (parameters) =>
                {
                    newId = (int)parameters["@Id"].Value;
                });

            return newId;

        }

        public void UpdatePost(PostsUpdateRequest req)
        {
            dataProvider.ExecuteNonQuery(
                "Posts_Update",
                inputParamMapper: (parameters) =>
                {
                    parameters.AddWithValue("@Id", req.Id);
                    parameters.AddWithValue("@Location", req.Location);
                    parameters.AddWithValue("@Lat", req.Lat);
                    parameters.AddWithValue("@Long", req.Long);
                    parameters.AddWithValue("@EventDate", req.EventDate);
                    parameters.AddWithValue("@PostText", req.PostText);
                    parameters.AddWithValue("@PostItemsJSON", req.PostItemsJSON);
                });    
        }

        public void DeletePost(int id)
        {
            dataProvider.ExecuteNonQuery(
               "Posts_Delete",
               inputParamMapper: parameters =>
               {
                   parameters.AddWithValue("@Id", id);
               });
        }

        public Dictionary<int, List<PostTags>> GetPostTagsByIds(int[] ids)
        {
            List<PostTags> tags = new List<PostTags>();

            dataProvider.ExecuteCmd(
                "PostTags_GetByPostIds",
                inputParamMapper: parameters =>
                {
                    parameters.AddWithValue("@IdsJSON", JsonConvert.SerializeObject(ids));
                },
                singleRecordMapper: (reader, resultSetNumber) =>
                {
                    PostTags tag = new PostTags();

                    tag.Id = (int)reader["Id"];
                    tag.PostId = (int)reader["PostId"];
                    tag.TaggerId = (int)reader["TaggerId"];
                    tag.TaggedId = (int)reader["TaggedId"];
                    tag.PostItemId = (int)reader["PostItemId"];

                    tags.Add(tag);
                });

            var tagsDict = tags
               .ToLookup(postTag => postTag.PostId)
               .ToDictionary(
                   o => o.Key,
                   o => o.ToList()
               );

            return tagsDict;

        }

       

        public int CreatePostTag(PostTagsCreateRequest tag)
        {
            int tagId = 0;

            dataProvider.ExecuteNonQuery(
                "PostTags_Create",
                inputParamMapper: parameters =>
                {
                    parameters.AddWithValue("@PostId", tag.PostId);
                    parameters.AddWithValue("@TaggerId", tag.TaggerId);
                    parameters.AddWithValue("@TaggedId", tag.TaggedId);
                    parameters.AddWithValue("@PostItemId", tag.PostItemId);

                    parameters.Add("@Id", SqlDbType.Int).Direction = ParameterDirection.Output;
                },
                returnParameters: (parameters) =>
                {
                    tagId = (int)parameters["@Id"].Value;
                });

            return tagId;

        }

        public void DeletePostTag(int id)
        {
            dataProvider.ExecuteNonQuery(
                "PostTags_Delete",
                inputParamMapper: parameters =>
                {
                    parameters.AddWithValue("@Id", id);
                });
        }

        public Dictionary<int, List<PostLikes>> GetPostLikesByPostIds(int[] ids)
        {
            List<PostLikes> likes = new List<PostLikes>();

            dataProvider.ExecuteCmd(
                "PostLikes_GetByPostIds",
                inputParamMapper: parameters =>
                {
                    parameters.AddWithValue("@IdsJSON", JsonConvert.SerializeObject(ids));
                },
                singleRecordMapper: (reader, resultSetMapper) =>
                {
                    PostLikes like = new PostLikes();

                    like.Id = (int)reader["Id"];
                    like.PostId = (int)reader["PostId"];
                    like.UserId = (int)reader["UserId"];

                    likes.Add(like);
                });

            var likesDict = likes
               .ToLookup(postLike => postLike.PostId)
               .ToDictionary(
                   o => o.Key,
                   o => o.ToList()
               );

            return likesDict;
        }

        public int CreatePostLike(PostLikesCreateRequest like)
        {
            int likeId = 0;

            dataProvider.ExecuteNonQuery(
                "PostLikes_Create",
                inputParamMapper: parameters =>
                {
                    parameters.AddWithValue("@PostId", like.PostId);
                    parameters.AddWithValue("@UserId", like.UserId);

                    parameters.Add("@Id", SqlDbType.Int).Direction = ParameterDirection.Output;
                },
                returnParameters: (parameters) =>
                {
                    likeId = (int)parameters["@Id"].Value;
                });

            return likeId;

        }

        public void DeletePostLike(int UserId, int PostId)
        {
            dataProvider.ExecuteNonQuery(
                "PostLikes_Delete",
                inputParamMapper: parameters =>
                {
                    parameters.AddWithValue("@UserId", UserId);
                    parameters.AddWithValue("@PostId", PostId);
                });
        }
    }
}
