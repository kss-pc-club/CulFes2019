
window.addEventListener("load",() => {

    const leftHamMenuButton = document.getElementById("left-hamMenu-button"),
          leftHamMenuBack = document.getElementById("left-hamMenu-back"),
          rightHamMenuButton = document.getElementById("right-hamMenu-button"),
          rightHamMenuBack = document.getElementById("right-hamMenu-back"),
          HamMenu = document.getElementById("hamMenu");

    function menuClick(){
        this.classList.toggle("active");
        ((this === leftHamMenuButton) ? leftHamMenuBack : rightHamMenuBack).classList.toggle("active");
        HamMenu.classList.toggle("showing");
    }

    leftHamMenuButton.addEventListener("click", menuClick);

    rightHamMenuButton.addEventListener("click", menuClick);

    ( function() {
        const height     = 56;
        let offset       = 0,
            lastPosition = 0,
            ticking      = false;

        function onScroll() {
            if( lastPosition > height ) {
                if( lastPosition > offset ) {
                    leftHamMenuButton.classList.add( "left-disappear-animation" );
                    rightHamMenuButton.classList.add( "right-disappear-animation" );
                    leftHamMenuBack.classList.add( "left-disappear-animation" );
                    rightHamMenuBack.classList.add( "right-disappear-animation" );
                    console.log("disappear!");
                } else {
                    leftHamMenuButton.classList.remove( "left-disappear-animation" );
                    rightHamMenuButton.classList.remove( "right-disappear-animation" );
                    leftHamMenuBack.classList.remove( "left-disappear-animation" );
                    rightHamMenuBack.classList.remove( "right-disappear-animation" );
                    console.log("appear!");
                }
                offset = lastPosition;
            }
        }

        window.addEventListener('scroll', function() {
            lastPosition = window.scrollY;

            if( !ticking ) {
                window.requestAnimationFrame( function() {
                    onScroll( lastPosition );
                    ticking = false;
                });
                ticking = true;
            }
        });
    })();



});