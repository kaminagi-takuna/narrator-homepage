const mammoth = require("mammoth");
const fs = require("fs");

const filePath = "C:\\Users\\grste\\.gemini\\antigravity\\scratch\\homepage\\question\\beginners\\共鳴の基本問題と解説ボス編.docx";

mammoth.extractRawText({path: filePath})
    .then(function(result){
        const text = result.value;
        console.log("--- BOSS TEXT ---");
        console.log(text);
        console.log("--- END BOSS ---");
    })
    .catch(function(err){
        console.error(err);
    });
