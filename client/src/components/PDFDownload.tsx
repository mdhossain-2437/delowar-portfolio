import { motion } from "framer-motion";
import jsPDF from "jspdf";
import coverArt from "@assets/generated_images/Portfolio_PDF_cover_art_c7115677.png";

export default function PDFDownload() {
  const generatePDF = async () => {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const img = new Image();
    img.src = coverArt;
    
    await new Promise((resolve) => {
      img.onload = resolve;
    });

    const imgWidth = pageWidth;
    const imgHeight = (img.height * imgWidth) / img.width;
    pdf.addImage(img, 'PNG', 0, 0, imgWidth, Math.min(imgHeight, pageHeight / 2));

    pdf.setFontSize(24);
    pdf.setTextColor(147, 51, 234);
    pdf.text('MD DELOWAR HOSSAIN', pageWidth / 2, imgHeight + 20, { align: 'center' });

    pdf.setFontSize(14);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Web Developer & AI Learner', pageWidth / 2, imgHeight + 30, { align: 'center' });

    pdf.setFontSize(10);
    pdf.setTextColor(60, 60, 60);
    
    const aboutY = imgHeight + 45;
    pdf.setFont('helvetica', 'bold');
    pdf.text('About', 20, aboutY);
    pdf.setFont('helvetica', 'normal');
    const aboutText = 'I build web applications, design intuitive UI/UX, and experiment with AI/ML to create meaningful solutions. Self-taught developer driven by curiosity and passion for technology.';
    const aboutLines = pdf.splitTextToSize(aboutText, pageWidth - 40);
    pdf.text(aboutLines, 20, aboutY + 7);

    const skillsY = aboutY + 7 + (aboutLines.length * 5) + 10;
    pdf.setFont('helvetica', 'bold');
    pdf.text('Skills', 20, skillsY);
    pdf.setFont('helvetica', 'normal');
    pdf.text('React, Node.js, MongoDB, TypeScript, Tailwind CSS', 20, skillsY + 7);
    pdf.text('Firebase, Express.js, AI/ML, Python, LangChain', 20, skillsY + 12);

    const projectsY = skillsY + 25;
    pdf.setFont('helvetica', 'bold');
    pdf.text('Featured Projects', 20, projectsY);
    pdf.setFont('helvetica', 'normal');
    
    const projects = [
      'WebDevWarrior - MERN stack learning platform',
      'Kothopokothon Messenger - Real-time chat with E2E encryption',
      'Recipe Book App - Full-stack recipe management',
      'AI Coding Agent - Intelligent developer assistant (WIP)'
    ];
    
    projects.forEach((project, index) => {
      pdf.text(`• ${project}`, 20, projectsY + 7 + (index * 5));
    });

    const contactY = projectsY + 7 + (projects.length * 5) + 10;
    pdf.setFont('helvetica', 'bold');
    pdf.text('Contact', 20, contactY);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Email: mdhossain2437@gmail.com', 20, contactY + 7);
    pdf.text('Phone: +8801315123134', 20, contactY + 12);
    pdf.text('GitHub: github.com/mdhossain-2437', 20, contactY + 17);

    pdf.setFontSize(8);
    pdf.setTextColor(120, 120, 120);
    pdf.text('Generated from portfolio', pageWidth / 2, pageHeight - 10, { align: 'center' });

    pdf.save('Delowar-Hossain-Portfolio.pdf');
  };

  return (
    <motion.div
      className="flex justify-center py-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <button
        onClick={generatePDF}
        className="group relative px-8 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105"
        data-testid="button-download-pdf"
      >
        <span className="flex items-center gap-3">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Download One-Pager PDF
        </span>
      </button>
    </motion.div>
  );
}
