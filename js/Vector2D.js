define(function() {"use strict";
	var Vector2D = function(x, y) {
		this.x = parseFloat(x) || 0;
		this.y = parseFloat(y) || 0;
	};
	Vector2D.prototype = {
		constructor : Vector2D,
		length : function() {
			return Math.sqrt(this.lengthSq());
		},
		lengthSq : function() {
			return this.x * this.x + this.y * this.y;
		},
		set : function(x, y) {
			this.x = x;
			this.y = y;
			return this;
		},
		normalize : function() {
			var l = this.length();
			if (l > 0) {
				this.x /= l;
				this.y /= l;
			}
			return this;
		},
		normalized : function() {
			return this.copy().normalize();
		},
		multiplied : function(factor) {
			return new Vector2D(this.x * factor, this.y * factor);
		},
		copy : function() {
			return new Vector2D(this.x, this.y);
		},
		add : function(vector) {
			this.x += vector.x;
			this.y += vector.y;
			return this;
		}
	};
	return Vector2D;
});
