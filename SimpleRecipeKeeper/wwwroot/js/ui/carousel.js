
$(document).ready(function () {
    $('#categoriesCarousel').carousel({
        interval: false
    });
});

function nextCategory() {
    $('#categoriesCarousel').carousel('next');
}

function prevCategory() {
    $('#categoriesCarousel').carousel('prev');
}
