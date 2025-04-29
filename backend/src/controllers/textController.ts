import { Request, Response } from 'express';

// dit zijn voorbeeld teksten voor de typetest
const sampleTexts = [
    "The quick brown fox jumps over the lazy dog.",
    "Programming is the process of creating a set of instructions that tell a computer how to perform a task.",
    "TypeScript is a strongly typed programming language that builds on JavaScript.",
    "Practice makes perfect when it comes to typing speed and accuracy.",
    "The best way to learn programming is by writing code and solving problems.",
    "Clean code is code that is easy to understand and maintain.",
    "Algorithms are step-by-step procedures for solving problems.",
    "Data structures are ways of organizing and storing data in a computer.",
    "Web development involves creating websites and web applications.",
    "React is a JavaScript library for building user interfaces."
];

// deze functie haalt een willekeurige tekst op voor de typetest
export const getRandomText = (req: Request, res: Response) => {
    try {
        // kies een willekeurige tekst uit de voorbeeld teksten
        const randomIndex = Math.floor(Math.random() * sampleTexts.length);
        const randomText = sampleTexts[randomIndex];
        
        res.json({ text: randomText });
    } catch (error) {
        console.error('Error getting random text:', error);
        res.status(500).json({ error: 'Failed to get random text' });
    }
}; 