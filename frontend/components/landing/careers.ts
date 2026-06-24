export type Career = {
  id: string;
  title: string;
  description: string;
};

export const careers: Career[] = [
  {
    id: "startup-founder",
    title: "Startup Founder",
    description:
      "Build and scale a startup while balancing product vision, team dynamics, investor pressure, and technical execution.",
  },

  {
    id: "doctor",
    title: "Doctor",
    description:
      "Diagnose patients, make critical decisions under pressure, and navigate the realities of modern healthcare.",
  },

  {
    id: "lawyer",
    title: "Lawyer",
    description:
      "Argue cases, negotiate outcomes, manage clients, and survive the politics of the legal profession.",
  },
];