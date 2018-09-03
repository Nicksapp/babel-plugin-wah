var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Student = /** @class */ (function () {
    function Student(firstname, lastname) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.fullName = firstname + lastname;
    }
    Student.prototype.jump = function () {
        console.log("jump once");
    };
    return Student;
}());
var Puple = /** @class */ (function (_super) {
    __extends(Puple, _super);
    function Puple(firstname, lastname, height) {
        var _this = _super.call(this, firstname, lastname) || this;
        _this.height = height;
        return _this;
    }
    Puple.prototype.talk = function () {
        _super.prototype.jump.call(this);
        this.jumpAndTalk();
    };
    Puple.prototype.jumpAndTalk = function () {
        console.log("talk while jumpping.");
    };
    return Puple;
}(Student));
var p = new Puple("Pater", "Liu", 140);
p.talk();
function greeter(person) {
    return "Hello" + person.firstname + " " + person.lastname;
}
var user = new Student("Tom", "Wang");
console.log(greeter(user));
