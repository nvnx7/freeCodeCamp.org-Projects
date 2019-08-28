$(function() {
  var url = window.location.href.replace(/\/$/, '');
  var lastSeg = url.substr(url.lastIndexOf('/') + 1);

  $.ajax({
    type: 'GET',
    url: '/api/boards',
    success: (data) => {
      if (data.hasOwnProperty('boards')) {
        data.boards.forEach((board) => {
          $('#boardsList')
          .append(
            '<div class="board">' +
              '<div class="boardTitle">' +
              board.title +
              '</div>' +
              '<div class="boardThreads">' +
                '<span class="boardThreadsCount">' + board.threads.length + '</span> Thread(s)' +
              '</div>' +
              '<a class="enterBoardLink" href="/b/' + board._id.toString() + '/">Enter</a>' +
              '<button class="boardDeleteButton" id='+ board._id.toString() +'>Delete</button>' +
            '</div>'
          );
        });
      } else {
        alert("failed loading boards");
      }

       $('form').attr('autocomplete','off');
    }
  });

  $("#boardsList").on("click", ".boardDeleteButton", (e) => {
    var boardId = $(e.target).attr("id");
    $("#deleteBoardForm").children("[name='board_id']").attr("value", boardId);

    $("#closeFormButton").on('click', (e) => {
      $("#deleteBoardModal").css({display: 'none'});
    });

    $("#deleteBoardModal").css({display: 'flex'});
  });

  $("#deleteBoardForm").submit((e) => {
    $.ajax({
      type: 'DELETE',
      url: '/api/boards',
      data: $("#deleteBoardForm").serialize(),
      success: (data) => {
        if (data.hasOwnProperty('success')) {
          alert("Board deleted!");
          window.location.reload(true);
        } else if (data.hasOwnProperty('incorrectPassword')) {
          alert("Incorrect password!");
        } else {
          alert("Error deleting board!");
        }
      },
      error: (err) => {alert("request failed!")}
    });
    e.preventDefault();
  });

  $('#addBoardForm').submit(function(e) {
    $.ajax({
      type: 'POST',
      url: '/api/boards',
      data: $('#addBoardForm').serialize(),
      success: (data) => {
        if (data.hasOwnProperty('board')) {
          window.location.reload(true);
        } else {
          alert("Error adding board");
        }
      }
    });
    e.preventDefault();
  });
});
