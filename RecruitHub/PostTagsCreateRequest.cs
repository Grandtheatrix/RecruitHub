using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain
{
    public class PostTagsCreateRequest
    {
        public int PostId { get; set; }
        public int TaggerId { get; set; }
        public int TaggedId { get; set; }
        public int PostItemId { get; set; }
    }
}
