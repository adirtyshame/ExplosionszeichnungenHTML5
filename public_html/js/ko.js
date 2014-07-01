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
        return item.baugruppe() + item.einzelteil();
    };
    self.click = function() {
        invalidate();
    };
    self.addZuordnung = function() {
        if ($('#gruppeText').val().length == 0) {
            return;
        }
        var res = $('#gruppeText').val().toUpperCase().split('-');

        var test = new Zuordnung(self.kurz(), res[0], res[1], 20, 20, 60, 30);
        self.zuordnungen.push(test);
        self.selectedZuordnung(test);
        $('#gruppeText').val('')
        invalidate();
    }
    self.removeZuordnung = function() {
        var url = 'http://explodedview.scooter-attack.com/delete.php?baugruppe=' + self.selectedZuordnung().baugruppe() + '&einzelteil=' + self.selectedZuordnung().einzelteil() + '&motortyp=' + self.selectedZuordnung().motor();
        $.get(url, function(data) {
            self.zuordnungen.remove(self.selectedZuordnung());
            invalidate();
        });
    }
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