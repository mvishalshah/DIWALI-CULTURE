(() => {
  const stalls = [
    { id: "saree", name: "Saree & Silks", kind: "shop", x: 365, y: 390, color: "#99443f", detail: "Handwoven silks and festive clothing, draped in every colour." },
    { id: "jewellery", name: "The Jewel Box", kind: "shop", x: 670, y: 390, color: "#b27a2d", detail: "A jeweller's counter sparkling with traditional ornaments." },
    { id: "crafts", name: "Karigar Crafts", kind: "shop", x: 1325, y: 390, color: "#47765c", detail: "Handmade toys, keepsakes and gifts from local artisans." },
    { id: "pottery", name: "Potter's Corner", kind: "shop", x: 1630, y: 390, color: "#a85c37", detail: "Freshly shaped terracotta pots and little clay lamps." },
    { id: "diya-stall", name: "Diya Bazaar", kind: "shop", x: 365, y: 700, color: "#bc762e", detail: "Clay diyas ready to take home and decorate." },
    { id: "lights", name: "Light & Lantern", kind: "shop", x: 670, y: 700, color: "#38735b", detail: "Paper lanterns and strings of warm festive lights." },
    { id: "jalebi", name: "Hot Jalebi", kind: "food", x: 1325, y: 700, color: "#b35b2d", detail: "Crisp jalebi, poured fresh and still warm." },
    { id: "chaat", name: "Chaat Chowk", kind: "food", x: 1630, y: 700, color: "#a64b34", detail: "A lively counter of tangy chaat and savoury snacks." },
    { id: "golgappa", name: "Golgappa Gali", kind: "food", x: 365, y: 1010, color: "#89703b", detail: "Pani puri served with a choice of bright, tangy waters." },
    { id: "sweets", name: "Mithai House", kind: "food", x: 670, y: 1010, color: "#8e3f43", detail: "Boxes of laddoo, barfi and festive sweets to share." },
    { id: "chai", name: "Chai & Stories", kind: "food", x: 1325, y: 1010, color: "#7b573d", detail: "A steaming cup of masala chai and a quiet place to pause." },
    { id: "snacks", name: "Namkeen Nook", kind: "food", x: 1630, y: 1010, color: "#426f54", detail: "A paper cone of crunchy, freshly fried namkeen." }
  ];
  const pointsOfInterest = [
    ...stalls.map(stall => ({ ...stall, accessX: stall.x + 82, accessY: stall.y + 110 })),
    { id: "stage", name: "Folk Dance Stage", kind: "performance", x: 1690, y: 165, accessX: 1535, accessY: 235, detail: "Colourful folk dancers are performing beneath the courtyard lanterns." },
    { id: "puppets", name: "Puppet Theatre", kind: "performance", x: 1730, y: 875, accessX: 1570, accessY: 865, detail: "A little puppet play is drawing a cheerful crowd." },
    { id: "rangoli", name: "Rangoli Courtyard", kind: "craft", x: 1000, y: 470, accessX: 1000, accessY: 575, detail: "Families are making a colourful rangoli together." },
    { id: "ferris", name: "Ferris Wheel", kind: "ride", x: 205, y: 345, accessX: 355, accessY: 445, detail: "The old Ferris wheel turns slowly over the fairground." },
    { id: "swings", name: "Garden Swings", kind: "ride", x: 230, y: 900, accessX: 380, accessY: 930, detail: "Traditional swings sway beneath a canopy of lights." },
    { id: "entrance", name: "Grand Entrance", kind: "landmark", x: 1000, y: 1320, accessX: 1000, accessY: 1180, detail: "A welcoming toran marks the entrance to the mela." }
  ];
  const buildings = stalls.map(({ x, y }) => ({ x: x - 5, y: y - 10, w: 175, h: 112 }));
  const goldenDiyas = [
    { x: 890, y: 370 }, { x: 1120, y: 620 }, { x: 900, y: 870 }, { x: 1110, y: 1080 }, { x: 480, y: 540 }
  ];

  function drawPath(ctx, points, width, color) {
    ctx.beginPath();
    points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  }

  function drawWorld(ctx, time, collected) {
    ctx.fillStyle = "#234235";
    ctx.fillRect(0, 0, 2000, 1400);
    for (let y = 30; y < 1400; y += 84) {
      for (let x = (Math.floor(y / 84) % 2) * 40 + 35; x < 2000; x += 84) {
        ctx.fillStyle = "rgba(224, 202, 143, .035)";
        ctx.beginPath();
        ctx.moveTo(x, y - 2); ctx.lineTo(x + 3, y + 3); ctx.lineTo(x, y + 8); ctx.lineTo(x - 3, y + 3);
        ctx.closePath(); ctx.fill();
      }
    }

    drawPath(ctx, [[1000, 1380], [1000, 1120], [940, 980], [1000, 830], [1000, 620], [1000, 425], [1000, 160]], 205, "#a78355");
    drawPath(ctx, [[1000, 920], [790, 920], [570, 920], [250, 920]], 125, "#92754f");
    drawPath(ctx, [[1000, 635], [1210, 635], [1450, 635], [1770, 635]], 125, "#92754f");
    drawPath(ctx, [[1000, 1100], [790, 1100], [570, 1100], [250, 1100]], 90, "#8c704a");
    drawPath(ctx, [[1000, 365], [790, 365], [570, 365], [250, 365]], 90, "#8c704a");
    drawPath(ctx, [[1000, 1380], [1000, 1120], [940, 980], [1000, 830], [1000, 620], [1000, 425], [1000, 160]], 5, "rgba(248, 215, 153, .23)");
    drawPath(ctx, [[1000, 920], [790, 920], [570, 920], [250, 920]], 4, "rgba(248, 215, 153, .2)");
    drawPath(ctx, [[1000, 635], [1210, 635], [1450, 635], [1770, 635]], 4, "rgba(248, 215, 153, .2)");

    drawGate(ctx, 1000, 1265);
    drawDecorativeLights(ctx, time);
    stalls.forEach(stall => drawStall(ctx, stall));
    drawFerrisWheel(ctx, 205, 340, time);
    drawSwings(ctx, time);
    drawStage(ctx, time);
    drawPuppetStage(ctx);
    drawRangoli(ctx, 1000, 475, 52);
    drawLanterns(ctx);
    drawGoldenDiyas(ctx, collected, time);

    ctx.fillStyle = "rgba(239, 211, 157, .82)";
    ctx.font = "600 12px 'DM Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("BAZAAR", 1000, 285);
    ctx.fillText("FOOD STREET", 1000, 780);
    ctx.fillText("CULTURAL COURTYARD", 1000, 535);
  }

  function drawStall(ctx, stall) {
    const { x, y, color, name, kind } = stall;
    ctx.save();
    ctx.fillStyle = "rgba(10, 15, 13, .32)";
    ctx.fillRect(x + 8, y + 13, 174, 116);
    ctx.fillStyle = "#d4bd91";
    ctx.fillRect(x, y + 8, 170, 102);
    ctx.fillStyle = "#503128";
    ctx.fillRect(x + 10, y + 40, 150, 68);
    ctx.fillStyle = color;
    ctx.fillRect(x + 3, y + 4, 164, 37);
    for (let i = 0; i < 8; i++) {
      ctx.fillStyle = i % 2 ? "rgba(255, 224, 163, .32)" : "rgba(40, 29, 27, .17)";
      ctx.beginPath();
      ctx.moveTo(x + 3 + i * 20.5, y + 4);
      ctx.lineTo(x + 23.5 + i * 20.5, y + 4);
      ctx.lineTo(x + 20.5 + i * 20.5, y + 41);
      ctx.lineTo(x + 3 + i * 20.5, y + 41);
      ctx.closePath(); ctx.fill();
    }
    ctx.fillStyle = "#f4d590";
    ctx.fillRect(x + 16, y + 47, 138, 23);
    ctx.fillStyle = "#462619";
    ctx.font = "600 10px 'DM Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(name.toUpperCase(), x + 85, y + 62, 132);
    ctx.fillStyle = kind === "food" ? "#efae58" : "#c5a366";
    ctx.fillRect(x + 25, y + 79, 120, 8);
    ctx.fillStyle = "#e9c27b";
    ctx.beginPath(); ctx.arc(x + 14, y + 16, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + 156, y + 16, 3, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function drawGate(ctx, x, y) {
    ctx.save();
    ctx.fillStyle = "rgba(10, 12, 12, .32)";
    ctx.fillRect(x - 156, y - 80, 312, 135);
    ctx.fillStyle = "#9c6036";
    ctx.fillRect(x - 142, y - 86, 24, 115);
    ctx.fillRect(x + 118, y - 86, 24, 115);
    ctx.fillRect(x - 142, y - 101, 284, 28);
    ctx.fillStyle = "#e7bd72";
    ctx.fillRect(x - 107, y - 65, 214, 55);
    ctx.fillStyle = "#733c2c";
    ctx.font = "600 17px 'Noto Serif Devanagari', serif";
    ctx.textAlign = "center";
    ctx.fillText("शुभ दीपावली", x, y - 42);
    ctx.font = "600 9px 'DM Sans', sans-serif";
    ctx.fillText("WELCOME TO THE MELA", x, y - 24);
    ctx.strokeStyle = "#efcf85";
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(x - 155, y - 103); ctx.quadraticCurveTo(x, y - 148, x + 155, y - 103); ctx.stroke();
    for (let i = -5; i <= 5; i++) {
      const lx = x + i * 26, ly = y - 105 - Math.sin((i + 5) / 10 * Math.PI) * 37;
      ctx.fillStyle = i % 2 ? "#f5cf73" : "#ee9255";
      ctx.shadowBlur = 12; ctx.shadowColor = ctx.fillStyle;
      ctx.beginPath(); ctx.arc(lx, ly + 14, 4, 0, Math.PI * 2); ctx.fill();
    }
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  function drawDecorativeLights(ctx, time) {
    const runs = [
      { x1: 810, y1: 205, x2: 810, y2: 690, count: 10 },
      { x1: 1190, y1: 205, x2: 1190, y2: 690, count: 10 },
      { x1: 270, y1: 365, x2: 740, y2: 365, count: 9 },
      { x1: 1260, y1: 635, x2: 1730, y2: 635, count: 9 },
      { x1: 270, y1: 920, x2: 740, y2: 920, count: 9 },
      { x1: 1260, y1: 1010, x2: 1730, y2: 1010, count: 9 }
    ];
    runs.forEach(run => {
      ctx.beginPath();
      ctx.moveTo(run.x1, run.y1);
      ctx.lineTo(run.x2, run.y2);
      ctx.strokeStyle = "rgba(244, 211, 150, .48)"; ctx.lineWidth = 2; ctx.stroke();
    });
    let lightIndex = 0;
    runs.forEach(run => {
      for (let step = 0; step < run.count; step++) {
        const progress = step / (run.count - 1);
        const x = run.x1 + (run.x2 - run.x1) * progress;
        const y = run.y1 + (run.y2 - run.y1) * progress;
        const color = (lightIndex + Math.floor(time * 2)) % 3 ? "#f7d47b" : "#f09b63";
        ctx.fillStyle = color;
        ctx.shadowBlur = 9 + Math.sin(time * 3 + lightIndex) * 2;
        ctx.shadowColor = color;
        ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
        lightIndex++;
      }
    });
    ctx.shadowBlur = 0;
  }

  function drawFerrisWheel(ctx, x, y, time) {
    ctx.save();
    ctx.lineWidth = 8; ctx.strokeStyle = "#704c3b";
    ctx.beginPath(); ctx.moveTo(x - 57, y + 85); ctx.lineTo(x, y + 2); ctx.lineTo(x + 57, y + 85); ctx.stroke();
    ctx.lineWidth = 3; ctx.strokeStyle = "#e8c479";
    ctx.beginPath(); ctx.arc(x, y, 72, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - 65, y); ctx.lineTo(x + 65, y); ctx.moveTo(x, y - 65); ctx.lineTo(x, y + 65); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - 46, y - 46); ctx.lineTo(x + 46, y + 46); ctx.moveTo(x - 46, y + 46); ctx.lineTo(x + 46, y - 46); ctx.stroke();
    for (let i = 0; i < 8; i++) {
      const angle = time * .24 + i * Math.PI / 4, cx = x + Math.cos(angle) * 72, cy = y + Math.sin(angle) * 72;
      ctx.fillStyle = ["#c45843", "#d7a64c", "#43825f", "#e7c982"][i % 4];
      ctx.fillRect(cx - 10, cy - 8, 20, 17);
      ctx.fillStyle = "#ffe4a4";
      ctx.fillRect(cx - 2, cy - 4, 4, 4);
    }
    ctx.fillStyle = "#f3d184"; ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function drawSwings(ctx, time) {
    for (let i = 0; i < 3; i++) {
      const x = 170 + i * 54, y = 880;
      ctx.strokeStyle = "#b59056"; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(x - 17, y - 72); ctx.lineTo(x, y + 8); ctx.lineTo(x + 17, y - 72); ctx.stroke();
      const sway = Math.sin(time * 1.7 + i) * 8;
      ctx.strokeStyle = "#e7c980"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x - 8, y - 25); ctx.lineTo(x - 8 + sway, y + 12); ctx.moveTo(x + 8, y - 25); ctx.lineTo(x + 8 + sway, y + 12); ctx.stroke();
      ctx.fillStyle = "#a54e35"; ctx.fillRect(x - 15 + sway, y + 10, 30, 7);
    }
    ctx.fillStyle = "#f2dbac"; ctx.font = "9px 'DM Sans', sans-serif"; ctx.textAlign = "center";
    ctx.fillText("THE SWING GARDEN", 225, 830);
  }

  function drawStage(ctx, time) {
    ctx.fillStyle = "#644432"; ctx.fillRect(1590, 105, 190, 96);
    ctx.fillStyle = "#913f39"; ctx.fillRect(1578, 92, 214, 21);
    ctx.fillStyle = "#d4ae69";
    ctx.beginPath(); ctx.arc(1600, 114, 7, Math.PI, 0); ctx.arc(1640, 114, 7, Math.PI, 0); ctx.arc(1680, 114, 7, Math.PI, 0); ctx.arc(1720, 114, 7, Math.PI, 0); ctx.arc(1760, 114, 7, Math.PI, 0); ctx.fill();
    for (let i = 0; i < 3; i++) {
      const x = 1635 + i * 52, jump = Math.abs(Math.sin(time * 3 + i)) * 8;
      ctx.fillStyle = ["#c65f4c", "#d5a64c", "#45765a"][i];
      ctx.beginPath(); ctx.ellipse(x, 164 - jump, 15, 24, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#edc888"; ctx.beginPath(); ctx.arc(x, 136 - jump, 8, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#e4c075"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x - 8, 151 - jump); ctx.lineTo(x - 19, 164 - jump); ctx.moveTo(x + 8, 151 - jump); ctx.lineTo(x + 19, 164 - jump); ctx.stroke();
    }
    ctx.fillStyle = "#f2dbac"; ctx.font = "10px 'DM Sans', sans-serif"; ctx.textAlign = "center";
    ctx.fillText("FOLK DANCE • LIVE", 1685, 219);
  }

  function drawPuppetStage(ctx) {
    ctx.fillStyle = "#803e31"; ctx.fillRect(1612, 830, 196, 74);
    ctx.fillStyle = "#d4a753"; ctx.fillRect(1600, 817, 220, 17);
    ctx.fillStyle = "#f1d69b"; ctx.fillRect(1640, 840, 140, 50);
    ctx.fillStyle = "#7b332d";
    ctx.beginPath(); ctx.arc(1680, 855, 9, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(1740, 855, 9, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#7b332d"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(1680, 864); ctx.lineTo(1680, 883); ctx.moveTo(1740, 864); ctx.lineTo(1740, 883); ctx.stroke();
    ctx.fillStyle = "#f2dbac"; ctx.font = "9px 'DM Sans', sans-serif"; ctx.textAlign = "center";
    ctx.fillText("PUPPET THEATRE", 1710, 925);
  }

  function drawRangoli(ctx, x, y, radius) {
    const colors = ["#e3ac56", "#b94d48", "#e7d19b", "#407b59"];
    ctx.save(); ctx.translate(x, y);
    ctx.fillStyle = "rgba(38, 19, 17, .35)";
    ctx.beginPath(); ctx.arc(0, 0, radius + 7, 0, Math.PI * 2); ctx.fill();
    for (let i = 0; i < 12; i++) {
      ctx.save(); ctx.rotate(i * Math.PI / 6);
      ctx.fillStyle = colors[i % colors.length];
      ctx.beginPath(); ctx.ellipse(0, -radius * .55, radius * .2, radius * .47, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#f3dcaa"; ctx.beginPath(); ctx.arc(0, -radius * .86, 3, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    ctx.fillStyle = "#f5d482"; ctx.beginPath(); ctx.arc(0, 0, radius * .23, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#8a4734"; ctx.beginPath(); ctx.arc(0, 0, radius * .13, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function drawLanterns(ctx) {
    for (let i = 0; i < 9; i++) {
      const x = 440 + i * 140;
      const y = 210 + Math.sin(i * 2.4) * 22;
      ctx.strokeStyle = "rgba(232, 197, 128, .52)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, y - 34); ctx.lineTo(x, y); ctx.stroke();
      ctx.fillStyle = i % 2 ? "#b95840" : "#d4a64d"; ctx.fillRect(x - 9, y, 18, 27);
      ctx.fillStyle = "#ffe5a0"; ctx.shadowBlur = 12; ctx.shadowColor = "#f5c468";
      ctx.beginPath(); ctx.arc(x, y + 13, 4, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function drawGoldenDiyas(ctx, collected, time) {
    goldenDiyas.forEach((diya, index) => {
      if (collected.includes(index)) return;
      ctx.save(); ctx.translate(diya.x, diya.y + Math.sin(time * 3 + index) * 4);
      ctx.shadowBlur = 17; ctx.shadowColor = "#ffd95e";
      ctx.fillStyle = "#ffda64"; ctx.beginPath(); ctx.ellipse(0, 0, 11, 6, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#fff4b1"; ctx.beginPath(); ctx.arc(0, -8, 3, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    });
  }

  window.MelaWorld = { stalls, pointsOfInterest, buildings, goldenDiyas, drawWorld };
})();
