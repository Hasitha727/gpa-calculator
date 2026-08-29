const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET ALL STUDENTS (with Curriculum and Grades included)
router.get('/', async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      include: {
        curriculum: true,
        grades: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = students.map(s => {
      const gradeMap = {};
      s.grades.forEach(g => { gradeMap[g.moduleCode] = g.gradeVal; });
      return {
        id: s.id,
        first: s.firstName,
        last: s.lastName,
        studentId: s.studentId,
        intake: s.intakeYear,
        email: s.email,
        phone: s.phone,
        curriculumId: s.curriculumId,
        grades: gradeMap
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error('Fetch students error:', err);
    res.status(500).json({ error: 'Server error fetching students.' });
  }
});

// REGISTER NEW STUDENT
router.post('/', async (req, res) => {
  try {
    const { first, last, studentId, intake, curriculumId, email, phone } = req.body;
    if (!first || !last || !studentId || !intake || !curriculumId) {
      return res.status(400).json({ error: 'Missing required student fields.' });
    }

    const existing = await prisma.student.findUnique({ where: { studentId } });
    if (existing) {
      return res.status(400).json({ error: 'Student ID already exists.' });
    }

    const created = await prisma.student.create({
      data: {
        firstName: first,
        lastName: last,
        studentId,
        intakeYear: parseInt(intake, 10),
        curriculumId,
        email: email || null,
        phone: phone || null
      }
    });

    res.json({
      id: created.id,
      first: created.firstName,
      last: created.lastName,
      studentId: created.studentId,
      intake: created.intakeYear,
      curriculumId: created.curriculumId,
      email: created.email,
      phone: created.phone,
      grades: {}
    });
  } catch (err) {
    console.error('Create student error:', err);
    res.status(500).json({ error: 'Server error registering student.' });
  }
});

// UPDATE STUDENT INFO
router.put('/:id', async (req, res) => {
  try {
    const { first, last, studentId, intake, curriculumId, email, phone } = req.body;
    const updated = await prisma.student.update({
      where: { id: req.params.id },
      data: {
        firstName: first,
        lastName: last,
        studentId,
        intakeYear: parseInt(intake, 10),
        curriculumId,
        email,
        phone
      }
    });

    res.json({
      id: updated.id,
      first: updated.firstName,
      last: updated.lastName,
      studentId: updated.studentId,
      intake: updated.intakeYear,
      curriculumId: updated.curriculumId,
      email: updated.email,
      phone: updated.phone
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error updating student.' });
  }
});

// DELETE STUDENT
router.delete('/:id', async (req, res) => {
  try {
    await prisma.student.delete({ where: { id: req.params.id } });
    res.json({ message: 'Student deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error deleting student.' });
  }
});

module.exports = router;
