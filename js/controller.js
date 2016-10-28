
    var pager = new Controller.Pager();
    $(document).ready(function() {
        pager.studentsPerPage = 10;
        pager.pageContainer = $('.student-list');
        pager.students = $('.student-item', pager.pageContainer);
        pager.showPage(1);
    });
