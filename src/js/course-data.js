export const courseData = {
    lessonPlan: ['lesson-01.html', 'lesson-02.html', 'lesson-03.html', 'lesson-04.html'],
    quizData: {
        'lesson-01.html': {
            q1: 'b',
            q2: 'a',
            q3: 'c',
            q4: 'b',
            q5: 'c',
            q6: 'b',
            q7: 'b',
            q8: 'b',
            q9: 'b',
            q10: 'b',
            q11: 'b',
            q12: 'a',
        },
        'lesson-02.html': {
            q1: 'a',
            q2: 'b',
            q3: 'b',
            q4: 'c',
            q5: 'b',
            q6: 'a',
            q7: 'a',
            q8: 'a',
            q9: 'b',
            q10: 'b',
        },
        'lesson-03.html': {
            q1: 'b',
            q2: 'a',
            q3: 'b',
            q4: 'c',
            q5: 'a',
            q6: 'b',
            q7: 'b',
            q8: 'c',
            q9: 'b',
            q10: 'c',
        },
        'lesson-04.html': {
            q1: 'b',
            q2: 'b',
            q3: 'b',
            q4: 'b',
            q5: 'b',
            q6: 'b',
            q7: 'b',
            q8: 'b',
            q9: 'b',
            q10: 'b',
        },
        'practice.html': {
            q1: 'b',
            q2: 'c',
            q3: 'a',
        },
    },
};

export const commonExpressions = {
    greetings: {
        title: '问候与告别 (Greetings & Farewells)',
        expressions: [
            { spanish: 'Hola', english: 'Hello', chinese: '你好' },
            {
                spanish: 'Buenos días',
                english: 'Good morning',
                chinese: '早上好',
            },
            {
                spanish: 'Buenas tardes',
                english: 'Good afternoon',
                chinese: '下午好',
            },
            {
                spanish: 'Buenas noches',
                english: 'Good evening / Good night',
                chinese: '晚上好 / 晚安',
            },
            { spanish: 'Adiós', english: 'Goodbye', chinese: '再见' },
            {
                spanish: 'Hasta luego',
                english: 'See you later',
                chinese: '待会见',
            },
            {
                spanish: 'Hasta mañana',
                english: 'See you tomorrow',
                chinese: '明天见',
            },
        ],
    },
    courtesy: {
        title: '礼貌用语 (Basic Courtesy)',
        expressions: [
            { spanish: 'Por favor', english: 'Please', chinese: '请' },
            { spanish: 'Gracias', english: 'Thank you', chinese: '谢谢' },
            {
                spanish: 'De nada',
                english: "You're welcome",
                chinese: '不客气',
            },
            {
                spanish: 'Perdón / Disculpe',
                english: 'Excuse me / Pardon me',
                chinese: '对不起 / 打扰一下',
            },
            { spanish: 'Lo siento', english: "I'm sorry", chinese: '我很抱歉' },
        ],
    },
    daily_conversation: {
        title: '日常交流 (Daily Conversation)',
        expressions: [
            {
                spanish: '¿Cómo estás?',
                english: 'How are you?',
                chinese: '你好吗？',
            },
            {
                spanish: 'Estoy bien, gracias. ¿Y tú?',
                english: "I'm fine, thank you. And you?",
                chinese: '我很好，谢谢。你呢？',
            },
            {
                spanish: '¿Cómo te llamas?',
                english: 'What is your name?',
                chinese: '你叫什么名字？',
            },
            {
                spanish: 'Me llamo...',
                english: 'My name is...',
                chinese: '我叫...',
            },
            {
                spanish: 'Mucho gusto',
                english: 'Nice to meet you',
                chinese: '很高兴认识你',
            },
        ],
    },
    at_work: {
        title: '工作场景 (At Work)',
        expressions: [
            {
                spanish: 'Necesito ayuda con esto.',
                english: 'I need help with this.',
                chinese: '我需要这方面的帮助。',
            },
            {
                spanish: '¿Puedes enviarme el informe?',
                english: 'Can you send me the report?',
                chinese: '你能把报告发给我吗？',
            },
            {
                spanish: 'La reunión es a las 10 a.m.',
                english: 'The meeting is at 10 a.m.',
                chinese: '会议在上午10点。',
            },
            {
                spanish: 'Voy a tomar un descanso.',
                english: "I'm going to take a break.",
                chinese: '我要休息一下。',
            },
            { spanish: 'Buen trabajo', english: 'Good job', chinese: '干得好' },
            { spanish: '¿Podrías encargarte de esto?', english: 'Could you take care of this?', chinese: '你能负责这件事吗？' },
            { spanish: 'Quedamos en revisarlo mañana.', english: 'We agree to review it tomorrow.', chinese: '我们定在明天复核。' },
        ],
    },
    meetings: {
        title: '会议常用 (Meetings)',
        expressions: [
            { spanish: 'Empezamos si os parece.', english: "Let's begin if that's okay.", chinese: '如果大家没问题，我们开始。' },
            { spanish: 'Vamos a revisar el plan.', english: 'Let’s review the plan.', chinese: '我们来过一下计划。' },
            { spanish: 'Por un lado..., además...', english: 'On one hand..., in addition...', chinese: '一方面…，另外…' },
            { spanish: '¿Alguna duda o comentario?', english: 'Any questions or comments?', chinese: '有问题或意见吗？' },
            { spanish: 'Entonces, quedamos así...', english: 'So, we agree as follows...', chinese: '那么，我们这样定…' },
        ],
    },
    email_signoffs: {
        title: '邮件收尾 (Email Sign-offs)',
        expressions: [
            { spanish: 'Gracias de antemano.', english: 'Thanks in advance.', chinese: '先行致谢。' },
            { spanish: 'Quedo atento/a.', english: 'I remain attentive.', chinese: '静候回复。' },
            { spanish: 'Un saludo.', english: 'Regards.', chinese: '此致问候。' },
            { spanish: 'Saludos cordiales.', english: 'Kind regards.', chinese: '致以诚挚问候。' },
        ],
    },
    work_softeners: {
        title: '职场礼貌与缓和 (Politeness & Softeners)',
        expressions: [
            { spanish: '¿Te parece si…?', english: 'Do you mind if…?', chinese: '你介意…吗？/ 你看可以…吗？' },
            { spanish: '¿Podrías…?', english: 'Could you…?', chinese: '你能…吗？（更礼貌）' },
            { spanish: '¿Sería posible…?', english: 'Would it be possible…?', chinese: '有可能…吗？' },
            { spanish: 'Cuando puedas, …', english: 'When you can, …', chinese: '方便的时候，请…' },
            { spanish: 'Me gustaría…', english: 'I would like…', chinese: '我想…（委婉）' },
            { spanish: 'Quedo atento/a.', english: 'I remain attentive.', chinese: '静候回复。' },
            { spanish: 'Gracias de antemano.', english: 'Thanks in advance.', chinese: '先行致谢。' },
        ],
    },
    spainisms: {
        title: '西班牙本土常用 (Spainisms)',
        expressions: [
            { spanish: 'ordenador', english: 'computer (Spain)', chinese: '电脑（西班牙用法，拉美常用 computador）' },
            { spanish: 'vale', english: 'okay/sure', chinese: '好的/行（口语高频）' },
            { spanish: 'coger', english: 'to take/pick up (neutral in Spain)', chinese: '拿/搭乘（西班牙中性，部分拉美地区有粗俗含义）' },
            { spanish: 'móvil', english: 'mobile phone (Spain)', chinese: '手机（西班牙用法，拉美常用 celular）' },
        ],
    },
};
