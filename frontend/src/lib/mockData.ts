export const carouselImages = [
    {
        src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80",
        alt: "Ancient stone pathway through heritage district",
        caption: "Walk through centuries of history",
    },
    {
        src: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1920&q=80",
        alt: "Local market street with traditional architecture",
        caption: "Discover local life & culture",
    },
    {
        src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80",
        alt: "Traditional local cuisine",
        caption: "Savor authentic flavors",
    },
    {
        src: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&q=80",
        alt: "Scenic walking path through old town",
        caption: "Every path tells a story",
    },
];

export const themeOptions = [
    {
        id: "heritage",
        name: "Heritage",
        description: "Ancient monuments, historic buildings, and stories from the past",
        icon: "heritage" as const,
    },
    {
        id: "local",
        name: "Local Life",
        description: "Authentic neighborhoods, local markets, and everyday culture",
        icon: "local" as const,
    },
    {
        id: "food",
        name: "Food",
        description: "Traditional eateries, street food, and culinary traditions",
        icon: "food" as const,
    },
];

export const sampleRoute = {
    startPoint: "Jama Masjid",
    endPoint: "Red Fort",
    theme: "Heritage & Local Life",
    totalStops: 4,
    duration: "~2 hrs",
    difficulty: "Easy walk",
    description:
        "A gentle journey through Old Delhi's most cherished landmarks, winding through narrow lanes where centuries of history come alive in every corner.",
    stops: [
        {
            number: 1,
            name: "Jama Masjid",
            description:
                "Begin at one of India's largest mosques, built by Shah Jahan in the 17th century. The red sandstone and white marble structure offers a serene start to your journey, with panoramic views of Old Delhi from its minarets.",
            timeNote: "30-45 minutes",
            interactionType: "explore" as const,
        },
        {
            number: 2,
            name: "Chandni Chowk",
            description:
                "Walk through the bustling heart of Old Delhi. This 17th-century market was designed with a canal running through its center, now replaced by a vibrant pedestrian walkway lined with shops selling everything from spices to fabrics.",
            timeNote: "20-30 minutes stroll",
            interactionType: "walk-by" as const,
        },
        {
            number: 3,
            name: "Paranthe Wali Gali",
            description:
                "A narrow lane famous for its century-old parantha shops. This is where generations of families have perfected the art of stuffed flatbreads, served with tangy chutneys and creamy curries.",
            timeNote: "15-20 minutes (snack stop)",
            interactionType: "stop" as const,
        },
        {
            number: 4,
            name: "Red Fort",
            description:
                "Conclude your walk at the majestic Red Fort, the former residence of Mughal emperors for nearly 200 years. The massive red sandstone walls and intricate interior palaces tell stories of an empire's grandeur.",
            timeNote: "45-60 minutes",
            interactionType: "explore" as const,
        },
    ],
};

export const popularDestinations = [
    { name: "Old Delhi", region: "Delhi, India" },
    { name: "Varanasi Ghats", region: "Uttar Pradesh, India" },
    { name: "Pondicherry", region: "Tamil Nadu, India" },
    { name: "Fort Kochi", region: "Kerala, India" },
    { name: "Jaisalmer", region: "Rajasthan, India" },
];
