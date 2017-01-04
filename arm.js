var MAX_ITERATION_NUM = 1;

function Arm(segments) {
  this.segments = segments.map(function (segment) {
    segment.angle = 0;
    return segment;
  });
}


Arm.prototype.moveTo = function(x, y) {
  var i = 0;
  while (i < MAX_ITERATION_NUM) {
    i++;
    for (var s = this.segments.length -1; s >= 0 ; s--) {
      var startX = 0, startY = 0, angle = 0;
      for (var j = 0; j < s; j++) {
        angle += this.segments[j].angle;
        startX += this.segments[j].length * Math.acos(angle);
        startY += this.segments[j].length * Math.asin(angle);

      }
      var targetAngle = Math.atan((x - startX) / (y - startY));

      if (!isNaN(targetAngle) && isFinite(targetAngle)) {
        this.segments[s].angle = angle - targetAngle;
      }

      this.onChanged();
    }
  }

  // for (var s = this.segments.length -1; s >= 0 ; s--) {
  //   this.segments[s].angle = Math.atan(x / y);
  // }
  // console.log(Math.atan(x/y),x,y);

};