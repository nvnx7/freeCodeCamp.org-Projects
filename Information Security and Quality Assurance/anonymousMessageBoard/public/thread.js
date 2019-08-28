$(function(){
  var url = window.location.href.replace(/\/$/, '');
  var ids = url.split('/').slice(-2);
  var boardId = ids[0];
  var threadId = ids[1];

  $.ajax({
    type: 'GET',
    url: `/api/threads/${boardId}/${threadId}`,
    data: 'json',
    success: (data) => {
      if (data.hasOwnProperty('thread')) {
        $('#threadBumpedOnDate').text(data.thread.bumped_on);
        $('#threadCreatedOnDate').text(data.thread.created_on);
        $('#repliesCount').text(data.thread.replies.length);
        $('#threadText').text(data.thread.text);
        $('#inputThreadId').attr('value', threadId);
        $("#deleteReplyForm").children("[name='thread_id']").attr("value", threadId);

        data.thread.replies.reverse();
        data.thread.replies.forEach((reply) => {
          $('#repliesList')
          .append(
            '<div class="reply" id='+ reply._id +'>' +
              '<div class="replyCreatedOn">' +
                '<span class="replyCreatedOnDate">' + reply.created_on + '</span>' +
              '</div>' +
              '<div class="replyText">' +
                reply.text +
              '</div>' +
              '<div class="replyActionButtons">' +
                '<button class="replyDeleteButton">Delete</button>' +
                '<button class="replyReportButton">Report</button>' +
              '</div>' +
            '</div>'
          );
        });
      } else {
        alert('Error fetching thread');
      }
      $('form').attr('autocomplete','off');
    }
  });

  $("#repliesList").on("click", ".replyDeleteButton", (e) => {
    var replyId = $(e.target).closest(".reply").attr('id');
    $("#deleteReplyForm").children("[name='reply_id']").attr("value", replyId);

    $("#closeFormButton").on('click', (e) => {
      $("#deleteReplyModal").css({display: 'none'});
    });

    $("#deleteReplyModal").css({display: 'flex'});
  });

  $("#deleteReplyForm").submit((e) => {
    $.ajax({
      type: 'DELETE',
      url: `/api/replies/${boardId}`,
      data: $("#deleteReplyForm").serialize(),
      success: (data) => {
        if (data.hasOwnProperty('success')) {
          alert("Thread deleted!");
          window.location.reload(true);
        } else if (data.hasOwnProperty('incorrectPassword')) {
          alert("Incorrect password!");
        } else {
          alert("Error deleting reply!");
        }
      },
      error: (err) => {alert("request failed!")}
    });
    e.preventDefault();
  });

  $("#repliesList").on("click", ".replyReportButton", (e) => {
    var replyId = $(e.target).closest(".reply").attr('id');
    $.ajax({
      type: 'PUT',
      url: `/api/replies/${boardId}`,
      data: {thread_id: threadId, reply_id: replyId},
      success: (data) => {
        if (data.hasOwnProperty('reply')) {
          alert("Reply Reported!");
          window.location.reload(true);
        } else {
          alert("Error reporting reply!");
        }
      }
    });
  });

  $("#newReplyForm").submit((e) => {
    $.ajax({
      type: 'POST',
      url: `/api/replies/${boardId}`,
      data: $("#newReplyForm").serialize(),
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
  })

});
