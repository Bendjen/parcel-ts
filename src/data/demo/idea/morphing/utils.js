//path的参数计算
function metaball(
  radius1,
  radius2,
  center1,
  center2,
  handleLenRate = 2.4,
  v = 0.5
) {
  const HALF_PI = Math.PI / 2;
  const d = dist(center1, center2);
  const maxDist = radius1 + radius2 * 2.5;
  let u1, u2;

  if (radius1 === 0 || radius2 === 0) {
    return [""];
  }

  if (d > maxDist) {
    return [""];
  } else if (d <= Math.abs(radius1 - radius2)) {
    return [""];
  }

  if (d < radius1 + radius2) {
    u1 = Math.acos(
      (radius1 * radius1 + d * d - radius2 * radius2) / (2 * radius1 * d)
    );
    u2 = Math.acos(
      (radius2 * radius2 + d * d - radius1 * radius1) / (2 * radius2 * d)
    );
  } else {
    u1 = 0;
    u2 = 0;
  }

  
  const angleBetweenCenters = angle(center2, center1);
  const spread = Math.acos((radius1 - radius2) / d);
  
  // @angleBetweenCenters : 两圆心夹角极坐标
  // @spread : 两圆切点到圆心距离
  // @u1,u2: 两圆切点与大圆圆心成角
  // v：粘度系数，0-1，越大越趋于直线

  // 1.利用两圆切线求出四个切点的极坐标
  const angle1 = angleBetweenCenters + u1 + (spread - u1) * v;
  const angle2 = angleBetweenCenters - u1 - (spread - u1) * v;
  const angle3 =
    angleBetweenCenters + Math.PI - u2 - (Math.PI - u2 - spread) * v;
  const angle4 =
    angleBetweenCenters - Math.PI + u2 + (Math.PI - u2 - spread) * v;
  // 2.转换极坐标为笛卡尔坐标系
  const p1 = getVector(center1, angle1, radius1);
  const p2 = getVector(center1, angle2, radius1);
  const p3 = getVector(center2, angle3, radius2);
  const p4 = getVector(center2, angle4, radius2);
  // 3.利用四个切点再对自身圆坐切线，求得四个手柄的点
  const totalRadius = radius1 + radius2;
  const d2Base = Math.min(v * handleLenRate, dist(p1, p3) / totalRadius);

  const d2 = d2Base * Math.min(1, d * 2 / (radius1 + radius2));

  const r1 = radius1 * d2;  //手柄长度
  const r2 = radius2 * d2;  //手柄长度

  const h1 = getVector(p1, angle1 - HALF_PI, r1);
  const h2 = getVector(p2, angle2 + HALF_PI, r1);
  const h3 = getVector(p3, angle3 + HALF_PI, r2);
  const h4 = getVector(p4, angle4 - HALF_PI, r2);

  // 4.根据切点坐标、手柄坐标、圆半径绘制出path的路线系数
  const path = metaballToPath(
    p1,
    p2,
    p3,
    p4,
    h1,
    h2,
    h3,
    h4,
    d > radius1,
    radius2
  );

  return path;
}

//移动坐标
function moveTo([x, y] = [0, 0], element) {
  element.setAttribute("cx", x);
  element.setAttribute("cy", y);
}

//绘制路径
function line([x1, y1] = [0, 0], [x2, y2] = [0, 0], element) {
  element.setAttribute("x1", x1);
  element.setAttribute("y1", y1);
  element.setAttribute("x2", x2);
  element.setAttribute("y2", y2);
}

//计算距离
function dist([x1, y1], [x2, y2]) {
  return ((x1 - x2) ** 2 + (y1 - y2) ** 2) ** 0.5;
  // **2表示平方 **0.5表示根号2
}

//计算角度
function angle([x1, y1], [x2, y2]) {
  return Math.atan2(y1 - y2, x1 - x2);
  //Math.atan2 ：计算从x轴逆时针旋转到点的角度
}

//极坐标转成笛卡尔坐标
function getVector([cx, cy], a, r) {
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

function metaballToPath(p1, p2, p3, p4, h1, h2, h3, h4, escaped, r) {
  // prettier-ignore
  return [
      'M', p1,
      'C', h1, h3, p3,
      'A', r, r, 0, escaped ? 1 : 0, 0, p4,
      'C', h4, h2, p2,
    ].join(' ');
}

export { moveTo, line, dist, angle, getVector, metaball, metaballToPath };
