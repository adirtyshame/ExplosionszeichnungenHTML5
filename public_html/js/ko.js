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

function MotorViewModel(data) {
    var self = this;
    self.bild = ko.observable(data.bild);
    self.name = ko.observable(data.name);
    self.kurz = ko.observable(data.kurz);
    self.zuordnungen = ko.observableArray(data.zuordnungen);
//    var map = ko.mapping.fromJSON(data);
    
//    map.addZuordnung = function(baugruppe, einzelteil) {
//        map.zuordnungen.push(new ZuordnungViewModel(baugruppe, einzelteil, 20, 20, 60, 30));
//    };
//    return map;
}
//var model = new MotorViewModel();
//ko.applyBindings(new MotorViewModel());
//console.log(model.zuordnungen.length);