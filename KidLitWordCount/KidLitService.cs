using AngleSharp.Parser.Html;
using KidLitWordCount.Models;
using KidLitWordCount.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;

namespace KidLitWordCount.Services
{
    public class KidLitService : IKidLitService
    {
        static string connectionString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;

        public async Task<List<Entry>> Get(Query query)
        {

            using (SqlConnection con = new SqlConnection(connectionString))
            {
                con.Open();

                SqlCommand cmd = con.CreateCommand();
                cmd.CommandText = "Find";
                cmd.CommandType = System.Data.CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@Query", query.Text );

                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    List<Entry> books = new List<Entry>();

                    
                    while (reader.Read())
                    {
                        
                        Entry book = new Entry();
                  
                        book.Title = (string)reader["Title"];
                        book.Count = (string)reader["Count"];

                        books.Add(book);
                    }
                    
                    if (books.Count != 0 )
                    {
                        return books;
                    }
                    else
                    {
                        Uri uri = new Uri("http://www.arbookfind.com/");
                        var handler = new HttpClientHandler();
                        handler.CookieContainer = new CookieContainer();

                        handler.CookieContainer.Add(uri, new Cookie("BFUserType", "Librarian"));
                        var client = new HttpClient(handler);
                        var html = client.GetStringAsync(uri).Result;

                        var parser = new HtmlParser();

                        var document = parser.Parse(html);

                        var inputs = document.QuerySelectorAll("input[name]");

                        var pairs = new List<KeyValuePair<string,string>>();

                        foreach (var i in inputs)
                        {
                            var key = i.GetAttribute("name");
                            var value = i.GetAttribute("value");
                            if (key == "ctl00$ContentPlaceHolder1$txtKeyWords")
                                value = query.Text;

                            var pair = new KeyValuePair<string, string>(key, value);
                            pairs.Add(pair);

                        };

                        var formContent = new FormUrlEncodedContent(pairs);
                        var response = await client.PostAsync(uri, formContent);
                        var stringContent = await response.Content.ReadAsStringAsync();

                        var resultsPage = parser.Parse(stringContent);

                        var aTags = resultsPage.QuerySelectorAll("td.book-detail > a");

                        var responses = new List<Entry>();
                        foreach (var i in aTags)
                        {
                            var link = new Uri("http://www.arbookfind.com/" + i.GetAttribute("href"));
                            var result = client.GetStringAsync(link).Result;
                            var resp = parser.Parse(result);
                            var count = resp.QuerySelector("#ctl00_ContentPlaceHolder1_ucBookDetail_lblWordCount");
                            var title = resp.QuerySelector("#ctl00_ContentPlaceHolder1_ucBookDetail_lblBookTitle");
                            var resultPair = new Entry();
                            resultPair.Title = title.TextContent;
                            resultPair.Count = count.TextContent;
                            Post(resultPair);
                            responses.Add(resultPair);
                        }

                        return responses;
                    }
                }
            }
        }
      public void Post(Entry book)
        {
            
            using (SqlConnection con  = new SqlConnection(connectionString))
            {
                con.Open();

                SqlCommand cmd = con.CreateCommand();
                cmd.CommandText = "Post";
                cmd.CommandType = System.Data.CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("Title", book.Title);
                cmd.Parameters.AddWithValue("Count", book.Count);
                cmd.ExecuteNonQuery();
            }
        }
    }
}
