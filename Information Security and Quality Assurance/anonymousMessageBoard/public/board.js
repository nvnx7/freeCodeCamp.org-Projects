$(document).ready(function() {
  var url = window.location.href.replace(/\/$/, '');
  var boardId = url.substr(url.lastIndexOf('/') + 1);

  $.ajax({
    type: 'GET',
    url: '/api/boards/' + boardId,
    success: (data) => {
      if (data.hasOwnProperty('board')) {
        $("#boardTitle").text(data.board.title);
        $("#threadsCount").text(data.board.threads.length);
        data.board.threads.forEach((thread) => {
          var replyHtml = '';

          thread.replies.slice(-3).forEach((reply) => {
            replyHtml +=
            '<div class="reply">' +
              '<div class="replyCreatedOnDate">' +
                reply.created_on +
              '</div>' +
              '<div class="replyText">' + reply.text + '</div>' +
            '</div>';
          });

          var newReplyForm =
              '<form method="POST" class="newReplyForm">' +
                '<input class="newReplyText" type="text" name="text" placeholder="quick reply..." required>' +
                '<input class="newReplyDeletePassword" type="text" name="delete_password" placeholder="delete password" required>' +
                '<input type="hidden" name="thread_id" value=' + thread._id.toString() + '>' +
                '<input class="newReplySubmitBtn" type="submit" value="Post" />' +
              '</form>';

          $("#threadsList")
          .append(
            '<div class="thread">' +
              '<div class="threadDates">' +
                '<div class="threadBumpedOn">Last Activity ' +
                  '<span class="threadBumpedOnDate">' + thread.bumped_on + '</span>' +
                '</div>' +
                '<div class="threadCreatedOn">Created ' +
                  '<span class="threadCreatedOnDate">' + thread.created_on + '</span>' +
                '</div>' +
              '</div>' +
              '<div class="threadText">' +
              thread.text +
              '</div>' +
              '<div class="replies">' +
                '<span class="repliesCount">' + thread.replies.length + '</span> Reply(s)' +
                '<a class="fullThreadLink" href="/b/' + boardId + '/' + thread._id.toString() + '">See full thread</a>' +
              '</div>' +
              '<div class="repliesList">' +
                replyHtml +
              '</div>' +
              newReplyForm +
              '<div class="threadActionButtons">' +
                '<button class="threadDeleteButton">Delete</button>' +
                '<button class="threadReportButton">Report</button>' +
              '</div>' +
            '</div>'
          );
        });
      }
      $('form').attr('autocomplete','off');
    }
  });

  $("#threadsList").on("submit", ".newReplyForm", function(e) {
    $.ajax({
      type: 'POST',
      url: `/api/replies/${boardId}`,
      data: $(this).serialize(),
      success: (replyData) => {
        if (replyData.hasOwnProperty('reply')) {
          alert("Reply added!");
          window.location.reload(true);
        } else {
          alert("Failed posting reply");
        }
      }
    });
    e.preventDefault();
  });

  $("#threadsList").on("click", ".threadDeleteButton", (e) => {
    var threadId = $(e.target).closest(".thread").find("[name='thread_id']").attr('value');
    $("#deleteThreadForm").children("[name='thread_id']").attr("value", threadId);

    $("#closeFormButton").on('click', (e) => {
      $("#deleteThreadModal").css({display: 'none'});
    });

    $("#deleteThreadModal").css({display: 'flex'});
  });

  $("#deleteThreadForm").submit((e) => {
    $.ajax({
      type: 'DELETE',
      url: `/api/threads/${boardId}`,
      data: $("#deleteThreadForm").serialize(),
      success: (data) => {
        if (data.hasOwnProperty('success')) {
          alert("Thread deleted!");
          window.location.reload(true);
        } else if (data.hasOwnProperty('incorrectPassword')) {
          alert("Incorrect password!");
        } else {
          alert("Error deleting thread!");
        }
      },
      error: (err) => {alert("request failed!")}
    });
    e.preventDefault();
  });

  $("#threadsList").on("click", ".threadReportButton", (e) => {
    var threadId = $(e.target).closest(".thread").find("[name='thread_id']").attr('value');
    $.ajax({
      type: 'PUT',
      url: `/api/threads/${boardId}`,
      data: {thread_id: threadId},
      success: (data) => {
        if (data.hasOwnProperty('thread')) {
          alert("Thread Reported!");
          window.location.reload(true);
        } else {
          alert("Error reporting thread!");
        }
      }
    });
  });

  $("#newThreadForm").submit((e) => {
    $.ajax({
      type: 'POST',
      url: `/api/threads/${boardId}`,
      data: $('#newThreadForm').serialize(),
      success: (data) => {
        if (data.hasOwnProperty('thread')) {
          alert("Thread added!");
          window.location.reload(true);
        } else {
          alert("Error adding thread!");
        }
      }
    });
    e.preventDefault();
  });
});
