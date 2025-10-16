import FamilyPic from "../assets/FamilyPic.jpg";

const FoundingGenInfo = () => {
  return (
    <div className="space-y-6">
      <div className="bg-card p-8 rounded-lg vintage-shadow text-center">
        <div className="flex justify-center mb-8">
          <img
            src={FamilyPic}
            alt="Giuseppe and Ninfa Busateri Family"
            className="rounded-xl shadow-md max-w-md w-full object-cover border border-border"
          />
        </div>
        <div className="prose prose-lg max-w-none text-foreground">
          <p className="mb-4 text-muted-foreground leading-relaxed">
          Giuseppe (Joseph) and Ninfa “Miceli” Pusateri were both born in Saint Agnes, Sicily—known today as the seaside town of Sant’Agata di Militello, nestled along Sicily’s northern coast in the Metropolitan City of Messina. Giuseppe (Joseph) was the son of Salvatore Pusateri and Grazia “Brusciarella” Pusateri, while Ninfa was born to Biagio Miceli and Teresa “Cancemi” Miceli. The two were married on December 23, 1899, when Giuseppe was 19 and Ninfa 17.
          </p>
          <p className="mb-4 text-muted-foreground leading-relaxed">
          At the dawn of the 20th century, the young couple looked toward America in search of a better life and work opportunities. Giuseppe (Joseph) along side with Ninfa's brother Salvatore Miceli set out first in 1901, departing from Napoli aboard the S.S. Washington. After enduring several weeks aboard a crowded steamship, they arrived at the Port of New York through Ellis Island, his destination marked as Milwaukee, Wisconsin—a city that would soon become home for generations of their family.
          </p>
          
          <p className="mb-4 text-muted-foreground leading-relaxed">
            Ninfa followed soon after, around 1905, braving the same ocean voyage to reunite with her husband. Together, they built a new life in Milwaukee—carrying with them their Sicilian faith, language, and traditions that would root the Busateri family's story in America. Giuseppe and Ninfa remained in and around Milwaukee, raising 15 children over 23 years. Giuseppe (Joseph) worked for the Wisconsin Transport Company for 44 years before retiring. He passed away in 1957, followed by Ninfa in 1968.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Their surname transitioned from Pusateri to Busateri sometime after their arrival, a change reflected in census records—Giuseppe (Joseph) signed "Pusateri" in 1910 and "Busateri" in 1920. (See document section for source references.)
          </p>
        </div>
      </div>
    </div>
  );
};

export default FoundingGenInfo;