import { state } from './state.js';

// ==================== 等级配置 ====================
export const LEVEL_CFG = {
    A1: {
        vocab: '只提取最基础的高频生活词汇（CECR A1），避免复杂词汇',
        chunkType: '单个高频词或最简单固定搭配（如 il y a, c\'est, avoir + nom）',
        chunkRule: '词块必须是原形框架：✅ "se lever" ❌ "se lève"；✅ "prendre le bus" ❌ "prend le bus"',
        thematic: '提取5-7个理解文章必须掌握的核心名词和动词，避免过于复杂的词汇',
        exercise: '写作20-30字，只用现在时，句子极短',
        feedback: '以鼓励为主，只指出1-2个关键错误，语气温和',
        writingGuide: `先想想这个场景——\n\n你今天做了什么？去了哪里？和谁在一起？\n不用想复杂的，就像发朋友圈一样说出来👇\n\n开头：说你做了什么、在哪里\n→ J'ai + [动词] + à/au + [地点]\n\n中间：说和谁一起、什么感觉\n→ avec + [人] / C'était + [形容词]\n\n结尾：你喜欢吗？\n→ J'aime / Je n'aime pas + [这件事]`
    },
    A2: {
        vocab: '提取日常交流实用词汇（CECR A2），包含动词短语和固定搭配',
        chunkType: '动词框架和日常搭配（如 avoir besoin de + inf., être en train de + inf.）',
        chunkRule: '词块必须是动词原形框架，不能截取变位片段。✅ "durer + durée" ❌ "dure environ"',
        thematic: '提取5-7个日常生活主题的核心词汇，包含名词和常用动词',
        exercise: '写作30-50字，可用过去时和将来时',
        feedback: '鼓励为主，指出2-3个错误，重点解释语法规则',
        writingGuide: `先停下来想想你自己的经历——\n\n题目说的这件事，你有没有类似的体验？\n想一个具体的场景，哪怕很小、很日常都可以。\n\n第一句：发生了什么？什么时候？\n→ Un jour / La semaine dernière + [动词过去时]\n\n第二句：你感觉怎么样？\n→ J'ai trouvé ça + [形容词] / C'était vraiment + [形容词]\n\n第三句：你以后会怎么做？\n→ La prochaine fois, je vais + [动词原形]\n\n💡 试着用上今天学的词块！`
    },
    B1: {
        vocab: '提取中级表达词汇（CECR B1），包含常用词块和搭配',
        chunkType: '实用句式框架（如 il est important de + inf., en ce qui concerne + nom）',
        chunkRule: '词块必须是可迁移的句式框架，用占位符（+ inf. / + nom）标注可替换部分',
        thematic: '提取5-8个理解文章核心议题所必需的词汇，包含名词、动词和形容词',
        exercise: '写作50-80字，要求逻辑连贯',
        feedback: '平衡鼓励和纠错，指出3-4个问题，要求改写错误句子',
        writingGuide: `先停下来想想你自己——\n\n题目里说的这个现象，你身边有没有？\n你自己有没有类似的经历或者感受？\n\n然后一步一步想：\n\n① 这个现象是什么？（描述现象）\n② 为什么会这样？（找原因，至少想两个）\n③ 这样下去会怎样？（说后果）\n④ 你怎么看？（表达立场）\n\n别急着写，先在脑子里把这四步想清楚。\n\n💡 记得用上今天学的词块，写完检查一遍！`
    },
    B2: {
        vocab: '提取高频学术/论述词汇（CECR B2），重点词块和搭配',
        chunkType: '论述框架（如 par conséquent, il convient de + inf., dans la mesure où + prop.）',
        chunkRule: '词块必须是论述写作中可直接套用的表达框架，标注句法结构',
        thematic: '提取5-8个理解文章论点所必需的学术词汇和专业术语',
        exercise: '写作80-120字，要求有论点和论据',
        feedback: '严格指出所有错误，要求文体一致性',
        writingGuide: `【先读，再动笔】\n\n第一步：确定你的立场\n→ 你支持哪一方？为什么？\n→ 对立的一方有什么道理？你怎么反驳？\n\n第二步：找两个有力的论据\n→ 每个论据要能回答：为什么？\n→ 最好能举一个具体例子\n\n第三步：论证结构\nThèse：你的核心观点\nArgument 1 + exemple\nArgument 2 + exemple\nNuance：承认对立方的合理性\nConclusion：坚持你的立场\n\n💡 今天学的词块在论证时可以直接套用！`
    },
    C1: {
        vocab: '提取高级表达和复杂结构（CECR C1），重点论述语块',
        chunkType: '高级论述语块（如 force est de constater que, il n\'en demeure pas moins que）',
        chunkRule: '词块必须体现C1级别语言精确性，标注使用语境（正式/书面）',
        thematic: '提取5-8个体现文章论证深度的高级词汇，包含抽象名词和高级形容词',
        exercise: '写作120-180字，要求论证严密有层次',
        feedback: '按DALF C1标准严格批改，重点评估论点发展和语言精确性',
        writingGuide: `【构建你的论证体系】\n\n在动笔前，先想清楚这三个问题：\n\n① 这个话题的核心争议是什么？\n   不是表面现象，而是背后的价值冲突\n\n② 你能想到哪些反驳你的论点？\n   强的论文需要主动承认并回应对方最强的论据\n\n③ 你的论点有没有边界条件？\n   在什么情况下你的论点成立？\n\n结构：Problématique → Thèse → Antithèse → Synthèse\n\n💡 用今天的词块体现语言精确性，这是C1评分的核心！`
    },
    C2: {
        vocab: '提取接近母语水平的高级表达（CECR C2），包含修辞和文体变化',
        chunkType: '修辞表达和文体语块（如 loin s\'en faut, nonobstant + nom）',
        chunkRule: '词块必须体现母语者自然表达，包含文体标注（书面正式/非正式用语）',
        thematic: '提取5-8个体现文章文体特色的词汇，包含修辞手法和文体标记词',
        exercise: '写作180-250字，文体风格统一且精准',
        feedback: '按母语水平标准批改，重点评估文体、修辞和语言优雅度',
        writingGuide: `【C2写作：超越论证，追求文体】\n\n① 文体一致性\n   你的语气是否从头到尾保持一致？\n\n② 论证的辩证深度\n   你有没有挑战自己最初的假设？\n\n③ 语言的精确与优雅\n   每个词是否都是最准确的选择？\n\n④ 修辞手法\n   是否适当使用了对比、类比、排比？\n\n💡 今天的词块体现了母语者的表达偏好，融入自然才是真正的C2。`
    }
};

// ==================== 禁用词列表 ====================
export const BANNED_WORDS = {
    // A1-B2：仅用于激励提示，不强制
    A1: [],
    A2: [],
    B1: [],
    B2: ['good', 'bad', 'bien', 'bon', 'mauvais', 'beaucoup', 'très',
         'penser', 'croire', 'les gens', 'les personnes', 'chose', 'truc',
         'faire', 'mettre', 'dire', 'voir', 'montrer', 'important', 'problème'],
    C1: ['good', 'bad', 'bien', 'bon', 'mauvais', 'beaucoup', 'très',
         'penser', 'croire', 'les gens', 'chose', 'truc',
         'faire', 'mettre', 'dire', 'voir', 'montrer',
         'important', 'problème', 'normal', 'utiliser', 'permettre',
         'montrer', 'expliquer', 'dire que', 'il y a'],
    C2: ['good', 'bad', 'bien', 'bon', 'mauvais', 'beaucoup', 'très',
         'penser', 'croire', 'les gens', 'chose', 'truc',
         'faire', 'mettre', 'dire', 'voir', 'montrer',
         'important', 'problème', 'normal', 'utiliser', 'permettre',
         'expliquer', 'dire que', 'il y a', 'avoir', 'être important',
         'tout le monde', 'on peut', 'on doit'],
};

// ==================== Scaffolding Prompt ====================
export function getScaffoldingPrompt(level, articleText, writingTopic, chunks) {
    const lv = level || 'B1';
    const chunkList = chunks.map(c => c.word).join(', ');
    const needsSearch = ['B2','C1','C2'].includes(lv);
    const banned = BANNED_WORDS[lv] || [];
    const bannedStr = banned.length > 0 ? `\n⚠️ Mots à éviter : ${banned.join(', ')}` : '';

    const levelInstructions = {
        A1: `Tu es un professeur de français bienveillant pour débutants absolus (A1).

L'article parle de : "${articleText.substring(0, 200)}..."
Sujet d'écriture : "${writingTopic}"
Expressions apprises : ${chunkList}

Génère un guide de réflexion en CHINOIS (中文) avec quelques exemples en français.

Format de sortie :
📝 [Titre court lié au sujet de l'article en chinois]

先想想你自己——
[2-3个引导学生联系自身经历的中文问题，要非常具体和日常]

现在用法语说：

第一步：[具体问题]
→ [句式框架，动词用原形]

第二步：[具体问题]
→ [句式框架]

第三步：[具体问题]
→ [句式框架]

💡 今天学的词块可以帮你：${chunkList}`,

        A2: `Tu es un professeur de français pour niveau A2.

L'article parle de : "${articleText.substring(0, 200)}..."
Sujet d'écriture : "${writingTopic}"
Expressions apprises : ${chunkList}

Génère un guide en CHINOIS avec exemples en français.

Format :
📝 [Titre lié au sujet]

先停下来想想你自己——
[2-3个引导学生回忆具体经历的问题，要有画面感]

现在用法语写一小段：

第一步：[描述现状/发生了什么]
→ [句式框架，过去时/现在时]

第二步：[说说感受或原因]
→ [句式框架]

第三步：[给出简单看法]
→ [句式框架]

💡 今天学的词块：${chunkList}`,

        B1: `Tu es un professeur de français pour niveau B1.

L'article parle de : "${articleText.substring(0, 300)}..."
Sujet d'écriture : "${writingTopic}"
Expressions apprises : ${chunkList}

Génère un guide en CHINOIS avec structure AEC et exemples en français.
AEC = Argument（论点）- Explication（解释）- Conséquence（后果）

Format :
📝 [Titre lié au sujet]

先停下来想想你自己——
[2-3个追问式问题，引导学生深挖：为什么？有没有例子？]

然后用AEC结构组织你的答案：

A — Argument（你的论点）
先表明立场：
→ Je pense que / À mon avis, [ta position]
追问自己：我为什么这样认为？

E — Explication（解释为什么）
给出具体原因，越具体越好：
→ En effet, + [ton explication]
→ Par exemple, + [exemple concret]
追问自己：[针对文章主题的具体追问]

C — Conséquence（带来什么结果）
如果这样下去，会发生什么？
→ Ainsi, / Par conséquent, + [résultat]
追问自己：[针对文章主题的后果追问]

💡 今天学的词块在AEC每个环节都能用：${chunkList}`,

        B2: `Tu es un professeur de français expert pour niveau B2.

L'article : "${articleText.substring(0, 400)}..."
Sujet : "${writingTopic}"
Expressions apprises : ${chunkList}
${needsSearch ? '(Des exemples concrets et actualités ont été recherchés et sont inclus ci-dessous)' : ''}

Génère un guide de réflexion BILINGUE (chinois + français).
Structure AEC obligatoire avec DEUX arguments développés.

Format :
📝 [Titre]

【构建你的论证前，先想清楚】

① [针对文章主题的核心争议问题，中文]
② [反方最强论据是什么？如何回应，中文]
③ [现实执行中的困难，中文]

【用AEC结构写两个论点】

论点一：
A — [你的主张，中文提示]
→ [句式框架，法文]
E — [解释+具体例子，中文提示]
→ [句式框架，法文]
C — [后果，中文提示]
→ [句式框架，法文]

论点二：
A / E / C — [同上格式]

最后加一句Nuance（承认对方合理性）：
→ Il convient toutefois de noter que...
→ Certes..., mais...
${bannedStr}
💡 Expressions à mobiliser : ${chunkList}`,

        C1: `Tu es un professeur de français expert pour niveau C1/DALF.

Article : "${articleText.substring(0, 500)}..."
Sujet : "${writingTopic}"
Expressions apprises : ${chunkList}
${needsSearch ? '(Actualités et données recherchées incluses)' : ''}

Génère un guide ENTIÈREMENT EN FRANÇAIS avec structure AEC approfondie.
Niveau de langue : C1, registre soutenu.

Format :
📝 [Titre]

【Avant de rédiger — déconstruire le sujet】

① [Question sur la tension profonde du débat]
② [Meilleur argument adverse et comment y répondre]
③ [Limite ou paradoxe à exploiter]

【Actualités et données à mobiliser】
• [Événement 1 lié au sujet avec source si possible]
• [Données ou étude pertinente]
• [Cas concret français ou international]

【Structure AEC approfondie — deux arguments】

Argument 1 :
A : [Affirmation principale]
E : [Explication nuancée + exemple concret]
C : [Conséquence à long terme, pas superficielle]

Argument 2 (nuance ou antithèse) :
A / E / C : [même format]

Synthèse dialectique :
→ Il ne s'agit pas de choisir entre X et Y, mais de repenser Z.
→ [Formulation de synthèse]
${bannedStr}
💡 Expressions à mobiliser : ${chunkList}`,

        C2: `Tu es un professeur de français de niveau universitaire pour C2.

Article : "${articleText.substring(0, 500)}..."
Sujet : "${writingTopic}"
Expressions apprises : ${chunkList}
${needsSearch ? '(Références académiques et actualités incluses)' : ''}

Génère un guide ENTIÈREMENT EN FRANÇAIS, registre académique.

Format :
📝 [Titre]

【Déconstruction du sujet】

① [Tension conceptuelle fondamentale — pas juste le fait, mais le paradoxe]
② [Présupposés à remettre en question]
③ [Angle original qui permettrait de dépasser le débat]

【Références à mobiliser】
• [Référence académique ou philosophique pertinente]
• [Actualité récente avec source]
• [Données empiriques ou étude]

【Architecture argumentative】

Thèse :
A : [Proposition principale — formulée de manière précise et originale]
E : [Développement avec nuance interne]
C : [Conséquence systémique, pas anecdotique]

Antithèse :
A / E / C : [La position adverse la plus solide]

Synthèse :
→ [Dépassement dialectique — ni l'un ni l'autre, mais une troisième voie]

Exigences stylistiques :
→ Aucun mot du registre familier ou courant
→ Chaque phrase doit être irremplaçable
→ La conclusion doit ouvrir, pas fermer
${bannedStr}
💡 Expressions de référence : ${chunkList}`
    };

    return levelInstructions[lv] || levelInstructions['B1'];
}
    const lv = state.userLevel || 'B1';
    const c = LEVEL_CFG[lv] || LEVEL_CFG.B1;

    const vocabPrompt = `你是专业的DELF/DALF法语教师，帮助${lv}水平学生积累写作词块。

核心任务：从文章提取7-10个最值得学习的可迁移词块/语块。

等级要求（${lv}）：
- 词汇范围：${c.vocab}
- 词块类型：${c.chunkType}
- 词块规范：${c.chunkRule}

【词块原形的严格规则】
词块必须以"可直接教给学生背诵的原形框架"呈现，绝不能从原文截取已变位的片段。

✅ 正确示例：
- "devoir + être + participe passé"（原形框架，学生可套用任何主语）
- "discuter + de + nom"（动词原形 + 介词结构）
- "c'est pourquoi + proposition"（连接词框架）
- "il convient de + inf."（句式框架）

❌ 错误示例：
- "doivent être discutées"（已变位，且限定了阴性复数，不可迁移）
- "c'est pourquoi les modalités doivent"（照抄原文句子片段）
- "est très bonne"（无法独立使用的碎片）

判断标准：把这个词块单独给学生看，学生能否在任何新话题中套用它？如果不能，就不是合格的词块。

输出格式：先输出Markdown展示，最后输出JSON。

## 📚 可迁移词块（${lv}）

### 1. [词块原形框架，如：discuter de + nom]
**中文释义**：[翻译]
**原文语境**：[原文完整句子]
**用法框架**：[动词原形 + 占位说明，如：discuter de + nom / devoir + inf.]
**写作示例**：[用原形框架造一个全新例句，绝不照抄原文]
**近义表达**：[1-2个同级替换，也要用原形]

---

（重复7-10个，每个用 --- 分隔）

\`\`\`json
[
  {"word":"词块原形框架（如：discuter de + nom）","meaning":"中文释义","example":"写作示例句","type":"词块类型"},
  ...
]
\`\`\``;

    const thematicPrompt = `你是专业的DELF/DALF法语教师，帮助${lv}水平学生理解文章的主题词汇。

核心任务：从文章提取5-8个理解文章必须掌握的主题词块（不是可迁移词块，而是与文章主题直接相关的核心词汇）。

等级要求（${lv}）：${c.thematic}

输出格式：先输出Markdown展示，最后输出JSON。

## 🗺️ 主题词块（${lv}）

### 1. [词] (词性)
**中文释义**：[翻译]
**原文例句**：[原文中包含该词的完整句子]
**其他写作例句**：[用该词写一个新语境的完整句子，不能照抄原文]

---

（重复5-8个）

\`\`\`json
[
  {"word":"主题词","meaning":"中文释义","pos":"词性","original":"原文例句","other":"其他写作例句"},
  ...
]
\`\`\``;

    const clozePrompt = `你是专业的DELF/DALF法语教师，为${lv}水平学生设计词块巩固练习。

等级要求：${c.exercise}

重要规则：
1. 只输出题目，绝对不输出参考答案，答案只在JSON里提供
2. 填空用___标注，一道题可以有1-2个空格
3. 写作题只给题目，不给示例答案

输出格式：先输出Markdown题目，最后输出JSON。

## ✍️ 词块巩固练习（${lv}）

### 练习一：词块填空
根据上下文和提示，填入正确的词块（注意变位）：

1. [句子___续]（提示：[词块框架]）
2. [句子___续___续]（提示：[词块框架1] / [词块框架2]）
3. [句子___续]（提示：[词块框架]）
4. [句子___续]（提示：[词块框架]）
5. [句子___续]（提示：[词块框架]）

### 练习二：句子改写
用括号中的词块框架改写句子，保持意思不变：

1. 原句：[简单表达]
   改写（使用 [词块框架]）：______

2. 原句：[简单表达]
   改写（使用 [词块框架]）：______

### 练习三：写作输出（${c.exercise.split('，').find(s=>s.includes('字'))||'50-100字'}）
[写作题目，要求使用至少3个本次学习的词块]

\`\`\`json
{
  "fill_in": [
    {"id":1,"sentence":"完整句子，空格处用___标注","answers":["答案1"],"hints":["提示"]},
    {"id":2,"sentence":"句子___续___续","answers":["答案1","答案2"],"hints":["提示1","提示2"]},
    {"id":3,"sentence":"...","answers":["答案"],"hints":["提示"]},
    {"id":4,"sentence":"...","answers":["答案"],"hints":["提示"]},
    {"id":5,"sentence":"...","answers":["答案"],"hints":["提示"]}
  ],
  "writing_topic": "写作题目完整文字"
}
\`\`\``;

    const feedbackPrompt = `你是专业的DELF/DALF法语教师，批改${lv}水平学生的写作练习。

批改标准（${lv}）：${c.feedback}

特别关注：检查学生是否正确使用词块框架（变位是否准确、搭配是否正确）。

## ✅ 词块运用亮点
- [具体指出正确使用的词块，引用原句]

## 🔧 需要改进
### 问题 1
**你写的**：[原句]
**建议改为**：[修改后]
**原因**：[简短解释，重点说明词块用法]

## 💡 词块使用总结
[评价对本次词块的整体掌握，给出下一步建议]

## 📊 本次评分
- 词块运用：[X]/5
- 语法准确：[X]/5
- 内容表达：[X]/5

**总评**：[${c.feedback.includes('鼓励')?'温和鼓励性':'专业客观'}的总结]`;

    const reportPrompt = `你是专业的DELF/DALF法语教师，分析填空练习的答题情况。

用简短一句话解释每道题：答对的解释为什么正确，答错的解释错误原因和正确答案的用法。

输出JSON：
\`\`\`json
[
  {"id":1,"status":"correct|wrong|revealed","user_answer":"学生答案","correct_answer":"正确答案","explanation":"一句话解释"},
  ...
]
\`\`\``;

    return { vocab: vocabPrompt, thematic: thematicPrompt, cloze: clozePrompt, feedback: feedbackPrompt, report: reportPrompt };
}
