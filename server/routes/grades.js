const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// UPDATE / UPSERT A GRADE FOR A STUDENT MODULE
router.post('/update', async (req, res) => {
  try {
    const { studentId, moduleCode, gradeVal } = req.body;
    if (!studentId || !moduleCode) {
      return res.status(400).json({ error: 'Student ID and Module Code are required.' });
    }

    if (gradeVal === '—' || !gradeVal) {
      // Delete grade if reset
      await prisma.grade.deleteMany({
        where: { studentId, moduleCode }
      });
      return res.json({ message: 'Grade cleared.', studentId, moduleCode, gradeVal: '—' });
    }

    const upserted = await prisma.grade.upsert({
      where: {
        studentId_moduleCode: { studentId, moduleCode }
      },
      update: { gradeVal },
      create: { studentId, moduleCode, gradeVal }
    });

    res.json(upserted);
  } catch (err) {
    console.error('Update grade error:', err);
    res.status(500).json({ error: 'Server error saving grade.' });
  }
});

module.exports = router;
