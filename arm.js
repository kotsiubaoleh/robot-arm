var MAX_ITERATION_NUM = 50;

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
      // console.log(s);
      var tipX = 0, tipY = 0, segStartX = 0, segStartY = 0, segAngle = this.segments[0].angle;
      for (var j = 0, angle = 0; j < this.segments.length; j++) {
        angle += this.segments[j].angle;
        tipX += this.segments[j].length * Math.cos(angle + Math.PI / 2);
        tipY += this.segments[j].length * Math.sin(angle + Math.PI / 2);

        if (j == s-1) {
          segStartX = tipX;
          segStartY = tipY;
          segAngle = angle;
        }
      }

      console.log(s,segStartX, segStartY);

      //var targetAngle = Math.atan2(x - startX , y - startY);
      // console.log(x,y,startX,startY);
      //console.log(tipX,tipY);

      var angleDelta = Math.atan2(tipX - segStartX, tipY - segStartY) - Math.atan2(x - segStartX, y - segStartY) ;

      // console.log(angleDelta);

      this._rotateSegmentBy(s, angleDelta);
      //this.segments[s].angle += angleDelta;

      this.onChanged();
    }
  }

  // for (var s = this.segments.length -1; s >= 0 ; s--) {
  //   this.segments[s].angle = Math.atan(x / y);
  // }
  // console.log(Math.atan(x/y),x,y);

};

Arm.prototype._setSegmentAngle = function(segmentIndex, angle) {
  this.segments[segmentIndex].angle = angle;
  if (this.segments[segmentIndex].angle > this.segments[segmentIndex].maxAngle) {
    this.segments[segmentIndex].angle = this.segments[segmentIndex].maxAngle;
  } else if (this.segments[segmentIndex].angle < this.segments[segmentIndex].minAngle) {
    this.segments[segmentIndex].angle = this.segments[segmentIndex].minAngle;
  }
  // if(segmentIndex == this.segments.length - 1) {
  //   console.log(this.segments[segmentIndex].angle);
  //   console.log(this.segments[segmentIndex].maxAngle, this.segments[segmentIndex].minAngle);
  // }
};


Arm.prototype._rotateSegmentBy = function(segmentIndex, angle) {
  this._setSegmentAngle(segmentIndex, this.segments[segmentIndex].angle + angle);
};
