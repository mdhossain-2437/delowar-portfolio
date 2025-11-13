import { motion } from "framer-motion";
import webDevWarriorImg from "@assets/generated_images/WebDevWarrior_learning_platform_mockup_71691340.png";
import messengerImg from "@assets/generated_images/Kothopokothon_Messenger_chat_interface_1d2bf312.png";
import recipeBookImg from "@assets/generated_images/Recipe_Book_App_interface_81a207ad.png";
import eventExplorerImg from "@assets/generated_images/Event_Explorer_platform_interface_526a19c7.png";
import ticTacToeImg from "@assets/generated_images/Tic_Tac_Toe_game_interface_10607dc2.png";
import vsCodeThemeImg from "@assets/generated_images/VS_Code_theme_mockup_94c58955.png";
import aiAgentImg from "@assets/generated_images/AI_Coding_Agent_visualization_292c3380.png";

export default function ProjectMosaicGallery() {
  const mosaicImages = [
    { src: webDevWarriorImg, title: "WebDevWarrior", span: "col-span-2 row-span-2" },
    { src: messengerImg, title: "Kothopokothon Messenger", span: "col-span-1 row-span-1" },
    { src: recipeBookImg, title: "Recipe Book App", span: "col-span-1 row-span-1" },
    { src: eventExplorerImg, title: "Event Explorer", span: "col-span-1 row-span-2" },
    { src: ticTacToeImg, title: "Tic Tac Toe Pro", span: "col-span-1 row-span-1" },
    { src: vsCodeThemeImg, title: "VS Code Theme", span: "col-span-2 row-span-1" },
    { src: aiAgentImg, title: "AI Coding Agent", span: "col-span-1 row-span-1" },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background to-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Project Gallery
            </span>
          </h2>

          <div className="grid grid-cols-4 auto-rows-[200px] gap-4">
            {mosaicImages.map((image, index) => (
              <motion.div
                key={image.title}
                className={`${image.span} group relative overflow-hidden rounded-lg cursor-pointer`}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white font-semibold text-lg">{image.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
