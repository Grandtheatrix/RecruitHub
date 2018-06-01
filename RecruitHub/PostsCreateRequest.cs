using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain
{
    public class PostsCreateRequest
    {
        public int UserId { get; set; }
        public string Location { get; set; }
        public float Lat { get; set; }
        public float Long { get; set; }
        public string EventDate { get; set; }
        public string PostText { get; set; }
        public string PostItemsJSON { get; set; }

    }
}
