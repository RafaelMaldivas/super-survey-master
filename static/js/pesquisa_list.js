$(document).ready(function(){
    var formSearch = $('#search-form');
    var btnSearch = $('#search-btn');

    $(btnSearch).on('click', function(){
        formSearch.submit();
    });

});