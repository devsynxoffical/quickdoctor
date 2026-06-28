import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { homePageSections } from '../src/lib/pageTemplates';

dotenv.config();

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const categories = [
  { name: 'General Practitioner', slug: 'general-practitioner', sortOrder: 1 },
  { name: 'Dermatology', slug: 'dermatology', sortOrder: 2 },
  { name: 'Mental Health', slug: 'mental-health', sortOrder: 3 },
  { name: 'Women\'s Health', slug: 'womens-health', sortOrder: 4 },
  { name: 'Men\'s Health', slug: 'mens-health', sortOrder: 5 },
];

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 12);

  for (const cat of categories) {
    await prisma.specialtyCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, sortOrder: cat.sortOrder, isActive: true },
      create: { ...cat, description: `${cat.name} consultations`, isActive: true },
    });
  }

  const gp = await prisma.specialtyCategory.findUnique({
    where: { slug: 'general-practitioner' },
  });

  await prisma.user.upsert({
    where: { email: 'admin@quickdoctor.com' },
    update: { isActive: true },
    create: {
      email: 'admin@quickdoctor.com',
      password: hashedPassword,
      role: 'ADMIN',
      isActive: true,
    },
  });

  const doctorUser = await prisma.user.upsert({
    where: { email: 'doctor@quickdoctor.com' },
    update: { isActive: true, role: 'DOCTOR' },
    create: {
      email: 'doctor@quickdoctor.com',
      password: hashedPassword,
      role: 'DOCTOR',
      isActive: true,
    },
  });

  const doctor = await prisma.doctor.upsert({
    where: { userId: doctorUser.id },
    update: {
      status: 'APPROVED',
      profileComplete: true,
      consultationFeeCents: 4900,
      specialtyCategoryId: gp?.id,
      specialization: 'General Practitioner',
    },
    create: {
      userId: doctorUser.id,
      firstName: 'Sarah',
      lastName: 'Johnson',
      specialization: 'General Practitioner',
      licenseNumber: 'IMC-123456',
      specialtyCategoryId: gp?.id!,
      status: 'APPROVED',
      profileComplete: true,
      consultationFeeCents: 4900,
      bio: 'Experienced GP available for video consultations.',
    },
  });

  await prisma.doctorApplication.upsert({
    where: { userId: doctorUser.id },
    update: { status: 'APPROVED' },
    create: {
      userId: doctorUser.id,
      specialtyCategoryId: gp!.id,
      licenseNumber: 'IMC-123456',
      status: 'APPROVED',
      bio: 'Seed doctor application',
    },
  });

  for (let day = 1; day <= 5; day++) {
    await prisma.doctorAvailability.upsert({
      where: { doctorId_dayOfWeek: { doctorId: doctor.id, dayOfWeek: day } },
      update: { startTime: '09:00', endTime: '17:00', slotMinutes: 15 },
      create: {
        doctorId: doctor.id,
        dayOfWeek: day,
        startTime: '09:00',
        endTime: '17:00',
        slotMinutes: 15,
      },
    });
  }

  await prisma.doctorService.upsert({
    where: { doctorId_type: { doctorId: doctor.id, type: 'VIDEO_CONSULTATION' } },
    update: { priceCents: 4900, isActive: true },
    create: {
      doctorId: doctor.id,
      type: 'VIDEO_CONSULTATION',
      priceCents: 4900,
      durationMinutes: 15,
    },
  });

  const patientUser = await prisma.user.upsert({
    where: { email: 'patient@quickdoctor.com' },
    update: { isActive: true },
    create: {
      email: 'patient@quickdoctor.com',
      password: hashedPassword,
      role: 'PATIENT',
      isActive: true,
      patient: {
        create: {
          firstName: 'Alex',
          lastName: 'Demo',
          dob: new Date('1990-06-15'),
          phone: '+353800000000',
        },
      },
    },
    include: { patient: true },
  });

  const patientId = patientUser.patient?.id;
  if (patientId) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    const existing = await prisma.appointment.findFirst({
      where: { patientId, doctorId: doctor.id, dateTime: tomorrow },
    });

    if (!existing) {
      const appt = await prisma.appointment.create({
        data: {
          patientId,
          doctorId: doctor.id,
          dateTime: tomorrow,
          status: 'CONFIRMED',
          notes: 'Seed confirmed appointment',
          priceCents: 4900,
        },
      });
      await prisma.payment.create({
        data: {
          appointmentId: appt.id,
          amountCents: 4900,
          currency: 'EUR',
          status: 'SUCCEEDED',
          paidAt: new Date(),
        },
      });

      await prisma.appointment.update({
        where: { id: appt.id },
        data: {
          zoomMeetingId: `dev-${appt.id.slice(0, 8)}`,
          zoomJoinUrlPatient: 'http://localhost:3000/dashboard/appointments',
          zoomJoinUrlHost: `http://localhost:3000/doctor/consultations/${appt.id}`,
          zoomPassword: 'dev123',
        },
      });
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(14, 0, 0, 0);

    const completed = await prisma.appointment.upsert({
      where: {
        doctorId_dateTime: { doctorId: doctor.id, dateTime: yesterday },
      },
      create: {
        patientId,
        doctorId: doctor.id,
        dateTime: yesterday,
        status: 'COMPLETED',
        notes: 'Seed completed visit',
        priceCents: 4900,
      },
      update: { status: 'COMPLETED' },
    });

    await prisma.review.upsert({
      where: { appointmentId: completed.id },
      create: {
        appointmentId: completed.id,
        patientId,
        doctorId: doctor.id,
        rating: 5,
        comment: 'Excellent video consultation — very helpful.',
      },
      update: { rating: 5 },
    });
  }

  const homePage = await prisma.cmsPage.upsert({
    where: { slug: 'home' },
    update: { status: 'PUBLISHED', publishedAt: new Date() },
    create: {
      slug: 'home',
      title: 'QuickDoctor Home',
      pageType: 'PAGE',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      seoTitle: 'QuickDoctor — Online GP',
      seoDescription: 'Book video consultations with licensed doctors.',
    },
  });

  await prisma.cmsSection.deleteMany({ where: { pageId: homePage.id } });
  await prisma.cmsSection.createMany({
    data: homePageSections().map((s, i) => ({
      pageId: homePage.id,
      type: s.type as 'HERO' | 'STATS' | 'APPOINTMENTS' | 'FEATURES' | 'JOURNEY' | 'SECURITY' | 'CTA',
      sortOrder: s.sortOrder ?? i,
      contentJson: s.contentJson,
    })),
  });

  await prisma.cmsPage.upsert({
    where: { slug: 'blog-welcome' },
    update: { status: 'PUBLISHED' },
    create: {
      slug: 'blog-welcome',
      title: 'Welcome to QuickDoctor Blog',
      pageType: 'BLOG_POST',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      seoDescription: 'Updates from our medical team.',
      sections: {
        create: [
          {
            type: 'HERO',
            sortOrder: 0,
            contentJson: {
              excerpt: 'Learn how telemedicine is changing access to care.',
              author: 'Dr. Sarah Johnson',
            },
          },
          {
            type: 'TEXT',
            sortOrder: 1,
            contentJson: {
              body: 'We are excited to bring licensed doctors to your screen with secure video consultations.',
            },
          },
        ],
      },
    },
  });

  await prisma.cmsNavigation.deleteMany({});
  await prisma.cmsNavigation.createMany({
    data: [
      { label: 'Find a doctor', href: '/doctors', sortOrder: 0, location: 'header' },
      { label: 'Blog', href: '/blog', sortOrder: 1, location: 'header' },
      { label: 'Become a doctor', href: '/doctor/apply', sortOrder: 2, location: 'header' },
      { label: 'Contact', href: '/contact', sortOrder: 3, location: 'header' },
    ],
  });

  await prisma.cmsSiteSetting.upsert({
    where: { key: 'site' },
    update: { value: { name: 'QuickDoctor', contactEmail: 'support@quickdoctor.com' } },
    create: {
      key: 'site',
      value: { name: 'QuickDoctor', contactEmail: 'support@quickdoctor.com', footerText: '© QuickDoctor' },
    },
  });

  console.log('Seed complete.');
  console.log('  admin@quickdoctor.com / doctor@quickdoctor.com / patient@quickdoctor.com');
  console.log('  password: password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
