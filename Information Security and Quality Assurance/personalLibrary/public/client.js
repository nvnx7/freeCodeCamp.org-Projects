$( document ).ready(function() {
  var items = [];
  var itemsRaw = [];

  $.ajax({
    url: '/api/books',
    type: 'get',
    data: 'json',
    success: (data) => {
      data.forEach((book) => {
        $("#booksList")
          .append('<div class="book">' +
                    '<div class="bookName">' +
                      book.title +
                    '</div>' +
                    '<div class="author">- ' +
                      book.author +
                    '</div>' +
                    '<div class="actionButtons">' +
                    '<a class="seeBook" href="' + book._id + '">See More</a>' +
                    '<button class="deleteBook" id="' + book._id + '">Remove</button>' +
                    '</div>' +
                  '</div>');
      });
    }
  });

  $('#addBookForm').submit((e) => {
    $.ajax({
      type: 'POST',
      url: '/api/books',
      data: $('#addBookForm').serialize(),
      success: (data) => {
        alert("New Book Added!");
        window.location.reload(true);
      }
    });
    e.preventDefault();
  });

  $('#booksList').on('click', '.deleteBook', function(e) {
    var id = $(this).attr('id');
    var url = 'api/books/' + id;
    $.ajax({
      type: 'DELETE',
      url: url,
      success: (data) => {
        alert("Successfully Removed");
        window.location.reload(true);
      }
    });
  });

  $('#deleteAllButton').on('click', function(e) {
    $.ajax({
      type: 'DELETE',
      url: '/api/books',
      success: (data) => {
        alert("Successfully Removed All Books");
        window.location.reload(true);
      }
    });
  });
});
