using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain
{
    public class PostsGetByUserRequest
    {
        public int UserId { get; set; }
        public int PageNum { get; set; }
        public int RowCount { get; set; }
    }
}