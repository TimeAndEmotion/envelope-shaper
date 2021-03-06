/**
 * ADSR
 * 
 * Models work on the Attack, Decay, Sustain, Release synthesis model
 * 
 * We only use custmer value here - it can be related to CD3 process work to prioritse
 * Different appracjes to the work can be done to show the differences in "instruments"
 * 
 */

var _width = 400;//window.screen.width;
var _height = 200;//window.screen.height;
var _controlHeight = 200;

var showHide = false;
var showHideCalcs = false;
var wsjf_val = '';
var mvjf_val = '';

var tooltip = '';
var div_details;

var x1;
var y1;
var x2;
var y2;
var x3;
var y3;
var x4;
var y4;
var x5;
var y5;

var x6;
var y6strat;
var y6ops;
var y6personal;
var y6team;

var x7;
var x7strat;
var x7ops;
var x7person;
var x7team;
var y7strat;
var y7ops;
var y7person;
var y7team;


var a = 50;
var b = 100;


var box_env;
var box_design;
var box_deliver;

var box_env_on = false;
var box_design_on = false;
var box_deliver_on = false;
var box_cust_on = false;


var box_strat;
var box_cust;
var box_ops;
var box_team;
var box_person;

var box_strat_on = false;
var box_cust_on = false;
var box_ops_on = false;
var box_team_on = false;
var box_self_on = false;

var strat_val;
var btn_update;

var valueType;
var strat_val;
var strat_pct;
var cust_val;
var ops_val;
var team_val;
var person_val;

// var btn_info;
var show_info;
var info_div;

// var btn_info_close;
var btn_update;

var valButtonStrat;
var valButtonCust;
var valButtonOps;
var valButtonTeam;
var valButtonSelf;

var x_off = 10;
var y_off = 60;

var cust_x; // x value when the customer value box is being moved

var freestyle = 'Freestyle'; 
var drum = "1";//'Drum - short power burst';
var horns = "2";// 'Horns - Fast build, slow release';
var strings = "3";//'Strings - Slight noise then resonance';
var wind =  "4";//'Wind - Up front work and small effort'; 
var bass = "5";//'Bass -  Slow and steady'; 
var keys = "6";//'Keys - Like a tuned drum';
var guitar = "7";//'Guitar - Choppy effort and little value'; 
var synthBasic = "8";//'Synth Basic - Default setting - can be replaced';
var synthPad = "9";//'Synth Pad - Scan and design take as long as effort, high value';
var synthLead = "10";//'Synth Lead - Punchy application producing high value';
var synthTexture = "11";//'Synth Texture - Continuous power and profit';

var last_instrument_selected;

// Gui Controls
var slct_workProfile;
var workProfile;

var slct_workType;
var slct_roiType;

var Profiles = [freestyle, drum, horns, strings, wind, bass, keys, guitar, synthBasic, synthPad, synthLead, synthTexture];

var Customer = 50;
var CustomerMin = 0;
var CustomerMax = 100;
var CustomerStep = 1;

var Strategy = 0;
var StrategyMin = 0;
var StrategyMax = 100;
var StrategyStep = 1;

var Operations = 0;
var OperationsMin = 0;
var OperationsMax = 100;
var OperationsStep = 1;

var Team = 0;
var TeamMin = 0;
var TeamMax = 100;
var TeamStep = 1;

var Self = 0;
var SelfMin = 0;
var SelfMax = 100;
var SelfStep = 1;

var timeCriticality = '';

function preload() {
   
}

function setup() {

    bg=loadImage('./images/phobos-grooves.jpg');
    var myCan = createCanvas(650,350);
    myCan.parent("sadv");    
    
    box_env = new Box();
    box_design = new Box();
    box_deliver = new Box();

    x2 = _width/4;
    x3 = _width/2;
    x4 = _width*(3/4);
    y4 = _height/2 - 10;
    x5 = _width*(7/8);
    y5 = _height/2;

    box_cust = new Box();
   
    box_cust.tooltip = 'Customer Value';

    x7strat=400;
    x7ops=400;
    x7team=400;
    x7person=400;

    box_cust.box_x1 = x5 + 5;
    box_cust.box_x2 = x5 + 15;
    box_cust.box_y1 = y5 + 50;
    box_cust.box_y2 = y5 + 70;


    var advise = select("#advise");
    var advise_value = select("#advise_value");
    var advise_wsjf = select("#advise_wsjf");
    var advise_mvjf = select("#advise_mvjf");

   //box_cust = new Box(x5 - 10, 145, x5 + 10, 185);
   box_strat = new Box(x5 + 10, 105, x5+20, 144);
   box_ops = new Box(x5 + 10, 1045, x5+20, 1084); // drive this off the screen to let customer box have space
   box_team = new Box(x5 + 10, 185, x5+20, 224);
   box_person = new Box(x5 + 10, 225, x5+20, 264);
   
   slct_workProfile = select(".payments");

//    setValues("audience");

    select("#duration").value("10");

    timeCriticality = select("#time-criticality");
    timeCriticality.changed(timeCriticalityCalc);
}

function draw() {

    //background(bg);
    background(255);
    
    translate(10, 60);

    setPoints();
    
    // Red Scan Line
    stroke(255,0,0);
    line(x1, y1, x2, y2);
    fill(255,0,0);
    triangle(x2 -10, y2, x2 -5, y2 -5, x2-5, y2 +5);
    triangle(x2 + 10, y2, x2 +5, y2 -5, x2+5, y2 +5);
    rect(x2-5, y2-2, 10, 4);
    textSize(18);
    fill(120, 120, 120);
    stroke(220, 220, 220);
    var _scan = '' + floor( map(x2 - x1, 0, 100, 0, 100));
    text('Scan ' + _scan, ((x2 - x1) /2) + 10, _height/2);

    // Orange Design Line
    stroke(255, 153, 0);
    line(x2, y2, x3, y3);
    fill(255, 153, 0);
    triangle(x3 -10, y3, x3 -5, y3 -5, x3-5, y3 +5);
    triangle(x3 + 10, y3, x3 +5, y3 -5, x3+5, y3 +5);
    rect(x3-5, y3-2, 10, 4);
    textSize(18);
    fill(120, 120, 120);
    stroke(220, 220, 220);
    var _design = '' + floor( map( x3 - x2, 0, 200, 0, 100)) ;
    text('Design ' + _design.substring(0,3), (x3 - (x3 - x2 )/2 ) + 10, (y3 - (y3 -y2)/2));
    
    // Green Effort/Sustain Line
    stroke(0, 255, 0);
    fill(0,255,0);
    line(x3, y3, x4, y4);
    var xt = x4-_width/8;
    triangle (xt-5, y4-5, xt, y4-10, xt+5, y4-5);
    triangle (xt-5, y4+5, xt, y4+10, xt+5, y4+5);
    rect(xt-3, y4-5, 6, 10);
    textSize(18);
    fill(120, 120, 120);
    stroke(220, 220, 220);
    var _delivery = '' + floor(100 - map(_height - y4, 0, _height, 100, 0));
    text('Delivery ' + _delivery, x3 , (y3 + 30));
   
    // TODO - Refactor to tidy the drawing of triangles
    fill(255, 153, 0);
    stroke(255, 153, 0);
    triangle(x3 -10, y3, x3 -5, y3 -5, x3-5, y3 +5);
    triangle(x3 + 10, y3, x3 +5, y3 -5, x3+5, y3 +5);
    rect(x3-5, y3-2, 10, 4);

    // Blue Line - connect effort to delivery
    stroke(0, 0, 255);
    line(x4, y4, x5, this.box_cust.box_y1 - y_off + 10);
    line(x5, (this.box_cust.box_y1 - y_off + 10), x5 + 200, _height);


    strokeWeight(1);
    fill(130,130,130);
    stroke(130,130,130);
    
    text('Time & Effort', 10, -30);

    text('Value', x5 + 60, -30);
    stroke(51);
    for (var k=x5; k < _width + 160; k+=20) {
        line(k, 0, k, _height);
    }
    for (var k=0; k < _height +1; k+=40) {
        line(x5, k, _width+150, k);
    }

    // DraggableLines to show strategic, customer, team and personal value

    // Customer
    stroke(51);
    noFill();
    rect(0, 0, x5, _height);

    fill(51)
    //text('Cust ' + cust_val, x5 + 210, 25)
    text("100",  x5 + 210, 5);
    text(" 80",  x5 + 210, 45);
    text(" 60",  x5 + 210, 85);
    text(" 40",  x5 + 210, 125);
    text(" 20",  x5 + 210, 165);
    text("   0",  x5 + 210, 205);

    wsjf();

    // customer value line goes from position on x5 vertical to relative(0,0)
    //line(x5, 22, this.box_cust.box_x1-10, 22);
    // var xy = constrain (box_cust.box_y1, _height - 200, _height);

    triangle (box_cust.box_x1-10, box_cust.box_y1-55, box_cust.box_x1-5, 
    box_cust.box_y1-60, box_cust.box_x1, box_cust.box_y1-55);

    triangle (this.box_cust.box_x1-10, this.box_cust.box_y1-45, this.box_cust.box_x1-5, 
    this.box_cust.box_y1-40, this.box_cust.box_x1, this.box_cust.box_y1-45);
    
    rect(this.box_cust.box_x1 - 8, this.box_cust.box_y1-55, 6, 10);
    
    
    if (last_instrument_selected != slct_workProfile.value() )
    {
        var _workProfile = slct_workProfile.value();

        switch (_workProfile) {
            case drum:
                x1 = 0;
                y1 = 0;

                x2 = 0;
                y2 = 0;

                x3 = 0;
                y3 = 0;

                x4 = 0;
                y4 = 0; 
                break;
            
            case horns:
                x1 = 0;
                y1 = 0;

                x2 = 30;
                y2 = 0;

                x3 = 50;
                y3 = 0;

                x4 = 50;
                y4 = 50; 
                break;

            case strings:
                x1 = 0;
                y1 = 0;

                x2 = 50;
                y2 = 0;

                x3 = 100;
                y3 = 0;

                x4 = 150;
                y4 = 50; 
                break;

            case wind:
                x1 = 0;
                y1 = 0;

                x2 = 100;
                y2 = 0;

                x3 = 200;
                y3 = 0;

                x4 = 250;
                y4 = _height - 30; 
                break;

            case bass:
                x1 = 0;
                y1 = 0;

                x2 = 10;
                y2 = 0;

                x3 = 20;
                y3 = 0;

                x4 = 250;
                y4 = _height - 30; 
                break;

            case keys:
                x1 = 0;
                y1 = 0;

                x2 = 10;
                y2 = 0;

                x3 = 20;
                y3 = 0;

                x4 = 150;
                y4 = _height - 130; 
                break;

            case guitar:
                x1 = 0;
                y1 = 0;

                x2 = 10;
                y2 = 0;

                x3 = 20;
                y3 = 0;

                x4 = 150;
                y4 = _height - 70; 
                break;

            case synthBasic:
                x1 = 0;
                y1 = 0;

                x2 = 100;
                y2 = 0;

                x3 = 200;
                y3 = 0;

                x4 = 300;
                y4 = 100; 
                break;
            
            case synthPad:
                x1 = 0;
                y1 = 0;

                x2 = 100;
                y2 = 0;

                x3 = 200;
                y3 = 0;

                x4 = 300;
                y4 = 20; 
                break;

            case synthLead:
                x1 = 0;
                y1 = 0;

                x2 = 100;
                y2 = 0;

                x3 = 200;
                y3 = 0;

                x4 = 300;
                y4 = _height - 70; 
                break;

            case synthTexture:
                x1 = 0;
                y1 = 0;

                x2 = 100;
                y2 = 0;

                x3 = 200;
                y3 = 0;

                x4 = 300;
                y4 = 0; 
                break;
        
        }
    
        last_instrument_selected = slct_workProfile.value();
        // Need ONE TIME profile setting - changedevent ? - quickfix applied
        workProfile = freestyle;
    }
    
    timeCriticalityCalc();
    
    //showCogLead();

} // draw



/**
 * Set points based on user moving sliders
 *  - change to dragging the points on the lines
 */
function setPoints() {
    
    x1 = 0;
    y1 = _height;

    if (!box_env_on) {
        //x2 = map(env_slider.value(), 0, 100, 0, _width/4);
    } else {
        if (mouseX >= 0 && mouseX <= _width/4)  {
            x2 = mouseX;
        }
    }
    // Sometimes a fast drag to the left will make the end point negative.
    if (x2 < 0) 
    {
        x2 = 0;
    }
    y2 = 0;

    if (!box_design_on) {
        } else {
        if ( ( mouseX >= x2) && (mouseX <= _width/2) ) {
            x3 = mouseX;
        }
    }

    // set the leftmost design point as 0 in case an overexuberant slide occurred.
    if (x3 < 0) {
        x3 = 0;
    }

    if (x2 > _width/4) {
        x2 = _width/4;
    }

    // The design start cannot be before the end of the scan (at the moment) 
    if (x3 < x2) {
        x3 = x2;
    }
    if (x3 > _width/2) {
        x3 = _width/2;
    }

    x4 = x3 + _width/4;
   
    y3 = y4;
    
    x5 =  _width*(7/8);
    // y5 = _height/2;
    x6 = x5 + 25;
    x7 = width;

    var val = 0;

    box_env.box_x1 = x2 - 10 + x_off;
    box_env.box_x2 = x2 + 10 + x_off;
    box_env.box_y1 = y2 - 15 + y_off;
    box_env.box_y2 = y2 + 15 + y_off;

    box_design.box_x1 = x3 - 10 + x_off;
    box_design.box_x2 = x3 + 10 + x_off;
    box_design.box_y1 = y3 - 15 + y_off;
    box_design.box_y2 = y3 + 15 + y_off;

    box_deliver.box_x1 = (x3 + _width/8) - 10 + x_off;
    box_deliver.box_x2 = (x3 + _width/8) + 10 + x_off;
    box_deliver.box_y1 = y3 - 15 + y_off;
    box_deliver.box_y2 = y3 + 15 + y_off;
    
    wsjf();
}


/**
 * Mouse functions
 * 
 * TODO - Make them object specific.
 */
function mousePressed() {
    console.log("Pressed", mouseX, mouseY);
    
    if (this.box_env.isInside(mouseX, mouseY)) {
        box_env_on = true;
        //console.log('In Env');
    }
    else if (this.box_design.isInside(mouseX, mouseY)) {
        this.box_design_on = true;
        fill(0);
        //console.log('In Design');
    }
    else if (this.box_deliver.isInside(mouseX, mouseY)) {
        this.box_deliver_on = true;
        // console.log('In Delivery');
    }
     else if (this.box_cust.isInside(mouseX, mouseY)) {
        this.box_cust_on = true;
        // console.log('In Customer ' + this.box_cust_on);
    }
   
}

function mouseReleased() {
    box_env_on = false;
    box_design_on = false;
    box_deliver_on = false;

    box_cust_on = false;
    
    wsjf();
}

function mouseDragged() {
   
    if (box_env_on) {
        //console.log('Drag', box_env_on)
        if ( (x2 <= _width/4) && (x2 >= 0) ) {
            x2 = mouseX;
            if (mouseX > 0) {
                
            }
        }
    }

    else if (box_design_on) {
        //console.log('Drag', box_design_on)
        if ( (x3 > this.x2) && (x3 <= _width/2) ) {
            x3 = mouseX;
        }
    }

    // TODO: Refactor - Box deliver and Box cust are initialised on differetn fucntions
    else if (box_deliver_on) {
        //console.log('Drag', box_design_on)
        if ( (mouseY >= y_off ) && (mouseY <= _height + y_off) ) {
            y4 = mouseY - 60;
            //console.log(y4, mouseY);
        }
    }
    
    // For Single Customer value the movement is vertical
    else if (box_cust_on) {
         if ( (mouseY >= y_off  ) && (mouseY <= _height + y_off ) ) {
            this.box_cust.updateY(mouseY - 10);
            y5 = mouseY - 50;
        }     
    }
    // if (this.box_cust.box_y1 <= y_off - 20) {
    //     this.box_cust.updateY(y_off)
    // }
    // if (this.box_cust.box_y1 >= _height + y_off - 6) {
    //     this.box_cust.updateY(258)
    // }

}


/**
 * Set the appropriate values for the lines
 */
function setValues() {
    //console.log("Update");
    // Reset all values
    box_cust.update(x5 - 5);
    // box_strat.update(x5 + 10);
    // box_ops.update(x5 + 10);
    // box_team.update(x5 + 10);
    // box_person.update(x5 + 10);
}

// Show or hide the weightings when checkbox is clicked
function toggleWeights() {
    showHide = !showHide;
    var divWeights = select("#weightings");
    if (!showHide) {
        divWeights.hide();
    } else {
        divWeights.show();
    }
}

// Show or hide the calculations when checkbox is clicked
function toggleCalcs() {
    showHideCalcs = !showHideCalcs;
    var divCalcs = select("#calcs");
    if (!showHideCalcs) {
        divCalcs.hide();
    } else {
        divCalcs.show();
    }
}


/**
 * Cognitive Lead Time shows if scan and design can be done in time box
 * 
 * the agile way of cutting tasks into smaller periods to deliver misses the value perspectives
 * 
 * Sprints are fixed duration 
 * Releases may vary
 * Ops are quarter reporting periods
 * Strategy can be malleable - long term view to steer the ship
 */
function showCogLead() {

    //var _effort_to_time = map(y4, )
    stroke(255, 0,0);
    line(120, -40, 150, -40);

    stroke(255, 153, 0);
    line(150, -40, 180, -40);

    stroke(0,255, 0);
    line(180, -40, 210, -40);

    stroke(0);
    line(120, -30, 210, -30);
    line()

}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * Weighted Shortest Job First
 * 
 * WSJF = (Customer Value + RR | OE + Time Criticality) / Job Size
 * or
 * MVJF = (Summed values) / Scan + Design + Effort * duration
 * 
 */
function wsjf() {

    var dur = select("#duration").value();

    var valid = isNumber(dur);

    var valid = valid && (dur > 0);

    // console.log("Dur check " + valid);

    if (valid) {

   
        var scan_dur = x2 - x1;
        var design_dur = x3 - x2;
        var denom = dur - ( ( scan_dur + design_dur ) / 200);

        // cycle and lead time
        // Cycle time is time on the job - a sprint
        // Lead time is the total time
        //let leadTime = floor(map(y4, _height, (_height - 200), 0, 100));
        let cycleTime = x4 - x3;

        var effort = floor(map(y4, _height, (_height - 200), 0, 100));

        //var time_effort = leadTime;
 
        cust_val = floor(map(y5, _height,  (_height - 200), 0, 100));
        // strat_val = floor(map(this.box_strat.box_x1, x5 + 10, x5 + 200, 0, 100));
        // ops_val = floor(map(this.box_ops.box_x1, x5 + 10, x5 + 200, 0, 100));
        // team_val = floor(map(this.box_team.box_x1, x5 + 10, x5 + 200, 0, 100));
        // person_val = floor(map(this.box_person.box_x1, x5 + 10, x5 + 200, 0, 100));

        // advise_value.innerHTML = 'Value<br>Customer: ' +  cust_val  +'<br>Strategic: ' + strat_val + '<br>Operations: ' + ops_val + '<br>Team: ' + team_val + '<br>Personal: ' +person_val;
        
        let crit = timeCriticality.value();
        switch (crit) {
            case "2":
            case "3":
                wsjf_val = ( cust_val/ (floor(effort * dur)));
                break;
            case "4":
                wsjf_val = (cust_val / (floor(effort * dur) + dur));
                break;
            case "5":
                wsjf_val = (cust_val / (floor(effort * dur) + (2*dur)));
                break;
        }
       
        var _txt_wsjf = '' + wsjf_val;
        _txt_wsjf = "WSJF: " + _txt_wsjf.substring(0,6);
        // advise_wsjf.innerHTML = "WSJF: " + _txt_wsjf.substring(0,6);
        stroke(52);
        fill(52);
        text(_txt_wsjf , 20, height - 80);
    
    }
}

// Switch the time labels depending on critical selection
function timeCriticalityCalc() {
    
    let crit = timeCriticality.value();
    
    if (x4 === 0) {
        x4 = 0.01;
    }
    switch (crit) {
        case "2":
            stroke(0);
            line(x1, height - 120, x4, height - 120);
            text("Lead", x4/2 - 10, height - 102);
            break;
        case "3":
            stroke(0);
            line(x1, height - 120, x4, height - 120);
            text("Lead", x4/2 - 10, height - 102);
            break;
        case "4":
            stroke(0);
            line(x1, height - 120, x4, height - 120);
            stroke(0, 255, 0);
            line(x3, height - 120, x3, height - 130);
            stroke(0);
            text("Cycle", x3 + 10, height - 122);
            text("Lead", x4/2 - 10, height - 102);
            break;
        case "5":
            stroke(0);
            line(x1, height - 120, x4, height - 120);
            stroke(0, 255, 0);
            line(x3, height - 120, x3, height - 130);
            stroke(0);
            text("Cycle", x3 + 10, height - 122);
            text("Lead", x4/2 - 10, height - 102);
            break;
    }
    
}