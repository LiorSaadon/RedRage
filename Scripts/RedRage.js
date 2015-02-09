$(document).ready(function (e) {
    var Game = new GameClass();
});

function GameClass() {
    var Board = $(".Board");
    var RedShip = new RedShipClass(Board);
    var Enemy = new EnemyClass(Board);

    Board.mousemove(function (e) {
        RedShip.MoveMouse(e.pageX, e.pageY);
    });

    Board.mousedown(function (e) {
        switch (e.which) {
            case 1: // left mouse button
                RedShip.Fire();
                break;
        }
    });

    var CollisionIntervalID = setInterval(CollisionDetection, 50);

    function CollisionDetection() {
        $("#MissileY").text(RedShip.MissileTopGet()); // log missile top position
        if (RedShip.MissileTopGet() <= Enemy.EnemyHitYGet()) {
            if (RedShip.MissileLeftGet() >= Enemy.EnemyLeftGet() && RedShip.MissileLeftGet() <= Enemy.EnemyHitXGet()) {
                $("#MissileY").text("Boom!"); // log Collision Detected                                                
                Enemy.StopEnemyMovement();
                clearInterval(CollisionIntervalID);
            }
        }
    }
}

function RedShipClass(Board) {
    var RedShip = $(".RedShip");
    var Missile = new MissileClass();
    var maxRight = Board.width() - RedShip.width();
    var maxDown = Board.height() - RedShip.height();
    var xPosition = $(window).width() - Board.offset().left - Board.width();
    var shootSide = true;

    var distance = 1;
    var curTop = RedShip.position().top;
    var curLeft = RedShip.position().left;

    this.MoveMouse = function (x, y) {
        curLeft = (-(xPosition - x));
        curTop = y;
        if (curLeft != 0 && curTop != 0 && curLeft < maxRight && curTop < maxDown) {
            RedShip.css({ "top": curTop, "left": curLeft });
        }

        //log mouse position
        $("#MouseXY").text("X: " + curLeft + ", " + "Y: " + y); // realative X real Y

        //log ship position
        $("#RedShipXY").text("X: " + $(".RedShip").position().left + ", " + "Y: " + $(".RedShip").position().top);
    }

    this.Fire = function () {
        if (!(Missile.IsAnimated())) {
            if (shootSide) {
                shootSide = false;
                Missile.PositionSet(curTop + 10, curLeft);
            }
            else {
                shootSide = true;
                Missile.PositionSet(curTop + 10, curLeft + RedShip.width() - Missile.Width() - 2);
            }
            Missile.Fly(curTop);
        }
    }

    this.MissileTopGet = function () {
        return Missile.TopGet();
    }

    this.MissileLeftGet = function () {
        return Missile.LeftGet();
    }
}

function MissileClass() {
    var Missile = $('.Missile');
    var step = 8; // missile size
    var current = 0;
    var imageWidth = 136; // sprite width           
    var scrollSpeed = 200;
    var MissileFlyId;

    function scrollBg() {
        current += step;
        if (current == imageWidth) {
            current = 0;
        }
        Missile.css("background-position", current + "px 0");
    }

    this.Fly = function (relativeTop) {
        MissileFlyId = setInterval(scrollBg, scrollSpeed);

        Missile.css("visibility", "visible");
        Missile.animate({
            top: "-=" + relativeTop
        }, 1500, function () {
            /*on animate complete*/
            Missile.css({ "visibility": "hidden", "top": "360px" });
            clearInterval(MissileFlyId);
        });
    }

    this.TopGet = function () {
        return Missile.position().top;
    }

    this.LeftGet = function () {
        return Missile.position().left;
    }

    this.Width = function () {
        return Missile.width();
    }

    this.IsAnimated = function () {
        return Missile.is(':animated');
    }

    this.PositionSet = function (top, left) {
        Missile.css({ "top": top, "left": left });
    }

}

function EnemyClass(Board) {
    var Enemy = $(".Enemy1");
    var Explotion = $(".Explode");
    var maxRight = Board.width() - Enemy.width();

    var ExplotionId;
    UpdateEnemyPosition();

    var EnemyMovementIntervalID = setInterval(UpdateEnemyPosition, 4050);

    function UpdateEnemyPosition() {
        Enemy.animate({ left: maxRight }, 2000)
                     .animate({ left: 0 }, 2000)
    }

    this.StopEnemyMovement = function () {
        clearInterval(EnemyMovementIntervalID);
        Explotion.show();
        Explotion.css({ "top": Enemy.position().top, "left": Enemy.position().left });
        ExplotionId = setInterval(scrollBg, scrollSpeed);
        Enemy.hide();
    }

    var step = 64; // missile size
    var current = 1024;
    var imageWidth = 1024; // sprite width           
    var scrollSpeed = 150;

    function scrollBg() {
        current -= step;
        if (current == 0) {
            clearInterval(ExplotionId);
        }
        Explotion.css("background-position", current + "px 0");
    }

    this.EnemyTopGet = function () {
        return Enemy.position().top;
    }

    this.EnemyLeftGet = function () {
        return Enemy.position().left;
    }

    this.EnemyHitYGet = function () {
        return Enemy.position().top + Enemy.height();
    }

    this.EnemyHitXGet = function () {
        return Enemy.position().left + Enemy.height();
    }
}