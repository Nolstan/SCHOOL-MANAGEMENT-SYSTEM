const aiService = require('../services/aiService');
const Student = require('../models/Student');

exports.askTutor = async (req, res) => {
    try {
        const { question } = req.body;
        console.log('AI Tutor Request:', question);
        const systemPrompt = "You are a helpful school tutor. Explain concepts simply for students using clear and encouraging language.";
        const response = await aiService.generateAIResponse(question, systemPrompt);
        console.log('AI Tutor Response received');
        res.json({ response });
    } catch (error) {
        console.error('AI Controller Error (askTutor):', error.message);
        res.status(500).json({ error: error.message });
    }
};

exports.analyzeData = async (req, res) => {
    try {
        const { query } = req.body;
        console.log('AI Data Analysis Request:', query);
        const schemaDescription = `
            MongoDB Collections:
            - Students: { firstName, lastName, classId, parentPhone, gender, feeBalance, attendance: [{date, status}], grades: [{subjectId, score, term, category, comment}] }
            - Users: { username, role }
            - Classes: { name, teacherId, subjectIds }
        `;
        const systemPrompt = `
            You are a data assistant for teachers. 
            Translate the teacher's natural language question into a MongoDB Mongoose query against the Student collection.
            Return ONLY a valid JSON object with the "filter" and "projection" or "aggregation" needed.
            Example: "How many girls failed math?" -> { "aggregation": [{ "$match": { "gender": "F", "grades": { "$elemMatch": { "subject": "Math", "score": { "$lt": 50 } } } } }, { "$count": "total" }] }
            Schema context: ${schemaDescription}
        `;

        const aiQueryResponse = await aiService.generateAIResponse(query, systemPrompt);
        console.log('AI Data Analysis Response received');

        // Safety: In a real app, we'd parse this and execute it safely. 
        // For now, we return the "AI recommendation" or a simplified result.
        res.json({ analysis: aiQueryResponse });
    } catch (error) {
        console.error('AI Controller Error (analyzeData):', error.message);
        res.status(500).json({ error: error.message });
    }
};
