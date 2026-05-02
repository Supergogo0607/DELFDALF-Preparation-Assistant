// ==================== 配置 ====================
export const CONFIG = {
    WORKER_URL: 'https://delfdalfassistant.yifan6760.workers.dev',
    INVITE_CODE: 'DELFDALF2026',
    MAX_USES: 5,
    SUPABASE_URL: '',
    SUPABASE_ANON_KEY: '',
};

// ==================== 翻译 ====================
export const T = {
    zh: {
        appTitle: 'DELF DALF 备考助手',
        selectMode: '选择学习模式',
        learningMode: '学习模式',
        learningDesc: '从文章中学习词块，完成练习和写作输出',
        reviewMode: '复习模式',
        reviewDesc: '复习已学词块，遗忘曲线智能推送',
        importMode: '导入复习',
        importDesc: '手动导入词块进行复习',

        // 关卡名称
        stage1: '可迁移词块',
        stage2: '主题词块',
        stage3: '词块填空',
        stage4: '思维导图',
        stage5: '写作输出',
        stage1Full: '阶段一：可迁移词块学习',
        stage2Full: '阶段二：主题词块学习',
        stage3Full: '阶段三：词块填空练习',
        stage4Full: '阶段四：思维导图填空',
        stage5Full: '阶段五：写作输出',

        // 关卡状态
        stageDone: '已完成',
        stageActive: '进行中',
        stageLocked: '待解锁',
        stageContinue: '继续 →',
        stageReview: '复习',
        stageComingSoon: '即将开放',

        // 通用
        back: '返回',
        start: '开始学习',
        next: '下一关',
        submit: '提交答案',
        finish: '完成',
        selectLevel: '选择你的法语等级',
        inputArticle: '粘贴文章或听力转录内容',
        wordCount: '字数',
        estimatedTime: '预计学习时间',
        minutes: '分钟',

        levelDesc: {
            A1: '入门级 - 基础词汇和简单句型',
            A2: '基础级 - 日常对话能力',
            B1: '进阶级 - 独立运用语言',
            B2: '高阶级 - 流利表达观点',
            C1: '精通级 - 高级词汇和复杂结构',
            C2: '母语级 - 接近母语水平',
        },

        todayReview: '今日待复习',
        words: '个词块',
        startReview: '开始复习',
        proficient: '熟练',
        hesitant: '犹豫',
        forgotten: '忘记',
        typeWord: '请输入这个词块',
        importFormat: '格式',
        importExample: '例如',
        importBtn: '导入',

        generating: '正在分析文章，提取词块...',
        generatingThematic: '正在提取主题词块...',
        generatingExercise: '正在生成练习题...',
        generatingReport: '正在生成精批报告...',

        success: '成功',
        error: '错误',
        saved: '已保存',
        noInput: '请输入文章内容',
        noDueReviews: '暂无待复习内容',
        allDone: '今日复习已完成',
        downloadPdf: '下载PDF',
        saveRecord: '保存记录',
        recordSaved: '记录已保存',
        pdfGenerating: '生成PDF...',
        chunksAdded: '个词块已加入复习库',
        resumeTitle: '发现未完成的学习',

        checkAnswers: '查看精批报告',
        writingGuideBtn: '💡 没有思路？点击展开引导',
        writingGuideClose: '收起引导',

        scoreGood: '答对 {n} 题，很棒！👇',
        scoreOk: '答对 {n} 题，继续加油！👇',
        scorePoor: '答对 {n} 题，没关系！看看精批分析 👇',
        reportTitle: '📊 填空精批报告',
        submitWriting: '提交写作',

        completionTitle: '🎉 本次学习完成！',
        completionSub: '所有词块已加入复习库',
        goReview: '去复习模式练习',
        backHome: '返回首页',

        thematicTitle: '主题词块',
        thematicOriginal: '原文例句',
        thematicOther: '其他写作例句',

        usedUp: '内测次数已用完，感谢参与！',
        tooLong: '文章请控制在800字以内',
    },

    en: {
        appTitle: 'DELF DALF Assistant',
        selectMode: 'Select Mode',
        learningMode: 'Learning',
        learningDesc: 'Learn chunks from articles, practise and write',
        reviewMode: 'Review',
        reviewDesc: 'Review learned chunks with spaced repetition',
        importMode: 'Import',
        importDesc: 'Import custom chunks for review',

        stage1: 'Chunks', stage2: 'Thematic', stage3: 'Fill-in',
        stage4: 'Mind Map', stage5: 'Writing',
        stage1Full: 'Stage 1: Transferable Chunks',
        stage2Full: 'Stage 2: Thematic Vocabulary',
        stage3Full: 'Stage 3: Fill-in Exercises',
        stage4Full: 'Stage 4: Mind Map',
        stage5Full: 'Stage 5: Writing Output',

        stageDone: 'Done', stageActive: 'In progress', stageLocked: 'Locked',
        stageContinue: 'Continue →', stageReview: 'Review', stageComingSoon: 'Coming soon',

        back: 'Back', start: 'Start', next: 'Next stage', submit: 'Submit', finish: 'Finish',
        selectLevel: 'Select Your Level', inputArticle: 'Paste article or transcript',
        wordCount: 'Words', estimatedTime: 'Est. Time', minutes: 'mins',

        levelDesc: {
            A1: 'Beginner', A2: 'Elementary', B1: 'Intermediate',
            B2: 'Upper-Intermediate', C1: 'Advanced', C2: 'Proficient',
        },

        todayReview: 'Due Today', words: 'chunks', startReview: 'Start Review',
        proficient: 'Proficient', hesitant: 'Hesitant', forgotten: 'Forgotten',
        typeWord: 'Type the chunk', importFormat: 'Format', importExample: 'Example', importBtn: 'Import',

        generating: 'Analysing article...', generatingThematic: 'Extracting thematic vocabulary...',
        generatingExercise: 'Generating exercises...', generatingReport: 'Generating report...',

        success: 'Success', error: 'Error', saved: 'Saved',
        noInput: 'Please input text', noDueReviews: 'No reviews due', allDone: 'All done for today',
        downloadPdf: 'Download PDF', saveRecord: 'Save', recordSaved: 'Saved', pdfGenerating: 'Generating PDF...',
        chunksAdded: 'chunks added to review', resumeTitle: 'Unfinished session found',

        checkAnswers: 'View Report', writingGuideBtn: '💡 Need help? Click for guidance',
        writingGuideClose: 'Hide guidance',
        scoreGood: '{n} correct, excellent! 👇', scoreOk: '{n} correct, keep going! 👇',
        scorePoor: '{n} correct — check the report below 👇',
        reportTitle: '📊 Fill-in Report', submitWriting: 'Submit Writing',

        completionTitle: '🎉 Session complete!', completionSub: 'All chunks added to your review deck',
        goReview: 'Go to Review mode', backHome: 'Back to home',

        thematicTitle: 'Thematic vocabulary', thematicOriginal: 'Original sentence',
        thematicOther: 'Writing example',

        usedUp: 'Beta limit reached — thank you!', tooLong: 'Please keep article under 800 words',
    },

    fr: {
        appTitle: 'DELF DALF Assistant',
        selectMode: 'Choisissez le mode',
        learningMode: 'Apprentissage',
        learningDesc: 'Apprendre des expressions à partir d\'articles',
        reviewMode: 'Révision',
        reviewDesc: 'Réviser les expressions avec la courbe d\'oubli',
        importMode: 'Importer',
        importDesc: 'Importer des expressions personnalisées',

        stage1: 'Expressions', stage2: 'Thématique', stage3: 'Complétion',
        stage4: 'Carte mentale', stage5: 'Rédaction',
        stage1Full: 'Étape 1 : Expressions transférables',
        stage2Full: 'Étape 2 : Vocabulaire thématique',
        stage3Full: 'Étape 3 : Exercices de complétion',
        stage4Full: 'Étape 4 : Carte mentale',
        stage5Full: 'Étape 5 : Production écrite',

        stageDone: 'Terminé', stageActive: 'En cours', stageLocked: 'Verrouillé',
        stageContinue: 'Continuer →', stageReview: 'Revoir', stageComingSoon: 'Bientôt disponible',

        back: 'Retour', start: 'Commencer', next: 'Étape suivante', submit: 'Soumettre', finish: 'Terminer',
        selectLevel: 'Sélectionnez votre niveau', inputArticle: 'Collez l\'article ici',
        wordCount: 'Mots', estimatedTime: 'Temps estimé', minutes: 'min',

        levelDesc: {
            A1: 'Débutant', A2: 'Élémentaire', B1: 'Intermédiaire',
            B2: 'Intermédiaire sup.', C1: 'Avancé', C2: 'Maîtrise',
        },

        todayReview: 'À réviser', words: 'expressions', startReview: 'Commencer',
        proficient: 'Maîtrisé', hesitant: 'Hésitant', forgotten: 'Oublié',
        typeWord: 'Saisissez l\'expression', importFormat: 'Format', importExample: 'Exemple', importBtn: 'Importer',

        generating: 'Analyse de l\'article...', generatingThematic: 'Extraction du vocabulaire...',
        generatingExercise: 'Génération des exercices...', generatingReport: 'Génération du rapport...',

        success: 'Succès', error: 'Erreur', saved: 'Sauvegardé',
        noInput: 'Veuillez saisir le texte', noDueReviews: 'Aucune révision due', allDone: 'Révisions terminées',
        downloadPdf: 'Télécharger PDF', saveRecord: 'Sauvegarder', recordSaved: 'Sauvegardé', pdfGenerating: 'Génération...',
        chunksAdded: 'expressions ajoutées', resumeTitle: 'Session non terminée',

        checkAnswers: 'Voir le rapport', writingGuideBtn: '💡 Besoin d\'aide ? Cliquez',
        writingGuideClose: 'Masquer',
        scoreGood: '{n} correctes, excellent ! 👇', scoreOk: '{n} correctes, continuez ! 👇',
        scorePoor: '{n} correctes — consultez le rapport 👇',
        reportTitle: '📊 Rapport', submitWriting: 'Soumettre',

        completionTitle: '🎉 Session terminée !', completionSub: 'Toutes les expressions ajoutées',
        goReview: 'Aller en révision', backHome: 'Accueil',

        thematicTitle: 'Vocabulaire thématique', thematicOriginal: 'Phrase originale',
        thematicOther: 'Exemple de rédaction',

        usedUp: 'Limite bêta atteinte — merci !', tooLong: 'Article : 800 mots maximum',
    },
};
