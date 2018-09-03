
class Student {
    fullName: string;
    constructor(public firstname: string, public lastname: string) {
        this.fullName = firstname + lastname;
    }
    jump() {
        console.log("jump once");
    }
}

class Puple extends Student {
    height: number;
    constructor(firstname: string, lastname: string, height: number) {
        super(firstname, lastname);
        this.height = height;
    }
    talk() {
        super.jump();
        this.jumpAndTalk();
    }
    private jumpAndTalk() {
        console.log("talk while jumpping.");
    }
} 

var p = new Puple("Pater", "Liu", 140);
p.talk();

interface Person {
    firstname: string;
    lastname: string;
}

function greeter(person: Person) {
    return "Hello" + person.firstname + " " + person.lastname;
}

var user = new Student("Tom", "Wang");

console.log(greeter(user));

