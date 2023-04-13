let apikey = "AIzaSyDhGlTp2ttOxe5xJh1lyB3tq8umLy6IzKY";
let youTubeURL = "https://youtube.googleapis.com/youtube/v3/";
$(document).ready(function () {
  // select divs with id "details"
  var detailsDivs = $("div#details");

  // bind mouse events on div with id "details"
  detailsDivs.each(function (index) {
    $(this).on("mouseover", function (event) {
      var title = $(this)
        .find("a.yt-simple-endpoint.style-scope.yt-formatted-string")
        .text();
      var href = $(this).find("a#video-title-link").attr("href").toString();
      href = getVideoID(href);
      console.log("href is " + href);
      //disable original hover effect, but failed, need rewrite next patch
      $(this)
        .find(".style-scope ytd-rich-grid-media")
        .css("pointer-events", "none");
      // generate card
      var previewCard = $("<div class='preview-card'>Data</div>");
      $("body").append(previewCard);
      //rendering
      setPreviewCardStyle(previewCard, event.pageY, event.pageX, title, href);
    });
  });

  $(this).on("mouseout", function () {
    // destroy card
    $(".preview-card").html = "";
    $(".preview-card").remove();
  });
});

//render function
async function setPreviewCardStyle(previewCard, top, left, title, href) {
  var commentCount = 0;
  var likeCount = 0;

  var statistics = await getVideoData(href).then(function (data) {
    commentCount = data.items[0].statistics.commentCount;
    likeCount = data.items[0].statistics.likeCount;
    console.log(data.items[0].statistics);
  });
  //console.log(statistics.items[0].statistics);
  previewCard.css({
    position: "absolute",
    top: top + 20,
    left: left + 20,
    backgroundColor: "white",
    border: "1px solid #ccc",
    padding: "10px",
    fontSize: "auto",
    width: "200px",
    height: "150px",
    zIndex: "1",
    boxShadow: "0 2px 5px rgba(0,0,0,.3)",
    fontSize: "16px",
    lineHeight: "1.5",
    fontFamily: "Arial, sans-serif",
    borderRadius: "10px",
    transition: "transform 0.2s",
    transform: "scale(0.9)",
    opacity: "0",
  });

  previewCard.html(
    "<h5 style='margin: 0 0 10px;'>Publisher: " +
      title +
      "</h5>" +
      `<p style='margin: 0;'>Like Count: ${likeCount}</p>` +
      `<p style='margin: 0;'>Comment Count: ${commentCount}</p>`
  );

  //hover animation by changing size
  previewCard.animate(
    { top: top + 10, left: left + 10, opacity: "1", transform: "scale(1)" },
    200
  );
}

//regular expression to extract the video ID
function getVideoID(href) {
  let videoID = "";
  let temp = /v=([\w-]+)/.exec(href);

  if (temp) {
    videoID = temp[1];
  }
  return videoID;
}

//fetch data from youtube video list api
async function getVideoData(videoID) {
  const response = await $.ajax({
    url: youTubeURL + "videos?part=statistics&id=" + videoID + "&key=" + apikey,
    method: "GET",
    dataType: "json",
    success: function (data) {
      //console.log(data.items[0].statistics);
    },
    error: function (error) {
      //console.error(error);
    },
  });
  return response;
}
