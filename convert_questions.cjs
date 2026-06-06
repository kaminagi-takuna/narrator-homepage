const mammoth = require("mammoth");
const fs = require("fs");
const path = require("path");

const questionDir = "C:\\Users\\grste\\.gemini\\antigravity\\scratch\\homepage\\question\\beginners";
const outputFile = "c:\\Users\\grste\\.gemini\\antigravity\\scratch\\homepage\\src\\data\\questions.json";

const dummyPool = ["ビブラート", "閉鎖", "共鳴腔", "軟口蓋", "腹式呼吸", "地声", "裏声", "滑舌", "呼気圧", "倍音", "アンザッツ", "喉頭蓋", "エッジボイス", "ミックスボイス", "フォルマント", "鼻腔", "口腔", "咽頭腔", "横隔膜", "チェストボイス", "ヘッドボイス", "軟口蓋音"];

async function parseDocx(filePath) {
    const result = await mammoth.extractRawText({path: filePath});
    const text = result.value;
    const questions = [];
    
    const lines = text.split(/\r?\n/);
    let currentQ = null;

    for (let line of lines) {
        line = line.trim();
        if (line.startsWith("問題:")) {
            currentQ = { question: line.replace("問題:", "").trim() };
        } else if (line.startsWith("解答:") && currentQ) {
            currentQ.answer = line.replace("解答:", "").trim();
        } else if (line.startsWith("解説:") && currentQ) {
            // 解説から「（XX文字）」という文字列を削除
            let explanation = line.replace("解説:", "").trim();
            explanation = explanation.replace(/（\d+文字）/g, "").trim();
            currentQ.explanation = explanation;
            
            let options = [currentQ.answer];
            const filteredDummy = dummyPool.filter(d => d !== currentQ.answer);
            while (options.length < 4) {
              const randomDummy = filteredDummy[Math.floor(Math.random() * filteredDummy.length)];
              if (!options.includes(randomDummy)) options.push(randomDummy);
            }
            currentQ.options = options.sort(() => 0.5 - Math.random());

            questions.push(currentQ);
            currentQ = null;
        }
    }
    return questions;
}

async function main() {
    const files = fs.readdirSync(questionDir).filter(f => f.endsWith(".docx"));
    const allData = {
        beginner: [],
        boss: []
    };

    for (const file of files) {
        const qs = await parseDocx(path.join(questionDir, file));
        if (file.includes("ボス")) {
            allData.boss.push(...qs);
        } else {
            allData.beginner.push(...qs);
        }
    }

    if (!fs.existsSync(path.dirname(outputFile))) {
        fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    }
    fs.writeFileSync(outputFile, JSON.stringify(allData, null, 2), "utf-8");
    console.log(`Success: Cleaned data and generated JSON.`);
}

main().catch(console.error);
