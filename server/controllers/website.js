const pins = [
  {
    id: 9,
    title: "Cozy Winter Cabin",
    description: "A peaceful getaway surrounded by snowy pine trees",
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=400&q=80",
    user: "Wanderer",
    userAvatar: "https://ui-avatars.com/api/?name=Wanderer",
    likes: 324,
    comments: 55,
    tags: ["travel", "winter", "cabin"],
  },
  {
    id: 10,
    title: "Street Food Adventures",
    description: "Exploring flavors from night markets around the world",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80",
    user: "FoodieExplorer",
    userAvatar: "https://ui-avatars.com/api/?name=Foodie+Explorer",
    likes: 412,
    comments: 63,
    tags: ["food", "travel", "culture"],
  },
  {
    id: 11,
    title: "Beach Vibes",
    description: "Relaxing on a tropical beach with turquoise waters",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
    user: "SunChaser",
    userAvatar: "https://ui-avatars.com/api/?name=Sun+Chaser",
    likes: 298,
    comments: 30,
    tags: ["beach", "relax", "vacation"],
  },
  {
    id: 12,
    title: "Coding Setup Goals",
    description: "Sleek dual monitor desk setup with ambient lighting",
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=400&q=80",
    user: "DevLife",
    userAvatar: "https://ui-avatars.com/api/?name=Dev+Life",
    likes: 521,
    comments: 76,
    tags: ["coding", "setup", "tech"],
  },
  {
    id: 13,
    title: "Minimalist Architecture",
    description: "Clean lines and modern aesthetic homes",
    image:
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=400&q=80",
    user: "ArchVision",
    userAvatar: "https://ui-avatars.com/api/?name=Arch+Vision",
    likes: 183,
    comments: 18,
    tags: ["architecture", "design", "minimal"],
  },
  {
    id: 14,
    title: "Wildlife Photography",
    description: "Capturing animals in their natural habitat",
    image:
      "https://images.unsplash.com/photo-1551334787-21e6bd3ab135?auto=format&fit=crop&w=400&q=80",
    user: "NatureSnaps",
    userAvatar: "https://ui-avatars.com/api/?name=Nature+Snaps",
    likes: 345,
    comments: 47,
    tags: ["wildlife", "animals", "nature"],
  },
  {
    id: 15,
    title: "Fitness Motivation",
    description: "Push yourself, because no one else is going to do it for you",
    image:
      "https://images.unsplash.com/photo-1571019613914-85f342c35f3b?auto=format&fit=crop&w=400&q=80",
    user: "FitVibes",
    userAvatar: "https://ui-avatars.com/api/?name=Fit+Vibes",
    likes: 390,
    comments: 33,
    tags: ["fitness", "motivation", "gym"],
  },
];

exports.getPins = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: pins,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
