$(function() {
  // alert("Go");
  $('#twoStockForm').submit(function(e) {
    $.ajax({
      url: '/api/stock-prices',
      type: 'get',
      data: $('#twoStockForm').serialize(),
      success: function(data) {
        $('#resultContainer').empty();

        if (data.hasOwnProperty('error')) {
          $('#resultContainer')
          .text(data.error);
          return;
        }
        data.stockData.forEach((stockData) => {
          $('#resultContainer')
          .append(
            '<div class="stockData">' +
              '<div class="ticker">' + stockData.stock + '</div>' +
              '<div class="price">Current Price: $' + stockData.price + '</div>' +
              '<div class="likes">Relative Likes: ' + stockData.rel_likes + '</div>' +
            '</div>'
          );
        });
      }
    });
    e.preventDefault();
  });

  $('#singleStockForm').submit(function(e) {
    $.ajax({
      url: '/api/stock-prices',
      type: 'get',
      data: $('#singleStockForm').serialize(),
      success: function(data) {
        $('#resultContainer').empty();

        if (data.hasOwnProperty('error')) {
          $('#resultContainer')
          .text(data.error);
          return;
        }
        var stockData = data.stockData;
        $('#resultContainer')
        .append(
          '<div class="stockData">' +
            '<div class="ticker">' + stockData.stock + '</div>' +
            '<div class="price">Current Price: $' + stockData.price + '</div>' +
            '<div class="likes">Likes:' + stockData.likes + '</div>' +
          '</div>'
        );
      }
    });
    e.preventDefault();
  });

});
