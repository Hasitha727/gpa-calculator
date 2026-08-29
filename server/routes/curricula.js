const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// DEFAULT SEED DATA FOR DB INITS
const DEFAULT_CURRICULA_SEED = [
  {
    id: 'curr_itm_hons',
    title: 'BScHons in Information Technology & Management',
    institution: 'Faculty of Information Technology',
    semestersCount: 7,
    totalCredits: 135,
    isPrebuilt: true,
    gradeScale: JSON.stringify({
      'A+': 4.0, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D': 1.0, 'F': 0.0, 'I': 0.0
    }),
    classifications: JSON.stringify([
      { name: 'First Class', minGPA: 3.70 },
      { name: 'Second Upper', minGPA: 3.30 },
      { name: 'Second Lower', minGPA: 3.00 },
      { name: 'Pass', minGPA: 2.00 }
    ]),
    structure: JSON.stringify({
      s1: { label: 'Semester 1', year: 'Year 1', mods: [
        { c: 'IN 1120', n: 'Structured Programming I', cr: 2.5, type: 'compulsory' },
        { c: 'IN 1301', n: 'Digital Systems and Digital Computers', cr: 3.0, type: 'compulsory' },
        { c: 'IN 1601', n: 'Multimedia Technologies and Web Design', cr: 3.0, type: 'compulsory' },
        { c: 'IS 1101', n: 'Principles of Management', cr: 2.5, type: 'compulsory' },
        { c: 'CM 1121', n: 'Essentials of Mathematics', cr: 2.5, type: 'compulsory' },
        { c: 'IS 1011', n: 'English', cr: 3.0, type: 'ngpa' }
      ]},
      s2: { label: 'Semester 2', year: 'Year 1', mods: [
        { c: 'IN 1130', n: 'Structured Programming II', cr: 2.5, type: 'compulsory' },
        { c: 'IN 1401', n: 'Fundamentals of Databases', cr: 2.5, type: 'compulsory' },
        { c: 'IS 1110', n: 'Business Foundation', cr: 2.5, type: 'compulsory' },
        { c: 'IS 1910', n: 'Industry Reconnaissance and Engagement', cr: 2.0, type: 'compulsory' },
        { c: 'CM 1131', n: 'Elements of Probability and Statistics', cr: 2.5, type: 'compulsory' },
        { c: 'IS 1901', n: 'Microcontroller based ICT Project', cr: 3.0, type: 'compulsory' }
      ]},
      s3: { label: 'Semester 3', year: 'Year 2', mods: [
        { c: 'IN 2110', n: 'Fundamentals of Object Oriented Programming', cr: 3.0, type: 'compulsory' },
        { c: 'IN 2120', n: 'Web Programming', cr: 2.5, type: 'compulsory' },
        { c: 'IN 2201', n: 'Software Engineering', cr: 3.0, type: 'compulsory' },
        { c: 'IN 2211', n: 'Object Oriented Analysis and Design', cr: 2.5, type: 'compulsory' },
        { c: 'IS 2200', n: 'Principles of Marketing & Consumer Solutions', cr: 2.5, type: 'compulsory' },
        { c: 'IS 2240', n: 'Fundamentals of Accounting and Finance', cr: 2.5, type: 'compulsory' },
        { c: 'CM 2121', n: 'Foundation of Mathematical Methods', cr: 2.5, type: 'compulsory' }
      ]},
      s4: { label: 'Semester 4', year: 'Year 2', mods: [
        { c: 'IN 2610', n: 'Graphic Design and Development', cr: 2.5, type: 'compulsory' },
        { c: 'IN 2410', n: 'Database Systems', cr: 2.5, type: 'compulsory' },
        { c: 'IN 2301', n: 'Essentials of Computer Organization & Architecture', cr: 2.5, type: 'compulsory' },
        { c: 'IN 2121', n: 'Data Structures and Algorithms I', cr: 2.5, type: 'compulsory' },
        { c: 'IS 2310', n: 'Essentials of Business Law and Taxation', cr: 2.0, type: 'compulsory' },
        { c: 'IS 2230', n: 'Economic Applications in Business', cr: 2.5, type: 'compulsory' },
        { c: 'CM 2111', n: 'Statistical Inference', cr: 2.5, type: 'compulsory' },
        { c: 'IS 2901', n: 'Software Development Project', cr: 4.0, type: 'compulsory' }
      ]},
      s5: { label: 'Semester 5', year: 'Year 3', mods: [
        { c: 'IN 3311', n: 'Operating Systems', cr: 2.5, type: 'compulsory' },
        { c: 'IN 3530', n: 'Data Communication & Computer Networks', cr: 2.5, type: 'compulsory' },
        { c: 'CM 3311', n: 'Artificial Intelligence', cr: 2.5, type: 'compulsory' },
        { c: 'CM 3211', n: 'Automata Theory', cr: 2.5, type: 'compulsory' },
        { c: 'IS 3610', n: 'Management Information Systems', cr: 2.5, type: 'compulsory' },
        { c: 'IS 3920', n: 'Individual Project on Business Solutions', cr: 2.5, type: 'compulsory' },
        { c: 'IS 3700', n: 'IT Project Management', cr: 2.5, type: 'compulsory' },
        { c: 'IS 3011', n: 'Communication Skills and Professional Conduct', cr: 2.0, type: 'ngpa' }
      ]},
      s6: { label: 'Semester 6', year: 'Year 3', mods: [
        { c: 'IS 3001', n: 'Scientific Communication', cr: 2.5, type: 'compulsory' },
        { c: 'IS 3500', n: 'Research Methodology', cr: 2.0, type: 'compulsory' },
        { c: 'IS 3000', n: 'Industrial Training', cr: 6.0, type: 'ngpa' }
      ]},
      s7: { label: 'Semester 7 & 8', year: 'Year 4', mods: [
        { c: 'IS 4650', n: 'Software Management', cr: 2.5, type: 'compulsory' },
        { c: 'IS 4600', n: 'IT Quality Assurance', cr: 2.5, type: 'compulsory' },
        { c: 'IS 4440', n: 'Professional Practice', cr: 2.5, type: 'compulsory' },
        { c: 'IS 4660', n: 'Corporate Information Security Management', cr: 2.5, type: 'compulsory' },
        { c: 'IS 4990', n: 'Comprehensive Group Project', cr: 10.0, type: 'compulsory' }
      ]}
    })
  }
];

// GET ALL CURRICULA
router.get('/', async (req, res) => {
  try {
    let list = await prisma.curriculum.findMany({ orderBy: { createdAt: 'asc' } });
    if (list.length === 0) {
      // Seed default
      for (const item of DEFAULT_CURRICULA_SEED) {
        await prisma.curriculum.create({ data: item });
      }
      list = await prisma.curriculum.findMany({ orderBy: { createdAt: 'asc' } });
    }

    const formatted = list.map(c => ({
      ...c,
      gradeScale: typeof c.gradeScale === 'string' ? JSON.parse(c.gradeScale) : c.gradeScale,
      classifications: typeof c.classifications === 'string' ? JSON.parse(c.classifications) : c.classifications,
      semesters: typeof c.structure === 'string' ? JSON.parse(c.structure) : c.structure
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Fetch curricula error:', err);
    res.status(500).json({ error: 'Server error fetching curricula.' });
  }
});

// CREATE CUSTOM CURRICULUM
router.post('/', async (req, res) => {
  try {
    const { title, institution, semestersCount, totalCredits, gradeScale, classifications, semesters } = req.body;
    if (!title || !institution || !semesters) {
      return res.status(400).json({ error: 'Title, institution, and semesters structure are required.' });
    }

    const created = await prisma.curriculum.create({
      data: {
        title,
        institution,
        semestersCount: parseInt(semestersCount, 10) || 6,
        totalCredits: parseFloat(totalCredits) || 120,
        gradeScale: JSON.stringify(gradeScale || {}),
        classifications: JSON.stringify(classifications || []),
        structure: JSON.stringify(semesters || {}),
        isPrebuilt: false
      }
    });

    res.json({
      ...created,
      gradeScale: JSON.parse(created.gradeScale),
      classifications: JSON.parse(created.classifications),
      semesters: JSON.parse(created.structure)
    });
  } catch (err) {
    console.error('Create curriculum error:', err);
    res.status(500).json({ error: 'Server error creating curriculum.' });
  }
});

// DELETE CURRICULUM
router.delete('/:id', async (req, res) => {
  try {
    await prisma.curriculum.delete({ where: { id: req.params.id } });
    res.json({ message: 'Curriculum deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error deleting curriculum.' });
  }
});

module.exports = router;
