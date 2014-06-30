function Zuordnung(motor, baugruppe, einzelteil, x, y, width, height) {
    var self = this;
    self.x = ko.observable(x);
    self.y = ko.observable(y);
    self.width = ko.observable(width);
    self.height = ko.observable(height);
    self.baugruppe = ko.observable(baugruppe);
    self.einzelteil = ko.observable(einzelteil);
    self.motor = ko.observable(motor);
}

function Motor() {
    var self = this;
    self.bild = ko.observable('');
    self.name = ko.observable('');
    self.kurz = ko.observable('');
    self.zuordnungen = ko.observableArray();
    self.selectedZuordnung = ko.observable();
    self.bezeichnung = function(item) {
        return item.motor() + item.baugruppe() + item.einzelteil();
    };
    self.click = function() {
//        init(self.bild());
        alert(self.selectedZuordnung().einzelteil());
    };
}

function Motortyp(data) {
    var self = this;
    self.name = ko.observable(data.name);
    self.kurz = ko.observable(data.kurz);
    self.bild = ko.observable(data.bild);
}

function MotorTypen() {
    var self = this;
    self.motortypen = ko.observableArray();
    self.selectedTyp = ko.observable();
    self.click = function() {
        ladeMotor(self.selectedTyp().kurz());
    };
    self.bezeichnung = function(item) {
        return item.kurz() + ', ' + item.name();
    };
}