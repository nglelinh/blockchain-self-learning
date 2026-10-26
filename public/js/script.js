(function(document) {
  var toggle = document.querySelector('.sidebar-toggle');
  var sidebar = document.querySelector('#sidebar');
  var checkbox = document.querySelector('#sidebar-checkbox');

  if (window.innerWidth > 1480)
    checkbox.checked = true;

  var chapterLinks = document.querySelectorAll('.sidebar-chapter-link');
  chapterLinks.forEach(function(link) {
    link.addEventListener('click', function(event) {
      event.stopPropagation();
    });
  });

  document.addEventListener('click', function(e) {
    var target = e.target;

    if(!checkbox.checked ||
       sidebar.contains(target) ||
       (target === checkbox || target === toggle)) return;

    checkbox.checked = false;
  }, false);
})(document);
