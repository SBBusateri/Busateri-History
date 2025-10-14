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
            Giuseppe (Joseph) and Ninfa Pusateri's journey began in Saint Agnes, Sicily—today known as the seaside town of Sant'Agata di Militello, nestled along Sicily's northern coast in the Metropolitan City of Messina. At the turn of the 20th century, and at only 20 years old, they looked toward America for a better life. Giuseppe (Joseph) left first in 1901, departing from Napoli aboard the S.S. Washington. After weeks aboard a crowded steamship, he arrived at the Port of New York through Ellis Island, with his destination listed as Milwaukee, Wisconsin.
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