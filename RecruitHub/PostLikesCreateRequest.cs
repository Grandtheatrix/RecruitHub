using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain
{
    public class PostLikesCreateRequest
    {
        public int PostId { get; set; }
        public int UserId { get; set; }
    }
}
