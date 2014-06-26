function ZuordnungViewModel(baugruppe, einzelteil, x, y, width, height) {
    this.x = ko.observable(x);
    this.y = ko.observable(y);
    this.width = ko.observable(width);
    this.height = ko.observable(height);
    this.baugruppe = ko.observable(baugruppe);
    this.einzelteil = ko.observable(einzelteil);
}

//function ZuordnungViewModel(data) {
//    var map = ko.mapping.fromJSON(data);
//    return map;
//}

function MotorViewModel(bild, name, kurz) {
    var self = this;
    self.bild = ko.observable(bild);
    self.name = ko.observable(name);
    self.kurz = ko.observable(kurz);
    self.zuordnungen = ko.observableArray();
//    var map = ko.mapping.fromJSON(data);
    
    self.addZuordnung = function(baugruppe, einzelteil, x, y, width, height) {
        self.zuordnungen.push(new ZuordnungViewModel(baugruppe, einzelteil, x, y, width, height));
    };
    self.selectedZuordnung = ko.observable();
}

function MotorenViewModel(data) {
    this.name = ko.observable(data.name);
    this.kurz = ko.observable(data.kurz);
}

function Explosionszeichnungen() {
    var self = this;
    self.motoren = ko.observableArray();
    self.selectedMotor = ko.observable();
};
//var model = new MotorViewModel();
//ko.applyBindings(new MotorViewModel());
//console.log(model.zuordnungen.length);