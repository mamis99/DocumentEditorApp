using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Models;
using Syncfusion.EJ2.DocumentEditor;
using static System.Net.Mime.MediaTypeNames;


namespace server.Controllers
{
    [Route("api")]
    [ApiController]
    public class TodoItemsController : ControllerBase
    {
        private readonly TodoContext _context;

        /*private readonly AlmacenadorArchivosLocal almacenadorArchivosLocal;


        public ArchivosController(AlmacenadorArchivosLocal almacenadorArchivosLocal)
        {
            this.almacenadorArchivosLocal = almacenadorArchivosLocal;
        }*/

        public TodoItemsController(TodoContext context)
        {
            _context = context;
        }

        // GET: api/TodoItems
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TodoItem>>> GetTodoItems()
        {
            return await _context.TodoItems.ToListAsync();
        }

        // GET: api/TodoItems/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TodoItem>> GetTodoItem(long id)
        {
            var todoItem = await _context.TodoItems.FindAsync(id);

            if (todoItem == null)
            {
                return NotFound();
            }

            return todoItem;
        }

        // PUT: api/TodoItems/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTodoItem(long id, TodoItem todoItem)
        {
            if (id != todoItem.Id)
            {
                return BadRequest();
            }

            _context.Entry(todoItem).State = EntityState.Modified;

            try
            {
                var elements = await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TodoItemExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/TodoItems
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Route("import")]
        public async Task<ActionResult<string>> PostTodoItem([FromForm] IFormCollection files)
        {
            return Import(files);
        }

        [HttpPost]
        [Route("public")]
        public async Task<ActionResult<TodoItem>> PostTodoItem(TodoItem todoItem)
        {
            _context.TodoItems.Add(todoItem);
            await _context.SaveChangesAsync();

            //return CreatedAtAction("GetTodoItem", new { id = todoItem.Id }, todoItem);
            return CreatedAtAction(nameof(GetTodoItem), new { id = todoItem.Id }, todoItem);
        }

        // DELETE: api/TodoItems/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTodoItem(long id)
        {
            var todoItem = await _context.TodoItems.FindAsync(id);
            if (todoItem == null)
            {
                return NotFound();
            }

            _context.TodoItems.Remove(todoItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TodoItemExists(long id)
        {
            return _context.TodoItems.Any(e => e.Id == id);
        }

        public string ConvertDocument(Stream inputStream, FormatType formatType)
        {
            string sfdtText = "";
            WordDocument document = WordDocument.Load(inputStream, formatType);
            sfdtText = Newtonsoft.Json.JsonConvert.SerializeObject(document);
            document.Dispose();
            return sfdtText;
        }

        [AcceptVerbs("Post")]
        public string Import(IFormCollection data)
        {
            if (data.Files.Count == 0)
                return null;
            Stream stream = new MemoryStream();
            IFormFile file = data.Files[0];
            int index = file.FileName.LastIndexOf('.');
            string type = index > -1 && index < file.FileName.Length - 1 ?
                file.FileName.Substring(index) : ".docx";
            file.CopyTo(stream);
            stream.Position = 0;

            WordDocument document = WordDocument.Load(stream, GetFormatType(type.ToLower()));
            string sfdt = Newtonsoft.Json.JsonConvert.SerializeObject(document);
            document.Dispose();
            return sfdt;
        }

        internal static FormatType GetFormatType(string format)
        {
            if (string.IsNullOrEmpty(format))
                throw new NotSupportedException("EJ2 DocumentEditor does not support this file format.");
            switch (format.ToLower())
            {
                case ".dotx":
                case ".docx":
                case ".docm":
                case ".dotm":
                    return FormatType.Docx;
                case ".dot":
                case ".doc":
                    return FormatType.Doc;
                case ".rtf":
                    return FormatType.Rtf;
                case ".txt":
                    return FormatType.Txt;
                case ".xml":
                    return FormatType.WordML;
                default:
                    throw new NotSupportedException("EJ2 DocumentEditor does not support this file format.");
            }
        }

        public class CustomRestrictParameter
        {
            public string passwordBase64 { get; set; }
            public string saltBase64 { get; set; }
            public int spinCount { get; set; }
        }

        [AcceptVerbs("Post")]
        [HttpPost]
        [EnableCors("AllowAllOrigins")]
        [Route("RestrictEditing")]
        public string[] RestrictEditing([FromBody] CustomRestrictParameter param)
        {
            if (param.passwordBase64 == "" && param.passwordBase64 == null)
                return null;
            return WordDocument.ComputeHash(param.passwordBase64, param.saltBase64, param.spinCount);
        }


        [AcceptVerbs("Post")]
        [HttpPost]
        [EnableCors("AllowAllOrigins")]
        [Route("LoadDefault")]
        public string LoadDefault()
        {
            Stream stream = System.IO.File.OpenRead("App_Data/GettingStarted.docx");
            stream.Position = 0;

            WordDocument document = WordDocument.Load(stream, FormatType.Docx);
            string json = Newtonsoft.Json.JsonConvert.SerializeObject(document);
            document.Dispose();
            return json;
        }

    }
}
