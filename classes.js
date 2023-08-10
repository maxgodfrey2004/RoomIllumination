// Represents a vector in 2D space
//
class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.norm = Math.hypot(x, y);
    this.angle = Math.atan(y / x);
  }

  // Returns the dot product with another vector.
  dot(other) {
    return this.x * other.x + this.y * other.y;
  }

  // Projects this vector onto another vector.
  projOnto(other) {
    return other.mult(this.dot(other) / (other.norm * other.norm));
  }

  // Returns the angle between this vector and another vector.
  angle(other) {
    return Math.acos(this.dot(other) / (this.norm * other.norm));
  }

  // Negates this vector.
  negate() {
    return new Vector(-this.x, -this.y);
  }

  // Adds this vector to another vector.
  add(other) {
    return new Vector(this.x + other.x, this.y + other.y);
  }

  // Subtracts another vector from this vector.
  sub(other) {
    return new Vector(this.x - other.x, this.y - other.y);
  }

  // Multiplies this vector by a scalar.
  mult(scalar) {
    return new Vector(this.x * scalar, this.y * scalar);
  }
}

// Represents a line segment in 2D space
//
class LineSegment {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.dx = x2 - x1;
    this.dy = y2 - y1;
    this.length = Math.hypot(this.dx, this.dy); // The segment's length.
    this.normal = new Vector(-this.dy, this.dx); // A surface normal vector.
    this.normal = this.normal.mult(this.normal.norm);
  }
}

// Represents a photon (light 'particle' that bounces around the room)
//
// Parameters:
//   - x: Number, the current x-position.
//   - y: Number, the current y-position.
//   - dir: Number, the current direction we are travelling in, in radians.
//   - collisionRadius: Number, the distance at which the centre of the photon
//                      must be from a line segment for a collision to occur.
//
class Photon {
  constructor(x, y, dir, speed, collisionRadius) {
    this.x = x;
    this.y = y;
    this.vecDir = new Vector(speed * Math.cos(dir), speed * Math.sin(dir));
    this.speed = speed;
    this.collisionRadius = collisionRadius;
  }

  updatePosition() {
    this.x += this.vecDir.x;
    this.y += this.vecDir.y;
  }

  // Returns whether or not the photon collides with the point (a corner).
  checkPointCollision(px, py) {
    var dist = Math.hypot(this.x - px, this.y - py);
    return dist <= this.collisionRadius;
  }

  // Returns whether or not the photon collides with a line segment (a wall).
  checkLineCollision(line) {
    if (this.checkPointCollision(line.x1, line.y1) ||
        this.checkPointCollision(line.x2, line.y2)) {
      return true;
    }
    var vecX = this.x - line.x1;
    var vecY = this.y - line.y1;
    var dot = (vecX * (line.x2 - line.x1) + vecY * (line.y2 - line.y1))
        / (line.length * line.length);
    var closestX = line.x1 + dot * (line.x2 - line.x1);
    var closestY = line.y1 + dot * (line.y2 - line.y1);
    if (dot >= 0 && dot <= 1) {
      // On the line segment.
      var dist = Math.hypot(this.x - closestX, this.y - closestY);
      return dist <= this.collisionRadius;
    }
    return false;
  }

  // Recalculates the direction of the photon based on the normal vector to a
  // line segment.
  bounceOffSegment(line) {
    var normalProj = this.vecDir.projOnto(line.normal);
    var parallelProj = this.vecDir.sub(normalProj);
    console.log(normalProj, parallelProj);
    this.vecDir = parallelProj.sub(normalProj);
  }
}