var Controller = {};

Controller.Pager = function() {
    this.currentPage = 1;
    this.pagingControlsContainer = '.pagination';
    this.searchContainer = $('.student-search');
    this.pagingContainerPath = '.student-list';
    this.activeSearch = false;

    //-------------------------------------------------------------------------------------------------
    // FUNCTION calculatesPages()
    //
    // Calculates the number of pages needed to the list of students.
    // This function takes two aruments: 
    //     list -- a list of students. Either the full list of a subset of the list from a search
    //     itemsPerPage -- the number of items desired on each page
    //------------------------------------------------------------------------------------------------
    var calculatePages = function(list, itemsPerPage) {
        var pagesNeeded = 0;
        if (list !== null && itemsPerPage !== null) {
            pagesNeeded = Math.ceil(list.length / itemsPerPage);
        }
        return pagesNeeded;
    };

    //-------------------------------------------------------------------------------------------------
    // FUNCTION this.showPage()
    //
    // Displays a page of list items. If this.activeSearch is set to true, 
    // it will display a subset of the list, starting with the first page, 
    // as a result of a search function; otherwise,
    // the full list is displayed, starting with the first page.
    //
    // showPage() is invoked when a paging control is clicked, displaying
    // the number of items desired for the selected page.
    //
    // Arguments:
    //      page -- the active page to display
    //------------------------------------------------------------------------------------------------
    this.showPage = function(page) {
        this.currentPage = page;
        var numPages = 0;  
        var list;
        var html = '';

        if (this.activeSearch) {
            // Need to parse out the list items for the desired page
            // and then set up the proper html
            this.searchList.slice((page-1) * this.studentsPerPage, 
            ((page-1)*this.studentsPerPage) + this.studentsPerPage).forEach(function(item) {
                html +=' <li class="student-item cf">' + $(item).html() + '</li>';
            });
            numPages = calculatePages(this.searchList, this.studentsPerPage);
        } else {
            // Need to parse out the list items for the desired page
            // and then set up the proper html
            this.students.slice((page-1) * this.studentsPerPage, 
            ((page-1)*this.studentsPerPage) + this.studentsPerPage).each(function() {

                html +=' <li class="student-item cf">' + $(this).html() + '</li>';

            });
            numPages = calculatePages(this.students, this.studentsPerPage);
        }

        // Place the html in the proper container 
        $(this.pagingContainerPath).html(html);

        // Set up the search box, search button and paging controls
        this.renderControls(numPages);
    };

    //-------------------------------------------------------------------------------------------------
    // FUNCTION this.renderControls()
    //
    // Sets up the html and displays the controls on a page.
    // Controls include the paging at the bottom of a page and 
    // the search input box and search button.
    //
    // Arguments:
    //      numPages -- the number of pages the list requires (could be 
    //                  the full list of a searched subset of the list)
    //------------------------------------------------------------------------------------------------
    this.renderControls = function(numPages) {

        //*** FIRST, the paging controls
        var pagingHTML = '<ul>';

        // If 10 or less students, no need for pagination
        if (numPages > 1) {
            for (var i =1; i <= numPages; i++) {
                if (i != this.currentPage) {
                    pagingHTML += '<li><a href="#" onclick="pager.showPage(' + i + '); return false;">' + i + '</a></li>';
                } else {
                    pagingHTML += '<li>' + i + '</li>';
                }
            }
        }

        pagingHTML += '</ul>';

        // Place html in proper container
        $(this.pagingControlsContainer).html(pagingHTML);

        //*** SECOND, the search controls
        var searchHTML = '<div class="tooltip">';
        searchHTML += '<input placeholder="Search for students..."><button onclick="pager.searchStudents()">Search</button>';
        searchHTML += '<span class="tooltiptext">Enter a name or a single letter to find names beginning with that letter</span>';
        searchHTML += '</div>';
 
        // Display a reset button if a search list is currently active
        if (this.activeSearch) {
            searchHTML += '<button style="background-color: tomato;" onclick="pager.resetPage()">Reset</button>';
        }
        $(this.searchContainer).html(searchHTML);

    };

    //-------------------------------------------------------------------------------------------------
    // FUNCTION this.searchStudents()
    //
    // Searches the full list based on a name given by the user.
    // Creates a subset of the list and stores it in this.searchList
    //------------------------------------------------------------------------------------------------
    this.searchStudents = function() {
        // Get the search string from the input box
        var target = document.getElementsByTagName('input')[0].value;
        var html = '';
        var numPages = 0;

        // If the user didn't just click the button by mistake,
        // search the list
        if (target !== '') {

            this.searchList = $.grep(this.students, function( item, i ) {

                // parse out the student name from the html
                var name = $(item).html();
                var i = name.indexOf('<h3>') + 4;
                var j = name.indexOf('</h3>');
                name = name.slice(i, j).trim();

                // parse out first and last names
                i = name.indexOf(' ');
                var fname = name.slice(0, i).trim();
                var lname = name.slice(i+1).trim();

                if (target.length === 1) {
                    // Compare user input to parsed fname and lname
                    // append item to searchList if a match
                    if(fname.startsWith(target) || lname.startsWith(target)) {
                        return item;
                    }
                } else {
                    // Compare user input to parsed string of full name
                    // append item to searchList if it contains the target
                    if (name.search(target) !== -1) {
                        return item;
                    }
                }
            });
        } else {
            return; // return if target is empty
        }

        // if no matches were found, notify user
        if (this.searchList.length === 0) {
            alert('There is no student with the name of "' + name + '"');
            return;
        }

        // showPage() needs to know if the list of items is
        // from a search or not    
        this.activeSearch = true;
        this.showPage(1);
    };

    //-------------------------------------------------------------------------------------------------
    // FUNCTION this.resetPage()
    //
    // Displays the full list and discontinues showing a search list
    //------------------------------------------------------------------------------------------------
    this.resetPage = function() {
        this.activeSearch = false;
        this.showPage(1);
    };

};

